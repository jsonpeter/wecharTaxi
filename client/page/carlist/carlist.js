import { getCarData } from '../../util/cardata'
var app = getApp();
Page({
  data: {
      carbrand:[],
      oldcarBrand:[],
      words:['全部','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  },
    onLoad:function () {
      var carlist=getCarData();
      console.log(carlist);
        this.setData({
            carbrand:carlist,
            oldcarBrand:carlist
        })
    },
    wordSelect:function (e) {
        var _word = e.target.dataset.word;
        var filterWord = [];
        var that = this;
        if(_word=='全部'){
            filterWord=that.data.oldcarBrand;
        }else {
            for (var i = 0; i < that.data.oldcarBrand.length; i++) {
                if (that.data.oldcarBrand[i]['bfirstletter'] == _word) {
                    filterWord.push(that.data.oldcarBrand[i]);
                }
            }
        }
        that.setData({
            carbrand: filterWord
        });
        console.log(filterWord);
    },
    carSubmit:function (e) {
        var car=e.target.dataset.name;
        console.log(car);
        var pages = getCurrentPages();
        var prevPage = pages[0];  //上一个页面
        prevPage.setData({
            car:car
        });
        wx.navigateBack({
            delta: 1
        });
    },
    carBrand:function (e) {
        var id = e.target.dataset.type;
        var carlist=getCarData(id);
        console.log(carlist);
        this.setData({
            carbrand:carlist
        })
    }
})
