/**
 * Created by Xie on 2017/6/5.
 */
const express = require('express');
const router = express.Router();
const https = require('https');
const dbSQL = require('../mysql/dbSQL');
const mysql= require('mysql');
const dbConfig = require('../mysql/dbConfig');
const appId= "wx0034da14e555b694";
const secret="d8de51bb51314de88be6132417617715";
const pool = mysql.createPool(dbConfig.mysql);
const executeSql=(sql,callback)=>{
    pool.getConnection((err,conn)=>{
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                callback(qerr,vals,fields);
            });
        }
    });
};
//输出json
const outJon=(res,err,vals)=> {
    let outjson= {};
    if(!err){
        outjson= {'code':0,vals:vals};
    }else{
        outjson= {'code':-1};
    }
    res.json(outjson)
}
//获取openid 并入库
router.get('/openid', (req, res, next)=> {
    let code =req.query.code, img =req.query.img,nickname =req.query.nickname, gender =req.query.gender, city =req.query.city;
    let thisRes=res;
    //获取OpenID并注册用户
    let _url='https://api.weixin.qq.com/sns/jscode2session?appid='+appId+'&secret='+secret+'&js_code='+code+'&grant_type=authorization_code';
    console.log(_url);
    https.get(_url, (req,res)=> {
        let json='';
        req.on('data',(data)=>{
            json+=data;
        });
        req.on('end',()=>{
            let objdata=JSON.parse(json)||{};
            console.log(objdata);
            objdata.code=1;
            objdata.type='';
            if(objdata.openid){
                //根据openID查询
                executeSql(dbSQL.user.selectOpenID(objdata.openid),(err,vals)=>{
                    if(vals[0].nums==0){
                        //不存在则插入新数据
                        let _obj={city:city,nickname:nickname,openid:objdata.openid,gender:gender,img:img};
                        executeSql(dbSQL.user.insert(_obj),(err)=>{
                            console.dir(err);
                            objdata.type='insert';
                            if(!err){
                                objdata.code=0;
                            }
                            thisRes.json(objdata)
                        })
                    }else{
                        //存在则更新登陆时间
                        executeSql(dbSQL.user.updateLogin(objdata.openid),(err)=>{
                            console.dir(err);
                            objdata.type='update';
                            if(!err){
                                objdata.code=0;
                            }
                            thisRes.json(objdata)
                        })
                    }
                });
            }
        });
    });
});
router.get('/mobile',(req, res, next) => {
    let openid=req.query.openid;
    executeSql(dbSQL.user.selectMobile(openid),(err,vals,fields)=>{
        console.log(vals);
        outJon(res,err,vals);
    });
});
router.post('/updatemobile', (req, res, next) =>{
    let obj=req.body;
    console.log(obj);
    executeSql(dbSQL.user.updateMobile(obj),(err,vals,fields) =>{
        outJon(res,err,vals);
    });
});
//获取订单列表
router.get('/order', (req, res, next)  =>{
    let obj=req.body;
    executeSql(dbSQL.order.select(obj),(err,vals,fields) =>{
        console.log(vals);
        outJon(res,err,vals);
    });
});
//添加订单列表
router.post('/addorder', (req, res, next)  =>{
    let obj=req.body;
    executeSql(dbSQL.order.add(obj),(err,vals,fields) =>{
        outJon(res,err,vals);
    });
});

module.exports = router;