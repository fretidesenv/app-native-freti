import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Linking,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  Container,
  Title,
  ButtonText,
  ImgGoogle,
  ButtonGoogle,
  Logo,
  BtnTerms,
  TextError,
  Label,
  ViewLogo,
  Input,
  BtnLogin,
} from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../../contexts/auth';
import {TextInputMask} from 'react-native-masked-text';
import firestore from '@react-native-firebase/firestore';

import * as Animatable from 'react-native-animatable';

import {Button, Modal, VStack} from 'native-base';

const TitleAnimated = Animatable.createAnimatableComponent(Title);

const LogoAnimated = Animatable.createAnimatableComponent(Logo);

function Login() {
  const {signInGoogle, signIn, loadingAuth} = useContext(AuthContext);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorNotAccepted, setErrorNotAccepted] = useState(false);
  const [numCpf, setNumCpf] = useState('');
  const numCpfRef = useRef(null);
  const termOfUse = 'https://www.fortio.com.br/site/termos/termos-e-condicoes-de-uso/';
  const [modalVerifyCpf, setModalVerifyCpf] = useState(false);

  const [methodLogin, setMethodLogin] = useState('');
  const [editingCpf, setEditingCpf] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const verifyCpf = async () => {
    const unMaskCpf = numCpfRef?.current.getRawValue();
    let arrayCpf = unMaskCpf.split('');
    // console.log(arrayCpf);

    await validateCpf(unMaskCpf)
      .then(result => {
        console.log(unMaskCpf, result);
        if (result) {
          if (methodLogin === 'email') {
            signIn(email, password);
          } else {
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            );
          }
        } else {
          setModalVerifyCpf(true);
        }
      })
      .catch(err => {});
    // console.log(arrayCpf.length);
  };

  const validateCpf = async strCPF => {
    let soma;
    let resto;
    soma = 0;
    if (strCPF == '00000000000') return false;

    for (i = 1; i <= 9; i++)
      soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCPF.substring(9, 10))) return false;

    soma = 0;
    for (i = 1; i <= 10; i++)
      soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
  };

  async function onGoogleButtonPress() {
    const unMaskCpf = numCpfRef?.current.getRawValue();
    // console.log(unMaskCpf)
    // let userIdLocalized = null;
    let userLocalized = [];

    await firestore()
      .collection('drivers_users')
      .where('cpf', '==', unMaskCpf)
      .get()
      .then(querySnapshot => {
        querySnapshot?.forEach(doc => {
          userLocalized?.push({
            cpf: unMaskCpf,
            email: doc?.data().email,
            userUid: doc?.id,
          });
          // console.log(doc.id, " => ", doc.data().email);
        });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      })
      .then(() => {
        // setModalVerifyCpf(true);
        signInGoogle(unMaskCpf, userLocalized);
      });

    // signInGoogle();
  }
  function accept() {
    setErrorNotAccepted(false);
    setAcceptedTerms(!acceptedTerms);
  }

  function toggleLogin() {
    setLogin(!login);
    setName('');
    setEmail('');
    setPassword('');
  }

  // async function handleEdit() {
  //   const unMaskCpf = numCpfRef?.current.getRawValue();
  //     console.log(unMaskCpf)

  // }

  const loginStep = method => {
    // setEditingCpf(true);
    // setMethodLogin(method);
    if (method === 'email') {
      signIn(email, password);

    }
  };

  return (
    <>
      <StatusBar hidden />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <Container>
            <ViewLogo>
              {/* <LogoAnimated animation="flipInY" source={require('../../assets/logo_1.png')} /> */}
              <LogoAnimated
                animation="flipInY"
                source={require('../../assets/logo_freti_V1.png')} 
              />
            </ViewLogo>

            {/* <Label>Contato:</Label> */}

            {editingCpf ? (
              <>
      
                <TextInputMask
                  placeholder="seu CPF"
                  placeholderTextColor={'rgba(0,0,0,.5)'}
                  style={styles.input}
                  type={'cpf'}
                  value={numCpf}
                  onChangeText={text => setNumCpf(text)}
                  ref={numCpfRef}
                />

                <BtnLogin onPress={() => verifyCpf()}>
                  <ButtonText>Continuar</ButtonText>
                </BtnLogin>

                <BtnLogin
                  onPress={() => setEditingCpf(false)}
                  style={{backgroundColor: 'rgba(0,0,0,.4)'}}>
                  <ButtonText>Voltar</ButtonText>
                </BtnLogin>
              </>
            ) : (
              <>
                        <BtnTerms
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => Linking.openURL(termOfUse)}>
                  <Ionicons
                    name="md-reader-sharp"
                    size={20}
                    color="rgb(4,52,203)"
                  />
                  <Text style={{color: 'rgb(4,52,203)', fontSize: 15}}>
                    Ler os termos e condições de uso do app
                  </Text>
                </BtnTerms>

                <BtnTerms
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => accept()}>
                  {acceptedTerms === true ? (
                    <Ionicons name="checkbox" size={20} color="#111" />
                  ) : (
                    <Ionicons name="stop-outline" size={20} color="#111" />
                  )}
                  <Text style={{color: '#111', fontSize: 15}}>
                    Eu li e aceito os termos e condições.
                  </Text>
                </BtnTerms>

                <Input
                  width="80%"
                  style={{marginTop: 10, color: 'rgba(50,50,50,1)'}}
                  placeholder={'email@email.com'}
                  placeholderTextColor="#999999"
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
                <Input
                  width="80%"
                  style={{marginTop: 10, color: 'rgba(50,50,50,1)'}}
                  placeholder={'*****'}
                  placeholderTextColor="#999999"
                  value={password}
                  secureTextEntry 
                  onChangeText={text => setPassword(text)}
                />

                {
                  // acceptedTerms === true && numCpf.length > 15 ?
                  acceptedTerms === true ? (
                    <BtnLogin onPress={() => loginStep('email')}>
                      <ButtonText>Entrar</ButtonText>
                    </BtnLogin>
                  ) : (
                    <BtnLogin
                      style={{backgroundColor: 'rgba(4,52,203, .2)'}}
                      onPress={() =>
                        alert(
                          'Para prosseguir é necessário aceitar os termos e condições de uso e preencher o campo contato.',
                        ) & setErrorNotAccepted(true)
                      }>
                      <ButtonText>Entrar</ButtonText>
                    </BtnLogin>
                  )
                }
                {/* <BtnLogin>
          <ButtonText>Entrar</ButtonText>
        </BtnLogin> */}

                {/* <Text style={{color: 'rgba(50,50,50,1)', fontSize: 15}}>
                  Ou
                </Text>

                {
                  // acceptedTerms === true && numCpf.length > 15 ?
                  acceptedTerms === true ? (
                    <ButtonGoogle
                      style={{backgroundColor: 'rgba(4,52,203, 1)'}}
                      google_icon
                      onPress={() => loginStep('google')}>
                      <ImgGoogle
                        source={require('../../assets/google_icon.png')}
                      />
                      {loadingAuth ? (
                        <ActivityIndicator size={20} color="#fff" />
                      ) : (
                        <ButtonText>Entrar com Google</ButtonText>
                      )}
                    </ButtonGoogle>
                  ) : (
                    <ButtonGoogle
                      style={{backgroundColor: 'rgba(4,52,203, .2)'}}
                      google_icon
                      onPress={() =>
                        alert(
                          'Para prosseguir é necessário aceitar os termos e condições de uso e preencher o campo contato.',
                        ) & setErrorNotAccepted(true)
                      }>
                      <ImgGoogle
                        source={require('../../assets/google_icon.png')}
                      />
                      {loadingAuth ? (
                        <ActivityIndicator size={20} color="#fff" />
                      ) : (
                        <ButtonText>Entrar com Google</ButtonText>
                      )}
                    </ButtonGoogle>
                  ) */}
                
              </>
            )}

            {errorNotAccepted === true ? (
              <TextError style={{color: '#f00'}}>
                *Para continuar é necessário aceitar os termos e condições de
                uso do app.
              </TextError>
            ) : (
              <></>
            )}

            {/* <Modal
              isOpen={modalVerifyCpf}
              onClose={() => setModalVerifyCpf(false)}
              size="lg">
              <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>CPF inválido!</Modal.Header>
                <Modal.Body>
                  <VStack space={3}>
                    <Text fontWeight="medium">
                      Para fazer login é necessário que informe corretamente o
                      seu CPF.
                    </Text>
                  </VStack>
                </Modal.Body>
                <Modal.Footer justifyContent="space-between">
                  <Button
                    bg="rgb(4,52,203)"
                    width="20%"
                    onPress={() => {
                      setModalVerifyCpf(false);
                    }}>
                    OK
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal> */}
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

export default Login;

const styles = StyleSheet.create({
  input: {
    borderBottomColor: '#0434cb',
    borderBottomWidth: 2,
    marginBottom: 10,
    fontSize: 18,
    width: '80%',
    textAlign: 'center',
    color: '#0434cb',
  },
  scrollView: {
    flex: 1,
    justifyContent: 'center',
  },
});
