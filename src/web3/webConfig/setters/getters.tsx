

import { PrimeContract } from "../contracts/prime";
import { InitWeb3 } from "../web3";


export const GetAccount = async ()=> {
    try {
      const ethereum =  window.ethereum;
      if (!ethereum) {
        console.error("No Ethereum detected. Make sure you have Metamask installed and connected.");
        return null; // Return null to indicate failure when no Ethereum detected
       }
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        return accounts[0];
        
    } catch (error : unknown) {
        console.error("Error getting account", error);
        
    }
}

export const GetPlanOfUser = async (): Promise<any> => { 
    try {
        const web3 = await InitWeb3();
        const account = await GetAccount();
        console.log("Account:", account);

        if (!web3 || !account) {
            console.error("No web3 or account found");
            return null; // Return null to indicate failure
        }

        const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);

        try {
            const plan = await contract.methods.getPlansOfUser(account).call();
            console.log("User Plan:", plan);
            return plan;
        } catch (error) {
            console.error("Error getting user plan:", error);
            return null; // Return null on error to indicate failure
        }

    } catch (error: unknown) {
        console.error("Error initializing Web3 or getting user account:", error);
        return null; // Return null on error to indicate failure
    }
};


export const GetAvailableDivs = async (index:number): Promise<any> => { 
    console.log("Getting available divs for plan index", index);
    try {
        const web3 = await InitWeb3();
        const account = await GetAccount();
        console.log("Account:", account);
        if (!web3 ||!account) {
            console.error("No web3 or account found");
            return null; // Return null to indicate failure
        }
        const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);

        try {
            const divs = await contract.methods.calculateDivs(index, account).call();
            console.log("Available Divs:", divs);
            return divs;
        } catch (error) {
            console.error("Error getting available divs:", error);
            return null; // Return null on error to indicate failure
        }
        
    } catch (error: unknown) {
        console.error("Error initializing Web3 or getting user account:", error);
        return null; // Return null on error to indicate failure
   
    }
 }





//mera kaam



// Fetch Total Users
export const GetTotalUsers = async (): Promise<any> => {
  try {
    const web3 = await InitWeb3();
    if (!web3) {
      console.error("Web3 not initialized.");
      return null;
    }

    const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);

    const totalUsers = await contract.methods.totalUsers().call();
    return totalUsers;
  } catch (error) {
    console.error("Error fetching total users", error);
    return false;
  }
};

// Fetch Total Deposits
export const GetTotalDeposits = async (): Promise<any> => {
  try {
    const web3 = await InitWeb3();
    if (!web3) { 
      console.error("Web3 not initialized.");
      return 0;
    }
    const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);

    const totalDeposits = await contract.methods.totalDeposits().call();
    console.log('total deposit ', totalDeposits)

    
    return totalDeposits;
  } catch (error) {
    console.error("Error fetching total deposits", error);
    return false;
  }
};

// Fetch Total Withdrawals
export const GetTotalWithdrawals = async (): Promise<any> => {
  try {
    const web3 = await InitWeb3();
    if (!web3) {
      console.log("Web3 not initialized.");
      return null;
    }
    const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);

    const totalWithdrawals = await contract.methods.totalWithdrawals().call();
    console.log('total withdrawals ', totalWithdrawals)
    return totalWithdrawals;
  } catch (error) {
    console.error("Error fetching total withdrawals", error);
    return null;
  }
};

// Fetch Total Income of the User
export const GetTotalIncomeOfUser = async (): Promise<any> => {
  try {
    const web3 = await InitWeb3();
    const account = await GetAccount();
    if (!account) return null;
    if (!web3) throw new Error('Web3 initialization failed');

    const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
    const totalIncome = await contract.methods.userEarnings(account).call();
    console.log('total income ', totalIncome)
    return totalIncome;
  } catch (error) {
    console.error("Error fetching total income", error);
    return null;
  }
};

// Fetch User's Deposited Amount
export const GetUserDepositedAmount = async (): Promise<any> => {
  try {
    const web3 = await InitWeb3();
    const account = await GetAccount();
    if (!account) return null;
    if (!web3) throw new Error('Web3 initialization failed');

    const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
    const depositedAmount = await contract.methods.usersDeposited(account).call();
    console.log('deposited amount ', depositedAmount)
    return depositedAmount;
  } catch (error) {
    console.error("Error fetching user's deposited amount", error);
    return null;
  }
};

// Fetch User's Withdrawn Amount
export const GetUserWithdrawnAmount = async (): Promise<any> => {
  try {
    const web3 = await InitWeb3();
    const account = await GetAccount();
    if (!account) return null;
    if (!web3) throw new Error('Web3 initialization failed');

    const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
    const withdrawnAmount = await contract.methods.userWithdraw(account).call();
    console.log("withdrawn amount ", withdrawnAmount)
    return withdrawnAmount;
  } catch (error) {
    console.error("Error fetching user's withdrawn amount", error);
    return null;
  }
};

// Fetch Total Downliners of the User
export const GetUserDownliners = async (): Promise<any> => {
    try {
      const web3 = await InitWeb3();
      if (!web3) throw new Error('Web3 initialization failed');
  
      const account = await GetAccount();
      if (!account) throw new Error('No account connected');
  
      const contract = new web3.eth.Contract(PrimeContract.abi, PrimeContract.address);
      const downliners = await contract.methods.downlineCount(account).call();
      console.log("total downliners ", downliners)
        return downliners;
      
      
    } catch (error) {
      console.error("Error fetching downliners", error);
      return [];
    }
  };

