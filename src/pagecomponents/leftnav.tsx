import { HomeIcon, Calculator, LayoutDashboardIcon, Book } from "lucide-react"
import { Link } from "react-router-dom"
import PDF from "../assets/PrimeBNB.pdf"
import React from "react"
interface Margin {
  ml: boolean
}


const leftnav: React.FC<Margin> = ({ml}) => {
  return (
    <>
      
      <div className={`z-10 w-48 h-screen bg-black  md:ml-0 fixed border-r-2 border-r-white ${ml ? "-ml-48" : "ml-0"} transition-all delay-100 md:backdrop-filter md:backdrop-blur-sm md:bg-opacity-0`}>
        
        <Link to="/" className="flex items-center gap-2 mt-24 text-white p-3 hover:bg-yellow-400">
        <HomeIcon />
        Homepage
        </Link>
        <Link to="/dashboard" className="flex items-center gap-2 text-white p-3 hover:bg-yellow-400">
        <LayoutDashboardIcon />
        Dashboard
        </Link>
        <Link to="/calculator" className="flex items-center gap-2 text-white p-3 hover:bg-yellow-400">
        <Calculator />
        Calculator
        </Link>
        <a href={PDF}
          download={PDF} className="flex items-center gap-2 text-white p-3 hover:bg-yellow-400">
        <Book />
        Docs
        </a>

        <div className="mt-36 border-2 border-yellow-400 py-1 px-3 m-3">
          <h1>Contact Us:</h1>
          <p className="text-[0.5rem]">Our team actively solving the problems of users</p>
        <a href="https://t.me/primebnb01" className="bg-yellow-400 hover:bg-yellow-500 px-2 mt-1 text-gray-950">Telegram</a>
        </div>

      </div>
    </>
  )
}

export default leftnav
