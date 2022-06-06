const fs = require('fs');
const axios = require('axios');
const superagent = require("superagent");
const cheerio = require("cheerio");
const { getDate } = require('./utils');

const baseUrl = 'http://fundgz.1234567.com.cn/js';
const realRateUrl = 'http://fund.eastmoney.com';
const path = `${__dirname}/data.json`;
const historyPath = `${__dirname}/history.json`;

const { date, data, todayEarnings } = JSON.parse(fs.readFileSync(path));
const historyData = JSON.parse(fs.readFileSync(historyPath));

const { curDate, todayTime, curTime } = getDate();
const rate = 100;

let estimatePrice = 0;
let realPrice = 0;
if (todayEarnings) {
console.log('-------------------- 净值 ---------------------------------------');
  data.forEach(item => {
    console.log(`${item.name}：${item.realPrice}元`);
  });
  console.log('-------------------- 收益 ---------------------------------------');
  console.log(`今日实际收益：${(todayEarnings)}元`);
  return;
}
console.log('-------------------- 估值 ---------------------------------------');
data.forEach(item => {
  axios.get(`${baseUrl}/${item.code}.js?rt=${curTime}`)
    .then(res => {
      let str = res.data.replace('jsonpgz(', '');
      str = str.replace(');', '');
      const { gszzl, name } = JSON.parse(str);
      item.estimateRate = gszzl;
      item.name = name;
      // 计算估值
      if (!item.isUpdate) {
        estimatePrice += item.estimateRate / rate * item.basePrice;
        console.log(`${item.name}：${item.estimateRate / rate * item.basePrice}`);
      }

      superagent.get(`${realRateUrl}/${item.code}.html?spm=search`)
        .end((err, res) => {
          if (err) {
            console.log(`访问失败 - ${err}`)
          } else {
            const htmlText = res.text;
            const $ = cheerio.load(htmlText);
            const dateText = $('.dataItem02 dt p').text();
            // 代表更新了净值
            if (dateText.includes(date)) {
              item.realRate = $('.dataItem02 .dataNums .ui-font-middle').text().split('%')[0];
              const curRealPrice = item.realRate / rate * item.basePrice;
              // 计算净值
              realPrice += curRealPrice;
              if (!item.isUpdate) {
                item.realPrice = curRealPrice;
                item.basePrice += curRealPrice;
                item.isUpdate = true;
              }
            }
          }
        });

    })
});

setTimeout(() => {
  const writeData = { date: curDate, time: todayTime, data: data, todayEarnings: realPrice };
  fs.writeFileSync(path, JSON.stringify(writeData));
  // 存储历史数据
  const historyTime = historyData.map(e => e.time);
  if (!historyTime.includes(todayTime)) {
    historyData.push(writeData);
    fs.writeFileSync(historyPath, JSON.stringify(historyData));
  }

  console.log('-------------------- 收益 ---------------------------------------');
  console.log(`今日实际收益：${(realPrice)}`);
}, 1000)

