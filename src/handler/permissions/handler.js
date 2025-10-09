import Geolocation from "react-native-geolocation-service";
import { check, request, requestNotifications, PERMISSIONS, RESULTS } from "react-native-permissions";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  NOTIFICATION_LABEL,
  PERMISSIONS_KEYS,
  PERMISSIONS_TO_REQUEST,
  PLATAFORM_IS_IOS
} from "./tokens";
import { useApplicationStore } from "../../store/application";

const setPermissionStorage = (blockedPermissions, showModal) => {
  useApplicationStore.getState().setBlockedPermissions(blockedPermissions);
  useApplicationStore.getState().setShowModalPermsission(showModal);
}

const IOSService = {
  checkNotification: async (deniedPermissions) => {
    deniedPermissions = deniedPermissions ? deniedPermissions : [];

    if (PLATAFORM_IS_IOS) {
      let resultNotification = await requestNotifications();

      if (resultNotification.status === RESULTS.BLOCKED || resultNotification.status === RESULTS.DENIED) {
        return [...deniedPermissions, NOTIFICATION_LABEL]
      }
    }

    return deniedPermissions;
  }
}

const PermissionsHandler = {
  requestAllPermission: async (callback) => {
    let deniedPermissions = [];

    console.log('🔐 Iniciando solicitação de permissões...');

    
    // Solicita todas as permissões básicas
    for (const permission of PERMISSIONS_KEYS) {
      let result = await PermissionsHandler.requestPermission(permission);
      let labelPermission = PERMISSIONS_TO_REQUEST[permission];

      console.log(`📱 ${permission}: ${result} - ${labelPermission}`);

      if (result === RESULTS.UNAVAILABLE) {
        console.log(`⚠️ ${permission}: ${labelPermission} não está disponível neste dispositivo.`);
        continue; // Pula essa permissão
      }

      if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        deniedPermissions.push(labelPermission); // Armazena apenas as permissões negadas        
        console.log(`❌ ${permission}: ${labelPermission} foi negada/bloqueada`);
      }
    }

    // Solicita permissões de localização específicas
    let locationDeniedPermissions = await PermissionsHandler.requestLocationPermissions();
    if (locationDeniedPermissions && locationDeniedPermissions.length > 0) {
      deniedPermissions = [...deniedPermissions, ...locationDeniedPermissions];
      console.log('📍 Permissões de localização negadas:', locationDeniedPermissions);
    }

    // Verifica notificações no iOS
    deniedPermissions = await IOSService.checkNotification(deniedPermissions);

    console.log('📋 Total de permissões negadas:', deniedPermissions.length);
    console.log('📋 Permissões negadas:', deniedPermissions);

    // Mostra o modal se houver permissões negadas
    if (deniedPermissions.length > 0) {
      console.log('🚨 Exibindo modal de permissões...');
      setPermissionStorage(deniedPermissions, true);
    } else {
      console.log('✅ Todas as permissões foram concedidas');
      // No Android, sempre mostra o modal informativo para explicar as permissões
      if (!PLATAFORM_IS_IOS) {
        console.log('🤖 Android - Exibindo modal informativo...');
        setPermissionStorage([], true);
      }
    }

    if (callback) {
      callback(deniedPermissions);
    }
  },
  requestPermission: async (permission) => {
    return await request(permission);
  },
  requestLocationPermissions: async () => {
    let permissions = [];
    let permissionsBlocked = [];

    if (PLATAFORM_IS_IOS) {
      permissions.push(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      permissions.push(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      permissions.push(PERMISSIONS.IOS.LOCATION_ALWAYS);
    } else {
      permissions.push(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissions.push(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
    }

    console.log('📍 Solicitando permissões de localização:', permissions);

    for (const permission of permissions) {
      let result = await PermissionsHandler.requestPermission(permission);
      console.log(`📍 ${permission}: ${result}`);

      if (result == RESULTS.BLOCKED || result == RESULTS.DENIED) {
        permissionsBlocked.push(PERMISSIONS_TO_REQUEST[permission]);
        console.log(`❌ Localização negada: ${PERMISSIONS_TO_REQUEST[permission]}`);
      }
    }

    console.log('📍 Permissões de localização bloqueadas:', permissionsBlocked);
    return permissionsBlocked;
  },
  activeCamera: (callback, customOptions) => {
    const CAMERA_PERMISSION = PLATAFORM_IS_IOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

    PermissionsHandler.requestPermission(CAMERA_PERMISSION)
      .then((result => {
        if (result == RESULTS.BLOCKED || result == RESULTS.DENIED) {
          setPermissionStorage([PERMISSIONS_TO_REQUEST[CAMERA_PERMISSION]], true);
        } else {
          const options = {
            noData: true,
            mediaType: "photo",
            ...(customOptions ?? {})
          };

          launchCamera(options, (response) => {
            if (callback) {
              callback(response);
            }
          });
        }
      }));
  },
  activeLibrary: (callback, customOptions) => {
    const options = {
      noData: true,
      mediaType: "photo",
      ...(customOptions ?? {})
    };

    launchImageLibrary(options, (response) => {
      if (callback) {
        callback(response);
      }
    });
  },
  getGeoLocation: async (callback, geolocationOptions) => {
    const time = 15 * 1000;
    const options = {
      enableHighAccuracy: true,
      timeout: time,
      maximumAge: time,
      showLocationDialog: true,
      ...geolocationOptions
    }

    // Verifica se as permissões de localização foram concedidas
    const locationDeniedPermissions = await PermissionsHandler.requestLocationPermissions();
    const hasLocationPermission = locationDeniedPermissions.length === 0;

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        async ({ coords, timestamp }) => {
          if (callback) {
            callback(coords, timestamp);
          }
        },
        (error) => {
          console.error(
            "Erro ao obter localização: =>",
            error.message,
            new Date()
          );

          if (callback) {
            callback(null, null, error);
          }
        }, options);
    } else {
      console.log('❌ Permissões de localização não concedidas');
      if (callback) {
        callback(null, null, new Error('Permissões de localização não concedidas'));
      }
    }
  }
}

export { PermissionsHandler, IOSService };