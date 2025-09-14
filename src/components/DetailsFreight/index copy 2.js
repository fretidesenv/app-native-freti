import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Linking,
  Alert,
  RefreshControl,
} from "react-native";
import Header from "../Header";
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
} from "./styles";
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
} from "native-base";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MapView, { Marker } from "react-native-maps";

// import Geolocation from '@react-native-community/geolocation';
import { Mask } from "./formater";

import BgLocation from "../BgLocation";

import { AuthContext } from "../../contexts/auth";
import { formatDistance } from "date-fns/esm";
import BackgroundService from "react-native-background-actions";
// import Geolocation from "react-native-geolocation-service";
import Geolocation from "@react-native-community/geolocation";

import * as Animatable from "react-native-animatable";

import { UploadImageFreight } from "../UploadImageFreight";
import { set } from "date-fns";
import StoppingPoints from "../StoppingPoints";
import { requestLocationPermission } from "../../services/requestLocationPermission";

export default function DetailsFreight({ route }) {
  const AnimatedView = Animatable.createAnimatableComponent(View);

  const navigation = useNavigation();
  const [idFreight, setIdFreight] = useState(route.params.idFreight);
  const [myFreight, setMyFreight] = useState(null);
  const [userData, setUserData] = useState(user);
  const [resultStatusFreightDriver, setResultStatusFreightDriver] = useState(
    ""
  );
  const dateCollect = new Date(myFreight?.clientOrigin?.dateCollect);
  const dateCollectDay = dateCollect.getDate();
  const dateCollectMonth = dateCollect.getMonth() + 1;
  const dateCollectYear = dateCollect.getFullYear();
  const [freightInitialized, setFreightInitialized] = useState(false);
  const dateDelivery = new Date(
    myFreight?.clientDelivery?.timeDelivery?.dateDelivery
  );
  const dateDeliveryDay = dateDelivery.getDate();
  const dateDeliveryMonth = dateDelivery.getMonth() + 1;
  const dateDeliveryYear = dateDelivery.getFullYear();
  const hourStartDelivery =
    myFreight?.clientDelivery?.timeDelivery?.hourStartDelivery;
  const hourEndDelivery =
    myFreight?.clientDelivery?.timeDelivery?.hourEndDelivery;

  const [showModalConfirmDelivery, setShowModalConfirmDelivery] = useState(
    false
  );
  const [showModalStage, setShowModalStage] = useState(false);

  const [accessFineLocation, setAccessFineLocation] = useState(false);
  const [accessBackgroundLocation, setAccessBackgroundLocation] = useState(
    false
  );

  const [alertPermissionLocation, setAlertPermissionLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [modalPermissionsVisible, setModalPermissionsVisible] = useState(false);

  const { user } = useContext(AuthContext);
  const [lastPosition, setLastPosition] = useState(null); // Armazena última posição para comparação
  const [serviceRunning, setServiceRunning] = useState(false); // Controla o estado do serviço

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
      .collection("freight")
      // .collection('freight_teste') __temp_
      .doc(idFreight)
      .onSnapshot((documentSnapshot) => {
        setMyFreight(documentSnapshot.data());

        console.log(
          documentSnapshot.data()?.firstDelivery?.coordinates?.latitude,
          documentSnapshot.data()?.firstDelivery?.coordinates?.longitude,
          documentSnapshot.data()?.lastDelivery?.coordinates?.latitude,
          documentSnapshot.data()?.lastDelivery?.coordinates?.longitude
        );
        setRegionOrigin({
          latitude: documentSnapshot.data()?.firstDelivery?.coordinates
            ?.latitude,
          longitude: documentSnapshot.data()?.firstDelivery?.coordinates
            ?.longitude,

          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        console.log();
        setPositionOrigin({
          latitude: documentSnapshot.data()?.firstDelivery?.coordinates
            ?.latitude,
          longitude: documentSnapshot.data()?.firstDelivery?.coordinates
            ?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setRegionDelivery({
          latitude: documentSnapshot.data()?.lastDelivery?.coordinates
            ?.latitude,
          longitude: documentSnapshot.data()?.lastDelivery?.coordinates
            ?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setPositionDelivery({
          latitude: documentSnapshot.data()?.lastDelivery?.coordinates
            ?.latitude,
          longitude: documentSnapshot.data()?.lastDelivery?.coordinates
            ?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        getLocation();
      });

    viewLine();
    return () => subscriber();
  }, [idFreight]);

  const verifyPermission = async () => {
    await requestLocationPermission();
  };

  useEffect(() => {
    // Iniciar serviço de background se ele não estiver rodando
    verifyPermission();
    if (!serviceRunning) {
      startBackgroundService();
    }
  }, [idFreight]);

  function formatTimeRegistration() {
    // console.log(new Date(data.created.seconds * 1000));
    const dateRegistration = new Date(
      myFreight?.registrationInLineTime.seconds * 1000
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
      .onSnapshot((documentSnapshot) => {
        setResultStatusFreightDriver(documentSnapshot.data().status);
        setFreightInitialized(documentSnapshot.data().freightInitialized);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  // async function __getLocation() {
  //   Geolocation.getCurrentPosition(
  //     async ({ coords, timestamp }) => {
  //       const newCoords = { latitude: coords.latitude, longitude: coords.longitude };

  //       // Verifica se a nova posição é diferente da última registrada
  //       if (!lastPosition || distanceBetweenCoords(lastPosition, newCoords) > 0.01) {
  //         setPositionMy(newCoords);
  //         setLastPosition(newCoords);

  //         // Registra nova posição no banco de dados
  //         await firestore()
  //           .collection("drivers_users")
  //           .doc(user.uid)
  //           .collection("positions")
  //           .add({
  //             ...newCoords,
  //             timestamp,
  //             date: new Date()
  //           });

  //         await firestore()
  //           .collection("freight")
  //           .doc(idFreight)
  //           .collection("positions")
  //           .add({
  //             ...newCoords,
  //             timestamp,
  //             date: new Date()
  //           });
  //         console.log("Localização registrada:", newCoords, new Date(), idFreight);
  //       }
  //     },
  //     (error) => {
  //       console.error("Erro ao obter localização:", error.message);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 20000,
  //       maximumAge: 1000,
  //       showLocationDialog: true,
  //     }
  //   );
  // }

  async function _getLocation() {
    Geolocation.getCurrentPosition(
      async ({ coords, timestamp }) => {
        const newCoords = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        // Verifica se a nova posição é diferente da última registrada
        if (
          !lastPosition ||
          distanceBetweenCoords(lastPosition, newCoords) > 0.01
        ) {
          setPositionMy(newCoords);
          setLastPosition(newCoords);

          // Registra nova posição no banco de dados
          await firestore()
            .collection("drivers_users")
            .doc(user.uid)
            .collection("positions")
            .add({
              ...newCoords,
              timestamp,
              date: new Date(),
            });

          await firestore()
            .collection("freight")
            .doc(idFreight)
            .collection("positions")
            .add({
              ...newCoords,
              timestamp,
              date: new Date(),
            });
          console.log(
            "Localização registrada:",
            newCoords,
            new Date(),
            idFreight
          );
        }
      },
      (error) => {
        console.error("##Erro ao obter localização:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        showLocationDialog: true,
      }
    );
  }

// watchposition
  // const seconds = (s) => s * 1000;
  // let watchId;
  // async function getLocation() {
  //   watchId = Geolocation.watchPosition(
  //     async ({ coords, timestamp }) => {
  //       const newCoords = {
  //         latitude: coords.latitude,
  //         longitude: coords.longitude,
  //       };
  //       // Verifique e salve a localização, conforme já feito em getLocation()
  //       await firestore()
  //         .collection("drivers_users")
  //         .doc(user.uid)
  //         .collection("positions")
  //         .add({ ...newCoords, timestamp, date: new Date() });
  //       setLastPosition(newCoords);

  //       await firestore()
  //         .collection("freight")
  //         .doc(idFreight)
  //         .collection("positions")
  //         .add({
  //           ...newCoords,
  //           timestamp,
  //           date: new Date(),
  //         });

  //       console.log(
  //         "Localização registrada:",
  //         newCoords,
  //         new Date(),
  //         idFreight
  //       );
  //     },
  //     (error) => console.error("Erro ao obter localização:", error.message),
  //     {
  //       timeout: seconds(120),           // O tempo máximo para o dispositivo retornar uma posição
  //       maximumAge: seconds(600),         // Idade máxima da posição em cache aceitável
  //       enableHighAccuracy: true,         // Usar GPS para maior precisão
  //       interval: seconds(60),            // Preferência para atualização de 60 segundos
  //       fastestInterval: seconds(30),     // Frequência mínima de 30 segundos entre atualizações
  //       distanceFilter: 50                // Distância mínima de 50 metros para disparar nova atualização
  //     }
      
      
  //   );
  // }
// watchposition

const seconds = (s) => s * 1000;

async function getLocation() {
  const intervalId = setInterval(async () => {
    Geolocation.getCurrentPosition(
      async ({ coords, timestamp }) => {
        const newCoords = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        // Salva a localização no banco
        await firestore()
          .collection("drivers_users")
          .doc(user.uid)
          .collection("positions")
          .add({ ...newCoords, timestamp, date: new Date() });

        await firestore()
          .collection("freight")
          .doc(idFreight)
          .collection("positions")
          .add({ ...newCoords, timestamp, date: new Date() });

        console.log("Localização registrada:", newCoords, new Date(), idFreight);
      },
      (error) => console.error("Erro ao obter localizaçãoaa:", error.message),
      {
        enableHighAccuracy: true, // Usar GPS para alta precisão
        timeout: seconds(120), // Tempo máximo para obter uma posição
        maximumAge: seconds(600) // Usar posição em cache se estiver dentro da idade máxima
      }
    );
  }, seconds(60)); // Intervalo de 1 minuto para chamadas de localização

  // Retorna o ID do intervalo para que ele possa ser cancelado mais tarde, se necessário
  return intervalId;
}


  async function startBackgroundService() {
    if (serviceRunning) return; // Evita múltiplos serviços

    const veryIntensiveTask = async (taskDataArguments) => {
      const { delay } = taskDataArguments;
      while (BackgroundService.isRunning()) {
        await getLocation();
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    };

    const options = {
      taskName: "Rastreando carregamento",
      taskTitle: "Rastreamento de carga ativo",
      taskDesc: "Iniciando rastreamento...",
      taskIcon: { name: "ic_launcher", type: "mipmap" },
      color: "#f4bc0b",
      parameters: { delay: 60000 }, // Intervalo de 1 minuto
      // parameters: { delay: 10000 }, // Intervalo de 1 minuto
    };

    await BackgroundService.start(veryIntensiveTask, options);
    setServiceRunning(true); // Atualiza o estado de controle do serviço
  }
  function distanceBetweenCoords(coord1, coord2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * (Math.PI / 180)) *
        Math.cos(coord2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Retorna distância em km
  }

  const ButtonFixed = () => {
    if (resultStatusFreightDriver === "hired" && !freightInitialized) {
      return (
        <BtnInit onPress={() => setShowModalStage(true)}>
          <MaterialCommunityIcons name="truck-fast" size={20} color="#fff" />
          <TextButton>Toque para iniciar viagem</TextButton>
        </BtnInit>
      );
    } else if (resultStatusFreightDriver === "n_exibir_waitingCollection") {
      return (
        <BtnInit
          onPress={() => setShowModalStage(true)}
          style={{ flexDirection: "row", elevation: 10, shadowColor: "#000" }}
        >
          <TextButton>Confirmar carregamento </TextButton>
          <Ionicons name="md-cube" size={20} color="#fff" />
        </BtnInit>
      );
    } else if (resultStatusFreightDriver === "n_exibir_inTransit") {
      return (
        <BtnInit
          onPress={() => setShowModalStage(true)}
          style={{
            flexDirection: "row",
            backgroundColor: "rgba(0,180,55, 1)",
            borderColor: "rgba(0,180,55, 1)",
            elevation: 10,
            shadowColor: "#FF0000",
          }}
        >
          <TextButton>Confirmar entrega </TextButton>
          <MaterialCommunityIcons name="check-all" size={20} color="#fff" />
        </BtnInit>
        //
      );
    } else if (resultStatusFreightDriver === "n_exibir_delivered") {
      return (
        <BtnInit
          onPress={() => setShowModalStage(true)}
          style={{
            flexDirection: "row",
            backgroundColor: "rgba(0,180,55, 1)",
            borderColor: "rgba(0,180,55, 1)",
            elevation: 10,
            shadowColor: "#FF0000",
          }}
        >
          <TextButton>Entregue</TextButton>
        </BtnInit>
        //
      );
    } else if (resultStatusFreightDriver === "n_exibir_finished") {
      return (
        <BtnInit
          onPress={() => setShowModalStage(true)}
          style={{
            flexDirection: "row",
            backgroundColor: "rgba(0,180,55, 1)",
            borderColor: "rgba(0,180,55, 1)",
            elevation: 10,
            shadowColor: "#FF0000",
          }}
        >
          <TextButton>Finalizado</TextButton>
        </BtnInit>
        //
      );
    } else return <></>;
  };

  const messagesModal = {
    hired: "Confirmar inicio de viagem indo em direção do carregamento?",
    waitingCollection: "Confirmar que a carga foi carregada?",
    inTransit: "Confirmar entrega da carga?",
    delivered: "Entregue",
    finished: "Finalizado",
  };

  const handleStatus = () => {
    resultStatusFreightDriver === "hired"
      ? nextStatus("waitingCollection", {
          code: "05",
          describe: "Em transito",
        }) & startBackgroundService() // __temp_
      : resultStatusFreightDriver === "waitingCollection"
      ? nextStatus("inTransit", { code: "05", describe: "Em transito" })
      : resultStatusFreightDriver === "inTransit"
      ? setShowModalConfirmDelivery(true) & setShowModalStage(false)
      : resultStatusFreightDriver === "delivered"
      ? alert(
          'Frete entregue, aguarde a validação de nossa equipe, assim que tudo estiver OK seu frete atualizará para "Finalizado".'
        )
      : resultStatusFreightDriver === "Finalizado"
      ? alert("Seu frete já foi finalizado.")
      : alert(
          "Algo inesperado aconteceu na atualização de status, por favor contate o suporte."
        );
  };
  ///drivers_users/5wFHe2GiDWZA2dxt8fceCamixF63/myFreightsList/splJeERVhMqC9lFFTkfK
  async function nextStatus(statusForFreight, statusFreight) {
    setFreightInitialized(true);
    //-aqui
    firestore()
      .collection(`freight/${idFreight}/queue`)
      // .collection(`freight_teste/${idFreight}/queue`) __temp_
      .doc(user.uid)
      .update({ status: statusForFreight, freightInitialized: true })
      .catch((error) => console.log(error) && nextStatus(statusForFreight));

    firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(idFreight)
      .update({ status: statusForFreight, freightInitialized: true })
      .catch((error) => console.log(error) && nextStatus(statusForFreight));
    //-até aqui

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

    // __temp_
    await firestore()
      .collection(`freight`)
      .doc(idFreight)
      .update({ status: statusFreight });

    setShowModalStage(false);
  }

  const handleCloseModalPermission = () => {
    setModalPermissionsVisible(false);
  };

  const handlePermission = async () => {
    const fineLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );
    const bgLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );

    if (!fineLocation || !bgLocation) {
      setModalPermissionsVisible(true);
    } else {
      alert(
        "As permissões já foram dadas, verifique se a sua localização está ativa!"
      );
    }
  };

  useEffect(() => {
    verificarListaDeVeiculos();
  }, [myFreight]);
  const [vehicle, setVehicle] = useState({});

  const verificarListaDeVeiculos = async () => {
    let vehicles = [];
    let bodyworks = [];
    for (let i = 0; i < myFreight?.vehicle?.typeVehicle?.dados.length; i++) {
      let item = myFreight?.vehicle?.typeVehicle?.dados[i];
      // console.log(item)
      if (item.selected) {
        vehicles.push(item?.name);
      }
    }
    for (let i = 0; i < myFreight?.vehicle?.typeBodywork?.dados.length; i++) {
      let item = myFreight?.vehicle?.typeBodywork?.dados[i];

      if (item.selected) {
        bodyworks.push(item?.name);
      }
    }
    setVehicle({ vehicles, bodyworks });
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const [timeOnScreen, setTimeOnScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnScreen((prevTime) => prevTime + 30);
    }, 30000); // Incrementa o tempo em 1 segundo

    // Limpeza do temporizador quando o componente é desmontado
    return () => clearInterval(interval);
  }, []); // Executa o efeito somente na montagem do componente

  useEffect(() => {
    // Verifica se passou mais de um minuto
    if (timeOnScreen >= 760) {
      // Executa a função onRefresh
      onRefresh();
      // Reseta o tempo na tela
      setTimeOnScreen(0);
    }
  }, [timeOnScreen]); // Executa sempre que o tempo na tela for atualizado

  return (
    <Container>
      <Header namePage="Detalhes do frete" />
      <ScrollView
        style={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {alertPermissionLocation && (
          <BtnErrorPermission onPress={() => handlePermission()}>
            <TextBtnError>
              Localização inativa, clique aqui para corrigir.
            </TextBtnError>
          </BtnErrorPermission>
        )}
        <AnimatedView
          iterationCount={1}
          animation="slideInDown"
          // iterationDelay={15000}
          easing="linear"
        >
          <Text color="rgba(255,100,0,1)">
            Atenção, aqui está listado todos os detalhes do frete, incluindo
            localização de cada ponto de parada, com os tipos de operação em
            cada um, podendo ser apenas Carga, Descarga, ou, Carga e Descarga.
          </Text>
          <Text color="rgba(255,100,0,1)">
            Quando estiver pronto para ir em direção do carregamento da carga,
            clique no botão iniciar viagem.
          </Text>
        </AnimatedView>
        <Line />
        <TitleDetails>LOCADOR DO FRETE:</TitleDetails>

        <LineModal>
          <Text fontWeight="medium">Empresa: </Text>
          <Text>{myFreight?.shipper?.name} </Text>
        </LineModal>

        <Line />
        <TitleDetails>PONTOS DE PARADA:</TitleDetails>

        <StoppingPoints
          idFreight={route?.params?.idFreight}
          freightInitialized={freightInitialized}
          user={user}
          refreshing={refreshing}
        />
        <Line />
        {/* <TitleDetails>ORIGEM:</TitleDetails>


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
        </MapView> */}

        {/* https://www.google.com/maps/dir// */}
        {/* latitude, longitude */}
        {/* <Button
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
        </Button> */}

        {/* {props?.data.originCompanyLogo ?
                  (<CompanyLogo
                    style={{}}
                    source={{
                      uri: myFreight?.originCompanyLogo,
                    }}
                  />) : null} */}

        {/* <Line />
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
        </Button> */}
        {/* {props?.data.destinationCompanyLogo ?
                  (<CompanyLogo
                    style={{}}
                    source={{
                      uri: myFreight?.destinationCompanyLogo,
                    }}
                  />) : null} */}
        {/* 
        <Line />
        <TitleDetails>DATAS E HORÁRIOS:</TitleDetails>
        <LineModal>
          <Text fontWeight="medium">Data da coleta: </Text>
          <Text>
            {dateCollectDay}/{dateCollectMonth}/{dateCollectYear}
          </Text>
        </LineModal> */}
        {/* <LineModal>
          <Text fontWeight="medium">Horário da coleta: </Text>
          <Text>12:00</Text>
        </LineModal> */}

        {/* <LineModal>
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
        </LineModal> */}

        <Line />
        <TitleDetails>VEÍCULO REQUERIDO:</TitleDetails>
        <LineModal>
          <Text fontWeight="medium">Tipo(s):</Text>
          {/* <Text>{?.vehicle?.typeVehicle?.map((v, k) => <Text key={k}>{k > 0 ? '/' : ''} {v} </Text>)}</Text> */}
          <Text>
            {vehicle?.vehicles?.map((v, k) => (
              <Text key={k}>
                {v}
                {k == vehicle?.vehicles?.length - 1 ? "." : ", "}
              </Text>
            ))}
          </Text>

          {/* palavras.map(palavra => palavra.toUpperCase()); */}
          {/* <Text>{data?.vehicle.typeVehicle[0]}/{data?.vehicle.typeVehicle[1]}</Text> */}
        </LineModal>
        <LineModal>
          <Text fontWeight="medium">Carroceria(s): </Text>

          <Text>
            {vehicle?.bodyworks?.map((v, k) => (
              <Text key={k}>
                {v}
                {k == vehicle?.bodyworks?.length - 1 ? "." : ", "}
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
            {" "}
            <Mask value={myFreight?.freight?.weightCargo} type="kg" />
          </Text>
        </LineModal>

        <LineModal>
          <Text fontWeight="medium">Valor NF:</Text>
          <Text>
            {" "}
            R$
            <Mask value={myFreight?.freight?.valueNF} type="reais" />{" "}
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
            {" "}
            <Mask value={myFreight?.freight?.totalAmountRoute} type="km" />{" "}
          </Text>
        </LineModal>
        <LineModal>
          <Text fontWeight="medium">Valor: </Text>
          <Text>
            {" "}
            R$
            <Mask value={myFreight?.driver?.valueInitial} type="reais" />{" "}
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
              `https://api.whatsapp.com/send/?phone=55${myFreight?.freight?.phoneRespContractFreigtage}&text=Olá! Meu nome é ${user?.name}, desejo ter mais informações referente ao frete id:${myFreight?.numberSerial}&app_absent=0`
            );
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text color="#fff" fontWeight="bold" textAlign="center">
              Solicitar suporte via Whatsapp.
            </Text>
            <MaterialCommunityIcons name="whatsapp" size={25} color="#fff" />
          </View>
        </Button>

        <View style={{ marginBottom: 100 }}></View>

        <Modal
          isOpen={showModalStage}
          onClose={() => setShowModalStage(false)}
          size="lg"
        >
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Atenção </Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <Text color="#000">
                  {resultStatusFreightDriver === "hired"
                    ? messagesModal.hired
                    : resultStatusFreightDriver === "waitingCollection"
                    ? messagesModal.waitingCollection
                    : resultStatusFreightDriver === "inTransit"
                    ? messagesModal.inTransit
                    : resultStatusFreightDriver === "delivered"
                    ? messagesModal.delivered
                    : resultStatusFreightDriver === "finished"
                    ? messagesModal.finished
                    : ""}
                </Text>
              </VStack>
            </Modal.Body>
            {resultStatusFreightDriver ===
            "delivered" ? null : resultStatusFreightDriver ===
              "finished" ? null : (
              <Modal.Footer justifyContent="space-between">
                <Button
                  width="45%"
                  bg="rgb(4,52,203)"
                  onPress={() => {
                    setShowModalStage(false);
                  }}
                >
                  Não
                </Button>

                <Button
                  width="45%"
                  bg="rgb(4,52,203)"
                  onPress={() => {
                    handleStatus() & setShowModalStage(false);
                  }}
                >
                  Sim
                </Button>
              </Modal.Footer>
            )}
          </Modal.Content>
        </Modal>
        {/* <Modal
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
              <UploadImageFreight idFreight={idFreight} idStoppingPoints= />
            </Modal.Footer>
          </Modal.Content>
        </Modal> */}
      </ScrollView>

      <ModalPermissions
        animationType="slide"
        visible={modalPermissionsVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalPermissionsVisible(!modalPermissionsVisible);
        }}
      >
        <BgLocation
          closeModal={handleCloseModalPermission}
          messageAlert={() => {
            setAlertPermissionLocation(false);
          }}
          numberSupport={myFreight?.freight?.phoneRespContractFreigtage}
          page={"DetailsFreight"}
        />
      </ModalPermissions>
      <ButtonFixed />
    </Container>
  );
}
