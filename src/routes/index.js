import React, { useContext, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";

import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";

import { AuthContext } from "../contexts/auth";

import OneSignal from "react-native-onesignal";
import config from "../config/variables.json";
import { PermissionsHandler } from "../handler/permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { stringToBoolean } from "../utils/validation";
import { useApplicationStore } from "../store/application";

//OneSignal Init Code
// OneSignal.setLogLevel(6, 0);
// OneSignal.setAppId("");
//END OneSignal Init Code

//Prompt for push on iOS
// OneSignal.promptForPushNotificationsWithUserResponse(response => {//LOG: promptForPushNotificationsWithUserResponse: this function is not supported on Android
//   console.log("Prompt response:", response);
// });

// //Method for handling notifications received while app in foreground
// OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
//   console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
//   let notification = notificationReceivedEvent.getNotification();
//   console.log("notification: ", notification);
//   const data = notification.additionalData
//   console.log("additionalData: ", data);
//   // Complete with null means don't show a notification.
//   notificationReceivedEvent.complete(notification);
// });

// //Method for handling notifications opened
// OneSignal.setNotificationOpenedHandler(notification => {
//   console.log("OneSignal: notification opened:", notification);
// });

function Routes() {
  const { signed, loading } = useContext(AuthContext);

  const handleShowModal = async () => {
    console.log('🚀 handleShowModal chamado - signed:', signed);
    
    // Primeiro verifica se há permissões bloqueadas (sem solicitar)
    const deniedPermissions = await PermissionsHandler.checkAllPermissions();
    
    if (deniedPermissions && deniedPermissions.length > 0) {
      console.log('🚨 Há permissões bloqueadas, exibindo modal...');
      // Mostra o modal com as permissões bloqueadas
      useApplicationStore.getState().setBlockedPermissions(deniedPermissions);
      useApplicationStore.getState().setShowModalPermsission(true);
    } else {
      console.log('✅ Todas as permissões estão concedidas, não exibindo modal');
      // Não exibe o modal se todas as permissões estão OK
      useApplicationStore.getState().setBlockedPermissions([]);
      useApplicationStore.getState().setShowModalPermsission(false);
      
      // Apenas solicita permissões na primeira execução
      AsyncStorage.getItem("isPermissionsRequested").then((value) => {
        if (!stringToBoolean(value)) {
          console.log('🔄 Primeira execução - solicitando permissões...');
          AsyncStorage.setItem("isPermissionsRequested", "true");
          PermissionsHandler.requestAllPermission();
        }
      });
    }
  }

  useEffect(() => {
    if (signed) {
      handleShowModal();
    }
  }, [signed]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: config?.cor_primaria,
        }}
      >
        <ActivityIndicator size={50} color={config?.cor_secundaria} />
      </View>
    );
  }

  return signed ? (
    <AppRoutes />
  ) : (
    <AuthRoutes />
  );
}

export default Routes;
