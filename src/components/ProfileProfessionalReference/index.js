import React, { useContext, useState, useRef } from 'react';
import { StyleSheet,  TouchableOpacity, Text } from 'react-native';
import { Select, CheckIcon } from "native-base";
import { VerificationContext } from '../../contexts/registrationVerification';
import { AuthContext } from '../../contexts/auth';
import { Input, Label } from '../Styles';
import { TextInputMask } from 'react-native-masked-text';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'


export const ProfileProfessionalReference = (props) => {
  const { professionalReference, setProfessionalReference,
    professionalReference1, setProfessionalReference1,
    professionalReference2, setProfessionalReference2 } = useContext(VerificationContext);

  const [nameReference1, setNameReference1] = useState(professionalReference1?.name);
  const [nameReference2, setNameReference2] = useState(professionalReference2?.name);

  const [numCelular1, setNumCelular1] = useState(professionalReference1?.contact);
  const numCellRef1 = useRef(null);
  const [numCelular2, setNumCelular2] = useState(professionalReference2?.contact);
  const numCellRef2 = useRef(null);

  const { signOut, user, setUser, storageUser } = useContext(AuthContext);


  function handleEditName(text) {
    if (props.reference === 1) {
      setProfessionalReference1({ name: text, contact: professionalReference1.contact })
      setNameReference1(text);
    } else if (props.reference === 2) {
      setProfessionalReference2({ name: text, contact: professionalReference2.contact })
      setNameReference2(text);
    } else return null;

  }


  function handleEditContact(text) {
    if (props.reference === 1) {
      setProfessionalReference1({ name: professionalReference1?.name, contact: text })
      setNumCelular1(text)
    } else if (props.reference === 2) {
      setProfessionalReference2({ name: professionalReference2?.name, contact: text })
      setNumCelular2(text)
    } else return null;

  }

  const schema = yup.object({
    nameReference1: yup.string().required("*Informe o nome da referência."),
    nameReference2: yup.string().required("*Informe o nome da referência."),
    referenceContact1: yup.string().required("*Informe o telefone de contato da referência."),
    referenceContact2: yup.string().required("*Informe o telefone de contato da referência."),
  })

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nameReference1: professionalReference.nameReference1,
      referenceContact1: professionalReference.referenceContact1,
      nameReference2: professionalReference.nameReference2,
      referenceContact2: professionalReference.referenceContact2

    },

    resolver: yupResolver(schema)
  })

  function handleTest(data) {
    console.log(data)
    console.log('Proximo')
  }

  return (
    <>

      <Label style={{ marginTop: '10%' }}>Nome referência 1:</Label>

      <Controller
        control={control}
        name="nameReference1"
        render={({ field: { onChange, onBlur, value } }) => (

          <Input
            width="95%"
            placeholder={'Nome da referência'}
            value={value}
            onChangeText={onChange}
            editable={props.edit}
            color={props.edit ? '#121212' : '#ddd'}
          />
        )}

      />
      {errors.nameReference1 && <Text style={styles.labelError}>{errors.nameReference1?.message}</Text>}

      <Label>Contato referência 1:</Label>
      <Controller
        control={control}
        name="referenceContact1"
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
      {errors.referenceContact1 && <Text style={styles.labelError}>{errors.referenceContact1?.message}</Text>}


      <Label style={{ marginTop: '10%' }}>Nome referência 2:</Label>

      <Controller
        control={control}
        name="nameReference2"
        render={({ field: { onChange, onBlur, value } }) => (

          <Input
            width="95%"
            placeholder={'Nome da referência'}
            value={value}
            onChangeText={onChange}
            editable={props.edit}
            color={props.edit ? '#121212' : '#ddd'}
          />
        )}

      />
      {errors.nameReference1 && <Text style={styles.labelError}>{errors.nameReference1?.message}</Text>}

      <Label>Contato referência 2:</Label>
      <Controller
        control={control}
        name="referenceContact2"
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
      {errors.referenceContact1 && <Text style={styles.labelError}>{errors.referenceContact1?.message}</Text>}
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