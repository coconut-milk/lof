const schedule = require('node-schedule');
const { update } = require('./update');
const moment = require('moment');

// // 定义规则
let rule = new schedule.RecurrenceRule();
// rule.date = [1];//每月1号
// rule.dayOfWeek = [1, 3, 5]; // 每周一、周三、周五
rule.hour = 23; // 每天23点调用
rule.minute = 0;
rule.second = 0;
// rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; // 每隔 5 分钟执行一次
// rule.second = 0;//每分钟的0秒执行

// // 启动任务
// let job = schedule.scheduleJob(rule, () => {
//   console.log(new Date());
// });
const job = schedule.scheduleJob(rule, function(){
  update();
  console.log('The answer to life, the universe, and everything!' + moment().format('YYYY-MM-DD HH:mm:ss'));
});
