import Hero from "../pagecomponents/hero"
import profile from "../assets/logo.webp"
import Carousel from "../pagecomponents/carousel";
import Accordion from "../pagecomponents/accordion";
import { Link } from "react-router-dom";
import Chart from "../pagecomponents/Chart";
import PDF from "../assets/PrimeBNB.pdf"

const Home: React.FC = () => {

  return (
    <>
    <div className="z-20 w-screen fixed top-0 left-0 right-0 bg-gray-950 h-16 flex items-center justify-between px-5 border-b-0 border-b-white backdrop-filter backdrop-blur-xl bg-opacity-0">
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
        <Link to='/dashboard'
          className="bg-yellow-400 px-4 py-1 text-white hover:bg-yellow-500"
        >
         LOGIN
        </Link>
      </div>
    <Hero />
  <Carousel />
 <Chart />
  <h1 className="text-center text-white md:text-[2rem] text-[1rem] my-10">Frequently asked Questions</h1>
 <Accordion />
 <div className="text-center mt-10">
  copyright @ 2024 prime bnb.
 </div>
    </>
  );
};

export default Home;
