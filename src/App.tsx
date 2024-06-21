import { useEffect, useState } from "react";
import { RequestMessageType, ResponseMessage } from "./type";
import { Button, Skeleton, TextField } from "@mui/material";
import * as marked from "marked";

function Internal(props: { port: chrome.runtime.Port }) {
  const [apiKey, setApiKey] = useState("");
  const [htmlContent, setHtmlContent] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function save() {
    chrome.storage.local.set({ "api-key": apiKey });
    props.port.postMessage({
      method: "changeApiKey",
      payload: apiKey,
    } as RequestMessageType);
  }

  useEffect(() => {
    chrome.storage.local.get("api-key").then((res) => {
      setApiKey(res["api-key"]);
    });

    props.port.onMessage.addListener((msg) => {
      try {
        const { type, payload } = ResponseMessage.parse(msg);

        if (type === "stream") {
          setLoading(false);
          setHtmlContent(marked.parse(payload));
        } else if (type === "loading") {
          setLoading(true);
        }
      } catch {}
    });
  }, []);

  return (
    <main
      style={{
        width: "100vw",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          gap: "12px",
        }}
      >
        <span>API KEY</span>
        <TextField
          style={{ flex: 1 }}
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
        />
        <Button onClick={save} variant="contained">
          保存
        </Button>
      </div>
      <div style={{ width: "100%", padding: "10px" }}>
        {loading ? (
          <Skeleton animation="wave" height={200} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: htmlContent ?? "" }}></div>
        )}
      </div>
    </main>
  );
}

export default Internal;
