import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import { actionClickRequest } from "./common";
import "./index.css";
import "github-markdown-css/github-markdown-light.css";

function main() {
  const id = "summary-sidebar";
  const createContainer = () => {
    const ele = document.createElement("div");
    ele.id = id;
    document.body.append(ele);
    return ele;
  };

  const container = document.getElementById(id) ?? createContainer();

  container.id = id;

  container.style.display = "none";

  let root: ReactDOM.Root | null = null;

  chrome.runtime.onMessage.addListener((msg) => {
    if (actionClickRequest.safeParse(msg).success) {
      if (root) {
        container.style.display = "none";
        root.unmount();
        root = null;
      } else {
        container.style.display = "block";
        root = ReactDOM.createRoot(container);
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
      }
    }
  });
}

if (window.location.href.startsWith("https://www.shopify.com/blog/")) {
  main();
}
