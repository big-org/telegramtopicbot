var TelegramBot = require('node-telegram-bot-api');
var path = require('path');
var store = require('data-store')('app', {});
var t_token = require('./telegram-token.js'); // Set Telegram Bot Token
var token = t_token.token();
var _ = require('underscore');
var s = require("underscore.string");
_.mixin(s.exports());

// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Any kind of message
bot.on('message', function (msg) {
  var fromId = msg.chat.id || msg.from.id,
      message = msg.text || "",
      identifier = msg.chat.id.toString();

  if(message.match(/^\/settopic/i) ) {
    var text = message.split(/\s(.+)?/)[1]
    clear_identifier_with_text(identifier, msg.from.id.toString());
    if(_.isEmpty(text) || _.isBlank(text) ){
      bot.sendMessage(fromId, "Okay, Give me the Topic...");
    }else {
        store_text_and_respond(fromId, identifier, text, msg.from.first_name)
    }
  } else if(message.match(/^\/topic/i) ) {
    if(typeof(store.get(identifier)) !== 'undefined') {
      bot.sendMessage(fromId, "Topic is: *" + store.get(identifier + '_text') + "*", {parse_mode: "Markdown"});
    } else {
      bot.sendMessage(fromId, "No topic Set, try /settopic@chattopic_bot ");
    }
  } else {
    if(typeof(store.get(identifier)) !== 'undefined' && store.get(identifier) === msg.from.id.toString()) {
      store_text_and_respond(fromId, identifier, msg.text, msg.from.first_name)
    }
  }
});
function clear_identifier_with_text(identifier,text){
  store.set(identifier , text);
}
function store_text_and_respond(fromId, identifier, text, first_name){
  clear_identifier_with_text(identifier , text);
  store.set(identifier + '_text', text);
  bot.sendMessage(fromId, "Topic Set to: *" + text + "* by " +  first_name, {parse_mode: "Markdown"});
};
