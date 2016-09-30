#!/usr/bin/env node
'use strict';

const Botkit = require("botkit");
const zois   = require("./zois.js");

const uniqWords = zois.reduce((res, zoi) => {
  if(!res.includes(zoi.word)){
    res.push(zoi.word);
  }
  return res;
}, []);

const tokenEnv = "BOTKIT_ZOI_TOKEN";
const token = process.env[tokenEnv];

if(!token){
  console.error(`[Error] \$${tokenEnv} is not set`);
  process.exit(1);
}

const controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: token
}).startRTM();


controller.hears("hello", ["direct_message", "direct_mention", "mention"], (bot, message) => {
  bot.reply(message, "zoi");
});


controller.hears("zoi", ["direct_message", "direct_mention", "mention"], (bot, message) => {
  bot.reply(message, "https://pbs.twimg.com/media/BspTawrCEAAwQnP.jpg");
});


controller.hears(["一覧", "全部", "all", "list"], ["direct_message", "direct_mention", "mention"], (bot, message) => {
  bot.reply(message, uniqWords.join(", "));
});


controller.hears(uniqWords, ["direct_message", "direct_mention", "mention"], (bot, message) => {
  const match = message.match[0];
  let replyZois = zois.filter(z => z.word === match);

  bot.reply(message, replyZois[(Math.floor(Math.random() * replyZois.length))].image.split(":large")[0]);
});
