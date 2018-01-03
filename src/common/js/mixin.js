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
    ...mapGetters([
      'playlist',
      'currentSong',
      'mode',
      'sequenceList'])
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
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    })
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
    ...mapActions(['saveHistory', 'deleteSearchHistory'])
  }
}
