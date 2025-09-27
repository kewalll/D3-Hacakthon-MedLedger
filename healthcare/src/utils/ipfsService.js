// src/utils/ipfsService.js
import { create } from 'ipfs-http-client';

// Create IPFS client pointing to local IPFS Desktop node
// IPFS Desktop typically runs on these ports by default
const ipfs = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
  transport: 'http'  // Explicitly specify HTTP transport
});

// Function to add file to IPFS
export const addFileToIPFS = async (file) => {
  try {
    const result = await ipfs.add(file);
    await ipfs.pin.add(result.cid); // Add this
    return result.path;
  } catch (error) {
    console.error('Error adding file to IPFS:', error);
    throw error;
  }
};



// Function to get file from IPFS - using local gateway
export const getFileFromIPFS = (cid) => {
  return `http://127.0.0.1:8080/ipfs/${cid}`;
};

// Function to pin a file
export const pinFile = async (cid) => {
  try {
    await ipfs.pin.add(cid);
    console.log(`File with CID ${cid} pinned successfully`);
    return true;
  } catch (error) {
    console.error('Error pinning file:', error);
    throw error;
  }
};

// Function to check IPFS connection
export const checkIPFSConnection = async () => {
  try {
    // A simpler check that just verifies the API is responsive
    const version = await ipfs.version();
    
    return {
      isConnected: true,
      nodeInfo: {
        version: version.version
      }
    };
  } catch (error) {
    console.error('IPFS connection error:', error);
    return { 
      isConnected: false, 
      nodeInfo: null,
      error: error.message
    };
  }
};