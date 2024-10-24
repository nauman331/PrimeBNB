import { PrimeContract } from "../contracts/prime";
import { InitWeb3 } from "../web3";
import { GetAccount, GetAvailableDivs } from "./getters";
import toast from "react-hot-toast";

export const BuyAPlan = async (index: number): Promise<boolean> => {
    console.log("Buying plan", index);
    try {
        const web3 = await InitWeb3();
        if (!web3) {
            toast.error("Web3 not initialized.");
            return false;
        }

        const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
        const account = await GetAccount();
        if (!account) {
            toast.error("No account found.");
            return false;
        }

        // Get the price for the selected plan
        const price = await contract.methods.levelPrices(index).call();
        console.log({ account, planIndex: index, value: price });

        if (price === undefined || price === null ) {
            toast.error("Invalid plan index or price.");
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
            toast.error("Failed to estimate gas");
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
                toast.error("No Ethereum browser detected.");
                return false;
            }
            const tx = await ethereum.request({
                method: "eth_sendTransaction",
                params: [txData],
            });
            toast.success(`Transaction sent successfully: ${tx}`);
            return true;
        } catch (txError) {
            toast.error("Transaction failed");
            return false;
        }

    } catch (error: unknown) {
        toast.error("Error occurred while buying a plan");
        return false;
    }
};

export const TakeAction = async (index: number, sponsor: string): Promise<boolean> => {
    try {
        const web3 = await InitWeb3();
        if (!web3) {
            toast.error("Web3 not initialized.");
            return false;
        }
        
        const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
        
        if (!index || !sponsor) {
            toast.error("Invalid plan index or sponsor address.");
            return false;
        }

        const account = await GetAccount();
        if (!account) {
            toast.error("No account found.");
            return false;
        }

        if (!contract) {
            toast.error("Contract not found.");
            return false;
        }

        const isRegistered = await contract.methods.isRegistered(account).call();
        toast(isRegistered ? "User is already registered" : "User is not registered");
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
            toast.error("Failed to estimate gas for registration");
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
                    toast.error("No Ethereum browser detected.");
                    return false;
                }
                const registration = await ethereum.request({
                    method: "eth_sendTransaction",
                    params: [regTxData],
                });

                if (!registration) {
                    toast.error("Registration transaction failed.");
                    return false;
                }
                toast.success("Registration successful");
            } catch (regError) {
                toast.error("Registration failed");
                return false;
            }
        }

        // Proceed to buy the plan after registration
        const purchaseSuccess = await BuyAPlan(index);
        return purchaseSuccess;

    } catch (error: unknown) {
        toast.error("Error occurred while taking action:");
        return false;
    }
};


export const ClaimDivs = async (index: number): Promise<boolean> => { 
    console.log("Claiming divs for index:", index);

    try {
        const web3 = await InitWeb3();
        if (!web3) {
            toast.error("Web3 not initialized.");
            return false;
        }

        const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
        if (!index) {
            toast.error("Invalid plan index.");
            return false;
        }

        const account = await GetAccount();
        if (!account) {
            toast.error("No account found.");
            return false;
        }

        const divs = await GetAvailableDivs(index);
        if (!divs || divs.length === 0) {
            toast.error("No divs available.");
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
            toast.error("Failed to estimate gas for claiming divs");
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
                toast.error("No Ethereum browser detected.");
                return false;
            }
            const claim = await ethereum.request({
                method: "eth_sendTransaction",
                params: [claimTxData],
            });
            toast.success(`Divs claiming successful: ${claim}`);
            return true;
        } catch (claimError) {
            toast.error("Divs claiming transaction failed");
            return false;
        }

    } catch (error: unknown) {
        toast.error("Error occurred while claiming divs");
        return false;
    }
};
