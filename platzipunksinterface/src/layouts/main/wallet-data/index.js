import {
  Flex,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connector } from "../../../config/web3";
import { useCallback, useEffect, useState } from "react";
import useTruncatedAddress from "../../../hooks/useTruncatedAddress";

const WalletData = () => {
  const [balance, setBalance] = useState(0);

  //Para usar las funciones activate y las de account
  const { active, activate, deactivate, account, error, library } =
    useWeb3React();
  //Para verificar si la red a la que se conecto es o no soportada
  const isUnsupportedChain = error instanceof UnsupportedChainIdError;


  /** FUNCIONES PARA CONECTAR Y DECONECTAR ************************************************* */
  // El conector se encarga de crear la instancia de web3 (conectarnos a la red)
  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem("previouslyConnected", "true");
  }, [activate]);

  //Para desconectarnos de la red
  const disconnect = () => {
    deactivate();
    localStorage.removeItem("previouslyConnected");
  };

  //Para obtener el balanace de la cuenta
  const getBalance = useCallback(async () => {
    const toSet = await library.eth.getBalance(account);
    setBalance((toSet / 1e18).toFixed(2));
  }, [library?.eth, account]);

  //Cada vez que estemos conectados(estado activo) se obtendra el balance
  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance]);

  //Para conectarnos si no hemos cerrado sesion y solo refrescamos la pagina
  useEffect(() => {
    if (localStorage.getItem("previouslyConnected") === "true") connect();
  }, [connect]);

  const truncatedAddress = useTruncatedAddress(account);

  return (
    //Se mostraran los datos solo si el estado de la coneccion es activo
    <Flex alignItems={"center"}> 
      {active ? (
        <Tag colorScheme="green" borderRadius="full">
          <TagLabel>
            <Link to={`/punks?address=${account}`}>{truncatedAddress}</Link>
          </TagLabel>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
          
            ~{balance} Ξ
          </Badge>
          <TagCloseButton onClick={disconnect} /> 
        </Tag>
      ) : (
        <Button
          variant={"solid"}
          colorScheme={"green"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsupportedChain}
        >
          {isUnsupportedChain ? "Red no soportada" : "Conectar wallet"}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;
