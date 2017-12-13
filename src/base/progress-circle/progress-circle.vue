<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill="transparent" class="progress-background"></circle>
      <circle cx="50" cy="50" r="50" fill="transparent" class="progress-bar"
              :stroke-dashoffset="strokeDashOffset"
              :stroke-dasharray="strokeDasharray"></circle>
    </svg>
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
  /* 原理：
   * 1. 事先画2个圆相同，重合在一起
   * 2. 利用stroke-dasharray的实线部分把第一个圆全部覆盖
   * 3. 通过stroke-dashoffset偏移量来取消第一个圆的stroke，显示第二个圆
   * 4. 使用viewBox可以保证里面的圆始终都是居中的显示，不用管外面传入的大小
   * */
  export default {
    props: {
      radius: {
        type: Number,
        default: 100
      },
      precent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        strokeDasharray: 100 * Math.PI
      }
    },
    computed: {
      // svg虚线的偏移量
      strokeDashOffset() {
        return (1 - this.precent) * this.strokeDasharray
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
