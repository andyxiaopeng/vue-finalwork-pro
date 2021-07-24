/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from '@/router'
import store from '@/store'

// 显示加载的进度条
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 控制跳转后页面显示的标题
import getPageTitle from '@/utils/pageTitle'

// 从config引入部分相关的配置
import {
  // 控制路由权限管理方式（all模式与intelligence模式）
  authentication,
  // 是否开启登录拦截
  loginInterception,
  // 是否显示顶部进度条
  progressBar,
  // token失效回退到登录页时是否记录本次的路由
  recordRoute,
  // 白名单列表（不经过token校验的路由）
  routesWhiteList,
} from '@/config'

VabProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})
router.beforeResolve(async (to, from, next) => {
  // 开启顶部的加载进度条
  if (progressBar) VabProgress.start()
  // 获取角色的token
  let hasToken = store.getters['user/accessToken']

  // 如果未开启拦截模式，将主动给予临时token
  if (!loginInterception) hasToken = trueA

  // 具体业务逻辑开始
  // 持有令牌
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      // 渲染加载条
      if (progressBar) VabProgress.done()
    } else {
      // 根据该角色的令牌来获取其是否含有访问该页面的权限 （含有权限 hasPermissions == 1 反之 hasPermissions == 0）
      const hasPermissions =
        store.getters['user/permissions'] &&
        store.getters['user/permissions'].length > 0
      if (hasPermissions) {
        next()
      } else {
        // 没有权限的情况下 尝试从后端检测其是否拥有权限 并且获取路由的菜单列表
        try {
          let permissions
          if (!loginInterception) {
            // loginInterception 为false是指不开启路由守卫
            //settings.js loginInterception为false时，创建虚拟权限
            await store.dispatch('user/setPermissions', ['admin'])
            permissions = ['admin']
          } else {
            // 访问后端获取该角色的信息（包含了其对该页面的权限）
            // getUserInfo: 是 from '@/api/user' 的一个访问后端的接口，传入角色的token，返回的则是 { permissions, username, avatar } 形式的数据
            permissions = await store.dispatch('user/getUserInfo')
          }

          // 获取路由的菜单列表
          let accessRoutes = []
          if (authentication === 'intelligence') {
            // 前端控制模式
            // 调用 store 传入 permissions 权限，从而获取到已经完成过滤的路由菜单列表
            accessRoutes = await store.dispatch('routes/setRoutes', permissions)
          } else if (authentication === 'all') {
            // 后端控制模式
            accessRoutes = await store.dispatch('routes/setAllRoutes')
          }
          accessRoutes.forEach((item) => {
            // 把获取到的路由菜单列表逐个添加到全局的路由变量中
            router.addRoute(item)
          })
          next({ ...to, replace: true })
        } catch {
          // 若上方获取角色权限失败，则停止加载条，并且重新写入角色token信息
          await store.dispatch('user/resetAccessToken')
          if (progressBar) VabProgress.done()
        }
      }
    }
  } else {
    // 不持有令牌
    // 检查是否处于免检白名单
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 也不处于免检白名单
      // 根据recordRoute来决定是否保存 去向 的路径，然后统一返回到login页面
      // recordRoute:token失效回退到登录页时是否记录本次的路由
      if (recordRoute) {
        next(`/login?redirect=${to.path}`)
      } else {
        next('/login')
      }

      if (progressBar) VabProgress.done()
    }
  }
  document.title = getPageTitle(to.meta.title)
})
router.afterEach(() => {
  if (progressBar) VabProgress.done()
})
