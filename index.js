
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

const bot = new TelegramBot(TOKEN, { polling: true });

const MAX_TASKS = 10;
const COOLDOWN = 5 * 60 * 1000;
const POINTS_PER_TASK = 100;

const smartLinks = [
  "https://www.effectivegatecpm.com/eqtq5x2q6f?key=48f7e1b04d6a05a147ba8c666e1eb2f1",
  "https://www.effectivegatecpm.com/ryebxy0yv?key=ddfe566689209bcdd123a350c5b1e7da",
  "https://www.effectivegatecpm.com/kwdahvmz?key=9fbd2e63bfd0881537168f71d2e8e6b3",
  "https://www.effectivegatecpm.com/gtcjtp473?key=7a95e47ac3f99a6948edffc6387c1bcd",
  "https://www.effectivegatecpm.com/qazjrjfq?key=bf7417f5d939164581ece26b1c467d96",
  "https://otieu.com/4/10077920",
  "https://otieu.com/4/10023817",
  "https://otieu.com/4/10248744",
  "https://otieu.com/4/10237845",
  "https://otieu.com/4/10252576"
];

let users = {};
let linkIndex = 0;

function today() {
  return new Date().toDateString();
}

function resetDaily(user) {
  if (user.lastDay !== today()) {
    user.tasks = 0;
    user.lastDay = today();
  }
}

bot.onText(/\/start/, (msg) => {
  users[msg.from.id] ||= { tasks: 0, lastClick: 0, points: 0, lastDay: today() };
  bot.sendMessage(msg.chat.id, "Welcome to TaskHub. Use /task to begin.");
});

bot.onText(/\/task/, (msg) => {
  const user = users[msg.from.id] ||= { tasks: 0, lastClick: 0, points: 0, lastDay: today() };
  resetDaily(user);
  const now = Date.now();

  if (user.tasks >= MAX_TASKS) return bot.sendMessage(msg.chat.id, "Daily limit reached.");
  if (now - user.lastClick < COOLDOWN) return bot.sendMessage(msg.chat.id, "Wait 5 minutes.");

  const link = smartLinks[linkIndex % smartLinks.length];
  linkIndex++;
  user.tasks++;
  user.points += POINTS_PER_TASK;
  user.lastClick = now;

  bot.sendMessage(msg.chat.id, `Task ${user.tasks}/10`, {
    reply_markup: { inline_keyboard: [[{ text: "Open Task", url: link }]] }
  });
});

bot.onText(/\/stats/, (msg) => {
  if (String(msg.from.id) !== String(ADMIN_ID)) return;
  bot.sendMessage(msg.chat.id, `Users: ${Object.keys(users).length}`);
});
