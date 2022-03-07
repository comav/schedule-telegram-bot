require('dotenv').config();

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const { Keyboard, Key } = require('telegram-keyboard');

const lessonData = require('./lessonData.json');
const schedule = require('./schedule.json');

let todaySchedule;
let dayTitles = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

const keyboard = Keyboard.make([['Пн', 'Вт', 'Ср', 'Чт', 'Пт'], ['🔙']])

bot.start((ctx) => ctx.reply('Привіт! Я бот ✨ЕА-31✨. Для допомоги надішли команду /help'));

bot.command('/week', async (ctx) => {
  await ctx.reply('На який день прислати розклад?', keyboard.reply())
    .then((reply) => {
      bot.hears(dayTitles, (ctx) => {
        composeSchedule(ctx.match[0])
          .then(ctx.reply(todaySchedule))
      })
    })
})

bot.hears(dayTitles, (ctx) => {
    composeSchedule(ctx.match[0])
    .then(ctx.reply(todaySchedule))
})

bot.hears('🔙', (ctx) => {
  ctx.reply('Дні сховано', keyboard.remove(true))
})

bot.command('/help', (ctx) => {
  ctx.replyWithMarkdown(
    '**Допомога**\n /help - Допомога, всі команди\n /week - Показати розклад' 
  )
})

async function composeSchedule(day) {
  console.log('Day:', day)
  let dayNum;
  if (day == 'Пн') {
    dayNum = 0
  } if (day == 'Вт') {
    dayNum = 1
  } if (day == 'Ср') {
    dayNum = 2
  } if (day == 'Чт') {
    dayNum = 3
  } if (day == 'Пт') {
    dayNum = 4
  }
  console.log('day num:', dayNum)
  let daySchedule = schedule[dayNum];
  let response = '';
  for (let i = 0; i < daySchedule.schedule.length; i++) {
    let lessonTitle = lessonData.find(x => x.id === daySchedule.schedule[i].id).title;
    let lessonTeacher = lessonData.find(x => x.id === daySchedule.schedule[i].id).teacher;
    response = response + `📚 Предмет: ${lessonTitle}\n👩‍🏫 Вчитель: ${lessonTeacher}\n\n`
    console.log(response);
  }
  todaySchedule = response;
}

bot.launch();