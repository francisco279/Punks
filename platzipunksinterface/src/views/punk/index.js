import {
    Stack,
    Heading,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    Tag,
    useToast,
  } from "@chakra-ui/react";
import { useWeb3React }       from "@web3-react/core";
import RequestAccess          from "../../components/request-access";
import PunkCard               from "../../components/punk-card";
import { usePlatziPunkData }  from "../../hooks/usePlatziPunksData";
import { useParams }          from "react-router-dom"; //Para el paso de parámetros
import Loading                from "../../components/loading";
import { useState } from "react";
import usePlatziPunks from "../../hooks/usePlatziPunks";

  
const Punk = () => {
    const { active, account, library }  = useWeb3React();
    const { tokenId}                    = useParams();
    const { loading, punk, update }     = usePlatziPunkData(tokenId); //Traemos las variables loading y punk
    const toast                         = useToast(); //Para mostrar mensajes
    const [transfering, setTransfering] = useState(false);  //Variable de estado en false para ver si se esta o no transfiriendo un token
    const platziPunks                   = usePlatziPunks(); //Instanciamos el contrato de platziPunks

    const transfer = () => {
      setTransfering(true);
  
      const address = prompt("Ingresa la dirección: "); //Para que el usuario ingrese la direccion destino del token
  
      const isAddress = library.utils.isAddress(address); //Verifica que la dirección sea valida (utilidad de web3)
  
      if (!isAddress) { //En caso de que la dirección sea invalida
        toast({
          title: "Dirección inválida",
          description: "La dirección no es una dirección de Ethereum",
          status: "error",
        });
        setTransfering(false);
      } else { //Si la dirección es válida
        platziPunks.methods
          .safeTransferFrom(punk.owner, address, punk.tokenId) //Se transfiere el token
          .send({
            from: account,
          })
          .on("error", () => {
            setTransfering(false);
          })
          .on("transactionHash", (txHash) => {
            toast({
              title: "Transacción enviada",
              description: txHash,
              status: "info",
            });
          })
          .on("receipt", () => {
            setTransfering(false);
            toast({
              title: "Transacción confirmada",
              description: `El punk ahora pertenece a ${address}`,
              status: "success",
            });
            update();
          });
      }
    };
  
    if (!active) return <RequestAccess />;

    if (loading) return <Loading />
  
   
  
    return (
      <Stack
        spacing={{ base: 8, md: 10 }}
        py={{ base: 5 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stack>
          <PunkCard
            mx={{
              base: "auto",
              md: 0,
            }}
            name={punk.name}
            image={punk.image}
          />
          <Button 
            onClick={transfer} //Se llama a la función transfer al hacer clic en el button
            disabled={account !== punk.owner} //Se desactiva el boton si no es el dueño del token 
            colorScheme="green"
            isLoading={transfering} //Boton de carga cuando se este transfiriendo un token
            >
          
            {account !== punk.owner ? "No eres el dueño" : "Transferir"}
            
          </Button>
        </Stack>
        <Stack width="100%" spacing={5}>
          <Heading>{punk.name}</Heading>
          <Text fontSize="xl">{punk.description}</Text>
          <Text fontWeight={600}>
            DNA:
            <Tag ml={2} colorScheme="green">
              {punk.dna}
            </Tag>
          </Text>
          <Text fontWeight={600}>
            Owner:
            <Tag ml={2} colorScheme="green">
              {punk.owner}
            </Tag>
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>Atributo</Th>
                <Th>Valor</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(punk.attributes).map(([key, value]) => (
                <Tr key={key}>
                  <Td>{key}</Td>
                  <Td>
                    <Tag>{value}</Tag>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      </Stack>
    );
  };
  
export default Punk;
  