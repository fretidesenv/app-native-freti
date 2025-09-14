import styled from "styled-components/native";
import config from '../../config/variables.json'

export const Container = styled.SafeAreaView`
  width: 100%;
  background-color: #f4bc0b;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding-top: 15px;
  padding-left: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #C7C7C7; 
`;

export const Title = styled.Text`
  font-size: 30px;
  font-weight: bold;
  padding-bottom: 10px;
  color: #FFF;
`;

export const NamePage = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #f4bc0b;
  background-color: ${config?.cor_texto_secundaria};
  padding: 2px 5px;
  border-radius: 5px;
  margin-bottom: 3px;
`;

export const ViewNamePage = styled.SafeAreaView`

  display: flex;
  padding-top: 15px;
  padding-right: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #C7C7C7; 
  
`;
