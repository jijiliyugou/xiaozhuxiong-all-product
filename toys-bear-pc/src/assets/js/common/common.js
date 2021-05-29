// 解析二维码插件
import QrCode from "qrcode-decoder";

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
export function formatTime(param) {
  var y = param.getFullYear();
  var m = param.getMonth() + 1;
  var d = param.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  return y + "-" + m + "-" + d;
}

// 筛选消息类型
export function filterMsgTypes(param) {
  let msg = "";
  switch (param.messageType) {
    case "RC:TxtMsg": // 文本消息
      msg = param.content.content;
      break;
    case "XZX:ProductMessage": // 产品消息
      msg = "[产品]";
      break;
    case "XZX:OrderMessage": // 订单消息
      msg = "[订单]";
      break;
    case "XZX:VideoMessage": // 视频消息
      msg = "[视频]";
      break;
    case "RC:VcMsg": // 语音消息
    case "RC:HQVCMsg": // 语音消息
      msg = "[语音]";
      break;
    case "XZX:LinkMessage": // 链接消息
      msg = param.content;
      break;
    case "RC:ImgMsg": // 链接消息
      msg = "[图片]";
      break;
    case "RC:ReferenceMsg": // 引用消息
      msg = "[引用]";
      break;
  }
  return msg;
}

// 压缩图片
export function compress(file, size) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  // let initSize = file.src.length;
  let width = file.width;
  let height = file.height;
  canvas.width = width;
  canvas.height = height;
  // 铺底色
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(file, 0, 0, width, height);
  //进行最小压缩
  let ndata = canvas.toDataURL("image/jpeg", size);
  console.log("*******压缩后的文件大小*******", ndata.length / 1024);
  return ndata;
}

// 图片转bese64
export function base64file(file, type) {
  //判断支不支持FileReader
  if (!file || !window.FileReader) {
    console.log(window.FileReader);
    return false;
  }
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.readAsDataURL(file); // 把图片文件对象转换base64
    if (type === "RC:ImgMsg") {
      //读取成功后的回调
      reader.onloadend = function() {
        let result = this.result;
        let img = new Image();
        img.src = result;
        img.onload = function() {
          const dataURL = compress(img, 0.001);
          resolve(dataURL);
        };
      };
    } else if (type === "XZX:VideoMessage") {
      reader.onloadend = function() {
        let result = this.result;
        let video = document.createElement("video");
        video.setAttribute("crossOrigin", "anonymous"); //处理跨域
        video.setAttribute("src", result);
        video.currentTime = 1; // 第一帧
        video.addEventListener("loadeddata", function() {
          const dataURL = compress(video, 0.1);
          resolve(dataURL);
        });
      };
    }
  });
}
export function getQrUrl(file) {
  // 获取临时路径 chrome有效，其他浏览器的方法请自行查找
  let url;
  if (window.webkitURL) {
    url = window.webkitURL.createObjectURL(file);
  } else if (window.URL) {
    url = window.URL.createObjectURL(file);
  } else {
    return false;
  }
  // 初始化
  const qr = new QrCode();
  // 解析二维码，返回promise
  return qr.decodeFromImage(url);
}
