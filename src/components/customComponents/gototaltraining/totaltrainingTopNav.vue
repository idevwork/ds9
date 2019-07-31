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
        
        <q-btn-dropdown label="Services" flat class="gt-sm col" :style="{ color: navTextColor, margin: '.25rem', textTransform: 'none' }" >
            <!--<q-icon slot="icon" name="fa fa-briefcase" style="font-size: 1rem;" />-->
            <q-list link>
                <q-item @click.native="route('/corporate')">
                    <q-item-side icon="fa-chevron-right" :style="{ color: navTextColor }" />
                    <q-item-main>
                        <q-item-tile label>Corporate</q-item-tile>
                    </q-item-main>
                </q-item>
                <q-item @click.native="route('/education')">
                    <q-item-side icon="fa-chevron-right" :style="{ color: navTextColor }" />
                    <q-item-main>
                        <q-item-tile label>Education</q-item-tile>
                    </q-item-main>
                </q-item>
                <q-item @click.native="route('/government')">
                    <q-item-side icon="fa-chevron-right" :style="{ color: navTextColor }" />
                    <q-item-main>
                        <q-item-tile label>Government</q-item-tile>
                    </q-item-main>
                </q-item>
            </q-list>
        </q-btn-dropdown>
        
        <div class="gt-sm col" align="center" style="min-width: 7rem;">
            <q-btn @click="route('/learncoding')" outline round size="sm" :style="`color: ${darkRed};`">
                <q-icon name="fa-code" />
            </q-btn>
            <q-btn @click="route('/beproductive')" outline round size="sm" :style="`color: ${darkBlue};`">
                <q-icon name="fa-lightbulb" />
            </q-btn>
            <q-btn @click="route('/getcreative')" outline round size="sm" :style="`color: ${darkGreen};`">
                <q-icon name="fa-paint-brush" />
            </q-btn>
        </div> 

        <q-btn 
            @click="signout()"
            class="gt-sm col" 
            v-if="authenticated" 
            id="signOut" 
            :style="`color: ${authButtonTextColor || navTextColor}; background: ${authButtonColor} !important; font-weight: 900; padding: .5rem;`" 
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
            :style="`color: ${authButtonTextColor || navTextColor}; background: ${authButtonColor} !important; font-weight: 900; padding: .5rem;`" 
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
            maximized
        >
            <q-list link separator no-border>
                <q-list-header align="right">
                    <q-btn @click="showMobileMenu = false" flat>
                        Close Menu<q-icon name="fa-times" />
                    </q-btn>
                </q-list-header>
                
                <q-item v-if="showNavItem(navItem)" v-for="navItem in displayMenu" :key="navItem.id" @click.native="navAction(navItem), showMobileMenu = false">
                    <q-item-side :icon="navItem.icon" :style="{ color: navTextColor }" />
                    <q-item-main :style="{ color: navTextColor }">
                        {{ navItem.title }}
                    </q-item-main>
                </q-item>
                
                <q-item @click.native="route('/corporate')">
                    <q-item-side icon="fa-chevron-right" :style="{ color: navTextColor }" />
                    <q-item-main>
                        <q-item-tile label>Corporate</q-item-tile>
                    </q-item-main>
                </q-item>
                
                <q-item @click.native="route('/education')">
                    <q-item-side icon="fa-chevron-right" :style="{ color: navTextColor }" />
                    <q-item-main>
                        <q-item-tile label>Education</q-item-tile>
                    </q-item-main>
                </q-item>
                
                <q-item @click.native="route('/government')">
                    <q-item-side icon="fa-chevron-right" :style="{ color: navTextColor }" />
                    <q-item-main>
                        <q-item-tile label>Government</q-item-tile>
                    </q-item-main>
                </q-item>
                
                <q-item @click.native="route('/learncoding'), showMobileMenu = false" style="min-width: 9rem;">
                    <q-item-side>
                        <q-btn size="xs" outline round :style="`color: ${darkRed};`">
                            <q-icon name="fa-code" />
                        </q-btn>
                    </q-item-side>
                    <q-item-main :style="{ color: navTextColor }">Coding</q-item-main>
                </q-item>
                
                <q-item @click.native="route('/beproductive'), showMobileMenu = false" style="min-width: 9rem;">
                    <q-item-side>
                        <q-btn size="xs" outline round :style="`color: ${darkBlue};`">
                            <q-icon name="fa-lightbulb" />
                        </q-btn>
                    </q-item-side>
                    <q-item-main :style="{ color: navTextColor }">Productivity</q-item-main>
                </q-item>
                
                <q-item @click.native="route('/getcreative'), showMobileMenu = false" style="min-width: 9rem;">
                    <q-item-side>
                        <q-btn size="xs" outline round :style="`color: ${darkGreen};`">
                            <q-icon name="fa-paint-brush" />
                        </q-btn>
                    </q-item-side>
                    <q-item-main :style="{ color: navTextColor }">Creativity</q-item-main>
                </q-item>
                
                <q-item v-if="authenticated" @click.native="signout(), showMobileMenu = false">
                    <q-item-side icon="fa-sign-out-alt" :style="{ color: navTextColor }" />
                    <q-item-main :style="{ color: navTextColor }">
                        Sign out
                    </q-item-main>
                </q-item>
                
                <q-item v-if="!authenticated" @click.native="route('/signin'), showMobileMenu = false">
                    <q-item-side icon="fa-sign-in-alt" :style="{ color: navTextColor }" />
                    <q-item-main :style="{ color: navTextColor }">
                        Sign in
                    </q-item-main>
                </q-item>
            
            </q-list>
        </q-modal>
    </q-toolbar>

</template>

<script>
    import { topNavTools } from '../../../mixins/topNavTools'
    import { authentication } from '../../../mixins/authentication'
    import { totaltrainingColors } from './totaltrainingColors'
    
    export default {
        
        mixins: [ topNavTools, authentication, totaltrainingColors ],
    
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
