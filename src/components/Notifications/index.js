import React, { useState, useContext, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../contexts/auth';
import Header from '../Header';
import { Container, List, CardNotification, Title, Message, ViewNull, MessageListNull, DateTimeNotification } from './styles';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import { Text, IconButton, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";

export default function Notifications() {
  const [notifications, setNotifications] = useState([])

  const { user } = useContext(AuthContext)

  useEffect(() => {
    const subscriber = firestore()
      .collection('drivers_users')
      .doc(user.uid)
      .collection('notifications')
      .onSnapshot((snapshot) => {

        const listNotifications = [];
        snapshot.forEach(doc => {
          listNotifications.push({
            ...doc.data(),
            key: doc.id,
          })
        })

        if(listNotifications.length > 0) setNotifications(listNotifications)
        
      }

      )



    return () => subscriber();
  }, [])

  function formatTimeNotification() {
    // console.log(new Date(data.created.seconds * 1000));
    const dateRegistration = new Date(1658532666 * 1000);

    return formatDistance(
      new Date(),
      dateRegistration,
      {
        locale: ptBR
      }
    )
  }

  const Item = ({ title, message }) => (
    <CardNotification >
      <Title>{title}</Title>
      <Message>{message}</Message>
      <DateTimeNotification>Notificado há {formatTimeNotification()}</DateTimeNotification>
    </CardNotification>
  );

  const duplicarFrete = async () =>{ // __temp
    // let frete = {}
    const freightList = [];
    await  firestore()
        .collection('freight')
        // .where('userId', '==', route.params?.userId)
        // .orderBy('created', 'desc')
        .get()
        .then((snapshot) => {
   

          snapshot.docs.map(u => {
            freightList.push({
              ...u.data(),
              id: u.id
            })
          })
          console.log(freightList[2]);
    

        }).then(async() => {
          await firestore().collection(`freight_teste`)
       
          .add(freightList[0]);
  
        })


    // await firestore()
    // .collection('freights')
    // .doc("mOi7cMhDua4gQd48UfAr")
    // .onSnapshot(documentSnapshot => {
    //   frete = (documentSnapshot.data());

    // }).then(async()=>{

    //   console.log(frete);
    //   // await firestore().collection(`freight_history`)
    //   // .doc(1)
    //   // .set(frete);
    // })


    return () => subscriber();
  }

  const theme = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    text: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: "500",
      color: "#666",
    },
  });

  return ( 
    <Container> 
      <Header namePage="Minhas notificações" />
      {/* <VirtualizedList
        data={notifications}
        initialNumToRender={10}
        renderItem={({ item }) => <Item title={'o titulo'} />}
      /> */}


      {notifications.length > 0 ?
        <List
          data={notifications}
          renderItem={({ item }) =>
            <Item title={item?.title} message={item?.message} />
          }
        />
        :

        <View style={styles.container}>
          <IconButton 
            icon="bell-off-outline" 
            size={60} 
            color={theme.colors.primary} 
          />
          <Text style={styles.text}>Nenhuma notificação no momento</Text>
        </View>

        // <ViewNull>
        //   <IconButton 
        //     icon="bell-off-outline" 
        //     size={60} 
        //     color={theme.colors.primary} 
        //   />
        //   <Text style={styles.text}>Nenhuma notificação no momento</Text>
        //    <MessageListNull>Aqui é exibida todas as tuas notificações. Por enquanto você não tem nenhuma...</MessageListNull> */}
        //    <TouchableOpacity onPress={()=>{duplicarFrete()}}>
        //     <Text>duplicar frete</Text>
        //   </TouchableOpacity> 
        // // </ViewNull>
      }




    </Container>
  );
}