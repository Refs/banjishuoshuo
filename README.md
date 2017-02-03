# 班级说说5

**没有时间就去挤时间，没有精力就靠打坐与入静来恢复精力，“夫物芸芸，各归其根，归根曰静，静曰复命”**

### v1.0 初始化工作空间；

### v2.0 班级说说初步结构规划
1.项目要求：不能转发的微博系统（班级说说）
* 可以注册、设置头像、登录、可以转发微博；
* 没有”关注“、"收听机制"，所有人的微博都可以被自己看见（像论坛），微博内容按时间排序（不存在”顶贴“）；
* 可以对一个微博进行”赞“、”评论“；

2.数据库要求：mongodb与nodejs比较活，根本不需要事先去设计数据库；数据库中需要有两个集合：一个是用来存放用户，一个是用来存放微博（帖子）；数据库没有必要规定那么死，都是想到什么就写什么，这也是mongodb的优势；
* user 集合用来存储用户的信息，里面的document举例如下

```js
{"_id":"fdasfas","username":"小明","password":"md5加密","avatar":"头像地址","sign":"一句话签名"}
//avarta(头像)数据库中是不可以存的，但数据库中，可以存放头像(avatar)的地址；
//username同一个集合中不能重复；；
```
* post集合用来存放用户发表的文章，举例如下：

```
{"id":"dfadfas","title":"标题","content":"内容","author":"小明","date":"日期"}
```
* 这时候有个问题，就是_评论_怎么存？
在以前的数据库中，如mysql就需要再建一个集合comment，每一个评论单独存放，然后用外键（外链）指向用户集合；而在我们的mongodb中，就不需要再新建一个集合，可以直接在post集合内的每条document中再插入一条field "comment";comment中存放的是数组，数组中又存放多条json，评论就存放在这一条条json中，形式如下：_这体现出了mongodb的优势，这也是全站开发中的一个大概念_； 除此之外，还可以在此document中插入一条field "zan",原理与上面类似；

```js
{"id":"dfadfas","title":"标题","content":"内容","author":"小明","date":"日期","comment":[{
    "content":"内容",
    "author":"评论人",
    "date":"时间"
    },{评论2}...],"zan":{"小明","小兰"}}
//同一个用户不可以重复点赞，所以赞里面存储的是用户名，且存之前要判断一下是否重复；
```

3.静态页面index.ejs

* 从bootstrap上扒来一个带有登陆的页面；点开后右键查看源码，将文本全部copy至index.ejs中；检查文本中的引用，并修改使其指向正确的css或js，遇到现工作空间内没有的css或js可在网页源码中右键下载；
![](http://baihua.xicp.cn/17-2-1/95172090-file_1485908976569_1629d.png)

![](http://baihua.xicp.cn/17-2-1/46839431-file_1485909442629_12fc.png)

* 导航条部分修改如下：在navbar-collapse区域；左侧留有“全部说说”与“我的说说”两个链接；留有两个接口“注册”与“登陆”；

```js
//index.ejs中
<div id="navbar" class="navbar-collapse collapse">
    <ul class="nav navbar-nav">
        <li class="active"><a href="#">全部说说</a></li>
        <li><a href="#">我的说说</a></li>
    </ul>  

    <ul class="nav navbar-nav navbar-right">
        <li><a href="#">注册</a></li>
        <li><a href="#">登录</a></li>
    </ul>
</div>
```

### v3.0注册业务
**现在自己过着苦行僧式的生活，心静就去学习，心乱了就去打坐入静**

> 注册并不包括头像，咱么的业务逻辑是先让用户注册上来，其注册完之后，是没有头像状态，有一个默认的、恶心的头像，然后其就会自然而然的去改头像

#### 做注册的页面 regist.ejs

* 首先更改首页面index.ejs中注册按钮的链接，当被点击时使其发送至"/regist"的请求；

    ```<li><a href="/regist">注册</a></li>
    ````
* 其次要在app.js中新建一个中间其，负责迎合（相应）注册链接请求，响应函数在控制层router中；

    ```
        app.get("/regist",showRegist)
    ```
* 请求的处理函数放在控制层router中；在router中暴露一个请求处理函数showRegist，函数运行之后，首先将注册页面渲染出来;

    ```
        exports.showRegist = function(req,res,next){
            res.render("regist")
        }
    ```
* 在views文件夹中创建注册页面regist.ejs; 这样在主页面点击注册按钮，就会显示注册页面；紧接着就是去bootstrap中去扒注册表单的模板；

```
        <form role="form" class="col-md-6">
            <h1>欢迎注册</h1>                
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" class="form-control" id="username" placeholder="用户名，且用户名不可以重复">
            </div>
            <div class="form-group">
                <label for="mima">Password</label>
                <input type="password" class="form-control" id="password" placeholder="密码至少六位">
            </div>
            <div class="checkbox">
                <label>
                    <input type="checkbox"> 我同意注册规定
                </label>
            </div>
            <button type="button" class="btn btn-default" id="zhuce">注册</button>
        </form>
```

* 用ajax提交用户填写的表单 

监听提交按钮，当用户点击时发送ajax请求，请求中携带用户填写的数据；

```js
//regist.ejs中
<script type="text/javascript">
    $("#zhuce").click(function(){
        $.post("/dopost",{"username":$("#username").val(),"password":$("password").val()},function(result){
            if(result.result = "1"){
                alert("用户注册成功");
            }else if(result.result = "-3"){
                alert("系统错误")
            }else if(result.result = "-1"){
                alert("用户名已存在")
            }
        })

    })
</script>
```
* 服务器相应ajax请求,首先要得到用户post过来的数据，然后判断用户名是否存在;若用户名已存在，则返回-1（ajax会收到返回的结果，并会根据这个结果，进行下一步的操作）；若用户名没有被占用，则将用户名对应的password利用md5加密，然后放入数据库，并返回1，这样等于是注册成功；

```js
//app.js中
app.post("/dopost",router.doRegist);
//router.js中
var formidable = require("formidable");
//引入mongodb的DAO层函数，mongodb都是用setting.js文件配置的，引入db.js时，也要将setting.js复制过来；
var db = require("./models/db.js")
//引入md5加密函数
var md5 = require("./models/md5.js")

exports.doRegist = function(req,res,next){
    //1.获取ajax发过来的请求数据；
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {

        var username = fields.username;
        var password = fields.password;
        //2.利用find函数，去查询数据库，筛选条件是username,
        db.find("user",{"username":username},function(err,result){
            if(err){
                res.json({"result":-3});//系统错误
                return;
            //3.若能查到result.length不等于0，则说明用户名已经被占用，则去返回-1;
            }else if(result.length != 0){
                res.json({"result":"-1"});
                return
            }
            //console.log(result.length);//0；现在可以证明用户名没有被占用；

            //4.若result.length等于0，则说明用户名未被占用，将密码加密后，将用户名与密码一起放到数据库中；
            password = md5(md5(password)+"2");//将password利用md5加密；

            //将用户名与加密之后的password插入到数据库之中；
            db.insertOne("user",{"username":username,"password":password},function(err,result){
                if(err){
                res.json({"result":-3});//系统错误
                return;
                };
                //5.注册成功，写入session;
                res.json({"result":"1"});
            })
        })
    });
}
```
* 用ajax接收来自服务器的相应；在页面中添加一个警告框组件，若服务器返回的是-1就将组件弹出；若服务器返回的是1,则跳转至首页面；

```html
        </div>
        <div class="row" id="failed">
          <div class="alert alert-danger col-md-6" role="alert">
            <a href="#" class="alert-link">用户名已被注册</a>
          </div>
        </div>
```

```js
        $("#zhuce").click(function(){
            //当页面表单控件获得焦点时，将所有的警告框重新隐藏掉；
             $("input").focus(function(){
                 $("#failed").fadeOut();
             })

             $.post("/doregist",{"username":$("#username").val(),"password":$("#password").val()},function(result){
                 console.log(result.result);
                 if(result.result == "-1"){
                     $("#failed").fadeIn();
                 };
                 if(result.result == "1"){
                    alert("注册成功，浏览器将自动跳转到首页");
                     window.location = "/";
                 }
             })
         })
```

* 注册成功之后，下一步就是要写入session;利用express-session模块；安装模块，并在顶层路由app.js中调用中间件：

```js
//app.js中
    var session = require("express-session");

    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }))
```

```js
//router.js中
exports.doRegist = function(req,res,next){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {

        var username = fields.username;
        var password = fields.password;
        db.find("user",{"username":username},function(err,result){
            if(err){
                res.json({"result":-3});
                return;
            }else if(result.length != 0){
                res.json({"result":"-1"});
                return
            }

            password = md5(md5(password)+"2");

            db.insertOne("user",{"username":username,"password":password},function(err,result){
                if(err){
                res.json({"result":-3});
                return;
                };
                //用户注册成功之后，就要写入session,
                req.session.login = "1";
                req.session.username = "username";

                res.json({"result":"1"});
            })
        })
    });
}

```

* session写入的意义在于，ajax接收到服务器成功响应的"1"时，js会将我们引到"/"`window.location="/"`，且会重新向到地址"/"的请求，此次请求req.sesion中会带有我们session写入的数据（cookie），我们可以像类似`req.query.username`去获得`127.0.0.1:3000/?username=xiaoming`请求中**查询数据**的方式，利用`req.session.username`去获取请求中session数据。利用这个原理我们可以去完成，当链接跳转到首页时，原先首页面导航条中"注册"和"登陆"的部分变成"欢迎username"和"设置个人资料"；

```js
    //一点感悟，自己要做什么，首先改的都是视图层，想看一下改的成功不成功，有没有那个效果，都是先传一个假数据，若达到预先的效果，后面就专注于数据的获取；这一点体悟，很想自己以前学习javascript时，做运动或交互效果时，都是那个css数据去试，看看有没有效果；
    
    //1.首先更改一下index.ejs; 利用模板引擎传入的login值做一下判断，login为false则显示"注册"与"登陆",login 为true 则显示"欢迎username"与"设置个人信息"
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">全部说说</a></li>
                <li><a href="#">我的说说</a></li>
            </ul>  
            <ul class="nav navbar-nav navbar-right">
                <% if(!login){  %>//前台并不能接受后台的数据，其只能接收模板引擎给的数据；
                    <li><a href="/regist">注册</a></li>
                    <li><a href="#">登录</a></li>
                <% else{  %>
                    <li><a href="/regist">欢迎<%= username %></a></li>
                    <li><a href="#">设置个人信息</a></li>
                <% } %>

            </ul>
         </div>
    //<% login %> 在ejs页面中，用<% %>将一个变量括起来，放在页面中的任意位置，可以用来调试模板中的变量
```

```js
    //2.利用假数据，在后台调试一下，看模板能否正常显示；
    exports.showIndex = function(req,res,next){
        res.render("index",{
            "login":true,
            "username":"小花花"
        })
    }
```

```js
    //3.获取真实的模板数据
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
```



 > 一点感悟，自己要做什么，首先改的都是视图层，想看一下改的成功不成功，有没有那个效果，都是先传一个假数据，若达到预先的效果，后面就专注于数据的获取；这一点体悟，很想自己以前学习javascript时，做运动或交互效果时，都是那个css数据去试，看看有没有效果；