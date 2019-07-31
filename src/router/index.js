import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import store from '../store'
import cookies from '../js/cookies'
import Quasar, {
    LocalStorage,
    Cookies
}
from 'quasar'

Vue.use(VueRouter)

const Router = new VueRouter({
    /*
     * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
     *
     * If you decide to go with "history" mode, please also set "build.publicPath"
     * to something other than an empty string.
     * Example: '/' instead of ''
     */

    // Leave as is and change from quasar.conf.js instead!
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
    scrollBehavior(to, from, savedPosition) {
        kw('scrollBehavior to', to, 'from', from)

        let routesToNotScrollUpMap = {
            'tagFilter': 'shop',
        }
        
        var scrollUp = !shouldNotScrollUp(to.name, from.name)
        k('scrollUp: ', scrollUp)
        
        if (scrollUp && !to.hash) {
            return { x: 0, y: 0 }
        }
        
        function shouldNotScrollUp(from, to) {
            k('shouldNotScrollUp: ', from, to, (routesToNotScrollUpMap[from] === to), (routesToNotScrollUpMap[to] === from), from === to && from !== 'preview' && to !== 'preview')
            
            return ((routesToNotScrollUpMap[from] && routesToNotScrollUpMap[from] === to) || (routesToNotScrollUpMap[to] && routesToNotScrollUpMap[to] === from) || (from === to && from !== 'preview' && to !== 'preview'))
        }
        
    },
    routes
})

// const createNewToObj = (to) => {

//     var newToObj = {}
//         newToObj.fullPath = to.fullPath
//         newToObj.hash = to.hash
//         newToObj.matched = to.matched
//         newToObj.meta = to.meta
//         newToObj.name = to.name
//         newToObj.params = to.params
//         newToObj.path = to.path
//         newToObj.query = to.query
        
//     return newToObj
// }

Router.beforeEach((to, from, next) => {
    kw('before route: ', to, from, store.state)
    // k('auth: ', store.state.user.authenticated)
    // k('ult: ', Cookies.get('userLoginToken'))

    store.state.comingFrom = from.path.includes('/support/') ? '/support' : from.path
    store.state.goingTo = to.path
    if (to.name !== 'preview' && to.name !== 'checkout' && to.name !== 'tagFilter') store.state.currentView = ''

    var newToObj
    if (to.query.userLoginToken) {
        kw('have user login token')
        cookies.setCookie('userLoginToken', to.query.userLoginToken)

        // delete from router path obj
        delete to.query.userLoginToken

        // create new router path obj
        newToObj = {}
        newToObj.name = to.name
        newToObj.path = to.path
        newToObj.fullPath = to.fullPath.slice(0, to.fullPath.indexOf('userLoginToken'))
        newToObj.query = to.query
        
        newToObj.matched = to.matched
        newToObj.meta = to.meta
        newToObj.params = to.params
    }

    if (to.matched.some(record => record.meta.requiresAuth) && !store.state.user.authenticated && !Cookies.get('userLoginToken')) {
        kw('not authenticated')
        // create new router path obj
        newToObj = {}
        newToObj.name = 'signin'
        newToObj.path = '/signin'
        newToObj.fullPath = to.fullPath
        newToObj.hash = to.hash
        
        let query = to.query
            query.redirect = to.fullPath
            
        newToObj.query = query
        
        newToObj.matched = to.matched
        newToObj.meta = to.meta
        newToObj.params = to.params
        
        kw('not authenticated newToObj: ', newToObj)
    } else {
        kw('clean up router path')
        // clean up route path when not going to signin
        if (to.query && to.query.redirect && to.name !== 'signin') {
            // delete from router path obj
            delete to.query.redirect
        
            // create new router path obj
            newToObj = {}
            newToObj.name = to.name
            newToObj.path = to.path
            newToObj.fullPath = to.fullPath.slice(0, to.fullPath.indexOf('redirect'))
            newToObj.query = to.query
            newToObj.hash = to.hash
            
            newToObj.matched = to.matched
            newToObj.meta = to.meta
            newToObj.params = to.params
            
            k('route cleanup: ', newToObj)
        }
    }
    
    // hijack 404
    store.state.currentView = to.name === 'catchAll' ? to.path.replace('/', '') : to.meta.currentView
    
    k('current view in router: ', store.state.currentView, store.state.environment.json)
    k('newToObj: ', newToObj)
    newToObj ? next(newToObj) : next()
    
})

// Router.afterEach((to, from, next) => {
//     kw('AFTER EACH: ', store.state.searchString, document.querySelector('input#homeSearch'))
//     if (store.state.searchString && document.querySelector('input#homeSearch')) {
//         document.querySelector('input#homeSearch').focus()
//         document.querySelector('input#homeSearch').select()
//     }
// })

export default Router
