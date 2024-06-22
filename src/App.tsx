import { useEffect, useState } from "react";
import { completeRequest, completeResponse } from "./common";
import { Button, CircularProgress, TextField } from "@mui/material";
import * as marked from "marked";

const STORAGE_KEY = "api-key";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes[STORAGE_KEY]) {
        setApiKey(changes[STORAGE_KEY].newValue);
      }
    });

    chrome.storage.local.get(STORAGE_KEY).then((res) => {
      const cacheToken = res[STORAGE_KEY];
      if (cacheToken) {
        setApiKey(cacheToken);
        // auto request at startup
        sendRequest(cacheToken);
      }
    });

    chrome.runtime.onMessage.addListener(async (msg) => {
      try {
        const { payload, finish } = completeResponse.parse(msg);

        setHtmlContent(await marked.parse(payload));
        if (finish) setLoading(false);
      } catch {}
    });
  }, []);

  function save() {
    chrome.storage.local.set({ [STORAGE_KEY]: apiKey });
    sendRequest(apiKey);
  }

  function sendRequest(token: string) {
    if (token.length === 0) console.log("请输入token");
    const main = document.querySelector("main");
    const h1 = main?.querySelector("h1");
    const paragraphs = main?.querySelectorAll("p");
    const payload: string[] = [];
    setLoading(true);

    if (h1) {
      payload.push(h1.innerHTML);
    }

    if (paragraphs) {
      for (const p of paragraphs) {
        payload.push(p.innerHTML);
      }
    }

    chrome.runtime.sendMessage(
      completeRequest.parse({ payload: payload.join("\n"), token })
    );
  }

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-3 overflow-auto">
      <div className="text-blue-400">
        Let AI help you summarize the content of this page
      </div>
      <div className="flex items-center flex-row w-full gap-4">
        <TextField
          label="API KEY"
          className="flex-1"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
        />
        <Button onClick={save} variant="contained">
          保存
        </Button>
      </div>
      <div className="w-full gap-3">
        {loading && !htmlContent ? (
          <div className="w-full h-48 rounded bg-gray-300 flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className="markdown-body"
          ></div>
        )}
      </div>
    </div>
  );
}

export default App;
