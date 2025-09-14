import React,{ useState} from 'react';
import { Select, Checkbox,  } from "native-base";
import styled from "styled-components/native";


export const SelectBodywork = () => {
  const [groupValue, setGroupValue] = useState([]);


  return (
    <>
      <Label>Tipo de carroceria:</Label>
      {/* <Checkbox.Group colorScheme="green" defaultValue={groupValue} accessibilityLabel="pick an item" onChange={values => {
        setGroupValue(values || []);
      }}>
        <Checkbox value="1" my="1">Aberto</Checkbox>
        <Checkbox value="2" my="1">Grade baixa</Checkbox>
        <Checkbox value="3" my="1">c</Checkbox>
        <Checkbox value="4" my="1">Graneleiro</Checkbox>
        <Checkbox value="5" my="1">Sider</Checkbox>
        <Checkbox value="6" my="1">Prancha</Checkbox>
        <Checkbox value="7" my="1">Tanque</Checkbox>
        <Checkbox value="8" my="1">Caçamba</Checkbox>
        <Checkbox value="9" my="1">Baú Frigorifico</Checkbox>
        <Checkbox value="10" my="1">Porta Container</Checkbox>
        <Checkbox value="11" my="1">Cilo</Checkbox>
        <Checkbox value="12" my="1">Cegonha</Checkbox>
      </Checkbox.Group> */}

      <Checkbox.Group  size="md" defaultValue={groupValue}
       accessibilityLabel="pick an item" onChange={values => {
        setGroupValue(values || []);
      }}>
        <Checkbox value="aberto" my="1">Aberto</Checkbox>
        <Checkbox value="gradeBaixa" my="1">Grade baixa</Checkbox>
        <Checkbox value="bau" my="1">Baú</Checkbox>
        <Checkbox value="graneleiro" my="1">Graneleiro</Checkbox>
        <Checkbox value="sider" my="1">Sider</Checkbox>
        <Checkbox value="prancha" my="1">Prancha</Checkbox>
        <Checkbox value="tanque" my="1">Tanque</Checkbox>
        <Checkbox value="cacamba" my="1">Caçamba</Checkbox>
        <Checkbox value="bauFrigorifico" my="1">Baú Frigorifico</Checkbox>
        <Checkbox value="portaContainer" my="1">Porta Container</Checkbox>
        <Checkbox value="cilo" my="1">Cilo</Checkbox>
        <Checkbox value="cegonha" my="1">Cegonha</Checkbox>
        </Checkbox.Group>

      </>
      )

};

      const Label = styled.Text`
      text-align: left;
      font-size: 18px;
      padding-left: 1%;
      margin-top: 2%;
      color: #555555;
      `;