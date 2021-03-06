<template>
  <div class="music-list" ref="music">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length > 0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" class="list" ref="list"
            :probeType="probeType"
            @scroll="scroll"
            :listenScroll="listenScroll">
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @select="select"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  import Loading from 'base/loading/loading'
  import {playlistMixin} from 'common/js/mixin'
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')
  const RESERVED_HEIGHT = 40
  export default {
    mixins: [playlistMixin],
    computed: {
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    methods: {
      handlePlaylist(list) {
        const bottom = list.length > 0 ? '60px' : ''
        // this.$refs.music.style.bottom = bottom
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      select(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay({list: this.songs})
      },
      ...mapActions(['selectPlay', 'randomPlay'])
    },
    watch: {
      scrollY(newY) {
        // console.log(newY)
        // console.log(`maxTransalteY   ${this.maxTransalteY}`)
        let layerTop = Math.max(newY, this.maxTransalteY)
        let zIndex = 0
        let blur = 0
        let scale = 1
        // this.$refs.layer.style.top = `${layerTop}px`
        this.$refs.layer.style[transform] = `translate3d(0,${layerTop}px,0)`
        // 设置模糊的百分比
        const percent = Math.abs(newY / this.imgHeight)
        if (newY > 0) {
          // 像下拉的时候图片放大
          zIndex = 10
          scale = 1 + percent
        } else {
          // 向上的时候filter模糊
          blur = Math.min(20, percent * 20)
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // 滑动超出上边界
        if (this.maxTransalteY > newY) {
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
          zIndex = 10
        } else {
          this.$refs.playBtn.style.display = 'block'
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    mounted() {
      this.imgHeight = this.$refs.bgImage.clientHeight
      this.maxTransalteY = -this.imgHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imgHeight}px`
    },
    props: {
      songs: {
        default: [],
        type: Array
      },
      title: {
        default: '',
        type: String
      },
      bgImage: {
        default: '',
        type: String
      },
      rank: {
        default: false,
        type: Boolean
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
