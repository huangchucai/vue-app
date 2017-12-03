<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <div class="dot" v-for="(item, index) in dots" :class="{active: index === currentIndex}"></div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    data() {
      return {
        dots: [],
        currentIndex: 0
      }
    },
    props: {
      loop: {
        default: true,
        type: Boolean
      },
      autoPlay: {
        default: true,
        type: Boolean
      },
      interval: {
        default: 4000,
        type: Number
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSlideWidth()  // 设置滑动的父元素宽度
        this._initDots() // 初始化下边按钮
        this._initSlider() // 初始化滑动
        console.log(11)
        // 自动播放
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      // 监听窗口大小改变的时候
      window.addEventListener('resize', () => {
        this._setSlideWidth(true)
        this._play()
      })
    },
    methods: {
      _setSlideWidth(isRize) {
        this.children = this.$refs.sliderGroup.children
        let parentWidth = 0
        let imgWrapperWidth = this.$refs.slider.clientWidth
        Array.prototype.forEach.call(this.children, imgDom => {
          imgDom.classList.add('slider-item')
          imgDom.style.width = imgWrapperWidth + 'px'
          parentWidth += imgWrapperWidth
        })
        if (this.loop && !isRize) {
          parentWidth += 2 * imgWrapperWidth
        }
        this.$refs.sliderGroup.style.width = parentWidth + 'px'
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        // 设置对于的下标值
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentIndex = pageIndex

          // 设置自动滚动
          if (this.autoPlay) {
            clearTimeout(this._time)
            this._play()
          }
        })
      },
      _play() {
        let autoIndex = this.currentIndex + 1
        if (this.loop) {
          autoIndex += 1
        }
        // 自动滚动的延迟时间
        this._time = setTimeout(() => {
          this.slider.goToPage(autoIndex, 0, 400)
        }, this.interval)
      }

    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
