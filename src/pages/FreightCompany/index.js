import React, { useLayoutEffect, useState, useCallback, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth'

import firestore from '@react-native-firebase/firestore';

import FreightList from '../../components/FreightList'
import { Container, ListFreights } from './styles'

function FreightCompany() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState(route.params?.title);
  const [freights, setFreights] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title === '' ? '' : title
    })
  }, [navigation, title])

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      firestore()
        .collection('freights')
        .where('userId', '==', route.params?.userId)
        .orderBy('created', 'desc')
        .get()
        .then((snapshot) => {
          const freightList = [];

          snapshot.docs.map(u => {
            freightList.push({
              ...u.data(),
              id: u.id
            })
          })

          if (isActive) {
            setFreights(freightList);
            setLoading(false);
          }

        })

      return () => {
        isActive = false;
      }
    }, [])
  )

  return (
    <Container>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={50} color="#E52246" />
        </View>
      ) : (
        <ListFreights
          showsVerticalScrollIndicator={false}
          data={freights}
          renderItem={({ item }) => <FreightList data={item} userId={user.uid} />}
        />
      )}
    </Container>
  )
}

export default FreightCompany;