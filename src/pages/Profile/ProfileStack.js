
import { createStackNavigator } from "@react-navigation/stack";
import Profile from ".";
import ModalDataProfile from "./DataProfile";

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="DataProfile"
      component={ModalDataProfile}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
  );
}