// src/components/IPFSStatus.jsx
import { useState, useEffect } from 'react';
import { checkIPFSConnection } from '../utils/ipfsService';

const IPFSStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [nodeInfo, setNodeInfo] = useState(null);
  const [status, setStatus] = useState('Checking IPFS connection...');
  const [errorDetails, setErrorDetails] = useState('');
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { isConnected, nodeInfo, error } = await checkIPFSConnection();
        setIsConnected(isConnected);
        setNodeInfo(nodeInfo);
        
        if (isConnected) {
          setStatus('Connected to IPFS Desktop');
          setErrorDetails('');
        } else {
          setStatus('Failed to connect to IPFS Desktop');
          setErrorDetails(error || 'Connection failed');
        }
      } catch (error) {
        console.error('Error checking IPFS connection:', error);
        setIsConnected(false);
        setStatus('Error checking IPFS connection');
        setErrorDetails(error.message);
      }
    };
    
    checkConnection();
    // Check connection periodically
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const troubleshootingSteps = [
    "Make sure IPFS Desktop application is running",
    "Check that IPFS Desktop is listening on port 5001 (API) and 8080 (Gateway)",
    "Ensure your browser allows localhost connections",
    "Try restarting IPFS Desktop if it's already running",
    "Check IPFS settings to ensure API access is enabled"
  ];

  return (
    <div className={`rounded-md p-3 mb-4 ${isConnected ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">{status}</span>
        </div>
        
        {!isConnected && (
          <button 
            onClick={() => setShowTroubleshooting(!showTroubleshooting)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {showTroubleshooting ? 'Hide Help' : 'Show Help'}
          </button>
        )}
      </div>
      
      
      
      {!isConnected && (
        <div>
          <p className="mt-2 text-sm text-red-300">
            Cannot connect to IPFS Desktop. File uploads will not work.
          </p>
          
          {errorDetails && (
            <p className="mt-1 text-xs text-red-300">
              Error: {errorDetails}
            </p>
          )}
          
          {showTroubleshooting && (
            <div className="mt-3 p-3 bg-gray-800 rounded-md">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Troubleshooting Steps:</h4>
              <ol className="text-xs text-gray-300 space-y-1 list-decimal pl-4">
                {troubleshootingSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <div className="mt-3 p-2 bg-gray-700 rounded text-xs">
                <p className="font-medium text-gray-300">Technical Details:</p>
                <p className="text-gray-400">API URL: http://127.0.0.1:5001/api/v0</p>
                <p className="text-gray-400">Gateway URL: http://127.0.0.1:8080/ipfs/</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IPFSStatus;