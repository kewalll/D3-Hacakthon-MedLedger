import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Only define Router here
import App from "./App";
import { BlockchainProvider } from "./context/BlockchainContext";
import "./index.css"; // Optional styling

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BlockchainProvider> {/* ✅ Wrap the context provider here */}
            <BrowserRouter>   {/* ✅ BrowserRouter should be here, not inside App.jsx */}
                <App />
            </BrowserRouter>
        </BlockchainProvider>
    </React.StrictMode>
);
