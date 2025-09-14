import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet  } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation} from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Container, List} from './styles';
import MyFreightHistoryList from '../../components/MyFreightHistoryList';
import { AuthContext } from '../../contexts/auth'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Card, Icon } from "react-native-paper";

function Finished() {
  const [userAuthorizedFreights, setUserAuthorizedFreights] = useState(false);
  const { user } = useContext(AuthContext);
  const [myFreights, setMyfreights] = useState([]);

  const navigation = useNavigation();


  // useEffect(() => {
  //   const subscriber = firestore().collection(`drivers_users/${user.uid}/myFreightsList`)
  //     .onSnapshot(snapshot => {
  //       const listFreights = [];
  //       snapshot.forEach(doc => {
  //         listFreights.push({
  //           ...doc.data(),
  //           id: doc.id,
  //         })
  //       })
  //       async function buscaFretes() {
  //         let myFreights = []
  //         for (let i = 0; i < listFreights.length; i++) {
  //           let registrationInLineTime = listFreights[i].registrationInLineTime
  //           let frete = await firestore()
  //             .collection('freight')
  //             .doc(listFreights[i].id)
  //             .get()
  //           let id = listFreights[i].id
  //           myFreights = [...myFreights, { ...frete.data(), registrationInLineTime, id }]
  //         }
  //         setMyfreights(myFreights)
  //       }
  //       buscaFretes()

  //     })


  //   return () => subscriber();

  // }, [])

  //.where('age', '>=', 18)

  useEffect(() => {
    firestore()
      .collection('freight')
      .where('freight.getDriverFreight.uidDriver', '==', user?.uid)
      .where('status.code', '==', "07")
      .get().then(async (snapshot) => {
        const myFreights = [];
        snapshot.forEach(doc => {
          myFreights.push({
            ...doc.data(),
            id: doc.id,
          })
        })
        setMyfreights(myFreights)
        console.log(myFreights)
      })



  }, [])


  const insets = useSafeAreaInsets();

  async function navigationDatails(idFreight) {
    navigation.navigate("DetailsFreight", { idFreight: idFreight });
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
      <Container style={{ paddingBottom: 80 }}>

          {myFreights.length === 0 ?
            (
              <>
                <View style={styles.container}>
                  <Card style={styles.card}>
                    <Card.Content style={styles.content}> 
                      <Icon source="truck-check-outline" size={50} color="rgb(1,36,67)" />
                      <Text style={styles.title}>Fretes finalizados</Text>
                      <Text style={styles.message}>
                        Acompanhe aqui o seu histórico de fretes
                        
                      </Text>
                    </Card.Content>
                  </Card>
                </View>
                {/* <ViewMessage>
                  <TextMessage>Aqui serão listados todos os seus fretes, em todos os status: Na fila, Em andamento, Finalizado...</TextMessage>
                </ViewMessage> */}
              </>
            ) :
            <List
              data={myFreights}
              renderItem={({ item }) =>

                <MyFreightHistoryList
                  userAuthorizedFreights={userAuthorizedFreights}
                  data={item}
                  userId={user?.uid}
                  navigationDatails={navigationDatails}

                />

              }
            />
          }
      </Container>
  )
}

export default Finished;