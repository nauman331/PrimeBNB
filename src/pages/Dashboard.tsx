import LeftNav from "../pagecomponents/leftnav";
import HistoryTable from "../pagecomponents/HistoryTable";
import { Button } from "../components/ui/button";
import { MenuIcon, Copy, XIcon } from "lucide-react";
import style from "./dash.module.scss";
import { useEffect, useState } from "react";
// import PDF from "../assets/PrimeBNB.pdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "react-router-dom";
import plan1 from "../assets/plan1.webp";
import plan2 from "../assets/plan2.webp";
import plan3 from "../assets/plan3.webp";
import plan4 from "../assets/plan4.webp";
import plan5 from "../assets/plan5.webp";
import profile from "../assets/logo.webp";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // Optionnel pour
import { ClaimDivs, TakeAction } from "../web3/webConfig/setters/setters";
import Loader from "../pagecomponents/loader/loader";
import { useLocation } from "react-router-dom";
import {
  GetAvailableDivs,
  GetPlanOfUser,
  GetTotalUsers,
  GetTotalDeposits,
  GetTotalWithdrawals,
  GetTotalIncomeOfUser,
  GetUserDepositedAmount,
  GetUserWithdrawnAmount,
  GetUserDownliners,
  GetAccount,
} from "../web3/webConfig/setters/getters";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [canConnectDisplay, setCanConnectDisplay] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [availableDivs, setAvailableDivs] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState("0");
  const [totalDeposits, setTotalDeposits] = useState("0");
  const [totalWithdrawals, setTotalWithdrawals] = useState("0");
  const [totalIncome, setTotalIncome] = useState("0");
  const [depositedAmount, setDepositedAmount] = useState("0");
  const [withdrawnAmount, setWithdrawnAmount] = useState("0");
  const [downliners, setDownliners] = useState(0);
  const [referralLink, setReferralLink] = useState("");
  const [canLoad, setCanLoad] = useState(false);
  const location = useLocation();

  const handleWalletConnect = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      setCanConnectDisplay(false);
    }
  };

  const NumberFormater = (number: number) => {
    return (number / 1e18).toFixed(5);
  };

  useEffect(() => {
    const getLink = async () => {
      const mainLink = window.location.origin;
      const account = await GetAccount();
      if (mainLink && account) {
        setReferralLink(`${mainLink}/Dashboard/?ref=${account}`);
      }
    };

    const getRefFromUrl = async () => {
      // use useLocation with location as instance to get ref value

      const account = await GetAccount();
      if (!account) {
        toast.error(
          " No account found. Please connect to your wallet to get your referral link.  "
        );
      }

      const searchParams = new URLSearchParams(location.search);
      const ref = searchParams.get("ref");
      if (ref) {
        // set the address to the localStorage to get it after with         localStorage.getItem(`uplineOf/$walletAddress`)
        localStorage.setItem(`uplineOf/${account}`, ref); // set it in localStorage to get it after with

        setWalletAddress(ref);
      }
    };
    getRefFromUrl();
    getLink();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const totalUsers = NumberFormater(Number(await GetTotalUsers()));
      const totalDeposits = NumberFormater(Number(await GetTotalDeposits()));
      const totalWithdrawals = NumberFormater(
        Number(await GetTotalWithdrawals())
      );
      const totalIncome = NumberFormater(Number(await GetTotalIncomeOfUser()));
      const depositedAmount = NumberFormater(
        Number(await GetUserDepositedAmount())
      );
      const withdrawnAmount = NumberFormater(
        Number(await GetUserWithdrawnAmount())
      );
      const downliners = (Number(await GetUserDownliners()));
      console.log(
        `Total Users: ${totalUsers}, Total Deposits: ${totalDeposits}, Total Withdrawals: ${totalWithdrawals}, Total Income: ${totalIncome}, Deposited Amount: ${depositedAmount}, Withdrawn Amount: ${withdrawnAmount}, Downliners: ${downliners}`
      );
      if (totalUsers) {
        setTotalUsers(totalUsers);
      }

      if (totalDeposits) {
        setTotalDeposits(totalDeposits);
      }

      if (totalWithdrawals) {
        setTotalWithdrawals(totalWithdrawals);
      }
      if (totalIncome) {
        setTotalIncome(totalIncome);
      }

      if (depositedAmount) {
        setDepositedAmount(depositedAmount);
      }

      if (withdrawnAmount) {
        setWithdrawnAmount(withdrawnAmount);
      }

      if (downliners) {
        setDownliners(downliners);
      }
    }

    fetchData();
    handleWalletConnect();
    getEthereum();
  }, []); // Empty dependency array means this effect will only run once (on mount)
  const getEthereum = async () => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      toast.error("Please install Metamask to connect to your Ethereum wallet.");
      
      return;
    } else {
      console.log("Metamask is already installed.", ethereum);
      setCanConnectDisplay(false);
    }
  };

  const getPlans = async () => {
    try {
      setCanLoad(true); // Indicate that loading has started
      const plans = await GetPlanOfUser();

      // Check if plans are retrieved successfully
      if (!plans || plans.length === 0) {
        console.warn("No plans found for the user.");
        setCanLoad(false);
        return; // Early exit if no plans
      }

      const divs = []; // Initialize the array for available divs

      // Loop through each plan to fetch corresponding divs
      for (let i = 0; i < plans.length; i++) {
        const availableDiv = await GetAvailableDivs(i + 1);
        divs.push(availableDiv); // Store the retrieved div in the array
        console.log("Divs for plan", i, ":", availableDiv);
      }

      console.log("Plans", plans);
      setPlans(plans); // Set plans state
      setCanLoad(false); // Indicate that loading has finished

      if (divs.length > 0) {
        setAvailableDivs(divs); // Set available divs state
      }
    } catch (error) {
      console.error("Failed to get plans:", error);
      setCanLoad(false); // Ensure loading state is reset on error
    }
  };

  useEffect(() => {
    getPlans();
  }, []);
  const handleActionClick = async (index: number) => {
    try {
      setCanLoad(true);

      if (!walletAddress) {
        console.error("Please connect your wallet to proceed");
        setCanLoad(false);

        return;
      }
      const account = await GetAccount();
      if (!account) {
        console.error(
          " No account found. Please connect to your wallet to get your referral link.  "
        );
      }

      const upline =
        localStorage.getItem(`uplineOf/${account}`) ||
        "0xacbfa603659f38a50B06a5E898C379c2eDf77Df3";

      const Action = await TakeAction(index, upline);
      if (Action) {
        toast.success("Level Purchased Successfully");
        getPlans();
        setCanLoad(false);
      } else {
        setCanLoad(false);

        toast.error("Failed to Purchase Level");
      }
    } catch (error) {
      toast.error("Failed to get upline");
      setCanLoad(false);
    }
  };

  const handleWithdraw = async (index: number) => {
    try {
      setCanLoad(true);
      if (!walletAddress) {
        toast.error("Please connect your wallet to proceed");
        setCanLoad(false);
        return;
      }
      const claim = await ClaimDivs(index);
      if (claim) {
        toast.success("BNB Withdrawn Successfully 😎");
        getPlans();
        setCanLoad(false);
      } else {
        setCanLoad(false);
        toast.error("Failed to Withdraw Divs");
      }
    } catch (error) {
      toast.error("Failed to withdraw");
    }
  };

  return (
    <>
      {canLoad && <Loader />}

      <div className="z-20 w-screen fixed top-0 left-0 right-0 bg-gray-950 h-16 flex items-center justify-between px-5 border-b-2 border-b-white backdrop-filter backdrop-blur-xl bg-opacity-0">
        <Link to="/">
          <img src={profile} alt="PrimeBNB" className="h-16 w-20" />
        </Link>
        <a
          href=''
       
          className="text-white border-b-0 hover:border-b-2 border-b-white"
        >
          Docs
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="bg-yellow-400 px-4 py-1 text-white hover:bg-yellow-500"
        >
          {open ? <MenuIcon /> : <XIcon />}
        </button>
      </div>
      <LeftNav ml={open} />

      <section className="md:w-[calc(100vw-12rem)] h-full w-screen md:h-[calc(100vh-4rem)] md:ml-48 mt-16 p-5 md:block flex items-center justify-center flex-col">
        <div className="flex md:flex-row flex-col gap-1 w-full">
          <div className="p-5 mt-2 md:w-full w-[calc(100vw-3rem)] bg-gray-950 h-[14.8rem] backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
            <div className="flex items-center justify-between">
              <img
                src={profile}
                alt="Profile"
                className="h-16 w-16 rounded-full border-2 border-yellow-400"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-none">
                    {walletAddress.length > 0
                      ? ` ${walletAddress.slice(0, 7)}...`
                      : "Connect Wallet"}
                  </Button>
                </DialogTrigger>
                {canConnectDisplay && (
                  <DialogContent className="sm:max-w-[425px] bg-gray-950 text-white p-6 rounded-lg">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Connect Your Wallet
                      </DialogTitle>

                      <DialogDescription className="mt-2">
                        Select a wallet to connect. You can choose between
                        MetaMask, Trust Wallet, or TokenPocket.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div
                        className="flex items-center justify-between bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
                        onClick={() => handleWalletConnect()}
                      >
                        <span>MetaMask</span>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/480px-MetaMask_Fox.svg.png"
                          alt="MetaMask"
                          className="h-8 w-8"
                        />
                      </div>
                      <div
                        className="flex items-center justify-between bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
                        onClick={() => handleWalletConnect()}
                      >
                        <span>Trust Wallet</span>
                        <img
                          src="https://avatars.githubusercontent.com/u/32179889?s=200&v=4"
                          alt="Trust Wallet"
                          className="h-8 w-8"
                        />
                      </div>
                      <div
                        className="flex items-center justify-between bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700"
                        onClick={() => handleWalletConnect()}
                      >
                        <span>TokenPocket</span>
                        <img
                          src="https://www.yadawallets.com/wp-content/uploads/2020/11/TokenPocket-wallet-logo.png"
                          alt="TokenPocket"
                          className="h-8 w-8"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-yellow-400 hover:bg-yellow-500 text-black w-full rounded-lg py-2 mt-4"
                      >
                        Connect
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            </div>
            <p>
              Deposited Amount:{" "}
              <span className="text-yellow-400">{depositedAmount} opBNB</span>
            </p>
            <p>
              Withdrawn Amount:{" "}
              <span className="text-yellow-400">{withdrawnAmount} opBNB</span>
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  style={{ marginTop: "30px", marginBottom: "-30px" }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 rounded-none text-gray-950"
                >
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-gray-950">
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to be your downliner.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input
                      id="link"
                      readOnly
                      value={referralLink}
                      className="bg-transparent"
                    />
                  </div>
                  <Button
                    type="submit"
                   
                    className="px-3 bg-yellow-400 hover:bg-yellow-500"
                  >
                    <span className="sr-only">Copy</span>
                    <Copy
                      onClick={() => {
                        navigator.clipboard.writeText(referralLink);
                        alert("Link copied to clipboard");
                      }}
                      className="h-4 w-4"
                    />
                  </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="bg-yellow-400 hover:bg-yellow-500"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-white p-3 text-xl font-bold visible md:hidden">
            PrimeBNB <div>Investment Plans</div>
          </div>
          <div className="w-full">
            <div className="md:w-full w-[calc(100vw-3rem)] mt-2 mb-3  bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white flex gap-5">
              <LazyLoadImage
                style={{ width: "100%" }}
                effect={"blur"}
                placeholderSrc={plan1}
                src={plan1}
                alt="Plan1"
                className="h-full w-1/4"
              />
              <div className="text">
                <h1 className="text-yellow-400 text-xl font-extrabold">
                  PLAN1:
                </h1>
                <p className="text-xs">Price: 10$ of opBNB</p>
                <p className="text-xs">Daily Earning: 5%</p>
                <p className="text-xs">Per Refferal Earning: 10%</p>
                <button
                  onClick={() => handleActionClick(1)}
                  className="bg-yellow-400 w-full mt-1 text-gray-950"
                >
                  Buy Plan
                </button>
              </div>
            </div>
            <div className="flex  my-3 gap-5 md:w-full w-[calc(100vw-3rem)] bg-gray-950 h-28 mt-1 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
              <LazyLoadImage
                style={{ width: "100%" }}
                effect={"blur"}
                placeholderSrc={plan2}
                src={plan2}
                alt="Plan2"
                className="h-full w-1/4"
              />
              <div className="text">
                <h1 className="text-yellow-400 text-xl font-extrabold">
                  PLAN2:
                </h1>
                <p className="text-xs">Price: 20$ of opBNB</p>
                <p className="text-xs">Daily Earning: 5%</p>
                <p className="text-xs">Per Refferal Earning: 10%</p>
                <button
                  onClick={() => handleActionClick(2)}
                  className="bg-yellow-400 w-full mt-1 text-gray-950"
                >
                  Buy Plan
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  my-3 flex md:flex-row flex-col items-center mt-1 gap-1 -ml-2 md:ml-0">
          <div className="flex gap-5 md:w-1/3 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
            <LazyLoadImage
              style={{ width: "100%" }}
              effect={"blur"}
              placeholderSrc={plan3}
              src={plan3}
              alt="Plan3"
              className="h-full w-1/4"
            />
            <div className="text">
              <h1 className="text-yellow-400 text-xl font-extrabold">PLAN3:</h1>
              <p className="text-xs">Price: 30$ of opBNB</p>
              <p className="text-xs">Daily Earning: 5%</p>
              <p className="text-xs">Per Refferal Earning: 10%</p>
              <button
                onClick={() => handleActionClick(3)}
                className="bg-yellow-400 w-full mt-1 text-gray-950"
              >
                Buy Plan
              </button>
            </div>
          </div>
          <div className="flex  my-3 gap-5 md:flex-1 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
            <LazyLoadImage
              style={{ width: "100%" }}
              effect={"blur"}
              placeholderSrc={plan4}
              src={plan4}
              alt="Plan4"
              className="h-full w-1/4"
            />
            <div className="text">
              <h1 className="text-yellow-400 text-xl font-extrabold">PLAN4:</h1>
              <p className="text-xs">Price: 50$ of opBNB</p>
              <p className="text-xs">Daily Earning: 3%</p>
              <p className="text-xs">Per Refferal Earning: 10%</p>
              <button
                onClick={() => handleActionClick(4)}
                className="bg-yellow-400 w-full mt-1 text-gray-950"
              >
                Buy Plan
              </button>
            </div>
          </div>

          <div className="flex gap-5 md:flex-1 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
            <LazyLoadImage
              style={{ width: "100%" }}
              effect={"blur"}
              placeholderSrc={plan5}
              src={plan5}
              alt="Plan5"
              className="h-full w-1/4"
            />
            <div className="text">
              <h1 className="text-yellow-400 text-xl font-extrabold">PLAN5:</h1>
              <p className="text-xs">Price: 500$ of opBNB</p>
              <p className="text-xs">Daily Earning: 5%</p>
              <p className="text-xs">Per Refferal Earning: 10%</p>
              <button
                onClick={() => handleActionClick(5)}
                className="bg-yellow-400 w-full mt-1 text-gray-950"
              >
                Buy Plan
              </button>
            </div>
          </div>
        </div>
        <div className="w-full  my-3 flex md:flex-row flex-col items-center mt-1 gap-1 -ml-2 md:ml-0">
          <div className="p-5 my-3 flex items-center justify-evenly md:w-1/3 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
            <div className="text-lg font-bold">
              Partners
              <h1 className="text-yellow-400">+{downliners}</h1>
            </div>
            <div className="text-lg font-bold">
              Total Income
              <h1 className="text-yellow-400">+ {totalIncome} opBNB</h1>
            </div>
          </div>
          <div className="p-5 flex-1 my-3 flex items-center justify-evenly md:w-1/3 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
            <div className="text-lg font-bold">
              Total Members
              <h1 className="text-yellow-400">{totalUsers}</h1>
            </div>
            <div className="text-lg font-bold">
              Members Recieved
              <h1 className="text-yellow-400">{totalWithdrawals} opBNB</h1>
            </div>
            <div className="text-lg font-bold">
              Members Deposited
              <h1 className="text-yellow-400">{totalDeposits} opBNB</h1>
            </div>
          </div>
        </div>
        {plans.length > 0 &&
          plans.map((plan, index) => (
            <div
              style={{ display: `${plan.isActivated ? "" : "none"}` }}
              key={index}
              className={style.plansContainer}
            >
              <h2 className={style.title}>Plan Details</h2>
              <div className={style.planInfo}>
                <div className={style.infoItem}>
                  <span className={style.label}>Plan ID:</span>
                  <span className={style.value}> {Number(plan.planId)} </span>
                </div>
                <div className={style.infoItem}>
                  <span className={style.label}>Amount:</span>
                  <span className={style.value}>
                    {Number(plan.amount) / 1e18} opBNB
                  </span>
                </div>
                <div className={style.infoItem}>
                  <span className={style.label}>Starting Date:</span>
                  <span className={style.value}>
                    {new Date(
                      Number(plan.startingDate) * 1000
                    ).toLocaleString()}
                  </span>
                </div>
                <div className={style.infoItem}>
                  <span className={style.label}>Ending Date:</span>
                  <span className={style.value}>
                    {new Date(Number(plan.endingDate) * 1000).toLocaleString()}
                  </span>
                </div>

                <div className={style.availableDivs}>
                  {availableDivs &&
                    (Number(availableDivs[index]) / 1e18).toFixed(9)}{" "}
                  opBNB
                </div>
              </div>
              <button
                onClick={() => handleWithdraw(index + 1)}
                className={style.withdrawButton}
              >
                Withdraw
              </button>
            </div>
          ))}
        <HistoryTable />
      </section>
    </>
  );
};

export default Dashboard;
