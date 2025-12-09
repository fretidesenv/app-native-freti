import React, { useState, useEffect, useContext, } from "react";

import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import {
  Container,
  List,
  ViewMessage,
  TextMessage,
} from "./styles";

import MyFreightList from "../../components/MyFreightList";

import { AuthContext } from "../../contexts/auth";

import { View, StyleSheet } from "react-native";
import { Text, Card, Icon } from "react-native-paper";

function Progress() {
  const [userAuthorizedFreights, setUserAuthorizedFreights] = useState(false);
  const { user } = useContext(AuthContext);
  const [myFreights, setMyfreights] = useState([]);
  const [freights, setFreights] = useState([]);
  const [currentFreight, setCurrentFreight] = useState("asd");

  const navigation = useNavigation();

  useEffect(() => {
    // Listeners para os fretes individuais
    const freightListeners = {};
    const statusListeners = {};
    
    // Listener para a lista de fretes do usuário
    const subscriberList = firestore()
      .collection(`drivers_users/${user.uid}/myFreightsList`)
      .onSnapshot((snapshot) => {
        const listFreights = [];
        snapshot.forEach((doc) => {
          listFreights.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        setFreights(listFreights);

        // Remove listeners de fretes que não estão mais na lista
        const currentIds = listFreights.map(f => f.id);
        Object.keys(freightListeners).forEach(freightId => {
          if (!currentIds.includes(freightId)) {
            freightListeners[freightId]();
            delete freightListeners[freightId];
          }
        });
        
        // Remove listeners de status que não estão mais na lista
        Object.keys(statusListeners).forEach(freightId => {
          if (!currentIds.includes(freightId)) {
            statusListeners[freightId]();
            delete statusListeners[freightId];
          }
        });

        // Cria/atualiza listeners para cada frete em tempo real
        listFreights.forEach((listFreight) => {
          const freightId = listFreight.id;
          const registrationInLineTime = listFreight.registrationInLineTime;
          
          // Verifica se já está finalizado na lista do motorista
          if (listFreight?.status === "finished") {
            // Remove da lista se já estiver finalizado
            setMyfreights((prevMyFreights) => 
              prevMyFreights.filter((f) => f.id !== freightId)
            );
            return;
          }

          // Se já existe listener para este frete, não cria outro
          if (freightListeners[freightId]) {
            return;
          }

          // Listener para monitorar mudanças de status na lista do motorista
          if (!statusListeners[freightId]) {
            const statusUnsubscribe = firestore()
              .collection(`drivers_users`)
              .doc(user.uid)
              .collection("myFreightsList")
              .doc(freightId)
              .onSnapshot((doc) => {
                if (doc.exists) {
                  const freightStatus = doc.data()?.status;
                  // Se o status mudou para "finished", remove da lista
                  if (freightStatus === "finished") {
                    setMyfreights((prevMyFreights) => 
                      prevMyFreights.filter((f) => f.id !== freightId)
                    );
                  }
                }
              });
            statusListeners[freightId] = statusUnsubscribe;
          }

          // Cria listener para este frete específico
          const unsubscribe = firestore()
            .collection("freight")
            .doc(freightId)
            .onSnapshot((freightSnapshot) => {
              if (freightSnapshot.exists) {
                const freightData = freightSnapshot.data();
                const isFinished = freightData?.status?.code === "07";
                
                setMyfreights((prevMyFreights) => {
                  // Remove o frete antigo se existir
                  const filtered = prevMyFreights.filter(
                    (f) => f.id !== freightId
                  );
                  
                  // Só adiciona se NÃO estiver finalizado (aba "Agora" não mostra finalizados)
                  if (!isFinished) {
                    return [
                      ...filtered,
                      {
                        ...freightData,
                        registrationInLineTime,
                        id: freightId,
                      },
                    ];
                  }
                  
                  // Se estiver finalizado, remove da lista (apenas retorna o filtrado)
                  return filtered;
                });
              }
            });

          freightListeners[freightId] = unsubscribe;
        });
      });

    // Listener para o frete atual
    const subscriberCurrent = firestore()
      .collection(`drivers_users`)
      .doc(user.uid)
      .collection("freights")
      .doc("current")
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.data()?.id) {
          setCurrentFreight(documentSnapshot.data()?.id);
        }
      });

    // Cleanup: remove todos os listeners quando o componente é desmontado
    return () => {
      subscriberList();
      subscriberCurrent();
      // Remove todos os listeners de fretes individuais
      Object.values(freightListeners).forEach((unsubscribe) => {
        unsubscribe();
      });
      // Remove todos os listeners de status
      Object.values(statusListeners).forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, []);
  

  async function navigationDatails(idFreight) { 

    navigation.navigate("Main", {
      screen: "DetailsFreight",
      params: { idFreight: idFreight },
    });

    // navigation.navigate("Main", {
    //   screen: "DetailsFreight",
    //   params: { idFreight },
    // });
  }

  // erro inicial de navegação
  // async function navigationDatails(idFreight) {
  //   navigation.navigate("Main", { screen: "DetailsFreight", params: { idFreight } });
  // }
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: "#f4f4f4",
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
    <Container style={{ paddingBottom: 80 }}>

      {myFreights.length === 0 ? (
        <>
          <View style={styles.container}>
            <Card style={styles.card}>
              <Card.Content style={styles.content}>
                <Icon source="truck-outline" size={50} color="rgb(1,36,67)" />
                <Text style={styles.title}>Acompanhe seus fretes</Text>
                <Text style={styles.message}>
                  Aqui você pode visualizar todos os seus fretes em tempo real, 
                  incluindo os que estão na fila e em andamento.
                </Text>
              </Card.Content>
            </Card>
          </View>

        </>
      ) : (
        <List
          data={myFreights}
          renderItem={({ item, index }) => (
            <>
              <MyFreightList
                userAuthorizedFreights={userAuthorizedFreights}
                data={item}
                currentFreight={index}
                freights={freights}
                userId={user?.uid}
                navigationDatails={navigationDatails}
              />
            </>
          )}
        />
      )}

    </Container>
  );
}

export default Progress;
