import axios from 'axios';

const apiState = axios.create({
    baseURL: 'https://brasilapi.com.br/api/ibge/uf/v1'
});

export default apiState;