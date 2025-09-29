import React from 'react';
import { View, Text } from 'react-native';
import { Label, Required } from '../../components/Styles';
import { Controller } from 'react-hook-form';
import { Select, CheckIcon } from 'native-base';

const FormSelect = ({
  control,
  name,
  label,
  required = false,
  placeholder,
  options = [],
  editable = true,
  error,
  onValueChange = null,
  style = {}
}) => {
  const handleValueChange = (itemValue, onChange) => {
    if (onValueChange) {
      onValueChange(itemValue, onChange);
    } else {
      onChange(options[itemValue]?.value || options[itemValue]?.label || itemValue);
    }
  };

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
          editable ? (
            <Select
              selectedValue={null}
              minWidth="90%"
              width="90%"
              accessibilityLabel={value}
              placeholderTextColor="#94A3B8"
              placeholder={placeholder}
              _selectedItem={{
                bg: "yellow.500",
                endIcon: <CheckIcon size="5" />,
              }}
              onValueChange={(itemValue) => handleValueChange(itemValue, onChange)}
              style={style}
            >
              {options.map((option, index) => (
                <Select.Item 
                  key={index} 
                  value={index} 
                  label={option.label || option.value || option.gender || option.degree} 
                />
              ))}
            </Select>
          ) : (
            <View style={{
              width: '90%',
              padding: 12,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              backgroundColor: '#f8f9fa'
            }}>
              <Text style={{ color: '#ddd', fontSize: 16 }}>
                {value || 'Não informado'}
              </Text>
            </View>
          )
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

export default FormSelect;

