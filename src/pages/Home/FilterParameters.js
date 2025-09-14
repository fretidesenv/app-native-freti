import React, { useState, useEffect, useContext, useRef, Component } from 'react';
import { View, Text, Platform, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, FlatList } from 'react-native';
import { Select, CheckIcon, Radio, Checkbox, Modal, VStack, Button} from "native-base";
import { Label, Input, SelectCity, ButtonCity, InputSearch, Line, TextCity, InputKm } from './styles';
import { FilterContext } from '../../contexts/filter';


import apiState from '../../services/apiState';
import apiCity from '../../services/apiCity';

import states from '../../services/states.json'
import bodyworkList from '../../services/bodyworkList.json'
import vehicleList from '../../services/vehicleList.json'
//import vehicleListProfile from '../../services/vehicleListProfile.json' 

import Slider from '@react-native-community/slider';



export const FilterParameters = (props) => {
  const {

    filterVehicle, setFilterVehicle,
    filterBodywork, setFilterBodywork,
    filterOriginState, setFilterOriginState,
    filterOriginCity, setFilterOriginCity,
    filterDestinyState, setFilterDestinyState,
    filterDestinyCity, setFilterDestinyCity,
    citiesOrigin, setCitiesOrigin,
    citiesDestiny, setCitiesDestiny,
    filteredDataOrigin, setFilteredDataOrigin,
    filteredDataDestiny, setFilteredDataDestiny,
    position, setPosition,
    radiusPosition, setRadiusPosition


  } = useContext(FilterContext);

  const [loading, setLoading] = useState(false);

  //const [states, setStates] = useState([]);
  // const [citiesOrigin, setCitiesOrigin] = useState([]);
  // const [citiesDestiny, setCitiesDestiny] = useState([]);
  const [showModalOriginCity, setShowModalOriginCity] = useState(false);
  const [showModalDestinyCity, setShowModalDestinyCity] = useState(false)

  const [filterParameter, setFilterParameter] = useState('');

  const [searchOrigin, setSearchOrigin] = useState('');
  // const [filteredDataOrigin, setFilteredDataOrigin] = useState([]);

  const [searchDestiny, setSearchDestiny] = useState('');
  // const [filteredDataDestiny, setFilteredDataDestiny] = useState([]);
  const [masterData, setMasterData] = useState([]);

  let vehicles = [...[{ "key": 0, "label": "Todos", "value": "" }], ...vehicleList];
  let bodyworks = [...[{ "key": 0, "label": "Todos", "value": "" }], ...bodyworkList];
  const [radiusP, setRadiusP] = useState(0)


  useEffect(() => {
    let isActive = true;

    async function loadFunction() {
      try {
        if (isActive) {
          console.log('useEffect() is active')//searchStateForSelect();s
          setRadiusP(radiusPosition)
        }
      } catch (err) { }
    }

    loadFunction();
    return () => isActive = false;
  }, [])

  async function searchCityForSelect(uf, spot) {
    setLoading(true);
    try {
      const response = await apiCity.get(`/${uf}/municipios`);
      setLoading(false);
      if (spot === 'origin') {
        setCitiesOrigin(response.data);
        setFilteredDataOrigin(response.data); 
      } else if (spot === 'destiny') {
        setCitiesDestiny(response.data);
        setFilteredDataDestiny(response.data); 
      }

      // console.log(response.data)
    } catch (error) {
      console.log('ERROR: ' + error)
      setLoading(false);
    }
  }


  let statesItem = states.map((v, k) => {
    return <Select.Item key={k} value={v?.sigla} label={v.nome} />
  })


  let vehiclesItem = vehicles.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.label} />
  })

  let bodyworkItem = bodyworks.map((v, k) => {
    return <Select.Item key={k} value={k} label={v.label} />
  })


  const searchFilterOrigin = (text) => {
    if (text) {
      const newData = citiesOrigin.filter(
        function (item) {
          if (item.nome) {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          }
        });
      setFilteredDataOrigin(newData); 
      setSearchOrigin(text);
    } else {
      setFilteredDataOrigin(citiesOrigin); 
      setSearchOrigin(text);
    }
  };

  const searchFilterDestiny = (text) => {
    if (text) {
      const newData = citiesDestiny.filter(
        function (item) {
          if (item.nome) {
            const itemData = item.nome.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          }
        });
      setFilteredDataDestiny(newData); 
      setSearchDestiny(text);
    } else {
      setFilteredDataDestiny(citiesDestiny);
      setSearchDestiny(text);
    }
  };

  const handleRadius = (value) => {
    setRadiusP(value);
    setRadiusPosition(value)
    // console.log(value)
  }

  return (
    <>
      <Label>Veiculo:</Label>
      <Select
        selectedValue={null}
        minWidth='100%'
        width='100%'
        accessibilityLabel={filterVehicle !== '' ? filterVehicle : 'Qual o tipo de veículo?'}
        value={filterVehicle}
        placeholder={filterVehicle !== '' ? filterVehicle : 'Qual o tipo de veículo?'}
        _selectedItem={{
          bg: "yellow.500",
          endIcon: <CheckIcon size="5" />
        }}
        onValueChange={(itemValue) => setFilterVehicle(vehicles[itemValue].value)}
      >
        {vehiclesItem}
      </Select>

      <Label>Carroceria:</Label>
      <Select
        selectedValue={null}
        minWidth='100%'
        width='100%'
        accessibilityLabel={filterBodywork !== '' ? filterBodywork : "Qual o tipo de carroceria?"}
        value={filterBodywork}
        placeholder={filterBodywork !== '' ? filterBodywork : "Qual o tipo de carroceria?"}
        _selectedItem={{
          bg: "yellow.500",
          endIcon: <CheckIcon size="5" />,
        }}
        // onValueChange={(itemValue) => handleEditBodywork(itemValue)}
        onValueChange={(itemValue) => setFilterBodywork(bodyworks[itemValue].value,)}
      >
        {bodyworkItem}
      </Select>

      <Line />
      <Label>Definir raio de pesquisa (em quilômetros):</Label>
      {/* <InputKm
        onChangeText={(text) => setRadiusPosition(text)}
        value={null}
        placeholder={radiusPosition.toString()}
        keyboardType="numeric"
        type="number"
        placeholderTextColor="#121212"
      /> */}

        <Text style={{textAlign: 'center', color: 'rgb(162,164,163)', fontSize: 16}}>{radiusP} KM</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={10000}
        step={10}
        value={radiusP}
        onSlidingComplete={(value) => handleRadius(value)}
        // onValueChange={(value) => setRadiusP(value)}
        minimumTrackTintColor="rgb(4,52,203);"
        maximumTrackTintColor="rgb(162,164,163)"
        thumbTintColor="rgb(4,52,203)"
      />

      <Line />
      <Label>Estado de origem:</Label>
      <Select
        selectedValue={null}
        minWidth='100%'
        width='100%'
        accessibilityLabel={filterOriginState !== '' ? filterOriginState : "Qual o estado de origem?"}//"Qual o estado de origem?"//{filterVehicle !== '' ? filterVehicle : 'Qual o tipo do seu veículo?'}
        placeholder={filterOriginState !== '' ? filterOriginState : "Qual o estado de origem?"}
        _selectedItem={{
          bg: "yellow.500",
          endIcon: <CheckIcon size="5" />
        }}

        onValueChange={(itemValue) => {
          setFilterOriginState(itemValue)
          searchCityForSelect(itemValue, 'origin')
          //console.log(itemValue)
        }
        }
      >
        {statesItem}
      </Select>

      {
        filterOriginState !== '' ?
          (
            <>
              <Label>Cidade de origem:</Label>
              <SelectCity onPress={() => setShowModalOriginCity(true)}>
                <Text style={{ fontSize: 12, color: 'rgb(162,164,163)' }}>{filterOriginCity !== '' ? filterOriginCity : "Qual a cidade de origem?"}</Text>
              </SelectCity>
            </>

          ) : null
      }


      <Modal isOpen={showModalOriginCity} onClose={() => setShowModalOriginCity(false)} size="lg">
        <Modal.Content maxWidth="350" maxHeight="450">
          <Modal.CloseButton />
          <Modal.Header>
            Busque a cidade de origem pelo nome
            <InputSearch
              style={styles.textInputStyle}
              onChangeText={(text) => searchFilterOrigin(text)}
              value={searchOrigin}
              underlineColorAndroid="transparent"
              placeholder="Procure aqui"
            />
          </Modal.Header>
          <Modal.Body>

            <VStack space={3} >


              {filteredDataOrigin?.length !== 0 ?
                (
                  filteredDataOrigin?.map((item, index) => (
                    <ButtonCity key={index} onPress={() => {
                      setFilterOriginCity(item.nome)
                      setShowModalOriginCity(false)
                    }}>
                      <TextCity>
                        - {item?.nome}
                      </TextCity>
                    </ButtonCity>

                  ))
                ) : filterOriginState == '' ?
                  (
                    <TextCity>
                      Selecione um estado de origem ...
                    </TextCity>
                  ) : (
                    <TextCity>
                      Nenhuma cidade de origem  encontrada com esses parâmentros...
                    </TextCity>
                  )
              }
            </VStack>

          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* DESTINO */}
      <Line />
      <Label>Estado de destino:</Label>
      <Select
        selectedValue={null}
        minWidth='100%'
        width='100%'
        accessibilityLabel={filterDestinyState !== '' ? filterDestinyState : "Qual o estado de origem?"}//"Qual o estado de origem?"//{filterVehicle !== '' ? filterVehicle : 'Qual o tipo do seu veículo?'}
        placeholder={filterDestinyState !== '' ? filterDestinyState : "Qual o estado de origem?"}
        _selectedItem={{
          bg: "yellow.500",
          endIcon: <CheckIcon size="5" />
        }}

        onValueChange={(itemValue) => {
          setFilterDestinyState(itemValue)
          searchCityForSelect(itemValue, 'destiny')
          //console.log(itemValue)
        }
        }
      >
        {statesItem}
      </Select>

      {
        filterDestinyState !== '' ?
          (
            <>
              <Label>Cidade de destino:</Label>
              <SelectCity onPress={() => setShowModalDestinyCity(true)}>
                <Text style={{ fontSize: 12, color: 'rgb(162,164,163)' }}>{filterDestinyCity !== '' ? filterDestinyCity : "Qual a cidade de destino?"}</Text>
              </SelectCity>
            </>

          ) : null
      }


      <Modal isOpen={showModalDestinyCity} onClose={() => setShowModalDestinyCity(false)} size="lg">
        <Modal.Content maxWidth="350" maxHeight="450">
          <Modal.CloseButton />
          <Modal.Header>
            Busque a cidade de destino pelo nome

            <InputSearch
              style={styles.textInputStyle}
              onChangeText={(text) => searchFilterDestiny(text)}
              value={searchDestiny}
              underlineColorAndroid="transparent"
              placeholder="Procure aqui"

            />
          </Modal.Header>
          <Modal.Body>

            <VStack space={3} >


              {filteredDataDestiny?.length !== 0 ?
                (
                  filteredDataDestiny?.map((item, index) => (
                    <ButtonCity key={index} onPress={() => {
                      setFilterDestinyCity(item.nome)
                      setShowModalDestinyCity(false)
                    }}>
                      <TextCity>
                        - {item?.nome}
                      </TextCity>
                    </ButtonCity>

                  ))
                ) : filterOriginState == '' ?
                  (
                    <TextCity>
                      Selecione um estado de destino...
                    </TextCity>
                  ) : (
                    <TextCity>
                      Nenhuma cidade de destino encontrada com esses parâmentros...
                    </TextCity>
                  )
              }
            </VStack>

          </Modal.Body>
        </Modal.Content>
      </Modal>


      {/* 


*/}

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
  labelError: {
    alignSelf: 'flex-start',
    color: '#ff375b',
    marginBottom: 8,
  }
});