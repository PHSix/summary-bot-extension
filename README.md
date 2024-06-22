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

4. ~~打开插件的侧边栏功能（需要在拓展列表中打开，chrome.sidePanel.open api 不能用）~~ 点击右上角插件，content script 会往页面中注入一个叫 summary-side 的 dom 并挂载一个 react app

5. 输入你的 openrouter token，保存后插件会自动开始请求总结

# 存在的问题

- [x] 测试不充分（第一次接触插件开发，debug 浪费了所有免费的 token 请求次数，所以我也不确定是否能跑）
- [ ] 没有设置热重载（因为手上的开发环境是 wsl，等 linux 主机到了再测试）
- [ ] 测试使用的是 deepseek 进行测试的，openrouter 的免费 api 已使用完（修改方法为申请 deepseek 的免费 token，在`src/background.ts`里面的`baseURL`进行替换成`https://api.deepseek.com`，同时把 model 替换成`deepseek-chat`）

# 后续 repo 跟进[summary-bot-extension](https://github.com/PHSix/summary-bot-extension)
