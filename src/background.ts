import OpenRouterService from "./service";
import { ResponseMessageType } from "./type";
let globalViewPort: chrome.runtime.Port | null = null;
let token =
  "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";
const pageContentMap = new Map<number, string>();
let currentPageId: number | null = null;

async function getToken() {
  return chrome.storage.local.get("api-key").then((res) => {
    token = res["api-key"];
  });
}

getToken();

chrome.storage.local.onChanged.addListener(() => {
  getToken().then(() => {
    pullChat();
  });
});

const service = new OpenRouterService();

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

function pullChat() {
  const port = globalViewPort;
  if (!port || !currentPageId) return;
  const currentPageContent = pageContentMap.get(currentPageId);
  if (!currentPageContent) return;
  port.postMessage({
    type: "loading",
  } as ResponseMessageType);

  service
    .chat(
      currentPageContent,
      token,
      (result) => {
        port.postMessage({
          type: "stream",
          payload: result,
        } as ResponseMessageType);
      },
      () => {}
    )
    .catch((e) => {
      console.error(e);
      port.postMessage({
        type: "stream",
        payload: "chat completion request failed",
      });
    });
}

// trying chat on connect
chrome.runtime.onConnect.addListener((port) => {
  globalViewPort = port;
  setTimeout(() => {
    pullChat();
  }, 100);

  port.onDisconnect.addListener(() => {
    globalViewPort = null;
  });
});

// get page content from content script
chrome.runtime.onMessage.addListener((msg, sender) => {
  try {
    if (msg.type === "content_load" && sender.tab) {
      pageContentMap.set(sender.tab.id!, msg.payload);
      pullChat();
    }
  } catch {}
});

// chrome.tabs.onActivated
chrome.tabs.onActivated.addListener((e) => {
  currentPageId = e.tabId ?? currentPageId;
  pullChat();
});

// click to open side panel, but something have wrong?
chrome.action.onClicked.addListener(() => {});
