
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;

if (!TOKEN) {
  console.error("BOT_TOKEN missing");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

const MAX_TASKS = 10;
const POINTS_PER_TASK = 100;

const smartLinks = [
  "https://example.com/task1",
  "https://example.com/task2",
  "https://example.com/task3",
  "https://example.com/task4",
  "https://example.com/task5",
  "https://example.com/task6",
  "https://example.com/task7",
  "https://example.com/task8",
  "https://example.com/task9",
  "https://example.com/task10"
];

let users = {};

function today() {
  return new Date().toDateString();
}

bot.onText(/\/start/, (msg) => {
  const id = msg.from.id;
  if (!users[id] || users[id].date !== today()) {
    users[id] = { tasks: 0, points: 0, date: today() };
  }

  bot.sendMessage(id,
`Welcome to MamabayBot 🎯

Daily Tasks: ${MAX_TASKS}
Reward per task: ${POINTS_PER_TASK} points

Use /task to start earning.`);
});

bot.onText(/\/task/, (msg) => {
  const id = msg.from.id;

  if (!users[id] || users[id].date !== today()) {
    users[id] = { tasks: 0, points: 0, date: today() };
  }

  if (users[id].tasks >= MAX_TASKS) {
    bot.sendMessage(id, "You have completed all tasks for today ✅");
    return;
  }

  const link = smartLinks[users[id].tasks % smartLinks.length];
  users[id].tasks += 1;
  users[id].points += POINTS_PER_TASK;

  bot.sendMessage(id,
`Task ${users[id].tasks}/${MAX_TASKS}

👉 Complete this task:
${link}

You earned ${POINTS_PER_TASK} points 🎉`);
});

bot.onText(/\/balance/, (msg) => {
  const id = msg.from.id;
  const user = users[id];

  if (!user) {
    bot.sendMessage(id, "No activity yet. Use /start");
    return;
  }

  bot.sendMessage(id,
`Your Balance 💰

Points: ${user.points}
Tasks today: ${user.tasks}/${MAX_TASKS}`);
});

console.log("MamabayBot is running...");
