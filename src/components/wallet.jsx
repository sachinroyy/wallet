
import React, { useState } from "react"; // Import React and useState hook
import walletlogo from '../asset/short.png'; // Import the wallet logo image

// Main WalletButton Component
const WalletButton = () => {
  // State Variables
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if the wallet modal is open
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track the user’s login status
  const [selectedWallet, setSelectedWallet] = useState(null); // Track the selected wallet for popup

  // Function to toggle the visibility of the main wallet modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Function to handle login/logout toggle
  const handleLoginLogout = () => setIsLoggedIn(!isLoggedIn);

  // Handle wallet click to open a specific wallet popup
  const handleWalletClick = (walletName) => setSelectedWallet(walletName);

  // Close the wallet popup
  const closeWalletPopup = () => setSelectedWallet(null);

  return (
    <div className="flex justify-end h-screen uppercase mt-2 p-4 ">
      {/* Main Wallet Button */}
      <button
        onClick={toggleModal} // Open or close the wallet modal
        className="text-black px-4 py-2 rounded-lg transition uppercase h-14 w-44 flex items-center justify-center gap-2"
      >
        {isLoggedIn ? "Open Wallet" : " "}  {/* Change text based on login state */}
        <img src={walletlogo} alt="Wallet Logo" className="w-32 " /> {/* Wallet Button Image */}
      </button>

      {/* Main Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-96 p-6 rounded-lg shadow-lg relative bg-slate-600">
            {/* Close Modal Button */}
            <button
              onClick={toggleModal} // Close the modal
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-semibold mb-4 text-center bg-slate-600 rounded-lg">
              Select Wallet
            </h2>

            {/* Wallet Options Section */}
            <div className="space-y-4">
              {/* Individual Wallet Options */}
              <WalletOption
                name="Phantom"
                setting="Auto Confirm"
                onClick={handleWalletClick} // Handle wallet selection
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

            {/* Divider */}
            <div className="border-t my-4"></div>

            {/* Sign-in Options Section */}
            <h3 className="text-lg font-medium flex justify-center mb-4 uppercase text-white rounded-lg">
              Sign In Options
            </h3>
            <div className="space-y-2">
              <SignInOption name="Google" onClick={handleWalletClick} />
              <SignInOption name="Apple" onClick={handleWalletClick} />
              <SignInOption name="Torus" onClick={handleWalletClick} />
            </div>

            {/* Login/Logout Button */}
            <button
              onClick={handleLoginLogout} // Toggle login/logout state
              className={`mt-6 w-full py-2 rounded-md ${
                isLoggedIn
                  ? "bg-red-500 hover:bg-red-600" // Logout button styling
                  : "bg-green-500 hover:bg-green-600" // Login button styling
              } text-white transition`}
            >
              {isLoggedIn ? "Logout" : "Login"} {/* Button text based on login state */}
            </button>
          </div>
        </div>
      )}

      {/* Wallet Popup */}
      {selectedWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-80 p-5 rounded-lg shadow-lg bg-white">
            {/* Wallet Popup Header */}
            <h2 className="text-xl font-bold mb-4 text-center">
              Connect to {selectedWallet}
            </h2>

            {/* Connect Button */}
            <button
              onClick={closeWalletPopup} // Close the popup after connect
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Connect
            </button>

            {/* Close Popup Button */}
            <button
              onClick={closeWalletPopup} // Close the popup
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

// WalletOption Component (for individual wallet options)
const WalletOption = ({ name, setting, onClick }) => (
  <button
    onClick={() => onClick(name)} // Handle wallet click
    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 w-full transition"
  >
    <span className="font-medium uppercase">{name}</span> {/* Display wallet name */}
    {setting && <span className="text-sm text-gray-500">{setting}</span>} {/* Display wallet setting (if any) */}
  </button>
);

// SignInOption Component (for individual sign-in options)
const SignInOption = ({ name, onClick }) => (
  <button
    onClick={() => onClick(name)} // Handle sign-in option click
    className="w-full py-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 flex justify-center items-center transition"
  >
    <span className="font-medium">Sign in with {name}</span> {/* Display sign-in option */}
  </button>
);

// Export WalletButton as default export
export default WalletButton;
