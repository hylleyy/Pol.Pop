import os
import sqlite3
import base64
import io
import requests
from PIL import Image, ImageOps
import frontmatter

DB_NAME : str = 'polpop_remote.db'

def generate_welfare_table() -> None:
	conn : sqlite3.Connection = sqlite3.connect(DB_NAME)
	cursor : sqlite3.Cursor = conn.cursor()

	cursor.execute('''
		CREATE TABLE IF NOT EXISTS welfare (
			benefit_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
			name TEXT NOT NULL,
			sphere INTEGER NOT NULL,
			provider TEXT,
			benefit_value TEXT,
			action_link TEXT,
			content TEXT,
			cover TEXT,

			-- parâmetros numéricos das regras

			max_income_per_capita INTEGER DEFAULT 999999,
			max_income_family INTEGER DEFAULT 999999,
			min_age_user INTEGER DEFAULT 0,
			max_child_age INTEGER DEFAULT 99,

			-- flags de obrigatoriedade (0 ou 1)

			needs_nis INTEGER DEFAULT 0,
			needs_single_parent INTEGER DEFAULT 0,
			needs_app_delivery_worker INTEGER DEFAULT 0,
			needs_rural_worker INTEGER DEFAULT 0,
			needs_public_school_student INTEGER DEFAULT 0,
			needs_quilombola INTEGER DEFAULT 0
		)
	''')

	cursor.execute('DELETE FROM welfare')

	if not os.path.exists('welfare'):
		print('error: welfare directory not found. Please create it and add your markdown files.')
		return

	files : list[str] = [file for file in os.listdir('welfare') if file.endswith('.md')]
	print(f'found {len(files)} welfare markdown files. Starting compilation…')

	for filename in files:
		filepath : str = os.path.join('welfare', filename)
		print(f'processing: {filename}…')

		benefit_data = frontmatter.load(filepath)

		b_id = benefit_data.get('id')
		name = benefit_data.get('name')
		sphere = benefit_data.get('sphere', 0)
		provider = benefit_data.get('provider', '')
		benefit_value = benefit_data.get('benefit_value', '')
		action_link = benefit_data.get('action_link', '')
		content = benefit_data.content
		rules = benefit_data.get('rules', {})

		cover_url = benefit_data.get('cover', '')
		print('downloading & resizing cover image (200x200)…')
		cver_b64 : str = image_url_to_base_64(cover_url, (200, 200))

		cursor.execute('''
			INSERT OR REPLACE INTO welfare (
				benefit_id, name, sphere, provider, benefit_value, action_link, content, cover,
				max_income_per_capita, max_income_family, min_age_user, max_child_age,
				needs_nis, needs_single_parent, needs_app_delivery_worker, 
				needs_rural_worker, needs_public_school_student, needs_quilombola
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		''', (
			b_id, name, sphere, provider, benefit_value, action_link, content, cver_b64,
			rules.get('max_income_per_capita', 999999),
			rules.get('max_income_family', 999999),
			rules.get('min_age_user', 0),
			rules.get('max_child_age', 99),
			rules.get('needs_nis', 0),
			rules.get('needs_single_parent', 0),
			rules.get('needs_app_delivery_worker', 0),
			rules.get('needs_rural_worker', 0),
			rules.get('needs_public_school_student', 0),
			rules.get('needs_quilombola', 0)
		))

	conn.commit()
	conn.close()


def generate_feed_table() -> None:
	conn : sqlite3.Connection = sqlite3.connect(DB_NAME)
	cursor : sqlite3.Cursor = conn.cursor()

	cursor.execute('''
		CREATE TABLE IF NOT EXISTS feed (
			id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
			author TEXT,
			article TEXT,
			profile TEXT,
			cover TEXT
		)
	''')

	cursor.execute('DELETE FROM feed')

	if not os.path.exists('feed'):
		print('error: feed directory not found. Please create it and add your markdown files.')
		return

	files : list[str] = [file for file in os.listdir('feed') if file.endswith('.md')]
	print(f'found {len(files)} feed markdown files. Starting compilation…')

	for filename in files:
		filepath : str = os.path.join('feed', filename)
		print(f'processing: {filename}…')

		post = frontmatter.load(filepath)

		author : str = post.get('author', '???')
		profile_url : str = post.get('profile', '')
		cover_url : str = post.get('cover', '')
		article_text : str = post.content.strip()

		print('downloading & resizing profile image (200x200)…')
		profile_b64 : str = image_url_to_base_64(profile_url, (200, 200))

		print('downloading & resizing profile image (720x720)…')
		cover_b64 : str = image_url_to_base_64(cover_url, (720, 720))

		cursor.execute('''
			INSERT INTO feed (author, article, profile, cover)
			VALUES (?, ?, ?, ?) 
		''', (author, article_text, profile_b64, cover_b64))

	conn.commit()
	conn.close()

def generate_user_table() -> None:
	conn : sqlite3.Connection = sqlite3.connect(DB_NAME)
	cursor : sqlite3.Cursor = conn.cursor()

	print('generating empty user info table')

	cursor.execute('''
		CREATE TABLE IF NOT EXISTS users (
			-- Dados obrigatórios

			user_id			INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
			user_name		TEXT NOT NULL UNIQUE,
			cpf				TEXT,
			birthdate		INTEGER NOT NULL,				-- data de nascimento do responsável

			-- Dados gerais

			cep				TEXT,							-- Extrai o estado a partir do CEP
			nis				TEXT,							-- Se é NULL, assume que não tem Cadastro Único
			ethnicity		INTEGER,						-- 0 = branco; 1 = preto; 2 = amarelo; 3 = pardo; 4 = indígena; 5 = não declarado
			house_income	INTEGER,

			-- Indicadores de Condição Social

			house_count_total			INTEGER DEFAULT 1,
			house_count_kids			INTEGER,
			house_count_pregnant		INTEGER,
			house_count_elderly			INTEGER,
			house_count_disability		INTEGER,
			house_count_ages			BLOB,				-- lista não ordenada de idades
			housing_status				INTEGER,			-- 0 = própria; 1 = alugada; 2 = ocupação/risco

			-- Indicadores de Vínculo/Perfil

			has_quilombola				INTEGER DEFAULT 0,
			has_single_parent			INTEGER DEFAULT 0,	-- Mães de Pernambuco?
			has_app_delivery_worker		INTEGER DEFAULT 0,	-- CNH Recife?
			has_rural_worker			INTEGER DEFAULT 0,	-- Chapéu de Palha?
			has_public_school_student	INTEGER DEFAULT 0	-- Pé de Meia?
		)
	''')

	cursor.execute('DELETE FROM users')

	conn.commit()
	conn.close()

def image_url_to_base_64(url, target_size) -> str:
	if not url: return ''

	if url.startswith('www.'): url = 'https://' + url

	try:
		response = requests.get(url, timeout=15)
		response.raise_for_status()

		img : Image = Image.open(io.BytesIO(response.content))
		
		if img.mode in ('RGBA', 'P'):
			img = img.convert('RGB')
		
		img = ImageOps.fit(img, target_size, method=Image.Resampling.LANCZOS)

		buffer : io.BytesIO = io.BytesIO()
		img.save(buffer, format='JPEG', quality=85)
		b64_string : bytes = base64.b64encode(buffer.getvalue()).decode('utf-8')

		return f'data:image/jpeg;base64,{b64_string}'
	except Exception as e:
		print('failed to process image ({url}): {e}')
	
	return ''

if __name__ == '__main__':
	generate_welfare_table()
	generate_feed_table()
	generate_user_table()

	print('pre-baked database asset generated successfuly')