var app = getApp();
var urlList = require('../../config');
Page({
    data: {
        codeTxt: '发送验证码',
        codeDisabled: false,
        disabled: false,
        loading: false
    },
    sendCode: function () {
        var that = this;
        that.setData({
            codeDisabled: true
        });
        var time = 60;
        var codeTimer = setInterval(function () {
            time--;
            if (time <= 0) {
                that.setData({
                    codeDisabled: false,
                    codeTxt: '重发验证码'
                });
                clearInterval(codeTimer);
                return;
            }
            that.setData({
                codeTxt: time + '秒后重试'
            });
        }, 1000)
    },
    formSubmit: function (e) {
        var _sendObj=e.detail.value;
        var sendObj={mobile: _sendObj.mobile,openid:app.globalData.openid};
        var that=this;
        wx.showLoading({
            title: '请稍后...',
            mask:true
        });
        that.setData({
            loading: true
        });
        app.sendPost(urlList.updateMobile,sendObj,function (data) {
            if(data.code==0){
               var cachiObj=wx.getStorageSync('order');
                console.log('缓存数据',cachiObj);
                //入库
                if(cachiObj){
                    app.sendPost(urlList.addOrderUrl,cachiObj,function (data) {
                        if(data.code==0) {
                            wx.switchTab({url: '/page/user/user'})
                        }
                    });
                }else {
                    wx.switchTab({url: '/page/user/user'})
                }


            }
        });

    }
});
