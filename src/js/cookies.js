import Quasar, { Cookies } from 'quasar'

const cookies = {
    getCookie(key) {
        return Cookies.get(key)
    },
    
    setCookie(key, value) {
        let domain = window.location.hostname
        
        let domainElements = domain.split('.')
        if (domainElements.length > 2) {
            domainElements.shift()
            domain = domainElements.join('.')
        }
        
        k('setCookie: ', key, value, domain)
        
        Cookies.set(key, value, { expires: 365, domain: domain, path: '/' })
    },
    
    resetCookie(key) {
        let domain = window.location.hostname
        
        let domainElements = domain.split('.')
        if (domainElements.length > 2) {
            domainElements.shift()
            domain = domainElements.join('.')
        }
        Cookies.set(key, '', { expires: -1, domain: domain, path: '/' })
        Cookies.set(key, '', { expires: -1, domain: `.${domain}`, path: '/' })
        Cookies.set(key, '', { expires: -1, domain: window.location.hostname, path: '/' })
        Cookies.set(key, '', { expires: -1, domain: `.${window.location.hostname}`, path: '/' })
        Cookies.remove(key)
        
        // this.removeAllInstancesOfCookie(key)
    },
    
    // removeAllInstancesOfCookie(key) {
    //     k('removeAllInstancesOfCookie: ', key)
        
    //     var cookie = this.getCookie(key)
    //     k('cookie2remove: ', cookie)
        
    //     if (cookie) {
    //         // Cookies.remove(key)
    //         Cookies.set(key, '', { expires: -1 })
            
    //         debugger
    //         this.removeAllInstancesOfCookie(key)
    //     } else {
    //         k('no more instances')
    //     }
    // }
}

export default cookies
