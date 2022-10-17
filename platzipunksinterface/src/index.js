import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter} from "react-router-dom"; //Para las rutas
import { ChakraProvider } from "@chakra-ui/react"; //Para la ui
import { Web3ReactProvider } from "@web3-react/core"; //Para conectarnos al proveedor web3 de react
import { getLibrary } from './config/web3'; //importamos getLibrary definida en la carpeta especificada

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <ChakraProvider>
          <Web3ReactProvider getLibrary={getLibrary}> 
            <App>
            </App>
          </Web3ReactProvider>
      </ChakraProvider>
    </HashRouter>
  </React.StrictMode>
);

