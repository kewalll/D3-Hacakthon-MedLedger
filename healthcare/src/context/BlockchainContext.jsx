import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers"; // ✅ Use BrowserProvider
import HealthcareABI from "../contracts/HealthcareABI.json";

const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (window.ethereum) {
                const provider = new BrowserProvider(window.ethereum); // ✅ Use BrowserProvider
                const signer = await provider.getSigner();
                const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Store in .env

                const contractInstance = new Contract(contractAddress, HealthcareABI, signer); // ✅ Use Contract from ethers

                setContract(contractInstance);

                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) setAccount(accounts[0]);
            }
        };

        loadBlockchainData();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
        } else {
            alert("MetaMask not detected");
        }
    };

    return (
        <BlockchainContext.Provider value={{ account, contract, connectWallet }}>
            {children}
        </BlockchainContext.Provider>
    );
};

export const useBlockchain = () => useContext(BlockchainContext);
