/*
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-13 15:01:44
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\service\meetingService.js
 * @LastEditTime: 2021-04-26 15:51:34
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
 */
import $flyio from '@plugins/ajax';
//------------------------------------------Meeting-----------------------------------------//
//创建会议室
export let CreateMeetingRoom = (data = {}) => {
    return $flyio.post({
        url: '/api/Meeting/CreateMeetingRoom',
        data: data
    })
};
//关闭会议室
export let CloseMeetingRoom = (data = {}) => {
    return $flyio.post({
        url: '/api/Meeting/CloseMeetingRoom',
        data: data
    })
};
//加入会议室
export let JoinMeetingRoom = (data = {}) => {
    return $flyio.post({
        url: '/api/Meeting/JoinMeetingRoom',
        data: data,
    })
};
//退出会议室
export let QuitMeetingRoom = (data = {}) => {
    return $flyio.post({
        url: '/api/Meeting/QuitMeetingRoom',
        data: data
    })
};
//查询会议室信息
export let QueryMeetingRoom = (data = {}) => {
    return $flyio.post({
        url: '/api/Meeting/QueryMeetingRoom',
        data: data
    })
};
//查询会议室成员
export let QueryMeetingRoomMembers = (data = {}) => {
    return $flyio.ajax({
        url: '/api/Meeting/QueryMeetingRoomMembers',
        data: data
    })
};
//修改会议室结束时间
export let Update = (data = {}) => {
    return $flyio.post({
        url: '/api/Meeting/Update',
        data: data
    })
};
//------------------------------------------Product-----------------------------------------//
//根据公司编号获取产品信息
export let QueryProductByCompanyNumber = (data = {}) => {
    return $flyio.ajax({
        url: '/api/Product/QueryProductByCompanyNumber',
        data: data
    })
};
//------------------------------------------SampleOrder-----------------------------------------//
//根据择样代号和验证码查询择样单详情列表
export let QuerySampleOrderDetails = (data = {}) => {
    return $flyio.ajax({
        url: '/api/SampleOrder/QuerySampleOrderDetails',
        data: data
    })
};
//添加择样单详情
export let AddSampleOrderDetail = (data = {}) => {
    return $flyio.post({
        url: '/api/SampleOrder/AddSampleOrderDetail',
        data: data
    })
};
//删除择样单详情
export let DeleteSampleOrderDetail = (data = {}) => {
    return $flyio.post({
        url: '/api/SampleOrder/DeleteSampleOrderDetail',
        data: data
    })
};