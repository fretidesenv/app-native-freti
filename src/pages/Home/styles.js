import styled from "styled-components/native";
import config from '../../config/variables.json';
export const Container = styled.View`
  flex:1;
  background-color: ${config?.cor_texto_secundaria};
`;

export const ListFreights = styled.FlatList`
  flex:1;
  background-color: #e5e5e5;
`;
export const Input = styled.TextInput`
  background-color: ${config?.cor_texto_secundaria};
  width: ${props => props.width};
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 4px;
  padding-left: 10px;
  font-size: 18px;
   color: #121212; 

`;

export const SelectCity = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  padding: 10px;
  border: 1px solid #e4e4e7;
  border-radius: 4px;



`;


export const ButtonCity = styled.TouchableOpacity`
  padding: 1px;
  border: 0px solid #e4e4e7;
  border-radius: 1px;
`;

export const InputSearch = styled.TextInput`
  border: 1px solid #e4e4e7;
  border-radius: 5px;
  color: #000000;
`;

export const Label = styled.Text`
  text-align: left;
  font-size: 14px;
  padding-left: 1%;
  margin-top: 1%;
  margin-bottom: 1%;
  color: #555555;
`;

export const Line = styled.View`
  width: 100%;
  height: 1px;
  background-color:#555555;
  margin-top: 5px;
`;

export const ViewMessage = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const TextMessage = styled.Text`
  color: #555;
  font-size: 16px;
  text-align: center;
  padding: 10%;
`;

export const TextCity = styled.Text`
  color: #000000;
  font-size: 16px;

`;

export const InputKm = styled.TextInput`
  background-color:#e5e5e5;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 4px;
  padding-left: 10px;
  font-size: 14px;
  color: #121212; 

`;