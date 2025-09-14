import axios from 'axios';

const apiBanks = axios.create({
    baseURL: 'https://brasilapi.com.br/api/banks/v1'
});

export default apiBanks;


