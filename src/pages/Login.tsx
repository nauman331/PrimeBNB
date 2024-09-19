import { useState } from "react";
import img from "../assets/logo.webp";

const Login : React.FC = () => {
  const [username, setUsername] = useState("");
  const [uplinerID, setUplinerID] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
    } else {
      setError("");
      window.location.href = "/dashboard";
    }
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col h-screen">
        <div className="flex flex-col justify-center px-6 py-12 lg:px-8 backdrop-filter backdrop-blur-sm bg-opacity-0 border border-white">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img alt="PrimeBNB" src={img} className="mx-auto h-24 w-auto" />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Sign up to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className={`pl-3 block w-full rounded-md border-0 py-1.5 text-white bg-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      error ? "border-red-500" : ""
                    }`}
                  />
                  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="uplinerID" className="block text-sm font-medium leading-6 text-white">
                  Upliner ID
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="uplinerID"
                    value={uplinerID}
                    onChange={(e) => setUplinerID(e.target.value)}
                    required
                    placeholder="Enter Upliner ID"
                    className="pl-3 block w-full rounded-md border-0 py-1.5 text-white bg-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="mt-10 flex w-full justify-center rounded-md bg-yellow-400 hover:bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login