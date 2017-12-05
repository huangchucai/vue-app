<template>
  <scroll :data="data"
          class="listview"
          ref="listview"
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
            :class="{'current' :currentIndex === index}">{{item}}



        </li>
      </ul>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  const ANCHOR_HEIGHT = 18
  export default {
    created() {
      // 用于onShortcutTouchStart 和 onShortcutTouchEnd之间传递的
      // 不需要动态监听，所有放在created中
      this.touch = {}
      this.listenScroll = true
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: -1
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
        console.log(gapIndex)
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
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(item => {
          return item.title.substr(0, 1)
        })
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        this.listHeight.forEach((height, index) => {
          let height2 = this.listHeight[index + 1]
          // !height2防止最后一个
          if (!height2 || (-newY > height && -newY < height2)) {
            this.currentIndex = index
            return
          }
          this.currentIndex = 0
        })
      }
    },
    components: {
      Scroll
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
