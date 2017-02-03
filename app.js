var express = require("express");
var app = express();
var router = require("./router/router.js");
var session = require("express-session");

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//模板引擎
app.set("view engine","ejs");

//静态页面
app.use(express.static("./public"));

//路由表
app.get("/",router.showIndex);
// app.get("/",router.doRegist);

app.get("/regist",router.showRegist)

app.post("/doRegist",router.doRegist)
//监听端口
app.listen(3000);
