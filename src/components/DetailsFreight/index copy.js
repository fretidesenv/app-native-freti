import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
  Alert,
} from 'react-native';
import Header from '../Header';
import {
  Container,
  Name,
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
  AvatarImg,
  StatusFreightDriver,
  TextStatusFreightDriver,
  TextButton,
  BtnInit,
  ModalPermissions,
  BtnErrorPermission,
  TextBtnError,
} from './styles';
import {
  Button,
  Modal,
  VStack,
  HStack,
  Text,
  Radio,
  Center,
  NativeBaseProvider,
  ScrollView,
  Fab,
  Box,
  Icon,
} from 'native-base';

import {useNavigation, useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, {Marker} from 'react-native-maps';

// import Geolocation from '@react-native-community/geolocation';
import {Mask} from './formater';

import BgLocation from '../BgLocation';

import {AuthContext} from '../../contexts/auth';
import {formatDistance} from 'date-fns/esm';
import BackgroundService from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';

import {UploadImageFreight} from '../UploadImageFreight';
import {set} from 'date-fns';

export default function DetailsFreight({route}) {
  const navigation = useNavigation();
  const [idFreight, setIdFreight] = useState(route.params.idFreight);
  const [myFreight, setMyFreight] = useState(null);
  const [userData, setUserData] = useState(user);
  const [resultStatusFreightDriver, setResultStatusFreightDriver] =
    useState('');
  const dateCollect = new Date(myFreight?.clientOrigin?.dateCollect);
  const dateCollectDay = dateCollect.getDate();
  const dateCollectMonth = dateCollect.getMonth() + 1;
  const dateCollectYear = dateCollect.getFullYear();

  const dateDelivery = new Date(
    myFreight?.clientDelivery?.timeDelivery?.dateDelivery,
  );
  const dateDeliveryDay = dateDelivery.getDate();
  const dateDeliveryMonth = dateDelivery.getMonth() + 1;
  const dateDeliveryYear = dateDelivery.getFullYear();
  const hourStartDelivery =
    myFreight?.clientDelivery?.timeDelivery?.hourStartDelivery;
  const hourEndDelivery =
    myFreight?.clientDelivery?.timeDelivery?.hourEndDelivery;

  const [showModalConfirmDelivery, setShowModalConfirmDelivery] =
    useState(false);
  const [showModalStage, setShowModalStage] = useState(false);

  const [accessFineLocation, setAccessFineLocation] = useState(false);
  const [accessBackgroundLocation, setAccessBackgroundLocation] =
    useState(false);

  const [alertPermissionLocation, setAlertPermissionLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [modalPermissionsVisible, setModalPermissionsVisible] = useState(false);

  const {user} = useContext(AuthContext);

  const [positionMy, setPositionMy] = useState({
    latitude: 1,
    longitude: 2,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [regionOrigin, setRegionOrigin] = useState({
    latitude: 1,
    longitude: 2,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [positionOrigin, setPositionOrigin] = useState({
    latitude: 3,
    longitude: 4,
  });

  const [regionDelivery, setRegionDelivery] = useState({
    latitude: 1,
    longitude: 1,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [positionDelivery, setPositionDelivery] = useState({
    latitude: 1,
    longitude: 2,
  });

  useEffect(() => {
    const subscriber = firestore()
      .collection('freight')
      // .collection('freight_teste') __temp_
      .doc(idFreight)
      .onSnapshot(documentSnapshot => {
        setMyFreight(documentSnapshot.data());

        console.log(
          documentSnapshot.data()?.firstDelivery?.coordinates
            ?.latitude,
          documentSnapshot.data()?.firstDelivery?.coordinates
            ?.longitude,
          documentSnapshot.data()?.lastDelivery
            ?.coordinates?.latitude,
          documentSnapshot.data()?.lastDelivery
            ?.coordinates?.longitude,
        );
        setRegionOrigin({
          // latitude: documentSnapshot.data()?.firstDelivery?.coordinates?.latitude,
          // longitude: documentSnapshot.data()?.firstDelivery?.coordinates?.longitude,
          latitude: -122.084,
          longitude: 37.4219983,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        console.log();
        setPositionOrigin({
          // latitude: documentSnapshot.data()?.firstDelivery?.coordinates?.latitude,
          // longitude: documentSnapshot.data()?.firstDelivery?.coordinates?.longitude,
          latitude: -122.084,
          longitude: 37.4219983,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setRegionDelivery({
          // latitude: documentSnapshot.data()?.lastDelivery?.coordinates?.latitude,
          // longitude: documentSnapshot.data()?.lastDelivery?.coordinates?.longitude,
          latitude: -122.084,
          longitude: 37.4219983,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setPositionDelivery({
          // latitude: documentSnapshot.data()?.lastDelivery?.coordinates?.latitude,
          // longitude: documentSnapshot.data()?.lastDelivery?.coordinates?.longitude,
          latitude: -122.084,
          longitude: 37.4219983,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        getLocation();
      });

    viewLine();
    return () => subscriber();
  }, [idFreight]);

  function formatTimeRegistration() {
    // console.log(new Date(data.created.seconds * 1000));
    const dateRegistration = new Date(
      myFreight?.registrationInLineTime.seconds * 1000,
    );

    return formatDistance(new Date(), dateRegistration, {
      locale: ptBR,
    });
  }

  function viewLine() {
    let id = idFreight;
    const subscriber = firestore()
      .collection(`freight/${idFreight}/queue`)
      // .collection(`freight_teste/${idFreight}/queue`) __temp_
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        setResultStatusFreightDriver(documentSnapshot.data().status);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  async function getLocation() {
    Geolocation.getCurrentPosition(
      ({coords, timestamp}) => {
        // O parâmetro {coords} desestrutura a resposta, obtendo apenas a parte relativa às coordenadas.
        // Você também pode receber apenas (position) e observar outras informações
        // que são obtidas ao se solicitar a localização. Nesse exemplo, apenas precisamos das coordenadas.
        // BackgroundService.updateNotification({ taskDesc: `${new Date().getHours()}:${new Date().getMinutes()} - horário do ultimo envio de coordedadas` });

        setPositionMy({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        firestore()
          .collection('drivers_users')
          .doc(user.uid)
          .collection('positions')
          .add({
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: timestamp,
          })
          .then(() => console.log('ok', coords.longitude, coords.latitude))
          .catch(error => console.log('err', error));
        firestore()
          .collection('freight')
          .doc(idFreight)
          .collection('positions')
          .add({
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: timestamp,
          })
          .then(() => console.log('ok', coords.longitude, coords.latitude))
          .catch(error => console.log('err', error));

        if (alertPermissionLocation) {
          setAlertPermissionLocation(false);
        }
      },
      error => {
        setAlertPermissionLocation(true);
        setErrorMessage(error.message);
        console.log(error, 'Não foi possível obter a localização');
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        showLocationDialog: true,
      },
      //showLocationDialog: essa função convida automaticamente o usuário a ativar o GPS, caso esteja desativado.
      //enableHighAccuracy: vai solicitar a ativação do GPS e coletar os dados dele
      //timeout: determina o tempo máximo para o dispositivo coletar uma posição
      //maximumAge: tempo máximo para coleta de posição armazenada em cache
    );
  }

  async function startBackgroundService() {
    const sleep = time =>
      new Promise(resolve => setTimeout(() => resolve(), time));

    // You can do anything in your task such as network requests, timers and so on,
    // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
    // React Native will go into "paused" mode (unless there are other tasks running,
    // or there is a foreground app).
    const veryIntensiveTask = async taskDataArguments => {
      // Example of an infinite loop task
      const {delay} = taskDataArguments;
      await new Promise(async resolve => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
          getLocation();
          await sleep(delay);
        }
      });
    };

    const options = {
      taskName: 'Rastreando caregamento',
      taskTitle: 'Rastreamento de carga ativo',
      taskDesc: 'Iniciando rastreamento...',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#f4bc0b',
      linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
      parameters: {
        delay: 120000,
        // delay: 1000,
      },
    };

    await BackgroundService.start(veryIntensiveTask, options);
    // await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' }); // Only Android, iOS will ignore this call
    // iOS will also run everything here in the background until .stop() is called
    //  await BackgroundService.stop();

    //  await BackgroundService.stop();
  }

  const ButtonFixed = () => {
    if (resultStatusFreightDriver === 'hired') {
      return (
        <BtnInit onPress={() => setShowModalStage(true)}>
          <MaterialCommunityIcons name="truck-fast" size={20} color="#fff" />
          <TextButton>Iniciar viagem</TextButton>
        </BtnInit>
      );
    } else if (resultStatusFreightDriver === 'waitingCollection') {
      return (
        <BtnInit
          onPress={() => setShowModalStage(true)}
          style={{flexDirection: 'row', elevation: 10, shadowColor: '#000'}}>
          <TextButton>Confirmar carregamento </TextButton>
          <Ionicons name="md-cube" size={20} color="#fff" />
        </BtnInit>
      );
    } else if (resultStatusFreightDriver === 'inTransit') {
      return (
        <BtnInit
          onPress={() => setShowModalStage(true)}
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0,180,55, 1)',
            borderColor: 'rgba(0,180,55, 1)',
            elevation: 10,
            shadowColor: '#FF0000',
          }}>
          <TextButton>Confirmar entrega </TextButton>
          <MaterialCommunityIcons name="check-all" size={20} color="#fff" />
        </BtnInit>
        //
      );
    } else if (resultStatusFreightDriver === 'delivered') {
      return (
        <BtnInit
          onPress={() => setShowModalStage(true)}
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0,180,55, 1)',
            borderColor: 'rgba(0,180,55, 1)',
            elevation: 10,
            shadowColor: '#FF0000',
          }}>
          <TextButton>Entregue</TextButton>
        </BtnInit>
        //
      );
    } else if (resultStatusFreightDriver === 'finished') {
      return (
        <BtnInit
          onPress={() => setShowModalStage(true)}
          style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0,180,55, 1)',
            borderColor: 'rgba(0,180,55, 1)',
            elevation: 10,
            shadowColor: '#FF0000',
          }}>
          <TextButton>Finalizado</TextButton>
        </BtnInit>
        //
      );
    } else return <></>;
  };

  const messagesModal = {
    hired: 'Confirmar inicio de viagem indo em direção do carregamento?',
    waitingCollection: 'Confirmar que a carga foi carregada?',
    inTransit: 'Confirmar entrega da carga?',
    delivered: 'Entregue',
    finished: 'Finalizado',
  };

  const handleStatus = () => {
    resultStatusFreightDriver === 'hired'
      ? nextStatus('waitingCollection', {code: '05', describe: 'Em transito'}) &
        startBackgroundService()
      : resultStatusFreightDriver === 'waitingCollection'
      ? nextStatus('inTransit', {code: '05', describe: 'Em transito'})
      : resultStatusFreightDriver === 'inTransit'
      ? setShowModalConfirmDelivery(true) & setShowModalStage(false)
      : resultStatusFreightDriver === 'delivered'
      ? alert(
          'Frete entregue, aguarde a validação de nossa equipe, assim que tudo estiver OK seu frete atualizará para "Finalizado".',
        )
      : resultStatusFreightDriver === 'Finalizado'
      ? alert('Seu frete já foi finalizado.')
      : alert(
          'Algo inesperado aconteceu na atualização de status, por favor contate o suporte.',
        );
  };
  ///drivers_users/5wFHe2GiDWZA2dxt8fceCamixF63/myFreightsList/splJeERVhMqC9lFFTkfK
  async function nextStatus(statusForFreight, statusFreight) {
    firestore()
      .collection(`freight/${idFreight}/queue`)
      .doc(user.uid)
      .update({status: statusForFreight})
      .catch(error => console.log(error) && nextStatus(statusForFreight));

    firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(idFreight)
      .update({status: statusForFreight})
      .catch(error => console.log(error) && nextStatus(statusForFreight));

    // let dataHistory = {
    //   dateNotHire: myFreight?.history?.dateNotHire != undefined ? myFreight.history.dateNotHire : '',
    //   dateOfHire: myFreight?.history?.dateOfHire != undefined ? myFreight.history.dateOfHire : '',
    //   partiallyDate: myFreight?.history?.partiallyDate != undefined ? myFreight.history.partiallyDate : '',
    //   atAnaliseDate: myFreight?.history?.atAnaliseDate != undefined ? myFreight.history.atAnaliseDate : '',
    //   atAnaliseDateDriver: myFreight?.history?.atAnaliseDateDriver != undefined ? myFreight.history.atAnaliseDateDriver : '',
    //   dateDelivered: myFreight?.history?.dateDelivered != undefined ? myFreight.history.dateDelivered : '',
    //   dateFinished: myFreight?.history?.dateFinished != undefined ? myFreight.history.dateFinished : '',
    //   dateUpdate: myFreight?.history?.dateUpdate != undefined ? myFreight.history.dateUpdate : '',
    // }

    // await firestore().collection(`freight`)
    //   .doc(idFreight)
    //   .update({ history: dataHistory }).catch((error)=> console.log(error))

    await firestore()
      .collection(`freight`)
      .doc(idFreight)
      .update({status: statusFreight});

    setShowModalStage(false);
  }

  // REMOVER
  async function r_proximoStatus() {
    let statusForFreight = 'finished';
    let statusFreight = {code: '07', describe: 'Finalizado'};
    let freteDados = myFreight.freight;
    firestore()
      .collection(`freight/${idFreight}/queue`)
      .doc(user.uid)
      .update({status: statusForFreight})
      .catch(error => console.log(error) && nextStatus(statusForFreight));

    firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(idFreight)
      .update({status: statusForFreight})
      .catch(error => console.log(error) && nextStatus(statusForFreight));

    await firestore()
      .collection(`freight`)
      .doc(idFreight)
      .update({
        status: statusFreight,

        freight: {
          getDriverFreight: {
            uidDriver: user.uid,
          },
          observation: freteDados.observation,
          phoneRespContractFreigtage: parseFloat(
            freteDados.phoneRespContractFreigtage,
          ),
          product: freteDados.product,
          seller: freteDados.seller,
          totalAmountRoute: parseFloat(freteDados.totalAmountRoute),
          valueFreightage: parseFloat(freteDados.valueFreightage),
          valueNF: parseFloat(freteDados.valueNF),
          weightCargo: parseFloat(freteDados.weightCargo),
        },
      });

    setShowModalStage(false);
    // r_arquivar()
  }

  async function r_voltar() {
    let statusForFreight = 'approved';
    let statusFreight = {code: '03', describe: 'Em análise pelo motorista'};
    let freteDados = myFreight.freight;
    firestore()
      .collection(`freight/${idFreight}/queue`)
      .doc(user.uid)
      .update({status: statusForFreight})
      .catch(error => console.log(error) && nextStatus(statusForFreight));

    firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(idFreight)
      .update({status: statusForFreight})
      .catch(error => console.log(error) && nextStatus(statusForFreight));

    await firestore()
      .collection(`freight`)
      .doc(idFreight)
      .update({
        status: statusFreight,

        freight: {
          getDriverFreight: {
            uidDriver: user.uid,
          },
          observation: freteDados.observation,
          phoneRespContractFreigtage: parseFloat(
            freteDados.phoneRespContractFreigtage,
          ),
          product: freteDados.product,
          seller: freteDados.seller,
          totalAmountRoute: parseFloat(freteDados.totalAmountRoute),
          valueFreightage: parseFloat(freteDados.valueFreightage),
          valueNF: parseFloat(freteDados.valueNF),
          weightCargo: parseFloat(freteDados.weightCargo),
        },
      });

    await BackgroundService.stop();

    setShowModalStage(false);
  }

  async function r_arquivar() {
    navigation.goBack();

    await firestore()
      .collection(`freight_history`)
      .doc(idFreight)
      .set(myFreight);

    firestore().collection(`freight/${idFreight}/queue`).doc(user.uid).delete();

    firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(idFreight)
      .delete();
  }

  const handleCloseModalPermission = () => {
    setModalPermissionsVisible(false);
  };

  const handlePermission = async () => {
    const fineLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );
    const bgLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    if (!fineLocation || !bgLocation) {
      setModalPermissionsVisible(true);
    } else {
      alert(
        'As permissões já foram dadas, verifique se a sua localização está ativa!',
      );
    }
  };

  return (
    <Container>
      <Header namePage="Detalhes do frete" />
      <ScrollView style={{padding: 10}}>
        {alertPermissionLocation && (
          <BtnErrorPermission onPress={() => handlePermission()}>
            <TextBtnError>
              Localização inativa, clique aqui para corrigir.
            </TextBtnError>
          </BtnErrorPermission>
        )}

        <Text color="rgba(255,100,0,1)">
          Atenção, aqui está listado todos os detalhes do frete, incluindo
          localização de origem e destino.
        </Text>
        <Text color="rgba(255,100,0,1)">
          Quando estiver pronto para ir em direção do carregamento da carga,
          clique no botão iniciar viagem.
        </Text>

        <Line />
        <TitleDetails>LOCADOR DO FRETE:</TitleDetails>

        <LineModal>
          <Text fontWeight="medium">Empresa: </Text>
          <Text>{myFreight?.shipper?.name} </Text>
        </LineModal>

        <Line />

        <TitleDetails>ORIGEM:</TitleDetails>

        <LineModal>
          <Text fontWeight="medium">Empresa: </Text>
          <Text>{myFreight?.firstDelivery?.name}</Text>
        </LineModal>

        <LineModal>
          <Text fontWeight="medium">Endereço: </Text>
          <Text>{myFreight?.firstDelivery?.address}</Text>
        </LineModal>

        <LineModal>
          <Text fontWeight="medium">Localidade: </Text>
          <Text>
            {myFreight?.firstDelivery?.city} -{' '}
            {myFreight?.firstDelivery?.uf}
          </Text>
        </LineModal>

        <MapView style={{width: '100%', height: 200}} region={regionOrigin}>
          <Marker
            coordinate={positionOrigin}
            title={'Origem'}
            description={'Este é seu local de carregamento'}></Marker>
        </MapView>

        {/* https://www.google.com/maps/dir// */}
        {/* latitude, longitude */}
        <Button
          width="100%"
          bg="rgba(4,52,203,1)"
          onPress={() => {
            Linking.openURL(
              `https://www.google.com/maps/dir//${positionOrigin.latitude},${positionOrigin.longitude}`,
            );
          }}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <Text color="#fff" font-weight="bold" paddingRight="2%">
              Ir para GPS
            </Text>
            <Entypo name="location" size={25} color="#fff" />
          </View>
        </Button>

        {/* {props?.data.originCompanyLogo ?
                  (<CompanyLogo
                    style={{}}
                    source={{
                      uri: myFreight?.originCompanyLogo,
                    }}
                  />) : null} */}

        <Line />
        <TitleDetails>DESTINO:</TitleDetails>

        <LineModal>
          <Text fontWeight="medium">Empresa: </Text>
          <Text>{myFreight?.lastDelivery?.name}</Text>
        </LineModal>

        <LineModal>
          <Text fontWeight="medium">Endereço: </Text>
          <Text>{myFreight?.lastDelivery?.address}</Text>
        </LineModal>

        <LineModal>
          <Text fontWeight="medium">Localidade: </Text>
          <Text>
            {myFreight?.lastDelivery?.city} -{' '}
            {myFreight?.lastDelivery?.uf}
          </Text>
        </LineModal>
        <MapView style={{width: '100%', height: 200}} region={regionDelivery}>
          <Marker
            coordinate={positionDelivery}
            title={'Destino'}
            description={'Este é o local de descarga'}></Marker>
        </MapView>

        <Button
          width="100%"
          bg="rgba(4,52,203,1)"
          onPress={() => {
            Linking.openURL(
              `https://www.google.com/maps/dir//${positionDelivery.latitude},${positionDelivery.longitude}`,
            );
          }}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <Text color="#fff" font-weight="bold" paddingRight="2%">
              Ir para GPS
            </Text>
            <Entypo name="location" size={25} color="#fff" />
          </View>
        </Button>
        {/* {props?.data.destinationCompanyLogo ?
                  (<CompanyLogo
                    style={{}}
                    source={{
                      uri: myFreight?.destinationCompanyLogo,
                    }}
                  />) : null} */}

        <Line />
        <TitleDetails>DATAS E HORÁRIOS:</TitleDetails>
        <LineModal>
          <Text fontWeight="medium">Data da coleta: </Text>
          <Text>
            {dateCollectDay}/{dateCollectMonth}/{dateCollectYear}
          </Text>
        </LineModal>
        {/* <LineModal>
          <Text fontWeight="medium">Horário da coleta: </Text>
          <Text>12:00</Text>
        </LineModal> */}

        <LineModal>
          <Text fontWeight="medium">Data da entrega: </Text>
          <Text>
            {dateDeliveryDay}/{dateDeliveryMonth}/{dateDeliveryYear}
          </Text>
        </LineModal>
        <LineModal>
          <Text fontWeight="medium">Horário da entrega: </Text>
          <Text>
            {hourStartDelivery} às {hourEndDelivery}
          </Text>
        </LineModal>

        <Line />
        <TitleDetails>VEÍCULO REQUERIDO:</TitleDetails>
        <LineModal>
          <Text fontWeight="medium">Tipo(s):</Text>
          {/* <Text>{?.vehicle?.typeVehicle?.map((v, k) => <Text key={k}>{k > 0 ? '/' : ''} {v} </Text>)}</Text> */}
          <Text>
            {myFreight?.vehicle?.typeVehicle?.dados?.map((v, k) => (
              <Text key={k}>
                {' '}
                {v.selected === true ? v.name : ''}{' '}
                {/* {k > 0 && v.selected === true ? '/' : ''} */}
                {k > 0 && k < myFreight?.vehicle?.typeVehicle?.dados.length && v.selected === true ? '/' : ''}
              </Text>
            ))}
          </Text>

          {/* palavras.map(palavra => palavra.toUpperCase()); */}
          {/* <Text>{data?.vehicle.typeVehicle[0]}/{data?.vehicle.typeVehicle[1]}</Text> */}
        </LineModal>
        <LineModal>
          <Text fontWeight="medium">Carroceria(s): </Text>
          {/* <Text>{?.vehicle?.typeBodywork?.map((v, k) => <Text key={k}>{k > 0 ? '/' : ''} {v} </Text>)}</Text> */}
          <Text>
            {myFreight?.vehicle?.typeBodywork?.dados?.map((v, k) => (
              <Text key={k}>
                {' '}
                {v.selected == true ? v.name : ''}
                {/* {k > 0 && v.selected === true ? '/' : ''} */}
                {k > 0 && k < myFreight?.vehicle?.typeBodywork?.dados.length && v.selected === true ? '/' : ''}

              </Text>
            ))}
          </Text>
        </LineModal>

        <LineModal>
          <Text fontWeight="medium">Ocupação do veiculo: </Text>

          <Text>{myFreight?.vehicle?.occupation}</Text>
        </LineModal>
        <Line />

        <TitleDetails>DETALHES DA CARGA:</TitleDetails>
        {/* <LineModal>
                  <Text fontWeight="medium">Tipo: </Text>
                  <Text>{data?.freight?.productType}Não informado</Text>
                </LineModal> */}
        <LineModal>
          <Text fontWeight="medium">Produto: </Text>
          <Text>{myFreight?.freight?.product}</Text>
        </LineModal>
        <LineModal>
          <Text fontWeight="medium">Peso: </Text>
          <Text>
            {' '}
            <Mask value={myFreight?.freight?.weightCargo} type="kg" />
          </Text>
        </LineModal>

        <LineModal>
          <Text fontWeight="medium">Valor NF:</Text>
          <Text>
            {' '}
            R$
            <Mask value={myFreight?.freight?.valueNF} type="reais" />{' '}
          </Text>
        </LineModal>
        {/* <LineModal>
          <Text fontWeight="medium">Info adicional 1: </Text>
          <Text>{myFreight?.freight?.product}</Text>
        </LineModal>
        <LineModal>
          <Text fontWeight="medium">Info adicional 2: </Text>
          <Text>{myFreight?.freight?.product}</Text>
        </LineModal>
        <LineModal>
          <Text fontWeight="medium">Info adicional 3: </Text>
          <Text>{myFreight?.freight?.product}</Text>
        </LineModal> */}
        <Line />

        <TitleDetails>DETALHES DA VIAGEM:</TitleDetails>

        <LineModal>
          <Text fontWeight="medium">Quilometragem: </Text>

          <Text>
            {' '}
            <Mask value={myFreight?.freight?.totalAmountRoute} type="km" />{' '}
          </Text>
        </LineModal>
        <LineModal>
          <Text fontWeight="medium">Valor: </Text>
          <Text>
            {' '}
            R$
            <Mask value={myFreight?.driver?.valueInitial} type="reais" />{' '}
          </Text>
        </LineModal>

        <Line />
        <TitleDetails>Observação:</TitleDetails>
        <LineModal>
          <Text>{myFreight?.freight?.observation}</Text>
        </LineModal>

        {/* REMOVER */}
        {/* Atualiza o status em Meus Fretes, na Fila e no Frete. */}
        {/* <TouchableOpacity onPress={() => r_proximoStatus()} style={{ backgroundColor: '#888' }}>
          <Text>Confirma com o Cliente Final se foi de fato entregue</Text>
          <Text>Atualiza o status para FINALIZADO</Text>
          <Text>
            let statusForFreight = 'finished'
            let statusFreight = {'{ code: "07", describe: "Finalizado" }'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => r_arquivar()} style={{ backgroundColor: '#f88' }}>
          <Text>          Retirar o frete da tabela Freight e inserir em Freight_history
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => r_voltar()} style={{ backgroundColor: '#f88' }}>
          <Text>          Voltar
          </Text>
        </TouchableOpacity> */}
        {/* REMOVER */}

        <Button
          marginTop={5}
          width="100%"
          bg="rgba(37,211,102, 1)"
          onPress={() => {
            Linking.openURL(
              `https://api.whatsapp.com/send/?phone=55${myFreight?.freight?.phoneRespContractFreigtage}&text=Olá! Meu nome é ${user.name}, desejo ter mais informações referente ao frete id:${idFreight}&app_absent=0`,
            );
          }}>
          <View style={{alignItems: 'center'}}>
            <Text color="#fff" fontWeight="bold" textAlign="center">
              Solicitar suporte via Whatsapp.
            </Text>
            <MaterialCommunityIcons name="whatsapp" size={25} color="#fff" />
          </View>
        </Button>

        <View style={{marginBottom: 100}}></View>

        <Modal
          isOpen={showModalStage}
          onClose={() => setShowModalStage(false)}
          size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Atenção </Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <Text color="#000">
                  {resultStatusFreightDriver === 'hired'
                    ? messagesModal.hired
                    : resultStatusFreightDriver === 'waitingCollection'
                    ? messagesModal.waitingCollection
                    : resultStatusFreightDriver === 'inTransit'
                    ? messagesModal.inTransit
                    : resultStatusFreightDriver === 'delivered'
                    ? messagesModal.delivered
                    : resultStatusFreightDriver === 'finished'
                    ? messagesModal.finished
                    : ''}
                </Text>
              </VStack>
            </Modal.Body>
            {resultStatusFreightDriver ===
            'delivered' ? null : resultStatusFreightDriver ===
              'finished' ? null : (
              <Modal.Footer justifyContent="space-between">
                <Button
                  width="45%"
                  bg="rgb(4,52,203)"
                  onPress={() => {
                    setShowModalStage(false);
                  }}>
                  Não
                </Button>

                <Button
                  width="45%"
                  bg="rgb(4,52,203)"
                  onPress={() => {
                    handleStatus() & setShowModalStage(false);
                  }}>
                  Sim
                </Button>
              </Modal.Footer>
            )}
          </Modal.Content>
        </Modal>
        <Modal
          isOpen={showModalConfirmDelivery}
          onClose={() => setShowModalConfirmDelivery(false)}
          size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Atenção</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <Text fontWeight="medium">
                  Por gentileza nos encaminhe uma foto com o comprovante de
                  entrega desta carga.
                </Text>
                <Text fontWeight="medium">
                  Certifique-se de que a imagem esteja em boa qualidade.
                </Text>
              </VStack>
            </Modal.Body>
            <Modal.Footer justifyContent="space-between">
              <UploadImageFreight idFreight={idFreight} />
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </ScrollView>

      <ModalPermissions
        animationType="slide"
        visible={modalPermissionsVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalPermissionsVisible(!modalPermissionsVisible);
        }}>
        <BgLocation
          closeModal={handleCloseModalPermission}
          messageAlert={() => {
            setAlertPermissionLocation(false);
          }}
          numberSupport={myFreight?.freight?.phoneRespContractFreigtage}
          page={'DetailsFreight'}
        />
      </ModalPermissions>
      <ButtonFixed />
    </Container>
  );
}
