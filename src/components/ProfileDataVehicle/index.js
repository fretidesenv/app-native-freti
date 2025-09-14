import React, { useState, useEffect, useContext, useRef, Component } from 'react';
import { View, Text, Modal, Platform, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Select, CheckIcon, Radio, Checkbox, } from "native-base";
import { Label, Input } from '../Styles';
import { VerificationContext } from '../../contexts/registrationVerification';

import { TextInputMask } from 'react-native-masked-text';

import { SelectBodywork } from '../Bodywork';
import { UploadImage } from '../UploadImage';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'


export const ProfileDataVehicle = (props) => {
  const { vehicle, setVehicle, setImgVehicle, imgVehicle } = useContext(VerificationContext);
  const [groupValue, setGroupValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBodyworkItems, setSelectedBodyworkItems] = useState([]);

  //const [numCelular2, setNumCelular2] = useState('');

  const schema = yup.object({
    type: yup.string().required("*Informe o tipo do veiculo."),
    plateVehicle: yup.string().min(8, "*Placa inválida").required("*Informe a placa do veiculo."),
    bodywork: yup.string().required("*Informe o tipo da carroceria."),
    plateBodywork: yup.string().min(8, "*Placa inválida").required("*Informe a placa da carroceria."),


  })

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      type: vehicle.type, bodywork: vehicle.bodywork, plateVehicle: vehicle.plateVehicle, plateBodywork: vehicle.plateBodywork, img: vehicle.img

    },
    resolver: yupResolver(schema)
  })

  function handleTest(data) {
    console.log(data)
  }


  const vehicleType = [
    { key: 1, type: 'FIORINO' },
    { key: 2, type: 'TRUCK' },
    { key: 3, type: 'BI-TRUCK' },
    { key: 3, type: 'CARRETA S' },
    { key: 4, type: 'CARRETA LS' },
    { key: 5, type: 'TOCO' },
    { key: 6, type: '3/4' },
    { key: 7, type: 'VUC' },
    { key: 8, type: 'BITREM' },
    { key: 9, type: 'RODOTREM' },
    { key: 10, type: 'MUNK' },
    { key: 11, type: 'VANDERLEIA' },
  ]


  let vehiclesItem = vehicleType.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.type} />
  })

  const bodyworkList = [
    { label: 'Bobineira', value: 'BOBINEIRA' },
    { label: 'Grade baixa', value: 'GRADE BAIXA' },
    { label: 'Baú (seco)', value: 'BAÚSECO' },
    { label: 'Baú Frigorifico', value: 'BAÚ FRIGORIFICO' },
    { label: 'Graneleiro', value: 'GRANELEIRO' },
    { label: 'Sider', value: 'SIDER' },
    { label: 'Prancha', value: 'PRANCHA' },
    { label: 'Tanque', value: 'TANQUE' },
    { label: 'Caçamba', value: 'CAÇAMBA' },

    { label: 'Porta Container', value: 'PORTA CONTAINER' },
    { label: 'Cilo', value: 'CILO' },
    { label: 'Cegonha', value: 'CEGONHA' },

  ];


  let bodyworkItem = bodyworkList.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.label} />
  })


  function handleEditTypeVehicle(i) {
    setVehicle({
      type: vehicleType[i].type,
      bodywork: vehicle.bodywork,
      plateVehicle: vehicle.plateVehicle,
      plateBodywork: vehicle.plateBodywork
    })
  }


  const [detailPlateVehicle, setDetailPlateVehicle] = useState(vehicle?.plateVehicle);
  const plateVehicleRef = useRef(null);
  function handleEditPlateVehicle(text) {
    setDetailPlateVehicle(text);
    setVehicle({
      type: vehicle.type,
      bodywork: vehicle.bodywork,
      plateVehicle: plateVehicleRef?.current.getRawValue(),
      plateBodywork: vehicle.plateBodywork
    })
  }

  // function (item) {
  //   // setSelectedBodyworkItems([...item])
  //   setSelectedBodyworkItems([...item])
  //   setVehicle({
  //     type: vehicle.type,
  //     bodywork: selectedBodyworkItems,
  //     plateVehicle: vehicle.plateVehicle,
  //     plateBodywork: vehicle.plateBodywork
  //   })
  // }

  function handleEditBodywork(i) {
    setVehicle({
      type: vehicle.type,
      bodywork: bodyworkList[i].value,
      plateVehicle: vehicle.plateVehicle,
      plateBodywork: vehicle.plateBodywork
    })
  }




  const [detailPlateBodywork, setDetailPlateBodywork] = useState(vehicle?.plateBodywork);
  const plateBodyworkRef = useRef(null);
  function handleEditPlateBodywork(text) {
    setDetailPlateBodywork(text);
    setVehicle({
      type: vehicle.type,
      bodywork: vehicle.bodywork,
      plateVehicle: vehicle.plateVehicle,
      plateBodywork: plateBodyworkRef?.current.getRawValue()
    })
  }



  return (
    <>

      <Label>Tipo do seu veículo:</Label>
      {props.edit ? (
        <>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, onBlur, value } }) => (

              <Select
                selectedValue={null}
                minWidth='90%'
                width='90%'
                accessibilityLabel="Qual o tipo do seu veículo?"
                placeholder="Qual o tipo do seu veículo?"
                _selectedItem={{
                  bg: "yellow.500",
                  endIcon: <CheckIcon size="5" />
                }}

                onValueChange={(itemValue) => onChange(vehicleType[itemValue].type)}
              >
                {vehiclesItem}
              </Select>
            )}
          />
            {errors.type && <Text style={styles.labelError}>{errors.type?.message}</Text>}
        </>
      )
        : (<>
          <Input
            width="80%"
            style={{ marginTop: 10, color: '#ddd' }}
            placeholder={vehicle.type}
            value={vehicle.type}
            editable={props.edit}
          />
        </>)}

      <Label>Placa do Veiculo:</Label>
      <Controller
        control={control}
        name="plateVehicle"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputMask
            placeholder='ex.: ABC-1A23'
            type={'custom'}
            options={{
              mask: 'AAA-9*99',

            }}
            value={value}
            onChangeText={onChange}
            // value={detailPlateVehicle}
            // onChangeText={(text) => handleEditPlateVehicle(text)}
            ref={plateVehicleRef}
            editable={props.edit}
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd' }]}
          />
        )}
      />

      {errors.plateVehicle && <Text style={styles.labelError}>{errors.plateVehicle?.message}</Text>}
      <Label>Tipo de carroceria:</Label>


      {props.edit ? (
        <>
          <Controller
            control={control}
            name="bodywork"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                selectedValue={null}
                minWidth='90%'
                width='90%'
                accessibilityLabel="Qual o tipo de carroceria?"
                placeholder="Qual o tipo de carriceria?"
                _selectedItem={{
                  bg: "yellow.500",
                  endIcon: <CheckIcon size="5" />,
                }}
                // onValueChange={(itemValue) => handleEditBodywork(itemValue)}
                onValueChange={(itemValue) => onChange(bodyworkList[itemValue].value,)}
              >
                {bodyworkItem}
              </Select>
            )}
          />
           {errors.bodywork && <Text style={styles.labelError}>{errors.bodywork?.message}</Text>}
    
        </>
      )
        : (<>
          <Input
            width="80%"
            style={{ marginTop: 10, color: '#ddd' }}
            placeholder={vehicle.bodywork}
            value={vehicle.bodywork}
            editable={props.edit}
          />
        </>)}


      <Label>Placa da carroceria:</Label>
      <Controller
        control={control}
        name="plateBodywork"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputMask
            placeholder='ex.: ABC-1A23'
            type={'custom'}
            options={{
              mask: 'AAA-9*99',

            }}
            // value={detailPlateBodywork}
            value={value}
            onChangeText={onChange}
            // onChangeText={(text) => handleEditPlateBodywork(text)}
            ref={plateBodyworkRef}
            editable={props.edit}
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd' }]}

          />
        )}
      />

      {errors.plateBodywork && <Text style={styles.labelError}>{errors.plateBodywork?.message}</Text>}

      {/* <Input
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
*/}



      <Label>Foto do veículo:</Label>
      <UploadImage edit={props.edit} idImage="imgVehicle" />

      <TouchableOpacity onPress={handleSubmit(handleTest)}><Text>TESTE</Text></TouchableOpacity>

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
  }
});