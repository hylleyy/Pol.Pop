import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaskInput, { Mask } from 'react-native-mask-input';

interface Props {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  mask?: Mask;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  prefix?: string;
}

export default function ProfileInput({ label, value, onChangeText, mask, keyboardType, prefix }: Props) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <MaskInput
          value={value}
          onChangeText={(masked, unmasked) => onChangeText(masked)}
          mask={mask}
          placeholder={label}
          placeholderTextColor="#555"
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginVertical: 10,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefix: {
    color: '#fff',
    fontSize: 18,
    marginRight: 5,
    fontWeight: 'bold',
  },
  input: {
    color: '#fff',
    fontSize: 18,
    paddingVertical: 8,
    flex: 1,
  },
});