import j_ from '@jmellicker/j_'

export default ({ Vue, store, router }) => {
  
    Vue.prototype.route = (route) => {
        // for keeping params around on the url for refreshing
        var routeObj = { path: route, query: store.state.initialParameters }
        k('routing: ', routeObj)
        router.push(routeObj)
    }
    
    let loadItHelper = (name, path) => {
        Vue.component(name, require('../components/' + path + '.vue').default)
    }
    
    Vue.prototype.loadIt = (name, path) => {
        kw('loadIt ', name, path)
        loadItHelper(name, path)
    }

    Vue.prototype.loadNeededComponentsForView = (cb) => { // this will be called when the view changes
        const currentView = store.state.currentView
        const components = store.state.environment ? store.state.environment.json.homePageSections : ''
        // if (!components) return false // sometimes this gets called before component data is ready
        
        let pathMap = {
            'shopCheckout': 'common/shop/checkout/shopCheckout',
            'productPreview': 'common/shop/productPreview'
        }
        let componentPath = ''
    
        components.forEach(component => {
            if (component.component !== 'topHomeNav' && 
            (component.alwaysVisible || (component.visibility && component.visibility[currentView]))
            ) {
                // k('component load for view: ', component)
                if (component.componentPath) { // custom component
                    componentPath = 'customComponents/' + component.componentPath.replace('.html', '')
                }
                else if (pathMap[component.component]) {
                    componentPath = pathMap[component.component]
                }
                else {
                    componentPath = 'common/showcase/' + component.component
                }
                loadItHelper(component.component, componentPath)
            }
        })
        
        // load custom components that are not listed in visibility by default
        var customLayoutKeys = ['customProductCard', 'customVideoLayout', 'customAudioLayout', 'customEbookLayout', 'customAdditionalMediaLayout']
        customLayoutKeys.forEach((key) => {
            if (store.state.environment.json.e[key]) {
                // find component data
                var component = homePageSectionFromIDHelper(store.state.environment.json.e[key])
                // k('component: ', component, key)
                loadItHelper(store.state.environment.json.e[key], 'customComponents/' + component.componentPath.replace('.html', ''))
            }
        })
        
        cb()
    }
            
    Vue.prototype.scrollIt = (id, selectorToScroll, offset) => {
        var element = document.getElementById(id)
        k('element: ', element)
        
        var elementToScroll = selectorToScroll ? document.querySelector(selectorToScroll) : window
        k('elementToScroll: ', elementToScroll)
        
        // scrollToOptions doesnt work on mobile chrome
        // elementToScroll.scrollTo({
        //     'behavior': 'smooth',
        //     'left': 0,
        //     'top': element.offsetTop - (offset || 25)
        // });
        
        elementToScroll.scrollTo( 0, element.offsetTop - (offset || 25) );
    }
    
    let homePageSectionFromIDHelper = (id) => {
        // k('homePageSectionFromID: ', id, store.state.environment.json.homePageSections)
        return j_.queryArrayFirstMatch(store.state.environment.json.homePageSections, 'id', id)
    }

    Vue.prototype.homePageSectionFromID = (id) => {
        return homePageSectionFromIDHelper(id)
    }
}