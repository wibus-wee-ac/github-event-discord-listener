/*
 * @FilePath: /github-event-discord-listener/send_events.js
 * @author: Wibus
 * @Date: 2022-11-01 17:51:31
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-02 08:54:16
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
  const data = await fetch(url).then((res) => res.json()).catch((err) => { throw new Error(err) });
  if (!data.length > 0) throw new Error("No data found");
  const events = data.slice(0, 5);
  let message = `**${username}** has new events:\n`;
  let _id = [];
  let _Events = events
    .map((event) => {
      const { id, type, repo, payload } = event;
      const { action } = payload;
      const { name } = repo;

      console.log(originalEvents[username] >= id, `${username} -- ${originalEvents[username]} >= ${id}`);

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

  // if (!_id[0]) {
  //   console.error(_id); 
  //   throw new Error("_id[0] is undefined");
  // }
  _id.sort((a, b) => b - a); // 降序
  if (_id && _id[0]) {
    latest[username] = _id[0];
    message = message + _Events;
    messages.push(message);
    fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify(body(message, username)),
    })
      .then((res) => {
        console.log(`${username} ok`)
        console.log(latest, `-- ${username} latest`);
        fs.writeFile('./latest.id.json', JSON.stringify(latest)).then(() => {
          console.log('latest.id.json updated');
        }).catch((err) => {
          console.log(err);
        });

      })
      .catch((err) => { console.log(err) });
  } else {
    console.log(`${username} no new events`);
  }
})