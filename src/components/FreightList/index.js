import { useState, useContext, useEffect } from "react";

import {
  Container,
  Name,
  Header,
  Avatar,
  ContentView,
  Content,
  Actions,
  TimePost,
  ButtonMore,
  TextMore,
  LineModal,
  TitleDetails,
  Line,
  AvatarImg,
} from "./styles";
import {
  View,
  Linking,
  ActivityIndicator
} from "react-native";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  Button,
  Modal,
  VStack,
  Text,
  ScrollView,
} from "native-base";

import { AuthContext } from "../../contexts/auth";
import { FilterContext } from "../../contexts/filter";
import { VerificationContext } from "../../contexts/registrationVerification";
import config from "../../config/variables.json";
import { Mask } from "./formater";
import { PermissionHandler, PLATAFORM_IS_IOS } from "../../handler/permissions";

function FreightList({ data, userId, userAuthorizedFreights }) {
  const { user } = useContext(AuthContext);
  const { loadDataProfile, setPermissionToEdit } = useContext(
    VerificationContext
  );

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [modalDetails, setModalDetails] = useState(false);
  const [showModalSupport, setShowModalSupport] = useState(false);
  const [showModalGetFreight, setShowModalGetFreight] = useState(false);
  const [showModalMessage, setShowModalMessage] = useState(false);
  const [showModalInLine, setShowModalInLine] = useState(false);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [showModalUserAuthorized, setShowModalUserAuthorized] = useState(false);
  const [rowDrivers, setRowDrivers] = useState(0);
  const [imLine, setImLine] = useState(false);
  const [cancelInterest, setCancelInterest] = useState(false);

  const dateCollect = new Date(data?.clientOrigin?.dateCollect);
  const dateCollectDay = dateCollect.getDate();
  const dateCollectMonth = dateCollect.getMonth() + 1;
  const dateCollectYear = dateCollect.getFullYear();

  const dateDelivery = new Date(
    data?.clientDelivery?.timeDelivery?.dateDelivery
  );

  const [showPermissionHandler, setShowPermissionHandler] = useState(false);
  const [permissionType, setPermissionType] = useState("");

  const { freightsInLine, setFreightsInLine } = useContext(FilterContext);

  function formatTimeRegistration() {
    // console.log(new Date(data.created.seconds * 1000));
    const dateRegistration = new Date(data?.createData?.seconds * 1000);

    return formatDistance(new Date(), dateRegistration, {
      locale: ptBR,
    });
  }

  function getInLine(id) {
    if (userAuthorizedFreights !== false) {
      if (freightsInLine < 2) {
        firestore()
          .collection(`freight/${id}/queue`)
          // firestore().collection(`freight_teste/${id}/queue`) __temp_

          .doc(user.uid)
          .set({
            driver_user: user.uid,
            driver_name: user.name,
            registrationInLineTime: new Date(),
            status: "line",
          })
          .then(() => {
            firestore()
              .collection(`drivers_users/${user.uid}/myFreightsList`)
              .doc(id)
              .set({
                driver_user: user.uid,
                driver_name: user.name,
                registrationInLineTime: new Date(),
                status: "line",
              })
              .then(() => {
                setFreightsInLine(freightsInLine + 1);
                setShowModalAlert(true);
                setShowModalMessage(true);
              });
          })
          .catch((error) => console.log(error));
      } else {
        alert("Só é possivel estar na fila de duas cargas por vez.");
      }
    } else {
      console.log("oi");
      setShowModalUserAuthorized(true);
    }
  }

  function viewLine(id) {
    const subscriber = firestore()
      .collection(`freight/${id}/queue`)
      // .collection(`freight_teste/${id}/queue`) __temp_

      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        console.log(users);
        let verify = [users.find((item) => item.key == user.uid)];
        if (verify[0]?.key === user.uid) {
          setImLine(true);
          if (verify[0]?.status === "cancelInterest") setCancelInterest(true);
        } else setImLine(false);
        setRowDrivers(users.length);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }

  async function navigationProfile() {
    setLoading(true);
    await loadDataProfile();
    setLoading(false);
    navigation.navigate("DataProfile");
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


  async function handleGetFreight() {
    const isAllowedLocation = PermissionHandler.requestLocationPermissions();
    if (isAllowedLocation) {
      setShowModalGetFreight(true);
    }
  }

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
        <Name numberOfLines={3}>{data?.shipper?.name}</Name>
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
        <ButtonMore
          onPress={() => setModalDetails(!modalDetails) & viewLine(data.id)}
        >
          <TextMore style={{}}>Ver mais</TextMore>
        </ButtonMore>
        <TimePost>
          há {formatTimeRegistration()}
          {/* {formatTimePost()} */}
        </TimePost>
      </Actions>

      {/* Sessão do modal de detalhamento do frete */}

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

                <TitleDetails>ORIGEM:</TitleDetails>

                <LineModal>
                  <Text fontWeight="medium">Localidade: </Text>
                  <Text>
                    {data?.firstDelivery?.city} - {data?.firstDelivery?.uf}
                  </Text>
                </LineModal>

                <Line />
                <TitleDetails>DESTINO:</TitleDetails>
                <LineModal>
                  <Text fontWeight="medium">Localidade: </Text>
                  <Text>
                    {data?.lastDelivery?.city} - {data?.lastDelivery?.uf}
                  </Text>
                </LineModal>

                <Line />

                {/* <Line /> */}
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
                  <Text fontWeight="medium">Valor NF: </Text>
                  <Text>
                    {" "}
                    R$ {" "}
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
                    {" "}
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
            <Button
              backgroundColor="rgba(255,0,0, .7)"
              width="20%"
              onPress={() => {
                setModalDetails(false);
              }}
            >
              Voltar
            </Button>

            <Button
              backgroundColor="rgba(37,211,102, 1)"
              width="15%"
              onPress={() => {
                setShowModalSupport(true);
              }}
            >
              <MaterialCommunityIcons name="whatsapp" size={25} color="#fff" />
            </Button>

            {imLine ? (
              <>
                <Button
                  backgroundColor={config?.cor_primaria}
                  width="50%"
                  onPress={() => {
                    // getFreight();
                    setShowModalInLine(true);
                  }}
                >
                  Pegar frete
                </Button>
              </>
            ) : (
              <>
                <Button
                  backgroundColor={config?.cor_primaria}
                  width="50%"
                  // onPress={() => {
                  //   // getFreight();
                  //   setShowModalGetFreight(true);

                  // }}

                  onPress={handleGetFreight}
                >
                  Pegar frete
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal>


      <Modal
        isOpen={showModalGetFreight}
        onClose={() => setShowModalGetFreight(false)}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>
            <Text fontWeight="medium">Atenção</Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              {imLine === false && rowDrivers > 0 && (
                <>
                  <Text fontWeight="medium">
                    (1 ou 2) motoristas já enviaram documentação para essa!
                  </Text>
                  <Text fontWeight="medium">
                    Gostaria de aguardar para carregá-la?
                  </Text>
                </>
              )}
              {imLine === false && rowDrivers === 0 && (
                <Text fontWeight="medium">
                  Gostaria de enviar a documentação para realizar essa viagem?
                </Text>
              )}
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            {imLine === true ? (
              <>
                <Button
                  width="45%"
                  bg={config?.cor_primaria}
                  onPress={() => {
                    setShowModalGetFreight(false);
                  }}
                >
                  OK
                </Button>
              </>
            ) : (
              <>
                <Button
                  width="45%"
                  bg={config?.cor_primaria}
                  onPress={() => {
                    setShowModalGetFreight(false);
                    //& openCamera();
                  }}
                >
                  Não
                </Button>
                <Button
                  width="45%"
                  bg={config?.cor_primaria}
                  onPress={() => {
                    setShowModalGetFreight(false) &
                      //& setModalDetails(false)
                      getInLine(data.id);

                    // setShowModalMessage(true)
                  }}
                >
                  Sim
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={showModalMessage}
        onClose={() => setShowModalMessage(false)}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>
            <Text fontWeight="medium">Documentação Enviada</Text>
          </Modal.Header>

          <Modal.Body>
            <VStack space={3}>
              <Text>
                Fique tranquilo, em breve lhe daremos um retorno sobre esse
                frete!
              </Text>
            </VStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={showModalInLine}
        onClose={() => setShowModalInLine(false)}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Atenção</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              {imLine === true && cancelInterest === false && (
                <>
                  <Text fontWeight="medium">
                    Você já enviou a documentação, agora é só aguardar!{" "}
                  </Text>
                  <Text fontWeight="medium">
                    Documentação enviada:{" "}
                    <Text fontWeight="bold">
                      {rowDrivers} motorista{rowDrivers === 1 ? "" : "s"}{" "}
                    </Text>
                  </Text>
                </>
              )}
              {imLine === true && cancelInterest === true && (
                <>
                  <Text fontWeight="medium">
                    Você já enviou a documentação anteriormente, portanto quando
                    foi aprovado, desistiu de realiza-lo...
                  </Text>
                  <Text fontWeight="medium">
                    Deseja encaminhar a documentação novamente?{" "}
                  </Text>
                </>
              )}
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            {imLine === true && cancelInterest === false && (
              <>
                <Button
                  width="45%"
                  bg="rgb(4,52,203)"
                  onPress={() => {
                    setShowModalInLine(false);
                  }}
                >
                  OK
                </Button>
              </>
            )}

            {imLine === true && cancelInterest === true && (
              <>
                <Button
                  width="45%"
                  bg="rgb(4,52,203)"
                  onPress={() => {
                    setShowModalGetFreight(false);
                    //& openCamera();
                  }}
                >
                  Não
                </Button>
                <Button
                  width="45%"
                  bg="rgb(4,52,203)"
                  onPress={() => {
                    setShowModalGetFreight(false) &
                      //& setModalDetails(false)
                      getInLine(data.id);
                    // setShowModalMessage(true)
                  }}
                >
                  Sim
                </Button>
              </>
            )}
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
                Dúvidas sobre esse frete? Fale com um de nossos consultores?
              </Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="center">
            <Button
              width="80%"
              bg="rgba(37,211,102, 1)"
              onPress={() => {
                Linking.openURL(
                  `https://api.whatsapp.com/send/?phone=55${data?.freight?.phoneRespContractFreigtage}&text=Olá! Meu nome é ${user.name}, desejo ter mais informações referente ao frete id:${data.numberSerial}&app_absent=0`
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
        isOpen={showModalAlert}
        onClose={() => setShowModalAlert(false)}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />

          <Modal.Body>
            <VStack space={3}>
              <Text fontWeight="bold">Documentação enviada!</Text>
              <Text fontWeight="bold">
                Por gentileza, aguarde nosso retorno!
              </Text>
              <Line />
              <Text fontWeight="bold">Enquanto isso você pode:</Text>
              <Text>
                - consultar aos fretes em que já faz parte da fila clicando no
                botão <Text fontWeight="bold">"Meus fretes" </Text>.
              </Text>
              <Text>ou</Text>
              <Text>
                - continuar visualizando outros fretes clicando no botão{" "}
                <Text fontWeight="bold">"Mais"</Text>.
              </Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            <Button
              width="45%"
              bg="rgb(4,52,203)"
              onPress={() => {
                setShowModalAlert(false);
              }}
            >
              Mais
            </Button>
            <Button
              width="45%"
              bg="rgb(4,52,203)"
              onPress={() => {
                navigation.navigate("MeusFretes");
                setShowModalAlert(false);
                setShowModalGetFreight(false);
                setShowModalInLine(false);
              }}
            >
              Meus fretes
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={showModalUserAuthorized}
        onClose={() => setShowModalUserAuthorized(false)}
        size="lg"
      >
        <Modal.Content maxWidth="350">
          <Modal.Header>Atenção</Modal.Header>
          <Modal.CloseButton />
          <Modal.Body>
            <VStack space={3}>
              <Text>
                É novo por aqui? Termine seu cadastro para poder fechar fretes
                conosco.
              </Text>
              <Text fontWeight="bold"></Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer justifyContent="space-between">
            <Button
              backgroundColor="rgb(4,52,203)"
              width="50%"
              onPress={() => {
                // getFreight();
                //setShowModalInLine(true)
                navigationProfile() & setModalDetails(false);
              }}
            >
              Concluir cadastro{" "}
              {loading && (
                <ActivityIndicator size={15} color="rgb(255,255,255)" />
              )}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {showPermissionHandler && (
        <PermissionHandler
          isVisible={showPermissionHandler}
          onClose={() => setShowPermissionHandler(false)}
          onAccept={() => {
            setShowPermissionHandler(false);
            Linking.openSettings();
          }}
          permissions={[permissionType === "location" ? "Permissão de Localização Necessária" : "GPS Desativado"]}
        />
      )}
    </Container>
  );
}
export default FreightList;
