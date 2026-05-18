import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Masks } from 'react-native-mask-input';
import { Ionicons } from '@expo/vector-icons'; 
import ProfileInput from '@/components/ProfileInput';
import { useSQLiteContext } from 'expo-sqlite';

interface FormState {
  cpf: string;
  birthdate: string;
  nis: string;
  cep: string;
  income: string;
  children: string | null;
  pregnant: string | null;
  elderly: string | null;
  disabled: string | null;
  hasPublicSchoolStudent: boolean;
  hasSingleParent: boolean;
  hasAppDeliveryWorker: boolean;
  hasRuralWorker: boolean;
  hasQuilombola: boolean;
}

export default function Profile() {
  const db = useSQLiteContext();
  const [form, setForm] = useState<FormState>({
    cpf: '',
    birthdate: '',
    nis: '',
    cep: '',
    income: '',
    children: null,
    pregnant: null,
    elderly: null,
    disabled: null,
    hasPublicSchoolStudent: false,
    hasSingleParent: false,
    hasAppDeliveryWorker: false,
    hasRuralWorker: false,
    hasQuilombola: false,
  });

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await db.getFirstAsync<any>('SELECT * FROM users WHERE user_id = 1');
        
        if (user) {
          setForm(prev => ({
            ...prev,
            birthdate: user.birthdate ? user.birthdate.toString() : '',
            cpf: user.cpf || '',
            nis: user.nis || '',
            cep: user.cep || '',
            income: user.house_income ? user.house_income.toString() : '',
            children: user.house_count_kids ? (user.house_count_kids >= 4 ? '4+' : String(user.house_count_kids)) : null,
            pregnant: user.house_count_pregnant ? (user.house_count_pregnant >= 4 ? '4+' : String(user.house_count_pregnant)) : null,
            elderly: user.house_count_elderly ? (user.house_count_elderly >= 4 ? '4+' : String(user.house_count_elderly)) : null,
            disabled: user.house_count_disability ? (user.house_count_disability >= 4 ? '4+' : String(user.house_count_disability)) : null,
            hasPublicSchoolStudent: Boolean(user.has_public_school_student),
            hasAppDeliveryWorker: Boolean(user.has_app_delivery_worker),
            hasRuralWorker: Boolean(user.has_rural_worker),
            hasQuilombola: Boolean(user.has_quilombola),
            hasSingleParent: Boolean(user.has_single_parent),
          }));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    }
    loadUserData();
  }, [db]);

  const updateField = (field: keyof FormState, value: any) => {
    setForm({ ...form, [field]: value });
  };

  // --- 2. SAVE MVP USER DATA ---
  const handleSave = async () => {
    try {
      // Data Parsers for SQLite
      const parseCount = (val: string | null) => val ? parseInt(val.replace('+', ''), 10) : 0;
      const parseIncome = (val: string) => parseInt(val.replace(/\D/g, ''), 10) || 0; // Strips formatting
      const parseBool = (val: boolean) => val ? 1 : 0;
      
      // Parse birthdate from DD/MM/YYYY to an Integer (e.g., 19900525) for DB
      const dateParts = form.birthdate.split('/');
      const birthdateInt = dateParts.length === 3 
        ? parseInt(`${dateParts[2]}${dateParts[1]}${dateParts[0]}`, 10) 
        : 0; // Default to 0 to satisfy NOT NULL constraint

      await db.runAsync(`
        INSERT OR REPLACE INTO users (
          user_id, user_name, birthdate, cpf, cep, nis, house_income, 
          house_count_kids, house_count_pregnant, house_count_elderly, house_count_disability,
          has_public_school_student, has_app_delivery_worker, has_rural_worker, has_quilombola, has_single_parent
        ) VALUES (
          1, 'MVP_User', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `, [
        birthdateInt, form.cpf, form.cep, form.nis, parseIncome(form.income),
        parseCount(form.children), parseCount(form.pregnant), parseCount(form.elderly), parseCount(form.disabled),
        parseBool(form.hasPublicSchoolStudent), parseBool(form.hasAppDeliveryWorker), 
        parseBool(form.hasRuralWorker), parseBool(form.hasQuilombola), parseBool(form.hasSingleParent)
      ]);

      Alert.alert("Sucesso!", "Seus dados foram salvos localmente.");
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  const CounterRow = ({ 
    label, 
    field 
  }: { 
    label: string; 
    field: 'children' | 'pregnant' | 'elderly' | 'disabled' 
  }) => (
    <View style={styles.counterRow}>
      <Text style={styles.counterLabel}>{label}</Text>
      <View style={styles.numberRow}>
        {[1, 2, 3, '4+'].map((num) => {
          const isSelected = form[field] === String(num);
          return (
            <TouchableOpacity 
              key={num} 
              style={[styles.circle, isSelected && styles.circleSelected]}
              onPress={() => updateField(field, isSelected ? null : String(num))}
            >
              <Text style={[styles.circleText, isSelected && styles.circleTextSelected]}>
                {num}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Ficha Técnica</Text>
      <Text style={styles.subtitle}>Seus dados são processados localmente.</Text>

      {/* --- IDENTIFICAÇÃO --- */}
      <Text style={styles.sectionTitle}>Identificação</Text>

      <ProfileInput 
        label="Qual é o seu CPF?" 
        value={form.cpf} 
        onChangeText={(v) => updateField('cpf', v)} 
        mask={Masks.BRL_CPF} 
        keyboardType="numeric" 
      />

      <ProfileInput 
        label="Quando você nasceu?" 
        value={form.birthdate} 
        onChangeText={(v) => updateField('birthdate', v)} 
        mask={Masks.DATE_DDMMYYYY} 
        keyboardType="numeric" 
      />

      <ProfileInput 
        label="Qual é o seu número NIS?" 
        value={form.nis} 
        onChangeText={(v) => updateField('nis', v)} 
        keyboardType="numeric" 
      />

      <ProfileInput 
        label="Qual é o seu CEP?" 
        value={form.cep} 
        onChangeText={(v) => updateField('cep', v)} 
        mask={Masks.ZIP_CODE} 
        keyboardType="numeric" 
      />

      {/* --- SOCIOECONÔMICO --- */}
      <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Socioeconômico</Text>

      <ProfileInput 
        label="Qual a renda mensal total da casa?" 
        prefix="R$"
        value={form.income} 
        onChangeText={(v) => updateField('income', v)} 
        mask={Masks.BRL_CURRENCY} 
        keyboardType="numeric" 
      />

      <TouchableOpacity 
        style={styles.checkboxInputContainer} 
        activeOpacity={0.7}
        onPress={() => updateField('hasPublicSchoolStudent', !form.hasPublicSchoolStudent)}
      >
        <Text style={styles.checkboxInputLabel}>Alguém da casa é estudante da rede pública?</Text>
        <Ionicons 
          name={form.hasPublicSchoolStudent ? "checkbox" : "square-outline"} 
          size={24} 
          color={form.hasPublicSchoolStudent ? "#fff" : "#444"} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.checkboxInputContainer} 
        activeOpacity={0.7}
        onPress={() => updateField('hasAppDeliveryWorker', !form.hasAppDeliveryWorker)}
      >
        <Text style={styles.checkboxInputLabel}>Alguém da casa dirige para aplicativo?</Text>
        <Ionicons 
          name={form.hasAppDeliveryWorker ? "checkbox" : "square-outline"} 
          size={24} 
          color={form.hasAppDeliveryWorker ? "#fff" : "#444"} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.checkboxInputContainer} 
        activeOpacity={0.7}
        onPress={() => updateField('hasRuralWorker', !form.hasRuralWorker)}
      >
        <Text style={styles.checkboxInputLabel}>Alguém da casa é trabalhador rural?</Text>
        <Ionicons 
          name={form.hasRuralWorker ? "checkbox" : "square-outline"} 
          size={24} 
          color={form.hasRuralWorker ? "#fff" : "#444"} 
        />
      </TouchableOpacity>

      <Text style={styles.demographicHeader}>Quantas pessoas moram na mesma casa?</Text>

      <CounterRow label="Crianças" field="children" />
      <CounterRow label="Gestantes" field="pregnant" />
      <CounterRow label="Idosos" field="elderly" />
      <CounterRow label="Com deficiência" field="disabled" />

      {/* --- SAVE BUTTON --- */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar Dados</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 25,
    paddingTop: 60,
    paddingBottom: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  demographicHeader: {
    color: '#fff',
    fontSize: 16,
    marginTop: 35,
    marginBottom: 15,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: 'transparent'
  },
  counterLabel: {
    fontSize: 16,
    color: '#aaa',
  },
  numberRow: {
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  circleSelected: {
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  circleText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
  },
  circleTextSelected: {
    color: '#000',
  },
  checkboxInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  checkboxInputLabel: {
    color: '#555',
    fontSize: 18,
    width: '90%',
  },
  saveButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 40,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  }
});