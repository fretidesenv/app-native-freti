import React, { useState, useContext, useEffect } from "react";
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
  AvatarImg,
  StatusFreightDriver,
  TextStatusFreightDriver,
  TextButton,
} from "./styles";

import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Linking,
} from "react-native";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

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
} from "native-base";
import Feather from "react-native-vector-icons/Feather";

import { UploadImageFreight } from "../UploadImageFreight";

import { AuthContext } from "../../contexts/auth";
import config from "../../config/variables.json";
import { Mask } from "./formater";

function MyFreightHistoryList({
  data,
  userId,
  userAuthorizedFreights,
  navigationDatails,
}) {
  const { user } = useContext(AuthContext);

  const navigation = useNavigation();
  const [likePost, setLikePost] = useState(data?.likes);
  const [modalDetails, setModalDetails] = useState(false);
  const [showModalGetFreight, setShowModalGetFreight] = useState(false);
  const [showModalSupport, setShowModalSupport] = useState(false);
  const [showModalOffLine, setShowModalOffLine] = useState(false);
  const [showModalConfirmDelivery, setShowModalConfirmDelivery] = useState(
    false
  );
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [showModalUserAuthorized, setShowModalUserAuthorized] = useState(false);
  const [rowDrivers, setRowDrivers] = useState(0);
  const [imLine, setImLine] = useState(false);
  const [resultStatusFreightDriver, setResultStatusFreightDriver] = useState(
    ""
  );

  const dateCollect = new Date(data?.clientOrigin?.dateCollect);
  const dateCollectDay = dateCollect.getDate();
  const dateCollectMonth = dateCollect.getMonth() + 1;
  const dateCollectYear = dateCollect.getFullYear();

  const dateDelivery = new Date(
    data?.clientDelivery?.timeDelivery?.dateDelivery
  );
  const dateDeliveryDay = dateDelivery.getDate();
  const dateDeliveryMonth = dateDelivery.getMonth() + 1;
  const dateDeliveryYear = dateDelivery.getFullYear();
  const hourStartDelivery =
    data?.clientDelivery?.timeDelivery?.hourStartDelivery;
  const hourEndDelivery = data?.clientDelivery?.timeDelivery?.hourEndDelivery;

  function formatTimeRegistration() {
    try {
      // console.log(new Date(data.created.seconds * 1000));
      let created = new Date(data?.history?.dateFinished?.seconds * 1000);
      // const dateRegistration = new Date(created * 1000);
      const dateRegistration = new Date(created);

      return formatDistance(new Date(), dateRegistration, {
        locale: ptBR,
      });
    } catch (error) {
      return '-'
    }
  }

  function getOffLine() {
    let id = data.id;
    console.clear();
    console.log(data);
    firestore()
      .collection(`freight/${id}/queue`)
      .doc(user.uid)
      .delete()
      .then(() => {
        firestore()
          .collection(`drivers_users/${user.uid}/myFreightsList`)
          .doc(id)
          .delete();
      })
      .catch((error) => console.log(error));
  }

  function viewLine() {
    let id = data.id;
    const subscriber = firestore()
      .collection(`freight/${id}/queue`)
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        //console.log(users.length);
        let verify = [users.find((item) => item.key == user.uid)];
        if (verify[0]?.key === user.uid) {
          setImLine(true);
          setResultStatusFreightDriver(verify[0]?.status);
        } else setImLine(false);
        setRowDrivers(users.length);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  async function takeATrip() {
    await firestore()
      .collection(`freight/${props.idFreight}/queue`)
      .doc(user.uid)
      .update({ status: "hired", hired: new Date() });

    await firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(props.idFreight)
      .update({ status: "hired", hired: new Date() });
  }

  async function cancelInterest() {
    let id = data.id;
    console.clear();
    console.log(data);
    firestore()
      .collection(`freight/${id}/queue`)
      .doc(user.uid)
      .update({ status: "cancelInterest", cancelInterest: new Date() })
      .then(() => {
        setModalDetails(false);
        firestore()
          .collection(`drivers_users/${user.uid}/myFreightsList`)
          .doc(id)
          .delete();
      })
      .catch((error) => console.log(error));
  }

  // REMOVER
  async function r_proximoStatus() {
    let statusForFreight = "approved";
    let statusFreight = { code: "03", describe: "Em análise pelo motorista" };
    firestore()
      .collection(`freight/${idFreight}/queue`)
      .doc(user.uid)
      .update({ status: statusForFreight })
      .catch((error) => console.log(error) && nextStatus(statusForFreight));

    firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .doc(idFreight)
      .update({ status: statusForFreight })
      .catch((error) => console.log(error) && nextStatus(statusForFreight));

    await firestore()
      .collection(`freight`)
      .doc(idFreight)
      .update({ status: statusFreight });

    setShowModalStage(false);
  }

  useEffect(() => {
    verificarListaDeVeiculos();
  }, [data]);
  const [vehicle, setVehicle] = useState({});

  const verificarListaDeVeiculos = async () => {
    let vehicles = [];
    let bodyworks = [];
    for (let i = 0; i < data?.vehicle?.typeVehicle?.dados.length; i++) {
      let item = data?.vehicle?.typeVehicle?.dados[i];
      // console.log(item)
      if (item.selected) {
        vehicles.push(item?.name);
      }
    }
    for (let i = 0; i < data?.vehicle?.typeBodywork?.dados.length; i++) {
      let item = data?.vehicle?.typeBodywork?.dados[i];

      if (item.selected) {
        bodyworks.push(item?.name);
      }
    }
    setVehicle({ vehicles, bodyworks });
  };

  const handleViewMore = () => {
    {
      // resultStatusFreightDriver === "delivered" ||
      // resultStatusFreightDriver === "finished"
      //   ?
      navigationDatails(data.id);
      // : setModalDetails(true) & viewLine(data.id);
    }
  };

  return (
    <Container>
      <Header
      //  onPress={() => navigation.navigate("PostsUser", { title: data.autor, userId: data.userId })}
      >
        {data?.freightLessor?.logo ? (
          <AvatarImg source={{ uri: data?.freightLessor?.logo }} />
        ) : (
          <Avatar>
            <MaterialCommunityIcons name="factory" size={20} color="#fff" />
          </Avatar>
        )}
        <Name numberOfLines={2}>{data?.shipper?.name}</Name>
        {imLine ?? (
          <Text fontWeight="bold" style={{ color: "#0b9104" }}>
            na fila
          </Text>
        )}
      </Header>

      <ContentView>
        <Content>
          Origem: {data?.firstDelivery?.city} - {data?.firstDelivery?.uf}
        </Content>
        <Content>
          Destino: {data?.lastDelivery?.city} - {data?.lastDelivery?.uf}{" "}
        </Content>
        <Content>
          <Mask value={data?.freight?.totalAmountRoute} type="km" />{" "}
        </Content>
      </ContentView>

      <Actions>
        {/* <ButtonMore onPress={() => setModalDetails(true) & viewLine(data.id)}> */}
        <ButtonMore onPress={() => handleViewMore()}>
          <TextMore style={{}}>Ver mais</TextMore>
        </ButtonMore>
        <TimePost>
          finalizado há{" "}
          {formatTimeRegistration() ? formatTimeRegistration() : ""}
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

          <Modal.Body>
            <VStack space={0}>
              <ScrollView>
                <View
                  style={{ justifyContent: "space-between", marginBottom: 3 }}
                >
                  {/*
                  Solicitação para ocultar essa informacao - trello
                  <Text>Documentação enviada por: {rowDrivers} motorista{rowDrivers === 1 ? '' : 's'}</Text> */}

                  <Text>
                    Enviei a documentação?{" "}
                    {imLine ? (
                      <Text fontWeight="bold" style={{ color: "#0b9104" }}>
                        Sim
                      </Text>
                    ) : (
                      <Text>Não</Text>
                    )}
                  </Text>
                </View>
                <TitleDetails>LOCADOR DO FRETE:</TitleDetails>

                <LineModal>
                  <Text fontWeight="medium">Empresa: </Text>
                  <Text>{data?.shipper?.name} </Text>
                </LineModal>

                <Line />
                <TitleDetails>ORIGEM:</TitleDetails>
                {resultStatusFreightDriver === "hired" && (
                  <>
                    <LineModal>
                      <Text fontWeight="medium">Empresa: </Text>
                      <Text>{data?.firstDelivery?.name}</Text>
                    </LineModal>

                    <LineModal>
                      <Text fontWeight="medium">Endereço: </Text>
                      <Text>{data?.firstDelivery?.address}</Text>
                    </LineModal>
                  </>
                )}
                <LineModal>
                  <Text fontWeight="medium">Localidade: </Text>
                  <Text>
                    {data?.firstDelivery?.city} - {data?.firstDelivery?.uf}
                  </Text>
                </LineModal>
                {resultStatusFreightDriver === "hired" && (
                  <>
                    <Button
                      width="100%"
                      bg="rgba(4,52,203,.6)"
                      onPress={() => {
                        Linking.openURL(`https://maps.app.goo.gl/`);
                      }}
                    >
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <Text color="#fff" font-weight="bold" paddingRight="2%">
                          Ver origem no mapa
                        </Text>
                        <Entypo name="location" size={25} color="#fff" />
                      </View>
                    </Button>
                  </>
                )}
                {/* {data.originCompanyLogo ?
                  (<CompanyLogo
                    style={{}}
                    source={{
                      uri: data?.originCompanyLogo,
                    }}
                  />) : null} */}

                <Line />
                <TitleDetails>DESTINO:</TitleDetails>
                {resultStatusFreightDriver === "hired" && (
                  <>
                    <LineModal>
                      <Text fontWeight="medium">Empresa: </Text>
                      <Text>{data?.lastDelivery?.name}</Text>
                    </LineModal>

                    <LineModal>
                      <Text fontWeight="medium">Endereço: </Text>
                      <Text>{data?.lastDelivery?.address}</Text>
                    </LineModal>
                  </>
                )}

                <LineModal>
                  <Text fontWeight="medium">Localidade: </Text>
                  <Text>
                    {data?.lastDelivery?.city} - {data?.lastDelivery?.uf}
                  </Text>
                </LineModal>

                {resultStatusFreightDriver === "hired" && (
                  <>
                    <Button
                      width="100%"
                      bg="rgba(4,52,203,.6)"
                      onPress={() => {
                        Linking.openURL(`https://maps.app.goo.gl/`);
                      }}
                    >
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <Text color="#fff" font-weight="bold" paddingRight="2%">
                          Ver destino no mapa
                        </Text>
                        <Entypo name="location" size={25} color="#fff" />
                      </View>
                    </Button>
                  </>
                )}
                {/* {data.destinationCompanyLogo ?
                  (<CompanyLogo
                    style={{}}
                    source={{
                      uri: data?.destinationCompanyLogo,
                    }}
                  />) : null} */}

                {/* <Line />
                <TitleDetails>DATAS E HORÁRIOS:</TitleDetails>
                <LineModal>
                  <Text fontWeight="medium">Data da coleta: </Text>
                  <Text>{dateCollectDay}/{dateCollectMonth}/{dateCollectYear}</Text>
                </LineModal> */}
                {/* <LineModal>
          <Text fontWeight="medium">Horário da coleta: </Text>
          <Text>12:00</Text>
        </LineModal> */}

                {/* <LineModal>
                  <Text fontWeight="medium">Data da entrega: </Text>
                  <Text>{dateDeliveryDay}/{dateDeliveryMonth}/{dateDeliveryYear}</Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Horário da entrega: </Text>
                  <Text>{hourStartDelivery} às {hourEndDelivery}</Text>
                </LineModal> */}

                <Line />
                <TitleDetails>VEÍCULO REQUERIDO:</TitleDetails>
                <LineModal>
                  <Text fontWeight="medium">Tipo(s):</Text>
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
                  {/* <Text>{data?.vehicle?.typeBodywork?.map((v, k) => <Text key={k}>{k > 0 ? '/' : ''} {v} </Text>)}</Text> */}
                  <Text>
                    {vehicle?.bodyworks?.map((v, k) => (
                      <Text key={k}>
                        {v}
                        {k == vehicle?.bodyworks?.length - 1 ? "." : ", "}
                      </Text>
                    ))}
                  </Text>
                </LineModal>

                <Line />

                <TitleDetails>DETALHES DA CARGA:</TitleDetails>
                {/* <LineModal>
                  <Text fontWeight="medium">Tipo: </Text>
                  <Text>{data?.freight?.productType}Não informado</Text>
                </LineModal> */}
                <LineModal>
                  <Text fontWeight="medium">Produto: </Text>
                  <Text>{data?.freight?.product}</Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Peso: </Text>
                  <Text>
                    {" "}
                    <Mask value={data?.freight?.weightCargo} type="kg" />
                  </Text>
                </LineModal>

                <LineModal>
                  <Text fontWeight="medium">Valor NF:</Text>
                  <Text>
                    {" "}
                    R$
                    <Mask value={data?.freight?.valueNF} type="reais" />{" "}
                  </Text>
                </LineModal>
                <Line />
                <TitleDetails>DETALHES DA VIAGEM:</TitleDetails>

                <LineModal>
                  <Text fontWeight="medium">Quilometragem: </Text>

                  <Text>
                    {" "}
                    <Mask
                      value={data?.freight?.totalAmountRoute}
                      type="km"
                    />{" "}
                  </Text>
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Valor: </Text>
                  <Text>
                    {" "}
                    R$
                    <Mask
                      value={data?.driver?.valueInitial}
                      type="reais"
                    />{" "}
                  </Text>
                </LineModal>

                <Line />
                <TitleDetails>Observação:</TitleDetails>
                <LineModal>
                  <Text>{data?.freight?.observation}</Text>
                </LineModal>

                {/* REMOVER */}
                {/* Atualiza o status em Meus Fretes, na Fila e no Frete. */}
                {/* <TouchableOpacity onPress={() => r_proximoStatus()} style={{ backgroundColor: '#888' }}>
                  <Text>Quando o backOffice vincular o motorista,
                    notifica o mesmo e muda o status na fila para APPROVED</Text>
                  <Text>Atualiza o status em Meus Fretes, na Fila e no Frete.</Text>
                  <Text>
                    let statusForFreight = 'approved'
                    let statusFreight = {'{ code: "03", describe: "Em análise pelo motorista" }'}
                  </Text>
                </TouchableOpacity> */}
              </ScrollView>
            </VStack>
          </Modal.Body>

          <Modal.Footer justifyContent="space-between">
            {resultStatusFreightDriver === "line" ? (
              <Button
                backgroundColor="rgba(255,0,0, .8)"
                width="100%"
                onPress={() => {
                  setShowModalOffLine(true);
                }}
              >
                Abandonar espera
              </Button>
            ) : resultStatusFreightDriver === "approved" ? (
              <>
                <Button
                  backgroundColor="rgba(255,0,0, .8)"
                  width="40%"
                  onPress={() => cancelInterest()}
                >
                  <TextButton>Desistir</TextButton>
                </Button>
                <Button
                  backgroundColor="rgba(0,180,55, 1)"
                  textAlign="center"
                  width="40%"
                  onPress={() => takeATrip()}
                >
                  <TextButton>Confirmar viagem</TextButton>
                </Button>
              </>
            ) : resultStatusFreightDriver === "hired" ? (
              <Button
                backgroundColor=" rgba(0,180,55, 1)"
                width="100%"
                onPress={() => {
                  setShowModalConfirmDelivery(true);
                }}
              >
                Confirmar entrega
              </Button>
            ) : resultStatusFreightDriver === "canceled" ? (
              <Button
                backgroundColor=" rgba(0,180,55, 1)"
                width="100%"
                onPress={() => {
                  {
                  }
                }}
              >
                Confirmar entrega
              </Button>
            ) : (
              <></>
            )}
          </Modal.Footer>
          <Modal.Footer justifyContent="space-between">
            <Button
              backgroundColor={config.cor_secundaria}
              width="20%"
              onPress={() => {
                setModalDetails(false);
              }}
            >
              Voltar
            </Button>
            <Button
              backgroundColor="transparent"
              width="20%"
              onPress={() => {
                setShowModalSupport(true);
              }}
            >
              <MaterialCommunityIcons
                // Ionicons
                // name="warning-outline"
                // size={30}
                // color="#f4bc0b"
                name="whatsapp"
                size={30}
                // color="#f4bc0b"
                color="rgba(37,211,102, 1)"
              />
            </Button>

            <StatusFreightDriver>
              <TextStatusFreightDriver>
                {" "}
                {resultStatusFreightDriver === "line" ? (
                  "Aguardando conferencia dos documentos..."
                ) : resultStatusFreightDriver === "hired" ? (
                  "Contratado! Verifique as localizações de carga e descarga nos detalhes do frete."
                ) : resultStatusFreightDriver === "approved" ? (
                  "Sua documentação foi aprovada, se realmente deseja realizar essa viagem confirme a escolha no botão acima."
                ) : resultStatusFreightDriver === "canceled" ? (
                  "Sua documentação foi aprovada, porém não confirmou intersse a tempo. Não se preocupe, você poderá realizar outras viagens, busque-as na tela inicial."
                ) : resultStatusFreightDriver === "delivered" ? (
                  "Analisando confirmação de entrega..."
                ) : (
                  <></>
                )}
              </TextStatusFreightDriver>
            </StatusFreightDriver>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={showModalConfirmDelivery}
        onClose={() => setShowModalConfirmDelivery(false)}
        size="lg"
      >
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
            <UploadImageFreight idFreight={data.id} />
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={showModalSupport}
        onClose={() => setShowModalSupport(false)}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Suporte</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Text>
                Dúvidas ou algum problema relacionado a esta carga? Fale com
                nossa equipe!
              </Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="center">
            <Button
              width="80%"
              bg="rgba(37,211,102, 1)"
              onPress={() => {
                Linking.openURL(
                  `https://api.whatsapp.com/send/?phone=55${data?.freight?.phoneRespContractFreigtage}&text=Olá! Meu nome é ${user?.name}, desejo ter mais informações referente ao frete id:${data?.numberSerial}&app_absent=0`
                );
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text color="#fff" fontWeight="bold" textAlign="center">
                  Sim, continuar para o WhatsApp!
                </Text>
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

      <Modal
        isOpen={showModalOffLine}
        onClose={() => setShowModalOffLine(false)}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>ATENÇÃO</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Text fontWeight="medium">
                Você realmente deseja abandonar esta fila?{" "}
              </Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            <Button
              width="45%"
              backgroundColor="rgb(4,52,203)"
              onPress={() => {
                setShowModalOffLine(false);
                //& openCamera();
              }}
            >
              Não
            </Button>
            <Button
              width="45%"
              backgroundColor="rgba(255,0,0, .8)"
              onPress={() => {
                setShowModalOffLine(false) &
                  //& setModalDetails(false)
                  getOffLine(data.id);
              }}
            >
              Sim
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={false}
        onClose={() => setShowModalOffLine(false)}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          {/* <Modal.Header>A qualidade da foto ficou boa?</Modal.Header> */}
          <Modal.Body>
            <VStack space={3}>
              <Text fontWeight="medium"></Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            <>
              <Button
                width="45%"
                onPress={() => {
                  setShowModalOffLine(false);
                }}
              >
                OK
              </Button>
            </>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Container>
  );
}
export default MyFreightHistoryList;
