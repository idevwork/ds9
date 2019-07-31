
import store from '../store/index'
import c from '../js/logs'
import http from 'axios'
import j_ from '@jmellicker/j_'

const forceProductionAPI = false

const whichServer = function() { // returns -dev, -staging or ''

    if (window.location.host.indexOf('localhost') > -1) {
        return '-dev2';
    }
    
    if (window.location.host.indexOf('staging') > -1) {
        return '-staging'
    }


    var returnValue

    var URLprefix = j_.firstItemOf(window.location.host, '.')

    var serverType = forceProductionAPI ? '' : URLprefix.split('-').pop()

    // kw('which server? ' + serverType)
    // TODO SUPER IMPORTANT: remove before production
    // return '-dev2'
    switch (serverType) {
        case 'dev':
        case 'dev4':
        case 'dev5':
        case 'voyager':
        case 'searchforspock':
        case 'branch':
            returnValue = '-dev2'
            break;
        case 'staging':
            returnValue = '-staging'
            break;
        default:
            returnValue = ''


    }

    // TODO VERY IMPORTANT:  remove before pushing to production
    // returnValue = '-staging'

    return returnValue
}

// const endpointDomain4Server = function(reqRoute)

const api = {
    whichServer: whichServer,

    ioRoute: whichServer() ? 'https://io-dev.platformpurple.com/' : 'https://io.platformpurple.com/',
    apiv3Route: whichServer() ? 'https://api-v3' + whichServer() + '.platformpurple.com/' : 'https://api-v3.platformpurple.com/',
    apiv4Route: whichServer() ? 'https://api-v4' + whichServer() + '.platformpurple.com/' : 'https://api-v4.platformpurple.com/',
    bigRoute: whichServer() ? 'https://big-dev.platformpurple.com/' : 'https://big.platformpurple.com/',

    get(route, cb) {
        this.send2API('get', route, {}, cb)
    },

    post(route, req, cb) {
        this.send2API('post', route, req, cb)
    },

    put(route, req, cb) {
        this.send2API('put', route, req, cb)
    },

    delete(route, cb) {
        this.send2API('delete', route, {}, cb)
    },

    send2API(method, route, req, cb) {
        // c.gbh('send2API')
        // c.g(method)
        // c.g(route)
        // c.g(req)
        http[method](route, req).then(res => {
            k('send2API res:', res.data)
            cb(res.data)
        }).catch(error => {
            kw('API ERROR: ', error)
            throw error
        })
    },

    sendEvent(event, cb) {
        event.sessionGroup = store.state.sessionGroup
        event.origin = 'ds9' + whichServer()
        event.environment = store.state.environment.name // test
        event.clientTimestamp = Date.now()

        var currentSessionInfo = j_.cloneObject(store.state.sessionLogObj)
        // k('currentSessionInfo: ', currentSessionInfo)

        var mergedEvent = event.eventType !== 'sessionInfo' ? j_.mergeObjects(event, currentSessionInfo) : event
        var route = this.ioRoute + 'logEvent'

        // c.pbh('sending event')
        // c.p(mergedEvent)
        kw('sending event')
        k(j(mergedEvent))

        this.post(route, mergedEvent, (res) => {
            // k('sendEvent res: ', res)
            if (cb) return cb(res)
        })
    },

    // apiv3
    // signURL(sku, url, userLoginToken, cb) {
    //     var req = {
    //         userLoginToken: userLoginToken,
    //         productSKU: sku,
    //         url: url
    //     }

    //     console.log('signURL req: ', req)

    //     this.post(this.apiv3Route + 'product/signedURL', req, (res) => {
    //         console.log('signURL res: ', res)
    //         if (!res) {
    //             // logEvent({
    //             //     eventType: 'requestError',
    //             //     eventDesc: 'error requesting signed URL from API',
    //             // })
    //         }
    //         cb(res)
    //     })
    // },

    signURL(productSKU, fileName, userLoginToken, mediaType, cb) {
        var req = {
            mediaType: mediaType,
            productSKU: productSKU,
            fileName: fileName,
            userLoginToken: userLoginToken
        }

        k('signURL req: ', req)

        this.post(this.apiv4Route + 'api/product/signedURL', req, (res) => {
            // k('signURL res: ', res)
            if (!res || !res.success) {
                // logEvent({
                //     eventType: 'requestError',
                //     eventDesc: 'error requesting signed URL from API',
                // })
            }
            cb(res)
        })
    },
}

export default api
