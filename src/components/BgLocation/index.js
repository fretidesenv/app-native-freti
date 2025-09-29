import React, { useEffect, useState, useContext } from 'react';
import { Text, PermissionsAndroid, ScrollView, Linking } from 'react-native';
import { AuthContext } from '../../contexts/auth'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button, Modal, VStack, } from "native-base";


import {
  Container,
  Title,
  TextInfo,
  BtnPermission,
  BtnConfirm,
  BtnSupport,
  ImageModal
} from './styles'


// import Geolocation from '@react-native-community/geolocation';

export default function BgLocation(props) {
  const { user } = useContext(AuthContext);
  const [accessFineLocation, setAccessFineLocation] = useState(false);
  const [accessBackgroundLocation, setAccessBackgroundLocation] = useState(false);

  const [showModalMessage, setShowModalMessage] = useState(false)
  const [showModalImage, setShowModalImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // será utilizado para armazenar alguma mensagem de erro, caso ocorra
  const [coords, setCoords] = useState(null);   //vai armazenar a localização atual
  // criando um useEffect que será executado uma vez quando o Hook for chamado (parâmetro passado ao fim da função é vazio).
  useEffect(() => {

    verifyPermissionFineLocation();
    verifyPermissionBackgroundLocation();

    return () => { }



  }, [])


  const verifyPermissionFineLocation = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted) {
      setAccessFineLocation(true)
    }
  };


  const verifyPermissionBackgroundLocation = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );
    if (granted) {
      setAccessBackgroundLocation(true)
    }
  }





  const permissionFineLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Localização",
        message: "Para o App funcionar corretamente, ele precisa de acesso à localização.",
        buttonNegative: "Cancelar",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setAccessFineLocation(true)
    } else {
      alert('Localização de carga negada, o app pode não funcionar corretamente.');
    }
  };


  const _permissionBackgroundLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: "Localização",
        message: "Para o App funcionar corretamente, ele precisa de acesso à localização em segundo plano..",
        buttonNegative: "Cancelar",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setAccessBackgroundLocation(true)
    } else {
      alert('Localização de carga negada, o app pode não funcionar corretamente.');
    }
  }
  const permissionBackgroundLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: "Localização",
        message: "Para o App funcionar corretamente, ele precisa de acesso à localização em segundo plano.",
        negativeButton: "Cancelar",
        positiveButton: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setAccessBackgroundLocation(true)
    } else {
      alert('Localização de carga negada, o app pode não funcionar corretamente.');
    }
  }
  

  const nextStatus = () => {
    props.closeModal()
    if (props.page === 'MyFreightList') {
      props.takeATrip()
    } else if (props.page === 'DetailsFreight') {
      props.messageAlert()
    }

  }

  return (
    <Container>
      <ScrollView>
        <Title size={'25px'}>Atenção</Title>


        <Title size={'18px'}>Neste momento iremos solicitar-lhe duas permissões especiais.</Title>
        <TextInfo size={'16px'} mgtop={'5px'}>
          Fique tranquilo, só utilizaremos durante o período
          que estiver realizando o frete conosco.
        </TextInfo>
        <TextInfo size={'16px'} mgtop={'5px'}>As permissões são:</TextInfo>
        <TextInfo size={'16px'} mgtop={'1px'} style={{ textDecorationLine: 'underline' }}>1. Localização.</TextInfo>
        <TextInfo size={'16px'} mgtop={'1px'} style={{ textDecorationLine: 'underline' }}>2. Localização em segundo plano (enquanto o aplicativo estiver fechado).</TextInfo>
        <TextInfo size={'16px'} mgtop={'5px'}>
          O intuito de solicitarmos a sua localização é para rastrear a carga que estará transportando.
          Com essas permissões a cada 30 minutos iremos coletar automaticamente as coordenadas,
          lembrando que isso acontecerá apenas enquanto estiver realizando um frete conosco.
        </TextInfo>

        <Title size={'18px'}>Para permitir, siga os passos abaixo:</Title>

        <TextInfo size={'16px'} mgtop={'5px'}>1. Localização, clique no botão a baixo para permitir.</TextInfo>
        <BtnPermission onPress={() => permissionFineLocation()}>

          <TextInfo size={'16px'} mgtop={'0px'} style={{ textAlign: 'center' }}>
            {accessFineLocation ? 'Localização concedida' : 'Permitir localização'} {accessFineLocation ? <Ionicons name="checkmark-circle" size={20} color="#0f0" /> : null}

          </TextInfo>

        </BtnPermission>

        {accessFineLocation === true ? (
          <>
            <TextInfo size={'16px'} mgtop={'5px'}>2. Localização em segundo plano, clique no botão a baixo para permitir.</TextInfo>

            <BtnPermission onPress={() => setShowModalMessage(true)}>
              <TextInfo size={'16px'} mgtop={'0px'} style={{ textAlign: 'center' }}>
                {accessBackgroundLocation ? 'Localização em 2º plano concedida' : 'Permitir localização em 2º plano'} {accessBackgroundLocation ? <Ionicons name="checkmark-circle" size={20} color="#0f0" /> : null}
              </TextInfo>
            </BtnPermission>
          </>
        ) : null
        }





        {accessBackgroundLocation === true || accessFineLocation === true ? (//localizacao alterada
          <>
            <TextInfo size={'16px'} mgtop={'4px'}>
              Pronto, agora já pode confirmar a realização dessa viagem!
            </TextInfo>

            <BtnConfirm onPress={() => nextStatus()}>
              <TextInfo size={'16px'} mgtop={'0px'} style={{ textAlign: 'center' }}>
                {props.page === 'DetailsFreight' ? 'Voltar' : 'Confirmar viagem'}
                {accessBackgroundLocation ? <Ionicons name="checkmark-circle" size={20} color="rgba(0,180,55, 1)" /> : null}
              </TextInfo>
            </BtnConfirm>
          </>
        ) : null
        }


        <TextInfo size={'15px'} mgtop={'100px'} style={{ textAlign: 'center' }}>
          Caso esteja com problemas para prosseguir, entre em cotato com o suporte.
        </TextInfo>

        <BtnSupport onPress={() => {
          Linking.openURL(`https://api.whatsapp.com/send/?phone=55${props.numberSupport}}&text=Olá! Meu nome é ${user.name}, desejo ter mais informações referente ao frete id:${props.numberSerial}&app_absent=0`)

        }}>
          <TextInfo size={'16px'} mgtop={'0px'} style={{ textAlign: 'center' }}>
            Suporte <MaterialCommunityIcons
              name="whatsapp"
              size={20}
              color="#fff"
            />
          </TextInfo>

        </BtnSupport>




        <Modal isOpen={showModalMessage} onClose={() => setShowModalMessage(false)} width="100%" >

          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Atenção</Modal.Header>
            <Modal.Body>

              <VStack space={3}>
                <Text style={{ color: '#000' }}>
                  Na próxima tela você verá um exemplo de ativação de localização em segundo plano,
                  isso será semelhante em seu aparelho.
                </Text>
                <Text style={{ color: '#000' }} >
                  Depois disso, ao clicar em "Permissões" será direcionado
                  para as configurações onde poderá permitir acesso a localização em segundo plano.
                </Text>
              </VStack>

            </Modal.Body>
            <Modal.Footer justifyContent="center" >
              <Button backgroundColor={"rgba(4, 52, 203, 1)"} width="50%" marginTop="2%" onPress={() => {
                setShowModalMessage(false) & setShowModalImage(true)
              }}>
                Proximo
              </Button>


            </Modal.Footer>
          </Modal.Content>
        </Modal>












        <Modal isOpen={showModalImage} onClose={() => setShowModalImage(false)} width="100%" >
          <ImageModal style={{ aspectRatio: .6, resizeMode: 'contain' }}
            source={require('../../assets/permission/permission6.jpg')}
          />

          <Button backgroundColor={"rgba(4, 52, 203, 1)"} width="50%" marginTop="2%" onPress={() => {
            setShowModalImage(false) & permissionBackgroundLocation()
          }}>
            Permissões
          </Button>

        </Modal>

      </ScrollView>
    </Container >
  );
}