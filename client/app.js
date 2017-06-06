const urlList = require('./config');
var bmap = require('libs/bmap-wx.min.js');
App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    this.getUserOpenId();
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    userInfo:null,
    openid: null,
    BMapKey: 'ZGezuOVLRW6CDetgaGkfhSXPxYybbl7H',
    userType:0
  },
    BMapWX:function () {
       return new bmap.BMapWX({
            ak: 'ZGezuOVLRW6CDetgaGkfhSXPxYybbl7H'
        })
    },
  // lazy loading openid
  getUserOpenId: function(mobile,fn) {
    var self = this;
    var callback=fn||function () {};
    if (self.globalData.openid) {
      callback(self.globalData.userInfo);
    } else {
        wx.login({
            success: function (data) {
                wx.getUserInfo({
                    success: function (res) {
                        var strMobile='';
                        if(mobile) {
                             strMobile = '&mobile=' + mobile;
                        }
                        console.log('getUserInfo:',res);
                        self.globalData.userInfo = res.userInfo;
                        wx.request({
                            url: urlList.openIdUrl + '?code=' + data.code+'&nickname='+res.userInfo.nickName+'&img='+res.userInfo.avatarUrl+'&gender='+res.userInfo.gender+'&city='+res.userInfo.city+strMobile,
                            success: function (res) {
                                console.log('拉取openid成功', res);
                                self.globalData.openid = res.data.openid;
                                callback(self.globalData.userInfo);
                            },
                            fail: function (res) {
                                console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res);
                                callback(null);
                            }
                        })
                    }
                })
            },
            fail: function (err) {
                console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err);
                callback(null)
            }
        })
    }
  },
    sendGet:function (url,callback) {
        wx.request({
            url: url,
            success: function (res) {
                console.log('sendPost成功', res);
                callback(res.data);
            },
            fail: function (res) {
                console.log('sendPost失败', res);
                callback(null);
            }
        })
    },
    sendPost:function (url,data,callback) {
        wx.request({
            url: url,
            header:{
                "content-type":"application/x-www-form-urlencoded"
            },
            data:data,
            method: 'POST',
            success: function (res) {
                console.log('sendPost成功', res);
                callback(res.data);
            },
            fail: function (res) {
                console.log('sendPost失败', res);
                callback(null);
            }
        })
    }
})
