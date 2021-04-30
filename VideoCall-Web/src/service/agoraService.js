/*
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-26 10:22:53
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\service\agoraService.js
 * @LastEditTime: 2021-04-27 18:06:13
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
 */
import $flyio from '@plugins/agoraAjax';
//------------------------------------------Meeting-----------------------------------------//
//获取声网会议室用户列表
export let getUserList = (data = {}) => {
    return $flyio.agoraAjax({
        url: `/dev/v1/channel/user/${data.appid}/${data.channelName}`,
    })
};
//创建封禁用户权限规则
export let setKickingRule = (data = {}) => {
    return $flyio.agoraAjax({
        url: '/dev/v1/kicking-rule',
        data:data,
        type:'POST',
        contentType:'application/json'
    })
};
//删除封禁用户权限规则
export let delKickingRule = (data = {}) => {
    return $flyio.delete({
        url: '/dev/v1/kicking-rule',
        data:data,
        contentType:'application/json'
    })
};
