import React from 'react';
import { View, Text } from 'react-native';
import { Input, Label, Required } from '../../components/Styles';
import { Controller } from 'react-hook-form';

const FormField = ({
  control,
  name,
  label,
  required = false,
  placeholder,
  keyboardType = 'default',
  maxLength,
  editable = true,
  style = {},
  error,
  mask = null,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'sentences'
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
          <Input
            width="95%"
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            keyboardType={keyboardType}
            maxLength={maxLength}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            autoCapitalize={autoCapitalize}
            style={[
              {
                color: editable ? '#121212' : '#ddd',
                borderColor: error ? '#ff375b' : '#ddd',
                backgroundColor: editable ? '#fff' : '#f8f9fa'
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

export default FormField;

