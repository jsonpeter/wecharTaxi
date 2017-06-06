var  formatTime=require('../../util/date');
var util = require('../../util/util.js');
var urlList = require('../../config');
var app = getApp();
var playTimeInterval;
var recordTimeInterval;
Page({
    data: {
        title: 'js测试文字',
        cityArry: ['成都市','巴中市', '通江县', '南江县', '平昌县'],
        moneyArry:['100元/人','110元/人','120元/人','130元/人','150元/人','200元/人'],
        personArry:['1人','2人','3人','4人','5人以上'],
        tmpText:'价格',
        address1: '',
        address2: '你要去哪儿',
        latitude:'',
        longitude:'',
        goData:formatTime(new Date(), 1),
        car:'',
        person:1,
        money:'100',
        usertype:0,
        btntxt:'确认发布',
        recording: false,
        playing: false,
        hasRecord: false,
        voiceshow:false,
        recordTime: 0,
        playTime: 0,
        formatedRecordTime: '00:00:00',
        formatedPlayTime: '00:00:00',
        sugData:''
    },
    switchChange:function (e) {
        console.log('switch1 发生 change 事件，携带值为', e.detail.value);
        this.setData({
            voiceshow:e.detail.value
        })
    },
    startRecord: function () {
        this.okVoice();
        this.setData({ recording: true });
        var that = this;
        recordTimeInterval = setInterval(function () {
            var recordTime = that.data.recordTime += 1
            that.setData({
                formatedRecordTime: util.formatTime(that.data.recordTime),
                recordTime: recordTime
            })
        }, 1000)
        wx.startRecord({
            success: function (res) {
                that.setData({
                    hasRecord: true,
                    tempFilePath: res.tempFilePath,
                    formatedPlayTime: util.formatTime(that.data.playTime)
                });
            },
            complete: function () {
                that.setData({ recording: false });
                clearInterval(recordTimeInterval)
            }
        })
    },
    stopRecord: function() {
        wx.stopRecord();
    },
    stopRecordUnexpectedly: function () {
        var that = this;
        wx.stopRecord({
            success: function() {
                console.log('stop record success');
                clearInterval(recordTimeInterval);
                that.setData({
                    recording: false,
                    hasRecord: false,
                    recordTime: 0,
                    formatedRecordTime: util.formatTime(0)
                })
            }
        })
    },
    playVoice: function () {
        var that = this;
        playTimeInterval = setInterval(function () {
            var playTime = that.data.playTime + 1;
            console.log('update playTime', playTime);
            that.setData({
                playing: true,
                formatedPlayTime: util.formatTime(playTime),
                playTime: playTime
            })
        }, 1000);
        wx.playVoice({
            filePath: this.data.tempFilePath,
            success: function () {
                clearInterval(playTimeInterval);
                var playTime = 0;
                console.log('play voice finished');
                that.setData({
                    playing: false,
                    formatedPlayTime: util.formatTime(playTime),
                    playTime: playTime
                })
            }
        })
    },
    okVoice:function () {
        //上传
        var that=this;
        var tempFilePaths = this.data.filePath;
        console.log('uploadFileUrl',urlList.uploadFileUrl);
        wx.uploadFile({
            url: urlList.uploadFileUrl,
            filePath: tempFilePaths,
            name: 'file',
            formData: {
                'user': 'test'
            },
            success: function (res) {
                var data = res.data;
                that.clear();
                console.log('上传', data);
            },
            fail:function (e) {
                console.log('上传失败', e.errMsg);
            }
        })
    },
    stopVoice: function () {
        clearInterval(playTimeInterval)
        this.setData({
            playing: false,
            formatedPlayTime: util.formatTime(0),
            playTime: 0
        })
        wx.stopVoice()
    },
    clear: function () {
        clearInterval(playTimeInterval);
        wx.stopVoice();
        this.setData({
            playing: false,
            hasRecord: false,
            tempFilePath: '',
            formatedRecordTime: util.formatTime(0),
            recordTime: 0,
            playTime: 0
        })
    },
    setCar: function(val) {
        this.setData({
            car:val
        })
    },
    showAddress: function() {
        var city=this.data.cityArry;
        var that=this;
        this.showActionSheet(city,function (data) {
            that.setData({
                address2:data
            });
        });
    },
    showPersonMoney:function () {
        var that=this;
        var mlist=this.data.moneyArry;
        var plist=this.data.personArry;
        that.showActionSheet(plist,function (data) {
            that.setData({
                person:data.substr(0,1)
            });
            that.showActionSheet(mlist,function (data) {
                that.setData({
                    tmpText:data+'x'+that.data.person,
                    money:data.substr(0,3)
                });
            });
        });
    },
    dateChange:function (e) {
        this.setData({
            goData: e.detail.value
        });
    },
    carBrand:function () {
        wx.navigateTo({url: '/page/carlist/carlist' })
    },
    //弹出选择框
    showActionSheet:function (ary,callback) {
        wx.showActionSheet({
            itemList:ary,
            success: function(res) {
                var _city=ary[res.tapIndex];
                if(callback){
                    callback(_city);
                }
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    },
    onLoad:function () {
        var that=this;
        wx.removeStorageSync('order');
        wx.showNavigationBarLoading();
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                that.setData({
                    address1:latitude
                });
                wx.request({
                    url: 'https://api.map.baidu.com/geocoder/v2/?location='+latitude+','+longitude+'&output=json&pois=1&ak='+app.globalData.BMapKey,
                    success: function(res) {
                        wx.hideNavigationBarLoading();
                        var data=res.data;
                        var _adr='地址获取失败，请手动输入';
                        if(!data.status) {
                            _adr=data.result.formatted_address;
                        }
                        that.setData({
                            address1:_adr.replace('四川省',''),
                            latitude:latitude,
                            longitude:longitude
                        });
                    }
                });
            }
        });
    },
    // 绑定input输入
    bindKeyInput: function(e) {
        var that = this;
        // 新建百度地图对象
        var BMap =app.BMapWX();
        var fail = function(data) {
            console.log(data)
        };
        var success = function(data) {
            var sugData = '';
            for(var i = 0; i < data.result.length; i++) {
                sugData = sugData + data.result[i].name + '\n';
            }
            that.setData({
                sugData: sugData
            });
        }
        // 发起suggestion检索请求
        BMap.suggestion({
            query: e.detail.value,
            region: '四川',
            city_limit: true,
            fail: fail,
            success: success
        });
    },
    pathGo:function () {
            wx.navigateTo({ url: '/page/API/index' })
    },
    //确认发布
    btnSendOrder:function () {
        var openid=app.globalData.openid;
        var orderData= {
            address1: this.data.address1,
            address2: this.data.address2,
            date: this.data.goData,
            type: this.data.usertype,
            car: this.data.car,
            openid: openid,
            person: this.data.person,
            money: this.data.money
        };
        //检测登录
        if(!openid){
            // 存缓存
            wx.setStorageSync({
                key:"order",
                data:orderData
            });
            wx.navigateTo({ url: '/page/mobile/mobile' });
        }else{
            //入库
            wx.showLoading({
                title: '请稍后...',
                mask:true
            });
            app.sendPost(urlList.addOrderUrl,orderData,function (data) {
                if(data.code==0) {
                    wx.hideLoading();
                    wx.switchTab({url: '/page/user/user'})
                }else{

                }
            });
        }
        wx.hideLoading();

    },
    userTypeSelect:function (event) {
        var type=event.target.dataset.type;
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease'
        });
        this.animation = animation;

        animation.translate(type*100,0).step();

        this.setData({
            usertype:type,
            animationData:animation.export()
        });
    }
})