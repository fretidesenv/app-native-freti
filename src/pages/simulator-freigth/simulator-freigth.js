import React, { useState } from 'react';
import styled from 'styled-components/native';
import Header from "../../components/Header";
import CurrencyInput from 'react-native-currency-input';
import axios from 'axios';
import firestore from '@react-native-firebase/firestore';
import { Button, Card, Title, Paragraph, Text } from 'react-native-paper';
import { View, StatusBar, FlatList, StyleSheet  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon, List, ScrollView, Select } from 'native-base';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from 'react-native';

const Input = styled.TextInput`
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #fff;
`;

const LargeInput = styled(CurrencyInput)`
  flex: 2;
  margin-right: 10px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
`;

const SmallInput = styled(Input)`
  flex: 1;
`;


export default function SimulatorFreigth() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoValue, setCargoValue] = useState('');
  const [totalKm, setTotalKm] = useState('');
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [totalKmValue, setTotalKmValue] = useState(0);

  const [anttCCD, setAnttCCD] = useState(0);
  const [anttCC, setAnttCC] = useState(0);
  const [icms, setIcms] = useState(0);
  const [margemDriver, setMargemDriver] = useState(0.10);
  const [txAdiantamento, setTxAdiantamento] = useState(0.10);
  const [txAdministracao, setTxAdministracao] = useState(0.05);


  const [totalSugerido, setTotalSugerido] = useState(0);
  const [sugestValue, setSugestValue] = useState(0);
  const [totalAVista, setTotalAVista] = useState(0);
  const [totalAPrazo, setTotalAPrazo] = useState(0);
  const [totalSeguro, setTotalSeguro] = useState(0);
  const [totalImpostos, setTotalImpostos] = useState(0);
  const [totalTxAdministracao, setTotalTxAdministracao] = useState(0);
  const [totalTxAdiantamento, setTotalTxAdiantamento] = useState(0);

  const [stateOrigin, setStateOrigin] = useState('');
  const [stateDestination, setStateDestination] = useState('');


  const [selectedEixo, setSelectedEixo] = useState('Selecione um eixo');

  const GOOGLE_MAPS_API_KEY = "AIzaSyAds1TwGzvflRvD8KHrbRHrnF3DvATFM1k"; 

  const calculateFreight = () => {

    console.log("Iniciando calculo")

    var vlSeguro = (parseFloat(cargoValue) * 0.3 / 100);

    var totalVlKm = (totalKmValue / 1000);

    var divisor2 = (1 - margemDriver);
    
    var recebeAVista = ((totalVlKm * anttCCD) + anttCC) / divisor2; 

    setTotalAVista(parseFloat(recebeAVista))

    var divisor3 = (1 - icms - txAdiantamento - txAdministracao);
    const valorSugerido = (recebeAVista + vlSeguro) / divisor3;

    console.log(valorSugerido)

    setTotalSugerido(parseFloat(valorSugerido))
    
    var impostos = parseFloat(valorSugerido) * icms;
    var txAdm = valorSugerido * txAdministracao;
    var txAdt = valorSugerido * txAdiantamento; //Retirar a porcentagem 10% do valor sugerido
    
    setTotalSeguro(vlSeguro)
    setTotalImpostos(impostos)
    setTotalTxAdministracao(txAdm)
    setTotalTxAdiantamento(txAdt)


    var aPrazo = recebeAVista + txAdt
    setTotalAPrazo(aPrazo)

  };


  const calculateFreightValueSugest = () => {


    if(isEditingPrice) {
      
      var impostos = sugestValue * icms;
      
      var vlSeguro = (parseFloat(cargoValue) * 0.3 / 100);
  
      var recebeAprazo = sugestValue * (1- icms - txAdministracao) - vlSeguro;
      setTotalAPrazo(recebeAprazo)

      var recebeAVista =  sugestValue * (1 - icms - txAdministracao - txAdiantamento) - vlSeguro;

      setTotalAVista(recebeAVista)
  
      setTotalSeguro(vlSeguro)
  
      setTotalImpostos(impostos)
  
      var txAdm = sugestValue * txAdministracao;
      var txAdt = sugestValue * txAdiantamento; 
      
      setTotalTxAdministracao(txAdm)
      setTotalTxAdiantamento(txAdt)
  
      
      setTotalSugerido(sugestValue)
      
    }
    
    setIsEditingPrice(!isEditingPrice);
  }; 


  const calcularDistancia = async (originAddress, destinationAddress) => {

    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        originAddress
      )}&destinations=${encodeURIComponent(
        destinationAddress
      )}&key=${GOOGLE_MAPS_API_KEY}&language=pt-BR&units=metric`;

      const response = await axios.get(url);
      const data = response.data;

      if (data.rows[0].elements[0].status === "OK") {

        const distanciaTexto = data.rows[0].elements[0].distance.text; 
        const distanciaValue = data.rows[0].elements[0].distance.value; 
        setTotalKm(distanciaTexto);
        setTotalKmValue(distanciaValue)



        const originAddress = response.data.origin_addresses[0];
        const destinationAddress = response.data.destination_addresses[0];

        var estadoOrigem = await getStateFromAddress(originAddress);
        
        var estadoDestino = await getStateFromAddress(destinationAddress);

        setStateOrigin(estadoOrigem.short_name)
        setStateDestination(estadoDestino.short_name)

        await findICMS(estadoOrigem.short_name, estadoDestino.short_name);

      } else {
        console.log("Erro ao calcular distância.");
      }
    } catch (error) {
      console.error("Erro ao buscar a distância:", error);
      console.log("Erro ao buscar distância.");
    }
  };


  const findICMS = async (estadoOrigem, estadoDestino) => {
    
    firestore()
    .collection('PriceTableIcms')
    .where('origem', '==', estadoOrigem) 
    .get().then(async (snapshot) => {

      snapshot.docs.forEach((item) => {
        const data = item.data();
        const icmsValue = data[estadoDestino];
        console.log(icmsValue)
        setIcms(parseFloat(icmsValue))

      }) 
    })
  } 

//------------- exemplo --------------------

    // Função para extrair o estado via Geocoding API
    async function getStateFromAddress(address) {
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address,
            key: GOOGLE_MAPS_API_KEY,
          },
        });

        const result = response.data.results[0];
        const state = result.address_components.find((component) =>
          component.types.includes('administrative_area_level_1')    
        );
        
        return state;

      } catch (error) {
        console.error('Erro ao chamar o Geocoding API:', error.message);
      }
    }


    const formatNumberBR = (value) => {

    const numericValue = Number(value) || 0;

      return new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(Number(numericValue));
    };


    const handlePriceTable = (value) => {
      setSelectedEixo(value)
      firestore()
        .collection('priceTableAnnt')
        .where("tipo", "==", "Carga Geral")
          .get()
            .then(snapshot => {
              snapshot.docs.forEach(item => {
                const data = item.data();

                setAnttCCD(data[`ccd${value}`]);
                setAnttCC(data[`cc${value}`]);
              });
          })
      .catch(error => console.error("Erro ao buscar dados:", error));

    }


    const insets = useSafeAreaInsets();
  
    const fetchSuggestionsOrigin = async (text) => {
      if (text.length < 2) {
        setSuggestionsOrigin([]);
        return;
      }

      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: {
            input: text,
            key: GOOGLE_MAPS_API_KEY, // Substitua pela sua chave da API do Google Places
          },
        });

        setSuggestionsOrigin(response.data.predictions);
      } catch (error) {
        console.error(error);
      }
    };


    const fetchSuggestionsDestination = async (text) => {

      if (text.length < 2) {
        setSuggestionsOrigin([]);
        return;
      }
  
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
          params: {
            input: text,
            key: GOOGLE_MAPS_API_KEY, // Substitua pela sua chave da API do Google Places
          },
        });


        // console.log(response.data.predictions)
  
        setSuggestionsDestinatio(response.data.predictions);


      } catch (error) {
        console.error(error);
      }
    };


    const [suggestionsOrigin, setSuggestionsOrigin] = useState([]);
    const [suggestionsDestinatio, setSuggestionsDestinatio] = useState([]);

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
      },
      input: {
        marginBottom: 10,
      },
      suggestionsList: {
        maxHeight: 200, // Limita a altura da lista de sugestões
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 10,
        maxHeight: 200, 
        // backgroundColor: 'white' 
      },
    });
 

    const setDestinationHaddle = (value) => {
      console.log("Pegando valor do destino")
      console.log(value)
      setDestination(value);
      setSuggestionsDestinatio([]);

      if (origin && destination) {
        calcularDistancia(origin, value); 
      }
    }


  return (

    <>
        <Header namePage="Minhas Finanças" />
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            <View style={{flex: 1, padding: 15, paddingBottom: insets.bottom, justifyContent: 'center' }}>

              <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

              <Title style={{ textAlign: 'center', marginBottom: 8 }}>
                Simulador de Frete ANTT
              </Title>


              {/* <TextInput
                label="Digite um endereço"
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  fetchSuggestions(text);
                }}
                style={styles.input}
              /> */}

            <Input 
              placeholder="Origem"  
              style={{ color: "#000" }} 
              placeholderTextColor="#000" 
              value={origin} 
              onChangeText={(text) => {
                setOrigin(text);
                fetchSuggestionsOrigin(text);
              }} />


            {/* Exibe as sugestões de autocompletar */}
            {suggestionsOrigin.length > 0 && (
                <View style={styles.suggestionsList}>
                  {suggestionsOrigin.map((item) => ( 
                    <TouchableOpacity 
                      key={item.place_id}
                      style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd', backgroundColor: 'white' }}
                      onPress={() => {
                        setOrigin(item.description);
                        setSuggestionsOrigin([]); 
                      }}
                    >
                      <Text style={{ color: 'black' }}>{item.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {/* <Input 
              placeholder="Origem" 
              style={{ color: "#000" }} 
              placeholderTextColor="#000" 
              value={origin} 
              onChangeText={setOrigin} /> */}

              {/* <Input
                style={{ color: "#000" }}
                placeholder="Destino"
                placeholderTextColor="#000" 
                value={destination}
                onChangeText={setDestination}
                onBlur={calcularDistancia}
              /> */}

            {/* Input para destino autocomplete */}
            <Input 
              placeholder="Destino"  
              style={{ color: "#000" }} 
              placeholderTextColor="#000" 
              value={destination} 
              onChangeText={(text) => {
                setDestination(text);
                fetchSuggestionsDestination(text);
              }} 
              />

              {/* Exibe as sugestões de autocompletar */}

              {suggestionsDestinatio.length > 0 && (
                <View style={styles.suggestionsList}>
                  {suggestionsDestinatio.map((item) => ( 
                    <TouchableOpacity 
                      key={item.place_id}
                      style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd', backgroundColor: 'white' }}
                      onPress={()=>setDestinationHaddle(item.description)}
                    >
                      <Text style={{ color: 'black' }}>{item.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )} 
              {/* {suggestionsDestinatio.length > 0 && ( 
                <FlatList
                  data={suggestionsDestinatio}
                  keyExtractor={(item) => item.place_id}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                  
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ddd', backgroundColor: 'white' }}
                        onPress={() => {
                          setDestination(item.description);
                          setSuggestionsDestinatio([]);
                        }}
                      >
                        <Text style={{ color: 'black' }}>{item.description}</Text>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                />
              )} */}

              

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <LargeInput
                  placeholder="Valor da Carga (R$)"
                  placeholderTextColor="#000" 
                  style={{ color: "#000" }}
                  value={cargoValue}
                  onChangeValue={setCargoValue}
                  prefix="R$ "
                  delimiter="."
                  decimalSeparator=","
                  precision={2}
                />

                <SmallInput
                  style={{ color: "#000" }}
                  placeholder="Km Total"
                  placeholderTextColor="#000" 
                  value={totalKm}
                  onChangeText={setTotalKm}
                  keyboardType="numeric"
                />
              
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}> 
                <Select
                    selectedValue={selectedEixo}
                    minWidth="200"
                    accessibilityLabel="Selecione um eixo"
                    placeholder="Selecione um eixo"
                    _placeholder={{ color: "#000", fontWeight: "bold" }}
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size="5" />,
                      _text: { color: "black", fontWeight: "bold" },
                    }}
                    onValueChange={handlePriceTable}
                    bg="white" // Fundo branco
                    borderRadius="10px" // Bordas arredondadas
                    borderColor="gray.300" // Borda cinza clara
                    shadow={2} // Pequena sombra para destaque
                    p="3" // Padding interno
                    size="10"
                >
                  <Select.Item label="2 Eixos" value="2" />
                  <Select.Item label="3 Eixos" value="3" />
                  <Select.Item label="4 Eixos" value="4" />
                  <Select.Item label="5 Eixos" value="5" />
                  <Select.Item label="6 Eixos" value="6" />
                  <Select.Item label="7 Eixos" value="7" />
                  <Select.Item label="8 Eixos" value="8" />
                  <Select.Item label="9 Eixos" value="9" />
                </Select>
              </View> 

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                {isEditingPrice ? (
                  <LargeInput
                    placeholder="Valor da proposta"
                    style={{ color: "#000" }}
                    value={sugestValue}
                    onChangeValue={setSugestValue}
                    prefix="R$ "
                    delimiter="."
                    decimalSeparator=","
                    precision={2}
                  />
                ) : (
                  <Paragraph style={{ fontSize: 16, fontWeight: 'bold' }}>
                    Preço: R$ {formatNumberBR(totalSugerido ? totalSugerido : 0)}
                  </Paragraph>
                )}
               
                <Button mode="contained" 
                    style={{backgroundColor: "rgb(1,36,67)"}}  
                    onPress={calculateFreightValueSugest}> 
                  <MaterialCommunityIcons name={isEditingPrice ? 'calculator' : 'brush'} color="#fff" size={30} />
                </Button>
              </View>

              <Button mode="contained" onPress={calculateFreight} style={{ marginBottom: 16, backgroundColor: "#012443" }}>
                Calcular Frete
              </Button>

              {/* Rodapé com Cards */}
              {[
                { label: 'Total à cobrar do cliente', value: totalSugerido, destaque: true },
                { label: 'Você recebe à vista', value: totalAVista, destaque: true },
                { label: 'Você recebe a prazo', value: totalAPrazo, destaque: true },
                { label: 'Seguro', value: totalSeguro, destaque: false },
                { label: 'Impostos', value: totalImpostos, destaque: false },
                { label: 'Taxa Administração', value: totalTxAdministracao, destaque: false },
                { label: 'Taxa Adiantamento', value: totalTxAdiantamento, destaque: false }
              ].map((item, index) => (
                <Card key={index} style={{ padding: 10, marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Paragraph style={{ fontSize: item.destaque ? 17 : 12, fontWeight: item.destaque ? 'bold' : 'normal', color: item.destaque ? 'rgb(1,36,67)' : '#000' }}>
                      {item.label}
                    </Paragraph>
                    <Paragraph style={{ fontSize: item.destaque ? 17 : 12, fontWeight: item.destaque ? 'bold' : 'normal', color: item.destaque ? 'rgb(1,36,67)bel' : '#000' }}>
                      R$ {formatNumberBR(item.value)}
                    </Paragraph>
                  </View>
                </Card>
              ))}

            </View>
        </ScrollView>
    </>



  );

  
}