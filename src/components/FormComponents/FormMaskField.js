import React from 'react';
import { View, Text } from 'react-native';
import { Label, Required } from '../../components/Styles';
import { Controller } from 'react-hook-form';
import { TextInputMask } from 'react-native-masked-text';

const FormMaskField = ({
  control,
  name,
  label,
  required = false,
  placeholder,
  mask,
  options = {},
  keyboardType = 'default',
  editable = true,
  error,
  style = {},
  autoCapitalize = 'characters'
}) => {
  return (
    <View style={{ marginBottom: 15 }}>
      <Label>
        {required && <Required>*</Required>}
        {label}:
      </Label>
      
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputMask
            type={'custom'}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            options={{
              mask: mask,
              ...options
            }}
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            editable={editable}
            autoCapitalize={autoCapitalize}
            style={[
              {
                backgroundColor: '#fff',
                fontSize: 18,
                borderWidth: 1,
                borderColor: error ? '#ff375b' : '#ddd',
                borderRadius: 8,
                width: '95%',
                padding: 12,
                paddingLeft: 16,
                color: editable ? '#121212' : '#ddd'
              },
              style
            ]}
          />
        )}
      />
      
      {error && (
        <Text style={{
          color: '#ff375b',
          fontSize: 12,
          marginTop: 4,
          marginLeft: 8
        }}>
          {error.message}
        </Text>
      )}
    </View>
  );
};

export default FormMaskField;

