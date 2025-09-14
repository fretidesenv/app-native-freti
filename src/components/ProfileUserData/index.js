import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, Modal, Platform, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

import { Select, CheckIcon, Button } from "native-base";
import { Label, Input } from "../Styles";
import { AuthContext } from '../../contexts/auth';

import { VerificationContext } from '../../contexts/registrationVerification';

import DatePicker from 'react-native-date-picker';
import DateField from 'react-native-datefield';
import { format, toDate } from 'date-fns';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'



const schema = yup.object({
  fullName: yup.string().required("*Informe seu nome completo"),
  documentRg: yup.string().required("*Informe o número de seu RG"),
  contact: yup.string().min(10, "*Os contatos devem possuir no minimo 10 digitos.").max(16, "*Os contatos possuem no máximo 11 digitos.").required("*Informe o número de seu telefone."),
  documentCpf: yup.string().required("*Informe o número de seu CPF"),
  birthDate: yup.string().min(8, "*Data inválida.").required("*Informe o número de seu nascimento"),
  documentCnh: yup.string().required("*Informe o número de registro de sua CNH."),
  documentCnhExpiration: yup.string().min(8, "*Data inválida.").required("*Informe o número de vencimento de sua CNH."),

})

import { UploadImage } from '../UploadImage';
import { UploadPdf } from '../UploadPdf';

export const ProfileUserData = (props) => {
  const { user } = useContext(AuthContext);

  const { fullName, setFullName,
    contact, setContact,
    documentRg, setDocumentRg,
    documentCpf, setDocumentCpf,
    birthDate, setBirthDate,
    sexGender, setSexGender,
    documentCnh, setDocumentCnh,
    documentCnhExpiration, setDocumentCnhExpiration,
    documentCrlv, setDocumentCrlv,
    documentAntt, setDocumentAntt,

  } = useContext(VerificationContext);
  const [dateB, setDateB] = useState(birthDate === '' ? new Date() : birthDate)
  const [dateC, setDateC] = useState(documentCnhExpiration === '' ? new Date() : documentCnhExpiration)


  const [birthDateTESTE, setBirthDateTESTE] = useState();


  const genders = [
    { key: 1, gender: 'Feminino' },
    { key: 2, gender: 'Masculino' },
    { key: 3, gender: 'Outro' },
    { key: 4, gender: 'Prefiro não dizer' },
  ];


  let genderItem = genders.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.gender} />
  })

  //
  const [numPhone, setNumPhone] = useState(contact);
  const numPhoneRef = useRef(null);
  function handleEditContact(text) {
    setNumPhone(text);
    setContact(numPhoneRef?.current.getRawValue())
  }

  //
  const [numCpf, setNumCpf] = useState(documentCpf);
  const numCpfRef = useRef(null);
  function handleEditCpf(text) {
    setNumCpf(text);
    setDocumentCpf(numCpfRef?.current.getRawValue())
  }


  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName, documentRg, contact, documentCpf,
      birthDate, sexGender, documentCnh, documentCnhExpiration
    },
    resolver: yupResolver(schema)
  })


  function handleEditData(data) {
    console.log(data)
  }



  return (
    <>

      <Label>Nome completo:</Label>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            onBlur={onBlur}//chamado quando o textInput é tocado.
            value={value}
            placeholder={fullName}
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
          />
        )}

      />
      {errors.fullName && <Text style={styles.labelError}>{errors.fullName?.message}</Text>}

     
      <Label>Email:</Label>
      <Input
        width="95%"
        placeholder={user?.email}
        value={user?.email}
        editable={false}
        color={'#ddd'}
      />

      <Label>Telefone para contato:</Label>

      <Controller
        control={control}
        name="contact"
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
      {errors.contact && <Text style={styles.labelError}>{errors.contact?.message}</Text>}

      <Label>RG:</Label>
      <Controller
        control={control}
        name="documentRg"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder="seu RG"
            keyboardType="numeric"
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={{ borderWidth: errors.documentRg && 1, borderColor: errors.documentRg && '#ff375b' }}
          />
        )}

      />
      {errors.documentRg && <Text style={styles.labelError}>{errors.documentRg?.message}</Text>}

      <Label>CPF:</Label>
      <Controller
        control={control}
        name="documentCpf"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}//desativado o numero fica sem a mascara
            value={value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
            placeholder="999.999.999-99"
            keyboardType="numeric"
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.documentCpf && <Text style={styles.labelError}>{errors.documentCpf?.message}</Text>}


      <Label>Data de nascimento:</Label>

      <Controller
        control={control}
        name="birthDate"
        render={({ field: { onChange, onBlur, value } }) =>
        (
          <DateField
            defaultValue={toDate(birthDate)}
            labelDate="Dia"
            labelMonth="Mês"
            labelYear="Ano"
            onSubmit={(value) => onChange(value.getTime())}
            //onChangeText={onChange}
            editable={props.edit}
            styleInput={[styles.inputBorder, { color: props.edit ? '#121212' : '#ddd' }]}

          />

        )}
      />
      {errors.birthDate && <Text style={styles.labelError}>{errors.birthDate?.message}</Text>}

      <Controller
        control={control}
        name="documentCpf"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}//desativado o numero fica sem a mascara
            value={value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
            placeholder="999.999.999-99"
            keyboardType="numeric"
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.documentCpf && <Text style={styles.labelError}>{errors.documentCpf?.message}</Text>}

      <Label>Gênero: {props.edit ? sexGender : ''}</Label>
      {props.edit ? (
        <Controller
          control={control}
          name="sexGender"
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              selectedValue={null}
              minWidth='90%'
              width='90%'
              accessibilityLabel={sexGender !== '' ? sexGender : "Qual o seu gênero?"}
              placeholder={sexGender !== '' ? sexGender : "Qual o seu gênero?"}
              _selectedItem={{
                bg: "yellow.500",
                endIcon: <CheckIcon size="5" />,

              }}

              onValueChange={(itemValue) => onChange((genders[itemValue].gender))}
            >
              {genderItem}
            </Select>
          )}
        />)
        : (<>
          <Input
            placeholder="ex.: "
            width="90%"
            value={sexGender}
            editable={props.edit}
            color={props.edit ? '#121212' : '#ddd'}

          />
        </>)}


      <Label>Número de registro da CNH:</Label>
      <Controller
        control={control}
        name="documentCnh"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}//desativado o numero fica sem a mascara
            value={value}
            placeholder="999999999"
            keyboardType="numeric"
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.documentCnh && <Text style={styles.labelError}>{errors.documentCnh?.message}</Text>}


      <Label>Vencimento CNH</Label>
      <Controller
        control={control}
        name="documentCnhExpiration"
        render={({ field: { onChange, onBlur, value } }) =>
        (
          <DateField
            defaultValue={toDate(documentCnhExpiration !== '' ? documentCnhExpiration : new Date().getTime())}
            labelDate="Dia"
            labelMonth="Mês"
            labelYear="Ano"
            onSubmit={(value) => onChange(value.getTime())}
            //onChangeText={onChange}
            editable={props.edit}
            styleInput={[styles.inputBorder, { color: props.edit ? '#121212' : '#ddd' }]}

          />
        )}
      />
      {errors.documentCnhExpiration && <Text style={styles.labelError}>{errors.documentCnhExpiration?.message}</Text>}


      <Label>Foto da parte da frente da CNH:</Label>
      <UploadImage edit={props.edit} idImage="imgdocumentCnhFront" />
      <Label>Foto da parte de trás da CNH:</Label>
      <UploadImage edit={props.edit} idImage="imgdocumentCnhVerse" />

      <Label>CRLV:</Label>
      <Input
        placeholder="ex.: "
        width="95%"
        keyboardType="numeric"
        value={documentCrlv}
        onChangeText={(text) => setDocumentCrlv(text)}
        editable={props.edit}
        color={props.edit ? '#121212' : '#ddd'}
      />
      <UploadImage edit={props.edit} idImage="imgdocumentCrlv" />


      <Label>ANTT:</Label>

      <Input
        placeholder="ex.: "
        width="95%"
        keyboardType="numeric"
        value={documentAntt}
        onChangeText={(text) => setDocumentAntt(text)}
        editable={props.edit}
        color={props.edit ? '#121212' : '#ddd'}
      />
      <UploadImage edit={props.edit} idImage="imgdocumentAntt" />
      <UploadPdf edit={props.edit} idPdf="pdfdocumentAntt" />

      <Button mt={2} bg="rgb(4,52,203)" flex="1" onPress={handleSubmit(handleEditData)}>
        Proximo
      </Button>
      {errors.fullName && <Text style={styles.labelError}>{errors.fullName?.message}</Text>}
      {errors.birthDate && <Text style={styles.labelError}>{errors.birthDate?.message}</Text>}
      {errors.contact && <Text style={styles.labelError}>{errors.contact?.message}</Text>}
      {errors.documentCnh && <Text style={styles.labelError}>{errors.documentCnh?.message}</Text>}
      {errors.documentCnhExpiration && <Text style={styles.labelError}>{errors.documentCnhExpiration?.message}</Text>}     
      {errors.documentCpf && <Text style={styles.labelError}>{errors.documentCpf?.message}</Text>}
      
      
    </>
  )


};


const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    fontSize: 18,
    borderWidth: 1,

    borderRadius: 4,
    width: '80%',
    padding: 4,
    paddingLeft: 10,

  },
  inputBorder: {
    width: '30%',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    color: '#f0f',
  },
  labelError: {
    alignSelf: 'flex-start',
    color: '#ff375b',
    marginBottom: 8,
  }
});