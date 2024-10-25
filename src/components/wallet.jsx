import React, { useState, useEffect } from "react";
import walletlogo from '../asset/short.png'; 
import getProvider from "../utils/getProvider";
import * as avatars from '@dicebear/avatars';
import * as sprite from '@dicebear/avatars-identicon-sprites';
import { FaChevronDown, FaCopy, FaTimes } from 'react-icons/fa';
import { useSDK } from "@metamask/sdk-react";

const WalletButton = () => {

  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connectMetaMask = async () => {
    try {
      const accounts = await sdk?.connect();
      setPublicKey(accounts?.[0]);
      setIsModalOpen(false);
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pubKey, setPublicKey] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const phantom_provider = getProvider();

  useEffect(() => {
    const isDisconnected = localStorage.getItem('isDisconnected') === 'true';

    if (!isDisconnected) {
      phantom_provider.connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => {
          setPublicKey(publicKey.toString());
          fetchRecentTransactions(publicKey.toString());
        })
        .catch((err) => console.log("Eager connection failed", err));
    }

    phantom_provider.on('accountChanged', async (publicKey) => {
      if (publicKey) {
        setPublicKey(publicKey.toString());
        fetchRecentTransactions(publicKey.toString());
      } else {
        await phantom_provider.connect().catch((error) =>
          console.log("Attempted to reconnect but failed.")
        );
        setPublicKey(phantom_provider.publicKey.toString());
      }
    });

    return () => {
      phantom_provider.removeAllListeners('accountChanged');
    };
  }, [phantom_provider]);

  const fetchRecentTransactions = async (walletAddress) => {
    const mockTransactions = [
      { id: 1, type: 'Send', amount: '0.5 SOL', date: '2024-10-20' },
      { id: 2, type: 'Receive', amount: '1.2 SOL', date: '2024-10-18' },
      { id: 3, type: 'Swap', amount: '0.8 SOL', date: '2024-10-15' },
    ];
    setTransactions(mockTransactions);
  };

  const handlePhantomWalletClick = async () => {
    try {
      const response = await phantom_provider.connect();
      setPublicKey(response.publicKey.toString());
      localStorage.setItem('isDisconnected', 'false');
      setIsModalOpen(false);
    } catch (err) {
      console.log("Error connecting Phantom wallet", err);
    }
  };

  const handleDisconnect = async () => {
    await phantom_provider.disconnect();
    // await provider.disconnect(); 
    setPublicKey(null);
    setShowDetails(false);
    localStorage.setItem('isDisconnected', 'true');
  };

  const copyToClipboard = () => {
    if (pubKey) {
      navigator.clipboard.writeText(pubKey);
      alert("Address copied to clipboard!");
    }
  };

  const avatarUrl = pubKey
    ? avatars.createAvatar(sprite, { seed: pubKey, dataUri: true })
    : '';

  return (
    <div className="flex justify-end h-screen mt-2 p-4">
      {!pubKey ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-black px-4 py-2 rounded-lg flex items-center gap-2 h-14 w-44"
        >
          <img src={walletlogo} alt="Wallet Logo" className="w-32" />
        </button>
      ) : (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 h-14 "
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <img src={avatarUrl} alt="Wallet Avatar" className="w-8 h-8 rounded-full" />
            <span className="truncate">{pubKey.slice(0, 6)}...{pubKey.slice(-6)}</span>
          </div>
          <FaChevronDown className="ml-auto" />
        </button>
      )}

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-15 flex items-center justify-center">
          <div className="text-black p-5 rounded-lg  bg-white shadow-lg w-96 relative">
            {/* Close Button to hide wallet details */}
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-2 right-2 text-black hover:text-red-500"
            >
              <FaTimes />
            </button>
            {/* <h2 className="text-lg font-semibold mb-4 text-center uppercase bg-black rounded-lg p-2 text-white">
         
            </h2> */}

            {/* Wallet Address Card */}
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="">
                <p className="break-words">{pubKey}</p>
                <button onClick={copyToClipboard} className="text-black hover:text-black">
                  <FaCopy />
                </button>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-slate- transition uppercase hover:bg-slate-600"
            >
              Disconnect
            </button>

            <h3 className="mt-6 mb-2 text-center font-medium uppercase rounded-lg p-2  text-white bg-slate-700 ">
              Recent Transactions
            </h3>
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex justify-between p-2 bg-black rounded-lg uppercase text-white"
                >
                  <span>{tx.type}</span>
                  <span>{tx.amount}</span>
                  <span className="text-sm text-white">{tx.date}</span>
                </li>
              ))}
            </ul>
          </div>
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
                setting="Auto Confirm"
                onClick={handlePhantomWalletClick}
              />
              <WalletOption name="Metamask" setting="Auto Approve" onClick={connectMetaMask}/>
              <WalletOption name="coinBase" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WalletOption = ({ name, setting, onClick }) => (
  <button
    onClick={onClick}
    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
  >
    <span className="font-medium uppercase">{name}</span>
    {setting && <span className="text-sm text-gray-500">{setting}</span>}
  </button>
);

export default WalletButton;
