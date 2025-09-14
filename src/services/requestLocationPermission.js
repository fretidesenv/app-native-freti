import { PermissionsAndroid, Platform } from "react-native";

export async function requestLocationPermission() {
  if (Platform.OS === "android") {
    try {
      // Solicita localização aproximada
      const coarseLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Permissão para Localização Aproximada",
          message:
            "Este aplicativo precisa de acesso à sua localização aproximada.",
          buttonNeutral: "Perguntar Depois",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        }
      );

      if (coarseLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("Permissão de localização aproximada negada");
        return false;
      }

      // Solicita permissão para localização precisa
      const fineLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permissão para Acessar Localização Precisa",
          message:
            "Este aplicativo precisa de acesso à sua localização precisa.",
          buttonNeutral: "Perguntar Depois",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        }
      );

      if (fineLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("Permissão de localização precisa negada");
        return false;
      }

      // Solicita permissão para localização em segundo plano (somente Android API 29+) (Android 10+)
      if (Platform.Version >= 29) {
        const backgroundLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: "Permissão para Acessar Localização em Segundo Plano",
            message:
              "Este aplicativo precisa de acesso à sua localização em segundo plano.",
            buttonNeutral: "Perguntar Depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          }
        );

        if (backgroundLocationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Permissão de localização em segundo plano negada");
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissão de localização", error);
      return false;
    }
  }
  return true;
} 
