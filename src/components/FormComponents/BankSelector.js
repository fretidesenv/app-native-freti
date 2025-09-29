import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Label, Required, BankSelectedText } from '../../components/Styles';
import { Controller } from 'react-hook-form';
import { Modal, VStack, InputSearch } from 'native-base';
import { SelectBank, ButtonBank, Line } from '../../pages/Profile/styles';

const BankSelector = ({
  control,
  name,
  banksList = [],
  editPermission = true,
  setValue,
  loading = false
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filteredBanks, setFilteredBanks] = useState(banksList);

  const searchBanks = (text) => {
    if (text) {
      const filtered = banksList.filter(item => 
        item.name?.toUpperCase().includes(text.toUpperCase()) ||
        item.fullName?.toUpperCase().includes(text.toUpperCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks(banksList);
    }
  };

  const selectBank = (bank) => {
    setValue("bankCode", bank.code);
    setValue("bankName", bank.name);
    setValue("bankFullName", bank.fullName);
    setValue("bankIspb", bank.ispb);
    setShowModal(false);
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <Label><Required>*</Required>Banco:</Label>
      
      {editPermission ? (
        <View>
          <SelectBank onPress={() => setShowModal(true)}>
            <Text style={{ fontSize: 12, color: 'rgb(162,164,163)' }}>
              Em qual banco deseja receber os pagamentos?
            </Text>
          </SelectBank>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
            <Modal.Content maxWidth="350" maxHeight="450">
              <Modal.CloseButton />
              <Modal.Header>
                Busque o banco pelo nome
                <InputSearch
                  style={{
                    backgroundColor: '#fff',
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 10
                  }}
                  onChangeText={searchBanks}
                  placeholder="Procure aqui"
                  placeholderTextColor="#94A3B8"
                />
              </Modal.Header>
              <Modal.Body>
                <VStack space={3}>
                  {filteredBanks.map((bank, index) => (
                    <ButtonBank key={index} onPress={() => selectBank(bank)}>
                      <Text style={{ fontSize: 14, fontWeight: '500' }}>
                        {bank.fullName}
                      </Text>
                      <Line />
                    </ButtonBank>
                  ))}
                </VStack>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </View>
      ) : null}

      <Controller
        control={control}
        name="bankName"
        render={({ field: { value } }) => (
          <View style={{ 
            width: '90%', 
            borderWidth: 1, 
            marginTop: 5, 
            padding: 12, 
            borderColor: '#ddd', 
            borderRadius: 8,
            backgroundColor: editPermission ? '#fff' : '#f8f9fa'
          }}>
            <BankSelectedText color={'#666'} style={{ fontSize: 12 }}>
              Banco selecionado:
            </BankSelectedText>
            <BankSelectedText 
              color={editPermission ? '#121212' : '#ddd'} 
              style={{ fontSize: 16, fontWeight: '500', marginTop: 4 }}
            >
              {value || 'Nenhum banco selecionado'}
            </BankSelectedText>
          </View>
        )}
      />
    </View>
  );
};

export default BankSelector;

