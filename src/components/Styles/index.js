import styled from "styled-components/native";
import { StyleSheet } from 'react-native'
import config from '../../config/variables.json'


export const Container = styled.View`
  flex:1;
  align-items: center;
  background-color: ${config?.cor_texto_secundaria};
`;

export const Name = styled.Text`
  margin-top: 20px;
  margin-right: 20px;
  margin-left: 20px;
  font-size: 28px;
  font-weight: bold;
  color:  ${config?.cor_texto_primaria};
  text-align: center;
`;

export const Email = styled.Text`
color:  ${config?.cor_texto_primaria};
margin-right: 20px;
margin-left: 20px;
margin-top: 10px;
font-size: 18px;
font-style: italic;
`;

export const Button = styled.TouchableOpacity`
margin-top: 16px;
background-color: ${props => props.bg};
width: 80%;
height: 50px;
border-radius: 4px;
align-items: center;
justify-content: center;
`;

export const ButtonText = styled.Text`
  font-size: 18px;
  color: ${props => props.color};
`;

export const UploadButton = styled.TouchableOpacity`
 margin-top: 20%;
 background-color:  ${config?.cor_texto_primaria};
 width: 165px;
 height: 165px;
 border-radius: 90px; 
 justify-content: center;
 align-items: center;
 z-index: 8;
`;

export const UploadText = styled.Text`
font-size: 55px;
position: absolute;
color: #E52246;
opacity: 0.5;
z-index: 99;
`;

export const Avatar = styled.Image`
  width: 160px;
  height: 160px;
  border-radius: 80px;
`;


export const ModalContainer = styled.KeyboardAvoidingView`
width: 100%;
height: 90%;
background-color: #FFF;
position: absolute;
bottom: 0;
align-items: center;
justify-content: center;
`;

export const ButtonBack = styled.TouchableOpacity`
  position: absolute;
  top: 15px;
  left: 25px;
  flex-direction: row;
  align-items: center;
`;

export const ScrollProfile = styled.ScrollView`
  margin-top: 10% ;
  margin-left: 2.5%;
  margin-right: 2.5%;
  width: 95%;
`;



export const Label = styled.Text`
  text-align: left;
  font-size: 18px;
  padding-left: 1%;
  margin-top: 2%;
  color: #555555;
`;


export const TitleLabel = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  padding-left: 1%;
  margin-top: 10%;
  color: #555555;
`;


export const Input = styled.TextInput`
  background-color: ${config?.cor_texto_secundaria};
  width: ${props => props.width};
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 4px;
  padding-left: 10px;
  font-size: 18px;
  /* color: #121212; */
  color: ${props => props.color};
`;

export const InputMask = styled.TextInput`
  background-color: #DDD;
  width: ${props => props.width};
  border-radius: 4px;
  padding: 4px;
  padding-left: 10px;
  font-size: 18px;
  color: #121212;
`;

export const ViewButtonUpload = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 5%;
  margin-bottom: 5%;
`;

export const ButtonUpload = styled.TouchableOpacity`
  background-color: rgb(4,52,203);
  padding: 5%;
  border-radius: 10px;
  width: 50%;
`;

export const TitleButtonUpload = styled.Text`
  color: ${config?.cor_texto_secundaria};
  text-align: center;
  font-weight: bold;
  font-size: 18px;
`;

export const BankSelectedText = styled.Text`
  color: ${props => props.color};
  text-align: center;
  font-weight: bold;
  font-size: 15px;
`;

export const ErrorText = styled.Text`
  color: #666;
  margin-bottom: 8;
  align-self: flex-start;
`;