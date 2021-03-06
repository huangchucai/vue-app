<template>
  <scroll ref="suggest" class="suggest"
          :pullup=pullup
          @scrollToEnd="searchMore"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          :data="result">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import NoResult from 'base/no-result/no-result'
  import {Singer} from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  const TYPE_SINGER = 'singer'
  const perpage = 20
  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    methods: {
      search(query) {
        // 重新查询的时候，重新设置状态hasMore，page
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push(`/search/${singer.id}`)
          this.set_singer(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      // 列表滚动前让输入框失去焦点
      listScroll() {
        this.$emit('listScroll')
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data) {
        let result = []
        if (data.zhida && data.zhida.singerid) {
          result.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          result = result.concat(this._normalizeSongs(data.song.list))
        }
        return result
      },
      _normalizeSongs(list) {
        const ret = []
        list.forEach(item => {
          if (item.albummid && item.songid) {
            ret.push(createSong(item))
          }
        })
        return ret
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      ...mapMutations({
        set_singer: 'SET_SINGER'
      }),
      ...mapActions(['insertSong'])
    },
    watch: {
      query(newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
