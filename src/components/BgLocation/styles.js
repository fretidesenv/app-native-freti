import styled from "styled-components/native";
import config from '../../config/variables.json'
export const Container = styled.View`
  flex:1;
  background-color: #f4bc0b;
  box-shadow: 1px 1px 3px rgba(18,18,18, 0.2);
  elevation: 3;
  padding: 11px;
`;

export const Title = styled.Text`
  font-size: ${props => props.size};
  font-weight: bold;
  color: ${config?.cor_texto_secundaria};
  text-align: center;
  margin-top: 5%;
`;

export const TextInfo = styled.Text`
  font-size: ${props => props.size};
  margin-top: ${props => props.mgtop};
  font-weight: 500;
  color: ${config?.cor_texto_secundaria};
`;

export const BtnPermission = styled.TouchableOpacity`
  background-color: rgb(4,52,203);
  margin-top: 1%;
  padding: 3%;
  border-radius: 10px;
  width: 90%;
  align-self: center;
`;

export const BtnConfirm = styled.TouchableOpacity`
  background-color: rgba(0,180,55, 1);
  margin-top: 1%;
  padding: 3%;
  border-radius: 10px;
  width: 90%;
  align-self: center;
`;

export const BtnSupport = styled.TouchableOpacity`
  background-color: rgba(0,180,55, 1);
  margin-top: 2%;
  padding: 3%;
  border-radius: 10px;
  width: 90%;
  align-self: center;
  justify-content: center;
  align-items: center;
`;

export const ImageModal = styled.Image`
  width: 90%;
  height: 90%;
  border-radius: 5px;
  align-items: center;
  
`;