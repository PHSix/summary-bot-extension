import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const port = chrome.runtime.connect();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App port={port} />
  </React.StrictMode>
);
