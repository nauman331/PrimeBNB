import Web3 from "web3";

const BSC_RPC_URLS: string[] = [
  "https://opbnb-mainnet-rpc.bnbchain.org",
];

const getAvailableProvider = async (rpcUrls: string[]): Promise<Web3> => {
  for (const url of rpcUrls) {
    try {
      const web3Instance = new Web3(
        new Web3.providers.HttpProvider(url,) // Timeout of 10 seconds
      );

      const isListening = await web3Instance.eth.net.isListening();
      if (isListening) {
        console.log(`Connected to BSC node: ${url}`);
        return web3Instance;
      }
    } catch (error) {
      console.log(`Failed to connect to BSC node: ${url}`, error);
    }
  }

  throw new Error("All BSC RPC nodes are unavailable");
};

export const InitWeb3 = async (): Promise<Web3 | undefined> => {
  let web3: Web3 | undefined;

  try {
    console.log("Initializing Web3...");
    web3 = await getAvailableProvider(BSC_RPC_URLS);
    console.log("Web3 initialized successfully", web3);
    return web3;
  } catch (error) {
    console.error("Failed to initialize Web3:", error);
  }

  return undefined;
};