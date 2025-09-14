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
    const subscriber = firestore()
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
        async function buscaFretes() {
          let myFreights = [];
          for (let i = 0; i < listFreights.length; i++) {
            let registrationInLineTime = listFreights[i].registrationInLineTime;
            let frete = await firestore()
              .collection("freight")
              .doc(listFreights[i].id)
              .get();
            let id = listFreights[i].id;
            myFreights = [
              ...myFreights,
              { ...frete.data(), registrationInLineTime, id },
            ];
          }
          setMyfreights(myFreights);
        }

        async function current() {
          firestore()
            .collection(`drivers_users`)
            .doc(user.uid)
            .collection("freights")
            .doc("current")
            .onSnapshot((documentSnapshot) => {
              if (documentSnapshot.data()?.id) {
                setCurrentFreight(documentSnapshot.data()?.id);
              }
            });
        }

        buscaFretes();
        current();
      });

    return () => subscriber();
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
                  incluindo os que estão na fila, em andamento e finalizados.
                </Text>
              </Card.Content>
            </Card>
          </View>
          {/* <ViewMessage>
            <TextMessage>
              Aqui serão listados todos os seus fretes, em todos os status: Na
              fila, Em andamento, Finalizado...
            </TextMessage>
          </ViewMessage> */}
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
