### Vue-music 细节总结

1. 父子组件传递的时候，注意父组件异步请求数据，传递给子组件，数据是否到来（v-if解决）

2. Vue在css中使用~ 会去webpack找别名

   ```javascript
     @import "~common/stylus/variable"	
   ```

3. `fastclick`插件清除移动端300ms延迟问题

4. `keep-alive`来缓存上一个页面的数据，不用重新请求。

5. 插件`better-scroll`实现水平滑动，垂直滚动

   * `better-scroll`依赖dom的渲染后
   * 浏览器的渲染dom时间一般是4ms，所有一般初始化在4ms之后，默认写20ms
   * 每次dom的高度改变后，都要实例刷新(`refresh`)
   * 实事接收数据可以`watch`监听数据变化，并`refresh`
   * 监听连续滚动的时候 `probeType  = 3`


5. 插件`vue-loader`来实现图片懒加载

6. `webpack`支持`require()`资源

7. 如果需要中断数组的循环(不需要控制每一个元素)，使用for循环，不要用forEach

8. 利用  number | 0 可以向下取整

   ```javascript
   5.6 | 0  = 5
   ```

9. Vue对于数据的存放

   * 不需要实时监听的数据，可以在created() 中存放
   * 需要监听的数据放在data中
   * 在方法之间的传递可以挂在在实例this上面就可以

10. 自身组件中方法的摆放

  1. 一些原生自带的事件方法
  2. 公共方法
  3. 最后才是自身使用的私有方法

11. **ref**知识点

    * ref放在组件上，表示该组件的内容。（可以通过refs.$el获取dom）
    * 放在dom上，则表示dom元素

12. `better-scroll`左右联动的思路总结

    1. 实时监听左边栏的滚动距离
    2. 算出每一块累加的高度，并放入一个数组中
    3. 更加滚动的距离和每一块的高度，判定滚动的区域
    4. 根据滚动的区域得到索引`index`
    5. 根据`index`去判定右边栏的位置 

13. 路由其实不是一个新的页面，本质上是改变了url的hash和利用h5的history api改变地址，添加蒙层，实现页面的跳转假象。

14. vuex的运用

    * state
    * mutations
    * mutations-types
    * getters
    * actions


15. Vue-music中的点击动画和滑动动画

    1. 根据touch事件的几个节点，`touchstart` `touchmove` `touchend` 这三个动画中的前2个得到从开始移动，到移动中的偏移位置。
    2. 明确元素的偏移量（`offsetWidth`）,需要知道这个元素的最大和最小偏移量。
    3. 根据偏移量来决定`transform`的偏移值

    *细节：* 可以初始化一个变量来确定滑动的开始`initiated`

16. vue-router 父子路由之间的传递

17. Vue开发组件的时候一定要明白下面几点

    1. 组件需要接受的参数和类型
    2. 对于组件的功能要一个定位
    3. 对于外部引用我的父组件，我需要派发什么数据，提供什么数据

18. 对于数组的操作

    1. 对于数组的添加和删除一定要注意数组的长度和对应的索引变化

19. Vuex中actions的运用（***2**）

    1. 用于异步获取数据
    2. 用于多次提交mutations

20.  节流请求接口数据（ `watch`的新写法 ）

    ```javascript
    // 看到这样写，一波666
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 300))

    // 节流防止重复加载
    export function debounce(func, delay) {
      let timer = null
      return function (...args) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          func.apply(this, args)
        }, delay)
      }
    }
    ```

21. Vuex引用的`mapActions`的时候可以简写,简写代码维护

    ```javascript
    // 这样的，直接传递的参数或者直接调用的
    <search-list @delete="deleteOne"></search-list>
    <span class="clear" @click="deleteAllSearch">
    // 参数直接传递  
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    // 直接调用
    deleteAllSearch() {
      this.clearSearchHistory()
    }, 
    ...mapActions(['saveHistory', 'deleteSearchHistory', 'clearSearchHistory'])


    // 简化后
    <span class="clear" @click="clearSearchHistory">
    <search-list @delete="deleteSearchHistory"></search-list>
    ```

    ​

    ​

