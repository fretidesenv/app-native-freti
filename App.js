import 'react-native-gesture-handler';
import { useContext } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import Routes from './src/routes'
import { AuthContext } from "./src/contexts/auth";
import AuthProvider from './src/contexts/auth';
import VerificationProvider from './src/contexts/registrationVerification';
import FilterProvider from './src/contexts/filter';
import {
  NativeBaseProvider
} from "native-base";
import config from './src/config/variables.json'
import PermissionModal from './src/components/PermissionModal';
// navigator.geolocation = require('@react-native-community/geolocation');

export default function App() {

  const { signed } = useContext(AuthContext);

  // useEffect(() => {
  //   if (signed) {
  //     checkAndRequestPermissions();
  //   }
  // }, [signed]); // Executa apenas quando signed muda para true


  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <AuthProvider>
          <VerificationProvider>
            <FilterProvider>
              <StatusBar backgroundColor={config?.cor_primaria} barStyle="light-content" translucent={false} />
              <PermissionModal />
              <Routes />
            </FilterProvider>
          </VerificationProvider>
        </AuthProvider>
      </NativeBaseProvider>

    </NavigationContainer>
  );
}