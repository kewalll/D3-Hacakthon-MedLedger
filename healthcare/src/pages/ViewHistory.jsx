import { useState, useEffect } from "react";
import { useBlockchain } from "../context/BlockchainContext";
import { useNavigate } from "react-router-dom";

const ViewHistory = () => {
    const { contract, account } = useBlockchain();
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (account && contract) {
            fetchPatientCases();
        }
    }, [account, contract]);

    const fetchPatientCases = async () => {
        setLoading(true);
        setError("");

        try {
            // Fetch patient's cases directly from contract
            const [caseIds, caseTitles] = await contract.getMyCases();

            if (caseIds.length === 0) {
                setCases([]);
                setLoading(false);
                return;
            }

            // Fetch case details for each case
            const caseData = await Promise.all(
                caseIds.map(async (caseId) => {
                    try {
                        const caseDetails = await contract.getCaseDetails(caseId);
                        return {
                            caseId: caseDetails[0]?.toString(), // Convert BigInt to string
                            patient: caseDetails[1],
                            isOpen: caseDetails[2],
                            caseTitle: caseDetails[3],
                            recordIds: caseDetails[4]?.map(id => id.toString()) || [], // Convert array of BigInts to strings
                            reportCIDs: caseDetails[5] || [],
                        };
                    } catch (err) {
                        console.error(`Error fetching case ${caseId}:`, err);
                        return null;
                    }
                })
            );

            // Remove null cases and sort: Open cases first
            const sortedCases = caseData.filter(Boolean).sort((a, b) => (b.isOpen ? 1 : 0) - (a.isOpen ? 1 : 0));
            setCases(sortedCases);
        } catch (err) {
            console.error("Error fetching cases:", err);
            setError("Failed to load cases. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCaseClick = (caseId) => {
        navigate(`/patient/case-details/${caseId}`);
    };

    return (
        <div className="min-h-screen bg-black relative">
            {/* Background dots like in the profile page */}
            <div className="absolute top-24 left-12 w-2 h-2 rounded-full bg-green-500 opacity-70"></div>
            <div className="absolute bottom-32 left-8 w-2 h-2 rounded-full bg-green-500 opacity-70"></div>
            <div className="absolute top-32 right-12 w-2 h-2 rounded-full bg-green-500 opacity-70"></div>

            <div className="flex justify-center items-center p-6 pt-16">
                <div className="w-full max-w-3xl">
                    <div className="bg-gray-900 rounded-lg shadow-lg mb-6 p-6">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            Medical History
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-800 rounded text-red-300 text-center">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
                            </div>
                        ) : cases.length === 0 ? (
                            <div className="py-4 text-gray-400 text-center">
                                No medical history found.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cases.map((c) => (
                                    <div
                                        key={c.caseId}
                                        className="border border-gray-800 bg-gray-800 bg-opacity-50 rounded cursor-pointer"
                                        onClick={() => handleCaseClick(c.caseId)}
                                    >
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-white font-medium">{c.caseTitle}</h3>
                                                <div className={c.isOpen ? "bg-green-600 text-white rounded px-2 py-1 text-xs" : "bg-gray-700 text-gray-300 rounded px-2 py-1 text-xs"}>
                                                    Status: {c.isOpen ? "Ongoing" : "Closed"}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="text-gray-500 text-sm">
                                                    Records
                                                    <div className="text-gray-300">{c.recordIds.length}</div>
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    Reports
                                                    <div className="text-gray-300">{c.reportCIDs.length}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => navigate('/')}
                                className="px-5 py-2 bg-cyan-800 text-white rounded-md hover:bg-cyan-700 transition duration-300"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewHistory;