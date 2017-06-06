var app = getApp();
var urlList = require('../../config');
Page({
  data: {
      codeTxt:'发送验证码',
      codeDisabled: false,
      disabled: false,
      loading: false,
      orderList:[],
      userInfo:null
  },
    onLoad:function () {
        var openid=app.globalData.openid;
        var that=this;
        app.sendGet(urlList.mobile+'?openid='+openid,function (data) {
            if(data.code==0) {
                if (data.vals[0]['nums'] == 0){
                    wx.redirectTo({url: '/page/mobile/mobile'});
                }
            else {
                    that.setData({
                        userInfo: app.globalData.userInfo
                    });
                    //获取列表
                    that.getOrder();
                }
            }
        })
    },
    onShow: function () {
        console.log('user App Launch');
    },
    topRefresh:function () {
        console.log('topRefresh');
    },
    botLoadmore:function () {
        console.log('botLoadmore');
    },
    getOrder:function () {
      var that=this;
      app.sendGet(urlList.sltOrderUrl,function (data) {
          that.setData({
              orderList: data.vals
          });
          console.log('getOrder',data);
      })
    },
    sendCode: function () {
    var that = this;
        that.setData({
            codeDisabled:true
        });
    var time=60;
    var codeTimer=setInterval(function () {
            time--;
            if(time<=0) {
                that.setData({
                    codeDisabled:false,
                    codeTxt:'重发验证码'
                });
                clearInterval(codeTimer);
                return;
            }
            that.setData({
                codeTxt:time+'秒后重试'
            });
        },1000)
  },
    userTypeSelect:function (event) {
        var type = event.target.dataset.type;
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease'
        });
        this.animation = animation;

        animation.translate(type * 100, 0).step();

        this.setData({
            usertype: type,
            animationData: animation.export()
        });
    }
})
