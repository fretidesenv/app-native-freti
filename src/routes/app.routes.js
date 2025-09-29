import React, { useContext } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Home from "../pages/Home";
import MyFreights from "../pages/MyFreights";
import FreightCompany from "../pages/FreightCompany";
import config from "../config/variables.json";
import { FilterContext } from "../contexts/filter";
import DetailsFreight from "../components/DetailsFreight";
import GeolocationTestScreen from "../components/GeolocationTestScreen";
import Notifications from "../components/Notifications";
import FreightInformEvent from "../pages/FreightInformEvent";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BenefitsScreen from "../pages/benefits/benefits";
import ProfileStack from "../pages/Profile/ProfileStack";
import { createStackNavigator } from "@react-navigation/stack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

const Stack = createStackNavigator();
 
function StackRoutes() {

  return (
    
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FreightCompany"
        component={FreightCompany}
        options={{
          headerShown: false,
          headerTintColor: config?.cor_neutra,
          headerStyle: {
            backgroundColor: config?.cor_primaria,
          },
        }}
      />

      <Stack.Screen
        name="MeusFretes"
        component={MyFreights}
        options={{
          headerShown: false,
          headerTintColor: config?.cor_neutra,

          headerStyle: {
            backgroundColor: config?.cor_primaria,
          },
        }}
      />

      <Stack.Screen
        name="DetailsFreight"
        component={DetailsFreight}
        options={{
          headerShown: false,
          headerTintColor: config?.cor_neutra,

          headerStyle: {
            backgroundColor: config?.cor_primaria,
          },
        }}
      />

      <Stack.Screen
        name="GeolocationTestScreen"
        component={GeolocationTestScreen}
        options={{
          headerShown: false,
          headerTintColor: config?.cor_neutra,

          headerStyle: {
            backgroundColor: config?.cor_primaria,
          },
        }}
      />

      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
          headerTintColor: config?.cor_neutra,

          headerStyle: {
            backgroundColor: config?.cor_primaria,
          },
        }}
      /> 

      <Stack.Screen
        name="FreightInformEvent"
        component={FreightInformEvent}
        options={{
          headerShown: false,
          headerTintColor: config?.cor_neutra,

          headerStyle: {
            backgroundColor: config?.cor_primaria,
          },
        }}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();


function AppRoutes() {
  const { freightsInLine, setFreightsInLine } = useContext(FilterContext);
  const insets = useSafeAreaInsets();
  
  return (

  // <NavigationContainer >
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            height: 70 + insets.bottom,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#001b33',
            paddingBottom: 10 + insets.bottom,
            paddingTop: 10,
          },
        }}
      >
        {/* Opções laterais esquerda */}
        <Tab.Screen 
          name="Meus Fretes" 
          component={MyFreights} 
          options={{
            tabBarIcon: ({ color, size }) => (
              // <Icon name="home" color="#fff" size={size} />
              <MaterialCommunityIcons
                  style={{ marginTop: -2 }}
                  name="road-variant"
                  color={"#ff7208"}
                  size={size}
                />
            ),
          }}
        />
        <Tab.Screen 
          name="Main" 
          component={StackRoutes} 
          options={{
            tabBarIcon: ({ color, size }) => (
              // <MaterialCommunityIcons name="currency-usd" color="#fff" size={30} />
              <Icon name="truck-cargo-container" color="#ff7208" size={30} />
            ),
          }}
        />

        {/* Opção central - Caminhão */}
        {/* <Tab.Screen 
          name="Main" 
          component={StackRoutes} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={{
                backgroundColor: '#FFA500',
                padding: 15,
                borderRadius: 50,
                position: 'absolute',
                top: -30, // Eleva o ícone
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}>
                <Icon name="truck-cargo-container" color="#fff" size={30} />
              </View>
            ),
          }}
        /> */}

        {/* Opções laterais direita */}
        <Tab.Screen 
          name="Settings"  
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color, size }) => ( 
              <Icon name="account" color="#ff7208" size={size} />
            ),
          }}
        />
        {/* <Tab.Screen  
          name="Settings" 
          component={Profile}   
          options={{
            tabBarIcon: ({ color, size }) => ( 
              <Icon name="account" color="#fff" size={size} />
            ),
          }}
        /> */}
        
        <Tab.Screen 
          name="Benefícios" 
          component={BenefitsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="view-grid" color="#ff7208" size={size} />  
            ),
          }}
        />
      </Tab.Navigator>
    // </NavigationContainer>





  );
}

export default AppRoutes;