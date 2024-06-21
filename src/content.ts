if (window.location.href.startsWith("https://www.shopify.com/blog/")) {
  const main = document.querySelector("main");
  const title = main?.querySelector("h1");
  const content = main?.querySelectorAll("p");
  const payload: string[] = [];

  if (title) {
    payload.push(title.innerHTML);
  }

  if (content) {
    for (const p of content) {
      payload.push(p.innerHTML.replace(/<\/?[^>]+(>|$)/g, ""));
    }
  }

  chrome.runtime.sendMessage({
    type: "content_load",
    payload: payload.join("\n"),
  });
}
