import React, { useState, useEffect, useContext, useRef } from 'react';
import { Platform, ActivityIndicator, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';

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

import apiCep from '../../services/apiCep';
import apiBanks from '../../services/apiBanks';
import vehicleList from '../../services/vehicleList.json';
import bodyworkList from '../../services/bodyworkList.json';
import config from '../../config/variables.json'


const schema = yup.object({
  //DADOS PESSOAIS
  fullName: yup.string().required("*Informe seu nome completo"),
  //documentRg: yup.string().required("*Informe o número de seu RG"),
  contact: yup.string().min(10, "*Os contatos devem possuir no minimo 10 digitos.").max(16, "*Os contatos possuem no máximo 11 digitos.").required("*Informe o número de seu telefone."),
  documentCpf: yup.string().min(11, "*O CPF possui no minimo 11 digitos.").max(14, "*O CPF possui no maximo 11 digitos.").required("*Informe o número de seu CPF"),
  // birthDate: yup.string().min(8, "*Data inválida.").required("*Informe o número de seu nascimento"),
  //documentCnh: yup.string().required("*Informe o número de registro de sua CNH."),
  // documentCnhExpiration: yup.string().min(8, "*Data inválida.").required("*Informe o número de vencimento de sua CNH.")
  //documentAntt: yup.string().required("Informe o numero de sua ANTT"),
  //documentCrlv: yup.string().required("Informe o numero de sua CRLV"),
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
  professionalReferenceContact1: yup.string().required("*Informe o telefone de contato da referência."),
  //VEICULO
  //vehicleType: yup.string().required("*Informe o tipo do veiculo."),
  vehiclePlate: yup.string().min(8, "*Placa inválida").required("*Informe a placa do veiculo."),
  bodyworkType: yup.string().required("*Informe o tipo da carroceria."),
  bodyworkPlate: yup.string().min(8, "*Placa inválida").required("*Informe a placa da carroceria."),
  //Dados bancarios
  bankName: yup.string().required("*Informe o seu banco."),
  bankFullName: yup.string().required("*Informe o seu CEP."),
  bankAgency: yup.string().min(2, "*Informe a agencia").required("*Informe a agencia."),
  bankAccountNumber: yup.string().required("*Informe o número da conta."),
  // accountDigit: yup.number("*Somente números").required("*Informe o digito da conta."),
  bankPix: yup.string().required("*Informe o pix."),
  bankHolderAccount: yup.string().required("*Informe o nome do titular da conta."),


})


function ModalDataProfile({
  // setOpen,
  // sendData, 
  //permissionToEditOnResult
}) {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  //dados bancarios
  const [banks, setBanks] = useState([]);
  const [bankSelected, setBankSelected] = useState('');
  const [methodSearchBank, setMethodSearchBank] = useState('select');
  const [codeBank, setCodeBank] = useState();
  const [permissionToEditOnResult, setPermissionToEditOnResult] = useState(permissionToEdit)
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

  // let result = toDate(dataRegister.birthDate)

  useEffect(() => {
    let isActive = true;
    async function loadFunction() {
      try {
        if (isActive) {
          // searchBanksForSelect();
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




  const [banksListOrigin, setBanksListOrigin] = useState([]);//lista original
  const [banksListFiltered, setBanksListFiltered] = useState([]);//lista apos o filtro
  const [searchBank, setSearchBank] = useState('');

  const [showModalBank, setShowModalBank] = useState(false)



  const [filterBank, setFilterBank] = useState([]);


  const searchFilterBank = (text) => {
    if (text) {
      const newData = banksListOrigin.filter(
        function (item) {
          if (item.name) {
            const itemData = item.name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          }
        });
      setBanksListFiltered(newData);
      setSearchBank(text);
    } else {
      setBanksListFiltered(banksListOrigin);
      setSearchBank(text);
    }
  };

  const selectBank = (data) => {
    // console.log(data)
    setValue("bankCode", data.code);
    setValue("bankName", data.name);
    setValue("bankFullName", data.fullName);
    setValue("bankIspb", data.ispb);
    setBankSelected('');
    setLoading(false);
  }



  function onResult(QuerySnapshot) {
    if (QuerySnapshot?.data()?.statusDriver === 'incomplete') setPermissionToEditOnResult(true)
    else setPermissionToEditOnResult(false);
  }

  function onError(error) {
    console.error(error);
  }

  //DADOS BANCARIOS
  let banksItem = banks.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.code !== null ? v.code + ' - ' + v.name : v.name} />
  })


  //buscar bancos para selecionar
  async function searchBanksForSelect() {
    setLoading(true);
    try {
      const response = await apiBanks.get();
      setLoading(false);
      setBanks(response.data);
    } catch (error) {
      console.log('ERROR: ' + error)
      setLoading(false);
    }
  }

  async function searchBankForSelect() {
    setLoading(true);
    try {
      const response = await apiBanks.get();
      setBanksListOrigin(response.data);
      setBanksListFiltered(response.data);
      setLoading(false);

      // console.log(response.data)
    } catch (error) {
      console.log('ERROR: ' + error)
      setLoading(false);
    }
  }

  //buscar bancos pelo codigo dele
  async function searchCodeBanks() {
    setLoading(true);
    if (codeBank === '') {
      alert('Insira um codigo para efetuar a busca!');
      setLoading(false);
      return;
    }
    else {
      try {
        const response = await apiBanks.get(codeBank);
        let data = response.data;
        setValue("bankCode", data.code);
        setValue("bankName", data.name);
        setValue("bankFullName", data.fullName);
        setValue("bankIspb", data.ispb);
        setBankSelected('');
        setLoading(false);
      } catch (error) {
        console.log(`ERROR: ${error}`);
        alert(error)
        setLoading(false);
      }
    }

  }

  function handleSelectBank(item) {
    let i = item
    setBankSelected(i);
    setValue("bankCode", banks[i].code);
    setValue("bankName", banks[i].name);
    setValue("bankFullName", banks[i].fullName);
    setValue("bankIspb", banks[i].ispb);

    setCodeBank('')
  }

  function setValueTest(data) {
    console.log(data)
  }

  //Generos¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬
  const genders = [
    { key: 1, gender: 'Feminino' },
    { key: 2, gender: 'Masculino' },
    { key: 3, gender: 'Outro' },
    { key: 4, gender: 'Prefiro não dizer' },
  ];
  let genderItem = genders.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.gender} />
  })

  //Grau de parentesco
  const kinship = [
    { key: 1, degree: 'Cônjugue/Companheiro' },
    { key: 2, degree: 'Mãe/Pai' },
    { key: 3, degree: 'Filha/Filho' },
    { key: 4, degree: 'Irmã/Irmão' },
    { key: 5, degree: 'Tia/Tio' },
    { key: 6, degree: 'Prima/Primo' },
  ]

  let kinshipItem = kinship.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.degree} />
  })

  let vehiclesItem = vehicleList.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.label} />
  })

  let bodyworkItem = bodyworkList?.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.label} />
  })
  
  const { setValue, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      //////////DADOS PESSOAIS
      fullName: dataRegister?.personalData?.fullName,
      //documentRg: dataRegister?.documentRg,
      contact: dataRegister?.personalData?.contact,
      documentCpf: dataRegister?.personalData?.documentCpf,
      //birthDate: dataRegister?.birthDate?.seconds,
      sexGender: dataRegister?.personalData?.sexGender,
      // documentCnh: dataRegister?.documentCnh,
      // documentCnhExpiration: dataRegister?.documentCnhExpiration?.seconds,
      documentCnhpdf: dataRegister?.personalData?.documentCnhpdf,
      documentCnhFrontImg: dataRegister?.personalData?.documentCnhFrontImg,
      documentCnhVerseImg: dataRegister?.personalData?.documentCnhVerseImg,
      documentCrlvPdf: dataRegister?.personalData?.documentCrlvPdf,
      documentCrlv: dataRegister?.personalData?.documentCrlv,
      documentCrlvImg: dataRegister?.personalData?.documentCrlvImg,
      // documentAntt: dataRegister?.documentAntt,
      //documentAnttImg: 'dateRegister?',
      documentAnttPdf: dataRegister?.personalData?.documentAnttPdf,
      documentAnttFrontImg: dataRegister?.personalData?.documentAnttFrontImg,
      documentAnttVerseImg: dataRegister?.personalData?.documentAnttVerseImg,
      //////////DADOS DE ENDEREÇO
      cep: dataRegister?.address?.cep,
      state: dataRegister?.address?.state,
      city: dataRegister?.address?.city,
      district: dataRegister?.address?.district,
      street: dataRegister?.address?.street,
      number: dataRegister?.address?.number,
      ////////CONTATO DE DOIS PARENTES
      kinshipName1: dataRegister?.kinships[0]?.name,
      kinshipContact1: dataRegister?.kinships[0]?.contact,
      kinshipDegree1: dataRegister?.kinships[0]?.degree,
      kinshipName2: dataRegister?.kinships[1]?.name,
      kinshipContact2: dataRegister?.kinships[1]?.contact,
      kinshipDegree2: dataRegister?.kinships[1]?.degree,
      ////////referência PROFISSIONAL
      professionalReferenceName1: dataRegister?.professionalReference ? dataRegister?.professionalReference[0]?.name  : 'não encontrado',
      professionalReferenceContact1: dataRegister?.professionalReference ? dataRegister?.professionalReference[0]?.contact : '',
      professionalReferenceName2: dataRegister?.professionalReference ? dataRegister?.professionalReference[1]?.name : 'não encontrado',
      professionalReferenceContact2: dataRegister?.professionalReference ? dataRegister?.professionalReference[1]?.contact : '',
      ////////Veiculo
      vehicleType: dataRegister?.vehicle?.vehicleType,
      bodyworkType: dataRegister?.vehicle?.bodyworkType,
      vehiclePlate: dataRegister?.vehicle?.vehiclePlate,
      bodyworkPlate: dataRegister?.vehicle?.bodyworkPlate,
      vehicleImg: dataRegister?.vehicle?.vehicleImg,
      ////////DADOS BANCARIOS
      bankCode: dataRegister?.dataBank?.code,
      bankName: dataRegister?.dataBank?.bankName,
      bankFullName: dataRegister?.dataBank?.bankFullName,
      bankIspb: dataRegister?.dataBank?.ispb,
      bankAgency: dataRegister?.dataBank?.agency,
      bankAccountNumber: dataRegister?.dataBank?.accountNumber,
      bankAccountDigit: dataRegister?.dataBank?.accountDigit,
      bankPix: dataRegister?.dataBank?.pix,
      bankHolderAccount: dataRegister?.dataBank?.holderAccount


    },
    resolver: yupResolver(schema)
  })

  const [minhaData, setMinhaData] = useState([]);

  async function searchCep(cep) {
    setLoading(true);
    if (cep == '') {
      // console.log()
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

  function sendData(data) {
    // console.log(data)
    Alert.alert(
      'Enviar dados para análise...',
      'Deseja encaminhar seus dados para análise?\n\n',
      [
        {
          text: "Voltar",
          onPress: () => console.log(data),
          style: "cancel"
        },
        // { text: "Continuar depois", onPress: () => upload('continue') },
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




  return (

    <ModalContainer >
      
      <ViewHeader>
        <ButtonBack onPress={() => navigation.navigate('Perfil', {})}>
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
          <>
            <Text color="#f00">Nota: Os campos com o sinal "*" no seu lado esquerdo são de preenchimento obrigatório.</Text>
          </>
        )
          : (
            <>
              <View style={{ alignItems: 'center' }}>
                <Feather
                  name="lock"
                  size={25}
                  color='rgb(4,52,203)'
                />
              </View>

              <TitleLabel>
                Neste momento, a edição de dados está desabilidata para seu perfil.
                Nestas condições é possível apenas realizar consultas.
                Caso deseje alterar algo, contate o suporte.
              </TitleLabel>
            </>
          )}


        {/* /////////////////###DADOS PESSOAIS-OPEN###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}



        <TitleLabel>MEUS DADOS PESSOAIS:</TitleLabel>
        {/* <ProfileUserData edit={permissionToEditOnResult} /> */}


        <Label><Required>*</Required>Nome completo:</Label>

        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={80}
              width="95%"
              onChangeText={onChange}
              onBlur={onBlur}//chamado quando o textInput é tocado.
              value={value}
              placeholderTextColor="#94A3B8"
              placeholder={"Seu nome aqui"}
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            />
          )}

        />
        {errors.fullName && <Text style={styles.labelError}>{errors.fullName?.message}</Text>}


        <Label><Required>*</Required>Email:</Label>
        <Input
          width="95%"
          placeholderTextColor="#ddd"
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
              maxLength={16}
              placeholderTextColor="#94A3B8"
              //onBlur={onBlur}//desativado o numero fica sem a mascara
              value={value?.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4")}
              placeholder="(99) 9 9999-9999"
              keyboardType="numeric"
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.contact ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.contact && <Text style={styles.labelError}>{errors.contact?.message}</Text>}
          
       <Label><Required>*</Required>Número de seu CPF:</Label>
        <Controller
          control={control}
          name="documentCpf"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              width="95%"
              onChangeText={onChange}
              //onBlur={onBlur}//desativado o numero fica sem a mascara
              value={value?.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
              maxLength={14}
              
              placeholder="999.999.999-99"
              keyboardType="numeric"
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.documentCpf && <Text style={styles.labelError}>{errors.documentCpf?.message}</Text>} 


        <Label><Required>*</Required>Gênero: {(permissionToEditOnResult && sexGender) ? sexGender : ''}</Label>
        {permissionToEditOnResult ? (
          <Controller
            control={control}
            name="sexGender"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                selectedValue={null}
                minWidth='90%'
                width='90%'
                accessibilityLabel={value}
                placeholderTextColor="#94A3B8"
                placeholder={`Qual o seu gênero? ${value !== undefined ? value : ''}`}
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
            <Controller
              control={control}
              name="sexGender"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="ex.: "
                  width="90%"
                  value={value}
                  editable={permissionToEditOnResult}
                  color={permissionToEditOnResult ? '#121212' : '#ddd'}

                />
              )}
            />
          </>)}

        <Label>CNH:</Label>

        <ViewBtnSelectPdfImage >

          <BtnSelectPdfImage onPress={() => { setCnhIsPdf(false) }}>
            <TextBtnSelectPdfImage>Imagem</TextBtnSelectPdfImage>
            {!cnhIsPdf && <Ionicons name="checkmark-circle" size={20} color="#0f0" />}
          </BtnSelectPdfImage>
          <Text color="#000">Ou</Text>
          <BtnSelectPdfImage onPress={() => { setCnhIsPdf(true) }}>
            <TextBtnSelectPdfImage>PDF</TextBtnSelectPdfImage>
            {cnhIsPdf && <Ionicons name="checkmark-circle" size={20} color="#0f0" />}
          </BtnSelectPdfImage>

        </ViewBtnSelectPdfImage>

        


        {cnhIsPdf ? (
          <>
            <Controller
              control={control}
              name="documentCnhpdf"
              render={({ field: { onChange, onBlur, value } }) => (
                
                <UploadPdf edit={permissionToEditOnResult} setValue={setValue} idPdf="cnhPdf" />

              )}
            />

          </>
        ) : (
          <>


            <Label><Required>*</Required>Foto da parte da frente da CNH:</Label>
            {permissionToEditOnResult ? (

              <Controller
                control={control}
                name="documentCnhFrontImg"
                render={({ field: { onChange, onBlur, value } }) => (
                  <UploadImage edit={permissionToEditOnResult} setValue={setValue} idImage="imgdocumentCnhFront" />

                )}
              />
            ) : (
              //
              <Controller
                control={control}
                name="documentCnhFrontImg"
                render={({ field: { onChange, onBlur, value } }) => (

                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{ uri: value }}
                    />
                  </View>
                )}
              />
              //        


            )}




            <Label><Required>*</Required>Foto da parte de trás da CNH:</Label>

            {permissionToEditOnResult ? (

              <Controller
                control={control}
                name="documentCnhVerseImg"
                render={({ field: { onChange, onBlur, value } }) => (
                  <UploadImage edit={permissionToEditOnResult} setValue={setValue} idImage="imgdocumentCnhVerse" />

                )}
              />
            ) : (
              //
              <Controller
                control={control}
                name="documentCnhVerseImg"
                render={({ field: { onChange, onBlur, value } }) => (

                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{ uri: value }}
                    />
                  </View>
                )}
              />
              //       

            )}
          </>
        )}


        <Label>CRLV:</Label>
        

        <ViewBtnSelectPdfImage >

          <BtnSelectPdfImage onPress={() => { setCrlvIsPdf(false) }}>
            <TextBtnSelectPdfImage>Imagem</TextBtnSelectPdfImage>
            {!crlvIsPdf && <Ionicons name="checkmark-circle" size={20} color="#0f0" />}
          </BtnSelectPdfImage>
          <Text color="#000">Ou</Text>
          <BtnSelectPdfImage onPress={() => { setCrlvIsPdf(true) }}>
            <TextBtnSelectPdfImage>PDF</TextBtnSelectPdfImage>
            {crlvIsPdf && <Ionicons name="checkmark-circle" size={20} color="#0f0" />}
          </BtnSelectPdfImage>

        </ViewBtnSelectPdfImage>

        {crlvIsPdf ? (
          <>
            <Controller
              control={control}
              name="documentCrlvPdf"
              render={({ field: { onChange, onBlur, value } }) => (
                <UploadPdf edit={permissionToEditOnResult} setValue={setValue} idPdf="crlvPdf" />

              )}
            />

          </>
        ) : (
          <>



            <Label><Required>*</Required>Foto da CRLV:</Label>
            {permissionToEditOnResult ? (

              <Controller
                control={control}
                name="documentCrlvImg"
                render={({ field: { onChange, onBlur, value } }) => (
                  <UploadImage edit={permissionToEditOnResult} setValue={setValue} idImage="imgdocumentCrlv" />

                )}
              />
            ) : (
              //
              <Controller
                control={control}
                name="documentCrlvImg"
                render={({ field: { onChange, onBlur, value } }) => (

                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{ uri: value }}
                    />
                  </View>
                )}
              />
              //        


            )}

          </>)}


        <Label>ANTT:</Label>
      

        <ViewBtnSelectPdfImage >

          <BtnSelectPdfImage onPress={() => { setAnttIsPdf(false) }}>
            <TextBtnSelectPdfImage>Imagem</TextBtnSelectPdfImage>
            {!anttIsPdf && <Ionicons name="checkmark-circle" size={20} color="#0f0" />}
          </BtnSelectPdfImage>
          <Text color="#000">Ou</Text>
          <BtnSelectPdfImage onPress={() => { setAnttIsPdf(true) }}>
            <TextBtnSelectPdfImage>PDF</TextBtnSelectPdfImage>
            {anttIsPdf && <Ionicons name="checkmark-circle" size={20} color="#0f0" />}
          </BtnSelectPdfImage>

        </ViewBtnSelectPdfImage>
        {anttIsPdf ? (
          <>
            <Controller
              control={control}
              name="documentAnttpdf"
              render={({ field: { onChange, onBlur, value } }) => (
                <UploadPdf edit={permissionToEditOnResult} setValue={setValue} idPdf="anttPdf" />

              )}
            />

          </>
        ) : (
          <>



            <Label><Required>*</Required>Foto Frente da ANTT</Label>
            {permissionToEditOnResult ? (

              <Controller
                control={control}
                name="documentAnttFrontImg"
                render={({ field: { onChange, onBlur, value } }) => (
                  <UploadImage edit={permissionToEditOnResult} setValue={setValue} idImage="imgdocumentAnttFront" />
                )}
              />
            ) : (
              //
              <Controller
                control={control}
                name="documentAnttFrontImg"
                render={({ field: { onChange, onBlur, value } }) => (

                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{ uri: value }}
                    />
                  </View>
                )}
              />
              //        


            )}
            <Label><Required>*</Required>Foto Verso da ANTT</Label>
            {permissionToEditOnResult ? (

              <Controller
                control={control}
                name="documentAnttVerseImg"
                render={({ field: { onChange, onBlur, value } }) => (
                  <UploadImage edit={permissionToEditOnResult} setValue={setValue} idImage="imgdocumentAnttVerse" />
                )}
              />
                ) : (
              //
              <Controller
                control={control}
                name="documentAnttVerseImg"
                render={({ field: { onChange, onBlur, value } }) => (

                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      source={{ uri: value }}
                    />
                  </View>
                )}
              />
              //        


            )}
          </>)}



        {/* /////////////////###DADOS PESSOAIS-CLOSE###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <Line />
        {/* /////////////////###DADOS DE SEU ENDEREÇO-OPEN--###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}





        {/* condicionado */}
        <TitleLabel>DADOS DE SEU ENDEREÇO:</TitleLabel>
        {/* <ProfileDataAddress edit={permissionToEditOnResult} /> */}




        <Label><Required>*</Required>CEP:</Label>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Controller
            control={control}
            name="cep"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                width="45%"
                maxLength={9}
                placeholderTextColor="#94A3B8"
                onChangeText={onChange}
                //onBlur={onBlur}//desativado o numero fica sem a mascara
                value={value?.replace(/^(\d{5})(\d{3})/, "$1-$2")}
                placeholder="99999-999"
                keyboardType="numeric"
                editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
                color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
                style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.cep ? '#ff375b' : '#ddd', width: '45%' }]}

              />
            )}
          />

          <Controller
            control={control}
            name="cep"
            render={({ field: { onChange, onBlur, value } }) => (

              <View style={{ width: '50%', flexDirection: 'row' }}>
                {permissionToEditOnResult ? (
                  <>

                    <TouchableOpacity onPress={() => { searchCep(value) }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {loading === false ? (
                        <Feather
                          name="search"
                          size={22}
                          color="#121212"
                          style={{ marginLeft: 5, marginRight: 3 }}
                        />
                      ) : (
                        <ActivityIndicator size={20} color="#121212" />
                      )}

                      <Text>Buscar</Text>
                    </TouchableOpacity>
                  </>
                )
                  : (<></>)}

              </View>


            )}
          />

        </View>
        {errors.cep && <Text style={styles.labelError}>{errors.cep?.message}</Text>}

        <Label><Required>*</Required>Estado:</Label>

        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              width="45%"
              placeholderTextColor="#94A3B8"
              onChangeText={onChange}
              //onBlur={onBlur}
              value={value}
              maxLength={3}
              placeholder="ex.: RS"
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.state ? '#ff375b' : '#ddd', width: '20%' }]}

            />
          )}
        />
        {errors.state && <Text style={styles.labelError}>{errors.state?.message}</Text>}

        <Label><Required>*</Required>Cidade:</Label>

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={30}
              placeholder="ex.: Porto Alegre"
              width="95%"
              placeholderTextColor="#94A3B8"
              onChangeText={onChange}
              //onBlur={onBlur}
              value={value}
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.city ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.city && <Text style={styles.labelError}>{errors.city?.message}</Text>}
        <Label><Required>*</Required>Bairro:</Label>

        <Controller
          control={control}
          name="district"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={40}
              placeholder="ex.: Praia de Belas"
              width="95%"
              placeholderTextColor="#94A3B8"
              onChangeText={onChange}
              //onBlur={onBlur}
              value={value}
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.district ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.district && <Text style={styles.labelError}>{errors.district?.message}</Text>}

        <Label><Required>*</Required>Rua:</Label>
        <Controller
          control={control}
          name="street"
          render={({ field: { onChange, onBlur, value } }) => (

            <Input
              maxLength={80}
              placeholder="ex.: Av. Padre Cacique"
              width="95%"
              placeholderTextColor="#94A3B8"
              onChangeText={onChange}
              //onBlur={onBlur}
              value={value}
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.street ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.street && <Text style={styles.labelError}>{errors.street?.message}</Text>}

        <Label><Required>*</Required>Número:</Label>
        <Controller
          control={control}
          name="number"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={15}
              placeholder="ex.: 8910"
              width="30%"
              placeholderTextColor="#94A3B8"
              onChangeText={onChange}
              //onBlur={onBlur}
              value={value}
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.number ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.number && <Text style={styles.labelError}>{errors.number?.message}</Text>}

        {/* /////////////////###DADOS DE SEU ENDEREÇO-CLOSE###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Line />
        {/* /////////////////###CONTATO DE 2 PARENTES-OPEN--###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <TitleLabel>CONTATO DE 2 PARENTES:</TitleLabel>
        {/* <SelectKinship edit={permissionToEditOnResult} kinship={1} /> */}

        <Label style={{ marginTop: '10%' }}><Required>*</Required>Nome parente 1:</Label>

        <Controller
          control={control}
          name="kinshipName1"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={80}
              width="95%"
              placeholderTextColor="#94A3B8"
              placeholder={"nome do parente 1"}
              value={value}
              onChangeText={onChange}
              editable={permissionToEditOnResult}
              color={permissionToEditOnResult ? '#121212' : '#ddd'}
            />
          )}

        />

        {errors.kinshipName1 && <Text style={styles.labelError}>{errors.kinshipName1?.message}</Text>}

        <Label><Required>*</Required>Contato parente 1:</Label>
        <Controller
          control={control}
          name="kinshipContact1"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={16}
              width="95%"
              onChangeText={onChange}
              placeholderTextColor="#94A3B8"
              //onBlur={onBlur}//desativado o numero fica sem a mascara
              value={value?.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4")}
              placeholder="(99) 9 9999-9999"
              keyboardType="numeric"
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.contact ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.kinshipContact1 && <Text style={styles.labelError}>{errors.kinshipContact1?.message}</Text>}

        {permissionToEditOnResult ? (
          <>
            <Controller
              control={control}
              name="kinshipDegree1"
              render={({ field: { onChange, onBlur, value } }) => (

                <Select
                  marginTop={1}
                  selectedValue={null}
                  minWidth='90%'
                  width='90%'
                  accessibilityLabel={value}
                  value={value}
                  placeholderTextColor="#94A3B8"
                  placeholder={`Qual o grau de parentesco? ${value !== undefined ? value : ''}`}

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
            {errors.kinshipDegree1 && <Text style={styles.labelError}>{errors.kinshipDegree1?.message}</Text>}

          </>
        )
          : (<>


            <Controller
              control={control}
              name="kinshipDegree1"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  width="80%"
                  style={{ marginTop: 10, color: '#ddd' }}
                  placeholderTextColor="#94A3B8"
                  placeholder={value}
                  value={value}
                  editable={permissionToEditOnResult}
                />
              )}

            />
          </>)}





        <Label style={{ marginTop: '10%' }}><Required>*</Required>Nome parente 2:</Label>

        <Controller
          control={control}
          name="kinshipName2"
          render={({ field: { onChange, onBlur, value } }) => (

            <Input
              maxLength={80}
              width="95%"
              placeholderTextColor="#94A3B8"
              placeholder={"nome do parente 2"}
              value={value}
              onChangeText={onChange}
              editable={permissionToEditOnResult}
              color={permissionToEditOnResult ? '#121212' : '#ddd'}
            />
          )}

        />
        {errors.kinshipName2 && <Text style={styles.labelError}>{errors.kinshipName2?.message}</Text>}

        <Label><Required>*</Required>Contato parente 2:</Label>
        <Controller
          control={control}
          name="kinshipContact2"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={16}
              width="95%"
              placeholderTextColor="#94A3B8"
              onChangeText={onChange}
              //onBlur={onBlur}//desativado o numero fica sem a mascara
              value={value?.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4")}
              placeholder="(99) 9 9999-9999"
              keyboardType="numeric"
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.contact ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.kinshipContact2 && <Text style={styles.labelError}>{errors.kinshipContact2?.message}</Text>}

        {permissionToEditOnResult ? (
          <>
            <Controller
              control={control}
              name="kinshipDegree2"
              render={({ field: { onChange, onBlur, value } }) => (

                <Select
                  marginTop={1}
                  selectedValue={null}
                  minWidth='90%'
                  width='90%'
                  accessibilityLabel={value}
                  value={value}
                  placeholderTextColor="#94A3B8"
                  placeholder={`Qual o grau de parentesco? ${value !== undefined ? value : ''}`}
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
            {errors.kinshipDegree2 && <Text style={styles.labelError}>{errors.kinshipDegree2?.message}</Text>}

          </>
        )
          : (<>

            <Controller
              control={control}
              name="kinshipDegree2"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  width="80%"
                  style={{ marginTop: 10, color: '#ddd' }}
                  placeholderTextColor="#94A3B8"
                  placeholder={value}
                  value={value}
                  editable={permissionToEditOnResult}
                />
              )}
            />
          </>)}

        {/* /////////////////###CONTATO DE 2 PARENTES-CLOSE###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Line />

        {/* /////////////////###DUAS REFERÊNCIAS PROFISSIONAIS-OPEN--###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <TitleLabel>DUAS REFERÊNCIAS PROFISSIONAIS:</TitleLabel>
        {/* <ProfileProfessionalReference edit={permissionToEditOnResult} reference={1} /> */}
        <Label style={{ marginTop: '10%' }}><Required>*</Required>Nome referência 1:</Label>

        <Controller
          control={control}
          name="professionalReferenceName1"
          render={({ field: { onChange, onBlur, value } }) => (

            <Input
              maxLength={80}
              width="95%"
              placeholderTextColor="#94A3B8" placeholder={'Nome da referência'}
              value={value}
              onChangeText={onChange}
              editable={permissionToEditOnResult}
              color={permissionToEditOnResult ? '#121212' : '#ddd'}
            />
          )}

        />
        {errors.professionalReferenceName1 && <Text style={styles.labelError}>{errors.professionalReferenceName1?.message}</Text>}

        <Label><Required>*</Required>Contato referência 1:</Label>
        <Controller
          control={control}
          name="professionalReferenceContact1"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={16}
              width="95%"
              onChangeText={onChange}
              //onBlur={onBlur}//desativado o numero fica sem a mascara
              placeholderTextColor="#94A3B8"
              value={value?.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")}
              placeholder="(99) 9999-9999"
              keyboardType="numeric"
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.contact ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.professionalReferenceContact1 && <Text style={styles.labelError}>{errors.professionalReferenceContact1?.message}</Text>}


        <Label style={{ marginTop: '10%' }}><Required>*</Required>Nome referência 2:</Label>

        <Controller
          control={control}
          name="professionalReferenceName2"
          render={({ field: { onChange, onBlur, value } }) => (

            <Input
              maxLength={80}
              width="95%"
              placeholderTextColor="#94A3B8"
              placeholder={'Nome da referência'}
              value={value}
              onChangeText={onChange}
              editable={permissionToEditOnResult}
              color={permissionToEditOnResult ? '#121212' : '#ddd'}
            />
          )}

        />
        {errors.professionalReferenceName1 && <Text style={styles.labelError}>{errors.professionalReferenceName1?.message}</Text>}

        <Label><Required>*</Required>Contato referência 2:</Label>
        <Controller
          control={control}
          name="professionalReferenceContact2"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              maxLength={16}
              width="95%"
              onChangeText={onChange}
              placeholderTextColor="#94A3B8"
              //onBlur={onBlur}//desativado o numero fica sem a mascara
              value={value?.replace(/^(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")}
              placeholder="(99) 9999-9999"
              keyboardType="numeric"
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.contact ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.professionalReferenceContact2 && <Text style={styles.labelError}>{errors.professionalReferenceContact2?.message}</Text>}

        {/* /////////////////###DUAS REFERÊNCIAS PROFISSIONAIS-CLOSE--###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Line />

        {/* /////////////////###DADOS DO VEICULO-OPEN--###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <TitleLabel>VEÍCULO</TitleLabel>
        {/* <ProfileDataVehicle edit={permissionToEditOnResult} /> */}




        <Label><Required>*</Required>Tipo do seu veículo:</Label>
        {permissionToEditOnResult ? (
          <>
            <Controller
              control={control}
              name="vehicleType"
              render={({ field: { onChange, onBlur, value } }) => (

                <Select
                  selectedValue={null}
                  minWidth='90%'
                  width='90%'
                  accessibilityLabel={value !== '' ? value : 'Qual o tipo do seu veículo?'}
                  value={value}
                  placeholderTextColor="#94A3B8"
                  placeholder={`Qual o tipo do seu veículo? ${value !== undefined ? value : ''}`}
                  _selectedItem={{
                    bg: "yellow.500",
                    endIcon: <CheckIcon size="5" />
                  }}

                  onValueChange={(itemValue) => onChange(vehicleList[itemValue].value)}
                >
                  {vehiclesItem}
                </Select>
              )}
            />
            {errors.vehicleType && <Text style={styles.labelError}>{errors.vehicleType?.message}</Text>}
          </>
        )
          : (<>
            <Controller
              control={control}
              name="vehicleType"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  width="80%"
                  style={{ marginTop: 10, color: '#ddd' }}
                  value={value}
                  placeholderTextColor="#94A3B8"
                  editable={permissionToEditOnResult}
                />
              )}
            />
          </>)}

        <Label><Required>*</Required>Placa do Veiculo:</Label>
        <Controller
          control={control}
          name="vehiclePlate"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputMask
              placeholder='ex.: ABC-1A23'
              type={'custom'}
              placeholderTextColor="#94A3B8"
              options={{
                mask: 'AAA-9*99',

              }}
              value={value}
              onChangeText={onChange}
              // value={detailPlateVehicle}
              // onChangeText={(text) => handleEditPlateVehicle(text)}
              // ref={plateVehicleRef}
              editable={permissionToEditOnResult}
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', textTransform: 'uppercase' }]}
            />
          )}
        />

        {errors.vehiclePlate && <Text style={styles.labelError}>{errors.vehiclePlate?.message}</Text>}
        <Label><Required>*</Required>Tipo de carroceria:</Label>


        {permissionToEditOnResult ? (
          <>
            <Controller
              control={control}
              name="bodyworkType"
              render={({ field: { onChange, onBlur, value } }) => (
                <Select
                  selectedValue={null}
                  value={value}
                  minWidth='90%'
                  width='90%'
                  accessibilityLabel={value}
                  placeholderTextColor="#94A3B8"
                  placeholder={`Qual o tipo de carroceria? ${value !== undefined ? value : ''}`}

                  _selectedItem={{
                    bg: "yellow.500",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  // onValueChange={(itemValue) => handleEditBodywork(itemValue)}
                  onValueChange={(itemValue) => onChange(bodyworkList[itemValue].value)}
                >
                  {bodyworkItem}
                </Select>
              )}
            />
            {errors.bodyworkType && <Text style={styles.labelError}>{errors.bodyworkType?.message}</Text>}

          </>
        )
          : (<>
            <Controller
              control={control}
              name="bodyworkType"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  width="80%"
                  style={{ marginTop: 10, color: '#ddd' }}
                  placeholderTextColor="#94A3B8"
                  value={value}
                  editable={permissionToEditOnResult}
                />
              )}
            />
          </>)}


        <Label><Required>*</Required>Placa da carroceria:</Label>
        <Controller
          control={control}
          name="bodyworkPlate"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputMask
              placeholder='ex.: ABC-1A23'
              type={'custom'}
              placeholderTextColor="#94A3B8"
              options={{
                mask: 'AAA-9*99',

              }}
              // value={detailPlateBodywork}
              value={value}
              onChangeText={onChange}
              // onChangeText={(text) => handleEditPlateBodywork(text)}
              // ref={bodyworkPlateRef}
              editable={permissionToEditOnResult}
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', textTransform: 'uppercase' }]}

            />
          )}
        />

        {errors.bodyworkPlate && <Text style={styles.labelError}>{errors.bodyworkPlate?.message}</Text>}





        <Label><Required>*</Required>Foto do veículo:</Label>
        {permissionToEditOnResult ? (

          <Controller
            control={control}
            name="vehicleImg"
            render={({ field: { onChange, onBlur, value } }) => (
              <UploadImage edit={permissionToEditOnResult} setValue={setValue} idImage="imgVehicle" />
            )}
          />
        ) : (
          //
          <Controller
            control={control}
            name="vehicleImg"
            render={({ field: { onChange, onBlur, value } }) => (

              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={{ uri: value }}
                />
              </View>
            )}
          />
          //        


        )}

        {/* /////////////////###DADOS DO VEICULO-CLOSE--###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Line />
        {/* /////////////////###DADOS BANCÁRIOS-OPEN--###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <TitleLabel>DADOS BANCÁRIOS</TitleLabel>
        {/* <SelectBankDetails edit={permissionToEditOnResult} /> */}

        <Label><Required>*</Required>Banco:</Label>
        {permissionToEditOnResult ? (
          <View>

            {/* 
            <Radio.Group name="myRadioGroup" value={methodSearchBank} onChange={nextValue => {
              setMethodSearchBank(nextValue);
            }}>
              <Radio value="select">
                Buscar por seleção
              </Radio>
              <Radio value="code" >
                Buscar pelo código
              </Radio>

            </Radio.Group> */}

            <SelectBank onPress={() => setShowModalBank(true)}>
              <Text style={{ fontSize: 12, color: 'rgb(162,164,163)' }}>Em qual banco deseja receber os pagamentos?</Text>
            </SelectBank>


            <Modal isOpen={showModalBank} onClose={() => setShowModalBank(false)} size="lg">

              <Modal.Content maxWidth="350" maxHeight="450">
                <Modal.CloseButton />
                <Modal.Header>Busque o banco pelo nome
                  <InputSearch
                    style={[styles.textInputStyle, { textTransform: 'uppercase' }]}
                    onChangeText={(text) => searchFilterBank(text)}
                    value={null}
                    placeholderTextColor="#94A3B8"
                    editable={permissionToEditOnResult}
                    underlineColorAndroid="transparent"
                    placeholder="Procure aqui"
                  />
                </Modal.Header>
                <Modal.Body>

                  <VStack space={3} >

                    {
                      banksListFiltered.map((item, index) => (
                        <ButtonBank key={index} onPress={() => {
                          selectBank(item)
                          setShowModalBank(false)
                        }}>
                          <Text>
                            - {item?.fullName}
                          </Text>
                          <Line />
                        </ButtonBank>

                      ))}

                  </VStack>

                </Modal.Body>
              </Modal.Content>
            </Modal>

            {/* 
            {methodSearchBank === 'code' ? (
              <>
                <Label>Buscar banco pelo codigo:</Label>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Input
                    maxLength={10}
                    placeholder="ex.: 10"
                    width="30%"
                    keyboardType="numeric"
                    value={codeBank}
                    onChangeText={(text) => setCodeBank(text)}
                    editable={permissionToEditOnResult}
                    color={permissionToEditOnResult ? '#121212' : '#ddd'}

                  />
                  <TouchableOpacity onPress={() => searchCodeBanks()}>
                    {loading === false ? (
                      <View flexDirection="row" alignItems="center">
                        <Feather
                          name="search"
                          size={25}
                          color="#121212"
                          style={{ marginLeft: 5 }}
                        />
                        <Text>Buscar</Text>
                      </View>
                    ) : (
                      <ActivityIndicator size={25} color="#121212" />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Label>Buscar por seleção</Label>
                <View style={{}}>
                  <Select
                    selectedValue={bankSelected}
                    minWidth='90%'
                    width='90%'
                    accessibilityLabel="Selecione o banco"
                    placeholder="Selecione o banco"
                    _selectedItem={{
                      bg: "yellow.500",
                      endIcon: <CheckIcon size="5" />,
                    }}
                    onValueChange={(itemValue) => handleSelectBank(itemValue)}
                  >
                    {banksItem}
                  </Select>
                </View >

              </>
            )} */}

          </View>
        )
          : (
            <></>
          )}


        <Controller
          control={control}
          name="bankName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{ width: '90%', borderWidth: 1, marginTop: 5, padding: 5, borderColor: '#ddd', borderRadius: 5 }}>
              <BankSelectedText color={'#121212'}>Banco selecionado:</BankSelectedText>
              <BankSelectedText color={permissionToEditOnResult ? '#121212' : '#ddd'}>{value}</BankSelectedText>
            </View>

          )}
        />
        <Label><Required>*</Required>Agência: </Label>


        <Controller
          control={control}
          name="bankAgency"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              width="30%"
              onChangeText={onChange}
              //onBlur={onBlur}
              placeholderTextColor="#94A3B8"
              maxLength={15}
              value={value}
              keyboardType="numeric"
              placeholder="ex.: 4563"
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.bankAgency ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.bankAgency && <Text style={styles.labelError}>{errors.bankAgency?.message}</Text>}



        <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center' }}>
          <View style={{ width: '50%', flexDirection: 'column' }}>
            <Label><Required>*</Required>Conta:</Label>

            <Controller
              control={control}
              name="bankAccountNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  maxLength={20}
                  placeholderTextColor="#94A3B8"
                  onChangeText={onChange}
                  //onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                  placeholder="ex.: 4563"
                  editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
                  color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
                  style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.bankAccountNumber ? '#ff375b' : '#ddd', width: '100%' }]}

                />
              )}
            />
          </View>


          <View style={{ flexDirection: 'column' }}>
            <Label></Label>
            <Text> - </Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Label><Required>*</Required>Dígito da conta:</Label>
            <Controller
              control={control}
              name="bankAccountDigit"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  width="70%"
                  maxLength={3}
                  onChangeText={onChange}
                  placeholderTextColor="#94A3B8"
                  //onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                  placeholder="ex.: 8910"
                  editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
                  color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
                  style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: '#ddd', width: '70%' }]}

                />
              )}
            />
            {errors.bankAccountDigit && <Text style={styles.labelError}>{errors.bankAccountDigit?.message}</Text>}

          </View>
        </View>
        {errors.bankAccountNumber && <Text style={styles.labelError}>{errors.bankAccountNumber?.message}</Text>}

        <Label><Required>*</Required>Chave PIX:</Label>

        <Controller
          control={control}
          name="bankPix"
          render={({ field: { onChange, onBlur, value } }) => (

            <Input
              maxLength={100}
              width="95%"
              onChangeText={onChange}
              placeholderTextColor="#94A3B8"
              //onBlur={onBlur}
              value={value}
              placeholder='CPF, Email, Telefone'
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.bankPix ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.pix && <Text style={styles.labelError}>{errors.bankPix?.message}</Text>}


        <Label><Required>*</Required>Titular da conta:</Label>

        <Controller
          control={control}
          name="bankHolderAccount"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              width="95%"
              onChangeText={onChange}
              //onBlur={onBlur}
              value={value}
              placeholderTextColor="#94A3B8"
              placeholder='Nome do titular da conta'
              editable={permissionToEditOnResult}//alterar a permissão quando a condição muda
              color={permissionToEditOnResult ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
              style={[styles.input, { color: permissionToEditOnResult ? '#121212' : '#ddd', borderColor: errors.bankHolderAccount ? '#ff375b' : '#ddd' }]}

            />
          )}
        />
        {errors.bankHolderAccount && <Text style={styles.labelError}>{errors.bankHolderAccount?.message}</Text>}
        <Text style={{ fontWeight: 'bold', color: '#f00' }}>OBS: OS DADOS BANCÁRIOS SERÃO ACEITOS APENAS EM NOME DO MOTORISTA OU DO PROPRIETÁRIO DO VEICULO.</Text>

        {/* /////////////////###DADOS BANCÁRIOS-CLOSE--###///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        <Line />




        {/* <TouchableOpacity onPress={() => setLoadingForm(false)}><Text>oi</Text></TouchableOpacity> */}
        {/* <TouchableOpacity onPress={()=>setValue("documentAnttImg", 'ola')}><Text>oi</Text></TouchableOpacity> */}


        {errors.fullName && <Text style={styles.labelError}>{errors.fullName?.message}</Text>}
        {/* {errors.documentRg && <Text style={styles.labelError}>{errors.documentRg?.message}</Text>} */}
        {errors.contact && <Text style={styles.labelError}>{errors.contact?.message}</Text>}
        {errors.documentCpf && <Text style={styles.labelError}>{errors.documentCpf?.message}</Text>}
        {errors.birthDate && <Text style={styles.labelError}>{errors.birthDate?.message}</Text>}
        {/* {errors.documentCnh && <Text style={styles.labelError}>{errors.documentCnh?.message}</Text>} */}
        {errors.documentCnhExpiration && <Text style={styles.labelError}>{errors.documentCnhExpiration?.message}</Text>}
        {errors.cep && <Text style={styles.labelError}>{errors.cep?.message}</Text>}
        {errors.state && <Text style={styles.labelError}>{errors.state?.message}</Text>}
        {errors.city && <Text style={styles.labelError}>{errors.city?.message}</Text>}
        {errors.district && <Text style={styles.labelError}>{errors.district?.message}</Text>}
        {errors.street && <Text style={styles.labelError}>{errors.street?.message}</Text>}
        {errors.number && <Text style={styles.labelError}>{errors.number?.message}</Text>}
        {errors.kinshipName1 && <Text style={styles.labelError}>{errors.kinshipName1?.message}</Text>}
        {errors.kinshipName2 && <Text style={styles.labelError}>{errors.kinshipName2?.message}</Text>}
        {errors.kinshipContact1 && <Text style={styles.labelError}>{errors.kinshipContact1?.message}</Text>}
        {errors.kinshipContact2 && <Text style={styles.labelError}>{errors.kinshipContact2?.message}</Text>}
        {errors.kinshipDegree1 && <Text style={styles.labelError}>{errors.kinshipDegree1?.message}</Text>}
        {errors.kinshipDegree2 && <Text style={styles.labelError}>{errors.kinshipDegree2?.message}</Text>}
        {errors.professionalReferenceName1 && <Text style={styles.labelError}>{errors.professionalReferenceName1?.message}</Text>}
        {errors.professionalReferenceName2 && <Text style={styles.labelError}>{errors.professionalReferenceName2?.message}</Text>}
        {errors.professionalReferenceContact1 && <Text style={styles.labelError}>{errors.professionalReferenceContact1?.message}</Text>}
        {errors.professionalReferenceContact2 && <Text style={styles.labelError}>{errors.professionalReferenceContact2?.message}</Text>}
        {errors.vehicleType && <Text style={styles.labelError}>{errors.vehicleType?.message}</Text>}
        {errors.vehiclePlate && <Text style={styles.labelError}>{errors.vehiclePlate?.message}</Text>}
        {errors.bodywork && <Text style={styles.labelError}>{errors.bodywork?.message}</Text>}
        {errors.bodyworkPlate && <Text style={styles.labelError}>{errors.bodyworkPlate?.message}</Text>}
        {errors.bankName && <Text style={styles.labelError}>{errors.bankName?.message}</Text>}
        {errors.bankFullName && <Text style={styles.labelError}>{errors.bankFullName?.message}</Text>}
        {errors.bankAgency && <Text style={styles.labelError}>{errors.bankAgency?.message}</Text>}
        {errors.bankAccountNumber && <Text style={styles.labelError}>{errors.bankAccountNumber?.message}</Text>}
        {errors.bankPix && <Text style={styles.labelError}>{errors.bankPix?.message}</Text>}
        {errors.bankHolderAccount && <Text style={styles.labelError}>{errors.bankHolderAccount?.message}</Text>}

        {permissionToEditOnResult ? (
          <>
            <ViewButtonUpload>
              {loadingForm ? (
                <>
                  <TouchableOpacity onLongPress={() => setLoadingForm(false)}>
                    <ActivityIndicator size={50} color='rgb(4,52,203)' />
                  </TouchableOpacity>
                </>) : (
                <ButtonUpload onPress={handleSubmit(sendData)} style={{ marginBottom: 20 }}>
                  <TitleButtonUpload>Enviar para análise</TitleButtonUpload >
                </ButtonUpload>
              )}
            </ViewButtonUpload>
          </>
        )
          : (
            // <ViewButtonUpload>
            //   <ButtonUpload onPress={() => alert('Não foi possível realizar nenhuma alteração.\n\nPara que isso seja possível, solicite autorização ao suporte.')} style={{ marginBottom: 20 }}>
            //     <TitleButtonUpload>Enviar para análise</TitleButtonUpload >
            //     <Feather
            //       name="lock"
            //       size={22}
            //       color="#fff"
            //     />
            //   </ButtonUpload>
            // </ViewButtonUpload>
            <ViewButtonEdit>
              <ButtonEdit onPress={() => setEditData(true)} style={{ marginBottom: 20 }}>
                <TitleButtonEdit>Editar dados</TitleButtonEdit >
                <Feather
                  name="edit"
                  size={22}
                  color="#fff"
                />
              </ButtonEdit>
            </ViewButtonEdit>

          )}


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

  )
}

export default ModalDataProfile;

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
    marginBottom: 10


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