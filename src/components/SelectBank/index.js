import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Modal, Platform, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Select, CheckIcon, Radio } from "native-base";
import { Label, Input, BankSelectedText } from '../Styles';
import { VerificationContext } from '../../contexts/registrationVerification';
import Feather from 'react-native-vector-icons/Feather';
import apiBanks from '../../services/apiBanks';

import { useForm, useWatch, Controller, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

const schema = yup.object({
  bankName: yup.string().required("*Informe o seu banco."),
  bankFullName: yup.string().required("*Informe o seu CEP."),
  agency: yup.string().min(2, "*Informe a agencia").required("*Informe a agencia."),
  accountNumber: yup.string().required("*Informe o número da conta."),
  // accountDigit: yup.number("*Somente números").required("*Informe o digito da conta."),
  pix: yup.string().required("*Informe o pix."),
  holderAccount: yup.string().required("*Informe o nome do titular da conta."),


})

export const SelectBankDetails = (props) => {
  const { dataBank, setDataBank, } = useContext(VerificationContext);
  const [banks, setBanks] = useState([]);

  const [bankSelected, setBankSelected] = useState('');
  const [bankSelectedName, setBankSelectedName] = useState(dataBank.bankName);
  const [methodSearchBank, setMethodSearchBank] = useState('code');
  const [codeBank, setCodeBank] = useState();

  const [loading, setLoading] = useState(false);

  let banksItem = banks.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.code + ' - ' + v.name} />
  })


  useEffect(() => {
    let isActive = true;

    async function loadFunction() {
      try {
        if (isActive) {
          searchBanksForSelect();
        }
      } catch (err) { }
    }
    loadFunction();
    return () => isActive = false;
  }, [])


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
        setValue("code", data.code);
        setValue("bankName", data.name);
        setValue("bankFullName", data.fullName);
        setValue("ispb", data.ispb);

        // setDataBank(
        //   {
        //     code: data.code,
        //     bankName: data.name,
        //     bankFullName: data.fullName,
        //     ispb: data.ispb,
        //     agency: dataBank.agency,
        //     accountNumber: dataBank.accountNumber,
        //     accountDigit: dataBank.accountDigit,
        //     pix: dataBank.pix,
        //     holderAccount: dataBank.holderAccount
        //   }
        // );
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
    // Getconsole.log(banks)
    //{"ispb":"18236120","name":"NU PAGAMENTOS - IP","code":260,"fullName":"NU PAGAMENTOS S.A. - INSTITUIÇÃO DE PAGAMENTO"}
    // setBankSelectedData({ code: banks[i].code, name: banks[i].fullName, ispb: banks[i].ispb });
    setValue("code", banks[i].code);
    setValue("bankName", banks[i].name);
    setValue("bankFullName", banks[i].fullName);
    setValue("ispb", banks[i].ispb);
    // setDataBank(
    //   {
    //     code: banks[i].code,
    //     bankName: banks[i].name,
    //     bankFullName: banks[i].fullName,
    //     ispb: banks[i].ispb,
    //     agency: dataBank.agency,
    //     accountNumber: dataBank.accountNumber,
    //     accountDigit: dataBank.accountDigit,
    //     pix: dataBank.pix,
    //     holderAccount: dataBank.holderAccount
    //   }
    // )
    setCodeBank('')
  }


  //code: '', name: '', ispb: '', 
  //branch: '', accountNumber: '', 
  //accountDigit: '', pix: '' 
  const { setValue, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      code: dataBank.code,
      bankName: dataBank.bankName,
      bankFullName: dataBank.bankFullName,
      ispb: dataBank.ispb,
      agency: dataBank.agency,
      accountNumber: dataBank.accountNumber,
      accountDigit: dataBank.accountDigit,
      pix: dataBank.pix,
      holderAccount: dataBank.holderAccount
    },
    resolver: yupResolver(schema)
  })


  function handleTest(data) {
    console.log(data)
  }
  return (
    <>
      <Text>OBS: os dados bancários devem ser em nome do motorista ou do propietário do veiculo</Text>

      <Label>Banco:</Label>
      {props.edit ? (
        <>
          <Radio.Group name="myRadioGroup" value={methodSearchBank} onChange={nextValue => {
            setMethodSearchBank(nextValue);
          }}>
            <Radio value="code" >
              Buscar pelo código
            </Radio>
            <Radio value="select">
              Buscar por seleção
            </Radio>
          </Radio.Group>

          {methodSearchBank === 'code' ? (
            <>
              <Label>Buscar banco pelo codigo:</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Input
                  placeholder="ex.: 10"
                  width="30%"
                  keyboardType="numeric"
                  value={codeBank}
                  onChangeText={(text) => setCodeBank(text)}
                  editable={props.edit}
                  color={props.edit ? '#121212' : '#ddd'}

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
          )}
        </>
      )
        : (
          <> </>
        )}

      <Controller
        control={control}
        name="bankName"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ width: '90%', borderWidth: 1, marginTop: 5, padding: 5, borderColor: '#ddd', borderRadius: 5 }}>
            <BankSelectedText color={'#121212'}>Banco selecionado:</BankSelectedText>
            <BankSelectedText color={props.edit ? '#121212' : '#ddd'}>{value}</BankSelectedText>
          </View>

        )}
      />
      <Label>Agência: </Label>

      <Controller
        control={control}
        name="agency"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="30%"
            onChangeText={onChange}
            //onBlur={onBlur}
            value={value}
            keyboardType="numeric"
            placeholder="ex.: 4563"
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.agency && <Text style={styles.labelError}>{errors.agency?.message}</Text>}

      <TouchableOpacity onPress={handleSubmit(handleTest)}><Text>TESTE</Text></TouchableOpacity>

      <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center' }}>
        <View style={{ width: '50%', flexDirection: 'column' }}>
          <Label>Conta:</Label>

          <Controller
            control={control}
            name="accountNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                width="100%"
                onChangeText={onChange}
                //onBlur={onBlur}
                value={value}
                keyboardType="numeric"
                placeholder="ex.: 4563"
                editable={props.edit}//alterar a permissão quando a condição muda
                color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
                style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

              />
            )}
          />
        </View>


        <View style={{ flexDirection: 'column' }}>
          <Label></Label>
          <Text> - </Text>
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Label>Dígito da conta:</Label>
          <Controller
            control={control}
            name="accountDigit"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                width="70%"
                onChangeText={onChange}
                //onBlur={onBlur}
                value={value}
                maxLength={3}
                keyboardType="numeric"
                placeholder="ex.: 8910"
                editable={props.edit}//alterar a permissão quando a condição muda
                color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
                style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

              />
            )}
          />
          {errors.accountDigit && <Text style={styles.labelError}>{errors.accountDigit?.message}</Text>}

        </View>
      </View>
      {errors.accountNumber && <Text style={styles.labelError}>{errors.accountNumber?.message}</Text>}

      <Label>Chave PIX:</Label>

      <Controller
        control={control}
        name="pix"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}
            value={value}
            placeholder='CPF, Email, Telefone'
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.pix && <Text style={styles.labelError}>{errors.pix?.message}</Text>}


      <Label>Titular da conta:</Label>

      <Controller
        control={control}
        name="holderAccount"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            width="95%"
            onChangeText={onChange}
            //onBlur={onBlur}
            value={value}
            placeholder='CPF, Email, Telefone'
            editable={props.edit}//alterar a permissão quando a condição muda
            color={props.edit ? '#121212' : '#ddd'}//alterar a cor quano é editavel ou não
            style={[styles.input, { color: props.edit ? '#121212' : '#ddd', borderColor: errors.documentCpf ? '#ff375b' : '#ddd' }]}

          />
        )}
      />
      {errors.holderAccount && <Text style={styles.labelError}>{errors.holderAccount?.message}</Text>}

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
}); 0