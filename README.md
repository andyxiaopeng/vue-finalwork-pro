# 基于开源项目 vue-admin-beautiful 的业务剖析

> 原项目地址：[vue-admin-beautiful](https://gitee.com/chu1204505056/vue-admin-beautiful)
>
> 本文档不涉及ui 等方面修改，仅针对业务逻辑的开发，使其可以配合后端开发，减少后端开发的压力
>
> 在ui 涉及业务等方面尽量黑盒处理或者跳过
>
> 为保证不必要的异常发生，撰写文档的同时保证不修改原项目，即便有修改的地方仅为测试使用

## 目录结构

~~~
├── build                      # 构建相关
├── mock                       # 项目mock 模拟数据
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── directive              # 全局指令
│   ├── config                 # 全局配置
│   ├── colorfulIcon           # 项目所有多彩图标存放的位置
│   ├── remixIcon              # 项目所有小清新图标存放的位置
│   ├── layouts                # 全局外框
│   ├── plugins                # 部分组件export
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用utils
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   └── main.js                # 入口文件 加载组件 初始化等
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── .babelrc                   # babel-loader 配置
├── .editorconfig              # 编辑器配置
├── .stylelintrc.js            # stylelintrc配置
├── prettier.config.js         # prettier 配置
├── vue.config.js              # vue-cli 配置
└── package.json               # package.json
~~~

## 业务功能流程图

> 根据作者提供的功能图来逐步剖析业务逻辑（代码层面）

![img](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/flow.drawio.png)

## 路由与权限

根据功能的示意图基本由路由守卫配置文件所设置，因此从路由守卫文件***src\config\permission.js*** 入手

![image-2021072019082163](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210720190821632.png)

![image-20210721144442836](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210721144442836.png)



### 按照功能顺序逐步分解实现原理

#### 获取令牌

> 从 store 引入获取角色令牌的函数

***src\store\modules\user.js*** 文件引入 “**getAccessToken**” 函数

其中store的user文件定义的 state 状态树含有一个指向 '@/utils/accessToken' 的accessToken的数据属性

![image-20210722095919245](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722095919245.png)

***src\utils\accessToken.js*** 文件的 **getAccessToken** 是根据存储的位置来获取指定的数据

![image-20210722100526496](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722100526496.png)

#### 根据令牌获取访问该页面的权限并且拿到路由菜单列表

> 底层实现要结合sotre来分析，具体的实现不建议修改作者原来的设计

![image-20210722185112186](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722185112186.png)

![image-20210722191813416](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722191813416.png)

![image-20210722143756595](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722143756595.png)

**持有令牌并且拿到路由菜单后放行**进入下一个页面

#### 不持有令牌检查访问的路由是否处于免检白名单中

> src\config\setting.config.js

![image-20210720091149139](E:\all_projection\final_works\web_tksure\vue-admin-beautiful\开发记录.assets\image-20210720091149139.png)

![image-20210722151715187](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722151715187.png)



## 与后端的交互 | api的修改和自定义

> api请求地址：详见 `config/settting.config.js` 中的 baseURL，
>
> 配置规格如下：
>
> “ ? ” 后面配置配置开发环境
>
> “ : ” 后面配置生成环境

### 使用 springboot为后端 简单测试， 来逐步剖析项目的api交互逻辑

1. 使用vue项目自带命令创建view、api、store等文件

   ~~~bash
   # 创建 view
   npm run template
   #选择创建view，填入名称会自动为您创建
   
   # 创建 api 与 mock
   npm run template
   #选择创建mock，填入名称会自动为您创建
   
   # 新增组件
   npm run template
   #选择创建components，填入名称会自动为您创建
   
   # 新增 store
   npm run template
   #选择创建vuex，填入名称会自动为您创建
   ~~~

   ![image-20210722204144656](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722204144656.png)

   ![image-20210722204430474](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722204430474.png)

   思路：从view页面实现某一函数，该函数调用store的方法，store方法引入api的访问接口函数，从而访问后端，并且在sotre中设计处理返回值的方法。

2. 查看配置文件（***src\config\setting.config.js***）是否已经修改了baseurl

   ~~~js
     // 默认的接口地址 如果是开发环境和生产环境走vab-mock-server，当然你也可以选择自己配置成需要的接口地址
     // “ ? ” 后面配置配置开发环境
     // “ : ” 后面配置生成环境
     baseURL:
       process.env.NODE_ENV === 'development'
         ? 'vab-mock-server'
         : 'vab-mock-server',
   ~~~

   例如：修改如下所示

   ~~~js
   baseURL:
   process.env.NODE_ENV === 'development'
       ? 'http://127.0.0.1:8099'
   	: 'http://127.0.0.1:8099',
   ~~~

3. 修改api函数

   ~~~js
   // api例子
   
   import request from "@/utils/request";
   
   export function getList(data) {
     return request({
       url: "/table/list",
       method: "post",
       data,
     });
   }
   ~~~

   ![image-20210723204729025](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723204729025.png)

4. 修改store函数

   store需要写好三个部分（state，commit，actions）

   如下方例子：

   ~~~js
   // src\store\modules\myselfstoretest.js
   
   import Vue from 'vue'
   import {
     getUser,
     getLoginInfo,
     deleteLoginInfo,
   } from '../../api/myself_api_test'
   
   const state = {
     myself_api_test: [],
   }
   
   const mutations = {
     setMyselfApiTest(state, myself_api_test) {
       if (myself_api_test) {
         state.myself_api_test = myself_api_test
       } else {
         state.myself_api_test = []
       }
     },
   }
   
   const actions = {
     setMyselfApiTest({ commit }, myself_api_test) {
       commit('setMyselfApiTest', myself_api_test)
     },
   
     // 异步请求后端的方法
     async logintest({ commit }, datainfo) {
       const { _datainfo } = await getLoginInfo(datainfo)
       if (_datainfo) {
         commit('setMyselfApiTest', _datainfo)
         Vue.prototype.$baseNotify(`欢迎登录`)
       } else {
         Vue.prototype.$baseMessage(`登录接口异常，未正确返回`, 'error')
       }
     },
   }
   
   export default {
     state,
     mutations,
     actions,
   }
   ~~~

   逐步分析开始：

   1. 引入必要的方法

      ![image-20210723205153462](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723205153462.png)

   2. 定义所需要的状态

      ![image-20210723205300466](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723205300466.png)

   3. 定义actions方法，这里的方法主要负责异步访问api，和提交commit等功能

      ![image-20210723205629735](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723205629735.png)

   4. 修改commit方法。commit方法是用来改变state状态的，这也是commit和actions的区别。并且从view发布过来的任务都是用actions接收

      ![image-20210723205923354](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723205923354.png)

   5. 至此store的三个重要部分修改完毕，接下来可以从view页面定义一些方法来对store发布任务从而实现状态数的改变等操作。

5. 开始修改view页面

   > view页面对发布store的行动是十分多变的。
   >
   > 触发方式可以有非常多，由开发者思考来做更好的处理
   >
   > 以下为最简单的一个必要步骤讲解

   ~~~js
   // 这是触发store的actions的代码，但是这段代码应该是嵌入在其他的js函数中。作为其他函数功能中的一部分（发布store行动的一部分，也可以说是修改状态数或者修改存储数据的一部分）
   
   this.$store
   	.dispatch('myselfstoretest/logintest', this.datainfo)
   	.then(() => {
   		this.datainfo['userid'] = '200'
   	   })
   	 .catch(() => {
           this.loading = false
          })
   ~~~

   ![image-20210723211013399](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723211013399.png)

6. 编写后端对应接口

   > 此篇蚊帐为前端的模板剖析将不深入分析后端实现
   >
   > 可以参考模板中的mock来编写后端接口

   ~~~json
   // 后端返回 JSON 数据的约定
   
   {
     "code": 200,//成功的状态码
     "msg": "success",//提示信息
     "totalCount": 238,//总条数（表格中用到）
     "data": [{}，{}，{}]//返回数据
   }
   ~~~

7. 测试

   > 声明：
   >
   > 1. 前端仅实现一个按钮
   > 2. 后端仅实现一个post请求
   > 3. 功能仅仅是测试以上修改是否有效
   > 4. 具体思路为，页面展示了一个数据，在点击按钮之后，前端会发生post请求到后端。后端接受请求后将发送一个message给前端。前端成功接受则修改页面所展示的数据。

   1. 点击按钮前

      ![image-20210723220218231](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723220218231.png)

      清空前后端控制台

   2. 点击按钮

      后端收到前端的post请求

      使用 @RequestBody 接受post所携带的参数

      ![image-20210723220422097](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723220422097.png)

      ![image-20210723220323850](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723220323850.png)

      前端接受到后端反馈后显示如下（与上方格式相对应）：

      > code 200 才能让前端正确接收
      >
      > data 携带后端所给的数据
      >
      > msg 是后端给前端的一些信息提示

      ![image-20210723220451738](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723220451738.png)

      然后页面改变

      ![image-20210723220615527](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210723220615527.png)

      至此前后端交互成功。

## Echarts图表的修改和使用



## 各种页面的配置零散记录——layout部分

### 去除右边的“ 拷贝源码”

注释 “src\layouts\components\VabThemeBar\index.vue”的html代码

![image-20210722203915977](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722203915977.png)

![image-20210722203723173](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20210722203723173.png)

### 设置头像按钮选项列表

修改“src\layouts\components\VabAvatar\index.vue”文件的html代码

![image-20220316210841746](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20220316210841746.png)

### 删除右边github图标链接

注释“src\layouts\components\VabAppMain\index.vue”的“<vab-github-corner />”代码

![image-20220316211250090](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20220316211250090.png)

### 修改路由标题

修改"src\config\setting.config.js"的title选项

### 修改加载页面名称

### 修改主页面前的附赠标题

注释“src\layouts\index.vue”的两处“<vab-ad />”

![image-20220316221631182](https://gitee.com/andyxiaopeng/picbed/raw/master/pic/image-20220316221631182.png)
