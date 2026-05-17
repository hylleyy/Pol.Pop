import os
import sqlite3
import base64
import io
import requests
from PIL import Image, ImageOps
import frontmatter

DB_NAME : str = 'polpop_remote.db'

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
	print(f'found {len(files)} markdown files. Starting compilation…')

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
	generate_feed_table()
	generate_user_table()

	print('pre-baked database asset generated successfuly')