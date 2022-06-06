const getDate = () => {
  let dateObj = new Date();
  // 当前年
  const year = dateObj.getFullYear();
  // 当前月
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  // 今天
  const day = dateObj.getDate().toString().padStart(2, '0');
  // 当前日期 格式 0000-00-00
  const date = `${year}-${month}-${day}`;
  // 当前日期时间搓
  const todayTime = new Date(date).getTime();
  const curTime = new Date().getTime();

  return {
    curDate: date,
    curTime,
    todayTime,
  }
}



exports.getDate = getDate;
