const fs = require('fs');
const { getDate } = require('./utils');


const path = `${__dirname}/dataTemp.json`;

const setTemp = () => {
  const { curDate, todayTime, curTime } = getDate();
  const list = JSON.parse(fs.readFileSync(`${__dirname}/history.json`));
  const lastDayRow = list[list.length - 1];
  const row = JSON.parse(fs.readFileSync(path));
  row.data.forEach((item) => {
    lastDayRow.data.forEach((lastItem) => {
      if (item.code === lastItem.code) {
        item.basePrice = lastItem.basePrice;
        item.name = lastItem.name;
        item.estimateRate = 0;
        item.realRate = 0;
        item.realPrice = 0;
      }
    })
  });

  row.time = todayTime;
  row.date = curDate;

  fs.writeFileSync(path, JSON.stringify(row));
};

module.exports = setTemp;
