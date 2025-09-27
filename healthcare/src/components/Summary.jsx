import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Summary = ({ patient, cases, onClose }) => {
    const [records, setRecords] = useState([]);
    const [formattedRecords, setFormattedRecords] = useState([]);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const state = location.state || {};
    const recordIds = state.recordIds ? JSON.parse(state.recordIds) : [];
    console.log("Record IDs:", recordIds);
    
    const fetchRecords = async () => {
        try {
            setLoadingRecords(true);
            if (!contract) {
                setError("Contract not initialized.");
                return;
            }
            if (!recordIds || !recordIds.length) {
                setRecords([]);
                setFormattedRecords([]);
                return;
            }

            const recordDetails = await Promise.all(
                recordIds.map(async (recordId) => {
                    try {
                        return await contract.records(recordId);
                    } catch (err) {
                        console.error(`Error fetching record ${recordId}:`, err);
                        return null;
                    }
                })
            );

            const validRecords = recordDetails.filter(Boolean);
            setRecords(validRecords);

            // Format records with doctor names
            const formatted = await formatRecords(validRecords, contract);
            setFormattedRecords(formatted);
            console.log("Formatted Records:", formatted);

        } catch (err) {
            console.error("Error fetching records:", err);
            setError("Failed to fetch records.");
        } finally {
            setLoadingRecords(false);
        }
    };
    useEffect(() => {
        fetchRecords();
    }, []);
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-teal-400 mb-4">
                    Patient Summary
                </h2>

                {patient ? (
                    <div className="space-y-2 text-gray-300">
                        <p><span className="font-semibold">Name:</span> {patient.name}</p>
                        <p><span className="font-semibold">Age:</span> {patient.age}</p>
                        <p><span className="font-semibold">Gender:</span> {patient.gender}</p>
                        <p><span className="font-semibold">Total Cases:</span> {cases.length}</p>
                    </div>
                ) : (
                    <p className="text-gray-400">No patient summary available.</p>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Summary;
