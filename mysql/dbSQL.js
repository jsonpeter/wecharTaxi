/**
 * Created by Xie on 2017/5/18.
 */
const sdate = require('silly-datetime');

module.exports = {
    user: {
        selectOpenID: function (openid) {
            return 'SELECT  count(id) as nums  FROM user where openid="' + openid+'"';
        },
        selectMobile:function (openid) {
            return 'SELECT count(id) as nums FROM user where openid="' + openid+'" and mobile!="null"';
        },
        insert: function (obj) {
            var time=sdate.format(new Date(), 'YYYY-MM-DD HH:mm');
            return 'INSERT INTO user (openid,nickname,gender,city,logintime,img) VALUES ("' + obj.openid + '","'+obj.nickname+'","'+obj.gender+'","'+obj.city+'","' + time + '","' + obj.img + '")';
        },
        updateLogin: function (openid) {
            var time=sdate.format(new Date(), 'YYYY-MM-DD HH:mm');
            return 'update user set logintime="'+time+'" where openid="'+openid+'"';
        },
        updateMobile: function (obj) {

            return 'update user set mobile="'+obj.mobile+'" where openid="'+obj.openid+'"';
        }
    },
    order:{
        add:function (obj) {
            return 'INSERT INTO orders (userid,address1,address2,time,car,money,person,type) values ("' + obj.openid + '","' + obj.address1 + '","' + obj.address2 + '","' + obj.date + '","' + obj.car + '","' + obj.money + '","' + obj.person + '","' + obj.type + '")';
        },
        select:function () {
            var str='select userid,address1,address2,money,type,person,car,DATE_FORMAT(time,"%m月%d") time,mobile,nickname,gender,img from orders inner join user on orders.userid = user.openid  order by orders.time limit 100';
            console.log(str);
            return str;
        }
    }
};