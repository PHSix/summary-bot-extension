import OpenAI from "openai";
import retry from "./utils/retry";

export default class OpenRouterService {
  private ais: Map<string, OpenAI> = new Map();

  async chat(
    content: string,
    token: string,
    callback: (result: string) => void,
    onFisinsh: () => void
  ): Promise<void> {
    let ai = this.ais.get(token);
    if (!ai) {
      ai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: token,
        dangerouslyAllowBrowser: true,
      });

      this.ais.set(token, ai);
    }
    const stream = await retry(
      () =>
        ai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
              role: "user",
              content: `Summarize the follwing page content: ${content}`,
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
      callback(result);
    }

    onFisinsh();
  }
}
