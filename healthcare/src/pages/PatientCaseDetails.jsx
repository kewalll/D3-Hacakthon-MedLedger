import { useState, useEffect } from "react";
import { useBlockchain } from "../context/BlockchainContext";
import { useNavigate, useParams } from "react-router-dom";

const PatientCaseDetails = () => {
  const { contract, account } = useBlockchain();
  const navigate = useNavigate();
  const { caseId: caseIdParam } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);
  const [records, setRecords] = useState([]);
  const [formattedRecords, setFormattedRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState("");

  const caseId = caseIdParam ? parseInt(caseIdParam, 10) : null;

  useEffect(() => {
    if (account && contract && caseId !== null) {
      fetchCaseDetails();
    }
  }, [account, contract, caseId]);

  useEffect(() => {
    if (caseDetails?.recordIds?.length > 0) {
      fetchRecords();
    } else {
      setRecords([]);
      setFormattedRecords([]);
    }
  }, [caseDetails]);

  const fetchCaseDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const details = await contract.getMyCaseDetails(caseId);
      setCaseDetails({
        caseId: details.caseId.toString(),
        patient: details.patient,
        isOngoing: details.isOngoing,
        caseTitle: details.caseTitle,
        recordIds: details.recordIds.map((id) => id.toString()),
        reportCIDs: details.reportCIDs,
      });
    } catch (err) {
      console.error("Error fetching case details:", err);
      setError("Failed to fetch case details.");
    } finally {
      setLoading(false);
    }
  };

  const formatRecordsWithDoctorNames = async (records, contract) => {
    if (!contract || !records?.length) return [];
    
    try {
      // Get unique doctor addresses
      const doctorAddresses = [...new Set(records.map(r => r?.doctor).filter(Boolean))];
      
      // Batch fetch all doctor names
      const doctorNames = {};
      
      await Promise.all(
        doctorAddresses.map(async (address) => {
          try {
            const patient = await contract.patients(address);
            doctorNames[address] = patient.fullName || "Unnamed Doctor";
          } catch (error) {
            console.error(`Error fetching doctor name for ${address}:`, error);
            doctorNames[address] = "Unknown Doctor";
          }
        })
      );
      
      // Format all records with the names we fetched
      return records.map(record => ({
        ...record,
        doctorName: record?.doctor ? doctorNames[record.doctor] : "Unknown Doctor"
      }));
    } catch (error) {
      console.error("Error formatting records:", error);
      return records.map(record => ({
        ...record,
        doctorName: "Error loading name"
      }));
    }
  };

  const fetchRecords = async () => {
    if (!contract || !caseDetails?.recordIds) {
      setRecords([]);
      setFormattedRecords([]);
      return;
    }
    setLoadingRecords(true);
    setError("");
    try {
      const recordDetails = await Promise.all(
        caseDetails.recordIds.map(async (recordId) => {
          try {
            const recordData = await contract.records(recordId);
            return {
              recordId: recordData.recordId.toString(),
              caseId: recordData.caseId.toString(),
              doctor: recordData.doctor,
              symptoms: recordData.symptoms,
              cause: recordData.cause,
              inference: recordData.inference,
              prescription: recordData.prescription,
              advices: recordData.advices,
              medications: recordData.medications,
            };
          } catch (err) {
            console.error(`Error fetching record ${recordId}:`, err);
            return null;
          }
        })
      );
      
      const validRecords = recordDetails.filter(Boolean);
      setRecords(validRecords);
      
      // Format records with doctor names
      const formatted = await formatRecordsWithDoctorNames(validRecords, contract);
      setFormattedRecords(formatted);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to fetch records.");
    } finally {
      setLoadingRecords(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : caseDetails ? (
          <>
            <h2 className="text-2xl font-bold text-teal-500 mb-4">
              {caseDetails.caseTitle}
            </h2>
            <p className="text-gray-400 mb-4">Case ID: #{caseDetails.caseId}</p>
            <p
              className={`mb-4 ${
                caseDetails.isOngoing ? "text-green-400" : "text-red-400"
              }`}
            >
              Status: {caseDetails.isOngoing ? "Open" : "Closed"}
            </p>

            <h3 className="text-xl font-semibold text-gray-300 mb-4">
              Medical Records
            </h3>
            {loadingRecords ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-700 p-4 rounded-lg animate-pulse h-32"></div>
                ))}
              </div>
            ) : formattedRecords.length > 0 ? (
              <div className="mb-6">
                {formattedRecords.map((record, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-400">
                      Record #{record.recordId}
                    </p>
                    <p className="text-sm text-gray-400 mb-2">
                      Doctor: {record.doctorName}
                    </p>
                    {record.symptoms && (
                      <div className="mb-2">
                        <span className="font-semibold text-teal-400">Symptoms:</span> {record.symptoms}
                      </div>
                    )}
                    {record.cause && (
                      <div className="mb-2">
                        <span className="font-semibold text-teal-400">Cause:</span> {record.cause}
                      </div>
                    )}
                    {record.inference && (
                      <div className="mb-2">
                        <span className="font-semibold text-teal-400">Inference:</span> {record.inference}
                      </div>
                    )}
                    {record.prescription && (
                      <div className="mb-2">
                        <span className="font-semibold text-teal-400">Prescription:</span> {record.prescription}
                      </div>
                    )}
                    {record.advices && (
                      <div className="mb-2">
                        <span className="font-semibold text-teal-400">Advice:</span> {record.advices}
                      </div>
                    )}
                    {record.medications && (
                      <div className="mb-2">
                        <span className="font-semibold text-teal-400">Medications:</span> {record.medications}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 mb-6">
                No medical records found for this case.
              </p>
            )}

            <h3 className="text-xl font-semibold text-gray-300 mb-4">
              Medical Reports
            </h3>
            {caseDetails.reportCIDs && caseDetails.reportCIDs.length > 0 ? (
              <div className="space-y-6 mb-6">
                {caseDetails.reportCIDs.map((cid, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-400 mb-2">
                      CID: <span className="break-all">{cid}</span>
                    </p>

                    {/* View link (opens in new tab) */}
                    <a
                      href={`http://127.0.0.1:8080/ipfs/${cid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-teal-400 hover:underline mb-2"
                    >
                      🔗 View Report
                    </a>

                    {/* Optional embedded viewer if it's a PDF */}
                    {cid.endsWith(".pdf") && (
                      <iframe
                        src={`http://127.0.0.1:8080/ipfs/${cid}`}
                        width="100%"
                        height="400px"
                        title={`Report ${index + 1}`}
                        className="mt-2 border border-gray-600 rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 mb-6">
                No medical reports found for this case.
              </p>
            )}

            <button
              onClick={() => navigate("/view-history")}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition duration-300"
            >
              Back to History
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PatientCaseDetails;