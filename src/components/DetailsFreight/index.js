import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Header from "../Header";
import {
  Container,
  LineModal,
  TitleDetails,
  Line,
  TextButton,
  BtnInit,
  ModalPermissions,
  BtnErrorPermission,
  TextBtnError,
  
  TextSubTitile,
  TextCompany,
  TextFrete,
} from "./styles";
import { Button, Modal, VStack, Text, ScrollView } from "native-base";

import firestore from "@react-native-firebase/firestore";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Mask } from "./formater";
import BgLocation from "../BgLocation";
import { AuthContext } from "../../contexts/auth";
import BackgroundService from "react-native-background-actions";
import * as Animatable from "react-native-animatable";
import StoppingPoints from "../StoppingPoints";
import { PermissionsHandler } from "../../handler/permissions";
import { useApplicationStore } from "../../store/application";

export default function DetailsFreight({ route }) {
  const AnimatedView = Animatable.createAnimatableComponent(View);

  const [idFreight, setIdFreight] = useState(route.params.idFreight);
  const [myFreight, setMyFreight] = useState(null);
  const [resultStatusFreightDriver, setResultStatusFreightDriver] = useState(
    ""
  );
  const [freightInitialized, setFreightInitialized] = useState(false);

  const [showModalConfirmDelivery, setShowModalConfirmDelivery] = useState(
    false
  );
  const [showModalStage, setShowModalStage] = useState(false);
  const [alertPermissionLocation, setAlertPermissionLocation] = useState(false);
  const [modalPermissionsVisible, setModalPermissionsVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const [showModalAlertLocation, setShowModalAlertLocation] = useState(false);
  const [permissionType, setPermissionType] = useState("");
  const [loadingStartFreight, setLoadingStartFreight] = useState(false);

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
      .doc(idFreight)
      .onSnapshot((documentSnapshot) => {
        setMyFreight(documentSnapshot.data());

        setRegionOrigin({
          latitude: documentSnapshot.data()?.firstDelivery?.coordinates
            ?.latitude,
          longitude: documentSnapshot.data()?.firstDelivery?.coordinates
            ?.longitude,

          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

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

  const locationHandler = async () => {
    const isAllowedLocation = await PermissionsHandler.requestLocationPermissions();

    if (!BackgroundService.isRunning() && isAllowedLocation) {
      setShowModalAlertLocation(true);
      startBackgroundService();
    }
  };

  useEffect(() => {
    locationHandler();
  }, [idFreight]);

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

  const seconds = (s) => s * 1000;

  async function getLocation() {
    PermissionsHandler.getGeoLocation((coords, timestamp) => {
      const newCoords = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      firestore()
        .collection("freight")
        .doc(idFreight)
        .collection("positions")
        .add({
          ...newCoords,
          timestamp: new Date().getTime() || null,
          date: new Date(),
          latitude: coords?.latitude || null,
          longitude: coords?.longitude || null,
        });
    });
  }

  async function startBackgroundService() {
    console.log("Starting background service");
    if (BackgroundService.isRunning()) {
      console.log("Background service already running");
      return; // Evita múltiplos serviços
    }
    console.log("Nenhum serviço rodando, Starting background service");

    const veryIntensiveTask = async (taskDataArguments) => {
      const { delay } = taskDataArguments;
      while (BackgroundService.isRunning()) {
        await getLocation();
        await new Promise((resolve) =>
          setTimeout(resolve, delay || seconds(300))
        );
      }
    };

    const options = {
      taskName: "Rastreando carregamento",
      taskTitle: "Rastreamento de carga ativo",
      taskDesc: "Iniciando rastreamento...",
      taskIcon: { name: "ic_launcher", type: "mipmap" },
      color: "#f4bc0b",
      // parameters: { delay: seconds(30) }, // Intervalo de 5 minutos
      parameters: { delay: seconds(300) }, // Intervalo de 5 minutos
    };

    await BackgroundService.start(veryIntensiveTask, options);
  }

  // Calcula a distância entre duas coordenadas para verificação de mudança
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


  async function handleStartFreight() {
    // Verifica se há permissões de localização bloqueadas
    const locationDeniedPermissions = await PermissionsHandler.checkLocationPermissions();
    
    if (locationDeniedPermissions && locationDeniedPermissions.length > 0) {
      // Há permissões bloqueadas - exibe o modal de permissões
      console.log('🚨 Permissões de localização bloqueadas:', locationDeniedPermissions);
      setLoadingStartFreight(false);
      useApplicationStore.getState().setBlockedPermissions(locationDeniedPermissions);
      useApplicationStore.getState().setShowModalPermsission(true);
    } else {
      // Todas as permissões estão OK - continua com o fluxo normal
      console.log('✅ Permissões de localização OK, obtendo localização...');
      PermissionsHandler.getGeoLocation((coords, timestamp, error) => {
        if (error) {
          setLoadingStartFreight(false);
        } else {
          setLoadingStartFreight(false);
          setShowModalStage(true);
        }
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000,
        showLocationDialog: false
      });
    }
  }

  const ButtonFixed = () => {
    if (resultStatusFreightDriver === "hired" && !freightInitialized) {
      return (
        <>
          {loadingStartFreight ? (
            <BtnInit onPress={() => { }}>
              <View
                style={{
                  width: "20%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={50} color="rgb(255,255,255)" />
              </View>
            </BtnInit>
          ) : (
            <BtnInit onPress={() => handleStartFreight()}>
              <MaterialCommunityIcons
                name="truck-fast"
                size={20}
                color="#fff"
              />
              <TextButton>Toque para iniciar viagem</TextButton>
            </BtnInit>
          )}
        </>
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

  const handleStatus = async () => {
    PermissionsHandler.getGeoLocation((coords, timestamp, error) => {
      if (!error) {
        resultStatusFreightDriver === "hired"
          ? nextStatus("waitingCollection", {
            code: "05",
            describe: "Em transito",
            dateTimeNow: new Date()
          }) & startBackgroundService() // __temp_
          : resultStatusFreightDriver === "waitingCollection"
            ? nextStatus("inTransit", { code: "05", describe: "Em transito", dateTimeNow: new Date() })
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
      }
    });
  };

  async function nextStatus(statusForFreight, statusFreight, dateTimeNow = new Date()) {
    setFreightInitialized(true);
    //-aqui
    firestore()
      .collection(`freight/${idFreight}/queue`)
      .doc(user.uid)
      .update({ status: statusForFreight, freightInitialized: true, dateInicialTrip: dateTimeNow })
      .catch((error) => console.log(error) && nextStatus(statusForFreight));

    firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(idFreight)
      .update({ status: statusForFreight, freightInitialized: true, dateInicialTrip: dateTimeNow })
      .catch((error) => console.log(error) && nextStatus(statusForFreight));

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
    const isAllowedLocation = await PermissionsHandler.requestLocationPermissions();

    if (isAllowedLocation) {
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


  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
          easing="linear"
        >

        </AnimatedView>
        <TitleDetails>Locador do frete:</TitleDetails>

        <LineModal>
          {/* <Text fontWeight="medium">Empresa: </Text> */}
          <TextCompany>{myFreight?.shipper?.name} </TextCompany>
        </LineModal>

        {/* <Line /> */}
        <LineModal>
          <TextFrete fontWeight="medium">Número: </TextFrete>
          <TextFrete>{myFreight?.numberSerial} </TextFrete>
        </LineModal>
        {/* <Line /> */}

        <Line />
        <TitleDetails>Pontos de parada:</TitleDetails>

        <StoppingPoints
          idFreight={route?.params?.idFreight}
          freightInitialized={freightInitialized}
          user={user}
          refreshing={refreshing}
        />
        <Line />

        <Line />
        <TitleDetails>Veículos requeridos:</TitleDetails>
        <LineModal>
          <TextSubTitile fontWeight="medium">Veículo(s): </TextSubTitile>
          <Text>
            {vehicle?.vehicles?.map((v, k) => (
               <Text key={k}>
               {v}
               {k === vehicle?.vehicles?.length - 1
                 ? "." 
                 : (k + 1) % 3 === 0
                 ? ",\n" 
                 : ", "} 
             </Text>
            ))}
          </Text>
        </LineModal>
        <LineModal>
          <TextSubTitile fontWeight="medium">Carroceria(s): </TextSubTitile>

          <Text>
            {vehicle?.bodyworks?.map((v, k) => (
              <Text key={k}>
                {v}
                {k == vehicle?.bodyworks?.length - 1? "." 
                 : (k + 1) % 2 === 0
                 ? ",\n" 
                 : ", "} 
              </Text>
            ))}
          </Text>
        </LineModal>

        <LineModal>
          <TextSubTitile fontWeight="medium">Ocupação: </TextSubTitile>

          <Text>{myFreight?.vehicle?.occupation}</Text>
        </LineModal>
        <Line />

        <TitleDetails>Detalhes da carga:</TitleDetails>

        <LineModal>
          <TextSubTitile fontWeight="medium">Produto: </TextSubTitile>
          <Text>{myFreight?.freight?.product}</Text>
        </LineModal>
        <LineModal>
          <TextSubTitile fontWeight="medium">Peso: </TextSubTitile>
          <Text>
            {" "}
            <Mask value={myFreight?.freight?.weightCargo} type="kg" />
          </Text>
        </LineModal>

        <LineModal>
          <TextSubTitile fontWeight="medium">Valor NF:</TextSubTitile>
          <Text>

            {" "}
            <Mask value={formatCurrency(myFreight?.freight?.valueNF || 0)} type="reais" />{" "}
          </Text>
        </LineModal>

        <Line />

        <TitleDetails>Detalhes da viagem:</TitleDetails>

        <LineModal>
          <TextSubTitile fontWeight="medium">Quilometragem: </TextSubTitile>

          <Text> 
            {" "} 
            <Mask value={myFreight?.freight?.totalAmountRoute} type="km" />{" "}
          </Text> 
        </LineModal>
        <LineModal>
          <TextSubTitile fontWeight="medium">Valor: </TextSubTitile>
          <Text>
            {" "}
            <Mask value={formatCurrency(myFreight?.driver?.valueNegotiated || 0)} type="reais" />{" "}
          </Text>
        </LineModal>

        <Line />
        <TitleDetails>Observação:</TitleDetails>
        <LineModal>
          <Text>{myFreight?.freight?.observation}</Text>
        </LineModal>

        <Button
          marginTop={5}
          width="40%"
          borderRadius={"5px"}
          bg="rgba(37,211,102, 1)"
          onPress={() => {
            Linking.openURL(
              `https://api.whatsapp.com/send/?phone=55${myFreight?.freight?.phoneRespContractFreigtage}&text=Olá! Meu nome é ${user?.name}, desejo ter mais informações referente ao frete id:${myFreight?.numberSerial}&app_absent=0`
            );
          }}
        >
          <View style={{ alignItems: "center" }}>
            <MaterialCommunityIcons name="whatsapp" size={25} color="#fff" />
            <Text color="#fff" fontWeight="bold" textAlign="center">
              Suporte via
            </Text>
          </View>
        </Button>

        <View style={{ marginBottom: 150 }}>
          <ButtonFixed />
        </View>

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
                  bg="rgb(255,49,0)"
                  onPress={() => {
                    setShowModalStage(false);
                  }}
                >
                  Não
                </Button>

                <Button
                  width="45%"
                  bg="rgb(1,36,67)"
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
       
        <Modal
          isOpen={showModalAlertLocation}
          onClose={() => setShowModalAlertLocation(false)}
          size="lg"
        >
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header>Atenção</Modal.Header>
            <Modal.Body>
              <VStack space={3}>
                <Text fontWeight="medium">
                  Neste momento iniciamos um serviço em segundo plano para que o
                  app possa funcionar corretamente.
                </Text>
                <Text fontWeight="medium">
                  Sugerimos que você mantenha o app aberto, pode ser minimizado,
                  mas não fechado, para que todos os requisitos da viagem possam
                  ser atendidos.
                </Text>
                <Text fontWeight="medium">
                  Fique tranquilo, após a finalização da viagem o serviço será
                  desativado automaticamente.
                </Text>
              </VStack>
            </Modal.Body>

          </Modal.Content>
        </Modal>
      </ScrollView>
      <ModalPermissions
        animationType="slide"
        visible={modalPermissionsVisible}
        onRequestClose={() => {
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
    </Container>
  );
}
