import Geolocation from "react-native-geolocation-service";
import { check, request, requestNotifications, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";
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
  // No iOS, não há como verificar sem solicitar, então retornamos null para indicar que precisa verificar de outra forma
  checkNotificationStatus: async () => {
    // No iOS, não há uma função check() para notificações
    // A verificação real será feita através do OneSignal ou não será feita na verificação inicial
    // Retornamos null para indicar que não podemos verificar sem solicitar
    return null;
  },
  // Solicita permissão de notificação (iOS)
  requestNotification: async (deniedPermissions) => {
    deniedPermissions = deniedPermissions ? deniedPermissions : [];

    if (PLATAFORM_IS_IOS) {
      try {
        let resultNotification = await requestNotifications();

        if (resultNotification.status === RESULTS.BLOCKED || resultNotification.status === RESULTS.DENIED) {
          return [...deniedPermissions, NOTIFICATION_LABEL];
        }
      } catch (error) {
        console.log('⚠️ Erro ao solicitar permissão de notificação no iOS:', error);
      }
    }

    return deniedPermissions;
  }
}

const AndroidService = {
  // Verifica o status das notificações (Android 13+)
  checkNotificationStatus: async () => {
    if (!PLATAFORM_IS_IOS && Platform.Version >= 33) {
      try {
        const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        return result;
      } catch (error) {
        console.log('⚠️ Erro ao verificar permissão de notificação no Android:', error);
        return RESULTS.UNAVAILABLE;
      }
    }
    // No Android < 13, notificações são concedidas automaticamente
    return RESULTS.GRANTED;
  },
  // Solicita permissão de notificação (Android 13+)
  requestNotification: async (deniedPermissions) => {
    deniedPermissions = deniedPermissions ? deniedPermissions : [];

    if (!PLATAFORM_IS_IOS && Platform.Version >= 33) {
      try {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        
        if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
          return [...deniedPermissions, NOTIFICATION_LABEL];
        }
      } catch (error) {
        console.log('⚠️ Erro ao solicitar permissão de notificação no Android:', error);
      }
    }
    // No Android < 13, notificações são concedidas automaticamente

    return deniedPermissions;
  }
}

const PermissionsHandler = {
  // Verifica o status das permissões SEM solicitá-las
  checkAllPermissions: async () => {
    let deniedPermissions = [];

    console.log('🔍 Verificando status das permissões...');

    // Verifica todas as permissões básicas
    for (const permission of PERMISSIONS_KEYS) {
      let result = await check(permission);
      let labelPermission = PERMISSIONS_TO_REQUEST[permission];

      console.log(`📱 ${permission}: ${result} - ${labelPermission}`);

      if (result === RESULTS.UNAVAILABLE) {
        console.log(`⚠️ ${permission}: ${labelPermission} não está disponível neste dispositivo.`);
        continue;
      }

      if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        deniedPermissions.push(labelPermission);
        console.log(`❌ ${permission}: ${labelPermission} foi negada/bloqueada`);
      }
    }

    // Verifica permissões de localização específicas
    let locationDeniedPermissions = await PermissionsHandler.checkLocationPermissions();
    if (locationDeniedPermissions && locationDeniedPermissions.length > 0) {
      deniedPermissions = [...deniedPermissions, ...locationDeniedPermissions];
      console.log('📍 Permissões de localização negadas:', locationDeniedPermissions);
    }

    // Verifica permissões de notificação
    let notificationDenied = await PermissionsHandler.checkNotificationPermissions();
    if (notificationDenied) {
      deniedPermissions.push(NOTIFICATION_LABEL);
      console.log('🔔 Permissão de notificação negada');
    }

    console.log('📋 Total de permissões negadas (check):', deniedPermissions.length);
    return deniedPermissions;
  },
  // Verifica permissões de notificação SEM solicitá-las
  checkNotificationPermissions: async () => {
    if (PLATAFORM_IS_IOS) {
      // No iOS, não podemos verificar sem solicitar a permissão
      // Não retornamos como negado na verificação para evitar falsos positivos
      // A solicitação será feita quando necessário
      return false;
    } else {
      // Android 13+ (API 33+)
      if (Platform.Version >= 33) {
        const result = await AndroidService.checkNotificationStatus();
        if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
          console.log('🔔 Notificação negada no Android');
          return true;
        }
      }
      // Android < 13: notificações são automáticas, não precisa verificar
      return false;
    }
  },
  // Verifica permissões de localização SEM solicitá-las
  checkLocationPermissions: async () => {
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

    console.log('📍 Verificando permissões de localização:', permissions);

    for (const permission of permissions) {
      let result = await check(permission);
      console.log(`📍 ${permission}: ${result}`);

      if (result == RESULTS.BLOCKED || result == RESULTS.DENIED) {
        permissionsBlocked.push(PERMISSIONS_TO_REQUEST[permission]);
        console.log(`❌ Localização negada: ${PERMISSIONS_TO_REQUEST[permission]}`);
      }
    }

    console.log('📍 Permissões de localização bloqueadas (check):', permissionsBlocked);
    return permissionsBlocked;
  },
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

    // Solicita permissão de notificação
    // No Android 13+, POST_NOTIFICATIONS já foi solicitada no loop acima via PERMISSIONS_KEYS
    // No iOS, precisamos solicitar usando requestNotifications
    if (PLATAFORM_IS_IOS) {
      deniedPermissions = await IOSService.requestNotification(deniedPermissions);
    }
    // No Android < 13, notificações são automáticas
    // No Android 13+, POST_NOTIFICATIONS já foi processada no loop de PERMISSIONS_KEYS

    console.log('📋 Total de permissões negadas:', deniedPermissions.length);
    console.log('📋 Permissões negadas:', deniedPermissions);

    // Mostra o modal APENAS se houver permissões negadas
    if (deniedPermissions.length > 0) {
      console.log('🚨 Exibindo modal de permissões...');
      setPermissionStorage(deniedPermissions, true);
    } else {
      console.log('✅ Todas as permissões foram concedidas');
      // Não exibe o modal se todas as permissões estão concedidas
      setPermissionStorage([], false);
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