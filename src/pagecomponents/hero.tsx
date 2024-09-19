import Ripple from "../components/magicui/ripple";
import { Button } from "../components/ui/button";
import BoxReveal from "../components/magicui/box-reveal";
import IconCloud from "../components/magicui/icon-cloud";

const slugs = [
  "solana",
  "bitcoin",
  "binance",
  "metamask",
  "cardano",
  "ethereum",
  "polkadot",
  "litecoin",
  "chainlink",
  "dogecoin",
  "ripple",
  "uniswap",
  "tether",
  "stellar",
  "tron",
  "monero",
  "vechain",
  "aave",
  "compound",
  "pancakeswap",
  "kusama",
  "filecoin",
  "avalanche",
  "terra",
  "polygon",
];

const Hero = () => {
  return (
    <>
      <div className="flex md:flex-row flex-col items-center justify-center mt-14">
        <div className="flex md:px-auto px-7 mt-16 text-white flex-col items-center justify-center overflow-hidden">
          <div className="h-full w-full max-w-[32rem] items-center justify-center overflow-hidden pt-8">
            <BoxReveal boxColor={"yellow"} duration={0.5}>
              <p className="md:text-[3.5rem] text-[2rem] font-semibold">
                Prime BNB<span className="text-yellow-400">.</span>
              </p>
            </BoxReveal>

            <BoxReveal boxColor={"yellow"} duration={0.5}>
              <h2 className="mt-[.5rem] text-[1rem]">
                Best Platform for
                <span className="text-yellow-400"> BNB Investment</span>
              </h2>
            </BoxReveal>

            <BoxReveal boxColor={"yellow"} duration={0.5}>
              <div className="mt-[1.5rem]">
                <p>
                  -&gt; 20+ Owners and an De-Centralized investment project built with
                  <span className="font-semibold text-yellow-400"> Love</span>,
                  <span className="font-semibold text-yellow-400"> Loyality</span>,
                  <span className="font-semibold text-yellow-400"> Trust</span>, and
                  <span className="font-semibold text-yellow-400"> Funding</span>. <br />
                  -&gt; 100% De-Centralized, and Trusted Platform. <br />
                </p>
              </div>
            </BoxReveal>

            <BoxReveal boxColor={"yellow"} duration={0.5}>
              <Button className="mt-[1.6rem] bg-yellow-400 hover:bg-yellow-500 rounded-none cursor-pointer">
                Explore
              </Button>
            </BoxReveal>
          </div>
          <Ripple />
        </div>

        <div className="flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg bg-background px-20 pb-20 pt-8">
          <IconCloud iconSlugs={slugs} />
        </div>
      </div>
    </>
  );
};

export default Hero;
