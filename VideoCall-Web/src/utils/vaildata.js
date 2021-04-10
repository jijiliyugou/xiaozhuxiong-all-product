/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-11-03 14:15:50
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-11-03 14:52:41
 */
export let validatePhoneTwo=(rule, value, callback)=> {
    const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback('请输入正确的电话号码或者固话号码');
        } else {
            callback();
        }
    }
}
export let validateEmail =(rule, value, callback)=> {
    if (value === '') {
      callback('请正确填写邮箱');
    } else {
      if (value !== '') { 
        var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if(!reg.test(value)){
          callback('请输入有效的邮箱');
        }
      }
    }
  };
export let validatePassword = (rule, value, callback) => {
    var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
    if (value === '') {
        callback('请正确填写密码');
      } else {
        if (!passwordreg.test(value)) {
            callback('密码必须由数字、字母、特殊字符组合,请输入6-16位')
        }
    }
}
export let validatePass= (rule, value, callback)=> {
    if (value === '') {
      callback(new Error('密码格式不正确'));
    } else if(value.length < 6){
      callback(new Error('密码长度最小6位'));
    }else{
      callback();
    }
};

export let validateMobilePhone =(rule, value, callback) =>{
    if (value === '') {
      callback(new Error('手机号不可为空'));
    } else {
      if (value !== '') { 
        var reg=/^1[3456789]\d{9}$/;
        if(!reg.test(value)){
          callback(new Error('请输入有效的手机号码'));
        }
      }
      callback();
    }
};
export let validatePhone=(rule, value,callback)=>{
    const reg =/^[1][3-9][0-9]{9}$/;
    if(value==''||value==undefined||value==null){
      callback();
    }else {
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的电话号码'));
      } else {
        callback();
      }
    }
  }
export let validateIdNo=(rule, value,callback)=> {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(value==''||value==undefined||value==null){
        callback();
    }else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的身份证号码'));
        } else {
            callback();
        }
    }
}
export let checkMax20000=(rule, value, callback)=> {
    if (value == '' || value == undefined || value == null) {
        callback();
    } else if (!Number(value)) {
        callback(new Error('请输入[1,20000]之间的数字'));
    } else if (value < 1 || value > 20000) {
        callback(new Error('请输入[1,20000]之间的数字'));
    } else {
        callback();
    }
}