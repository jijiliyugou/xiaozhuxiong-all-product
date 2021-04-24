/**
 * 获取年月日时分秒
 * @returns YYYYmmddhhmfss
 */
export function getCurrentTime() {
  let yy = new Date().getFullYear();
  let mm = new Date().getMonth() + 1;
  let dd = new Date().getDate();
  let hh = new Date().getHours();
  let mf =
    new Date().getMinutes() < 10
      ? "0" + new Date().getMinutes()
      : new Date().getMinutes();
  let ss =
    new Date().getSeconds() < 10
      ? "0" + new Date().getSeconds()
      : new Date().getSeconds();
  return (
    yy.toString() +
    (mm < 10 ? "0" + mm : mm.toString()) +
    (dd < 10 ? "0" + dd : dd.toString()) +
    (hh < 10 ? "0" + hh : hh.toString()) +
    mf.toString() +
    ss.toString()
  );
}

/*
 * 时间转换成时间戳显示为多少分钟前，多少天前的处理
 * console.log(dateDiff(1411111111111));
 */
export function dateDiff(time) {
  let timestamp = Number(new Date(time));
  const arrTimestamp = (timestamp + "").split("");
  for (var start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = "0";
    }
  }
  timestamp = arrTimestamp.join("") * 1;

  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - timestamp;

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return "不久前";
  }

  // 计算差异时间的量级
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;

  // 数值补0方法
  var zero = function(value) {
    if (value < 10) {
      return "0" + value;
    }
    return value;
  };

  // 使用
  if (monthC > 12) {
    // 超过1年，直接显示年月日
    return (function() {
      var date = new Date(timestamp);
      return (
        date.getFullYear() +
        "年" +
        zero(date.getMonth() + 1) +
        "月" +
        zero(date.getDate()) +
        "日"
      );
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    return parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    return parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    return parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    return parseInt(minC) + "分钟前";
  }
  return "刚刚";
}

/**
 * 获取公司类型列表
 * @returns Promise<any>
 */
export function getClientTypeList(type, _that) {
  return new Promise((result, reject) => {
    _that.$http
      .post("/api/ServiceConfigurationList", {
        basisParameters: type
      })
      .then(res => {
        if (res.data.result.code === 200) {
          result(res.data.result.item);
        } else {
          reject([]);
        }
      });
  });
}
//计算几天
export function calculateDate(code) {
  if (code) {
    var date = new Date();
    var endTime = formatTime(date);
    var date1 = Date.parse(date);
    var start = "";
    var oneDay = 1000 * 3600 * 24;
    if (code === "全部") {
      console.log(date);
    } else {
      switch (code) {
        // 今天
        case "today":
          start = new Date();
          break;
        // 3天
        case "3天":
          start = date1 - oneDay * 3;
          break;
        // 最近1周
        case "7天":
          start = date1 - oneDay * 7;
          break;
        // 最近15天
        case "15天":
          start = date1 - oneDay * 15;
          break;
        // 最近1月
        case "30天":
          start = new Date();
          start.setMonth(start.getMonth() - 1);
          break;
        // 最近3月
        case "lastThreeMonth":
          start = new Date();
          start.setMonth(start.getMonth() - 3);
          break;
        // 最近半年
        case "lastHalfYear":
          start = date1 - oneDay * 183;
          break;
      }
      const timeData = {
        startTime: formatTime(new Date(start)) + "T00:00:00",
        endTime: endTime + "T23:59:59"
      };
      return timeData;
    }
  }
}
// 格式化时间
function formatTime(param) {
  var y = param.getFullYear();
  var m = param.getMonth() + 1;
  var d = param.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d;
}
