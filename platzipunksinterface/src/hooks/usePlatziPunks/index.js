import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import platziPunksArtifact from "../../config/web3/artifacts/platziPunks";


const usePlatziPunks = () => {
  const { active, library, chainId } = useWeb3React();

  const platziPunks = useMemo(() => {
    if (active) return new library.eth.Contract(platziPunksArtifact.abi, platziPunksArtifact.address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  return platziPunks;
};

export default usePlatziPunks;
