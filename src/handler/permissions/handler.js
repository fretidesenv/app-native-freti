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

    for (const permission of PERMISSIONS_KEYS) {
      let result = await PermissionsHandler.requestPermission(permission);
      let labelPermission = PERMISSIONS_TO_REQUEST[permission];

      if (result === RESULTS.UNAVAILABLE) {
        console.log(`⚠️ ${permission}: ${labelPermission} não está disponível neste dispositivo.`);
        continue; // Pula essa permissão
      }

      if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        deniedPermissions.push(labelPermission); // Armazena apenas as permissões negadas        
      }
    }

    await PermissionsHandler.requestLocationPermissions();
    deniedPermissions = await IOSService.checkNotification(deniedPermissions);

    if (deniedPermissions.length > 0) {
      setPermissionStorage(deniedPermissions, true);
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
    let isBlockedLocation = false;

    if (PLATAFORM_IS_IOS) {
      permissions.push(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      permissions.push(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      permissions.push(PERMISSIONS.IOS.LOCATION_ALWAYS);
    } else {
      permissions.push(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissions.push(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
    }

    for (const permission of permissions) {
      let result = await PermissionsHandler.requestPermission(permission);

      if (result == RESULTS.BLOCKED || result == RESULTS.DENIED) {
        isBlockedLocation = true;
        permissionsBlocked.push(PERMISSIONS_TO_REQUEST[permission]);
      }
    }

    if (isBlockedLocation) {
      setPermissionStorage(permissionsBlocked, true);
    }

    return !isBlockedLocation;
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

    if (await PermissionsHandler.requestLocationPermissions()) {
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
    }
  }
}

export { PermissionsHandler, IOSService };