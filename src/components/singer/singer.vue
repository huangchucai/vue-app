<template>
  <div class="singer" ref="singer">
    <listview :data="singers" ref="list" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {Singer} from 'common/js/singer'
  import Listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) {
        this.setSinger(singer)
        this.$router.push({
          path: `/singer/${singer.id}`
        })
      },
      handlePlaylist(list) {
        const bottom = list.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      _getSingerList() {
        getSingerList().then((result) => {
          if (result.code === ERR_OK) {
            this.singers = this._normalizeSinger(result.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        // hot_name 只需要10位
        const map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          // Findex排序没有长度要求
          if (!map[item.Findex]) {
            map[item.Findex] = {
              title: item.Findex,
              items: []
            }
          }
          map[item.Findex].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        const hot = []
        const rank = []
        Object.keys(map).forEach(key => {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            rank.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        })
        rank.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(rank)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
