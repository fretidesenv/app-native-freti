import styled from "styled-components/native";
import config from '../../config/variables.json'

export const Container = styled.View`
  flex:1;
  justify-content: center;
  background-color: ${config?.cor_texto_secundaria};
`;


export const Input = styled.TextInput`
  background-color: ${config?.cor_texto_secundaria};
  width: 100%;
  min-height: 150px;
  margin: 0;
  margin-top: 4px;
  border-radius: 4px;
  border: 1px solid #bbb;
  padding: 4px;
  padding-left: 10px;
  font-size: 15px;
  
  /* color: #121212; */
  color: "rgba(50,50,50,1)";
`;

export const Label = styled.Text`
    font-weight: bold;
    font-size: 15px;
    color: "rgba(50,50,50,1)";
`

export const Line = styled.View`
  flex-direction: row;
  height:1px;
  background-color:  ${config?.cor_texto_primaria};
  width: 100%;
  margin-top:2% ;
  margin-bottom: 2px;
`;

export const BtnSaveRegisterEvent = styled.TouchableOpacity`
    width: 90%;
    margin:  5%;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: ${config.cor_primaria};
`;

export const TextBtnSaveRegister = styled.Text`
    font-size: 15px;
    font-weight: bold;
    color: ${config.cor_texto_secundaria};
`;

export const UploadButton = styled.TouchableOpacity`
 margin-left: 2.5px;
 margin-right: 2.5px;
 border: 1px solid #121212;
 border-radius: 10px;
 width: 50px;
 height: 50px;
 justify-content: center;
 align-items: center;
 z-index: 8;
`;

export const Image = styled.Image`
  width: 105px;
  height: 105px;
  border-radius: 5px;

`;

export const InputSearch = styled.TextInput`
  border: 1px solid #e4e4e7;
  border-radius: 5px;
  color: #000000;
`;


export const ButtonSelectEvent = styled.TouchableOpacity`
  padding: 1px;
  border: 0px solid #e4e4e7;
  border-radius: 1px;
`;
