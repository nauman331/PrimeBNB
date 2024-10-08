import { PrimeContract } from "../contracts/prime";
import { InitWeb3 } from "../web3";
import { GetAccount, GetAvailableDivs } from "./getters";
export const BuyAPlan = async (index: number): Promise<boolean> => {
    console.log("Buying plan", index);
    try {
        const web3 = await InitWeb3();
        if (!web3) {
            console.error("Web3 not initialized.");
            return false;
        }

        const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
        const account = await GetAccount();
        if (!account) {
            console.error("No account found.");
            return false;
        }

        // Get the price for the selected plan
        const price = await contract.methods.levelPrices(index).call();
        console.log({ account, planIndex: index, value: price });

        if (price === undefined || price === null ) {
            console.error("Invalid plan index or price.");
            return false;
        }

        const actionTx = contract.methods.deposit(index).encodeABI();

        // Estimate gas limit
        let estimatedGas;
        try {
            estimatedGas = await web3.eth.estimateGas({
                from: account,
                to: PrimeContract.address,
                value: web3.utils.toHex(price), // Convert price to hex for transaction
                data: actionTx,
            });
        } catch (error) {
            console.error("Failed to estimate gas:", error);
            return false;
        }

        const gasLimit = Math.floor(Number(estimatedGas) * 1.3);
        console.log("Estimated gas:", estimatedGas);
        console.log("Adjusted gas limit:", gasLimit);

        const txData = {
            from: account,
            to: PrimeContract.address,
            value: web3.utils.toHex(price), // Convert price to hex if it's in wei
            gas: web3.utils.toHex(gasLimit), // Set the adjusted gas limit
            data: actionTx,
        };

        // Send the transaction
        try {
            
            const ethereum = window.ethereum;
            if (!ethereum) {
                console.error("No Ethereum browser detected.");
                return false;
            }
            const tx = await ethereum.request({
                method: "eth_sendTransaction",
                params: [txData],
            });
            console.log("Transaction sent successfully:", tx);
            return true;
        } catch (txError) {
            console.error("Transaction failed:", txError);
            return false;
        }

    } catch (error: unknown) {
        console.error("Error occurred while buying a plan:", error);
        return false;
    }
};

export const TakeAction = async (index: number, sponsor: string): Promise<boolean> => {
    try {
        const web3 = await InitWeb3();
        if (!web3) {
            console.error("Web3 not initialized.");
            return false;
        }
        
        const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
        
        if (!index || !sponsor) {
            console.error("Invalid plan index or sponsor address.");
            return false;
        }

        const account = await GetAccount();
        if (!account) {
            console.error("No account found.");
            return false;
        }

        if (!contract) {
            console.error("Contract not found.");
            return false;
        }

        const isRegistered = await contract.methods.isRegistered(account).call();
        console.warn(isRegistered ? "User is already registered" : "User is not registered");
        if (!isRegistered) {
            const regTx = contract.methods.register(sponsor).encodeABI();
    let regEstimatedGas
            try {
                
       
             regEstimatedGas = await web3.eth.estimateGas({
                from: account,
                to: PrimeContract.address,
                value: "0",
                data: regTx,
            });
        } catch (error) {
            console.error("Failed to estimate gas for registration:", error);
            return false;
                
        }
            const regGasLimit = Math.floor(Number(regEstimatedGas) * 1.3);
            console.log("Estimated gas for registration:", regEstimatedGas);
            console.log("Adjusted gas limit for registration:", regGasLimit);

            const regTxData = {
                from: account,
                to: PrimeContract.address,
                value: "0",
                gas: web3.utils.toHex(regGasLimit), // Set the adjusted gas limit
                data: regTx,
            };

            try {
                const ethereum = window.ethereum;
                if (!ethereum) {
                    console.error("No Ethereum browser detected.");
                    return false;
                }
                const registration = await ethereum.request({
                    method: "eth_sendTransaction",
                    params: [regTxData],
                });

                if (!registration) {
                    console.error("Registration transaction failed.");
                    return false;
                }
                console.log("Registration successful:", registration);
            } catch (regError) {
                console.error("Registration failed:", regError);
                return false;
            }
        }

        // Proceed to buy the plan after registration
        const purchaseSuccess = await BuyAPlan(index);
        return purchaseSuccess;

    } catch (error: unknown) {
        console.error("Error occurred while taking action:", error);
        return false;
    }
};


export const ClaimDivs = async (index: number): Promise<boolean> => { 
    console.log("Claiming divs for index:", index);

    try {
        const web3 = await InitWeb3();
        if (!web3) {
            console.error("Web3 not initialized.");
            return false;
        }

        const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
        if (!index) {
            console.error("Invalid plan index.");
            return false;
        }

        const account = await GetAccount();
        if (!account) {
            console.error("No account found.");
            return false;
        }

        const divs = await GetAvailableDivs(index);
        if (!divs || divs.length === 0) {
            console.error("No divs available.");
            return false;
        }

        const claimTx = contract.methods.claimDivs(index).encodeABI();
        
        // Estimate gas limit
        let claimEstimatedGas;
        try {
            claimEstimatedGas = await web3.eth.estimateGas({
                from: account,
                to: PrimeContract.address,
                value: "0",
                data: claimTx,
            });
        } catch (error) {
            console.error("Failed to estimate gas for claiming divs:", error);
            return false;
        }

        const claimGasLimit = Math.floor(Number(claimEstimatedGas) * 1.3);
        console.log("Estimated gas for claiming divs:", claimEstimatedGas);
        console.log("Adjusted gas limit for claiming divs:", claimGasLimit);

        const claimTxData = {
            from: account,
            to: PrimeContract.address,
            value: "0",
            gas: web3.utils.toHex(claimGasLimit), // Set the adjusted gas limit
            data: claimTx,
        };

        // Send the transaction
        try {
            const ethereum = window.ethereum;
            if (!ethereum) {
                console.error("No Ethereum browser detected.");
                return false;
            }
            const claim = await ethereum.request({
                method: "eth_sendTransaction",
                params: [claimTxData],
            });
            console.log("Divs claiming successful:", claim);
            return true;
        } catch (claimError) {
            console.error("Divs claiming transaction failed:", claimError);
            return false;
        }

    } catch (error: unknown) {
        console.error("Error occurred while claiming divs:", error);
        return false;
    }
};
