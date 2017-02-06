var formidable = require("formidable");
var db = require("./../models/db.js");
var md5 = require("./../models/md5.js")

//显示首页
exports.showIndex = function(req,res,next){
    // res.render("index");
    if(req.session.login == "1"){
        res.render("index",{
            "login": true,
            "username":req.session.username
        })
    }else {
        res.render("index",{
            "login":false,
            "username":""
        })
    }
}

// 显示注册页面
exports.showRegist = function(req,res,next){
    res.render("regist");
}

//处理用户注册
exports.doRegist = function(req,res,next){
    //得到用户填写的数据；
    //查询用户名是否存在
    //若用户名不存在，则将用户存起来；
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        var username = fields.username;
        var password = fields.password;
        
        db.find("user",{"username":username},function(err,result){
            if(err){
                res.json({"result":"-3"});//系统错误
                return;
            }else if(result.length != 0){
                res.json({"result":"-1"});
                return;
            }
            console.log(result.length);//0；现在可以证明用户名没有被占用；

            password = md5(md5(password)+"2");//将password利用md5加密；

            //将用户名与加密之后的password插入到数据库之中；
            db.insertOne("user",{"username":username,"password":password},function(err,result){
                if(err){
                res.json({"result":"-3"});//系统错误
                return;
                };
                req.session.login = "1";
                req.session.username = username;
                res.json({"result":"1"});
            })
        })
    });
    
}

//登陆业务
exports.showLogin = function(req,res,next){
    res.render("login");
}

 

//处理登陆表单
exports.doLogin = function(req,res,next){
    //1.3.后台接收前台表单数据
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        var username = fields.username;
        var password = fields.password;
        db.find("user",{"username":username},function(err,result){
         
            //系统错误
            if(err){
                res.json({"result":"-3"})
                return;
            };
            //用户名不存在
            if(result.length == 0){
                res.json({"result":"-1"})
                return;
            }
            //转化密码为md5
            password = md5(md5(password)+"2");
            if (password == result[0].password){
                //成功登陆
                req.session.login = "1";
                req.session.username = username;
                res.json({"result":"1"})
                return;
            }else{
                //用户密码错误
                res.json({"result":"-2"})
                return;
            }
        })

    })
}