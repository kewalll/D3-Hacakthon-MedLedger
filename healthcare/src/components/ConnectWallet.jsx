import { useNavigate } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";
import { Wallet, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const ConnectWallet = () => {
    const { account, connectWallet } = useBlockchain();
    const navigate = useNavigate();
    const [isHovering, setIsHovering] = useState(false);

    const handleConnect = async () => {
        if (!account) {
            await connectWallet();
            navigate("/profile"); // Redirect to dashboard after connection
        } else {
            navigate("/patientdashboard"); // Just redirect if already connected 
            //gets redirected to the patient dashboard for both doctor and patient
        }
        console.log("Account:", account);
        console.log("Connected to wallet:", account);

    };

    return (
        <button
            onClick={handleConnect}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`group relative overflow-hidden px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 transition-all duration-300 ${account
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg"
                }`}
            style={{
                transform: isHovering ? "translateY(-2px)" : "translateY(0)",
                minWidth: "220px",
            }}
        >
            {/* Icon and text container */}
            <div className="relative z-10 flex items-center justify-center gap-2">
                {account ? (
                    <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Connected</span>
                    </>
                ) : (
                    <>
                        <Wallet className="w-5 h-5" />
                        <span>Connect Wallet</span>
                    </>
                )}
            </div>

            {/* Animated background for non-connected state */}
            {!account && (
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
            )}
        </button>
    );
};

export default ConnectWallet;