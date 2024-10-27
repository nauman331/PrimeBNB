import  { useState } from 'react';
import { Link } from "react-router-dom"
import LeftNav from '../pagecomponents/leftnav';
import { MenuIcon, XIcon } from "lucide-react"
import profile from "../assets/logo.webp"
import PDF from "../assets/prime-bnb.pdf"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Input } from "../components/ui/input"

const Calculator: React.FC = () => {
    const [referrals, setReferrals] = useState<number>(0);
    const [amount, setAmount] = useState(0.004);
    const [result, setResult] = useState<number | null>(null);
    const [open, setOpen] = useState<boolean>(true);

    const calculate = () => {
      const total = referrals * (amount * 10/100);
      setResult(total);
    };

    return (
        <>
            <div className="z-20 w-screen fixed top-0 left-0 right-0 bg-gray-950 h-16 flex items-center justify-between px-5 border-b-2 border-b-white backdrop-filter backdrop-blur-sm bg-opacity-0">
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
                    onClick={() => setOpen(!open)}
                    className="bg-yellow-400 px-4 py-1 text-white hover:bg-yellow-500"
                >
                    {open ? <MenuIcon /> : <XIcon />}
                </button>
            </div>
            <LeftNav ml={open} />

            <section className="md:w-[calc(100vw-12rem)] h-screen w-screen md:h-[calc(100vh-4rem)] md:ml-48 mt-16 p-5 flex items-center justify-center flex-col">
                <div className="gap-7 w-full h-full p-5 flex items-center flex-col backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
                    <h1 className='my-10'>Referral Calculator</h1>
                    <div>
                        <label>
                            Total Referrals:
                            <Input
                                type="number"
                                placeholder="Total number of Referrals"
                                value={referrals}
                                onChange={(e) => setReferrals(Number(e.target.value))}
                                className='md:w-96 w-64 rounded-none bg-gray-950'
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Select Plan:
                            <Select value={amount.toString()} onValueChange={(value) => setAmount(Number(value))}>
                                <SelectTrigger className="md:w-96 w-64 rounded-none bg-gray-950">
                                    <SelectValue placeholder="Select a Plan"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup className='bg-gray-950 text-white'>
                                        <SelectLabel>Plans</SelectLabel>
                                        <SelectItem value="0.004">Plan 1</SelectItem>
                                        <SelectItem value="0.008">Plan 2</SelectItem>
                                        <SelectItem value="0.0118">Plan 3</SelectItem>
                                        <SelectItem value="0.0196">Plan 4</SelectItem>
                                        <SelectItem value="0.196">Plan 5</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </label>
                    </div>
                    <button onClick={calculate} className='bg-yellow-400 hover:bg-yellow-500 py-3 md:w-96 w-64'>Calculate</button>
                    {result !== null && <h2>Result: {result} <span className='text-yellow-400'>opBNB</span></h2>}
                </div>
            </section>
        </>
    );
};

export default Calculator;
