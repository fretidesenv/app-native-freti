import React, { useState, useEffect } from "react";
import config from "../../config/variables.json";
import { formatDistance } from "date-fns";

import { ptBR } from "date-fns/locale";
// import { Text, View } from 'react-native';
import {
  View,
  Linking,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import {
  BodyCard,
  BodyCardDescription,
  ButtonActionStoppingPoint,
  ButtonActionStoppingPointLink,
  CardStoppingPoint,
  Container,
  FooterCard,
  HeaderCard,
  IconCargaDescagarga,
  Image,
  Legend,
  LegendButtonAction,
  LegendOpenClose,
  LineContent,
  LineModal,
  Text,
  TextButtonLink,
  ViewHeader,
  ViewOpenCloseButton,
} from "./styles";
import firestore from "@react-native-firebase/firestore";
import * as Animatable from "react-native-animatable";
// import {UploadImageFreight} from '../UploadImageFreight';
import Entypo from "react-native-vector-icons/Entypo";
import MapView, { Marker } from "react-native-maps";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { UploadImageStoppingPoints } from "../UploadImageStoppingPoints";

function StoppingPoints(props) {
  const navigation = useNavigation();

  // const {user} = useContext(AuthContext);
  const [stoppgingPoints, setStoppingPoints] = useState(null);
  // let stoppgingPoints = []
  // stoppgingPoints = stopping_points
  const AnimatedButton = Animatable.createAnimatableComponent(
    MaterialCommunityIcons
  );

  const [resultStatusFreightDriver, setResultStatusFreightDriver] = useState(
    ""
  );
  const [myFreight, setMyFreight] = useState(null);
  
  useEffect(() => {
    const subscriber = firestore()
      .collection("freight")
      .doc(props?.idFreight) 
      .onSnapshot((documentSnapshot) => {
        setMyFreight(documentSnapshot.data());

      });
    getStoppingPoints();
    viewLine();
    return () => subscriber();
  }, [props?.idFreight, props.refreshing]);

  function formatTime(date) {
    // console.log(new Date(data.created.seconds * 1000));
    const dateRegistration = new Date(date?.seconds * 1000);

    return formatDistance(new Date(), dateRegistration, {
      locale: ptBR,
    });
  }

  async function getStoppingPoints() {
    firestore()
      .collection("freight")
      .doc(props?.idFreight)
      .collection("stopping_points")
      .orderBy("stop_order", "asc")
      .get()
      .then((snapshot) => {
        const listStoppgingPoints = [];

        snapshot.docs.map((u) => {
          listStoppgingPoints.push({
            ...u.data(),
            id: u.id,
            isVisible: false,
            isVisibleModal: false,
          });
        });
        console.log(listStoppgingPoints[0]);
        setStoppingPoints(listStoppgingPoints);

        //  setLoading(false);
      });
    return () => {};
  }

  function viewLine() {
    const subscriber = firestore()
      .collection(`freight/${props?.idFreight}/queue`)
      .doc(props.user.uid)
      .onSnapshot((documentSnapshot) => {
        setResultStatusFreightDriver(documentSnapshot.data().status);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  const toggleCardVisibility = (index) => {
    const updatedCards = [...stoppgingPoints];
    updatedCards[index].isVisible = !updatedCards[index].isVisible;
    setStoppingPoints(updatedCards);
  };

  const toggleModalCardVisibility = (index) => {
    const updatedCards = [...stoppgingPoints];
    updatedCards[index].isVisibleModal = !updatedCards[index].isVisibleModal;
    setStoppingPoints(updatedCards);
  };

  const toggleConcluded = (index) => {
    const updatedCards = [...stoppgingPoints];
    updatedCards[index].concluded = !updatedCards[index].concluded;
    setStoppingPoints(updatedCards);
  };

  const renderItem = (item, index, lastConcluded, lengthList) => {
  
    let date_operation = item?.date_operation.split("-");
    
    return (
      <CardStoppingPoint>
        <HeaderCard>
          <ViewHeader>
            <Text style={{ color: "rgba(0,180,55, 1)" }}>
              {item?.currentTraject === true ? "Trajeto atual" : null}
            </Text>
            {item?.concluded === true && item?.verify === true ? (
              <>
                <Feather
                  name="check-circle"
                  size={22}
                  color="rgba(0,180,55, 1)"
                />
                <BodyCardDescription style={{ color: "rgba(0,180,55, 1)" }}>
                  Concluido
                </BodyCardDescription>
              </>
            ) : item?.concluded === true && item?.verify === false ? (
              <>
                <Feather name="info" size={22} color="#f4bc0b" />
                <BodyCardDescription style={{ color: "#f4bc0b" }}>
                  Aguardando validação
                </BodyCardDescription>
              </>
            ) : (
              <>
                <Feather name="circle" size={22} color="#E52246" />
                <BodyCardDescription style={{ color: "#E52246" }}>
                  Pendente
                </BodyCardDescription>
              </>
            )}
         
            {item?.operation?.includes("descarga") && (
              <IconCargaDescagarga
                width="40"
                height="31"
                source={require("../../assets/icone-descarga.png")}
              />
            )}
    
            {item?.operation?.includes("carga") && (
              <IconCargaDescagarga
                width="40"
                height="30.48"
                source={require("../../assets/icone-carga.png")}
              />
            )}

          </ViewHeader>
          <ViewHeader
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {item?.observation !== "" ? (
              <MaterialCommunityIcons
                name="alert"
                size={25}
                color={"#f4bc0b"}
              />
            ) : null}
            
            <Text style={{ color: "#000" }}>
              Parada {index + 1}/{stoppgingPoints?.length}
            </Text>
          </ViewHeader>
        </HeaderCard>
        <BodyCard>
          <LineContent>
            <Legend>Empresa: </Legend>
            <BodyCardDescription>{item?.name}</BodyCardDescription>
          </LineContent>

          <LineContent>
            <Legend>Endereço: </Legend>
            <BodyCardDescription>
              {item?.logradouro}, {item?.number}
            </BodyCardDescription>
          </LineContent>

          <LineContent>
            <Legend>Localidade: </Legend>
            <BodyCardDescription>
              {item?.city} - {item?.uf}
            </BodyCardDescription>
          </LineContent>

          {item?.isVisible === true ? (
            <>
              <MapView
                style={{ width: "100%", height: 200}}
                region={{
                  latitude: item?.latitude,
                  longitude: item?.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: item?.latitude,
                    longitude: item?.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  title={"Origem"}
                  description={"Este é seu local de carregamento"}
                ></Marker>
              </MapView>

              <LineModal>
                <Legend>Operação:</Legend>
                <BodyCardDescription>
                  {item?.operation?.map((v, k) => (
                    <Text key={k}>
                      {v}
                      {item?.operation?.length - 1 === k ? "." : " e "}
                    </Text>
                  ))}
                </BodyCardDescription>
              </LineModal>

              <LineModal>
                <Legend>Data da operação:</Legend>
                <BodyCardDescription>
                  {date_operation[2]}/{date_operation[1]}/{date_operation[0]} - {item?.time_operation}
                </BodyCardDescription>
              </LineModal>

              {/* <LineModal>
                <Legend>Horário da operação:</Legend>
                <BodyCardDescription>
                  {item?.time_operation}
                </BodyCardDescription>
              </LineModal> */}

              <LineModal>
                <Legend>Responsavel:</Legend>
                <BodyCardDescription>
                  {item?.responsible_name}
                </BodyCardDescription>
              </LineModal>

              <LineModal>
                <Legend>Contato do responsável:</Legend>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => {
                    Linking.openURL(
                      `https://api.whatsapp.com/send/?phone=55${item?.responsible_phone}&text=Olá! Meu nome é ${props.user.name}, estou entrando em contato pois preciso de ajuda em um ponto de parada que você é responsável.&app_absent=0`
                    );
                  }}
                > 
                  <MaterialCommunityIcons
                    name="whatsapp"
                    size={18}
                    color="rgba(37,211,102,1)"
                    style={{ marginRight: 5 }}
                  />
                  <BodyCardDescription>{item?.responsible_phone}</BodyCardDescription>
                </TouchableOpacity>
              </LineModal>

              {item?.operation?.includes("carga") === true ? (
                <LineModal>
                  <Legend>Numero da coleta:</Legend>
                  <BodyCardDescription style={{ fontWeight: "bold" }}>
                    {item?.number_collect}
                  </BodyCardDescription>
                </LineModal>
              ) : null}

              <LineContent
                style={{
                  flexDirection: "column",
                }}
              >
                <Legend>Observação:</Legend>
                <BodyCardDescription>{item?.observation}</BodyCardDescription>
              </LineContent>

              <LineContent
                style={{
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  flexDirection: "column",
                }}
              >
                <Legend>Status: </Legend>
                <View style={{ flexDirection: "row" }}>
                  {item?.concluded === true && item?.verify === true ? (
                    <>
                      <Feather
                        name="check-circle"
                        size={22}
                        color="rgba(0,180,55, 1)"
                      />
                      <BodyCardDescription
                        style={{ color: "rgba(0,180,55, 1)" }}
                      >
                        Concluido
                      </BodyCardDescription>
                    </>
                  ) : item?.concluded === true && item?.verify === false ? (
                    <>
                      <Feather name="info" size={22} color="#f4bc0b" />
                      <BodyCardDescription style={{ color: "#f4bc0b" }}>
                        Entregue e aguardando validação
                      </BodyCardDescription>
                    </>
                  ) : (
                    <>
                      <Feather name="circle" size={22} color="#E52246" />
                      <BodyCardDescription style={{ color: "#E52246" }}>
                        Pendente
                      </BodyCardDescription>
                    </>
                  )}
                </View>
              </LineContent>
            </>
          ) : null}
        </BodyCard>

        {props?.freightInitialized === true &&
        !item?.concluded &&
        item?.isVisible === true 
        // &&
        // (lastConcluded === true || item?.stop_order === 1) 
        ? (
          <>
            <ButtonActionStoppingPointLink
              onPress={() => {
                Linking.openURL(
                  `https://www.google.com/maps/dir//${item?.latitude},${item?.longitude}`
                );
              }}
            >
              <View style={{ alignItems: "center", flexDirection: "row" }}>
                <TextButtonLink>IR PARA GPS</TextButtonLink>
                <Entypo name="location" size={25} color="#fff" />
              </View>
            </ButtonActionStoppingPointLink>

            <FooterCard>
              <ButtonActionStoppingPoint
                style={{ backgroundColor: "#f4bc0b" }}
                onPress={() =>
                  navigation.navigate("FreightInformEvent", {
                    idFreight: props?.idFreight,
                    stoppgingPoint: item,
                  })
                }
              >
                <LegendButtonAction>INFORMAR EVENTO</LegendButtonAction>
              </ButtonActionStoppingPoint>

              
            </FooterCard>

            <FooterCard>
              <ButtonActionStoppingPoint
                style={{ backgroundColor: "rgba(0,180,55, 1)" }}
                onPress={() => {
                  toggleModalCardVisibility(index);
                }}
              >
                <LegendButtonAction>CONCLUIR PARADA</LegendButtonAction>
              </ButtonActionStoppingPoint>
            </FooterCard>
          </>
        ) : null}
        {item?.isVisible ? (
          <FooterCard>
            {item?.events?.length > 0 ? (
              <>
                {/* <Legend>Eventos registrados: </Legend>   */}
                <FlatList
                  data={item?.events}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 10 }}
                  renderItem={({ item: event, index }) => (
                    <View
                      style={{
                        backgroundColor: config?.cor_primaria,
                        margin: 6,
                        padding: 10,
                        borderRadius: 10,
                        width: 250, // 👈 define a largura do "cartão" no carrossel
                      }}
                    >
                      <Legend style={{ color: "white", paddingLeft: 5 }}>
                        {event?.event?.cod} - {event?.event?.desc}
                      </Legend>

                      <BodyCardDescription
                        style={{ color: "rgba(255,255,255, .8)" }}
                      >
                        Descrição: {event?.description}
                      </BodyCardDescription>

                      {event?.images?.map((img, i) => (
                        <Image
                          key={i}
                          source={{ uri: img || "" }}
                          style={{ width: 100, height: 100, marginTop: 5, borderRadius: 8 }}
                          resizeMode="cover"
                        />
                      ))}

                      {event?.created_at && (
                        <BodyCardDescription
                          style={{
                            color: "rgba(255,255,255, .8)",
                            textAlign: "right",
                            marginTop: 5,
                          }}
                        >
                          Informado há: {formatTime(event?.created_at)}
                        </BodyCardDescription>
                      )}
                    </View>
                  )}
                />


                {/* {item?.events.map((event, index) => (
                  <View
                    style={{
                      backgroundColor: config?.cor_primaria,
                      margin: 2,
                      padding: 5,
                      borderRadius: 10,
                    }}
                    key={index}
                  >
                    <Legend style={{ color: "white", paddingLeft: 5 }}>
                      {event?.event?.cod} - {event?.event?.desc} 
                    </Legend>

                    <BodyCardDescription
                      style={{ color: "rgba(255,255,255, .8)" }}
                    >
                      Descrição: {event?.description}
                    </BodyCardDescription>

                    {event?.images?.map((img) => (
                        <Image
                          source={{ uri: img ? img : "" }}
                          style={{ width: 50, height: 50, marginTop:5 }}
                        />
                      )
                    )}

                    {event?.created_at && (
                      <BodyCardDescription
                        style={{
                          color: "rgba(255,255,255, .8)",
                          textAlign: "right",
                        }}
                      >
                        Informado há: {formatTime(event?.created_at)}
                      </BodyCardDescription>
                    )}
                  </View>
                ))} */}
              </>
            ) : null}
          </FooterCard>
        ) : null}
        
        {item?.isVisibleModal === true ? (
          <>
            <Text fontWeight="medium">
              Por gentileza nos encaminhe uma foto com o comprovante de entrega
              desta carga.
            </Text>
            <Text fontWeight="medium">
              Certifique-se de que a imagem esteja em boa qualidade.
            </Text>
            <UploadImageStoppingPoints
              toggleConcluded={toggleConcluded}
              toggleModalCardVisibility={toggleModalCardVisibility}
              getStoppingPoints={getStoppingPoints}
              index={index}
              idFreight={props?.idFreight}
              idStoppingPoint={item?.id}
              isLastDelivery={
                (index + 1) / stoppgingPoints?.length === 1 ? true : false
              }
            />
          </>
        ) : null}

        <ViewOpenCloseButton onPress={() => toggleCardVisibility(index)}>
          {item?.isVisible === true ? (
            <>
              <AnimatedButton
                name="menu-up"
                size={51}
                color="rgb(50,50,50)"
                style={{ marginBottom: -20, marginTop: -10 }}
                iterationCount="infinite"
                animation="swing"
                iterationDelay={1000}
                easing="ease-out"
              />
              <LegendOpenClose style={{ marginBottom: -5 }}>
                Exibir menos
              </LegendOpenClose>
            </>
          ) : (
            <>
              <LegendOpenClose style={{ marginBottom: -10 }}>
                Exibir mais
              </LegendOpenClose>
              <AnimatedButton
                name="menu-down"
                size={51}
                color="rgb(50,50,50)"
                style={{ marginBottom: -20, marginTop: -10 }}
                iterationCount="infinite"
                animation="swing"
                iterationDelay={1000}
                easing="ease-out"
              />
            </>
          )}
        </ViewOpenCloseButton>
      </CardStoppingPoint>
    );
  };

  // console.log('stoppgingPoints.length',stoppgingPoints.length)
  return (
    <Container>
      {stoppgingPoints?.map((item, index) => (
        <View key={item.id}>
          {renderItem(
            item,
            index,
            stoppgingPoints[index - 1]?.concluded,
            stoppgingPoints?.length
          )}
        </View>
      ))}
    </Container>
  );
}

export default StoppingPoints;
