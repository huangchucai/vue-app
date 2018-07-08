# vue-app

> A Vue.js project

## Outline
#### 第一天
1. 目录的规定

   ```javascript
   |- src
   |- |- api // 后端接口
   |- |- common //一些静态资源
   |- |- |-fonts
   |- |- |-image
   |- |- |-js
   |- |- |- |- 
   |- |- |-stylus
   |- |- components // 组件
   |- |- |- recommend  // 推荐页面
   |- |- |- singer     // 歌手页面
   |- |- router // 路由
   |- |- store  //Vuex
   App.vue
   main.js //入口文件
   ```

2. 全局规范

   - 字体颜色
   - 字体大小

#### 第二天
1. 基本组件的搭建
  * 顶部组件header
  * 导航栏组件(推荐，排行，歌手，搜索)
2. v-router的使用
  ```javascript
     <router-link tag="div" class="tab-item" to="/recommend">
     </router-link>
     
     <router-view/>
  ```
#### 第三天
1. 滑动的封装处理
2. vue-lazyload 图片的懒加载处理
3. loading组件的封装处理
4. 利用keep-alive来缓存请求的数据，避免重复加载请求
5. better-scroll每次dom的高度发生变化都需要refresh
6. 推荐页面完成

#### 第四天
1. 学习了webpack require()图片资源
2. Vue对于数据的存放规则
3. 组件内部方法的摆放规律
4. better-scroll左右联动的大致思路
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
### 学习rebase
1. 提交我第一次修改的test分支
