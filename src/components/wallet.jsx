// import React, { useState, useEffect } from "react";
// import walletlogo from '../asset/short.png';
// import getProvider from "../utils/getProvider";

// const WalletButton = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedWallet, setSelectedWallet] = useState(null);
//   const [addressClicked, setAddressClicked] = useState(false);
//   const [pubKey, setPublicKey] = useState();

//   const provider = getProvider();

//   useEffect(() => {
//     const isDisconnected = localStorage.getItem('isDisconnected') === 'true';

//     if (!isDisconnected) {
//       provider.connect({ onlyIfTrusted: true })
//         .then(({ publicKey }) => {
//           console.log(publicKey.toString());
//           setPublicKey(publicKey.toString());
//         })
//         .catch((err) => {
//           console.log("Eager connection failed", err);
//         });
//     }

//     provider.on('accountChanged', async (publicKey) => {
//       if (publicKey) {
//         console.log(`Switched to account ${publicKey.toBase58()}`);
//         setPublicKey(publicKey.toString());
//       } else {
//         await provider.connect().catch((error) => {
//           console.log("Didn't show changed account so we will try to reconnect");
//         });

//         setPublicKey(provider.publicKey.toString());
//       }
//     });

//     return () => {
//       provider.removeAllListeners('accountChanged');
//     };
//   }, [provider]);

//   const toggleModal = () => setIsModalOpen(!isModalOpen);
//   const toggleAddressModal = () => setAddressClicked(!addressClicked);
//   const handleLoginLogout = () => setIsLoggedIn(!isLoggedIn);
//   const handleWalletClick = (walletName) => setSelectedWallet(walletName);

//   const handlePhantomWalletClick = async () => {
//     try {
//       const response = await provider.connect();
//       console.log(response.publicKey.toString());
//       setPublicKey(response.publicKey.toString());
//       provider.on("connect", () => console.log("connected!"));
//       setIsModalOpen(!isModalOpen);
//       localStorage.setItem('isDisconnected', 'false');
//     } catch (err) {
//       console.log("error in connecting phantom wallet", err);
//     }
//   }

//   async function handleDisconnect() {
//     await provider.disconnect();
//     console.log("Phantom wallet disconnected");
//     setPublicKey(null);
//     localStorage.setItem('isDisconnected', 'true');
//     provider.on("disconnect", () => {
//       console.log("disconnected!");
//     });
//     setAddressClicked(false); // Close the address modal
//   }

//   const closeWalletPopup = () => setSelectedWallet(null);

//   return (
//     <div className="flex justify-end h-screen uppercase mt-2 p-4 ">
//       {!pubKey ?
//         <button
//           onClick={toggleModal}
//           className="text-black px-4 py-2 rounded-lg transition uppercase h-14 w-44 flex items-center justify-center gap-2"
//         >
//           {isLoggedIn ? "Open Wallet" : " "}
//           <img src={walletlogo} alt="Wallet Logo" className="w-32 " />
//         </button>
//         :
//         <button
//           onClick={toggleAddressModal}
//           className="text-black px-4 py-2 rounded-lg transition uppercase h-14 w-44 flex items-center justify-center gap-2"
//         >
//           {pubKey}
//         </button>
//       }

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="w-96 p-6 rounded-lg shadow-lg relative bg-slate-600">
//             <button
//               onClick={toggleModal}
//               className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>
//             <h2 className="text-2xl font-semibold mb-4 text-center bg-slate-600 rounded-lg">
//               Select Wallet
//             </h2>
//             <div className="space-y-4">
//               <WalletOption
//                 name="Phantom"
//                 setting="Auto Confirm"
//                 onClick={() => {handlePhantomWalletClick()}}
//               />
//               <WalletOption
//                 name="Solflare"
//                 setting="Auto Approve"
//                 onClick={handleWalletClick}
//               />
//               <WalletOption
//                 name="Ethereum Wallet"
//                 onClick={handleWalletClick}
//               />
//             </div>
//             <div className="border-t my-4"></div>
//             <h3 className="text-lg font-medium flex justify-center mb-4 uppercase text-white rounded-lg">
//               Sign In Options
//             </h3>
//             <div className="space-y-2">
//               <SignInOption name="Google" onClick={handleWalletClick} />
//               <SignInOption name="Apple" onClick={handleWalletClick} />
//               <SignInOption name="Torus" onClick={handleWalletClick} />
//             </div>
//             <button
//               onClick={handleLoginLogout}
//               className={`mt-6 w-full py-2 rounded-md ${isLoggedIn
//                 ? "bg-red-500 hover:bg-red-600"
//                 : "bg-green-500 hover:bg-green-600"
//                 } text-white transition`}
//             >
//               {isLoggedIn ? "Logout" : "Login"}
//             </button>
//           </div>
//         </div>
//       )}

//       {selectedWallet && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="w-80 p-5 rounded-lg shadow-lg bg-white">
//             <h2 className="text-xl font-bold mb-4 text-center">
//               Connect to {selectedWallet}
//             </h2>
//             <button
//               onClick={closeWalletPopup}
//               className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//             >
//               Connect
//             </button>
//             <button
//               onClick={closeWalletPopup}
//               className="mt-2 w-full py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {addressClicked && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="w-80 p-5 rounded-lg shadow-lg bg-white">
//             <h2 className="text-xl font-bold mb-4 text-center">
//               Wallet Address
//             </h2>
//             <p className="mb-4">{pubKey}</p>
//             <button
//               onClick={handleDisconnect}
//               className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//             <button
//               onClick={toggleAddressModal}
//               className="mt-2 w-full py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const WalletOption = ({ name, setting, onClick }) => (
//   <button
//     onClick={() => onClick(name)}
//     className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
//   >
//     <span className="font-medium uppercase">{name}</span>
//     {setting && <span className="text-sm text-gray-500">{setting}</span>}
//   </button>
// );

// const SignInOption = ({ name, onClick }) => (
//   <button
//     onClick={() => onClick(name)}
//     className="w-full py-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 flex justify-center items-center transition"
//   >
//     <span className="font-medium">Sign in with {name}</span>
//   </button>
// );

// 

// import React, { useState, useEffect } from "react";
// import walletlogo from '../asset/short.png'; // Wallet icon for connect button
// import getProvider from "../utils/getProvider";

// // DiceBear for dynamic avatar (optional)
// import * as avatars from '@dicebear/avatars';
// import * as sprite from '@dicebear/avatars-identicon-sprites';

// const WalletButton = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [pubKey, setPublicKey] = useState(null);
//   const [showDetails, setShowDetails] = useState(false); // Track if wallet details are shown
//   const [transactions, setTransactions] = useState([]); // Store recent transactions

//   const provider = getProvider(); // Initialize the wallet provider

//   useEffect(() => {
//     const isDisconnected = localStorage.getItem('isDisconnected') === 'true';

//     if (!isDisconnected) {
//       provider.connect({ onlyIfTrusted: true })
//         .then(({ publicKey }) => {
//           setPublicKey(publicKey.toString());
//           fetchRecentTransactions(publicKey.toString());
//         })
//         .catch((err) => console.log("Eager connection failed", err));
//     }

//     provider.on('accountChanged', async (publicKey) => {
//       if (publicKey) {
//         setPublicKey(publicKey.toString());
//         fetchRecentTransactions(publicKey.toString());
//       } else {
//         await provider.connect().catch((error) =>
//           console.log("Attempted to reconnect but failed.")
//         );
//         setPublicKey(provider.publicKey.toString());
//       }
//     });

//     return () => {
//       provider.removeAllListeners('accountChanged');
//     };
//   }, [provider]);

//   const fetchRecentTransactions = async (walletAddress) => {
//     // Mock transaction data (Replace with real API data in production)
//     const mockTransactions = [
//       { id: 1, type: 'Send', amount: '0.5 SOL', date: '2024-10-20' },
//       { id: 2, type: 'Receive', amount: '1.2 SOL', date: '2024-10-18' },
//       { id: 3, type: 'Swap', amount: '0.8 SOL', date: '2024-10-15' },
//     ];
//     setTransactions(mockTransactions);
//   };

//   const handlePhantomWalletClick = async () => {
//     try {
//       const response = await provider.connect();
//       setPublicKey(response.publicKey.toString());
//       localStorage.setItem('isDisconnected', 'false');
//       setIsModalOpen(false);
//     } catch (err) {
//       console.log("Error connecting Phantom wallet", err);
//     }
//   };

//   const handleDisconnect = async () => {
//     await provider.disconnect();
//     setPublicKey(null);
//     setShowDetails(false);
//     localStorage.setItem('isDisconnected', 'true');
//   };

//   // Generate a small avatar logo based on the wallet address
//   const avatarUrl = pubKey
//     ? avatars.createAvatar(sprite, { seed: pubKey, dataUri: true }) // Dynamic logo based on public key
//     : '';

//   return (
//     <div className="flex justify-end h-screen mt-2 p-4">
//       {!pubKey ? (
//         // Show connect button if no wallet is connected
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="text-black px-4 py-2 rounded-lg flex items-center gap-2 h-14 w-44"
//         >
//           <img src={walletlogo} alt="Wallet Logo" className="w-32" />
//         </button>
//       ) : (
//         // Show address button with small avatar next to it
//         <button
//           onClick={() => setShowDetails(true)}
//           className="bg-slate-500 text-white px-4 py-2 rounded-lg flex items-center gap-4 h-14 "
//         >
//           <img
//             src={avatarUrl}
//             alt="Wallet Avatar"
//             className="w-8 h-8 rounded-full" // Small circular avatar
//           />
//           <span>{pubKey.slice(0, 6)}...{pubKey.slice(-6)}</span> {/* Truncated address */}
//         </button>
//       )}

//       {showDetails && (
//         // Wallet details modal
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center ">
//           <div className="bg-white p-5 rounded-lg shadow-lg w-96 ">
//             <h2 className="text-lg font-semibold mb-4 text-center uppercase bg-slate-500 rounded-lg">
//               Connected Wallet
//             </h2>
//             <p className="text-black mb-4 break-words">{pubKey}</p>
//             <button
//               onClick={handleDisconnect}
//               className="w-full py-2 bg-slate-500 text-white rounded-md hover:bg-black transition uppercase"
//             >
//               Disconnect
//             </button>
//             <h3 className="mt-6 mb-2 text-center font-medium uppercase bg-slate-500 rounded-lg">Recent Transactions</h3>
//             <ul className="space-y-2">
//               {transactions.map((tx) => (
//                 <li
//                   key={tx.id}
//                   className="flex justify-between p-2 bg-slate-500 rounded-lg uppercase "
//                 >
//                   <span>{tx.type}</span>
//                   <span>{tx.amount}</span>
//                   <span className="text-sm text-gray-500">{tx.date}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}

//       {isModalOpen && (
//         // Wallet selection modal
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="w-96 p-6 rounded-lg shadow-lg bg-slate-500 relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-100 hover:text-red-500"
//             >
//               ✕
//             </button>
//             <h2 className="text-2xl font-semibold mb-4 text-center text-white">
//               Select Wallet
//             </h2>
//             <div className="space-y-4">
//               <WalletOption
//                 name="Phantom"
//                 setting="Auto Confirm"
//                 onClick={handlePhantomWalletClick}
//               />
//               <WalletOption name="Solflare" setting="Auto Approve" />
//               <WalletOption name="Ethereum Wallet" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // WalletOption component for rendering individual wallet options
// const WalletOption = ({ name, setting, onClick }) => (
//   <button
//     onClick={onClick}
//     className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
//   >
//     <span className="font-medium uppercase">{name}</span>
//     {setting && <span className="text-sm text-gray-500">{setting}</span>}
//   </button>
// );

// export default WalletButton;
// import React, { useState, useEffect } from "react";
// import walletlogo from '../asset/short.png'; // Wallet icon for connect button
// import getProvider from "../utils/getProvider";
// import * as avatars from '@dicebear/avatars';
// import * as sprite from '@dicebear/avatars-identicon-sprites';
// import { FaChevronDown, FaCopy } from 'react-icons/fa'; // Import icons

// const WalletButton = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [pubKey, setPublicKey] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [transactions, setTransactions] = useState([]);

//   const provider = getProvider();

//   useEffect(() => {
//     const isDisconnected = localStorage.getItem('isDisconnected') === 'true';

//     if (!isDisconnected) {
//       provider.connect({ onlyIfTrusted: true })
//         .then(({ publicKey }) => {
//           setPublicKey(publicKey.toString());
//           fetchRecentTransactions(publicKey.toString());
//         })
//         .catch((err) => console.log("Eager connection failed", err));
//     }

//     provider.on('accountChanged', async (publicKey) => {
//       if (publicKey) {
//         setPublicKey(publicKey.toString());
//         fetchRecentTransactions(publicKey.toString());
//       } else {
//         await provider.connect().catch((error) =>
//           console.log("Attempted to reconnect but failed.")
//         );
//         setPublicKey(provider.publicKey.toString());
//       }
//     });

//     return () => {
//       provider.removeAllListeners('accountChanged');
//     };
//   }, [provider]);

//   const fetchRecentTransactions = async (walletAddress) => {
//     const mockTransactions = [
//       { id: 1, type: 'Send', amount: '0.5 SOL', date: '2024-10-20' },
//       { id: 2, type: 'Receive', amount: '1.2 SOL', date: '2024-10-18' },
//       { id: 3, type: 'Swap', amount: '0.8 SOL', date: '2024-10-15' },
//     ];
//     setTransactions(mockTransactions);
//   };

//   const handlePhantomWalletClick = async () => {
//     try {
//       const response = await provider.connect();
//       setPublicKey(response.publicKey.toString());
//       localStorage.setItem('isDisconnected', 'false');
//       setIsModalOpen(false);
//     } catch (err) {
//       console.log("Error connecting Phantom wallet", err);
//     }
//   };

//   const handleDisconnect = async () => {
//     await provider.disconnect();
//     setPublicKey(null);
//     setShowDetails(false);
//     localStorage.setItem('isDisconnected', 'true');
//   };

//   const copyToClipboard = () => {
//     if (pubKey) {
//       navigator.clipboard.writeText(pubKey);
//       alert("Address copied to clipboard!");
//     }
//   };

//   const avatarUrl = pubKey
//     ? avatars.createAvatar(sprite, { seed: pubKey, dataUri: true })
//     : '';

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
//         // Address button with proper alignment
//         <button
//           onClick={() => setShowDetails(!showDetails)}
//           className="bg-slate-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 h-14 w-80"
//         >
//           <div className="flex items-center gap-2 overflow-hidden">
//             <img src={avatarUrl} alt="Wallet Avatar" className="w-8 h-8 rounded-full" />
//             <span className="truncate">{pubKey.slice(0, 6)}...{pubKey.slice(-6)}</span>
//           </div>
//           <FaChevronDown className="ml-auto" /> {/* Down arrow stays inside the button */}
//         </button>
//       )}

//       {showDetails && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="bg-white p-5 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4 text-center uppercase bg-slate-500 rounded-lg">
//               Connected Wallet
//             </h2>
//             <div className="flex items-center justify-between mb-4">
//               <p className="text-black break-words">{pubKey}</p>
//               <button onClick={copyToClipboard} className="text-gray-500 hover:text-black">
//                 <FaCopy /> {/* Copy Button */}
//               </button>
//             </div>
//             <button
//               onClick={handleDisconnect}
//               className="w-full py-2 bg-slate-500 text-white rounded-md hover:bg-black transition uppercase"
//             >
//               Disconnect
//             </button>
//             <h3 className="mt-6 mb-2 text-center font-medium uppercase bg-slate-500 rounded-lg">
//               Recent Transactions
//             </h3>
//             <ul className="space-y-2">
//               {transactions.map((tx) => (
//                 <li
//                   key={tx.id}
//                   className="flex justify-between p-2 bg-slate-500 rounded-lg uppercase"
//                 >
//                   <span>{tx.type}</span>
//                   <span>{tx.amount}</span>
//                   <span className="text-sm text-gray-500">{tx.date}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="w-96 p-6 rounded-lg shadow-lg bg-slate-500 relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-2 right-2 text-gray-100 hover:text-red-500"
//             >
//               ✕
//             </button>
//             <h2 className="text-2xl font-semibold mb-4 text-center text-white">
//               Select Wallet
//             </h2>
//             <div className="space-y-4">
//               <WalletOption
//                 name="Phantom"
//                 setting="Auto Confirm"
//                 onClick={handlePhantomWalletClick}
//               />
//               <WalletOption name="Solflare" setting="Auto Approve" />
//               <WalletOption name="Ethereum Wallet" />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const WalletOption = ({ name, setting, onClick }) => (
//   <button
//     onClick={onClick}
//     className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
//   >
//     <span className="font-medium uppercase">{name}</span>
//     {setting && <span className="text-sm text-gray-500">{setting}</span>}
//   </button>
// );

// export default WalletButton;

import React, { useState, useEffect } from "react";
import walletlogo from '../asset/short.png'; // Wallet icon for connect button
import getProvider from "../utils/getProvider";
import * as avatars from '@dicebear/avatars';
import * as sprite from '@dicebear/avatars-identicon-sprites';
import { FaChevronDown, FaCopy, FaTimes } from 'react-icons/fa'; // Import icons

const WalletButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pubKey, setPublicKey] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const provider = getProvider();

  useEffect(() => {
    const isDisconnected = localStorage.getItem('isDisconnected') === 'true';

    if (!isDisconnected) {
      provider.connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => {
          setPublicKey(publicKey.toString());
          fetchRecentTransactions(publicKey.toString());
        })
        .catch((err) => console.log("Eager connection failed", err));
    }

    provider.on('accountChanged', async (publicKey) => {
      if (publicKey) {
        setPublicKey(publicKey.toString());
        fetchRecentTransactions(publicKey.toString());
      } else {
        await provider.connect().catch((error) =>
          console.log("Attempted to reconnect but failed.")
        );
        setPublicKey(provider.publicKey.toString());
      }
    });

    return () => {
      provider.removeAllListeners('accountChanged');
    };
  }, [provider]);

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
      const response = await provider.connect();
      setPublicKey(response.publicKey.toString());
      localStorage.setItem('isDisconnected', 'false');
      setIsModalOpen(false);
    } catch (err) {
      console.log("Error connecting Phantom wallet", err);
    }
  };

  const handleDisconnect = async () => {
    await provider.disconnect();
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
              <WalletOption name="Metamask" setting="Auto Approve" />
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
