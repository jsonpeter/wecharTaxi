/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

//var host = "14592619.qcloud.la";
var host = "http://192.168.0.164:3100";

var config = {
    // 用code换取openId
    openIdUrl: host+'/openid',
    // 修改手机号
    updateMobile: host+'/updatemobile',
    // 查询手机号
    mobile: host+'/mobile',
    // 添加订单行程
    addOrderUrl: host+'/addorder',
    // 获取订单行程
    sltOrderUrl: host+'/order'
};

module.exports = config;
