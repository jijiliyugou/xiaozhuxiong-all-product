/*
 * @ pwidth 设计稿的宽度
 * @ prem 你要1rem比多少px  我的是1rem比10px
 * */
(function(doc, win, prem) {
  var docEl = doc.documentElement;
  var resizeEvt =
    "orientationchange" in window ? "orientationchange" : "resize";
  var recalc = function() {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    if (clientWidth < 750) {
      docEl.clientWidth = 750; // 适配关键bug
      docEl.style.fontSize = (clientWidth / 750) * prem + "px";
    } else {
      docEl.clientWidth = 1920; // 适配关键bug
      docEl.style.fontSize = (clientWidth / 1920) * prem + "px";
    }
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window, 100);
