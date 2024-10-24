import React, { useState, useEffect } from "react";
import walletlogo from '../asset/short.png';
import getProvider from "../utils/getProvider";

const WalletButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [addressClicked, setAddressClicked] = useState(false);
  const [pubKey, setPublicKey] = useState();

  const provider = getProvider();

  useEffect(() => {
    const isDisconnected = localStorage.getItem('isDisconnected') === 'true';

    if (!isDisconnected) {
      provider.connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => {
          console.log(publicKey.toString());
          setPublicKey(publicKey.toString());
        })
        .catch((err) => {
          console.log("Eager connection failed", err);
        });
    }

    provider.on('accountChanged', async (publicKey) => {
      if (publicKey) {
        console.log(`Switched to account ${publicKey.toBase58()}`);
        setPublicKey(publicKey.toString());
      } else {
        await provider.connect().catch((error) => {
          console.log("Didn't show changed account so we will try to reconnect");
        });

        setPublicKey(provider.publicKey.toString());
      }
    });

    return () => {
      provider.removeAllListeners('accountChanged');
    };
  }, [provider]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleAddressModal = () => setAddressClicked(!addressClicked);
  const handleLoginLogout = () => setIsLoggedIn(!isLoggedIn);
  const handleWalletClick = (walletName) => setSelectedWallet(walletName);

  const handlePhantomWalletClick = async () => {
    try {
      const response = await provider.connect();
      console.log(response.publicKey.toString());
      setPublicKey(response.publicKey.toString());
      provider.on("connect", () => console.log("connected!"));
      setIsModalOpen(!isModalOpen);
      localStorage.setItem('isDisconnected', 'false');
    } catch (err) {
      console.log("error in connecting phantom wallet", err);
    }
  }

  async function handleDisconnect() {
    await provider.disconnect();
    console.log("Phantom wallet disconnected");
    setPublicKey(null);
    localStorage.setItem('isDisconnected', 'true');
    provider.on("disconnect", () => {
      console.log("disconnected!");
    });
    setAddressClicked(false); // Close the address modal
  }

  const closeWalletPopup = () => setSelectedWallet(null);

  return (
    <div className="flex justify-end h-screen uppercase mt-2 p-4 ">
      {!pubKey ?
        <button
          onClick={toggleModal}
          className="text-black px-4 py-2 rounded-lg transition uppercase h-14 w-44 flex items-center justify-center gap-2"
        >
          {isLoggedIn ? "Open Wallet" : " "}
          <img src={walletlogo} alt="Wallet Logo" className="w-32 " />
        </button>
        :
        <button
          onClick={toggleAddressModal}
          className="text-black px-4 py-2 rounded-lg transition uppercase h-14 w-44 flex items-center justify-center gap-2"
        >
          {pubKey}
        </button>
      }

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-96 p-6 rounded-lg shadow-lg relative bg-slate-600">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center bg-slate-600 rounded-lg">
              Select Wallet
            </h2>
            <div className="space-y-4">
              <WalletOption
                name="Phantom"
                setting="Auto Confirm"
                onClick={() => {handlePhantomWalletClick()}}
              />
              <WalletOption
                name="Solflare"
                setting="Auto Approve"
                onClick={handleWalletClick}
              />
              <WalletOption
                name="Ethereum Wallet"
                onClick={handleWalletClick}
              />
            </div>
            <div className="border-t my-4"></div>
            <h3 className="text-lg font-medium flex justify-center mb-4 uppercase text-white rounded-lg">
              Sign In Options
            </h3>
            <div className="space-y-2">
              <SignInOption name="Google" onClick={handleWalletClick} />
              <SignInOption name="Apple" onClick={handleWalletClick} />
              <SignInOption name="Torus" onClick={handleWalletClick} />
            </div>
            <button
              onClick={handleLoginLogout}
              className={`mt-6 w-full py-2 rounded-md ${isLoggedIn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
                } text-white transition`}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}

      {selectedWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-80 p-5 rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-bold mb-4 text-center">
              Connect to {selectedWallet}
            </h2>
            <button
              onClick={closeWalletPopup}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Connect
            </button>
            <button
              onClick={closeWalletPopup}
              className="mt-2 w-full py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {addressClicked && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-80 p-5 rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-bold mb-4 text-center">
              Wallet Address
            </h2>
            <p className="mb-4">{pubKey}</p>
            <button
              onClick={handleDisconnect}
              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
            <button
              onClick={toggleAddressModal}
              className="mt-2 w-full py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const WalletOption = ({ name, setting, onClick }) => (
  <button
    onClick={() => onClick(name)}
    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
  >
    <span className="font-medium uppercase">{name}</span>
    {setting && <span className="text-sm text-gray-500">{setting}</span>}
  </button>
);

const SignInOption = ({ name, onClick }) => (
  <button
    onClick={() => onClick(name)}
    className="w-full py-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 flex justify-center items-center transition"
  >
    <span className="font-medium">Sign in with {name}</span>
  </button>
);

export default WalletButton;
