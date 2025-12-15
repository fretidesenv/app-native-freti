import { GOOGLE_KEY, SIGNAL_KEY } from "@env";
import React, { useState, createContext, useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import firebase from "@react-native-firebase/app";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { PermissionsHandler } from "../handler/permissions";

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

  // Função para solicitar permissões após login bem-sucedido
  async function requestPermissionsAfterLogin() {
    try {
      console.log('🔐 Solicitando permissões após login...');
      // Solicita todas as permissões necessárias, com foco em localização
      await PermissionsHandler.requestAllPermission((deniedPermissions) => {
        if (deniedPermissions.length > 0) {
          console.log('⚠️ Algumas permissões foram negadas:', deniedPermissions);
        } else {
          console.log('✅ Todas as permissões foram concedidas');
        }
      });
    } catch (error) {
      console.error('Erro ao solicitar permissões após login:', error);
    }
  }

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
          // Solicita permissões após login bem-sucedido
          requestPermissionsAfterLogin();
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
        // Solicita permissões após cadastro bem-sucedido
        requestPermissionsAfterLogin();
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
            // Solicita permissões após cadastro bem-sucedido
            requestPermissionsAfterLogin();
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
          groupId: userProfile?.data()?.groupId,
        };
        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        // Solicita permissões após login bem-sucedido
        requestPermissionsAfterLogin();

        return () => {};
      })
      .catch((error) => {
        console.log('Erro no login:', error.code, error.message);
        switch (error.code) {
          case 'auth/invalid-email':
            alert('Endereço de email inválido.');
            break;
          case 'auth/user-disabled':
            alert('Este usuário foi desativado.');
            break;
          case 'auth/user-not-found':
            alert('Usuário não encontrado. Verifique se o email está correto ou crie uma conta.');
            break;
          case 'auth/wrong-password':
            alert('Senha incorreta.');
            break;
          case 'auth/invalid-credential':
          case 'auth/invalid-login':
            alert('Credenciais inválidas. Verifique se o email e senha estão corretos. Se você é um novo usuário, crie uma conta primeiro.');
            break;
          default:
            alert('Ocorreu um erro ao tentar fazer login: ' + (error.message || error.code));
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

  // Função para revogar credenciais do Google
  async function revokeGoogleCredentials() {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('Nenhum usuário autenticado');
      }

      // Verifica se o usuário tem login com Google
      const providers = currentUser.providerData;
      const hasGoogleProvider = providers.some(provider => provider.providerId === 'google.com');

      if (!hasGoogleProvider) {
        alert('Você não possui credenciais do Google vinculadas à sua conta.');
        return;
      }

      // Verifica se há outros provedores além do Google
      const remainingProviders = providers.filter(p => p.providerId !== 'google.com');
      
      if (remainingProviders.length === 0) {
        alert('Não é possível revogar o Google pois é o único método de autenticação. Para remover completamente, você precisará deletar sua conta. Você ainda pode desativar o acesso nas configurações da sua conta do Google.');
        return;
      }

      // Desconecta do Google Sign-In
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (googleError) {
        console.log('Erro ao revogar acesso do Google Sign-In (pode ser ignorado):', googleError);
      }

      // Remove dados do Google do Firestore
      const uid = currentUser.uid;
      const userDoc = await firestore()
        .collection("drivers_users")
        .doc(uid)
        .get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData.google) {
          const { google, ...dataWithoutGoogle } = userData;
          await firestore()
            .collection("drivers_users")
            .doc(uid)
            .set(dataWithoutGoogle, { merge: false });
        }
      }

      // Tenta desvincular o provedor Google do Firebase Auth (se houver outros provedores)
      try {
        const googleProvider = providers.find(p => p.providerId === 'google.com');
        if (googleProvider) {
          // Nota: unlink() só funciona se houver múltiplos provedores
          // Se der erro, significa que o Google é o único provedor
          await currentUser.unlink('google.com');
        }
      } catch (unlinkError) {
        console.log('Não foi possível desvincular o Google do Firebase Auth (pode ser o único provedor):', unlinkError);
      }

      alert('Credenciais do Google revogadas com sucesso! Os dados do Google foram removidos do aplicativo. Você ainda pode fazer login usando email e senha.');
    } catch (error) {
      console.error('Erro ao revogar credenciais do Google:', error);
      alert('Erro ao revogar credenciais do Google: ' + error.message);
    }
  }

  // Função para deletar a conta do usuário
  async function deleteAccount() {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('Nenhum usuário autenticado');
      }

      // const uid = currentUser.uid;

      // Deleta todas as subcoleções e documentos relacionados
      // 1. Deleta documentos da subcoleção "documents"
      // const documentsRef = firestore()
      //   .collection("drivers_users")
      //   .doc(uid)
      //   .collection("documents");
      
      // const documentsSnapshot = await documentsRef.get();
      // const deleteDocumentsPromises = documentsSnapshot.docs.map(doc => doc.ref.delete());
      // await Promise.all(deleteDocumentsPromises);

      // // 2. Deleta documentos da subcoleção "myFreightsList"
      // const myFreightsRef = firestore()
      //   .collection("drivers_users")
      //   .doc(uid)
      //   .collection("myFreightsList");
      
      // const myFreightsSnapshot = await myFreightsRef.get();
      // const deleteFreightsPromises = myFreightsSnapshot.docs.map(doc => doc.ref.delete());
      // await Promise.all(deleteFreightsPromises);

      // // 3. Deleta o documento principal do usuário
      // await firestore()
      //   .collection("drivers_users")
      //   .doc(uid)
      //   .delete();

      // 4. Se o usuário fez login com Google, revoga o acesso
      const providers = currentUser.providerData;
      const hasGoogleProvider = providers.some(provider => provider.providerId === 'google.com');
      
      if (hasGoogleProvider) {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        } catch (googleError) {
          console.log('Erro ao revogar acesso do Google (pode ser ignorado):', googleError);
        }
      }

      // 5. Deleta a conta do Firebase Auth
      await currentUser.delete();

      // 6. Limpa o AsyncStorage
      await AsyncStorage.clear();

      // 7. Limpa o estado do usuário
      setUser(null);

      alert('Conta deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      
      // Tratamento de erros específicos
      if (error.code === 'auth/requires-recent-login') {
        alert('Por segurança, você precisa fazer login novamente antes de deletar sua conta. Faça logout e login novamente, depois tente deletar a conta.');
      } else {
        alert('Erro ao deletar conta: ' + error.message);
      }
      
      throw error;
    }
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
        deleteAccount,
        revokeGoogleCredentials,
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
