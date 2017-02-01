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
注册并不包括头像，咱么的业务逻辑