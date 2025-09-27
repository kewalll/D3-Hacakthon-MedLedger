import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBlockchain } from "../context/BlockchainContext";

const CreateCase = () => {
    const { contract } = useBlockchain();
    const navigate = useNavigate();
    const location = useLocation();

    const walletAddress = location.state?.walletAddress || "";
    const initialPasscode = location.state?.passcode || "";
    const [loading, setLoading] = useState(false);
    const [caseTitle, setCaseTitle] = useState("");
    const [passcode, setPasscode] = useState(initialPasscode);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caseTitle.trim()) {
            setError("Case title is required!");
            return;
        }

        if (!passcode || passcode.trim().length === 0) {
            setError("Passcode is required!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Convert passcode to number as required by the contract
            const passcodeNumber = parseInt(passcode);
            if (isNaN(passcodeNumber)) {
                throw new Error("Passcode must be a number");
            }

            // Call createCase with parameters in the correct order as per the contract
            const tx = await contract.createCase(walletAddress, passcodeNumber, caseTitle);
            await tx.wait();

            // Navigate back with refresh flag and preserved data
            navigate("/patient-details", {
                state: {
                    walletAddress,
                    passcode,
                    refresh: true
                }
            });
        } catch (err) {
            console.error("Error creating case:", err);
            setError("Failed to create case: " + (err.message || "Please check the passcode and try again."));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
                    <div className="bg-teal-600/20 p-4 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-teal-400 text-center">
                            Create New Medical Case
                        </h2>
                    </div>

                    {error && (
                        <div className="mx-6 mt-6 p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                            <p className="text-red-400 text-center text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-gray-300 font-medium mb-2 text-sm">
                                Patient Wallet Address
                            </label>
                            <div className="p-3 bg-gray-900/80 border border-gray-700 rounded-lg">
                                <p className="text-gray-400 text-sm font-mono">
                                    {walletAddress.substring(0, 18)}...{walletAddress.substring(walletAddress.length - 6)}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2 text-sm">
                                Case Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter case title"
                                value={caseTitle}
                                onChange={(e) => setCaseTitle(e.target.value)}
                                className="w-full p-3 bg-gray-900 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 font-medium mb-2 text-sm">
                                Patient Passcode
                            </label>
                            <input
                                type="password"
                                placeholder="Enter patient passcode"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                className="w-full p-3 bg-gray-900 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2 pl-1">
                                Required for doctor verification
                            </p>
                        </div>

                        <div className="pt-4 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="p-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    "Create Case"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCase;