import Web3 from "web3"; //importamos web3
import {InjectedConnector } from "@web3-react/injected-connector"; //Libreria para nuestro conector


const connector = new InjectedConnector({supportedChainIds: [5,],}); //Se conectará a la red con id 4 (rinkeby)

//Funcion que recibe como primer parámetro el provedor
const getLibrary = (provider) =>{
    return new Web3(provider);
}

export { connector, getLibrary };