# Summary bot extension

使用了 Vite+react 框架搭建

使用方法：

1.

```
git clone <this repo>
cd <repo>
pnpm i
pnpm build
```

2. 添加解压的插件目录 dist 到你的 chrome 浏览器中

3. 打开[https://www.shopify.com/blog/floof-cotton-candy](https://www.shopify.com/blog/floof-cotton-candy)网站

4. 打开插件的侧边栏功能（需要在拓展列表中打开，chrome.sidePanel.open api 不能用）

5. 输入你的 openrouter token，插件会自动开始请求总结

# 存在的问题

1. 测试不充分（第一次接触插件开发，debug 浪费了所有免费的 token 请求次数，所以我也不确定是否能跑）
2. 没有设置热重载（因为手上的开发环境是 wsl，等 linux 主机到了再测试）

# 后续 repo 跟进[summary-bot-extension](https://github.com/PHSix/summary-bot-extension)
