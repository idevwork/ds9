import cookies from '../js/cookies'
import { globalComputedData } from './globalComputedData'
    
export const topNavTools = {
    mixins: [globalComputedData],
    
    data() {
        return {
            showMobileMenu: false,
            showNavItem(navItem) {
                return !navItem.hide && ((!navItem.hideIfNotAuth && !navItem.hideIfAuth) || (navItem.hideIfNotAuth && this.authenticated) || (navItem.hideIfAuth && !this.authenticated))
            }
        }
    },
        
    computed: {
        componentData() {
            return this.homePageSectionFromID('nav')
        },
        
        navTextColor() {
            return this.componentData.textColor || '#444'
        },     
        
        authButtonColor() {
            return this.componentData.authButtonColor || '#fff'
        },     
        
        authButtonTextColor() {
            return this.componentData.authButtonTextColor || '#444'
        },

        displayMenu() {
            let displayMenuData = this.j_.cloneObject(this.navBarData)

            let cartIndex = this.j_.indexFromArray(displayMenuData, 'navItemSKU', 'cart')

            if (!this.cart.length) {
                // k('no cart items')
                displayMenuData.splice(cartIndex, 1)
            }

            if (!this.authenticated) displayMenuData.splice(this.j_.indexFromArray(displayMenuData, 'navItemSKU', 'account'), 1)
            return displayMenuData
        },

        logoSrc() {
            return 'https://vault.platformpurple.com/static/shopLogos/' + this.environment.name + '.png?t=' + Date.now()
        },

        navBackgroundColor() {
            return this.componentData.backgroundColor || this.brandColor || ''
        },
        
        navBarData() {
            return this.$store.state.navBarData
        }
    },
    
    methods: {
        logoClick() {
            if (this.environment.json.e.logoLink) {
                window.open(this.environment.json.e.logoLink)
            } else if (this.environment.json.e.logoRoute) {                    
                this.route(this.environment.json.e.logoRoute)
            } else {
                this.route('/')
            }
        },
        
        navAction(navItem) {
            if (navItem.pageRoute) {
                if (navItem.pageRoute === '/') {
                    this.$store.commit('searchString', '')
                    this.$store.commit('setUserSelectedTags', '')
                }
                
                this.route(navItem.pageRoute)
            }
            if (navItem.action) this[navItem.action]()
            if (navItem.URL) window.open(navItem.URL)
            
            // this.$parent.sides.right = false
        },

        openShopCart() {
            // k('openShopCart')
            this.$root.$emit('openShopCart', true)
        },
        
        removeLocalStorageItems(keys2remove) {
            k('removeLocalStorageItems: ', keys2remove)
            keys2remove.forEach((key) => {
                this.localStorage.remove(key)
            })
        }
    },
}