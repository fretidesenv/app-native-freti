import { Platform} from "react-native";
import { PERMISSIONS } from "react-native-permissions";

/*LABELS*/
export const NOTIFICATION_LABEL = "Notificações";
export const LOCATION_PRECISION_LABEL = "Localização Precisa";
export const LOCATION_APPROXIMATE_LABEL = "Localização Aproximada";
export const LOCATION_BACKGROUND_LOCATION = "'Localização em Segundo Plano' ou em permissões de localização a opção 'Permitir o tempo todo'";
export const CAMERA_LABEL = "Accesso da câmera para fotos de carga/descarga e documentos";

/*PERMISSIONS LIST*/
export const PERMISSIONS_ANDROID = {
    [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]: LOCATION_PRECISION_LABEL,
    [PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]: LOCATION_APPROXIMATE_LABEL,
    [PERMISSIONS.ANDROID.CAMERA]: CAMERA_LABEL,
    ...(Platform.Version >= 29 && { [PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]: LOCATION_BACKGROUND_LOCATION }) // Apenas Android 10+
};

export const PERMISSIONS_IOS = {
    [PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY]: LOCATION_PRECISION_LABEL,
    [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]: LOCATION_APPROXIMATE_LABEL,
    [PERMISSIONS.IOS.LOCATION_ALWAYS]: LOCATION_BACKGROUND_LOCATION,
    [PERMISSIONS.IOS.CAMERA]: CAMERA_LABEL,
};

/*PLATAFORM*/
export const PLATAFORM_IS_IOS = Platform.OS == "ios";
export const PLATAFORM_IS_ANDROID = Platform.OS != "ios";
export const PERMISSIONS_TO_REQUEST = PLATAFORM_IS_IOS ? PERMISSIONS_IOS : PERMISSIONS_ANDROID;
export const PERMISSIONS_KEYS = Object.keys(PERMISSIONS_TO_REQUEST);