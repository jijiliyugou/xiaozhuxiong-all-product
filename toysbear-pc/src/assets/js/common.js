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
