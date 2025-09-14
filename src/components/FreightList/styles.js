import styled from "styled-components/native";
import config from "../../config/variables.json"


export const Container = styled.View`

  margin-top: 8px;
  margin: 8px 2%;
  background-color: ${config?.cor_neutra};
  border-radius: 8px;
  box-shadow: 1px 1px 3px rgba(18,18,18, 0.2);
  elevation: 3;
  padding: 11px;
  display: flex;

`;

export const Header = styled.TouchableOpacity`
width: 100%;
flex-direction: row;
align-items: center;
margin-bottom: 5px;
`;

export const Name = styled.Text`
  color: #353840;
  font-size: 18px;
  font-weight: bold;
  padding-left: 2%;
  padding-right: 10%;

  
`;


export const Avatar = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 6px;
  background-color: ${config?.cor_primaria};
`;
export const AvatarImg = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 6px;
`;


export const ContentView = styled.View``;


export const Content = styled.Text`
color: #353840;
margin: 4px 0;
`;

export const Actions = styled.View`
margin-top: 5px;
flex-direction: row;
justify-content: space-between;
align-items: center;
`;

// export const ButtonMore = styled.TouchableOpacity`
//   height: 40px;
//   background-color:  ${config?.cor_texto_primaria};
// `;

export const ButtonMore = styled.TouchableOpacity`
background-color: ${config?.cor_secundaria};
width: 30%;
height: 30px;
flex-direction: row;
align-items: center;
justify-content: center;
border-radius: 10px;
`;

export const TextMore = styled.Text`
  color: ${config?.cor_neutra};
  font-weight: bold;
`;

export const TimePost = styled.Text`
color: #121212;
`;

export const ModalViewDetails = styled.View`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content:center;
  margin: 5% 5% 0 5%;
  border-radius: 10px;
  background-color: ${config?.cor_neutra};
`;

export const ButtonCloseModal = styled.TouchableOpacity`
  height: 10%;
  justify-content: center;
  align-items: center;
`;

export const TextCloseModal = styled.Text`
  color: ${config?.cor_neutra};
  font-weight: bold;
  border: 1px solid ${config?.cor_primaria};
  background-color: ${config?.cor_primaria};
  padding: 10px;
  border-radius: 10px;

`;

export const LineModal = styled.View`
  flex-direction: row;
  width: 70%;
`;

export const Line = styled.View`
  flex-direction: row;
  height:1px;
  background-color:  ${config?.cor_texto_primaria};
  width: 100%;
  margin-top:2px ;
  margin-bottom: 2px;
`;

export const TitleDetails = styled.Text`
  font-weight: bold;
  font-size: 15px;
  color:  ${config?.cor_texto_primaria};
  margin-top: 3%;
`;

export const CompanyLogo = styled.Image`
  height: 80px;
  width: 160px;
`;