import {
  actionClickRequest,
  completeRequest,
  completeResponse,
} from "./common";
import OpenAI from "openai";
import retry from "./utils/retry";

// like hello world
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// click to open side panel, but something have wrong?
chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const id = tabs[0]?.id;
  if (!id) return;

  chrome.tabs.sendMessage(id, actionClickRequest.parse({}));
});

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  const id = sender.tab?.id;
  if (!id) return;

  const sendMessage = (content: string, finish = false) => {
    chrome.tabs.sendMessage(
      id,
      completeResponse.parse({
        payload: content,
        finish,
      })
    );
  };

  try {
    const { token, payload } = completeRequest.parse(msg);
    const ai = new OpenAI({
      // baseURL: "https://openrouter.ai/api/v1",
      baseURL: "https://api.deepseek.com",
      apiKey: token,
      dangerouslyAllowBrowser: true,
    });

    const stream = await retry(
      () =>
        ai.chat.completions.create({
          // model: "gpt-3.5-turbo-1106",
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: `Summarize the follwing page content: ${payload}`,
            },
          ],
          stream: true,
        }),
      3
    );

    let result = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      result += content;
      sendMessage(result);
    }
    sendMessage(result, true);
  } catch (err) {
    sendMessage((err as Error).message, true);
  }
});
