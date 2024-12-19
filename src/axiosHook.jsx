
import axios from "axios";
const DATA_URL = "https://fakestoreapi.com";
const CEP_URL = "https://viacep.com.br/ws";

const axiosInstance = axios.create({
    baseURL: "",
    headers: { 'Content-Type': 'application/json' },

});




function calcFrete(region) {
    switch (region) {
        case "Norte":
            return Math.floor(Math.random() * (30 - 15 + 1) + 15);
        case "Nordeste":
            return Math.floor(Math.random() * (15 - 5 + 1) + 5);
        case "Sul":
            return Math.floor(Math.random() * (70 - 50 + 1) + 50);
        case "Sudeste":
            return Math.floor(Math.random() * (50 - 30 + 1) + 30);
        case "Centro-Oeste":
            return Math.floor(Math.random() * (50 - 30 + 1) + 30);
        default:
            return 0;
    }
}

/*
Norte: 15~ 30
Nordeste: 5 ~ 15
Sul: 50 ~ 70
Sudeste: 30 ~ 50
Centro-Oeste: 30 ~ 50
*/

const calcETD = (region) => {

    switch (region) {
        case "Norte":
            return Math.floor(Math.random() * (6 - 3 + 1) + 3);
        case "Nordeste":
            return Math.floor(Math.random() * (3 - 1 + 1) + 1);
        case "Sul":
            return Math.floor(Math.random() * (14 - 10 + 1) + 10);
        case "Sudeste":
            return Math.floor(Math.random() * (10 - 6 + 1) + 6);
        case "Centro-Oeste":
            return Math.floor(Math.random() * (10 - 6 + 1) + 6);
        default:
            return 0;
    }
    
}
/*
Norte: 3 ~ 6
Nordeste: 1 ~ 3
Sul: 10 ~ 14
Sudeste: 6 ~ 10
Centro-Oeste: 6 ~ 10
*/

const useAxios = () => {
    return axiosInstance;
}


export { useAxios, calcFrete, calcETD, DATA_URL };