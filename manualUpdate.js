const { update } = require('./update');
const moment = require('moment');


update().then(() => {
  console.log(`手动更新时间${moment().format('YYYY-MM-DD HH:mm:ss')}`);
}).catch((err) => {
  console.log(err);
});
