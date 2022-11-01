/*
 * @FilePath: /github-event-discord-listener/send_events.js
 * @author: Wibus
 * @Date: 2022-11-01 17:51:31
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-01 19:11:35
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

const body = (content, username) => {
  return {
    content,
    username: `[GitHub] ${username}` || "GitHub",
    avatar_url: username ? `https://github.com/${username}.png` : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  }
}

console.log(latest);

usernames.forEach(async function (username) {
  const url = `https://api.github.com/users/${username}/events/public`;
  const data = await fetch(url).then((res) => res.json());
  // const latestEvent = data[0];
  const events = data.slice(0, 5);
  let message = `**${username}** has new events:\n`;
  let _id = [];
  let _Events = events
    .map((event) => {
      const { id, type, repo, payload } = event;
      const { action } = payload;
      const { name } = repo;

      if (originalEvents[username] >= id) return "";

      switch (type) {
        case "IssuesEvent":
          _id.push(id);
          return `🐛 [${name}] ${action} issue`

        case "PullRequestEvent":
          _id.push(id);
          return `📦 [${name}] ${action} pull request`

        case "WatchEvent":
          _id.push(id);
          return `⭐️ [${name}] starred`;
        default:
          return "";
      }
    }).filter((event) => event !== "").join("\n")

  latest[username] = _Events[0].id;
  message = message + _Events;
  messages.push(message);
  fetch(webhook, {
    method: "POST",
    headers,
    body: JSON.stringify(body(message, username)),
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