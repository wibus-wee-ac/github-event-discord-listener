/*
 * @FilePath: /github-event-discord-listener/send_events.js
 * @author: Wibus
 * @Date: 2022-11-01 17:51:31
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-01 18:42:13
 * Coding With IU
 */

const jsonFile = require('./latest.id.json');
const subscribersFile = require('./subscribers.json');
const fs = require('fs/promises');

const json = jsonFile;
const subscribers = subscribersFile;

const usernames = subscribers;
var messages = [];
var latest = json;
const originalEvents = json;

const webhook = process.env.WEBHOOK;

const headers = {
  "Content-Type": "application/json",
}

const body = (content) => {
  return {
    content,
    username: "GitHub",
    avatar_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  }
}

console.log(latest);

usernames.forEach(async function (username) {
  const url = `https://api.github.com/users/${username}/events/public`;
  const data = await fetch(url).then((res) => res.json());
  const latestEvent = data[0];
  if (latestEvent.id === originalEvents[username]) {
    return;
  }
  latest[username] = data[0].id;
  const events = data.slice(0, 5);
  let message = `**${username}** has new events:\n`;
  let theEvents = events
    .map((event) => {
      const { type, repo, payload } = event;
      const { action } = payload;
      const { name } = repo;

      switch (type) {
        case "IssuesEvent":
          return `🐛 [${name}] ${action} issue`;
        case "PullRequestEvent":
          return `📦 [${name}] ${action} pull request`;
        case "WatchEvent":
          return `⭐️ [${name}] starred`;
        default:
          return "";
      }
    }
    )
    .filter((event) => event !== "")
    .join("\n");
  message = message + theEvents;
  messages.push(message);
  fetch(webhook, {
    method: "POST",
    headers,
    body: JSON.stringify(body(message)),
  })
    .then((res) => {
      console.log(`${username} ok`)
      console.log(latest, `${username} latest`);
      fs.writeFile('./latest.id.json', JSON.stringify(latest)).then(() => {
        console.log('latest.id.json updated');
      }).catch((err) => {
        console.log(err);
      });

    })
    .catch((err) => { console.log(err) });
})