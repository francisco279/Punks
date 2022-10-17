import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
}                       from "@chakra-ui/react";
import { Link }   from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import usePlatziPunks   from "../../hooks/usePlatziPunks";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const [isMinting, setIsMinting] = useState(false); //Variable (bandera) para el minting del NFT 
  const [imageSrc, setImageSrc]   = useState(""); //Establecemos una variable de estado para la imagen del punk
  const { active, account }       = useWeb3React();
  const platziPunks               = usePlatziPunks();
  const toast                     = useToast(); //Para generar mensajes en la interfaz

  //Se va aprevisualizar si el contrato esta desplegado y hay una cuenta 
  const getPlatziPunskData = useCallback(async () => {
    if(platziPunks){ //Si existe el contrato 
      const totalSupply = await platziPunks.methods.totalSupply().call(); //LLamamos la funcion para mostrar el total de tokens disponibles
      const dnaPreview  = await platziPunks.methods.deterministicPseudoRamdomDNA(totalSupply, account).call(); //Creamos el dna con el id y la cuenta del minter
      const image       = await platziPunks.methods.ImageByDNA(dnaPreview).call(); //Creamos la imagen del punk
      setImageSrc(image); //Establecemos la imagen an la variable de estado
    }
  }, [platziPunks, account]); //Dependerá de que el contrato este desplegado en la red y la cuenta

  //Un efecto que dependerá de la funcion getPlatziPunkData
  useEffect ( () => {
    getPlatziPunskData(); //Llamamos la funcion
  },[getPlatziPunskData]);

  //Funcion para asignar los tokens a una cuenta 
  const mint = () =>{
    setIsMinting(true);
    //en el send se pone toda la configuracion de la transaccion
    //.send porque se modificara el estado del contrato, on para escuchar distintos eventos
    platziPunks.methods.mint()
    .send({
      from: account,
    })
    .on("transactionHash", (txHash) => {
      toast({
        title:        "Transacción enviada",
        description:  txHash,
        status:       "info",
      })
    }) 
    .on("receipt", () => {
      setIsMinting(false);
      toast({
        title:        "Transacción confirmada",
        description:  "Nunca pares de aprender",
        status:       "success",
      })
    })
    .on("error", (error) => {
      setIsMinting(false);
      toast({
        title:        "Transacción fallida",
        description:  error.message,
        status:       "error",
      })
    })
    
  }

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "green.400",
              zIndex: -1,
            }}
          >
            Un Platzi Punk
          </Text>
          <br />
          <Text as={"span"} color={"green.400"}>
            nunca para de aprender
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          Platzi Punks es una colección de Avatares randomizados cuya metadata
          es almacenada on-chain. Poseen características únicas y sólo hay 10000
          en existencia.
        </Text>
        <Text color={"green.500"}>
          Cada Platzi Punk se genera de forma secuencial basado en tu address,
          usa el previsualizador para averiguar cuál sería tu Platzi Punk si
          minteas en este momento
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
            disabled={!platziPunks}
            onClick={mint}
            isLoading={isMinting} //Estara cargando cuando isMinting sea true
          >
            Obtén tu punk
          </Button>
          <Link to="/punks">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galería
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        
        <Image src= {active ? imageSrc : "https://avataaars.io/"} />
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  1
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getPlatziPunskData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;
