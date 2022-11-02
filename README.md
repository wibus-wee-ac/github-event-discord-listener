# github-event-discord-listener

> Listen to personal activity on GitHub and send to Discord | 监听 GitHub 个人活动并发送至 Discord | 
>
> [呀！(o^^o) 使用 CronJob 同步 GitHub 用户的活动 -- 秉松博客](https://blog.iucky.cn/posts/programming/use-cronjob-to-listen-github-user-events)

## 原理

GitHub 有一个 Webhook 功能，可以在特定的事件发生时，向指定的 URL 发送一个 HTTP 请求。但是我们需要监听用户活动，这是无法被主动触发的，所以只好暂时使用 cronjob 来定时向 GitHub 发送请求，获取用户活动。

## 部署

1. 修改 `subscribe.json`，添加你想要监听的用户
2. 清理 `latest.id.json`，确保里面的内容仅为 `{}`，并且不要修改文件名
3. 前往 Settings -> Secrets，添加 `WEBHOOK`，值为 Discord Webhook 的 URL/TOKEN

## 说明

- 本项目使用 GitHub Actions 进行部署，每 15 分钟运行一次
- 本项目使用了 Node v18 的 Fetch 特性，不支持向下版本。

## Author

github-event-discord-listener © Wibus, Released under MIT. Created on Nov 1, 2022

> [Personal Website](http://iucky.cn/) · [Blog](https://blog.iucky.cn/) · GitHub [@wibus-wee](https://github.com/wibus-wee/) · Telegram [@wibus✪](https://t.me/wibus_wee)

