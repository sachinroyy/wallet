
// import React, { useState, useEffect } from "react";
// import walletlogo from '../asset/short.png'; 
// import getProvider from "../utils/getProvider";
// import { FaChevronDown, FaCopy, FaTimes } from 'react-icons/fa';
// import { useSDK } from "@metamask/sdk-react";

// // Import uploaded images
// import phantomIcon from '../asset/phantom.png';  
// import metamaskIcon from '../asset/metamask.png'; 

// const WalletButton = () => {
//   const { sdk, connected, connecting, provider, chainId } = useSDK();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [pubKey, setPublicKey] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [activeWallet, setActiveWallet] = useState(null); // Track which wallet is connected
//   const phantom_provider = getProvider();

//   const connectMetaMask = async () => {
//     try {
//       const accounts = await sdk?.connect();
//       setPublicKey(accounts?.[0]);
//       setActiveWallet('metamask'); // Set active wallet to MetaMask
//       setIsModalOpen(false);
//     } catch (err) {
//       console.warn("Failed to connect to MetaMask", err);
//     }
//   };

//   const handlePhantomWalletClick = async () => {
//     try {
//       const response = await phantom_provider.connect();
//       setPublicKey(response.publicKey.toString());
//       setActiveWallet('phantom'); // Set active wallet to Phantom
//       localStorage.setItem('isDisconnected', 'false');
//       setIsModalOpen(false);
//     } catch (err) {
//       console.log("Error connecting to Phantom wallet", err);
//     }
//   };

//   const handleDisconnect = async () => {
//     await phantom_provider.disconnect();
//     setPublicKey(null);
//     setShowDetails(false);
//     setActiveWallet(null); // Clear the active wallet
//     localStorage.setItem('isDisconnected', 'true');
//   };

//   const copyToClipboard = () => {
//     if (pubKey) {
//       navigator.clipboard.writeText(pubKey);
//       alert("Address copied to clipboard!");
//     }
//   };

//   // Determine the appropriate icon based on the connected wallet
//   const walletIcon = activeWallet === 'metamask' ? metamaskIcon : phantomIcon;

//   return (
//     <div className="flex justify-end h-screen mt-2 p-4">
//       {!pubKey ? (
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="text-black px-4 py-2 rounded-lg flex items-center gap-2 h-14 w-44"
//         >
//           <img src={walletlogo} alt="Wallet Logo" className="w-32" />
//         </button>
//       ) : (
//         <button
//           onClick={() => setShowDetails(!showDetails)}
//           className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 h-14"
//         >
//           <img src={walletIcon} alt="Connected Wallet Icon" className="w-8 h-8 rounded-full" />
//           <span className="truncate">{pubKey.slice(0, 6)}...{pubKey.slice(-6)}</span>
//           <FaChevronDown className="ml-auto" />
//         </button>
//       )}

//       {showDetails && (
//         <div className="fixed inset-0 bg-black bg-opacity-15 flex items-center justify-center">
//           <div className="text-black p-5 rounded-lg bg-white shadow-lg w-96 relative">
//             <button
//               onClick={() => setShowDetails(false)}
//               className="absolute top-2 right-2 text-black hover:text-red-500"
//             >
//               <FaTimes />
//             </button>
//             <div className="bg-gray-100 p-4 rounded-lg mb-4 ">
//               <p className="break-words">{pubKey} </p>
//               <button onClick={copyToClipboard} className="text-black hover:text-black ml-2" >
//                 <FaCopy />
//               </button>
//             </div>
//             <button
//               onClick={handleDisconnect}
//               className="w-full py-2 bg-black text-white rounded-md hover:bg-slate-600 transition uppercase"
//             >
//               Disconnect
//             </button>
//           </div>
//         </div>
//       )}

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="w-96 p-6 rounded-lg shadow-lg bg-black relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-100 hover:text-red-500"
//             >
//               ✕
//             </button>
//             <h2 className="text-2xl font-semibold mb-4 text-center text-white uppercase">
//               Select Wallet
//             </h2>
//             <div className="space-y-4">
//               <WalletOption
//                 name="Phantom"
//                 icon={phantomIcon}
//                 setting="Auto Confirm"
//                 onClick={handlePhantomWalletClick}
//               />
//               <WalletOption
//                 name="MetaMask"
//                 icon={metamaskIcon}
//                 setting="Auto Approve"
//                 onClick={connectMetaMask}
//               />
//               <WalletOption name="CoinBase" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const WalletOption = ({ name, icon, setting, onClick }) => (
//   <button
//     onClick={onClick}
//     className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
//   >
//     <div className="flex items-center gap-2">
//       {icon && <img src={icon} alt={`${name} Icon`} className="w-6 h-6" />}
//       <span className="font-medium uppercase">{name}</span>
//     </div>
//     {setting && <span className="text-sm text-gray-500">{setting}</span>}
//   </button>
// );

// export default WalletButton;
import React, { useState, useRef } from "react";
import walletlogo from '../asset/wallet02.png'; 
import getProvider from "../utils/getProvider";
import { FaChevronDown, FaCopy, FaTimes } from 'react-icons/fa';
import { useSDK } from "@metamask/sdk-react";

// Import wallet icons
import phantomIcon from '../asset/phantom.png';  
import metamaskIcon from '../asset/metamask.png'; 

const WalletButton = () => {
  const { sdk } = useSDK(); // Access the SDK from MetaMask
  const [isModalOpen, setIsModalOpen] = useState(false); // State for wallet selection modal
  const [pubKey, setPublicKey] = useState(null); // Stores the public key of the connected wallet
  const [showDetails, setShowDetails] = useState(false); // Controls visibility of address dropdown
  const [activeWallet, setActiveWallet] = useState(null); // Tracks the active wallet
  const phantom_provider = getProvider(); // Get the Phantom provider
  const buttonRef = useRef(null); // Reference to the button for positioning

  // Function to connect to MetaMask
  const connectMetaMask = async () => {
    try {
      const accounts = await sdk?.connect(); // Connect to MetaMask  
      setPublicKey(accounts?.[0]); // Set public key
      setActiveWallet('metamask'); // Set active wallet to MetaMask
      setIsModalOpen(false); // Close wallet selection modal
    } catch (err) {
      console.warn("Failed to connect to MetaMask", err); // Error handling
    }
  };

  // Function to connect to Phantom wallet
  const handlePhantomWalletClick = async () => {
    try {
      const response = await phantom_provider.connect(); // Connect to Phantom wallet
      setPublicKey(response.publicKey.toString()); // Set public key
      setActiveWallet('phantom'); // Set active wallet to Phantom
      localStorage.setItem('isDisconnected', 'false'); // Update local storage state
      setIsModalOpen(false); // Close modal
    } catch (err) {
      console.log("Error connecting to Phantom wallet", err); // Error handling
    }
  };

  // Function to disconnect from wallet
  const handleDisconnect = async () => {
    await phantom_provider.disconnect(); // Disconnect from Phantom wallet
    setPublicKey(null); // Clear public key
    setShowDetails(false); // Hide details dropdown
    setActiveWallet(null); // Reset active wallet
    localStorage.setItem('isDisconnected', 'true'); // Update local storage state
  };

  // Function to copy address to clipboard
  const copyToClipboard = () => {
    if (pubKey) {
      navigator.clipboard.writeText(pubKey); // Copy public key to clipboard
      alert("Address copied to clipboard!"); // Alert user
    }
  };

  // Determine wallet icon based on active wallet
  const walletIcon = activeWallet === 'metamask' ? metamaskIcon : phantomIcon;

  return (
    <div className="flex justify-end h-screen mt-2 p-4 relative">
      {/* Button to connect wallet */}
      {!pubKey ? (
        <button
          onClick={() => setIsModalOpen(true)} // Open modal on click
          ref={buttonRef} // Reference for positioning
          className="text-black px-4 py-2 rounded-lg flex items-center gap-2 h-14 w-44"
        >
          <img src={walletlogo} alt="Wallet Logo" className="w-32" />
        </button>
      ) : (
        // Button showing connected wallet address
        <button
          onClick={() => setShowDetails(!showDetails)} // Toggle address dropdown
          ref={buttonRef}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-4 h-14 w-80"
        >
          <img src={walletIcon} alt="Connected Wallet Icon" className="w-8 h-8 rounded-full" />
          <span className="truncate">{pubKey.slice(0, 6)}...{pubKey.slice(-6)}</span> {/* Shortened address */}
          <FaChevronDown className="ml-auto" />
        </button>
      )}

      {/* Dropdown for wallet address details */}
      {showDetails && (
        <div
          className="absolute bg-white shadow-lg rounded-lg p-5 w-80"
          style={{
            top: buttonRef.current?.getBoundingClientRect().bottom + 10, // Position below the button
            left: buttonRef.current?.getBoundingClientRect().left, // Align with button
          }}
        >
          <button
            onClick={() => setShowDetails(false)} // Close details dropdown
            className="absolute top-2 right-2 text-black hover:text-red-500"
          >
            <FaTimes />
          </button>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="break-words">{pubKey}</p> {/* Display public key */}
            <button onClick={copyToClipboard} className="text-black hover:text-black ml-2">
              <FaCopy /> {/* Copy icon */}
            </button>
          </div>
          <button
            onClick={handleDisconnect} // Disconnect wallet
            className="w-full py-2 bg-black text-white rounded-md hover:bg-slate-600 transition uppercase"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Modal for wallet selection */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-96 p-6 rounded-lg shadow-lg bg-black relative">
            <button
              onClick={() => setIsModalOpen(false)} // Close modal
              className="absolute top-2 right-2 text-gray-100 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center text-white uppercase">
              Select Wallet
            </h2>
            <div className="space-y-4">
              <WalletOption
                name="Phantom" // Phantom wallet option
                icon={phantomIcon}
                setting="Auto Confirm"
                onClick={handlePhantomWalletClick} // Connect to Phantom wallet
              />
              <WalletOption
                name="MetaMask" // MetaMask wallet option
                icon={metamaskIcon}
                setting="Auto Approve"
                onClick={connectMetaMask} // Connect to MetaMask
              />
              <WalletOption name="CoinBase" /> {/* Placeholder for future wallet */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Wallet option component
const WalletOption = ({ name, icon, setting, onClick }) => (
  <button
    onClick={onClick} // Handle wallet selection click
    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
  >
    <div className="flex items-center gap-2">
      {icon && <img src={icon} alt={`${name} Icon`} className="w-6 h-6" />} {/* Display wallet icon */}
      <span className="font-medium uppercase">{name}</span> {/* Wallet name */}
    </div>
    {setting && <span className="text-sm text-gray-500">{setting}</span>} {/* Settings info */}
  </button>
);

export default WalletButton; // Export the WalletButton component
