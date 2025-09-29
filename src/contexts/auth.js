import { GOOGLE_KEY, SIGNAL_KEY } from "@env";
import React, { useState, createContext, useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import firebase from "@react-native-firebase/app";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

let clientID =
  GOOGLE_KEY;
GoogleSignin.configure({
  webClientId: clientID,
});

import OneSignal from "react-native-onesignal";
OneSignal.setAppId(SIGNAL_KEY);

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [number, setNumber] = useState("");

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [idNotification, setIdNotification] = useState("");

  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem("@freti");
      setIdNotification((await OneSignal.getDeviceState()).userId);
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    }
    // console.log(idNotification)
    loadStorage();
  }, []);

  //   async function test(){
  //     setIdNotification( (await OneSignal.getDeviceState()).userId)
  //   }
  // test()
  async function signInGoogle(cpf, userLocalized) {
    console.log(idNotification, userLocalized);
    setLoadingAuth(true);
    // setNumber(phoneNumber);
    // Get the users ID token

    // const { idToken } = await GoogleSignin.signIn().catch((error) => {
    //   console.log(error);
    //   setLoadingAuth(false);
    // })

    const { idToken } = await GoogleSignin.signIn().catch((error) => {
      console.log(idToken);
      console.log("aqui", error);
      setLoadingAuth(false);
      // Trate o erro de forma apropriada
    });

    //console.log(idToken);
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential

    await auth()
      .signInWithCredential(googleCredential)
      .then(async (value) => {
        //let uid = value.user.uid;
        let dataGoogle = value.additionalUserInfo;
        let dataUser = firebase.auth().currentUser;
        console.log(dataGoogle);

        if (dataGoogle.isNewUser === true) {
          setLoadingAuth(false);
          // signUpAccepted(dataGoogle, dataUser);
          signUp(dataGoogle, dataUser, cpf, userLocalized);
        } else {
          //ja é um usuario, dados apenas para login
          let date = new Date();
          let uid = dataUser.uid;
          const userProfile = await firestore()
            .collection("drivers_users")
            .doc(uid)
            .get();
          let data = {
            uid: uid,
            name: userProfile.data().name,
            email: userProfile.data().email,
            emailVerified: userProfile.data().emailVerified,
            familyName: userProfile.data().familyName,
            givenName: userProfile.data().givenName,
            phoneNumber: userProfile.data().phoneNumber,
            accountCreated: userProfile.data().accountCreated,
            cpf: userProfile.data().cpf,
            // userLocalized:  userProfile.data().userLocalized,
            google: {
              googleSub: userProfile.data().google.googleSub,
              googleAud: userProfile.data().google.googleAud,
              googleAzp: userProfile.data().google.googleAzp,
              googleExp: userProfile.data().google.googleExp,
              iat: userProfile.data().google.iat,
              iss: userProfile.data().google.iss,
              locale: userProfile.data().google.locale,
              providerId: userProfile.data().google.providerId,
            },
            profilePicture: userProfile.data().profilePicture,
            statusBuyFree: userProfile.data().statusBuyFree,
            accountCreated: userProfile.data().accountCreated,
            permissionToEdit: userProfile.data().permissionToEdit,
            lastLogin: date,
            idNotification: idNotification !== undefined ? idNotification : "",
          };

          await firestore()
            .collection("drivers_users")
            .doc(uid)
            .update({
              lastLogin: date,
              idNotification:
                idNotification !== undefined ? idNotification : "",
              userLocalized: userLocalized,
            });

          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
        }
      })
      .catch((error) => {
        console.log("erro: " + error);
        setLoadingAuth(false);
      });
  }

  async function _signUp(dataGoogle, dataUser, cpf, userLocalized) {
    setLoadingAuth(true);
    let date = new Date();

    let uid = dataUser.uid;
    await firestore()
      .collection("drivers_users")
      .doc(uid)
      .set({
        uid: uid,
        name: dataGoogle.profile.name,
        email: dataGoogle.profile.email,
        profilePicture: dataGoogle.profile.picture,
        accountCreated: date,
        lastLogin: date,
        cpf: cpf,
        userLocalized: userLocalized,
        // permissionToEdit: true,
        // authorizedFreights: false,
        statusDriver: "incomplete",
        google: {
          emailVerified: dataGoogle.profile.email_verified,
          iat: dataGoogle.profile.iat,
          iss: dataGoogle.profile.iss,
          locale: dataGoogle.profile.locale,
          googleSub: dataGoogle.profile.sub,
          googleAud: dataGoogle.profile.aud,
          googleAzp: dataGoogle.profile.azp,
          googleExp: dataGoogle.profile.exp,
          providerId: dataGoogle.providerId,
        },
        idNotification: idNotification !== undefined ? idNotification : "",
      })
      .then(() => {
        let data = {
          uid: uid,
          name: dataGoogle.profile.name,
          email: dataGoogle.profile.email,
          profilePicture: dataGoogle.profile.picture,
          accountCreated: date,
          lastLogin: date,
          cpf: cpf,
          userLocalized: userLocalized,
          statusDriver: "incomplete",
          google: {
            emailVerified: dataGoogle.profile.email_verified,
            iat: dataGoogle.profile.iat,
            iss: dataGoogle.profile.iss,
            locale: dataGoogle.profile.locale,
            googleSub: dataGoogle.profile.sub,
            googleAud: dataGoogle.profile.aud,
            googleAzp: dataGoogle.profile.azp,
            googleExp: dataGoogle.profile.exp,
            providerId: dataGoogle.providerId,
          },
          idNotification: idNotification !== undefined ? idNotification : "",
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
      });

    await firestore()
      .collection("drivers_users")
      .doc(uid)
      .collection("documents")
      .doc("allData")
      .set({
        created: new Date(),
        birthDate: new Date(),
        documentCnhExpiration: new Date(),
        kinships: [{}, {}],
        professionalReference: [{}, {}],
        vehicle: [{}, {}],
        dataBank: [{}, {}],
      });
  }

  async function ___signUp(email, password, name) {
    setLoadingAuth(true);

    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await firestore()
          .collection("users")
          .doc(uid)
          .set({
            nome: name,
            createdAt: new Date(),
          })
          .then(() => {
            let data = {
              uid: uid,
              nome: name,
              email: value.user.email,
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  async function signUp(name, email, password, confirmPassword) {
    setLoadingAuth(true);
    let date = new Date();
    console.log(date)
    await auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await firestore()
          .collection("drivers_users")
          .doc(uid)
          .set({
            uid: uid,
            name: name,
            email: email,
            accountCreated: date,
            lastLogin: date,
            cpf: '',
            permissionToEdit: true,
            // authorizedFreights: false,
            statusDriver: "incomplete",
            idNotification: idNotification || "",
          })
          .then(() => {
            let data = {
              uid: uid,
              name: name,
              email: email,
              accountCreated: date,
              lastLogin: date,
              cpf: '',
              statusDriver: "incomplete",
              idNotification: idNotification || "",
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
          });

        await firestore()
          .collection("drivers_users")
          .doc(uid)
          .collection("documents")
          .doc("allData")
          .set({
            created: new Date(),
            birthDate: new Date(),
            documentCnhExpiration: new Date(),
            kinships: [{}, {}],
            professionalReference: [{}, {}],
            vehicle: [{}, {}],
            dataBank: [{}, {}],
          });
      }).catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert('O endereço de email já está em uso.');
            break;
          case 'auth/invalid-email':
            alert('Endereço de email inválido.');
            break;
          case 'auth/operation-not-allowed':
            alert('Operação não permitida. Entre em contato com o suporte.');
            break;
          case 'auth/weak-password':
            alert('A senha é muito fraca.');
            break;
          default:
            alert('Ocorreu um erro ao tentar registrar.');
        }
      });
  }


  async function handleResetPassword(email, confirmEmail){
    if (email) {
      if(email !== confirmEmail){
        alert('Os endereços de email não coincidem.');
        return;
      }
    await  auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          alert('Email de redefinição de senha enviado com sucesso!');
        })
        .catch(error => {
          alert('Erro ao enviar email de redefinição de senha: ' + error.message);
        });
    } else {
      alert('Por favor, insira um email válido.');
    }
  };
  async function signIn(email, password) {
    setLoadingAuth(true);

    console.log(email, password);
    let date = new Date();

    await auth()
      .signInWithEmailAndPassword(email?.trim(), password)
      .then(async (value) => {
        let uid = value.user.uid;

        const userProfile = await firestore()
          .collection("drivers_users")
          .doc(uid)
          .get();

        console.log(uid);

        //console.log(userProfile.data().name)
        let _data = {
          uid: uid,
          name: userProfile.data().name,
          email: value.user.email,
        };

        let data = {
          uid: uid,
          name: userProfile?.data()?.name,
          email: userProfile?.data()?.email,
          emailVerified: userProfile?.data()?.emailVerified,
          familyName: userProfile?.data()?.familyName,
          givenName: userProfile?.data()?.givenName,
          phoneNumber: userProfile?.data()?.phoneNumber,
          accountCreated: userProfile?.data()?.accountCreated,
          cpf: userProfile?.data()?.cpf,
          // userLocalized:  userProfile?.data()?.userLocalized,
          // google: {
          //   googleSub: userProfile?.data()?.google.googleSub,
          //   googleAud: userProfile?.data()?.google.googleAud,
          //   googleAzp: userProfile?.data()?.google.googleAzp,
          //   googleExp: userProfile?.data()?.google.googleExp,
          //   iat: userProfile?.data()?.google.iat,
          //   iss: userProfile?.data()?.google.iss,
          //   locale: userProfile?.data()?.google.locale,
          //   providerId: userProfile?.data()?.google.providerId,
          // },
          profilePicture: userProfile?.data()?.profilePicture,
          statusBuyFree: userProfile?.data()?.statusBuyFree,
          accountCreated: userProfile?.data()?.accountCreated,
          permissionToEdit: userProfile?.data()?.permissionToEdit,
          lastLogin: date,
          idNotification: idNotification !== undefined ? idNotification : "",
        };
        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        // permissionFineLocation();

        return () => {};
      })
      .catch((error) => {
        console.log(error);
        switch (error.code) {
          case 'auth/invalid-email':
            alert('Endereço de email inválido.');
            break;
          case 'auth/user-disabled':
            alert('Este usuário foi desativado.');
            break;
          case 'auth/user-not-found':
            alert('Usuário não encontrado.');
            break;
          case 'auth/wrong-password':
            alert('Senha incorreta.');
            break;
          default:
            alert('Ocorreu um erro ao tentar fazer login.');
        }
        setLoadingAuth(false);
      });
  }


  const handleLogin = () => {
    setError(''); // Reset error message
    if (email && password) {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('Login successful');
        })
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              setError('Endereço de email inválido.');
              break;
            case 'auth/user-disabled':
              setError('Este usuário foi desativado.');
              break;
            case 'auth/user-not-found':
              setError('Usuário não encontrado.');
              break;
            case 'auth/wrong-password':
              setError('Senha incorreta.');
              break;
            default:
              setError('Ocorreu um erro ao tentar fazer login.');
          }
        });
    } else {
      setError('Por favor, insira email e senha.');
    }
  };






  const permissionFineLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Localização",
        message:
          "Para o App funcionar corretamente, ele precisa de acesso à localização.",
        buttonNegative: "Cancelar",
        buttonPositive: "OK",
      }
    );
    const granted2 = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: "Localização",
        message:
          "Para o App funcionar corretamente, ele precisa de acesso à localização em segundo plano.",
        negativeButton: "Cancelar",
        positiveButton: "OK",
      }
    );

    if (granted && granted2 === PermissionsAndroid.RESULTS.GRANTED) {
      // setAccessFineLocation(true)
    } else {
      alert(
        "Localização de carga negada, o app pode não funcionar corretamente."
      );
    }
  };

  async function signOut() {
    await auth().signOut();
    await AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  async function storageUser(data) {
    await AsyncStorage.setItem("@freti", JSON.stringify(data));
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        signIn,
        signUp,
        signInGoogle,
        signOut,
        loadingAuth,
        loading,
        user,
        setUser,
        storageUser,
        handleResetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
