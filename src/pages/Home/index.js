import { SIGNAL_KEY } from "@env";
import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { AuthContext } from "../../contexts/auth";
import { FilterContext } from "../../contexts/filter";
import firestore from "@react-native-firebase/firestore";
import {
  Button,
  Modal,
  VStack,
  Text
} from "native-base";

import { Container, ListFreights, ViewMessage } from "./styles";

import Header from "../../components/Header";
import FreightList from "../../components/FreightList";
import { FilterParameters } from "./FilterParameters";
import Geolocation from "react-native-geolocation-service";
import config from '../../config/variables.json'
import OneSignal from "react-native-onesignal";

import { Card, Icon } from "react-native-paper";

OneSignal.setAppId(SIGNAL_KEY);
// import Geolocation from '@react-native-community/geolocation';

function Home() {
  const [userAuthorizedFreights, setUserAuthorizedFreights] = useState(false);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  console.log("user")
  console.log(user)

  const insets = useSafeAreaInsets();
  const {
    filterVehicle,
    filterBodywork,
    filterDestinyState,
    filterOriginCity,
    filterOriginState,
    filterDestinyCity,
    clearFilter,
    freightsInLine,
    setFreightsInLine,
    position,
    setPosition,
    radiusPosition,
    setRadiusPosition,
  } = useContext(FilterContext);

  const [loading, setLoading] = useState(true);

  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [lastItem, setLastItem] = useState("");
  const [emptyList, setEmptyList] = useState(false);
  const [freights, setFreights] = useState([]);
  const [freightsFilteredData, setFreightsFilteredData] = useState(
    freightsMasterData
  ); //dados filtrados, ou seja, resultado da pesquisa realizada na lista original.
  const [freightsMasterData, setFreightsMasterData] = useState([]); //todos os dados da lista.
  const [filterParameter, setFilterParameter] = useState("");
  const [showModalFilter, setShowModalFilter] = useState(false);
  //const [userId, setUserId]  = useState()

  const [idNotification, setIdNotification] = useState("");
  const displayLimit = 2000; //limites de fretes mostrados na tela

  function onResult(QuerySnapshot) {
    if (
      QuerySnapshot?.data()?.statusDriver === "informed" ||
      QuerySnapshot?.data()?.statusDriver === "authorized"
    ) {
      setUserAuthorizedFreights(true);
    } else {
      setUserAuthorizedFreights(false);
    }
    // console.log(userAuthorizedFreights)
    return () => {};
  } // verifica se o perfil esta com dados preenchidos

  function onError(error) {
    console.error(error);
  }

  useEffect(() => {
    let isActive = true;
    const unsubscribe = firestore()
      .collection("drivers_users")
      .doc(user?.uid)
      .onSnapshot(onResult, onError);
  
    async function loadFunction() {
      try {
        if (isActive) {
          // Você pode colocar lógica adicional aqui, se necessário.
          firestore()
          .collection("drivers_users")
          .doc(user?.uid)
          .onSnapshot(onResult, onError);
        }
      } catch (err) {
        console.log(err);
      }
    }
  
    loadFunction();
  
    return () => {
      isActive = false;
      unsubscribe(); // Cancelar a assinatura do Firestore
    };
  }, []);
  


  //pega id de notificação e manda para o banco de dados
  const getIdNotification = async () => {
    let isActive = true;
    let resultIdNotification = "";
    try {
      if (isActive) {
        resultIdNotification = (await OneSignal.getDeviceState()).userId;
        if (resultIdNotification !== "") {
          setIdNotification(resultIdNotification);
          console.log(resultIdNotification);
          firestore()
            .collection("drivers_users")
            .doc(user.uid)
            .update({ idNotification: resultIdNotification })
            .then(() => {
              console.log("id notificacao salvo");
            })
            .catch((err) => {
              console.log("Erro ao salvar id de notificacao: ", err);
            });
        }
      }
    } catch (err) {
      console.log(err);
    }

    return () => (isActive = false);
  };

  //recebe as coordendas do local dele e as coordenadas do frete, então faz o calculo e devolve a distancia entre os dois
  function getDistanceFromLatLonInKm(position1, position2) {
    if (position1.latitude == null || position1.longitude == null) {
      // console.log('position1 is null')
      return 1000;
    } else {
      ("use strict");
      let deg2rad = function (deg) {
          return deg * (Math.PI / 180);
        },
        R = 6371,
        dLat = deg2rad(position2.latitude - position1.latitude),
        dLng = deg2rad(position2.longitude - position1.longitude),
        a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(position1.latitude)) *
            Math.cos(deg2rad(position1.latitude)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      console.log(user.groupId)

      const unsubscribe = firestore()
        .collection("freight")
        .where("status.code", "==", "01")
        .orderBy("createData", "desc")
        .limit(displayLimit)
        .onSnapshot(snapshot => {
          if (isActive) {
            const freigthList = [];
            snapshot.docs.forEach((u) => {
              
              console.log("user.groupId " + user.groupId)
              console.log(u.data())

              let isGroup = false;

              u.data().groupOrder.forEach((group) => {
                console.log("group.idGroup " + group.idGroup)
                console.log("user.groupId " + user.groupId)

                if(group.idGroup === user.groupId && group.active){
                  isGroup = true;
                }
              })

              if(isGroup){
                  console.log("ACHOU O GRUPO CORRETO")
                  freigthList.push({
                    ...u.data(),
                    id: u.id,
                  });

              }else {
                console.log("NAO ACHOU O GRUPO CORRETO")
              }
            });

            setEmptyList(!!snapshot.empty);
            setFreightsMasterData(freigthList);
            setFreightsFilteredData(freigthList);
            setLastItem(snapshot.docs[snapshot.docs.length - 1]);
            setLoading(false);
          }
        }, error => {
          console.log(error);
        });
  
      function fetchFreights() {
        firestore()
          .collection("drivers_users")
          .doc(user.uid)
          .update({ lastOnline: new Date() }); // cadastra no banco a ultima vez que esteve online
        getLocation();
        getFreightsInLine();
        getIdNotification();
      }
  
      fetchFreights();
  
      return () => {
        isActive = false;
        unsubscribe(); // Cancelar a assinatura do Firestore
      };
    }, [])
  );
  
  async function getFreightsInLine() {
    let isActive = true;
    firestore()
      .collection("drivers_users")
      .doc(user.uid)
      .collection("myFreightsList")
      .get()
      .then((snapshot) => {
        if (isActive) {
          // setFreights([]);
          const freigthLine = [];

          snapshot.docs.map((u) => {
            freigthLine.push({
              ...u.data(),
            });
          });
          setFreightsInLine(freigthLine.length);
          //setFreights(freigthList);
        }
        return () => {
          isActive = false;
        };
      });
  }

  // Buscar mais freights quando puxar sua lista pra cima
  async function handleRefreshFreights() {
    setLoadingRefresh(true);

    console.log("handleRefreshFreightsuser.groupId")
    console.log(user.groupId)

    firestore()
      .collection("freight")
      .where("status.code", "==", "01")
      .orderBy("createData", "desc")
      .limit(displayLimit)
      .get()
      .then((snapshot) => {
        setFreights([]);
        const freigthList = [];

        snapshot.docs.map((u) => {
          freigthList.push({
            ...u.data(),
            id: u.id,
          });
        });

        setEmptyList(false);

        let filteredData = freigthList;

        if (filterVehicle) {
          filteredData = filteredData.filter(
            (item) =>
              (item.vehicle.typeVehicle.dados[0].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[0].selected) ||
              (item.vehicle.typeVehicle.dados[1].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[1].selected) ||
              (item.vehicle.typeVehicle.dados[2].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[2].selected) ||
              (item.vehicle.typeVehicle.dados[3].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[3].selected) ||
              (item.vehicle.typeVehicle.dados[4].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[4].selected) ||
              (item.vehicle.typeVehicle.dados[5].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[5].selected) ||
              (item.vehicle.typeVehicle.dados[6].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[6].selected) ||
              (item.vehicle.typeVehicle.dados[7].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[7].selected) ||
              (item.vehicle.typeVehicle.dados[8].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[8].selected) ||
              (item.vehicle.typeVehicle.dados[9].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[9].selected)
          );
        }

        if (filterBodywork) {
          filteredData = filteredData.filter(
            (item) =>
              (item.vehicle.typeBodywork.dados[0].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[0].selected) ||
              (item.vehicle.typeBodywork.dados[1].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[1].selected) ||
              (item.vehicle.typeBodywork.dados[2].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[2].selected) ||
              (item.vehicle.typeBodywork.dados[3].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[3].selected) ||
              (item.vehicle.typeBodywork.dados[4].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[4].selected) ||
              (item.vehicle.typeBodywork.dados[5].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[5].selected) ||
              (item.vehicle.typeBodywork.dados[6].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[6].selected) ||
              (item.vehicle.typeBodywork.dados[7].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[7].selected) ||
              (item.vehicle.typeBodywork.dados[8].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[8].selected) ||
              (item.vehicle.typeBodywork.dados[9].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[9].selected) ||
              (item.vehicle.typeBodywork.dados[10].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[10].selected)
          );
        }

        if (filterOriginState) {
          filteredData = filteredData.filter((item) =>
            item?.firstDelivery?.uf.includes(filterOriginState)
          );
        }

        if (filterOriginCity) {
          filteredData = filteredData.filter((item) =>
            item?.firstDelivery?.city.includes(filterOriginCity)
          );
        }

        if (filterDestinyState) {
          filteredData = filteredData.filter((item) =>
            item?.lastDelivery?.uf?.includes(filterDestinyState)
          );
        }

        if (filterDestinyCity) {
          filteredData = filteredData.filter((item) =>
            item?.lastDelivery?.city?.includes(filterDestinyCity)
          );
        }

        if (radiusPosition) {
          filteredData = filteredData.filter(
            (item) =>
              getDistanceFromLatLonInKm(
                position,
                //console.log(freigthList[0]?.firstDelivery.coordinates.longitude)

                {
                  latitude: item?.firstDelivery?.coordinates?.latitude,
                  longitude: item?.firstDelivery?.coordinates?.longitude,
                }
              ) <= radiusPosition
          );
        }

        setFreightsMasterData(filteredData);
        setFreightsFilteredData(filteredData);

        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
      });

    setLoadingRefresh(false);
  }

  // Buscar mais freights ao chegar no final da lista
  async function getListFreights() {
    if (emptyList) {
      // se buscou toda sua lista tiramos o loading.
      setLoading(false);
      return null;
    }

    if (loading) return;

    console.log("getListFreights user.groupId")
    console.log(user.groupId)

    firestore()
      .collection("freight")
      // .collection('freight_teste') __temp_

      .where("status.code", "==", "01")
      .orderBy("createData", "desc")
      .limit(displayLimit)

      .startAfter(lastItem)
      .get()
      .then((snapshot) => {
        const freigthList = [];

        snapshot.docs.map((u) => {
          freigthList.push({
            ...u.data(),
            id: u.id,
          });
        });

        setEmptyList(!!snapshot.empty);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        // setFreights(oldFreights => [...oldFreights, ...freigthList]);
        //setFreightsFilteredData(freigthList);

        setFreightsMasterData((oldFreights) => [
          ...oldFreights,
          ...freigthList,
        ]);

        setFreightsFilteredData((oldFreights) => [
          ...oldFreights,
          ...freigthList,
        ]);

        let filteredData = freightsMasterData;

        console.log("comecando 1", filteredData.length);
        test()
        if (filterVehicle) {
          filteredData = filteredData.filter(
            (item) =>
              (item.vehicle.typeVehicle.dados[0].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[0].selected) ||
              (item.vehicle.typeVehicle.dados[1].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[1].selected) ||
              (item.vehicle.typeVehicle.dados[2].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[2].selected) ||
              (item.vehicle.typeVehicle.dados[3].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[3].selected) ||
              (item.vehicle.typeVehicle.dados[4].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[4].selected) ||
              (item.vehicle.typeVehicle.dados[5].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[5].selected) ||
              (item.vehicle.typeVehicle.dados[6].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[6].selected) ||
              (item.vehicle.typeVehicle.dados[7].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[7].selected) ||
              (item.vehicle.typeVehicle.dados[8].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[8].selected) ||
              (item.vehicle.typeVehicle.dados[9].name === filterVehicle &&
                item.vehicle.typeVehicle.dados[9].selected)
          );
        }

        if (filterBodywork) {
          filteredData = filteredData.filter(
            (item) =>
              (item.vehicle.typeBodywork.dados[0].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[0].selected) ||
              (item.vehicle.typeBodywork.dados[1].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[1].selected) ||
              (item.vehicle.typeBodywork.dados[2].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[2].selected) ||
              (item.vehicle.typeBodywork.dados[3].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[3].selected) ||
              (item.vehicle.typeBodywork.dados[4].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[4].selected) ||
              (item.vehicle.typeBodywork.dados[5].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[5].selected) ||
              (item.vehicle.typeBodywork.dados[6].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[6].selected) ||
              (item.vehicle.typeBodywork.dados[7].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[7].selected) ||
              (item.vehicle.typeBodywork.dados[8].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[8].selected) ||
              (item.vehicle.typeBodywork.dados[9].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[9].selected) ||
              (item.vehicle.typeBodywork.dados[10].name === filterBodywork &&
                item.vehicle.typeBodywork.dados[10].selected)
          );
        }

        if (filterOriginState) {
          filteredData = filteredData.filter((item) =>
            item?.firstDelivery?.uf.includes(filterOriginState)
          );
        }

        if (filterOriginCity) {
          filteredData = filteredData.filter((item) =>
            item?.firstDelivery?.city.includes(filterOriginCity)
          );
        }

        if (filterDestinyState) {
          filteredData = filteredData.filter((item) =>
            item?.lastDelivery?.uf?.includes(filterDestinyState)
          );
        }

        if (filterDestinyCity) {
          filteredData = filteredData.filter((item) =>
            item?.lastDelivery?.city?.includes(filterDestinyCity)
          );
        }

        if (radiusPosition) {
          filteredData = filteredData.filter(
            (item) =>
              getDistanceFromLatLonInKm(
                position,

                //   console.log(freigthList[0]?.firstDelivery.coordinates.longitude)
                {
                  latitude: item?.firstDelivery?.coordinates?.latitude,
                  longitude: item?.firstDelivery?.coordinates?.longitude,
                }
              ) <= radiusPosition
          );
        }
        setFreightsFilteredData(filteredData);

        //se a distancia entre minha posição atual e o frete for menor que o valor definido, então é true

        setLoading(false);
      });
  }

  async function filter() {
    let filteredData = freightsMasterData;

    console.log("comecando 2", filteredData.length);
    if (filterVehicle) {
      filteredData = filteredData.filter(
        (item) =>
          (item.vehicle.typeVehicle.dados[0].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[0].selected) ||
          (item.vehicle.typeVehicle.dados[1].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[1].selected) ||
          (item.vehicle.typeVehicle.dados[2].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[2].selected) ||
          (item.vehicle.typeVehicle.dados[3].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[3].selected) ||
          (item.vehicle.typeVehicle.dados[4].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[4].selected) ||
          (item.vehicle.typeVehicle.dados[5].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[5].selected) ||
          (item.vehicle.typeVehicle.dados[6].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[6].selected) ||
          (item.vehicle.typeVehicle.dados[7].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[7].selected) ||
          (item.vehicle.typeVehicle.dados[8].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[8].selected) ||
          (item.vehicle.typeVehicle.dados[9].name === filterVehicle &&
            item.vehicle.typeVehicle.dados[9].selected)
      );
    }

    if (filterBodywork) {
      filteredData = filteredData.filter(
        (item) =>
          (item.vehicle.typeBodywork.dados[0].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[0].selected) ||
          (item.vehicle.typeBodywork.dados[1].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[1].selected) ||
          (item.vehicle.typeBodywork.dados[2].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[2].selected) ||
          (item.vehicle.typeBodywork.dados[3].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[3].selected) ||
          (item.vehicle.typeBodywork.dados[4].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[4].selected) ||
          (item.vehicle.typeBodywork.dados[5].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[5].selected) ||
          (item.vehicle.typeBodywork.dados[6].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[6].selected) ||
          (item.vehicle.typeBodywork.dados[7].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[7].selected) ||
          (item.vehicle.typeBodywork.dados[8].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[8].selected) ||
          (item.vehicle.typeBodywork.dados[9].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[9].selected) ||
          (item.vehicle.typeBodywork.dados[10].name === filterBodywork &&
            item.vehicle.typeBodywork.dados[10].selected)
      );
    }

    if (filterOriginState) {
      filteredData = filteredData.filter((item) =>
        item?.firstDelivery?.uf.includes(filterOriginState)
      );
    }

    if (filterOriginCity) {
      filteredData = filteredData.filter((item) =>
        item?.firstDelivery?.city.includes(filterOriginCity)
      );
    }

    if (filterDestinyState) {
      filteredData = filteredData.filter((item) =>
        item?.lastDelivery?.uf?.includes(filterDestinyState)
      );
    }

    if (filterDestinyCity) {
      filteredData = filteredData.filter((item) =>
        item?.lastDelivery?.city?.includes(filterDestinyCity)
      );
    }

    if (radiusPosition) {
      filteredData = filteredData.filter(
        (item) =>
          getDistanceFromLatLonInKm(
            position,
            //console.log(freigthList[0]?.firstDelivery.coordinates.longitude)

            {
              latitude: item?.firstDelivery?.coordinates?.latitude,
              longitude: item?.firstDelivery?.coordinates?.longitude,
            }
          ) <= radiusPosition
      );
    }
    setFreightsFilteredData(filteredData);
  }
  function clearFilters() {
    clearFilter();
    setFreightsFilteredData(freightsMasterData);
  }

  function test() {
    console.log(`
    veiculo:${filterVehicle}
    Carroceria:${filterBodywork}
    Uf origem${filterOriginState}
    cidade origem:${filterOriginCity}
    UF destino:${filterDestinyState}
    cidade destino:${filterDestinyCity}
    position.latitude: ${position.latitude}
    position.longitude:${position.longitude}
    radiusPosition: ${radiusPosition}
    `);
  }

  async function getLocation() {
    Geolocation.getCurrentPosition(
      async (position) => {
        // console.log(`${position.timestamp} ${new Date()}`);
        // console.log(position)
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        // await BackgroundService.updateNotification({ taskDesc: `${new Date()}` });
        // firestore().collection('drivers_users').doc(user.uid).update({ position: position });
        // firestore().collection('drivers_users').doc(user.uid).collection('positions').add({ position: position });
      },
      (error) => {
        // See error code charts below.
        console.log("err");
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 20000 }
    );
  }
  
   const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "#f4f4f4"
        },
        card: {
          width: "90%",
          paddingVertical: 20,
          alignItems: "center",
          borderRadius: 10,
          elevation: 3,
        },
        content: {
          alignItems: "center",
        },
        title: {
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 10,
          color: "rgb(1,36,67)",
        },
        message: {
          fontSize: 16,
          textAlign: "center",
          marginTop: 5,
          color: "#555",
        },
      });
  

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: 80 + insets.bottom }}>
      <Header namePage="Fretes disponíveis" />

            <Modal
              isOpen={showModalFilter}
              onClose={() => setShowModalFilter(false)}
              size="lg"
            >
              <Modal.Content maxWidth="350">
                <Modal.CloseButton />
                <Modal.Header>Filtro de fretes </Modal.Header>
                <Modal.Body>
                  <VStack space={3}>
                    <FilterParameters />
                  </VStack>
                </Modal.Body>
                <Modal.Footer justifyContent="space-between">
                  <Button
                    width="45%"
                    bg={config?.cor_primaria}
                    onPress={() => {
                      setShowModalFilter(false);
                      filter();
                      test();
                    }}
                  >
                    Aplicar filtros
                  </Button>
                  <Button
                    width="40%"
                    bg="rgba(220,0,0,.5)"
                    onPress={() => {
                      setShowModalFilter(false);
                      clearFilters();
                    }}
                  >
                    Limpar filtros
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>

            <TouchableOpacity
              onPress={() => setShowModalFilter(true)}
              style={{
                backgroundColor: config?.cor_secundaria,
                height: 50,
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                alignItems: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Feather
                name="filter"
                size={25}
                color="#fff"
                style={{ marginLeft: 5 }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  color: config?.cor_neutra,
                  padding: 10,
                  textAlign: "center",
                }}
              >
                Filtrar fretes
              </Text>
            </TouchableOpacity>

            {loading ? (
              <ViewMessage>
                <ActivityIndicator size={50} color={config?.cor_secundaria} />
              </ViewMessage>
            ) : freightsFilteredData.length > 0 ? (
              <ListFreights
                showsVerticalScrollIndicator={false}
                data={freightsFilteredData}
                renderItem={({ item }) => (
                  <FreightList
                    userAuthorizedFreights={userAuthorizedFreights}
                    data={item}
                    userId={user?.uid}
                    key={item.id}
                  />
                )}
                refreshing={loadingRefresh}
                onRefresh={handleRefreshFreights}
                onEndReached={() => getListFreights()}
                onEndReachedThreshold={0.1}
              />
            ) : (

              <View style={styles.container}>
                <Card style={styles.card}>
                  <Card.Content style={styles.content}> 
                    <Icon source="package-variant-closed" size={50} color="rgb(1,36,67)" />
                    <Text style={styles.title}>Fretes disponíveis</Text>
                    <Text style={styles.message}>
                      Fica de olho! Assim que surgirem novos fretes, eles vão aparecer aqui pra você
                    </Text>
                  </Card.Content>
                </Card>
              </View>

              // <ViewMessage>
              //   <TextMessage>
              //     Aqui será listado todos os fretes ques estão disponíveis para
              //     realizar...
              //   </TextMessage>
              // </ViewMessage>
            )}

    </Container>
  );
}

export default Home;

