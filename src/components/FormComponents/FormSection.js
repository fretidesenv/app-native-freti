import React from 'react';
import { View, Text } from 'react-native';
import { TitleLabel, Line } from '../../pages/Profile/styles';

const FormSection = ({ title, children, showLine = true }) => {
  return (
    <View style={{ marginBottom: 25 }}>
      <TitleLabel>{title}</TitleLabel>
      <View style={{ marginTop: 10 }}>
        {children}
      </View>
      {showLine && <Line style={{ marginTop: 20 }} />}
    </View>
  );
};

export default FormSection;

