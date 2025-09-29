
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./index";
import ModalDataProfile from "./DataProfileRefactored";

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