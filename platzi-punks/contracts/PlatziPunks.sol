// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //Importamos el contrato del token con estandar Erc721
                                                          //(Tokens no fungibles)
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol"; // Libreria para contadores
import "@openzeppelin/contracts/utils/Base64.sol"; // Para convertir bytes a bytes64 para el json
import "@openzeppelin/contracts/utils/Strings.sol";
import "contracts/PlatziPunksDNA.sol";


contract PlatziPunks is ERC721, ERC721Enumerable, PlatziPunksDNA{

    using Counters for Counters.Counter; //Se usa segun la documentacion
    using Strings for uint256; // Para sobrecargar sus funcionalidades

    //Definimos el contador
    Counters.Counter private _idCounter;
    uint256 public maxSupply; //Numero de tokens maximo 
    mapping (uint256 => uint256) public tokenDNA; //Apuntará desde el tokenId al ADN

    //Creamos un constructor con los parametros del constructor del ERC721 ("TokenName", TokenSimbol)
    constructor(uint256 _maxSupply) ERC721("PlatziPunks", "PLPKS") {
        maxSupply = _maxSupply; 
    }

    //Establecer tokens a una cuenta
    function mint()public{
        uint256 current = _idCounter.current(); //Funcion que arroja el valor actual del contador 
        require(current < maxSupply, "NoPlatziPunks left :("); //el no. de platzipunks debe ser menor al numero maximo
        tokenDNA[current] = deterministicPseudoRamdomDNA(current, msg.sender); //Generamos el DNA
        _safeMint(msg.sender, current); //(to, idToken) Asigna un token a una cuenta (En este caso al sender de la transaccion)
        _idCounter.increment();
    }

    function _baseURI()internal pure override returns(string memory){ //Lugar o dominio donde esta colocado la informacion del NFT
        return "https://avataaars.io/";
    }

    //Funcion para obtener los parametros para el DNA 
    function _paramsURI(uint256 _dna) internal view returns(string memory){
        string memory params;

        {
            params = string(
                abi.encodePacked(
                    "accessoriesType=",
                    getAccesoriesType(_dna),
                    "&clotheColor=",
                    getClotheColor(_dna),
                    "&clotheType=",
                    getClotheType(_dna),
                    "&eyeType=",
                    getEyeType(_dna),
                    "&eyebrowType=",
                    getEyeBrowType(_dna),
                    "&facialHairColor=",
                    getFacialHairColor(_dna),
                    "&facialHairType=",
                    getFacialHairType(_dna),
                    "&hairColor=",
                    getHairColor(_dna),
                    "&hatColor=",
                    getHatColor(_dna),
                    "&graphicType=",
                    getGraphicType(_dna),
                    "&mouthType=",
                    getMouthType(_dna),
                    "&skinColor=",
                    getSkinColor(_dna)
                )
            );
        }

        return string(abi.encodePacked(params, "&topType=", getTopType(_dna)));
    }

    //Funcion para crear la imagen del token concatenando la base URI + los parametros URI
    function ImageByDNA(uint256 _dna) public view returns(string memory){
        string memory baseURI = _baseURI();
        string memory paramsURI = _paramsURI(_dna);

        return string(abi.encodePacked(baseURI, "?", paramsURI));
    } 


    //Consultar la metadata del token por su id
    function tokenURI(uint256 tokenId) public view override returns (string memory){
        require(_exists(tokenId), "ERC721 Metadata URI query for nonexistent token"); //Verifica que el token exista

        uint256 dna = tokenDNA[tokenId]; //Leemos el DNA del mapping segun el id del token
        string memory image = ImageByDNA(dna); //Generamos la imagen

        string memory jsonURI = Base64.encode(
            abi.encodePacked(
                '{ "name": "PlatziPunks #',
                tokenId.toString(),
                '", "description": "Platzi Punks are randomized Avataaars stored on chain to teach DApp development on Platzi", "image": "',
                image,
                '"}'
            )
        );

        return
            string(abi.encodePacked("data:application/json;base64,", jsonURI));
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}