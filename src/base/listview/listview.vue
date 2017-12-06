<template>
  <scroll :data="data"
          class="listview"
          ref="listview"
          :probeType="probeType"
          :listenScroll=listenScroll @scroll="scroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index"
            class="item"
            :class="{'current':currentIndex === index}">{{item}}





        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div class="loading-container" v-if="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  const ANCHOR_HEIGHT = 18
  const FIXED_HEIGHT = 30
  export default {
    created() {
      // 用于onShortcutTouchStart 和 onShortcutTouchMove之间传递的
      // 不需要动态监听，所有放在created中
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: 0
      }
    },
    props: {
      data: {
        defatult: [],
        type: Array
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        const anchorIndex = getData(e.target, 'index')
        const firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        const firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        const gap = this.touch.y2 - this.touch.y1
        // | 0可以向下取整
        const gapIndex = ((gap / ANCHOR_HEIGHT) | 0) + Number.parseInt(this.touch.anchorIndex)
        this._scrollTo(gapIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      // 获取所有的歌星的列表的累加
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          // 获取每一个元素的高度
          let listDom = list[i]
          height += listDom.clientHeight
          this.listHeight.push(height)
        }
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(item => {
          return item.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        // 刚开始data没有
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 改变scrollY就可以改变currentIndex
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部向上拉 newY > 0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          // 这里只是判定滚动高度在哪一个区间，不需要用forEach来控制每一个元素
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          this.diff = height2 + newY
          // !height2防止最后一个
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            return
          }
        }
        // 当滚动到底部，并且-newY的值大于最后一个的高度值
        this.currentIndex = listHeight.length - 2
        // 因为this.listHeight.length 比实际的listGroup-dom元素多添加了一个0
      },
      diff(newdiff) {
        let fixedTop = (newdiff > 0 && newdiff < FIXED_HEIGHT) ? (newdiff - FIXED_HEIGHT) : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
