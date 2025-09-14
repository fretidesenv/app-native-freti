import React, { useState } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/Feather";
import Header from "../../components/Header";

const Finance = () => {

  const [showValues, setShowValues] = useState(true);

  return (

        <Container>
            <Header namePage="Minhas Finanças" />

            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

                <ContainerIn>

                    <HeaderText>
                        <HeaderTextHeader>Minha Conta</HeaderTextHeader>
                            <IconButton onPress={() => setShowValues(!showValues)}>
                                <Icon
                                name={showValues ? "eye" : "eye-off"}
                                size={24}
                                color="#333"
                                />
                            </IconButton>
                    </HeaderText>

                    <Card>
                        <Row>
                            <Column>
                            <Label>Adiantamento</Label>
                            <SubLabel>Valor a receber</SubLabel>
                            </Column>
                            <Column align="flex-end">
                            <MainValue>{showValues ? "R$ 5.000,00" : "*****"}</MainValue>
                            <BlockedValue>{showValues ? "R$ 1.500,00" : "*****"}</BlockedValue>
                            </Column>
                        </Row>
                    </Card> 

                    <Card>
                        <Row>
                            <Column>
                            <SubLabel>Total Recebido</SubLabel>
                            <SubLabel>de todas as viagens</SubLabel>
                            </Column>
                            <Column align="flex-end">
                            <BlockedValueTotal>{showValues ? "R$ 10.500,00" : "*****"}</BlockedValueTotal>
                            </Column>
                        </Row>
                    </Card> 

                    <CardContainer>
                        <CardLow>
                            <Icon name="truck" size={20} color="#007AFF" />
                            <Text>Viagens</Text>
                            <ValueLow>10</ValueLow>
                        </CardLow>
                        <CardLow>
                            <Icon name="package" size={20} color="#28a745" />
                            <Text>Entregas</Text>
                            <ValueLow>15</ValueLow>
                        </CardLow>
                       
                        
                    </CardContainer>

                    <CardContainer>
                        <CardLow>
                            <Icon name="alert-circle" size={20} color="#DC3545" />
                            <Text>Ocorrências</Text>
                            <ValueLow>5</ValueLow>
                        </CardLow>
                        <CardLow>
                            <Icon name="alert-circle" size={20} color="#DC3545" />
                            <Text>Ocorrências</Text>
                            <ValueLow>5</ValueLow>
                        </CardLow>
                    </CardContainer>

                </ContainerIn>

            </Container>
  );
};


const CardContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const CardLow = styled.View`
  width: 48%; /* Ajusta para caber dois cards lado a lado */
  height: 100px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  margin-top: 10px;
`;


export const Container = styled.SafeAreaView`
  flex:1;
  background-color: #e5e5e5;
  `

const ContainerIn = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Card = styled.View`
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  margin-top: 10px;
`;


const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.View`
  flex-direction: column;
  align-items: ${(props) => props.align || "flex-start"};
`;

const Label = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;


const SubLabel = styled.Text`
  font-size: 14px;
  color: #777;
  margin-top: 8px;
`;

const MainValue = styled.Text`
  font-size: 24px;
  color: #28a745;
  font-weight: bold;
`;

const BlockedValue = styled.Text`
  font-size: 18px;
  color: #dc3545;
  margin-top: 8px;
`;

const BlockedValueTotal = styled.Text`
  font-size: 18px;
  color:#007AFF;
  margin-top: 8px;
`;


const Text = styled.Text`
  font-size: 12px;
  color: #333;
  margin-top: 4px;
`;

const ValueLow = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #007AFF;
`;

const HeaderTextHeader = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const HeaderText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const IconButton = styled.TouchableOpacity`
  padding: 8px;
`;

// export const Container = styled.SafeAreaView`

//   flex:1;
//   background-color: #e5e5e5;
  
// `;

// const View = styled.View`
//   margin-bottom: 20px;
//   padding: 10px 10px;

// `;

// const Title = styled.Text`
//   font-size: 18px;
//   color: #333;
//   font-weight: 500;
//   margin-bottom: 10px;
// `;

// const TotalCard = styled.View`
//   flex-direction: row;
//   align-items: center;
//   background-color: #ffffff;
//   padding: 15px 20px;
//   border-radius: 8px;
//   shadow-color: #000;
//   shadow-offset: 0px 2px;
//   shadow-opacity: 0.1;
//   shadow-radius: 4px;
//   elevation: 2;
// `;

// const TotalValue = styled.Text`
//   font-size: 32px;
//   color: #007bff;
//   font-weight: bold;
//   margin-left: 10px;
// `;

// const CardContainer = styled.View`
//   flex: 1;
//   padding: 10px 10px;

// `;

// const Card = styled.View`
//   background-color: #ffffff;
//   padding: 15px 20px;
//   border-radius: 8px;
//   margin-bottom: 15px;
//   shadow-color: #000;
//   shadow-offset: 0px 2px;
//   shadow-opacity: 0.1;
//   shadow-radius: 4px;
//   height: 150px;
//   elevation: 2;
// `;

// const CardRow = styled.View`
//   flex-direction: row;
//   align-items: center;
// `;

// const CardTitle = styled.Text`
//   font-size: 16px;
//   color: #333;
//   font-weight: 500;
//   margin-left: 10px;
// `;

// const CardValue = styled.Text`
//   font-size: 28px;
//   color: #333;
//   font-weight: bold;
//   margin-top: 10px;
// `;

export default Finance;
