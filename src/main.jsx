import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter} from "react-router-dom";
import App from "./App";
import "./index.css";
import { initSecurityMeasures } from "./utils/securityUtils";


ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>,
);

// Initialize security measures
initSecurityMeasures();
