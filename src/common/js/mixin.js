/**
 * Created by Z7 on 2017/12/15.
 */
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  methods: {
    handlePlaylist() {
      throw new Error('components must implement handlePlaylist method')
    }
  },
  watch: {
    playlist(newList) {
      this.handlePlaylist(newList)
    }
  }
}
// play.vue 和 playlist.vue的mixin
export const playerMixin = {
  computed: {
    playModeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    favoriteIcon() {
      return this.getFavoriteIcon(this.currentSong)
    },
    ...mapGetters([
      'playlist',
      'currentSong',
      'mode',
      'sequenceList',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      // 播放模式的切换
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.playlist)
      } else {
        list = this.sequenceList
      }
      // 切换模式后改变currentIndex保证当前歌曲不变
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 切换喜欢列表的逻辑
    getFavoriteIcon(currentSong) {
      // TIPS: 为什么这里会重写渲染
      // 1. toggleFavorite改变了favoriteList
      // 2. favoriteList被监听到变化，寻找依赖它的逻辑
      // 3. 发现页面中的虚拟dom的属性依赖isFavorite，从而重写render虚拟dom
      // 4. 通过diff算法来更新页面的dom
      if (this.isFavorite(currentSong)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(currentSong) {
      const index = this.favoriteList.findIndex(item => currentSong.id === item.id)
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions(['deleteFavoriteList', 'saveFavoriteList'])
  }
}

// add-song.vue 和 search.vue的搜索历史
export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    // 本地存放搜索历史记录
    saveSearch() {
      this.saveHistory(this.query)
    },
    onQueryChange(query) {
      this.query = query
    },
    // 调用子组件的blur() 使input失去焦点
    blurInput() {
      this.$refs.searchBox.blur()
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    // 删除一个本地的记录和搜索记录
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    ...mapActions(['saveHistory', 'deleteSearchHistory'])
  }
}
