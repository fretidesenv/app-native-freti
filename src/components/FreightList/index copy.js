import React, { useState, useContext } from 'react';
import {
  Container,
  Name,
  Header,
  Avatar,
  ContentView,
  Content,
  Actions,
  LikeButton,
  Like,
  TimePost,
  ButtonMore,
  TextMore,
  ModalViewDetails,
  ButtonCloseModal,
  TextCloseModal,
  LineModal,
  TitleDetails,
  CompanyLogo,
  Line,
  AvatarImg
} from './styles'
import { View, TouchableOpacity, Image, Linking, Alert, StyleSheet } from 'react-native';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import { useNavigation } from '@react-navigation/native'

import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Button, Modal, VStack, HStack, Text, Radio, Center, NativeBaseProvider, ScrollView } from "native-base";
import Feather from 'react-native-vector-icons/Feather';


import { AuthContext } from '../../contexts/auth';
import database from '@react-native-firebase/database';

import { Mask } from './formater';

function FreightList({ data, userId, userAuthorizedFreights }) {

  const { user } = useContext(AuthContext);

  const navigation = useNavigation();
  const [likePost, setLikePost] = useState(data?.likes)
  const [modalDetails, setModalDetails] = useState(false);
  const [showModalSupport, setShowModalSupport] = useState(false);
  const [showModalGetFreight, setShowModalGetFreight] = useState(false);
  const [showModalInLine, setShowModalInLine] = useState(false);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [showModalUserAuthorized, setShowModalUserAuthorized] = useState(false);
  const [rowDrivers, setRowDrivers] = useState(0);
  const [imLine, setImLine] = useState(false)
  async function handleLikePost(id, likes) {
    const docId = `${userId}_${id}`;

    //Checar se o post já foi curtido
    const doc = await firestore().collection('likes')
      .doc(docId).get();

    if (doc.exists) {
      //Que dizer que já curtiu esse post, entao precisamos remover o like
      await firestore().collection('posts')
        .doc(id).update({
          likes: likes - 1
        })

      await firestore().collection('likes').doc(docId)
        .delete()
        .then(() => {
          setLikePost(likes - 1)
        })

      return;

    }


    // Precisamos dar o like no post
    await firestore().collection('likes')
      .doc(docId).set({
        postId: id,
        userId: userId
      })

    await firestore().collection('posts')
      .doc(id).update({
        likes: likes + 1
      })
      .then(() => {
        setLikePost(likes + 1)
      })


  }

  function formatTimeRegistration() {
    // console.log(new Date(data.created.seconds * 1000));
    const dateRegistration = new Date(data?.registrationTime.seconds * 1000);

    return formatDistance(
      new Date(),
      dateRegistration,
      {
        locale: ptBR
      }
    )
  }


  function getFreight() {
    // Você já está na fila, agora é só aguardar.
    if (imLine === true) {
      Alert.alert(
        'Você já está na fila, agora é só aguardar!',
        `Motoristas na fila: ${rowDrivers}`
      );
    } else {
      Alert.alert(
        'Você deseja realizar essa viagem?',
        '',
        [
          {
            text: "não, Voltar",
            onPress: () => viewLine(data.id),
            style: "cancel"
          },
          { text: "" },
          { text: "Sim, desejo!", onPress: () => getInLine(data.id) },
        ]

      );
    }
  }

  function getInLine(id) {
    if (userAuthorizedFreights === true) {

      firestore().collection(`freights/${id}/queue`)
        .doc(user.uid)
        .set({ driver_user: user.uid, hora: new Date() })
        .then(() => {
          firestore().collection(`drivers_users/${user.uid}/myFreightsList`)
            .doc(id)
            .set({ driver_user: user.uid, registrationInLineTime: new Date() }).then(() => { setShowModalAlert(true) })
        }).catch((error) => console.log(error))
    } else {
      setShowModalUserAuthorized(true)
    }
  }

  function viewLine(id) {
    const subscriber = firestore()
      .collection(`freights/${id}/queue`)
      .onSnapshot(querySnapshot => {
        const users = [];

        querySnapshot.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        })

        //console.log(users.length);
        let verify = [users.find(item => item.key == user.uid)]
        if (verify[0]?.key === user.uid) {
          setImLine(true);
        } else setImLine(false);
        setRowDrivers(users.length)
      })



    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }
  return (
    <Container>
      <Header
      //  onPress={() => navigation.navigate("PostsUser", { title: data.autor, userId: data.userId })}
      >
        {data.freightLessor.logo ? (
          <AvatarImg
            source={{ uri: data?.freightLessor.logo }}
          />
        ) : (
          <Avatar>
            <MaterialCommunityIcons
              name="factory"
              size={20}
              color="#fff"
            />
          </Avatar>
        )}
        <Name numberOfLines={2}>
          {data?.freightLessor.name}
        </Name>
        {imLine ?? <Text fontWeight="bold" style={{ color: '#0b9104' }}>na fila</Text>}
      </Header>

      <ContentView>
        <Content>Origem: {data?.originCity} - {data?.originState}</Content>
        <Content>Destino: {data?.destinyCity} - {data?.destinyState} </Content>
        <Content><Mask value={data?.distance} type="km" /> </Content>
      </ContentView>

      <Actions>
        <ButtonMore onPress={() => setModalDetails(!modalDetails) & viewLine(data.id)}>
          <TextMore style={{}}>
            Ver mais
          </TextMore>
        </ButtonMore>
        <TimePost>
          há {formatTimeRegistration()}
          {/* {formatTimePost()} */}
        </TimePost>
      </Actions>
      {/* 
      <Modal
        visible={modalDetails}
        animationType="slide"
        transparent={true}
      >
        <View style={{ backgroundColor: 'rgba(0,0,0,.5)', flex: 1 }}>
          <ModalViewDetails>
            <Text>opa, modal</Text>
          </ModalViewDetails>
          <ButtonCloseModal
            onPress={() => setModalDetails(!modalDetails)}>
            <TextCloseModal style={{ color: '#fff', fontSize: 18 }}>VOLTAR</TextCloseModal>
          </ButtonCloseModal>
        </View>
      </Modal> */}

      <Modal isOpen={modalDetails} onClose={() => setModalDetails(false)}>
        <Modal.Content width="95%" height="95%">

          <Modal.CloseButton />
          <Modal.Header>Detalhes deste frete</Modal.Header>

          <Modal.Body >
            <VStack space={0}>
              <ScrollView>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginBottom: 3 }}>
                  <Text>Motoristas na fila: {rowDrivers}</Text>

                  <Text>Estou na fila? {imLine ? (<Text fontWeight="bold" style={{ color: '#0b9104' }}>Sim</Text>) : (<Text>Não</Text>)}</Text>
                </View>
                <TitleDetails>LOCADOR DO FRETE:</TitleDetails>

                <LineModal>
                  <Text fontWeight="medium">Empresa: </Text>
                  <Text>{data?.freightLessor.name} </Text>
                </LineModal>



                <TitleDetails>ORIGEM:</TitleDetails>
                {/* <LineModal>
                  <Text fontWeight="medium">Empresa: </Text>
                  <Text>{data?.originCompany}</Text>
                </LineModal> */}

                <LineModal>
                  <Text fontWeight="medium">Localidade: </Text>
                  <Text>{data?.originCity} - {data?.originState}</Text>
                </LineModal>

                {/* {data.originCompanyLogo ?
                  (<CompanyLogo
                    style={{}}
                    source={{
                      uri: data?.originCompanyLogo,
                    }}
                  />) : null} */}

                <Line />
                <TitleDetails>DESTINO:</TitleDetails>
                {/* <LineModal>
                  <Text fontWeight="medium">Empresa: </Text>
                  <Text>{data?.destinationCompany}</Text>
                </LineModal> */}
                <LineModal>
                  <Text fontWeight="medium">Localidade: </Text>
                  <Text>{data?.destinyCity} - {data?.destinyState}</Text>
                </LineModal>

                {/* {data.destinationCompanyLogo ?
                  (<CompanyLogo
                    style={{}}
                    source={{
                      uri: data?.destinationCompanyLogo,
                    }}
                  />) : null} */}

                <Line />
                <TitleDetails>DATAS E HORÁRIOS:</TitleDetails>
                <LineModal>
                  <Text fontWeight="medium">Data da coleta: </Text>
                  <Text>22/05/2022</Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Horário da coleta: </Text>
                  <Text>12:00</Text>
                </LineModal>

                <LineModal>
                  <Text fontWeight="medium">Data da entrega: </Text>
                  <Text>23/05/2022</Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Horário da entrega: </Text>
                  <Text>10:00 às 18:00</Text>
                </LineModal>

                <Line />
                <TitleDetails>VEÍCULO REQUERIDO:</TitleDetails>
                <LineModal>
                  <Text fontWeight="medium">Tipo: </Text>
                  <Text>{data?.requiredVehicle}</Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Carroceria: </Text>
                  <Text>{data?.requiredBodywork}</Text>
                </LineModal>

                <Line />
                <TitleDetails>DETALHES DA CARGA:</TitleDetails>
                <LineModal>
                  <Text fontWeight="medium">Tipo: </Text>
                  <Text>{data?.productType}</Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Produto: </Text>
                  <Text>{data?.productName}</Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Peso: </Text>
                  <Text> <Mask value={data?.cargoWeight} type="kg" /></Text>

                </LineModal>
                <Line />
                <TitleDetails>DETALHES DA VIAGEM:</TitleDetails>

                <LineModal>
                  <Text fontWeight="medium">Quilometragem: </Text>

                  <Text> <Mask value={data?.distance} type="km" /> </Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Valor: </Text>
                  <Text> R$<Mask value={data?.valueFreight} type="reais" /> </Text>
                </LineModal>

                <Line />
                <TitleDetails>Observação:</TitleDetails>
                <LineModal>
                  <Text>{data?.observationFreight}</Text>
                </LineModal>

          

              </ScrollView>
            </VStack>
          </Modal.Body>



          <Modal.Footer justifyContent="space-between" >
            <Button backgroundColor="rgba(255,0,0, .7)" width="20%" onPress={() => {
              setModalDetails(false);
            }}>
              Voltar
            </Button>

            <Button backgroundColor="rgba(37,211,102, 1)" width="15%" onPress={() => {
              setShowModalSupport(true);
            }}>
              <MaterialCommunityIcons
                name="whatsapp"
                size={25}
                color="#fff"
              />
            </Button>

            {imLine ? (
              <>
                <Button backgroundColor="rgb(4,52,203)" width="50%" onPress={() => {
                  // getFreight();
                  setShowModalInLine(true)
                }}>
                  Pegar frete
                </Button>
              </>) : (
              <>
                <Button backgroundColor="rgb(4,52,203)" width="50%" onPress={() => {
                  // getFreight();
                  setShowModalGetFreight(true)
                }}>
                  Pegar frete
                </Button>
              </>
            )
            }

          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* if (imLine === true) {
      Alert.alert(
        'Você já está na fila, agora é só aguardar!',
        `Motoristas na fila: ${rowDrivers}`
      );
    } else {
      Alert.alert(
        'Você deseja realizar essa viagem?',
        '',
        [
          {
            text: "não, Voltar",
            onPress: () => viewLine(data.id),
            style: "cancel"
          },
          { text: "" },
          { text: "Sim, desejo!", onPress: () => getInLine(data.id) },
        ]

      );
    } */}

      <Modal isOpen={showModalGetFreight} onClose={() => setShowModalGetFreight(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          {/* <Modal.Header>A qualidade da foto ficou boa?</Modal.Header> */}
          <Modal.Body>
            <VStack space={3}>
              {/* {imLine &&
                <>
                  <Text fontWeight="medium">Você já está na fila, agora é só aguardar! </Text>
                  <Text fontWeight="medium">Motoristas na fila: <Text fontWeight="bold">{rowDrivers}</Text></Text>
                </>
              } */}
              {rowDrivers !== 0 && <Text fontWeight="medium">Já existem {rowDrivers} motoristas na fila!</Text>}
              {imLine === false && <Text fontWeight="medium">Você deseja realizar essa viagem?</Text>}
            </VStack>

          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            {imLine === true ? (
              <>
                <Button width="45%" bg="rgb(4,52,203)" onPress={() => {
                  setShowModalGetFreight(false)

                }}>
                  OK
                </Button>
              </>
            ) : (
              <>
                <Button width="45%"  bg="rgb(4,52,203)" onPress={() => {
                  setShowModalGetFreight(false)
                  //& openCamera();
                }}>
                  Não
                </Button>
                <Button width="45%" bg="rgb(4,52,203)" onPress={() => {
                  setShowModalGetFreight(false)
                    //& setModalDetails(false)
                    & getInLine(data.id)
                }}>
                  Sim
                </Button>
              </>
            )}


          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showModalInLine} onClose={() => setShowModalInLine(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          {/* <Modal.Header>A qualidade da foto ficou boa?</Modal.Header> */}
          <Modal.Body>
            <VStack space={3}>
              {imLine &&
                <>
                  <Text fontWeight="medium">Você já está na fila, agora é só aguardar! </Text>
                  <Text fontWeight="medium">Motoristas na fila: <Text fontWeight="bold">{rowDrivers}</Text></Text>
                </>
              }
            </VStack>

          </Modal.Body>
          <Modal.Footer justifyContent="space-between">

            <>
              <Button width="45%"  bg="rgb(4,52,203)"  onPress={() => {
                setShowModalInLine(false)

              }}>
                OK
              </Button>
            </>



          </Modal.Footer>
        </Modal.Content>
      </Modal>


      <Modal isOpen={showModalSupport} onClose={() => setShowModalSupport(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Suporte</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Text>Você deseja entrar em contato com o suporte?</Text>
            </VStack>

          </Modal.Body>
          <Modal.Footer justifyContent="center" >

            <Button width="80%" bg="rgba(37,211,102, 1)"  onPress={() => {
              Linking.openURL(`https://api.whatsapp.com/send/?phone=${data?.freight?.phoneRespContractFreigtage}&text=Olá! Meu nome é ${user.givenName}, desejo ter mais informações referente ao frete id:${data.id}&app_absent=0`)

            }}>
              <View  style={{alignItems: 'center' }} >
              <Text color="#fff" fontWeight="bold" textAlign="center" >Sim, continuar para o WhatsApp!</Text>
              <MaterialCommunityIcons
                name="whatsapp"
                size={25}
                color="#fff"
              />
              </View>
            </Button>




          </Modal.Footer>
        </Modal.Content>
      </Modal>




      <Modal isOpen={showModalAlert} onClose={() => setShowModalAlert(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />

          <Modal.Body>
            <VStack space={3}>
              <Text fontWeight="bold">Agora você está na fila!</Text>
              <Text fontWeight="bold">Por gentileza, aguarde nosso retorno!</Text>
              <Line />
              <Text fontWeight="bold">Enquanto isso você pode:</Text>
              <Text >- consultar aos fretes em que já faz parte da fila clicando no botão <Text fontWeight="bold">"Meus fretes" </Text>.</Text>
              <Text>ou</Text>
              <Text >- continuar visualizando outros fretes clicando no botão <Text fontWeight="bold">"Mais"</Text>.</Text>

            </VStack>

          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            <Button width="45%" bg="rgb(4,52,203)"  onPress={() => {
              setShowModalAlert(false)

            }}>
              Mais
            </Button>
            <Button width="45%" bg="rgb(4,52,203)"  onPress={() => {
              navigation.navigate('MeusFretes')
              setShowModalAlert(false)

            }}>
              Meus fretes
            </Button>

          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showModalUserAuthorized} onClose={() => setShowModalUserAuthorized(false)} size="lg">
        <Modal.Content maxWidth="350">

          <Modal.Header>Atenção</Modal.Header>
          <Modal.CloseButton />
          <Modal.Body>
            <VStack space={3}>
              <Text fontWeight="bold">Seu perfil ainda não foi verificado, portanto ainda não está autorizado a realizar fretes por este meio.</Text>
              <Text fontWeight="bold"></Text>

            </VStack>

          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            <Button backgroundColor="rgb(4,52,203)" width="50%" onPress={() => {
              // getFreight();
              //setShowModalInLine(true)
              navigation.navigate('DataProfile')
            }}>
              Iniciar verificação
            </Button>

          </Modal.Footer>
        </Modal.Content>
      </Modal>


    </Container>
  )
}
export default FreightList;

