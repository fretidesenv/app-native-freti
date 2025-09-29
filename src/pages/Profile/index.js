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
  const { signOut, user } = useContext(AuthContext);
  const { loadDataProfile, setPermissionToEdit } = useContext(VerificationContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [statusDriver, setStatusDriver] = useState('');

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

        <TouchableOpacity onLongPress={async () => await BackgroundService.stop()}><Text style={{ color: '#000', marginTop: 10, fontSize: 12 }}>Versão: 18032025</Text></TouchableOpacity>

      </Container>
    </Scroll>
  )
}

export default Profile;

