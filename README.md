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
   |- |- |-stylus
   |- |- components // 组件
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
