import { useState, useEffect } from "react";
import Web3 from "web3";

// Définition de l'interface pour typer l'état Web3
interface Web3State {
  web3: Web3 | null;
  isConnected: boolean;
  error: string | null;
}

const useWeb3 = () => {
  const rpcUrl = 'https://bsc-dataseed.binance.org/'; // RPC URL de la Binance Smart Chain
  const [web3State, setWeb3State] = useState<Web3State>({
    web3: null,
    isConnected: false,
    error: null,
  });

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

        const isListening = await web3.eth.net.isListening();
        if (isListening) {
          setWeb3State({
            web3,
            isConnected: true,
            error: null,
          });
        } else {
          throw new Error("Cannot connect to the BSC node");
        }
      } catch (error: unknown) {
        let errorMessage: string;
        if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = "Unknown error occurred";
        }

        setWeb3State({
          web3: null,
          isConnected: false,
          error: errorMessage,
        });
      }
    };

    initWeb3();
  }, [rpcUrl]);

  return web3State;
};

export default useWeb3;
