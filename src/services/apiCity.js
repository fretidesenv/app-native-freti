import axios from 'axios';

const apiCity = axios.create({
 //   baseURL: 'https://brasilapi.com.br/api/ibge/municipios/v1/'
baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/'
});

export default apiCity;