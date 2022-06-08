const dateObj = new Date();
// 当前年
const year = dateObj.getFullYear();
// 当前月
const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
// 今天
const day = dateObj.getDate().toString().padStart(2, '0');
// 当前日期 格式 0000-00-00
const date = `${year}-${month}-${day}`;

exports.date = date;
