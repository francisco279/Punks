import { useCallback, useEffect, useState } from "react";
import usePlatziPunks                       from "../usePlatziPunks";

//Funcion para conseguir los datos de los punks
const getPunkData = async ({ platziPunks, tokenId }) => {
  const 
  [ //Todas las propiedades del token 
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    platziPunks.methods.tokenURI(tokenId).call(),
    platziPunks.methods.tokenDNA(tokenId).call(),
    platziPunks.methods.ownerOf(tokenId).call(),
    platziPunks.methods.getAccesoriesType(tokenId).call(),
    platziPunks.methods.getClotheColor(tokenId).call(),
    platziPunks.methods.getClotheType(tokenId).call(),
    platziPunks.methods.getEyeType(tokenId).call(),
    platziPunks.methods.getEyeBrowType(tokenId).call(),
    platziPunks.methods.getFacialHairColor(tokenId).call(),
    platziPunks.methods.getFacialHairType(tokenId).call(),
    platziPunks.methods.getHairColor(tokenId).call(),
    platziPunks.methods.getHatColor(tokenId).call(),
    platziPunks.methods.getGraphicType(tokenId).call(),
    platziPunks.methods.getMouthType(tokenId).call(),
    platziPunks.methods.getSkinColor(tokenId).call(),
    platziPunks.methods.getTopType(tokenId).call(),
  ]);

  //Traemos los metadatos del JSON 
  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Plural (Muestra todos los tokens de todas las cuentas)
const usePlatziPunksData = () => {
  const [punks, setPunks]     = useState([]); //constante para almacenar los punks en un aray 
  const [loading, setLoading] = useState(true); //Para mostrar o no la carga 
  const platziPunks           = usePlatziPunks(); // Instanciando el contrato platzipunks

  const update = useCallback(async () => {
    //Se ejecuta solo si esta instanciado el contrato de platzipunk 
    if (platziPunks) {
      setLoading(true);

      let tokenIds; //variable para almacenar el id de los tokens 

      const totalSupply = await platziPunks.methods.totalSupply().call(); //Llamamos el total de tokens mintiados
      tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index); //Creamos un  uevo array con los id de los tokens

      //Creamos un array de promis a la funcion getPunkData mediante el id del token 
      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, platziPunks })
      );

      //El promise anterior se resolverá de la siguiente manera
      const punks = await Promise.all(punksPromise);
      console.log(punks);

      //establecemos los punks a la variable de setpunks
      setPunks(punks);
      setLoading(false);
    }
  }, [platziPunks]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punks,
    update,
  };
};

// Singular (Para buscar datos de un solo punk)
//La variable tokenId por defecto será null
const usePlatziPunkData = (tokenId = null) => {
  const [punk,    setPunk]    = useState({}); //Definimos la variable punk como un objeto vacio por defecto
  const [loading, setLoading] = useState(true); //Variable para mostrar el spinner de carga
  const platziPunks           = usePlatziPunks(); //Instanciamos el contrato de platzipunks

  const update = useCallback( async() => {
    if(platziPunks && tokenId != null) //Si el contrato esta instanciado y el token id es distinto de null
    {
      setLoading(true);
      const toSet = await getPunkData( {tokenId, platziPunks}); //ejecutamos la funcion getPunkData con el ID
      setPunk(toSet); //Establecemos el objeto punk a la variable punk
      setLoading(false);
    }

  }, [platziPunks, tokenId]);

  useEffect ( () => {
    update();
  }, [update]);

  return{
    loading,
    punk,
    update,
  }

};

export { usePlatziPunksData, usePlatziPunkData };
