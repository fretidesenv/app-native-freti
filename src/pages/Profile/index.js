import React, { useContext, useState, useEffect } from 'react';
import { Modal, Platform, ActivityIndicator, View, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import { useNavigation } from '@react-navigation/native';
import { UploadPdf } from '../../components/UploadPdf';

import Ionicons from 'react-native-vector-icons/Ionicons'

import { AuthContext } from '../../contexts/auth';
import { VerificationContext } from '../../contexts/registrationVerification';
import Header from '../../components/Header'
import {
  Container,
  Name,
  Email,
  Button,
  ButtonText,
  Scroll
} from './styles'
//componentes para preenchimento de dados
import { ProfileUserImage } from '../../components/ProfileUserImage';
import firestore from '@react-native-firebase/firestore';
import config from '../../config/variables.json'

function Profile() {
  const { signOut, user, deleteAccount, revokeGoogleCredentials } = useContext(AuthContext);
  const { loadDataProfile, setPermissionToEdit } = useContext(VerificationContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusDriver, setStatusDriver] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    let isActive = true;
    //console.log(user)
    async function loadFunction() {
      try {
        if (isActive) {
          loadDataProfile();
          firestore()
            .collection('drivers_users')
            .doc(user?.uid)
            .onSnapshot(onResult, onError);
        }
      } catch (err) { }
    }
    loadFunction();
    return () => isActive = false;
  }, [])

  async function handleSignOut() {
    await signOut();
  }

  function onResult(QuerySnapshot) {
    setPermissionToEdit(QuerySnapshot.data().permissionToEdit);
    setStatusDriver(QuerySnapshot?.data()?.statusDriver)
    setOpen(false);
    if (QuerySnapshot.data().permissionToEdit === true) {

    }
  }

  function onError(error) {
    console.error(error);
  }

  async function navigationData() {
    setLoading(true);
    await loadDataProfile();
    setLoading(false)
    navigation.navigate('DataProfile');
  }

  // Função para confirmar e deletar conta
  async function handleDeleteAccount() {
    Alert.alert(
      "Deletar Conta",
      "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            // Confirmação adicional
            Alert.alert(
              "Confirmação Final",
              "Esta é sua última chance. Todos os seus dados serão perdidos permanentemente. Deseja continuar?",
              [
                {
                  text: "Cancelar",
                  style: "cancel"
                },
                {
                  text: "Sim, deletar",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      setDeletingAccount(true);
                      await deleteAccount();
                      // Se chegou aqui, a conta foi deletada com sucesso
                      // O usuário será redirecionado automaticamente pelo AuthContext
                    } catch (error) {
                      console.error('Erro ao deletar conta:', error);
                      setDeletingAccount(false);
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  }

  // Função para revogar credenciais do Google
  async function handleRevokeGoogleCredentials() {
    Alert.alert(
      "Revogar Credenciais do Google",
      "Deseja revogar o acesso do Google à sua conta? Você ainda poderá fazer login usando email e senha.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Revogar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await revokeGoogleCredentials();
              setLoading(false);
            } catch (error) {
              console.error('Erro ao revogar credenciais:', error);
              setLoading(false);
            }
          }
        }
      ]
    );
  }

  // Verifica se o usuário tem login com Google
  const hasGoogleProvider = user?.google && user?.google?.providerId === 'google.com';



  return (
    <Scroll>
      <Container>
        <Header namePage="Perfil" />

        <ProfileUserImage />

        <Name>{user?.name.split(' ')[0]} {user?.name.split(' ')[user?.name.split(' ').length - 1]}</Name>
        <Email>{user?.email}</Email>

        <Button bg={config.cor_primaria} onPress={() =>
          navigationData()
        }
        >
          <ButtonText color="#001b33">
            {statusDriver === 'incomplete' ? 'Verificação de usuário' :
              statusDriver === 'informed' ? 'Ver detalhe' :
                statusDriver === 'authorized' ? 'Ver detalhe' :
                  'Dados'} {loading && (<ActivityIndicator size={15} color='rgb(255,255,255)' />)}</ButtonText>
        </Button>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: statusDriver === 'incomplete' ? '#F00' :
                statusDriver === 'informed' ? '#000' :
                  statusDriver === 'authorized' ? `${config.cor_primaria}` : '#555',
              marginTop: 1,
              fontSize: 14,
              fontWeight: 'bold',
              padding: 5
            }}>
            {
              statusDriver === 'incomplete' ? 'CADASTRO INCOMPLETO' :
                statusDriver === 'informed' ? 'DADOS INFORMADOS' :
                  statusDriver === 'authorized' ? 'PERFIL VERIFICADO' : '...'
            }
          </Text>
        {statusDriver === 'authorized' ? <Ionicons name="checkmark-circle" size={20} color="#0f0" /> : null}

        </View>
        <Button bg="#ddd" onPress={handleSignOut}>
          <ButtonText color={"#001b33"}>Sair</ButtonText>
        </Button>

        {/* Link de exclusão de conta */}
        <TouchableOpacity 
          onPress={handleDeleteAccount}
          style={{ marginTop: 10, alignItems: 'center' }}
          disabled={deletingAccount}
        >
          {deletingAccount ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size={15} color='rgba(220, 53, 69, 0.9)' style={{ marginRight: 5 }} />
              <Text style={{ color: 'rgba(220, 53, 69, 0.9)', fontSize: 14, textDecorationLine: 'underline' }}>
                Deletando conta...
              </Text>
            </View>
          ) : (
            <Text style={{ color: 'rgba(220, 53, 69, 0.9)', fontSize: 14, textDecorationLine: 'underline' }}>
              Deletar Conta
            </Text>
          )}
        </TouchableOpacity>

        {/* Opção para revogar credenciais do Google (se aplicável) */}
        {hasGoogleProvider && (
          <Button 
            bg="rgba(220, 53, 69, 0.8)" 
            onPress={handleRevokeGoogleCredentials}
            style={{ marginTop: 10 }}
          >
            <ButtonText color={"#fff"}>
              {loading ? "Processando..." : "Revogar Acesso do Google"}
            </ButtonText>
          </Button>
        )}

        <TouchableOpacity onLongPress={async () => await BackgroundService.stop()}><Text style={{ color: '#000', marginTop: 10, fontSize: 12 }}>Versão: 18032025</Text></TouchableOpacity>

      </Container>
    </Scroll>
  )
}

export default Profile;

