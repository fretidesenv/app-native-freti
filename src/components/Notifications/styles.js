import styled from "styled-components/native";


export const Container = styled.View`
  flex: 1;
  background-color: #e5e5e5;
`;

export const List = styled.FlatList`
  flex:1;
  background-color: #e5e5e5;
`;

export const CardNotification = styled.View`
  justify-content: center;
  width: 95%;
  margin: 2.5%;
  padding: 2%;
  border: 1px solid  #e5e5e5;
  border-radius: 5px;
  
  background-color: #ffffff;
  
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #353840;
`;

export const Message = styled.Text`
  font-size: 15px;
  color:#353840;
`;

export const ViewNull = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 5px;
`;

export const MessageListNull = styled.Text`
  margin-top: 1%;
  font-size: 15px;
  color: #353840;
  text-align: center;
`;

export const DateTimeNotification = styled.Text`
  margin-top: 1.5%;
  font-size: 12px;
  color: #353840;
  text-align: right;
`;

