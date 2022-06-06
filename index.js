const fs = require('fs');
const axios = require('axios');
const { getDate } = require('./utils');

const baseUrl = 'http://fundgz.1234567.com.cn/js';
const path = `${__dirname}/data.json`;
// const tempPath = `${__dirname}/dataTemp.json`;
const historyPath = `${__dirname}/history.json`;

const { time, data } = JSON.parse(fs.readFileSync(path));
const historyData = JSON.parse(fs.readFileSync(historyPath));

// 备份当天数据
// fs.writeFileSync(tempPath, file);

const { curDate, todayTime, curTime } = getDate();
const rate = 100;


let estimatePrice = 0;
let realPrice = 0;
console.log('-------------------- 估值 ---------------------------------------');
data.forEach(item => {
  axios.get(`${baseUrl}/${item.code}.js?rt=${curTime}`)
  .then(res => {
    let str = res.data.replace('jsonpgz(', '');
    str = str.replace(');', '');
    const { gszzl, jzrq, name } = JSON.parse(str);
    item.estimateRate = gszzl;
    item.name = name;

    const resDate = new Date(jzrq).getTime();
    // 净值已更新
    if (resDate === item.time) {
      console.log('执行了', item.name);
    //   // 计算净值
    //   realPrice += item.realRate / rate * item.basePrice;
    //   item.basePrice += item.realRate / rate * item.basePrice;
    }

    // console.log(item.name + '：' + item.estimateRate / rate * item.basePrice);
    // 计算估值
    estimatePrice += item.estimateRate / rate * item.basePrice;
  })
});

setTimeout(() => {
  fs.writeFileSync(path, JSON.stringify({ date: curDate, time: todayTime, data: data }));
  // 存储历史数据
  const historyTime = historyData.map(e => e.time);
  if (!historyTime.includes(todayTime)) {
    historyData.push({ date: curDate, time: todayTime, data: data });
    fs.writeFileSync(historyPath, JSON.stringify(historyData));
  }

  console.log('-------------------- 收益 ---------------------------------------');
  console.log(`今日估值收益：${(estimatePrice)}`);
  console.log(`今日实际收益：${(realPrice)}`);
}, 1000)

