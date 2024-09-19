import LeftNav from "../pagecomponents/leftnav"
import HistoryTable from "../pagecomponents/HistoryTable"
import { Button } from "../components/ui/button"
import { MenuIcon, Copy, XIcon } from "lucide-react"
import { useState } from "react"
import PDF from "../assets/PrimeBNB.pdf"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Link } from "react-router-dom"
import plan1 from "../assets/plan1.webp"
import plan2 from "../assets/plan2.webp"
import plan3 from "../assets/plan3.webp"
import plan4 from "../assets/plan4.webp"
import plan5 from "../assets/plan5.webp"
import profile from "../assets/logo.webp"
import Chart from "../pagecomponents/Chart"
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "react-lazy-load-image-component/src/effects/blur.css"; // Optionnel pour
const Dashboard: React.FC = () => {


const [open, setOpen] = useState<boolean>(true)
const [canConnectDisplay, setCanConnectDisplay] = useState(true)
const [walletAddress, setWalletAddress] = useState("")

 const handleWalletConnect = async () => {
   if (window.ethereum) { 
     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
     setWalletAddress(accounts[0]);
     setCanConnectDisplay(false);
   }

  }
  return (
    <>
      <div className="z-20 w-screen fixed top-0 left-0 right-0 bg-gray-950 h-16 flex items-center justify-between px-5 border-b-2 border-b-white backdrop-filter backdrop-blur-xl bg-opacity-0">
        <Link to="/">
          <img src={profile} alt="PrimeBNB" className="h-16 w-20" />
        </Link>
        <a
         href={PDF}
         download={PDF}
          className="text-white border-b-0 hover:border-b-2 border-b-white"
        >
          Docs
        </a>
        <button
          onClick={()=> setOpen(!open)}
          className="bg-yellow-400 px-4 py-1 text-white hover:bg-yellow-500"
        >
          {
            open ? <MenuIcon /> : <XIcon />
          }
        </button>
      </div>
      <LeftNav ml={open}/>


      <section className="md:w-[calc(100vw-12rem)] h-full w-screen md:h-[calc(100vh-4rem)] md:ml-48 mt-16 p-5 md:block flex items-center justify-center flex-col">
        <div className="flex md:flex-row flex-col gap-1 w-full">
        <div className="p-5 md:w-full w-[calc(100vw-3rem)] bg-gray-950 h-56 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
        <div className="flex items-center justify-between">
  <img
    src={profile}
    alt="Profile"
    className="h-16 w-16 rounded-full border-2 border-yellow-400"
  />
  <Dialog>
    <DialogTrigger asChild>
      <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-none">
     { walletAddress.length > 0 ? ` ${walletAddress.slice(0, 7)}...`  :  "Connect Wallet"}
      </Button>
    </DialogTrigger>
   {  canConnectDisplay &&( 
    <DialogContent className="sm:max-w-[425px] bg-gray-950 text-white p-6 rounded-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Connect Your Wallet</DialogTitle>
        <DialogDescription className="mt-2">
          Select a wallet to connect. You can choose between MetaMask, Trust Wallet, or TokenPocket.
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
    </DialogContent>)}
  </Dialog>
</div>

<p className="my-5">Invite your friends through your refferal link and get extra benefits</p>
         <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 rounded-none">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-950">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://prime-bnb.vercel.app"
              readOnly
              className="bg-transparent"
            />
          </div>
          <Button type="submit" size="sm" className="px-3 bg-yellow-400 hover:bg-yellow-500">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" className="bg-yellow-400 hover:bg-yellow-500">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </div>

        <div className="text-white p-3 text-xl font-bold">
           PrimeBNB <div>Investment Plans</div>
        </div>
        <div className="w-full">
        <div className="md:w-full w-[calc(100vw-3rem)] mt-2 mb-3  bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white flex gap-5">
          <LazyLoadImage style={{width: '100%'}} effect={'blur'} placeholderSrc={plan1} src={plan1} alt="Plan1"className="h-full w-1/4" />
          <div className="text">
          <h1 className="text-yellow-400 text-xl font-extrabold">PLAN1:</h1>
          <p className="text-xs">Price: 0.01 BNB</p>
          <p className="text-xs">Daily Earning: 3%</p>
          <p className="text-xs">Per Refferal Earning: 10%</p>
          <button className="bg-yellow-400 w-full mt-1">Buy Plan</button>
          </div>
        </div>
        <div className="flex  my-3 gap-5 md:w-full w-[calc(100vw-3rem)] bg-gray-950 h-28 mt-1 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
        <LazyLoadImage  style={{width: '100%'}} effect={'blur'} placeholderSrc={plan2} src={plan2} alt="Plan2"className="h-full w-1/4" />
        <div className="text">
          <h1 className="text-yellow-400 text-xl font-extrabold">PLAN2:</h1>
          <p className="text-xs">Price: 0.05 BNB</p>
          <p className="text-xs">Daily Earning: 3%</p>
          <p className="text-xs">Per Refferal Earning: 10%</p>
          <button className="bg-yellow-400 w-full mt-1">Buy Plan</button>
          </div>
        </div>
        </div>
        </div>
        <div className="w-full  my-3 flex md:flex-row flex-col items-center mt-1 gap-1 -ml-2 md:ml-0">
        <div className="flex gap-5 md:w-1/3 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
        <LazyLoadImage style={{width: '100%'}}  effect={'blur'} placeholderSrc={plan3} src={plan3} alt="Plan3"className="h-full w-1/4" />
        <div className="text">
          <h1 className="text-yellow-400 text-xl font-extrabold">PLAN3:</h1>
          <p className="text-xs">Price: 0.1 BNB</p>
          <p className="text-xs">Daily Earning: 3%</p>
          <p className="text-xs">Per Refferal Earning: 10%</p>
          <button className="bg-yellow-400 w-full mt-1">Buy Plan</button>
          </div>
         
        </div>
        <div className="flex  my-3 gap-5 md:flex-1 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
        <LazyLoadImage style={{width: '100%'}}  effect={'blur'} placeholderSrc={plan4} src={plan4} alt="Plan4"className="h-full w-1/4" />
        <div className="text">
          <h1 className="text-yellow-400 text-xl font-extrabold">PLAN4:</h1>
          <p className="text-xs">Price: 0.15 BNB</p>
          <p className="text-xs">Daily Earning: 3%</p>
          <p className="text-xs">Per Refferal Earning: 10%</p>
          <button className="bg-yellow-400 w-full mt-1">Buy Plan</button>
          </div>
        </div>
        </div>
        <div className="w-full  my-3 flex md:flex-row flex-col items-center mt-1 gap-1 -ml-2 md:ml-0">
        <div className="flex gap-5 md:flex-1 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
        <LazyLoadImage  style={{width: '100%'}} effect={'blur'} placeholderSrc={plan5} src={plan5} alt="Plan5"className="h-full w-1/4" />
        <div className="text">
          <h1 className="text-yellow-400 text-xl font-extrabold">PLAN5:</h1>
          <p className="text-xs">Price: 0.2 BNB</p>
          <p className="text-xs">Daily Earning: 3%</p>
          <p className="text-xs">Per Refferal Earning: 10%</p>
          <button className="bg-yellow-400 w-full mt-1">Buy Plan</button>
          </div>
        </div>
        <div className="p-5  my-3 flex items-center justify-center flex-col md:w-1/3 w-[calc(100vw-3rem)] bg-gray-950 h-28 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
        <h1 className="text-xs">Earned Plan Amount :  <span className="text-yellow-400">1.8 BNB</span></h1>
        <h1 className="text-xs">Earned Refferal Amount :  <span className="text-yellow-400">3.3 BNB</span></h1>
        <h1 className="text-xs">Earned Total Amount :  <span className="text-yellow-400">5.1 BNB</span></h1>
        <button className="bg-yellow-400 px-5 py-1 mt-2">Withdraw Amount</button>
        </div>
        </div>
        <Chart />
        <HistoryTable />
      </section>
    
   </>
  )
}

export default Dashboard
