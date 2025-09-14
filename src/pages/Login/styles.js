import styled from 'styled-components/native';
import config from '../../config/variables.json'

export const Container = styled.View`
  flex:1;
  background-color: ${config?.cor_texto_secundaria};
  justify-content: center;
  align-items: center;
  
`;

export const Title = styled.Text`
  color: grey;
  font-size: 55px;
  font-weight: bold;
  font-style: italic;
  
`;


export const ButtonText = styled.Text`
  color: #FFF;
  font-size: 18px;
  font-family: 'antipasto-pro-demibold';
`;

export const ImgGoogle = styled.Image`
  margin-right: 10px;
  width: 30px;
  height: 30px;
`;

export const ButtonGoogle = styled.TouchableOpacity`
  width: 80%;
  flex-direction: row;
  margin-top: 1%;
  padding: 8px;
  border-radius: 7px;
  justify-content: center;
  align-items: center;
`;

export const ViewLogo = styled.View`
  width: 250px; /* Nova largura desejada */
  height: 278px; /* Calculando a altura proporcional */
  
  padding: 10px;
  align-items: center;
  justify-content: center;
`;

export const Logo = styled.Image`
  width: 100%;
  height: 100%;
`;
export const BtnTerms = styled.TouchableOpacity`
  border-radius: 2px;
  height: 30px;
  padding: 0 20px;
  margin-top: 4%;
`;

export const TextError = styled.Text`
  margin: 1% 3%;
`;

export const Label = styled.Text`
    padding-top: 15px;
    margin-top: 10px;
    font-size: 20px;
    font-family: 'antipasto-pro-demibold';
    color:  ${config?.cor_texto_primaria};
`;

export const Input = styled.TextInput`
  background-color: ${config?.cor_texto_secundaria};
  width: 80%;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 4px;
  padding-left: 10px;
  font-size: 18px;
  /* color: #121212; */
  color: ${props => props.color};
`;

export const BtnLogin = styled.TouchableOpacity`
background-color: rgba(4,52,203, 1);
width: 80%;
border-radius: 5px;
justify-content: center;
align-items: center;

height: 35px;
padding: 0 20px;
margin-top: 5%;
`;

export const BtnEditAction = styled.TouchableOpacity`
  /* width: 80%; */
  border-radius: 5px;
  padding: 5px;
  align-items: center;
  justify-content: center;
`;

export const TxtBtnEditAction = styled.Text`
  font-size: 15px;
  color: ${config.cor_texto_primaria};
  align-items: center;
  text-decoration: underline;
`;