<template>

    <q-toolbar class="row" :style="'backgroundColor: ' + (navBackgroundColor || '#fff') + ';'">
        <div v-if="!componentData.hideLogoItem" class="col" @click="logoClick()" style="cursor: pointer; min-width: 7rem;">
            <img :src="logoSrc" :style="'max-height: 35px; max-width: 100%; display: block;' + (windowWidth > 768 ? 'margin: 0 auto;' : '')" />
        </div>
        
        <q-btn 
            v-for="navItem in displayMenu" 
            v-if="!hideNavItem(navItem)" 
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
            :style="'color: ' + navTextColor + '; font-weight: 900; padding: .5rem;'" 
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
            :style="'color: ' + navTextColor + '; font-weight: 900; padding: .5rem;'" 
            outline 
            size="sm"
        >
            <q-icon name="fa-user-circle" /> Sign in
        </q-btn>
        
        <q-btn @click="showMobileMenu = true" flat class="lt-md" style="padding: .5rem;">
            <q-icon name="fa-bars" style="font-size: 1.5rem !important;" :color="navBackgroundColor && navBackgroundColor !== '#fff' ? 'white' : 'black'" />
        </q-btn>
        
        <q-modal 
            v-model="showMobileMenu"
            :style="{ backgroundColor: navBackgroundColor }"
            :content-css="{minWidth: '100vw', minHeight: '100vh'}"
        >
            <q-modal-layout>
                <div slot="header" align="right">
                    <q-btn @click="showMobileMenu = false" flat style="padding: 1rem;">
                        Close Menu <q-icon name="fa-times" />
                    </q-btn>
                </div>
                
                <div class="mobileMenuItem full-width" v-if="!hideNavItem(navItem)" v-for="navItem in displayMenu" :key="navItem.id">
                    <q-btn class="full-width" flat @click="navAction(navItem), showMobileMenu = false">
                        <q-icon :name="`fas ${navItem.icon}`" />
                        <h6>{{ navItem.title }}</h6>
                    </q-btn>
                </div>
                
                <div class="mobileMenuItem full-width" v-if="authenticated">
                    <q-btn class="full-width" flat @click="signout(), showMobileMenu = false">
                        <q-icon name="fa-user-circle" />
                        <h6>Sign out</h6>
                    </q-btn>
                </div>
                
                <div class="mobileMenuItem full-width" v-if="!authenticated">
                    <q-btn class="full-width" flat @click="route('/signin'), showMobileMenu = false">
                        <q-icon name="fa-user-circle" />
                        <h6>Sign in</h6>
                    </q-btn>
                </div>
            </q-modal-layout>

        </q-modal>
        
    </q-toolbar>

</template>

<script>
    import { topNavTools } from '../../../mixins/topNavTools'
    import { authentication } from '../../../mixins/authentication'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    
    export default {
        
        data() {
            return {
                // showNavItem(navItem) {
                //     // k('showNavItem: ', navItem)
                //     // if (navItem.hideIfAuth) k('hideIfAuth: ', this.userActiveProducts)
                //     // if (navItem.hideIfNotAuth) k('hideIfNotAuth: ', this.userActiveProducts)
                //     k('navItem.showIfNotSubscribedButOwnProducts: ', navItem.showIfNotSubscribedButOwnProducts)
                //     k('this.authenticated: ', this.authenticated)
                //     k('this.userHasAccess(this.validSubscriptionProductIDs): ', this.validSubscriptionProductIDs, this.userHasAccess(this.validSubscriptionProductIDs))
                    
                //     let showNavItem = true
                   
                //     if (navItem.hide) showNavItem = false
                    
                //     if (navItem.showIfNotSubscribedButOwnProducts && this.authenticated && this.userHasAccess(this.validSubscriptionProductIDs)) {
                //         showNavItem = false
                //     }
                    
                //     if (navItem.showIfNotSubscribedButOwnProducts && !this.authenticated) {
                //         showNavItem = false
                //     }
                    
                //     return showNavItem 
                    
                //     // return !navItem.hide && 
                //     // (
                //     //     !navItem.hideIfSubscribed || 
                //     //     (
                //     //         navItem.hideIfSubscribed && 
                //     //         (this.authenticated && this.userHasAccess(this.validSubscriptionProductIDs)) ? false : true
                //     //     )
                //     // )
                // },
                
                hideNavItem(navItem) {
                    k('navItem.hide: ',  navItem.hide)
                    k('navItem.showIfNotSubscribedButOwnProducts: ',  navItem.showIfNotSubscribedButOwnProducts)
                    k('this.userHasAccess(this.validSubscriptionProductIDs): ',  this.userHasAccess(this.validSubscriptionProductIDs))
                    k('this.authenticated: ', this.authenticated)
                    k('this.userActiveProducts: ', this.userActiveProducts)
                    k('this.environmentProducts: ', this.environmentProducts)
                    
                    return navItem.hide || 
                    (navItem.showIfNotSubscribedButOwnProducts && !this.authenticated) || 
                    (navItem.showIfNotSubscribedButOwnProducts && this.authenticated && (!this.environmentProducts || !this.environmentProducts.length)) || 
                    (navItem.showIfNotSubscribedButOwnProducts && this.authenticated && this.userHasAccess(this.validSubscriptionProductIDs)) || 
                    (navItem.showIfNotSubscribedButOwnProducts && this.authenticated && (!this.userActiveProducts || !this.userActiveProducts.length))
                }
            }   
        },
        
        mixins: [ topNavTools, authentication, userAndProductInfo, globalComputedData ],
        
        computed: {
            validSubscriptionProductIDs() {
                return this.environmentJSON.e.validSubscriptionProductIDs
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
    
    .mobileMenuItem {
        /*padding: .5rem;*/
        border-bottom: 1px solid #ccc;
    }
    
    .mobileMenuItem .q-btn {
        padding: 2rem;
    }
    
    .mobileMenuItem .q-btn .q-icon {
        /*margin-left: 0;*/
    }
</style>
