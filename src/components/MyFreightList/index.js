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
  ModalPermissions,
} from "./styles";
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Linking,
  PermissionsAndroid,
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

import config from '../../config/variables.json'
import { UploadImageFreight } from "../UploadImageFreight";

import { AuthContext } from "../../contexts/auth";

import { Mask } from "./formater";
import BgLocation from "../BgLocation";

function MyFreightList({
  data,
  userId,
  userAuthorizedFreights,
  freights,
  navigationDatails,
  currentFreight,
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
  const [modalPermissionsVisible, setModalPermissionsVisible] = useState(false);

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
  console.log(data)

  function formatTimeRegistration() {
    // console.log(new Date(data.created.seconds * 1000));
    // const dateRegistration = new Date(data?.createData?.seconds * 1000); __temp
    const dateRegistration = new Date(
      data?.registrationInLineTime?.seconds * 1000
    );

    return formatDistance(new Date(), dateRegistration, {
      locale: ptBR,
    });
  }

  function getOffLine() {
    let id = data.id;
    console.log(data);
    firestore()
      .collection(`freight/${id}/queue`)
      // firestore().collection(`freight_teste/${id}/queue`) __temp_
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

  useEffect(() => {
    if (!data?.id) return;

    let id = data.id;
    
    // Listener para a fila do frete
    const subscriberQueue = firestore()
      .collection(`freight/${id}/queue`)
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        let verify = [users.find((item) => item.key == user.uid)];
        if (verify[0]?.key === user.uid) {
          setImLine(true);
          setResultStatusFreightDriver(verify[0]?.status);
        } else {
          setImLine(false);
        }
        setRowDrivers(users.length);
      });

    // Listener para o status do frete na lista do usuário (em tempo real)
    const subscriberStatus = firestore()
      .collection(`drivers_users`)
      .doc(user.uid)
      .collection("myFreightsList")
      .doc(id)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          const freightData = documentSnapshot.data();
          setStatusFreight(freightData?.status || "");
          
          // Atualiza o status também quando houver mudanças
          if (freightData?.status) {
            // Se o status mudar para "approved" e ainda não tiver sido contratado, pode permitir ação
            // O listener já atualiza automaticamente, então não precisa chamar takeATrip aqui
          }
        }
      }, (error) => {
        console.log("Erro ao escutar status do frete:", error);
      });

    // Cleanup: remove os listeners quando o componente é desmontado ou data.id muda
    return () => {
      subscriberQueue();
      subscriberStatus();
    };
  }, [data?.id, user?.uid]);

  const takeATrip = async (status) => {
    if (status === "approved") {
      await firestore()
        .collection(`freight/${data.id}/queue`)
        // await firestore().collection(`freight_teste/${data.id}/queue`) __temp_

        .doc(user.uid)
        .update({ status: "hired", hired: new Date() });
      console.log("139 foi");
      await firestore()
        .collection(`drivers_users/${user.uid}/myFreightsList`)
        .doc(data.id)
        .update({ status: "hired", hired: new Date() });

      let dataHistory = {
        dateNotHire:
          data?.history?.dateNotHire != undefined
            ? data.history.dateNotHire
            : "",
        dateOfHire: new Date(),
        partiallyDate:
          data?.history?.partiallyDate != undefined
            ? data.history.partiallyDate
            : "",
        atAnaliseDate:
          data?.history?.atAnaliseDate != undefined
            ? data.history.atAnaliseDate
            : "",
        atAnaliseDateDriver:
          data?.history?.atAnaliseDateDriver != undefined
            ? data.history.atAnaliseDateDriver
            : "",
        dateDelivered:
          data?.history?.dateDelivered != undefined
            ? data.history.dateDelivered
            : "",
        dateFinished:
          data?.history?.dateFinished != undefined
            ? data.history.dateFinished
            : "",
        dateUpdate:
          data?.history?.dateUpdate != undefined ? data.history.dateUpdate : "",
      };

      await firestore()
        .collection(`freight`)
        // await firestore().collection(`freight_test`) __temp_
        .doc(data.id)
        .update({ history: dataHistory })
        .catch((error) => console.log(error));

      await firestore()
        .collection(`freight`)
        // await firestore().collection(`freight_teste`) __temp_

        .doc(data.id)
        .update({ status: { code: "04", describe: "Contratado" } });
    } else {
      alert('Aconteceu algum erro, verifique sua conexão com a internet ou entre em contato com o suporte.')
    }
  };

  async function cancelInterest() {
    let id = data.id;
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
    firestore()
      .collection(`freight`)
      .doc(id)
      .update({ status: { code: "01", describe: "Pendente de contratação" } });
  }

  const handleViewMore = () => {
    {
      try {
        freights[currentFreight]?.status === "hired" ||
          freights[currentFreight]?.status === "waitingCollection" ||
          freights[currentFreight]?.status === "inTransit" ||
          freights[currentFreight]?.status === "delivered" ||
          freights[currentFreight]?.status === "finished"
          ? navigationDatails(data.id)
          : setModalDetails(true);
      } catch (error) {
        alert(error);
      }
    }
  };


  async function verifyPermission() {
    const granted = PermissionsAndroid.check(
      PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );
  
  }

  const handleCloseModalPermission = () => {
    setModalPermissionsVisible(false);
  };

  const [statusFreight, setStatusFreight] = useState("");

  const handleTakeFreight = async () => {
    const fineLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );
    const bgLocation = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    );

    if (!fineLocation || !bgLocation) {
      setModalPermissionsVisible(true);
      setModalDetails(false);
    } else {
      // Usa o status atual que já está sendo atualizado em tempo real pelo listener
      // Se o status for "approved", permite contratar
      if (statusFreight === "approved") {
        takeATrip(statusFreight);
      } else {
        // Se não tiver status ainda, busca uma vez para verificar
        firestore()
          .collection(`drivers_users`)
          .doc(user.uid)
          .collection("myFreightsList")
          .doc(data.id)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const currentStatus = doc.data().status;
              setStatusFreight(currentStatus);
              takeATrip(currentStatus);
            } else {
              alert('Frete não encontrado na sua lista.');
            }
          })
          .catch((error) => {
            console.log("Erro ao verificar status:", error);
            alert('Erro ao verificar status do frete. Tente novamente.');
          });
      }
    }
  };

  if (!data) {
    return null;
  }
  useEffect(() => {
    verificarListaDeVeiculos()
  }, [])

  const [vehicle, setVehicle] = useState({})

  const verificarListaDeVeiculos = () => {
    let vehicles = []
    let bodyworks = []
    for (let i = 0; i < data?.vehicle?.typeVehicle?.dados.length; i++) {
      let item = data?.vehicle?.typeVehicle?.dados[i];

      if (item.selected) {
        vehicles.push(item?.name)
      }

    }

    for (let i = 0; i < data?.vehicle?.typeBodywork?.dados.length; i++) {
      let item = data?.vehicle?.typeBodywork?.dados[i];

      if (item.selected) {
        bodyworks.push(item?.name)
      }
    }

    setVehicle({ vehicles, bodyworks })

  }

  return (
    <Container>
      <Header>
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
        <ButtonMore onPress={() => handleViewMore()}>
          <TextMore style={{}}>Ver mais</TextMore>
        </ButtonMore>
        <View>
          <Text
            style={{
              backgroundColor: config,
              color: "#000",
              borderRadius: 3,
              padding: 3,
              textAlign: "center",
            }}
          >
            {freights[currentFreight]?.status === "line" ? (
              "Aguardando"
            ) : freights[currentFreight]?.status === "approved" ? (
              "Documentação aprovada"
            ) : freights[currentFreight]?.status === "hired" ? (
              "Contratado"
            ) : freights[currentFreight]?.status === "waitingCollection" ? (
              "Aguardando coleta"
            ) : freights[currentFreight]?.status === "inTransit" ? (
              "Em rota de entrega"
            ) : freights[currentFreight]?.status === "finished" ? (
              "Finalizado"
            ) : freights[currentFreight]?.status === "delivered" ? (
              "Analisando"
            ) : (
              <></>
            )}
          </Text>
          <TimePost>
            na fila há {formatTimeRegistration()}
          </TimePost>
        </View>
      </Actions>
     
      <Modal isOpen={modalDetails} onClose={() => setModalDetails(false)}>
        <Modal.Content width="95%" height="95%" style={{ alignSelf: "center", position: "absolute", top: 50 }}>
          <Modal.CloseButton />
          <Modal.Header>Detalhes deste frete</Modal.Header>

          <Modal.Body>
            <VStack space={0}>
              <ScrollView>
                <View
                  style={{ justifyContent: "space-between", marginBottom: 3 }}
                >
                  
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

                <Line />
                <TitleDetails>VEÍCULO REQUERIDOA:</TitleDetails>
                <LineModal>
                  <Text fontWeight="medium">Tipo(s):</Text>

                  <Text>
                    {vehicle?.vehicles?.map((v, k) => (
                      <Text key={k}>
                        {v} --

                      </Text>
                    ))}
                  </Text>
                  
                </LineModal>
                <LineModal>
                  <Text fontWeight="medium">Carroceria(s): </Text>
                  <Text>
                    {data?.vehicle?.typeBodywork?.dados?.map((v, k) => (
                      <Text key={k}>
                        {" "}
                        {v.selected == true ? v.name : ""}
                        {/* {k > 0 && v.selected === true ? "/" : ""} */}
                        {k > 0 && k < data?.vehicle?.typeBodywork?.dados.length && v.selected === true ? '/' : ''}
                      </Text>
                    ))}
                  </Text>
                </LineModal>

                <LineModal>
                  <Text fontWeight="medium">Ocupação do veiculo: </Text>

                  <Text>{data?.vehicle?.occupation}</Text>
                </LineModal>

                <Line />

                <TitleDetails>DETALHES DA CARGA:</TitleDetails>
             
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
                  onPress={() =>
                    // takeATrip()
                    handleTakeFreight()
                  }
                >
                  <TextButton>Confirmar viagem</TextButton>
                </Button>
              </>
            ) : resultStatusFreightDriver === "hired" ? (
              <Button
                backgroundColor=" rgba(0,180,55, 1)"
                width="100%"
                onPress={() => {
                  navigationDatails(data.id);
                }}
              >
                Ver todos os detalhes
              </Button>
            ) : resultStatusFreightDriver === "inTransit" ? (
              <>
                <Button
                  backgroundColor=" rgba(0,180,55, 1)"
                  width="100%"
                  onPress={() => {
                    navigationDatails(data.id);
                  }}
                >
                  Ver todos os detalhes
                </Button>
                <Button
                  marginTop={2}
                  backgroundColor=" rgba(0,180,55, 1)"
                  width="100%"
                  onPress={() => {
                    setShowModalConfirmDelivery(true);
                  }}
                >
                  Confirmar entrega
                </Button>
              </>
            ) : resultStatusFreightDriver === "canceled" ? (
              <Button
                backgroundColor=" rgba(0,180,55, 1)"
                width="100%"
                onPress={() => {
                  {
                  }
                }}
              >
                canceled
              </Button>
            ) : (
              <></>
            )}
          </Modal.Footer>
          <Modal.Footer justifyContent="space-between">
            <Button
              backgroundColor="rgb(4,52,203)"
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
                //Ionicons
                // name="warning-outline"
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
                ) : resultStatusFreightDriver === "approved" ? (
                  "Sua documentação foi aprovada, se realmente deseja realizar essa viagem confirme a escolha no botão acima."
                ) : resultStatusFreightDriver === "hired" ? (
                  "Contratado! Verifique as localizações de carga e descarga nos detalhes do frete."
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

      <ModalPermissions
        animationType="slide"
        visible={modalPermissionsVisible}
        onRequestClose={() => {
          setModalPermissionsVisible(!modalPermissionsVisible);
        }}
      >
        <BgLocation
          closeModal={handleCloseModalPermission}
          numberSupport={data?.freight?.phoneRespContractFreigtage}
          freightId={data?.id}
          takeATrip={takeATrip}
          page={"MyFreightList"}
        />
      </ModalPermissions>
    </Container>
  );
}
export default MyFreightList;
