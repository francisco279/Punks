
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()  //Para agregar la url de la red rinkeby y la llave privada de la cuenta ethereum

//Creamos constantes con el id del nodo de infura y la llave privada de la cuenta firmadora
const projectId  = process.env.INFURA_PROJECT_ID
const privateKey = process.env.DEPLOYER_SIGNER_PRIVATE_KEY


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    //Los contratos se desplegaran en la red de goerli
    goerli: {
      url: projectId,//url del nodo de infura en la red goerli
      //Especificamos la cuenta que va firmar la transaccion de despliegue del contrato 
      accounts: [
        privateKey //Llave privada de la cuenta que desplegara el contrato en goerli
      ]
    }
  }
};
