import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PDF from "../assets/PrimeBNB.pdf"
import profile from "../assets/logo.webp"

interface Time {
    days: string,
    hours: string,
    minutes: string,
    seconds: string,
}

const Timer: React.FC = () => {
  const [countDownTime, setCountDownTime] = useState<Time>({
    days: "05",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const navigate = useNavigate();

  const getTimeDifference = (countDownDate: number, intervalId: NodeJS.Timeout) => {
    const currentTime = new Date().getTime();
    const timeDifference = countDownDate - currentTime;

    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000)) >= 10
      ? Math.floor(timeDifference / (24 * 60 * 60 * 1000)).toString()
      : `0${Math.floor(timeDifference / (24 * 60 * 60 * 1000))}`;

    const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)) >= 10
      ? Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)).toString()
      : `0${Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60))}`;

    const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (1000 * 60)) >= 10
      ? Math.floor((timeDifference % (60 * 60 * 1000)) / (1000 * 60)).toString()
      : `0${Math.floor((timeDifference % (60 * 60 * 1000)) / (1000 * 60))}`;

    const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000) >= 10
      ? Math.floor((timeDifference % (60 * 1000)) / 1000).toString()
      : `0${Math.floor((timeDifference % (60 * 1000)) / 1000)}`;

    if (timeDifference < 0) {
      setCountDownTime({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      });
      clearInterval(intervalId);
      navigate('/login'); // Navigate to login page when timer ends
    } else {
      setCountDownTime({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
    }
  };

  const startCountDown = useCallback(() => {
    const customDate = new Date();
    const countDownDate = new Date(
      customDate.getFullYear(),
      customDate.getMonth(),
      customDate.getDate() + 5, // Start from 5 days
      customDate.getHours(),
      customDate.getMinutes(),
      customDate.getSeconds()
    ).getTime();

    const intervalId = setInterval(() => {
      getTimeDifference(countDownDate, intervalId);
    }, 1000);

    return intervalId; // Return the intervalId to be used in cleanup
  }, []);

  useEffect(() => {
    const intervalId = startCountDown();
    return () => clearInterval(intervalId);
  }, [startCountDown]);

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
        <Link to='/timer'
          className="bg-yellow-400 px-4 py-1 text-white hover:bg-yellow-500"
        >
         LOGIN
        </Link>
      </div>
    
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="mx-3 sm:p-10 p-4 rounded-md flex justify-center flex-col gap-6 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
        <div className="flex flex-col gap-2">
          <h1 className="text-center sm:text-3xl text-xl font-semibold leading-8 text-[#FBFAF8]">
            Buckle up your wallets
          </h1>
          <span className="text-sm font-semibold text-center leading-8 text-[#959AAE]">
            Be a part of Legendary Project, Ready your team before launching
          </span>
        </div>
        <div className="flex justify-between sm:px-4">
          <div className="flex flex-col justify-center items-center gap-3">
            <span className="py-3 px-3 flex justify-center items-center bg-[#88BDBC] text-[#112D32] text-3xl font-semibold rounded-md">
              {countDownTime?.days}
            </span>
            <span className="text-sm text-[#FBFAF8] font-bold">
              {parseInt(countDownTime?.days) === 1 ? "Day" : "Days"}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <span className="py-3 px-3 bg-[#88BDBC] text-[#112D32] text-3xl font-semibold rounded-md">
              {countDownTime?.hours}
            </span>
            <span className="text-sm text-[#FBFAF8] font-bold">
              {parseInt(countDownTime?.hours) === 1 ? "Hour" : "Hours"}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <span className="py-3 px-3 bg-[#88BDBC] text-[#112D32] text-3xl font-semibold rounded-md">
              {countDownTime?.minutes}
            </span>
            <span className="text-sm text-[#FBFAF8] font-bold">
              {parseInt(countDownTime?.minutes) === 1 ? "Minute" : "Minutes"}
            </span>
          </div>
          <div className="flex flex-col justify-center items-center gap-3">
            <span className="py-3 px-3 bg-[#88BDBC] text-[#112D32] text-3xl font-semibold rounded-md">
              {countDownTime?.seconds}
            </span>
            <span className="text-sm text-[#FBFAF8] font-bold">
              {parseInt(countDownTime?.seconds) === 1 ? "Second" : "Seconds"}
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Timer;
