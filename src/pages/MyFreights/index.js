import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Header from '../../components/Header';

import { AuthContext } from '../../contexts/auth'
import Finished from './finished';
import Progress from './progress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MyFreights() {
  const [userAuthorizedFreights, setUserAuthorizedFreights] = useState(false);
  const { user } = useContext(AuthContext);
  const [myFreights, setMyfreights] = useState([]);
  const [freights, setFreights] = useState([])
  const navigation = useNavigation();
  const Tab = createMaterialTopTabNavigator();


  useEffect(() => {
    const subscriber = firestore().collection(`drivers_users/${user.uid}/myFreightsList`)
      .onSnapshot(snapshot => {
        const listFreights = [];
        snapshot.forEach(doc => {
          listFreights.push({
            ...doc.data(),
            id: doc.id,
          })
        })

        async function buscaFretes() {
          let myFreights = []

          for (let i = 0; i < listFreights.length; i++) {
            let registrationInLineTime = listFreights[i].registrationInLineTime
            let frete = await firestore()
              .collection('freight') 
              // .collection('freight_teste') __temp_
              .doc(listFreights[i].id)
              .get()
            let id = listFreights[i].id
            myFreights = [...myFreights, { ...frete.data(), registrationInLineTime, id }]
          }
          setMyfreights(myFreights)
        }
        buscaFretes()

      })

    return () => subscriber();
  }, [])

  const insets = useSafeAreaInsets();

  return (
    // <Container>
    <>
      <Header namePage="Meus fretes" />
    
        <Tab.Navigator
          screenOptions={{
            "tabBarActiveTintColor": "rgb(4,52,203)",
            "tabBarInactiveTintColor": "rgba(0,0,0,1)",
            "tabBarIndicatorStyle": {
              "backgroundColor": "rgb(4,52,203)"
            }
          }}>

          <Tab.Screen name="Agora" component={Progress} />
          <Tab.Screen name="finalizados" component={Finished} />
        </Tab.Navigator>

    </>
  )
}

export default MyFreights;