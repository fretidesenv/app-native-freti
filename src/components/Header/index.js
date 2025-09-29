import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Container, Title, ViewNamePage, NamePage, ButtonNotifications, NotificationView, SeparatorLine } from './styles'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';



function Header(props) {
  const [notifications, setNotifications] = useState(0)
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  async function navigationNotify() {
    navigation.navigate('Notifications', {})
  }

  return (
    <Container>
      <View paddingLeft={15} gap={2} flexDirection="column" width="80%">
        <Title>
          Freti
        </Title>
        <SeparatorLine />
        <ViewNamePage>
          <NamePage>
            {props.namePage}
          </NamePage>
        </ViewNamePage>
      </View>

      {props.namePage !== "Minhas notificações" ?
        <ButtonNotifications onPress={() => navigationNotify()}>
          {notifications > 0 ? <NotificationView /> : null}
          <MaterialIcons
            color="#fff"
            size={25}
            name="notifications-on"
          />
        </ButtonNotifications>
        : null  
      }
    </Container>
  )
}

export default Header;