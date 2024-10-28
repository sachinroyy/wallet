

import React, { useState, useRef } from "react";
import walletlogo from '../asset/wallet02.png';
import getProvider from "../utils/getProvider";
import { FaChevronDown, FaCopy, FaTimes } from 'react-icons/fa';
import { useSDK } from "@metamask/sdk-react";

// Import wallet icons
import phantomIcon from '../asset/phantom.png';
import metamaskIcon from '../asset/metamask.png';
import coinbaseIcon from '../asset/conbase.png'; // Coinbase icon

const WalletButton = () => {
  const { sdk } = useSDK();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pubKey, setPublicKey] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const phantom_provider = getProvider();
  const buttonRef = useRef(null);

  const connectMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();
      setPublicKey(accounts?.[0]);
      setActiveWallet('metamask');
      setIsModalOpen(false);
    } catch (err) {
      console.warn("Failed to connect to MetaMask", err);
    }
  };

  const handlePhantomWalletClick = async () => {
    try {
      const response = await phantom_provider.connect();
      setPublicKey(response.publicKey.toString());
      setActiveWallet('phantom');
      localStorage.setItem('isDisconnected', 'false');
      setIsModalOpen(false);
    } catch (err) {
      console.log("Error connecting to Phantom wallet", err);
    }
  };

  const handleDisconnect = async () => {
    await phantom_provider.disconnect();
    setPublicKey(null);
    setShowDetails(false);
    setActiveWallet(null);
    localStorage.setItem('isDisconnected', 'true');
  };

  const copyToClipboard = () => {
    if (pubKey) {
      navigator.clipboard.writeText(pubKey);
      alert("Address copied to clipboard!");
    }
  };

  const walletIcon = activeWallet === 'metamask' ? metamaskIcon : phantomIcon;

  return (
    <div className="flex justify-end h-screen mt-2 p-4 relative">
      {!pubKey ? (
        <button
          onClick={() => setIsModalOpen(true)}
          ref={buttonRef}
          className="text-black px-4 py-2 rounded-lg flex items-center gap-2 h-14 w-44"
        >
          <img src={walletlogo} alt="Wallet Logo" className="w-32" />
        </button>
      ) : (
        <button
          onClick={() => setShowDetails(!showDetails)}
          ref={buttonRef}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-4 h-14 w-80"
        >
          <img src={walletIcon} alt="Connected Wallet Icon" className="w-8 h-8 rounded-full" />
          <span className="truncate">{pubKey.slice(0, 6)}...{pubKey.slice(-6)}</span>
          <FaChevronDown className="ml-auto" />
        </button>
      )}

      {showDetails && (
        <div
          className="absolute bg-white shadow-lg rounded-lg p-5 w-80"
          style={{
            top: buttonRef.current?.getBoundingClientRect().bottom + 10,
            left: buttonRef.current?.getBoundingClientRect().left,
          }}
        >
          <button
            onClick={() => setShowDetails(false)}
            className="absolute top-2 right-2 text-black hover:text-red-500"
          >
            <FaTimes />
          </button>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="break-words">{pubKey}</p>
            <button onClick={copyToClipboard} className="text-black hover:text-black ml-2">
              <FaCopy />
            </button>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full py-2 bg-black text-white rounded-md hover:bg-slate-600 transition uppercase"
          >
            Disconnect
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-96 p-6 rounded-lg shadow-lg bg-black relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-100 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center text-white uppercase">
              Select Wallet
            </h2>
            <div className="space-y-4">
              <WalletOption
                name="Phantom"
                icon={phantomIcon}
                setting="Auto Confirm"
                onClick={handlePhantomWalletClick}
              />
              <WalletOption
                name="MetaMask"
                icon={metamaskIcon}
                setting="Auto Approve"
                onClick={connectMetaMask}
              />
              <WalletOption
                name="CoinBase"
                icon={coinbaseIcon} // Coinbase icon used here
                onClick={() => alert("CoinBase Wallet Coming Soon!")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WalletOption = ({ name, icon, setting, onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
  >
    <div className="flex items-center gap-2">
      {icon && <img src={icon} alt={`${name} Icon`} className="w-6 h-6" />}
      <span className="font-medium uppercase">{name}</span>
    </div>
    {setting && <span className="text-sm text-gray-500">{setting}</span>}
  </button>
);

export default WalletButton;
