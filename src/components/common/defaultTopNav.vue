<template>

    <q-toolbar class="row" :style="'backgroundColor: ' + (navBackgroundColor || '#fff') + ';'">
        <div v-if="!componentData.hideLogoItem" class="col" @click="logoClick()" style="cursor: pointer; min-width: 7rem;">
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
                
                <div class="mobileMenuItem full-width" v-if="showNavItem(navItem)" v-for="navItem in displayMenu" :key="navItem.id">
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
    import { topNavTools } from '../../mixins/topNavTools'
    import { authentication } from '../../mixins/authentication'
    
    export default {
        
        mixins: [ topNavTools, authentication ],
    
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