import React, { useContext, useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Select, CheckIcon } from "native-base";
import { VerificationContext } from '../../contexts/registrationVerification';
import { AuthContext } from '../../contexts/auth';
import { Input, Label } from '../Styles';
import { TextInputMask } from 'react-native-masked-text';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'


export const SelectKinship = (props) => {
  const { kinships } = useContext(VerificationContext);
  
  const { } = useContext(AuthContext);
  const kinship = [
    { key: 1, degree: 'Cônjugue/Companheiro' },
    { key: 2, degree: 'Mãe/Pai' },
    { key: 3, degree: 'Filha/Filho' },
    { key: 4, degree: 'Irmã/Irmão' },
    { key: 5, degree: 'Tia/Tio' },
    { key: 6, degree: 'Psrima/Primo' },
  ]

  let kinshipItem = kinship.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.degree} />
  })

  const schema = yup.object({
    name1: yup.string().required("*Informe o nome de um parente."),
    name2: yup.string().required("*Informe o nome de um segundo parente."),
    contact1: yup.string().required("*Informe o telefone deste parente."),
    contact2: yup.string().required("*Informe o telefone deste parente."),
    degree1: yup.string().required("*Selecione o grau de parentesco."),
    degree2: yup.string().required("*Selecione o grau de parentesco."),

  })


  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name1: kinships.name1,
      contact1: kinships.contact1,
      degree1: kinships.degree1,
      name2: kinships.name2,
      contact2: kinships.contact2,
      degree2: kinships.degree2,
    },

    resolver: yupResolver(schema)
  })

  function handleTest(data) {
    console.log(data)
    console.log('Proximo')
  }

  return (
    <>
      <Label style={{ marginTop: '10%' }}>Nome parente 1:</Label>

      <Controller
        control={control}
        name="name1"
        render={({ field: { onChange, onBlur, value } }) => (

          <Input
            width="95%"
            placeholder={"nome do parente 1"}
            value={value}
            onChangeText={onChange}
            editable={props.edit}
            color={props.edit ? '#121212' : '#ddd'}
          />
        )}

      />
      {errors.name1 && <Text style={styles.labelError}>{errors.name1?.message}</Text>}

      <Label>Contato parente 1:</Label>
      <Controller
        control={control}
        name="contact1"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}//desativado o numero fica sem a mascara
            value={value.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4")}
            placeholder="(99) 9 9999-9999"
            keyboardType="numeric"
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.contact ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.contact1 && <Text style={styles.labelError}>{errors.contact1?.message}</Text>}

      {props.edit ? (
        <>
          <Controller
            control={control}
            name="degree1"
            render={({ field: { onChange, onBlur, value } }) => (

              <Select
                marginTop={1}
                selectedValue={null}
                minWidth='90%'
                width='90%'
                accessibilityLabel={value}
                placeholder={value !== '' ? value : 'Selecione o grau'}
                _selectedItem={{
                  bg: "yellow.500",
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={(itemValue) => onChange(kinship[itemValue].degree)}
              >
                {kinshipItem}
              </Select>


            )}
          />
          {errors.degree1 && <Text style={styles.labelError}>{errors.degree1?.message}</Text>}

        </>
      )
        : (<>
          <Input
            width="80%"
            style={{ marginTop: 10, color: '#ddd' }}
            placeholder={kinships.degree1}
            value={kinships.degree1}
            editable={props.edit}
          />
        </>)}





      <Label style={{ marginTop: '10%' }}>Nome parente 2:</Label>

      <Controller
        control={control}
        name="name2"
        render={({ field: { onChange, onBlur, value } }) => (

          <Input
            width="95%"
            placeholder={"nome do parente 2"}
            value={value}
            onChangeText={onChange}
            editable={props.edit}
            color={props.edit ? '#121212' : '#ddd'}
          />
        )}

      />
      {errors.name2 && <Text style={styles.labelError}>{errors.name2?.message}</Text>}

      <Label>Contato parente 2:</Label>
      <Controller
        control={control}
        name="contact2"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}//desativado o numero fica sem a mascara
            value={value.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4")}
            placeholder="(99) 9 9999-9999"
            keyboardType="numeric"
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.contact ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.contact2 && <Text style={styles.labelError}>{errors.contact2?.message}</Text>}

      {props.edit ? (
        <>
          <Controller
            control={control}
            name="degree2"
            render={({ field: { onChange, onBlur, value } }) => (

              <Select
                marginTop={1}
                selectedValue={null}
                minWidth='90%'
                width='90%'
                accessibilityLabel={value}
                placeholder={value !== '' ? value : 'Selecione o grau'}
                _selectedItem={{
                  bg: "yellow.500",
                  endIcon: <CheckIcon size="5" />,
                }}
                onValueChange={(itemValue) => onChange(kinship[itemValue].degree)}
              >
                {kinshipItem}
              </Select>


            )}
          />
          {errors.degree2 && <Text style={styles.labelError}>{errors.degree2?.message}</Text>}

        </>
      )
        : (<>
          <Input
            width="80%"
            style={{ marginTop: 10, color: '#ddd' }}
            placeholder={kinships.degree1}
            value={kinships.degree1}
            editable={props.edit}
          />
        </>)}



      <TouchableOpacity
        onPress={handleSubmit(handleTest)}
      >
        <Text>TESTE</Text>
      </TouchableOpacity>

    </>
  )
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    width: '80%',
    padding: 4,
    paddingLeft: 10,
    color: '#121212',
  },
  labelError: {
    alignSelf: 'flex-start',
    color: '#ff375b',
    marginBottom: 8,
  },
});