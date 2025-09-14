import styled from "styled-components/native";
import config from "../../config/variables.json"

export const Container = styled.SafeAreaView`
  width: 100%;
  background-color: ${config?.cor_primaria};
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  padding-top: 15px;  
  border-bottom-width: 1px;
  border-bottom-color:${config?.cor_neutra};
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${config?.cor_neutra};  
  width: 50%;  
`;

export const SeparatorLine = styled.View`
 width: 50%;
 background-color: ${config?.cor_neutra};
 height: 1px;
`;

export const NamePage = styled.Text`
  font-size: 15px;
  color: ${config?.cor_neutra};
  border-radius: 5px;
  margin-bottom: 3px;
`;

export const ViewNamePage = styled.SafeAreaView`

  display: flex;
  padding-right: 10px;
  border-bottom-width: 0px;
  border-bottom-color: #C7C7C7; 
  
`;
export const ButtonNotifications = styled.TouchableOpacity`
  padding: 3%;
`;

export const NotificationView = styled.View`
  margin-bottom: -5px;
  background-color: #0434cb;
  width: 10px;
  height: 10px; 
  border-radius:10px;
  margin-left: 12px;
  z-index: 10
`;

