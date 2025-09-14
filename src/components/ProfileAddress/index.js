import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Modal, Platform, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Select, CheckIcon, Radio } from "native-base";

import { Label, Input } from '../Styles';
import { VerificationContext } from '../../contexts/registrationVerification';
import Feather from 'react-native-vector-icons/Feather';
import apiCep from '../../services/apiCep';

import { useForm, Controller, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

const schema = yup.object({
  cep: yup.number("*Somente números").min(8, "*O CEP possui 8 digitos").required("*Informe o seu CEP."),
  state: yup.string().max(2,"*Somente a sigla").required("*Informe o seu estado."),
  city: yup.string().required("*Informe a sua cidade."),
  district: yup.string().required("*Informe o seu bairro."),
  street: yup.string().required("*Informe a sua rua."),
  number: yup.string().required("*Informe o número de sua residência."),

})

export const ProfileDataAddress = (props) => {
  const { address, setAddress } = useContext(VerificationContext);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadFunction() {
      try {
        if (isActive) {
          console.log('test')
        }
      } catch (err) { }
    }
    loadFunction();
    return () => isActive = false;
  }, [])




  async function searchCep(cep) {
    setLoading(true);
    if (cep == '') {
      console.log()
      // alert("Digite um CEP valido!")
      // setCep('');
      setLoading(false);
      return;
    } else {

      try {
        const response = await apiCep.get(`/${cep}/json`);
        //console.log(response.data)
        setValue("state", response.data.uf);
        setValue("city", response.data.localidade);
        setValue("district", response.data.bairro !== '' ? response.data.bairro : '');
        setValue("street", response.data.logradouro !== '' ? response.data.logradouro : '');
        setLoading(false);
      } catch (error) {
        console.log('ERROR: ' + error)
        setLoading(false);
      }
    }

  }


  const { setValue, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      cep: address.cep,
      state: address.state,
      city: address.city,
      district: address.district,
      street: address.state,
      number: address.number
    },
    resolver: yupResolver(schema)
  })


  function handleTest(data) {
    console.log(data)
  }

  return (
    <>
      <Label>CEP:</Label>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>


        <Controller
          control={control}
          name="cep"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              width="45%"
              onChangeText={onChange}
              //onBlur={onBlur}//desativado o numero fica sem a mascara
              value={value.replace(/^(\d{5})(\d{3})/, "$1-$2")}
              placeholder="99999-999"
              keyboardType="numeric"
              editable={props.edit}//alterar a permissão quando a condição muda
              color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
     
        <Controller
          control={control}
          name="cep"
          render={({ field: { onChange, onBlur, value } }) => (

            <View style={{ width: '50%', flexDirection: 'row' }}>
              {props.edit ? (
                <>

                  <TouchableOpacity onPress={() => { searchCep(value) }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {loading === false ? (
                      <Feather
                        name="download-cloud"
                        size={22}
                        color="#121212"
                        style={{ marginRight: 3 }}
                      />
                    ) : (
                      <ActivityIndicator size={20} color="#121212" />
                    )}

                    <Text>Autocompletar</Text>
                  </TouchableOpacity>
                </>
              )
                : (<></>)}

            </View>


          )}
        />

      </View>
      {errors.cep && <Text style={styles.labelError}>{errors.cep?.message}</Text>}

      <Label>Estado:</Label>

      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="45%"
            onChangeText={onChange}
            //onBlur={onBlur}
            value={value}
            maxLength={3}
            placeholder="ex.: RS"
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.state && <Text style={styles.labelError}>{errors.state?.message}</Text>}


      <TouchableOpacity onPress={handleSubmit(handleTest)}><Text>TESTE</Text></TouchableOpacity>


      <Label>Cidade:</Label>

      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="ex.: Porto Alegre"
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}
            value={value}
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.city && <Text style={styles.labelError}>{errors.city?.message}</Text>}
        <Label>Bairro:</Label>

      <Controller
        control={control}
        name="district"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="ex.: Praia de Belas"
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}
            value={value}
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.district && <Text style={styles.labelError}>{errors.district?.message}</Text>}

      <Label>Rua:</Label>
      <Controller
        control={control}
        name="street"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="ex.: Av. Padre Cacique"
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}
            value={value}
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.street && <Text style={styles.labelError}>{errors.street?.message}</Text>}

      <Label>Número:</Label>
      <Controller
        control={control}
        name="number"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="ex.: 8910"
            width="30%"
            onChangeText={onChange}
            //onBlur={onBlur}
            value={value}
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.number && <Text style={styles.labelError}>{errors.number?.message}</Text>}

    </>
  )

};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 4,
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