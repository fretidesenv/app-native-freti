import React, { useState, useContext, useRef } from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import {
  Container,
  ButtonText,
  Logo,
  BtnTerms,
  TextError,
  ViewLogo,
  Input,
  BtnLogin,
  BtnEditAction,
  TxtBtnEditAction,
} from "./styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../contexts/auth";
import { TextInputMask } from "react-native-masked-text";
import firestore from "@react-native-firebase/firestore";
import * as Animatable from "react-native-animatable";
import { PLATAFORM_IS_IOS } from "../../handler/permissions";

const LogoAnimated = Animatable.createAnimatableComponent(Logo);

function Login() {
  const { signInGoogle, signIn, signUp, handleResetPassword } = useContext(AuthContext);
 
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorNotAccepted, setErrorNotAccepted] = useState(false);
  const [numCpf, setNumCpf] = useState("");
  const numCpfRef = useRef(null);
  const termOfUse =
    "https://www.fortio.com.br/termos/termos-e-condicoes-de-uso/";
  const [modalVerifyCpf, setModalVerifyCpf] = useState(false);

  const [methodLogin, setMethodLogin] = useState(""); 
  const [editingCpf, setEditingCpf] = useState(false); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [actionScreen, setActionScreen] = useState("login");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const verifyCpf = async () => {
    const unMaskCpf = numCpfRef?.current.getRawValue();

    await validateCpf(unMaskCpf) 
      .then((result) => {
        console.log(unMaskCpf, result);
        if (result) {
          if (methodLogin === "email") {
            signIn(email, password);
          } else {
            onGoogleButtonPress().then(() =>
              console.log("Signed in with Google!")
            );
          }
        } else {
          setModalVerifyCpf(true);
        }
      })
      .catch((err) => {});
  };

  const validateCpf = async (strCPF) => {
    let soma;
    let resto;
    soma = 0;
    if (strCPF == "00000000000") return false;

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

    let userLocalized = [];

    await firestore()
      .collection("drivers_users")
      .where("cpf", "==", unMaskCpf)
      .get()
      .then((querySnapshot) => {
        querySnapshot?.forEach((doc) => {
          userLocalized?.push({
            cpf: unMaskCpf,
            email: doc?.data().email,
            userUid: doc?.id,
          });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      })
      .then(() => {
        signInGoogle(unMaskCpf, userLocalized);
      });
  }
  function accept() {
    setErrorNotAccepted(false);
    setAcceptedTerms(!acceptedTerms);
  }

  function toggleLogin() {
    setLogin(!login);
    setName("");
    setEmail("");
    setPassword("");
  }


  const loginStep = (method) => {
    if (method === "email") {
      signIn(email, password);
    }
  };
  async function handleSignIn() {
    if (email === "" || password === "") {
      alert("Preencha todos os campos!");
      return;
    }

    await signIn(email, password).then();
  }

  async function handleSignUp() {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Preencha todos os campos para cadastrar!");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não conferem!");
      return;
    }

    await signUp(name, email, password, confirmPassword);
  }

  const action = () => {
    setLoadingLogin(true);
    if (actionScreen === "login") {
      console.log("Action Login");
      handleSignIn(email, password)
        .then(() => {
          setLoadingLogin(false);
        })
        .catch(() => {
          setLoadingLogin(false);
        });
    } else if (actionScreen === "register") {
      console.log("Action Register");
      handleSignUp()
        .then(() => {
          setLoadingLogin(false);
        })
        .catch(() => {
          setLoadingLogin(false);
        });
    } else if(actionScreen === "reset_password"){
      handleResetPassword(email, confirmEmail).then(() => {
        setLoadingLogin(false);
      })
      .catch(() => {
        setLoadingLogin(false);
      });
    }
  };

  //  

  if (actionScreen === "login") {
    return (
      <>
        <StatusBar hidden />
        <KeyboardAvoidingView
          behavior={PLATAFORM_IS_IOS ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Container>  
              <ViewLogo>
                {/* <LogoAnimated animation="flipInY" source={require('../../assets/logo_1.png')} /> */}
                <LogoAnimated
                  animation="flipInY"
                  source={require("../../assets/logo_freti_v4.png")} 
                />
                
              </ViewLogo> 
              
              {editingCpf ? (
                <>
                  <TextInputMask
                    placeholder="seu CPF"
                    placeholderTextColor={"rgba(0,0,0,.5)"}
                    style={styles.input}
                    type={"cpf"}
                    value={numCpf}
                    onChangeText={(text) => setNumCpf(text)}
                    ref={numCpfRef}
                  />

                  <BtnLogin onPress={() => verifyCpf()}>
                    <ButtonText>Continuar</ButtonText>
                  </BtnLogin>

                  <BtnLogin
                    onPress={() => setEditingCpf(false)}
                    style={{ backgroundColor: "rgba(0,0,0,.4)" }}
                  >
                    <ButtonText>Voltar</ButtonText>
                  </BtnLogin>
                </>
              ) : (
                <>
                  <BtnTerms
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => Linking.openURL(termOfUse)}
                  >
                    <Ionicons
                      name="reader-sharp"
                      size={20}
                      color="rgb(4,52,203)"
                    />
                    <Text style={{ color: "rgb(4,52,203)", fontSize: 15 }}>
                      Ler os termos e condições de uso do app
                    </Text>
                  </BtnTerms>

                  <BtnTerms
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => accept()}
                  >
                    {acceptedTerms === true ? (
                      <Ionicons name="checkbox" size={20} color="#111" />
                    ) : (
                      <Ionicons name="stop-outline" size={20} color="#111" />
                    )}
                    <Text style={{ color: "#111", fontSize: 15 }}>
                      Eu li e aceito os termos e condições.
                    </Text>
                  </BtnTerms>

                  <Input
                    style={{ marginTop: 10, color: "rgba(50,50,50,1)" }}
                    placeholder={"email@email.com"}
                    placeholderTextColor="#999999"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                  />
                  <Input
                    style={{ marginTop: 10, color: "rgba(50,50,50,1)" }}
                    placeholder={"*****"}
                    placeholderTextColor="#999999"
                    value={password}
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                  />

                  {
                    // acceptedTerms === true && numCpf.length > 15 ?
                    acceptedTerms === true ? (
                      <>
                        {loadingLogin ? (
                          <BtnLogin>
                            <ActivityIndicator
                              size={25}
                              color="rgb(255,49,0)"
                            />
                          </BtnLogin>
                        ) : (
                          <BtnLogin onPress={() => action("email")}>
                            <ButtonText>Entrar</ButtonText>
                          </BtnLogin>
                        )}
                      </>
                    ) : (
                      <BtnLogin
                        style={{ backgroundColor: "rgba(4,52,203, .2)" }}
                        onPress={() =>
                          alert(
                            "Para prosseguir é necessário aceitar os termos e condições de uso e preencher o campo contato."
                          ) & setErrorNotAccepted(true)
                        }
                      >
                        <ButtonText>Entrar</ButtonText>
                      </BtnLogin>
                    )
                  }
                  <BtnEditAction
                    onPress={() => setActionScreen("register")}
                    style={{ marginTop: "1%" }}
                  >
                    <TxtBtnEditAction>Criar Conta</TxtBtnEditAction>
                  </BtnEditAction>
                  <BtnEditAction
                    onPress={() => setActionScreen("reset_password")}
                    style={{ marginTop: "1%" }}
                  >
                    <TxtBtnEditAction>Recuperar senha</TxtBtnEditAction>
                  </BtnEditAction>

                </>
              )}

              {errorNotAccepted === true ? (
                <TextError style={{ color: "#f00" }}>
                  *Para continuar é necessário aceitar os termos e condições de
                  uso do app.
                </TextError>
              ) : (
                <></>
              )}

             
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    );
  } else if (actionScreen === "register") {
    return (
      <>
        <StatusBar hidden />
        <KeyboardAvoidingView
          behavior={PLATAFORM_IS_IOS ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Container>
              <ViewLogo>
                {/* <LogoAnimated animation="flipInY" source={require('../../assets/logo_1.png')} /> */}
                <LogoAnimated
                  animation="flipInY"
                  source={require("../../assets/logo_freti_V1.png")} 
                />
              </ViewLogo> 

              {/* <Container> */}
              {/* <Label>Nome:</Label> */}
              <Input
                style={{ color: "rgba(50,50,50,1)" }}
                placeholder={"Nome e Sobrenome"}
                placeholderTextColor="#999999"
                value={name}
                onChangeText={(text) => setName(text)}
              />

              {/* <Label>E-mail:</Label> */}
              <Input
                style={{ color: "rgba(50,50,50,1)" }}
                placeholder={"Seu e-mail"}
                placeholderTextColor="#999999"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />

              {/* <Label>Senha:</Label> */}
              <Input
                style={{ color: "rgba(50,50,50,1)" }}
                placeholder={"Senha"}
                placeholderTextColor="#999999"
                value={password}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
              />

              {/* <Label>Confirme a senha:</Label> */}
              <Input
                style={{ color: "rgba(50,50,50,1)" }}
                placeholder={"Confirme a senha"}
                placeholderTextColor="#999999"
                value={confirmPassword}
                secureTextEntry
                onChangeText={(text) => setConfirmPassword(text)}
              />

              <BtnTerms
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "4%",
                }}
                onPress={() => Linking.openURL(termOfUse)}
              >
                <Ionicons
                  name="document-text-sharp"
                  size={20}
                  color="rgb(4,52,203)"
                />
                <Text style={{ color: "rgb(4,52,203)", fontSize: 15 }}>
                  Ler os termos e condições de uso do app.
                </Text>
              </BtnTerms>

              <BtnTerms
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "1%",
                }}
                onPress={() => accept()}
              >
                {acceptedTerms === true ? (
                  <Ionicons name="checkbox" size={20} color="#111" />
                ) : (
                  <Ionicons name="stop-outline" size={20} color="#111" />
                )}
                <Text style={{ color: "#111", fontSize: 15 }}>
                  Eu li e aceito os termos e condições.
                </Text>
              </BtnTerms>
              {acceptedTerms === true ? (
                <>
                  {loadingLogin ? (
                    <BtnLogin>
                      <ActivityIndicator size={25} color="rgb(255,49,0)" />
                    </BtnLogin>
                  ) : (
                    <BtnLogin onPress={() => action()}>
                      <ButtonText>Registrar-se</ButtonText>
                    </BtnLogin>
                  )}
                </>
              ) : (
                <BtnLogin
                  onPress={() =>
                    alert(
                      "Para prosseguir é necessário aceitar os termos e condições de uso."
                    )
                  }
                  style={{ backgroundColor: "rgba(4,52,203, .2)" }}
                >
                  <ButtonText>Registrar-se</ButtonText>
                </BtnLogin>
              )}

              <BtnEditAction onPress={() => setActionScreen("login")}>
                <TxtBtnEditAction>Ir para Login</TxtBtnEditAction>
              </BtnEditAction>
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    );
  }else  if (actionScreen === "reset_password") {
    return (
      <>
        <StatusBar hidden />
        <KeyboardAvoidingView
          behavior={PLATAFORM_IS_IOS ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Container>
              <ViewLogo>
                {/* <LogoAnimated animation="flipInY" source={require('../../assets/logo_1.png')} /> */}
                <LogoAnimated
                  animation="flipInY"
                  source={require("../../assets/logo_freti_v4.png")} 
                />
              </ViewLogo>

              {/* <Label>Contato:</Label> */}

              {editingCpf ? (
                <>
                  <TextInputMask
                    placeholder="seu CPF"
                    placeholderTextColor={"rgba(0,0,0,.5)"}
                    style={styles.input}
                    type={"cpf"}
                    value={numCpf}
                    onChangeText={(text) => setNumCpf(text)}
                    ref={numCpfRef}
                  />

                  <BtnLogin onPress={() => verifyCpf()}>
                    <ButtonText>Continuar</ButtonText>
                  </BtnLogin>

                  <BtnLogin
                    onPress={() => setEditingCpf(false)}
                    style={{ backgroundColor: "rgba(0,0,0,.4)" }}
                  >
                    <ButtonText>Voltar</ButtonText>
                  </BtnLogin>
                </>
              ) : (
                <>
                  <BtnTerms
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => Linking.openURL(termOfUse)}
                  >
                    <Ionicons
                       name="reader-sharp"
                      size={20}
                      color="rgb(4,52,203)"
                    />
                    <Text style={{ color: "rgb(4,52,203)", fontSize: 15 }}>
                      Ler os termos e condições de uso do app
                    </Text>
                  </BtnTerms>

                  <BtnTerms
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => accept()}
                  >
                    {acceptedTerms === true ? (
                      <Ionicons name="checkbox" size={20} color="#111" />
                    ) : (
                      <Ionicons name="stop-outline" size={20} color="#111" />
                    )}
                    <Text style={{ color: "#111", fontSize: 15 }}>
                      Eu li e aceito os termos e condições.
                    </Text>
                  </BtnTerms>
                  <Text
                         style={{ marginTop: 10, color: "rgba(50,50,50,1)" }}
                  >Informe o e-mail</Text>
                  <Input
                    style={{ marginTop: 10, color: "rgba(50,50,50,1)" }}
                    placeholder={"email@email.com"}
                    placeholderTextColor="#999999"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                  />
                  <Text
                         style={{ marginTop: 10, color: "rgba(50,50,50,1)" }}
                  >Confirme o e-mail</Text>
                   <Input
                    style={{ marginTop: 2, color: "rgba(50,50,50,1)" }}
                    placeholder={"email@email.com"}
                    placeholderTextColor="#999999"
                    value={confirmEmail}
                    onChangeText={(text) => setConfirmEmail(text)}
                  />

                  {
                    // acceptedTerms === true && numCpf.length > 15 ?
                    acceptedTerms === true ? (
                      <>
                        {loadingLogin ? (
                          <BtnLogin>
                            <ActivityIndicator
                              size={25}
                              color="rgb(255,49,0)"
                            />
                          </BtnLogin>
                        ) : (
                          <BtnLogin onPress={() => action("email")}>
                            <ButtonText>Recuperar</ButtonText>
                          </BtnLogin>
                        )}
                      </>
                    ) : (
                      <BtnLogin
                        style={{ backgroundColor: "rgba(4,52,203, .2)" }}
                        onPress={() =>
                          alert(
                            "Para prosseguir é necessário aceitar os termos e condições de uso e preencher o campo contato."
                          ) & setErrorNotAccepted(true)
                        }
                      >
                        <ButtonText>Recuperar</ButtonText>
                      </BtnLogin>
                    )
                  }
                  <BtnEditAction
                    onPress={() => setActionScreen("register")}
                    style={{ marginTop: "1%" }}
                  >
                    <TxtBtnEditAction>Criar Conta</TxtBtnEditAction>
                  </BtnEditAction>      


                  <BtnEditAction onPress={() => setActionScreen("login")}>
                <TxtBtnEditAction>Ir para Login</TxtBtnEditAction>
              </BtnEditAction>
                 
                </>
              )}

              {errorNotAccepted === true ? (
                <TextError style={{ color: "#f00" }}>
                  *Para continuar é necessário aceitar os termos e condições de
                  uso do app.
                </TextError>
              ) : (
                <></>
              )}

            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  input: {
    borderBottomColor: "#0434cb",
    borderBottomWidth: 2,
    marginBottom: 10,
    fontSize: 18,
    width: "80%",
    textAlign: "center",
    color: "#0434cb",
  },
  scrollView: {
    flex: 1,
    justifyContent: "center",
  },
});
