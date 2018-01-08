import Vue from 'vue'
import Router from 'vue-router'

/* const Rank = (resolve) => {
  import('components/rank/rank').then(module => {
    resolve(module)
  })
}
const Recommend = (resolve) => {
  import('components/recommend/recommend').then(module => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('components/search/search').then(module => {
    resolve(module)
  })
}
const Singer = (resolve) => {
  import('components/singer/singer').then(module => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then(module => {
    resolve(module)
  })
}
const Disc = (resolve) => {
  import('components/disc/disc').then(module => {
    resolve(module)
  })
}

const TopList = (resolve) => {
  import('components/top-list/top-list').then(module => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('components/user-center/user-center').then(module => {
    resolve(module)
  })
} */
const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')
const UserCenter = () => import('components/user-center/user-center')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
