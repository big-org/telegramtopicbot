var TelegramBot = require('node-telegram-bot-api');
var path = require('path');
var store = require('data-store')('app', {});
var t_token = require('./telegram-token.js'); // Set Telegram Bot Token
var token = t_token.token();
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
// store.del({force: true});

// Any kind of message
bot.on('message', function (msg) {
  console.log(msg);
  var fromId = msg.chat.id || msg.from.id,
      message = msg.text || "",
      identifier = msg.chat.id.toString();
  if(message.match(/^\/settopic/i) ) {
    store.set(identifier, "##");
    bot.sendMessage(fromId, "Okay, Give me the Topic...");
  } else if(message.match(/^\/topic/i) ) {
    if(typeof(store.get(identifier)) !== 'undefined') {
      bot.sendMessage(fromId, "Topic is: *" + store.get(identifier) + "*", {parse_mode: "Markdown"});
    } else {
      bot.sendMessage(fromId, "No topic Set, try /settopic@chattopic_bot ");
    }
  } else {
    if(typeof(store.get(identifier)) !== 'undefined' && store.get(identifier) === "##") {
      store.set(identifier, msg.text);
      bot.sendMessage(fromId, "Topic Set to: *" + msg.text + "* by @" +  msg.from.username, {parse_mode: "Markdown"});
    }
  }
});
