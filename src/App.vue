<template>

    <div id="q-app">
        <q-window-resize-observable @resize="onResize" />
        <router-view />
    </div>

</template>

<script>
    import {
        Cookies
    } from 'quasar'

    import Vue from 'vue'
    import VueAnalytics from 'vue-analytics'
    import { userAndProductInfo } from './mixins/userAndProductInfo'
    import { authentication } from './mixins/authentication'
    import { mediaTimeTracking } from './mixins/mediaTimeTracking'
    import { social } from './mixins/social'
    import UAParser from 'ua-parser-js'
    import router from './router'
    import LogRocket from 'logrocket'

    // const jwtDecode = require('jwt-decode')

    export default {
        created() {
            window.versionNumber = '1.0.43.1'

            this.initApp()

            this.$store.commit('windowWidth', window.innerWidth)
            this.$store.commit('windowHeight', window.innerHeight)

            this.replaceQuasarLocalStorageItems()

            if (this.environmentData) {
                this.setGAaccounts()
            }

            var random = Math.floor(Math.random() * 100)
            if (random === 24 || window.location.search.indexOf('logrocket') > -1) {
                window.LRInited = true
                LogRocket.init('dwlu0o/ds9')
            }

            // YUCKY REDIRECTS
            if (window.location.search.indexOf('cart') > -1 && window.location.search.indexOf('149461') > -1 && window.location.hash === '#michigan') {
                let newURL = window.location.href.replace('149461', '148014')
                window.location.href = newURL
            }
        },

        mixins: [userAndProductInfo, authentication, mediaTimeTracking, social],

        name: 'App',

        computed: {
            environmentData() {
                return this.$store.state.environment.data
            },

            environmentJson() {
                return this.$store.state.environment.json
            },

            homePageSections() {
                return this.$store.state.environment.json.homePageSections
            },

            currentView() {
                return this.$store.state.currentView
            },

            navBarData() {
                return this.$store.state.navBarData
            },

            firstVisitToEnvironment() {
                return this.$store.state.firstVisitToEnvironment
            },

            sessionLogObj() {
                return this.$store.state.sessionLogObj
            },

            openPlayerModal() {
                return this.$store.state.openPlayerModal
            }
        },

        watch: {
            environmentName() {
                this.initSessionInfo()
            },

            openPlayerModal() {
                if (this.openPlayerModal) {
                    this.$root.$emit('openPlayerModal', true)
                    this.$store.state.openPlayerModal = false
                }
            },

            currentView() {
                // k('currentView watcher: ', this.currentView)
                this.checkIfScriptNeedsToBeAdded()
            },

            environmentData() {
                this.setGAaccounts()
                this.getUserSubscriptionProductStatusHistory()
            },

            userLoginToken() {
                this.getUserSubscriptionProductStatusHistory()
            },

            environmentJSON() {
                this.getUserSubscriptionProductStatusHistory()
            },

            initialParameters() {
                kw("initialParameters: ", this.initialParameters)
            }
        },

        methods: {
            replaceQuasarLocalStorageItems() {
                this.localStorage.remove(this.environmentName + 'HomePageJson')

                this.localStorage.each((value, key) => {
                    if (typeof value === 'string') {
                        if (value.startsWith('__q_bool|')) {
                            let val = value.substring(9)

                            if (val === '1') {
                                this.localStorage.set(key, true)
                            }
                            else if (val === '0') {
                                this.localStorage.set(key, false)
                            }
                            else {
                                this.localStorage.set(key, val)
                            }

                        }
                        else if (value.startsWith('__q_objt|')) {
                            this.localStorage.set(key, JSON.parse(value.substring(9)))
                        }
                        else if (value.startsWith('__q_numb|')) {
                            this.localStorage.set(key, Number(value.substring(9)))
                        }
                        else if (value.startsWith('__q_strn|')) {
                            this.localStorage.set(key, value.substring(9))
                        }
                    }
                })
            },

            onResize(size) {
                this.$store.commit('windowWidth', size.width)
                this.$store.commit('windowHeight', size.height)
            },

            checkIfScriptNeedsToBeAdded() {
                if (this.environmentJson && this.environmentJson.codeSnippet && this.currentView) {
                    k('code to inject: ', this.environmentJson.codeSnippet[this.currentView])
                    this.injection.injectCodeForCurrentView(this.currentView)
                }
            },

            checkIfCSSNeedsToBeAdded() {
                k('css to inject: ', this.environmentJson.e.customCSSfile)
                var cssObj = {
                    id: this.environmentJson.e.customCSSfile + 'CSS',
                    headOrBody: 'head',
                    filename: this.environmentJson.e.customCSSfile + '.css'
                }
                this.injection.injectCSSFileIntoDOM(cssObj)
            },

            initApp() {

                // save user agent info
                this.$store.commit('userAgentInfo', new UAParser().getResult())

                this.collectAndSetURLParams()

                this.determineEnvironmentName(() => {
                    this.setIconTags()

                    // get e data
                    this.getEnvironmentData(this.environmentName, (eData) => {

                        this.$store.commit('saveEnvironmentData', eData)
                        this.setEnvironmentVisitVar()

                        this.checkUserTokensThenInitUser()

                        // get homePageJSON
                        this.getHomePageJSON(this.environmentName, (data) => {
                            if (data) {
                                this.$store.commit('saveHomePageJSON', data)
                                this.setNavData()

                                kw('codeSnippet CODE TO INJECT?', data.codeSnippet, this.currentView)
                                if (data.codeSnippet) {
                                    //index injection
                                    this.injection.injectCodeForCurrentView('index')

                                    // initial view injection
                                    this.checkIfScriptNeedsToBeAdded()
                                }

                                if (data.e.customCSSfile) {
                                    this.checkIfCSSNeedsToBeAdded()
                                }

                                if (data.e.includeSocialLogin) {
                                    if (data.e.includeSocialLogin.facebookAppID) {
                                        // purple oauth: '1714862968734311'

                                        let facebookAppID = data.e.includeSocialLogin.facebookAppID

                                        window.fbAsyncInit = function() {
                                            k('fbAsyncInit! ', facebookAppID)
                                            FB.init({
                                                appId: facebookAppID,
                                                cookie: true, // enable cookies to allow the server to access the session
                                                xfbml: true, // parse social plugins on this page
                                                version: 'v2.8' // use graph api version 2.8
                                            })

                                            FB.getLoginStatus(function(response) {
                                                k('status change: ', response)
                                                if (response.status === 'connected') {
                                                    // Logged into your app and Facebook.
                                                    FB.api('/me', function(response) {
                                                        k('Successful login for: ' + response.name)
                                                    });

                                                    window.userLoggedInToFB = true
                                                }
                                            });
                                        };

                                        this.injection.injectScriptIntoDOM({
                                            id: 'FBSDK',
                                            headOrBody: 'body',
                                            code: '(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "https://connect.facebook.net/en_US/sdk.js"; fjs.parentNode.insertBefore(js, fjs); }(document, "script", "facebook-jssdk"));'
                                        })
                                    }

                                    if (data.e.includeSocialLogin.googleAppID) {
                                        k('initing googleAuth with: ', data.e.includeSocialLogin.googleAppID)

                                        gapi.client.init({
                                            clientId: data.e.includeSocialLogin.googleAppID,
                                            scope: 'profile email'
                                        }).then(() => {
                                            k('Listen for googleAuth state changes.')
                                        });
                                    }
                                }
                            }
                        })
                    })
                })

            },

            determineEnvironmentName(cb) {
                // determine environmentName in params
                if (!window.location.hostname.includes('platformpurple') && !this.initialParameters.e) {
                    this.$store.commit('saveEnvironmentName', window.location.hostname.split('.').slice(0, -1).join(''))
                    cb()
                }
                else if (!this.initialParameters.e && (this.initialParameters.shopID || this.initialParameters.affiliate)) {

                    var key = this.initialParameters.shopID ? 'shopID' : this.initialParameters.affiliate ? 'affiliateID' : ''
                    var val = this.initialParameters.shopID || this.initialParameters.affiliate
                    this.findEnvironmentName(key, val, (environment) => {

                        var baseURL = environment.vanityURL ? 'https://' + environment.vanityURL : window.location.origin
                        k('baseURL: ', baseURL)
                
                        // add environment to users path
                        var env = environment.vanityURL ? '' : '?e=' + environment.environmentName
                        var paramStr = environment.vanityURL ? '?' : '&'

                        // create route for vanity redirect or param replacement
                        for (var i = 0; i < Object.keys(this.initialParameters).length; i++) {
                            var paramKey = Object.keys(this.initialParameters)[i]
                            var paramValue = this.initialParameters[paramKey]

                            k('?? ', paramStr, i, Object.keys(this.initialParameters).length - 1 )
                            if (paramKey !== 'shopID' && paramKey !== 'shop' && paramKey !== 'affiliate') paramStr += paramKey + '=' + paramValue + (i < Object.keys(this.initialParameters).length - 1 ? '&' : '')
                        }

                        var route = window.location.pathname + env + (paramStr !== '?' && paramStr !== '&' ? paramStr : '')
                        var url = baseURL + route
                        kw('new url: ', baseURL, route)

                        if (environment.vanityURL) {
                            window.location.href = url
                        }
                        else {
                            //change users url path
                            window.history.replaceState({}, environment.shopName, url)

                            // add and remove initialParameters for .route()
                            var initialParameters = this.j_.cloneObject(this.initialParameters)
                                initialParameters.e = environment.environmentName
                            if (initialParameters.shop) delete initialParameters.shop
                            if (initialParameters.shopID) delete initialParameters.shopID
                            if (initialParameters.affiliate) delete initialParameters.affiliate
                            this.$store.commit('initialParameters', initialParameters)

                            this.route(route)

                            // set environment info
                            if (environment) {
                                this.$store.commit('saveEnvironmentName', environment.environmentName)
                            } else {
                                this.$store.commit('saveEnvironmentName', 'purple')
                            }

                            cb()
                        }
                    })
                }
                else if (this.initialParameters.e) {
                    this.$store.commit('saveEnvironmentName', this.initialParameters.e)
                    cb()
                }
                else {
                    this.$store.commit('saveEnvironmentName', 'purple')
                    cb()
                }
            },

            checkUserTokensThenInitUser() {
                // check if saved anonymousUserID
                if (Cookies.get('anonymousUserID')) {
                    k('has anon ID')
                    this.$store.commit('anonymousUserID', Cookies.get('anonymousUserID'))
                }

                // check if saved token
                if (Cookies.get('userLoginToken')) {
                    k('has saved ult')
                    this.$store.commit('userLoginToken', Cookies.get('userLoginToken'))
                    this.$store.commit('authenticated', true)

                    this.initUser()
                    this.afterUserTokens()
                } else if (Cookies.get('userSessionToken')) {
                    k('has saved session token')
                    this.getUserInfoFromSessionToken(Cookies.get('userSessionToken'), (res) => {

                        // no response but has sessiontoken, continue app execution
                        if (!res || !res.success) {
                            this.continueAsAnon()
                        }

                        if (res.success) {
                            this.$store.commit('userLoginToken', res.userLoginToken)
                            this.$store.commit('authenticated', true)

                            this.initUser()
                            this.afterUserTokens()
                        }
                    })
                } else {
                    this.continueAsAnon()
                }
            },

            continueAsAnon() {
                if (!Cookies.get('anonymousUserID')) {
                    k('no anonID')
                    // create new anonymousUserID
                    this.$store.commit('anonymousUserID', this.j_.uaid('a'))
                    this.afterUserTokens()
                } else {
                    this.afterUserTokens()
                }
            },

            getUserInfoFromSessionToken(sessionToken, cb) {
                //https://api-v4-dev2.platformpurple.com/api/user/loginTokenFromSessionToken?sessionToken=bvmz55rxpj404c4og8g8g8cwo
                this.api.get(this.api.apiv4Route + 'api/user/loginTokenFromSessionToken?sessionToken=' + sessionToken, (res) => {
                    cb(res)
                })
            },

            afterUserTokens() {
                this.getProductsAndTags4Environment()
                this.loadInBrowserStorage()
                this.takeActionOnParams()
            },

            setGAaccounts() {
                k('eData: ', this.environmentData)
                k('GA account: ', this.api.whichServer())

                var UAIDs = []
                if (this.api.whichServer()) {
                    //dev UA
                    UAIDs.push('UA-65553602-1')
                }
                else {
                    // production UA
                    UAIDs.push('UA-41927841-8')
                }

                if (this.environmentData && this.environmentData.gaAccount) {
                    UAIDs.push(this.environmentData.gaAccount)
                }

                // k('adding UAIDs to GA: ', UAIDs)
                Vue.use(VueAnalytics, {
                    id: UAIDs,
                    router,
                    ecommerce: {
                        enabled: true
                    }
                })
            },

            addProductsInSectionsFromCache(data) {
                var cacheData = this.localStorage.get(this.environmentName + 'HomePageJson')
                data.homePageSections.forEach((section) => {
                    if (section.component === 'productSection') {
                        cacheData.homePageSections.forEach((cachedSection) => {
                            if (cachedSection.id === section.id) section.products = cachedSection.products
                        })
                    }
                })
                return data
            },

            getAllQueryVars() {
                var initialParameters = {}
                var query = window.location.search.substring(1)
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=")
                    if (pair[0] !== 'redirect') initialParameters[pair[0]] = pair[1]
                }
                k('getAllQueryVars: ', initialParameters)
                return initialParameters
            },

            setEnvironmentVisitVar() {
                var environmentHasBeenVisited = this.localStorage.get(this.environmentName + 'Visit')
                k('environmentHasBeenVisited: ', environmentHasBeenVisited)

                this.$store.commit('firstVisitToEnvironment', environmentHasBeenVisited ? false : true)
                if (!environmentHasBeenVisited) this.localStorage.set(this.environmentName + 'Visit', true)
            },

            loadInBrowserStorage() {
                // load in saved cart
                var cart = this.localStorage.get(this.environmentName)
                if (cart && cart.length) {
                    // k('saved cart! ', cart)
                    this.$store.commit('saveCart', cart)
                }

                // load in saved giftBoxes
                var giftBoxes = this.localStorage.get(this.environmentName + 'GiftBoxes')
                if (giftBoxes && Object.keys(giftBoxes).length) {
                    // k('saved giftBoxes! ', giftBoxes)
                    this.$store.commit('giftBoxes', giftBoxes)
                }
            },

            collectAndSetURLParams() {
                // query vars
                var initialParameters = this.getAllQueryVars()
                kw('collectAndSetURLParams: ', initialParameters)

                this.$store.commit('initialParameters', initialParameters)

                // direct url login
                if (initialParameters.userLoginToken) {
                    this.$store.commit('userLoginToken', initialParameters.userLoginToken)
                }

                if (initialParameters.referralToken) {
                    this.$store.commit('referralToken', initialParameters.referralToken)
                }

                if (initialParameters.source) {
                    this.$store.commit('sourceAffID', initialParameters.source)
                }
            },

            takeActionOnParams() {
                if (this.initialParameters.categories) {
                    var cats = this.j_.cloneObject(this.initialParameters.categories)
                    this.$store.commit('deleteKeyPathInStore', 'initialParameters.categories')

                    this.route('/tagFilter/' + cats)
                }
            },

            initSessionInfo() {
                k('initSessionInfo!')

                // paypal session info
                // let activePaypalCheckoutSessionGroup = LocalStorage.get.item('activePaypalCheckoutSessionGroup')
                let activePaypalCheckoutSessionInfoEventObj = this.localStorage.get('activePaypalCheckoutSessionInfoEventObj')

                k('activePaypalCheckoutSessionInfoEventObj: ', activePaypalCheckoutSessionInfoEventObj)
                if (activePaypalCheckoutSessionInfoEventObj) {

                    this.$store.commit('sessionGroup', activePaypalCheckoutSessionInfoEventObj.sessionGroup)
                    this.$store.commit('sessionLogObj', activePaypalCheckoutSessionInfoEventObj)
                    this.localStorage.remove('activePaypalCheckoutSessionInfoEventObj')
                } else {
                    this.$store.commit('sessionGroup', this.j_.uaid('s'))
                    this.setupSessionLogObj()
                }

                this.sendCurrentMediaPlayEventIfExists()
            },

            setupSessionLogObj() {

                // setup sessionInfoEvent
                var sessionInfoEvent = {
                    eventType: 'sessionInfo',
                    environment: this.environmentName,
                    sessionGroup: this.sessionGroup,
                    browser: this.userAgentInfo && this.userAgentInfo.browser ? this.userAgentInfo.browser.name : '',
                    os: this.userAgentInfo && this.userAgentInfo.os ? this.userAgentInfo.os.name : '',
                    osVersion: this.userAgentInfo && this.userAgentInfo.os ? this.userAgentInfo.os.version : '',
                    browserVersion: this.userAgentInfo && this.userAgentInfo.browser ? this.userAgentInfo.browser.version : '',
                    device: this.userAgentInfo ? this.userAgentInfo.device : '',
                    referrer: document.referrer,
                    cpu: this.userAgentInfo.cpu ? this.userAgentInfo.cpu : null,
                    firstVisitToEnvironment: this.firstVisitToEnvironment ? true : false,
                    anonymousUserID: this.anonymousUserID ? this.anonymousUserID : null,
                    appVersionNumber: window.versionNumber
                }

                // add utm params to sessionInfoEvent
                if (Object.keys(this.initialParameters).length) {
                    var importantParams = [ 'sid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'email', 'emailToken' ]
                    Object.keys(this.initialParameters).forEach((paramKey) => {
                        if (importantParams.includes(paramKey)) {
                            kw('adding param', paramKey)

                            let sessionInfoKey = paramKey
                            let sessionInfoVal = this.initialParameters[paramKey]

                            if (paramKey === 'email') {
                                sessionInfoKey = 'emailParameter'
                                // k('emailParameter val: ', this.initialParameters[paramKey])
                                // k('emailParameter decoded val: ', decodeURIComponent(this.initialParameters[paramKey]))

                                sessionInfoVal = decodeURIComponent(this.initialParameters[paramKey])
                            }

                            if (paramKey === 'emailToken') {
                                k('emailToken param: ', this.initialParameters[paramKey])
                                // jwt.decode value
                                // {
                                //   "email": "grace@platformpurple.com"
                                // }

                                // var jwtValue = jwtDecode(this.initialParameters[paramKey])
                                // k('jwtValue: ', jwtValue)

                                // // set this.initialParameters.email to decoded value
                                // this.initialParameters.email = jwtValue.email
                                // this.$store.commit('initialParameters', this.initialParameters)
                            }

                            sessionInfoEvent[sessionInfoKey] = sessionInfoVal
                        } else {
                            kw('this param key not important', paramKey)
                        }
                    })
                }

                k('sessionInfoEvent: ', sessionInfoEvent)

                this.$store.commit('sessionLogObj', sessionInfoEvent)
                this.api.sendEvent(sessionInfoEvent)
            },

            getEnvironmentData(environmentName, cb) {

                // https://api-v4-dev2.platformpurple.com/api/entity/environmentInfo
                this.api.get(this.api.apiv4Route + 'api/entities/environmentInfo?environmentName=' + environmentName, (res) => {
                    k('ENVIRONMENT: ', res)

                    if (res.success && res.environmentInfo) {
                        document.title = res.environmentInfo.shopName
                        res.environmentInfo.environmentName = environmentName
                        cb(res.environmentInfo)
                    } else {
                        var clean_uri = location.protocol + "//" + location.host + location.pathname
                        window.history.replaceState({}, document.title, clean_uri)

                        this.$store.commit('saveEnvironmentName', 'purple')
                        this.getEnvironmentData('purple', cb)
                    }
                })
            },

            getHomePageJSON(environmentName, cb) {
                this.api.get(this.api.apiv4Route + 'api/entities/environmentJSON?environment=' + environmentName, (res) => {
                    k('homepage JSON: ', res)

                    if (res.error) throw res.error
                    if (res.environmentJSON) {
                        cb(res.environmentJSON)
                    }
                    else {
                        // var clean_uri = location.protocol + "//" + location.host + location.pathname
                        // window.history.replaceState({}, document.title, clean_uri)
                        this.getHomePageJSON('default', cb)
                    }
                })
            },

            findEnvironmentName(key, val, cb) {
                k('findEnvironmentName: ', key, val)

                var req = {}
                    req[key] = val

                k('findEnvironmentName req: ', req)

                this.api.post(this.api.apiv4Route + 'api/entities/vanityDomains4ShopAffiliate', req, (res) => {
                    k('findEnvironmentName res: ', res)

                    if (res.rows && res.rows.length > 0) {
                        // m.environmentName = res.rows[0].environmentName
                        cb(res.rows[0])
                    } else {
                        k('shopID could not be found')
                        // window.location.href = removeVariableFromURL(window.location.href, 'shopID')
                        cb(false)
                    }
                })
            },

            navComponent() {
                return this.homePageSectionFromID('nav')
            },

            setNavData() {
                // kw('setNavData!')

                if (this.navComponent() && this.navComponent().navMenu) {
                    this.clientCustomizeNavBar()
                }
            },

            clientCustomizeNavBar() {
                // kw('clientCustomizeNavBar!')
                this.navComponent().navMenu.forEach((navItem) => {
                    // is this in default? then update the default
                    navItem = this.updateNavItem(navItem)
                    // k('navItem: ', navItem)

                    var theIndex2replace = this.j_.indexFromArray(this.navBarData, 'navItemSKU', navItem.navItemSKU)
                    if (theIndex2replace > -1) {
                        // k('navItem exsists')
                        Object.keys(navItem).forEach((key) => {
                            this.navBarData[theIndex2replace][key] = navItem[key]
                        })
                    }
                    else {
                        // k('new navItem')
                        // this is a new nav item, find index to add after and add it
                        var index2addAfter = this.j_.indexFromArray(this.navBarData, 'navItemSKU', navItem.addAfter)
                        // k('navbar index2addAfter: ', this.navBarData, index2addAfter)
                        this.navBarData.splice(index2addAfter + 1, 0, navItem)
                    }
                    this.$store.commit('saveNavBarData', this.navBarData)
                })

            },

            setIconTags() {
                var squareLink = 'https://f3r6v6t8.ssl.hwcdn.net/static/shopLogoSquares/' + this.environmentName + '_square.png'
                var faviconLink = 'https://f3r6v6t8.ssl.hwcdn.net/static/shopLogoIcons/' + this.environmentName + '_icon.png'
                // k('icon tag links: ', squareLink, faviconLink)

                var touchIcon = document.createElement('link')
                    touchIcon.href = squareLink
                    touchIcon.rel = 'apple-touch-icon'

                var touchStartUp = document.createElement('link')
                    touchStartUp.href = squareLink
                    touchStartUp.rel = 'apple-touch-startup-image'

                var favicon = document.createElement('link')
                    favicon.href = faviconLink
                    favicon.rel = 'icon'
                    favicon.type = 'image/png'

                document.getElementsByTagName('head')[0].appendChild(touchIcon)
                document.getElementsByTagName('head')[0].appendChild(touchStartUp)
                document.getElementsByTagName('head')[0].appendChild(favicon)

                // $('head').append('<link rel="apple-touch-icon" href="https://f3r6v6t8.ssl.hwcdn.net/static/shopLogoSquares/' + this.environmentName + '_square.png" />')
                // $('head').append('<link rel="apple-touch-startup-image" href="https://f3r6v6t8.ssl.hwcdn.net/static/shopLogoSquares/' + this.environmentName + '_square.png" />')
                // $('head').append('<link rel="icon" type="image/png" href="https://f3r6v6t8.ssl.hwcdn.net/static/shopLogoIcons/' + this.environmentName + '_icon.png" />')
            },

            updateNavItem(navItem) {
                if (navItem.navItemSKU === 'activate') navItem.icon = 'fa-tag'
                return navItem
            }

        }
    }

</script>

<style>

</style>
