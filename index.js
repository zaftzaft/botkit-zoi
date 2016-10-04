#!/usr/bin/env node
'use strict';

const Botkit         = require("botkit");
const ArgumentParser = require("argparse").ArgumentParser;
const Promise        = require("bluebird");
const fs             = Promise.promisifyAll(require("fs"));


const tokenEnv = "BOTKIT_ZOI_TOKEN";
const token = process.env[tokenEnv];

const parser = new ArgumentParser({
  description: "botkit-zoi"
});

parser.addArgument(["-c", "--config"], {
  help: "config file path",
  required: true
});

const options = parser.parseArgs();

if(!token){
  console.error(`[Error] \$${tokenEnv} is not set`);
  process.exit(1);
}


fs.readFileAsync(options.config, "utf8")
.then(config => {
  return JSON.parse(config);
})
.then(zoisConfig => {
  return normalizeZois(zoisConfig);
})
.then(zois => {
  return main(options, zois, token);
})
.catch(e => {
  console.error(`[Error] ${e.stack}`);
  process.exit(1);
});


function main(options, zois, token){

  const controller = Botkit.slackbot({
    debug: false
  });

  controller.spawn({
    token: token
  }).startRTM();

  controller.hears(["all"], ["direct_message", "direct_mention", "mention"], (bot, message) => {
    let all = Object.keys(zois).map(key => {
      return `${key}(${zois[key].images.length})`;
    })
    .join(", ");


    bot.reply(message, all);
  });

  controller.hears(Object.keys(zois), ["direct_message", "direct_mention", "mention"], (bot, message) => {
    const match = message.match[0];

    let images = zois[match].images;
    let replyImage = images[(Math.floor(Math.random() * images.length))];

    bot.reply(message, `${replyImage}#${+new Date}`);
  });

}


function normalizeZois(zoisConfig){
  /*
   * [{word: "a", image: []}] => {`word`: {images: []}}
   */
  return zoisConfig.reduce((zois, z) => {
    if(!zois[z.word]){
      zois[z.word] = {
        images: []
      };
    }

    zois[z.word].images = zois[z.word].images.concat(z.image);

    return zois;
  }, {});
}
