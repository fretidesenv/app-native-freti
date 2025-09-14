import React, { useContext, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Select, CheckIcon } from "native-base";
import { VerificationContext } from '../../contexts/registrationVerification';
import { AuthContext } from '../../contexts/auth';
import { Input, Label } from '../Styles';
import { TextInputMask } from 'react-native-masked-text';

export const _SelectKinship = (props) => {
  const { kin1, setKin1, kin2, setKin2, } = useContext(VerificationContext);
  const [nameKin1, setNameKin1] = useState(kin1.name);
  const [nameKin2, setNameKin2] = useState(kin2.name);

  const [numCelular1, setNumCelular1] = useState('');
  const numCellRef1 = useRef(null);
  const [numCelular2, setNumCelular2] = useState('');
  const numCellRef2 = useRef(null);

  const { signOut, user, setUser, storageUser } = useContext(AuthContext);
  const kinship = [
    { key: 1, degree: 'Cônjugue/Companheiro' },
    { key: 2, degree: 'Mãe/Pai' },
    { key: 3, degree: 'Filha/Filho' },
    { key: 4, degree: 'Irmã/Irmão' },
    { key: 5, degree: 'Tia/Tio' },
    { key: 6, degree: 'Psrima/Primo' },
  ]

  let kinshipItem = kinship.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.degree} />
  })

  function handleEditDegree(item) {
    if (props.kinship === 1) {
      setKin1({ name: kin1.name, contact: kin1.contact, degree: kinship[item].degree })
    } else if (props.kinship === 2) {
      setKin2({ name: kin2.name, contact: kin2.contact, degree: kinship[item].degree })
    } else return null;
    console.log(kinship[item].grau + '-' + props.kinship)
  }

  function handleEditName(text) {
    if (props.kinship === 1) {
      setKin1({ name: text, contact: kin1.contact, degree: kinship.degree })
      setNameKin1(text);
    } else if (props.kinship === 2) {
      setKin2({ name: text, contact: kin2.contact, degree: kinship.degree })
      setNameKin2(text);
    } else return null;
    console.log(kin1.name)
  }

  function handleEditContact(text) {
    if (props.kinship === 1) {
      setKin1({ name: kin1.name, contact: text, degree: kinship.degree })
      setNumCelular1(text)
    } else if (props.kinship === 2) {
      setKin2({ name: kin2.name, contact: text, degree: kinship.degree })
      setNumCelular2(text);
    } else return null;

  }

  return (
    <>
      <Label style={{ marginTop: '10%' }}>Nome parente {props.kinship}:</Label>
      <Input
        width="95%"
        placeholder={user?.name}
        value={props.kinship === 1 ? nameKin1 : nameKin2}
        onChangeText={(text) => handleEditName(text)}
        editable={props.edit}
        color={props.edit ? '#121212' : '#ddd'}
      />

      <Label>Contato parente {props.kinship}:</Label>
      <TextInputMask
        placeholder='ex.: (11) 9 9999-9999'
        style={[styles.input, { color: props.edit ? '#121212' : '#ddd' }]}
        type={'cel-phone'}
        options={{
          maskType: 'BRL',
          withDDD: true,
          dddMask: '(99) 9 '
        }}
        value={props.kinship === 1 ? numCelular1 : numCelular2}
        onChangeText={(text) => handleEditContact(text)}
        ref={props.kinship === 1 ? numCellRef1 : numCellRef2}
        editable={props.edit}
      />

      {props.edit ? (
        <>
          <Select
            marginTop={1}
            selectedValue={null}
            minWidth='90%'
            width='90%'
            accessibilityLabel="Selecione o grau"
            placeholder="Selecione o grau"
            _selectedItem={{
              bg: "yellow.500",
              endIcon: <CheckIcon size="5" />,
            }}

            onValueChange={(itemValue) => handleEditDegree(itemValue)}
          >
            {kinshipItem}
          </Select>
        </>
      )
        : (<>
          <Input
            width="80%"
            style={{marginTop: 10, color: '#ddd'}}
            placeholder={props.kinship === 1 ? kin1.degree : kin2.degree}
            value={props.kinship === 1 ? kin1.degree : kin2.degree}
            editable={props.edit}
          />
        </>)}

    </>
  )
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    width: '80%',
    padding: 4,
    paddingLeft: 10,
    color: '#121212',
  },
});