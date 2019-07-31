<template>

    <q-toolbar class="row" :style="'backgroundColor: ' + (navBackgroundColor || '#fff') + ';'">
        <div v-if="!componentData.hideLogoItem" class="col" @click="logoClick()" style="cursor: pointer;">
            <img :src="logoSrc" :style="'max-height: 35px; max-width: 100%; display: block;' + (windowWidth > 768 ? 'margin: 0 auto;' : '')" />
        </div>
        
        <q-btn 
            v-for="navItem in displayMenu" 
            v-if="showNavItem(navItem)" 
            :key="navItem.id" 
            class="gt-sm col" 
            :id="navItem.id + 'NavItem'" 
            @click="navAction(navItem)" 
            align="center" 
            :style="{ color: navTextColor, margin: '.25rem' }" 
            flat 
            no-caps
            size="sm"
        >
            <span style="position: relative;">
                <q-icon :name="navItem.icon" style="font-size: 1rem;" />
                <span class="pchip" v-if="navItem.id === 'cart'">{{cart.length}}</span>
            </span>
            <span class="gt-md" style="font-size: .8rem;">{{ navItem.title }}</span>
        </q-btn>

        <q-btn 
            @click="signout()"
            class="gt-sm col" 
            v-if="authenticated" 
            id="signOut" 
            :style="'color: ' + navTextColor + '; font-weight: 900;'" 
            outline 
            size="sm"
        >
            <q-icon name="fa-user-circle" /> Sign out
        </q-btn>
    
        <q-btn 
            @click="route('/signin')" 
            class="gt-sm col" 
            v-if="!authenticated" 
            id="signIn" 
            align="center" 
            :style="'color: ' + navTextColor + '; font-weight: 900;'" 
            outline 
            size="sm"
        >
            <q-icon name="fa-user-circle" /> Sign in
        </q-btn>
        
        <q-btn flat class="lt-md">
            <q-icon name="fa-bars" style="font-size: 1.5rem !important;" :color="navBackgroundColor && navBackgroundColor !== '#fff' ? 'white' : 'black'" />
            <q-popover v-model="navPopover" anchor="bottom right" self="top right" :style="{ backgroundColor: navBackgroundColor }">
                <q-list link no-border>
    
                    <q-item v-if="showNavItem(navItem)" v-for="navItem in displayMenu" :key="navItem.id" @click.native="navAction(navItem), navPopover = false">
                        <q-item-side :icon="navItem.icon" :style="{ color: navTextColor }" />
                        <q-item-main :style="{ color: navTextColor }">
                            {{ navItem.title }}
                        </q-item-main>
                    </q-item>
                    
                    <q-item v-if="authenticated" @click.native="signout(), navPopover = false">
                        <q-item-side icon="fa-sign-out-alt" :style="{ color: navTextColor }" />
                        <q-item-main :style="{ color: navTextColor }">
                            Sign out
                        </q-item-main>
                    </q-item>
                    
                    <q-item v-if="!authenticated" @click.native="route('/signin'), navPopover = false">
                        <q-item-side icon="fa-sign-in-alt" :style="{ color: navTextColor }" />
                        <q-item-main :style="{ color: navTextColor }">
                            Sign in
                        </q-item-main>
                    </q-item>
    
                </q-list>
            </q-popover>
        </q-btn>
    
    </q-toolbar>

</template>

<script>
    import cookies from '../../../js/cookies'
    
    export default {
        data() {
            return {
                navPopover: false,
                showNavItem(navItem) {
                    return !navItem.hide && ((!navItem.hideIfNotAuth && !navItem.hideIfAuth) || (navItem.hideIfNotAuth && this.authenticated) || (navItem.hideIfAuth && !this.authenticated))
                }
            }
        },
    
        created() {
            kw('where are we? ', this.api.whichServer())
            // if (!this.api.whichServer()) {
            if (this.api.whichServer()) {
                let redirectURL = `https://go.walkathome.com${this.goingTo}${this.userLoginToken ? `?userLoginToken=${this.userLoginToken}` : ``}`
                kw('redirectURL: ', redirectURL)
                window.location.href = redirectURL
            }
        },
    
        computed: {
            componentData() {
                return this.homePageSectionFromID('nav')
            },
            
            navTextColor() {
                return this.componentData.textColor || '#444'
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
    
            authenticated() {
                return this.$store.state.user.authenticated
            },
    
            userInfo() {
                return this.$store.state.user.info
            },
    
            logoSrc() {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/' + this.environment.name + '.png?t=' + Date.now()
            },
    
            brandColor() {
                return this.environment.json.e.brandColor
            },
    
            navBackgroundColor() {
                return this.componentData.backgroundColor || this.brandColor || ''
            },
    
            cart() {
                return this.$store.state.cart
            },
            
            windowWidth() {
                return this.$store.state.windowWidth
            },
            
            environment() {
                return this.$store.state.environment
            },
            
            navBarData() {
                return this.$store.state.navBarData
            },
            
            goingTo() {
                return this.$store.state.goingTo
            },
            
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
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
                if (navItem.pageRoute) this.route(navItem.pageRoute)
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
            },
    
            signout() {
                cookies.resetCookie('userLoginToken')
                cookies.resetCookie('userSessionToken')
                cookies.resetCookie('userSessionKey')
                
                this.removeLocalStorageItems(['purple_CipherText', 'purple_Salt'])
                
                window.location.reload()
            }
        }
    
    }
</script>

<style>
    .q-btn-standard .q-icon {
        font-size: 14px;
        margin-right: .3rem;
    }
</style>

<style scoped>
    .pchip {
        display: inline-flex;
        background: #efefef;
        color: #000;
        font-size: .8rem; 
        margin: 0 .5rem;
        padding: 0 .3rem;
        border-radius: .5rem !important;
        width: fit-content;
        width: -moz-fit-content;
        position: absolute;
        left: .75rem;
        top: -.75rem;
    }
    
    .q-icon {
        margin: 0 .5rem;
    }
</style>
