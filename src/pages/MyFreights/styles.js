import styled from "styled-components/native";

export const Container = styled.SafeAreaView`

  flex:1;
  background-color: #e5e5e5;
`;

export const AreaInput = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #F1f1f1;
  margin: 10px;
  border-radius: 4px;
  padding: 5px 10px;
`;

export const Input = styled.TextInput`
  width: 90%;
  background-color: #F1f1f1; 
  height: 40px;
  padding-left: 8px;
  font-size: 17px;
  color: #121212;
`;


export const List = styled.FlatList`
flex:1;
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

