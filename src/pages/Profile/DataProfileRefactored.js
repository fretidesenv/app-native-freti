import React, { useState, useEffect, useContext, useRef } from 'react';
import { Platform, ActivityIndicator, View, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
  ButtonText,
  ModalContainer,
  ButtonBack,
  ScrollProfile,
  ButtonUpload,
  TitleButtonUpload,
  ViewButtonUpload,
  ButtonEdit,
  TitleButtonEdit,
  ViewButtonEdit,
  Title,
  ViewHeader,
} from './styles'

import { VerificationContext } from '../../contexts/registrationVerification';
import { Button, Modal, VStack, HStack, Text, Radio, Center, NativeBaseProvider, Select, CheckIcon } from "native-base";

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

import { AuthContext } from '../../contexts/auth';

import DateField from 'react-native-datefield';
import { format, toDate, getDate, getYear, getMonth, } from 'date-fns';

import firestore from '@react-native-firebase/firestore';

// Importar os novos componentes de formulário
import {
  FormField,
  FormSelect,
  FormMaskField,
  FormSection,
  BankSelector
} from '../../components/FormComponents';

import { UploadImage } from '../../components/UploadImage';

import apiCep from '../../services/apiCep';
import apiBanks from '../../services/apiBanks';
import vehicleList from '../../services/vehicleList.json';
import bodyworkList from '../../services/bodyworkList.json';
import config from '../../config/variables.json'


const schema = yup.object({
  //DADOS PESSOAIS
  fullName: yup.string().required("*Informe seu nome completo"),
  contact: yup.string().min(10, "*Os contatos devem possuir no minimo 10 digitos.").max(16, "*Os contatos possuem no máximo 11 digitos.").required("*Informe o número de seu telefone."),
  documentCpf: yup.string().min(11, "*O CPF possui no minimo 11 digitos.").max(14, "*O CPF possui no maximo 11 digitos.").required("*Informe o número de seu CPF"),
  //DADOS DE EDEREÇO
  cep: yup.string().min(8, "*O CEP possui 8 digitos").required("*Informe o seu CEP."),
  state: yup.string().max(2, "*Somente a sigla").required("*Informe o seu estado."),
  city: yup.string().required("*Informe a sua cidade."),
  district: yup.string().required("*Informe o seu bairro."),
  street: yup.string().required("*Informe a sua rua."),
  number: yup.string().required("*Informe o número de sua residência."),
  //CONTATO DE DOIS PARENTES
  kinshipName1: yup.string().required("*Informe o nome de um parente."),
  kinshipName2: yup.string().required("*Informe o nome de um segundo parente."),
  kinshipContact1: yup.string().required("*Informe o telefone deste parente."),
  kinshipContact2: yup.string().required("*Informe o telefone deste parente."),
  kinshipDegree1: yup.string().required("*Selecione o grau de parentesco."),
  kinshipDegree2: yup.string().required("*Selecione o grau de parentesco."),
  //referência PROFISSIONAL
  professionalReferenceName1: yup.string().required("*Informe o nome da referência."),
  professionalReferenceName2: yup.string().required("*Informe o nome da referência."),
  professionalReferenceContact1: yup.string().required("*Informe o telefone de contato da referência."),
  professionalReferenceContact2: yup.string().required("*Informe o telefone de contato da referência."),
  //VEICULO
  vehiclePlate: yup.string().min(8, "*Placa inválida").required("*Informe a placa do veiculo."),
  bodyworkType: yup.string().required("*Informe o tipo da carroceria."),
  bodyworkPlate: yup.string().min(8, "*Placa inválida").required("*Informe a placa da carroceria."),
  //Dados bancarios
  bankName: yup.string().required("*Informe o seu banco."),
  bankFullName: yup.string().required("*Informe o seu CEP."),
  bankAgency: yup.string().min(2, "*Informe a agencia").required("*Informe a agencia."),
  bankAccountNumber: yup.string().required("*Informe o número da conta."),
  bankPix: yup.string().required("*Informe o pix."),
  bankHolderAccount: yup.string().required("*Informe o nome do titular da conta."),
})


function ModalDataProfile() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  //dados bancarios
  const [banks, setBanks] = useState([]);
  const [bankSelected, setBankSelected] = useState('');
  const [methodSearchBank, setMethodSearchBank] = useState('select');
  const [codeBank, setCodeBank] = useState();
  const [permissionToEditOnResult, setPermissionToEditOnResult] = useState(false)
  const { dataRegister, permissionToEdit, upload,
    loadingForm, modalSendSuccess, setModalSendSuccess } = useContext(VerificationContext);
  const [editData, setEditData] = useState(false);

  const [cnhIsPdf, setCnhIsPdf] = useState(false);
  const [crlvIsPdf, setCrlvIsPdf] = useState(false);
  const [anttIsPdf, setAnttIsPdf] = useState(false);

  const {
    setLoadingForm,
    //DADOS PESSOAIS
    fullName, setFullName,
    contact, setContact,
    documentRg, setDocumentRg,
    documentCpf, setDocumentCpf,
    birthDate, setBirthDate,
    sexGender, setSexGender,
    documentCnh, setDocumentCnh,
    documentCnhExpiration, setDocumentCnhExpiration,
    documentCrlv, setDocumentCrlv,
    documentAntt, setDocumentAntt,
    //DADOS DE ENDEREÇO
    address,
    //CONTATO DE DOIS PARENTES
    kinships,
    //referência PROFISSIONAL 
    professionalReference,
    //VEICULO
    vehicle,
    //DADOS BANCARIOS
    dataBank,
  } = useContext(VerificationContext);

  const navigation = useNavigation();

  useEffect(() => {
    let isActive = true;
    async function loadFunction() {
      try {
        if (isActive) {
          searchBankForSelect();
          firestore()
            .collection('drivers_users')
            .doc(user?.uid)
            .onSnapshot(onResult, onError);
        }
      } catch (err) {
        loadingForm(false)
      }
    }
    loadFunction();
    return () => isActive = false;
  }, []);

  const [banksListOrigin, setBanksListOrigin] = useState([]);
  const [banksListFiltered, setBanksListFiltered] = useState([]);
  const [searchBank, setSearchBank] = useState('');
  const [showModalBank, setShowModalBank] = useState(false)
  const [filterBank, setFilterBank] = useState([]);

  function onResult(QuerySnapshot) {
    if (QuerySnapshot?.data()?.statusDriver === 'incomplete') setPermissionToEditOnResult(true)
    else setPermissionToEditOnResult(false);
  }

  function onError(error) {
    console.error(error);
  }

  async function searchBankForSelect() {
    setLoading(true);
    try {
      const response = await apiBanks.get();
      setBanksListOrigin(response.data);
      setBanksListFiltered(response.data);
      setLoading(false);
    } catch (error) {
      console.log('ERROR: ' + error)
      setLoading(false);
    }
  }

  async function searchCep(cep) {
    setLoading(true);
    if (cep == '') {
      setLoading(false);
      return;
    } else {
      try {
        const response = await apiCep.get(`/${cep}/json`);
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

  function sendData(data) {
    Alert.alert(
      'Enviar dados para análise...',
      'Deseja encaminhar seus dados para análise?\n\n',
      [
        {
          text: "Voltar",
          onPress: () => console.log(data),
          style: "cancel"
        },
        { text: "Enviar para análise!", onPress: () => upload(data) },
      ]
    );
  }

  async function handleDataEdit() {
    await firestore()
      .collection('drivers_users')
      .doc(user.uid)
      .update({
        statusDriver: 'incomplete'
      }).then(() => { setEditData(false) })
  }

  //Generos
  const genders = [
    { key: 1, gender: 'Feminino' },
    { key: 2, gender: 'Masculino' },
    { key: 3, gender: 'Outro' },
    { key: 4, gender: 'Prefiro não dizer' },
  ];

  //Grau de parentesco
  const kinship = [
    { key: 1, degree: 'Cônjugue/Companheiro' },
    { key: 2, degree: 'Mãe/Pai' },
    { key: 3, degree: 'Filha/Filho' },
    { key: 4, degree: 'Irmã/Irmão' },
    { key: 5, degree: 'Tia/Tio' },
    { key: 6, degree: 'Prima/Primo' },
  ]
  
  const { setValue, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      //////////DADOS PESSOAIS
      fullName: dataRegister?.personalData?.fullName || "",
      contact: dataRegister?.personalData?.contact || "",
      documentCpf: dataRegister?.personalData?.documentCpf || "",
      sexGender: dataRegister?.personalData?.sexGender || "",
      documentCnhpdf: dataRegister?.personalData?.documentCnhpdf || "",
      documentCnhFrontImg: dataRegister?.personalData?.documentCnhFrontImg || "",
      documentCnhVerseImg: dataRegister?.personalData?.documentCnhVerseImg || "",
      documentCrlvPdf: dataRegister?.personalData?.documentCrlvPdf || "",
      documentCrlv: dataRegister?.personalData?.documentCrlv || "",
      documentCrlvImg: dataRegister?.personalData?.documentCrlvImg || "",
      documentAnttPdf: dataRegister?.personalData?.documentAnttPdf || "",
      documentAnttFrontImg: dataRegister?.personalData?.documentAnttFrontImg || "",
      documentAnttVerseImg: dataRegister?.personalData?.documentAnttVerseImg || "",
      //////////DADOS DE ENDEREÇO
      cep: dataRegister?.address?.cep || "",
      state: dataRegister?.address?.state || "",
      city: dataRegister?.address?.city || "",
      district: dataRegister?.address?.district || "",
      street: dataRegister?.address?.street || "",
      number: dataRegister?.address?.number || "",
      ////////CONTATO DE DOIS PARENTES
      kinshipName1: dataRegister?.kinships?.[0]?.name || "",
      kinshipContact1: dataRegister?.kinships?.[0]?.contact || "",
      kinshipDegree1: dataRegister?.kinships?.[0]?.degree || "",
      kinshipName2: dataRegister?.kinships?.[1]?.name || "",
      kinshipContact2: dataRegister?.kinships?.[1]?.contact || "",
      kinshipDegree2: dataRegister?.kinships?.[1]?.degree || "",
      ////////referência PROFISSIONAL
      professionalReferenceName1: dataRegister?.professionalReference?.[0]?.name || "",
      professionalReferenceContact1: dataRegister?.professionalReference?.[0]?.contact || "",
      professionalReferenceName2: dataRegister?.professionalReference?.[1]?.name || "",
      professionalReferenceContact2: dataRegister?.professionalReference?.[1]?.contact || "",
      ////////Veiculo
      vehicleType: dataRegister?.vehicle?.vehicleType || "",
      bodyworkType: dataRegister?.vehicle?.bodyworkType || "",
      vehiclePlate: dataRegister?.vehicle?.vehiclePlate || "",
      bodyworkPlate: dataRegister?.vehicle?.bodyworkPlate || "",
      vehicleImg: dataRegister?.vehicle?.vehicleImg || "",
      ////////DADOS BANCARIOS
      bankCode: dataRegister?.dataBank?.code || "",
      bankName: dataRegister?.dataBank?.bankName || "",
      bankFullName: dataRegister?.dataBank?.bankFullName || "",
      bankIspb: dataRegister?.dataBank?.ispb || "",
      bankAgency: dataRegister?.dataBank?.agency || "",
      bankAccountNumber: dataRegister?.dataBank?.accountNumber || "",
      bankAccountDigit: dataRegister?.dataBank?.accountDigit || "",
      bankPix: dataRegister?.dataBank?.pix || "",
      bankHolderAccount: dataRegister?.dataBank?.holderAccount || ""
    },
    resolver: yupResolver(schema) 
  })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ModalContainer>
        <ViewHeader>
          <ButtonBack onPress={() => navigation.navigate('Main')}>
            <Feather
              name="arrow-left"
              size={22}
              color="#ffffff"
            />
            <ButtonText color="#ffffff">Voltar</ButtonText>
          </ButtonBack>
          <Title>Meus dados</Title>
        </ViewHeader>
        
        <ScrollProfile>
        {permissionToEditOnResult ? (
          <Text color="#f00" style={{ marginBottom: 20, paddingHorizontal: 10 }}>
            Nota: Os campos com o sinal "*" no seu lado esquerdo são de preenchimento obrigatório.
          </Text>
        ) : (
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Feather
              name="lock"
              size={25}
              color='rgb(4,52,203)'
            />
            <Text style={{ textAlign: 'center', marginTop: 10, paddingHorizontal: 20, color: '#666' }}>
              Neste momento, a edição de dados está desabilidata para seu perfil.
              Nestas condições é possível apenas realizar consultas.
              Caso deseje alterar algo, contate o suporte.
            </Text>
          </View>
        )}

        {/* SEÇÃO DE DADOS PESSOAIS */}
        <FormSection title="MEUS DADOS PESSOAIS">
          <FormField
            control={control}
            name="fullName"
            label="Nome completo"
            required
            placeholder="Seu nome completo aqui"
            maxLength={80}
            editable={permissionToEditOnResult}
            error={errors.fullName}
          />

          <FormField
            control={control}
            name="email"
            label="Email"
            required
            placeholder={user?.email}
            value={user?.email}
            editable={false}
            style={{ backgroundColor: '#f8f9fa', color: '#666' }}
          />

          <FormField
            control={control}
            name="contact"
            label="Telefone para contato"
            placeholder="(99) 9 9999-9999"
            keyboardType="numeric"
            maxLength={16}
            editable={permissionToEditOnResult}
            error={errors.contact}
          />

          <FormMaskField
            control={control}
            name="documentCpf"
            label="Número de seu CPF"
            required
            placeholder="999.999.999-99"
            mask="999.999.999-99"
            keyboardType="numeric"
            maxLength={14}
            editable={permissionToEditOnResult}
            error={errors.documentCpf}
          />

          <FormSelect
            control={control}
            name="sexGender"
            label="Gênero"
            required
            placeholder="Qual o seu gênero?"
            options={genders}
            editable={permissionToEditOnResult}
            error={errors.sexGender}
          />

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              <Text style={{ color: '#ff375b' }}>*</Text> CNH:
            </Text>
            <Controller
              control={control}
              name="documentCnh"
              render={({ field: { onChange, onBlur, value } }) => (
                permissionToEditOnResult ? (
                  <UploadImage 
                    edit={permissionToEditOnResult} 
                    setValue={setValue} 
                    idImage="imgdocumentCnh" 
                  />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {value && (
                      <Image
                        source={{ uri: value }}
                        style={{ width: 200, height: 120, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                )
              )}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              <Text style={{ color: '#ff375b' }}>*</Text> CRLV:
            </Text>
            <Controller
              control={control}
              name="documentCrlv"
              render={({ field: { onChange, onBlur, value } }) => (
                permissionToEditOnResult ? (
                  <UploadImage 
                    edit={permissionToEditOnResult} 
                    setValue={setValue} 
                    idImage="imgdocumentCrlv" 
                  />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {value && (
                      <Image
                        source={{ uri: value }}
                        style={{ width: 200, height: 120, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                )
              )}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              <Text style={{ color: '#ff375b' }}>*</Text> ANTT:
            </Text>
            <Controller
              control={control}
              name="documentAntt"
              render={({ field: { onChange, onBlur, value } }) => (
                permissionToEditOnResult ? (
                  <UploadImage 
                    edit={permissionToEditOnResult} 
                    setValue={setValue} 
                    idImage="imgdocumentAntt" 
                  />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {value && (
                      <Image
                        source={{ uri: value }}
                        style={{ width: 200, height: 120, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                )
              )}
            />
          </View>
        </FormSection>

        {/* SEÇÃO DE ENDEREÇO */}
        <FormSection title="DADOS DE SEU ENDEREÇO">
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={{ width: '60%', marginRight: 10 }}>
              <FormMaskField
                control={control}
                name="cep"
                label="CEP"
                required
                placeholder="99999-999"
                mask="99999-999"
                keyboardType="numeric"
                maxLength={9}
                editable={permissionToEditOnResult}
                error={errors.cep}
              />
            </View>
            
            {permissionToEditOnResult && (
              <TouchableOpacity 
                onPress={() => {
                  const cepValue = control._formValues?.cep;
                  if (cepValue) searchCep(cepValue);
                }} 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  backgroundColor: '#007AFF',
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginTop: 20
                }}
              >
                {loading ? (
                  <ActivityIndicator size={20} color="#fff" />
                ) : (
                  <Feather name="search" size={20} color="#fff" />
                )}
                <Text style={{ color: '#fff', marginLeft: 5, fontSize: 14 }}>Buscar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '30%' }}>
              <FormField
                control={control}
                name="state"
                label="Estado"
                required
                placeholder="RS"
                maxLength={2}
                editable={permissionToEditOnResult}
                error={errors.state}
                style={{ width: '100%' }}
              />
            </View>
            <View style={{ width: '65%' }}>
              <FormField
                control={control}
                name="city"
                label="Cidade"
                required
                placeholder="Porto Alegre"
                maxLength={30}
                editable={permissionToEditOnResult}
                error={errors.city}
                style={{ width: '100%' }}
              />
            </View>
          </View>

          <FormField
            control={control}
            name="district"
            label="Bairro"
            required
            placeholder="ex.: Praia de Belas"
            maxLength={40}
            editable={permissionToEditOnResult}
            error={errors.district}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '70%' }}>
              <FormField
                control={control}
                name="street"
                label="Rua"
                required
                placeholder="ex.: Av. Padre Cacique"
                maxLength={80}
                editable={permissionToEditOnResult}
                error={errors.street}
                style={{ width: '100%' }}
              />
            </View>
            <View style={{ width: '25%' }}>
              <FormField
                control={control}
                name="number"
                label="Número"
                required
                placeholder="8910"
                maxLength={15}
                editable={permissionToEditOnResult}
                error={errors.number}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        </FormSection>

        {/* SEÇÃO DE CONTATOS DE PARENTES */}
        <FormSection title="CONTATO DE 2 PARENTES">
          <View style={{ backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              Parente 1:
            </Text>
            
            <FormField
              control={control}
              name="kinshipName1"
              label="Nome"
              required
              placeholder="Nome do parente 1"
              maxLength={80}
              editable={permissionToEditOnResult}
              error={errors.kinshipName1}
            />

            <FormField
              control={control}
              name="kinshipContact1"
              label="Contato"
              required
              placeholder="(99) 9 9999-9999"
              keyboardType="numeric"
              maxLength={16}
              editable={permissionToEditOnResult}
              error={errors.kinshipContact1}
            />

            <FormSelect
              control={control}
              name="kinshipDegree1"
              label="Grau de parentesco"
              required
              placeholder="Qual o grau de parentesco?"
              options={kinship}
              editable={permissionToEditOnResult}
              error={errors.kinshipDegree1}
            />
          </View>

          <View style={{ backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              Parente 2:
            </Text>
            
            <FormField
              control={control}
              name="kinshipName2"
              label="Nome"
              required
              placeholder="Nome do parente 2"
              maxLength={80}
              editable={permissionToEditOnResult}
              error={errors.kinshipName2}
            />

            <FormField
              control={control}
              name="kinshipContact2"
              label="Contato"
              required
              placeholder="(99) 9 9999-9999"
              keyboardType="numeric"
              maxLength={16}
              editable={permissionToEditOnResult}
              error={errors.kinshipContact2}
            />

            <FormSelect
              control={control}
              name="kinshipDegree2"
              label="Grau de parentesco"
              required
              placeholder="Qual o grau de parentesco?"
              options={kinship}
              editable={permissionToEditOnResult}
              error={errors.kinshipDegree2}
            />
          </View>
        </FormSection>

        {/* SEÇÃO DE REFERÊNCIAS PROFISSIONAIS */}
        <FormSection title="DUAS REFERÊNCIAS PROFISSIONAIS">
          <View style={{ backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              Referência 1:
            </Text>
            
            <FormField
              control={control}
              name="professionalReferenceName1"
              label="Nome"
              required
              placeholder="Nome da referência"
              maxLength={80}
              editable={permissionToEditOnResult}
              error={errors.professionalReferenceName1}
            />

            <FormField
              control={control}
              name="professionalReferenceContact1"
              label="Contato"
              required
              placeholder="(99) 9999-9999"
              keyboardType="numeric"
              maxLength={16}
              editable={permissionToEditOnResult}
              error={errors.professionalReferenceContact1}
            />
          </View>

          <View style={{ backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              Referência 2:
            </Text>
            
            <FormField
              control={control}
              name="professionalReferenceName2"
              label="Nome"
              required
              placeholder="Nome da referência"
              maxLength={80}
              editable={permissionToEditOnResult}
              error={errors.professionalReferenceName2}
            />

            <FormField
              control={control}
              name="professionalReferenceContact2"
              label="Contato"
              required
              placeholder="(99) 9999-9999"
              keyboardType="numeric"
              maxLength={16}
              editable={permissionToEditOnResult}
              error={errors.professionalReferenceContact2}
            />
          </View>
        </FormSection>

        {/* SEÇÃO DE VEÍCULO */}
        <FormSection title="VEÍCULO">
          <FormSelect
            control={control}
            name="vehicleType"
            label="Tipo do veículo"
            required
            placeholder="Qual o tipo do seu veículo?"
            options={vehicleList}
            editable={permissionToEditOnResult}
            error={errors.vehicleType}
          />

          <FormMaskField
            control={control}
            name="vehiclePlate"
            label="Placa do veículo"
            required
            placeholder="ABC-1A23"
            mask="AAA-9*99"
            keyboardType="default"
            editable={permissionToEditOnResult}
            error={errors.vehiclePlate}
            autoCapitalize="characters"
          />

          <FormSelect
            control={control}
            name="bodyworkType"
            label="Tipo de carroceria"
            required
            placeholder="Qual o tipo de carroceria?"
            options={bodyworkList}
            editable={permissionToEditOnResult}
            error={errors.bodyworkType}
          />

          <FormMaskField
            control={control}
            name="bodyworkPlate"
            label="Placa da carroceria"
            required
            placeholder="ABC-1A23"
            mask="AAA-9*99"
            keyboardType="default"
            editable={permissionToEditOnResult}
            error={errors.bodyworkPlate}
            autoCapitalize="characters"
          />

          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
              <Text style={{ color: '#ff375b' }}>*</Text> Foto do veículo:
            </Text>
            <Controller
              control={control}
              name="vehicleImg"
              render={({ field: { onChange, onBlur, value } }) => (
                permissionToEditOnResult ? (
                  <UploadImage 
                    edit={permissionToEditOnResult} 
                    setValue={setValue} 
                    idImage="imgVehicle" 
                  />
                ) : (
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    {value && (
                      <Image
                        source={{ uri: value }}
                        style={{ width: 200, height: 120, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                )
              )}
            />
          </View>
        </FormSection>

        {/* SEÇÃO DE DADOS BANCÁRIOS */}
        <FormSection title="DADOS BANCÁRIOS">
          <BankSelector
            control={control}
            name="bankName"
            banksList={banksListFiltered}
            editPermission={permissionToEditOnResult}
            setValue={setValue}
            loading={loading}
          />

          <FormField
            control={control}
            name="bankAgency"
            label="Agência"
            required
            placeholder="ex.: 4563"
            keyboardType="numeric"
            maxLength={15}
            editable={permissionToEditOnResult}
            error={errors.bankAgency}
            style={{ width: '40%' }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <View style={{ width: '60%', marginRight: 10 }}>
              <FormField
                control={control}
                name="bankAccountNumber"
                label="Conta"
                required
                placeholder="ex.: 4563"
                keyboardType="numeric"
                maxLength={20}
                editable={permissionToEditOnResult}
                error={errors.bankAccountNumber}
                style={{ width: '100%' }}
              />
            </View>
            <View style={{ width: '30%' }}>
              <FormField
                control={control}
                name="bankAccountDigit"
                label="Dígito"
                required
                placeholder="1"
                keyboardType="numeric"
                maxLength={3}
                editable={permissionToEditOnResult}
                error={errors.bankAccountDigit}
                style={{ width: '100%' }}
              />
            </View>
          </View>

          <FormField
            control={control}
            name="bankPix"
            label="Chave PIX"
            required
            placeholder="CPF, Email, Telefone"
            maxLength={100}
            editable={permissionToEditOnResult}
            error={errors.bankPix}
          />

          <FormField
            control={control}
            name="bankHolderAccount"
            label="Titular da conta"
            required
            placeholder="Nome do titular da conta"
            editable={permissionToEditOnResult}
            error={errors.bankHolderAccount}
          />

          <Text style={{ 
            fontWeight: 'bold', 
            color: '#f00', 
            fontSize: 12, 
            marginTop: 10,
            paddingHorizontal: 10,
            textAlign: 'center'
          }}>
            OBS: OS DADOS BANCÁRIOS SERÃO ACEITOS APENAS EM NOME DO MOTORISTA OU DO PROPRIETÁRIO DO VEICULO.
          </Text>
        </FormSection>

        {/* BOTÕES DE AÇÃO */}
        {permissionToEditOnResult ? (
          <ViewButtonUpload>
            {loadingForm ? (
              <TouchableOpacity onLongPress={() => setLoadingForm(false)}>
                <ActivityIndicator size={50} color='rgb(4,52,203)' />
              </TouchableOpacity>
            ) : (
              <ButtonUpload onPress={handleSubmit(sendData)} style={{ marginBottom: 20 }}>
                <TitleButtonUpload>Enviar para análise</TitleButtonUpload>
              </ButtonUpload>
            )}
          </ViewButtonUpload>
        ) : (
          <ViewButtonEdit>
            <ButtonEdit onPress={() => setEditData(true)} style={{ marginBottom: 20 }}>
              <TitleButtonEdit>Editar cadastro</TitleButtonEdit>
              <Feather
                name="edit"
                size={22}
                color="#001b33"
              />
            </ButtonEdit>
          </ViewButtonEdit>
        )}

        {/* MODAIS */}
        <Modal isOpen={editData} onClose={() => setEditData(false)} size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Atenção</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <Text color="#000" fontWeight="medium">Deseja realizar alterações em seu cadastro?</Text>
                <Text color="#000">Se sim, basta confirmar no botão abaixo.</Text>
                <Text color="#f90">Enquanto não encaminhar novamente os dados, o seu perfil ficará com o status de incompleto e não poderá realizar viagens.</Text>
              </VStack>
            </Modal.Body>
            <Modal.Footer justifyContent="space-between">
              <Button bg={config?.cor_primaria} width="30%" onPress={() => {
                setModalSendSuccess(false);
              }}>
                Voltar
              </Button>
              <Button bg={config?.cor_primaria} width="40%" onPress={() => {
                handleDataEdit()
              }}>
                Editar dados
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <Modal isOpen={modalSendSuccess} onClose={() => setModalSendSuccess(false)} size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Atenção</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <Text fontWeight="medium">Envio de dados realizado com sucesso. Agora você já pode começar a realizar viajens conosco!</Text>
              </VStack>
            </Modal.Body>
            <Modal.Footer justifyContent="space-between">
              <Button bg='rgb(4,52,203)' width="20%" onPress={() => {
                setModalSendSuccess(false);
              }}>
                OK
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        </ScrollProfile>
      </ModalContainer>
    </SafeAreaView>
  )
}

export default ModalDataProfile;

