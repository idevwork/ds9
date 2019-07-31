<template>

    <q-toolbar class="row" :style="'backgroundColor: ' + (navBackgroundColor || '#fff') + ';'">

        <div v-if="!componentData.hideLogoItem" class="col" @click="logoClick()" style="cursor: pointer; min-width: 7rem;">
            <img :src="logoSrc" :style="'max-height: 35px; max-width: 100%; display: block;' + (windowWidth > 768 ? 'margin: 0 auto;' : '')" />
        </div>

        <q-btn
            v-for="navItem in menuItems"
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
            class="gt-sm col"
            id="ScoresNavItem"
            @click="navToScoresOrDictionary('scores')"
            align="center"
            :style="{ color: navTextColor, margin: '.25rem' }"
            flat
            no-caps
            size="sm"
             v-if="authenticated"
        >
            <span style="position: relative;">
                <q-icon name="fas fa-clipboard" style="font-size: 1rem;" />
            </span>

            <span class="gt-md" style="font-size: .8rem;">My Scores</span>
        </q-btn>

        <q-btn
            class="gt-sm col"
            id="ScoresNavItem"
            @click="navToScoresOrDictionary('dictionary')"
            align="center"
            :style="{ color: navTextColor, margin: '.25rem' }"
            flat
            no-caps
            size="sm"
             v-if="authenticated"
        >
            <span style="position: relative;">
                <q-icon name="fas fa-book" style="font-size: 1rem;" />
            </span>

            <span class="gt-md" style="font-size: .8rem;">Dictionary</span>
        </q-btn>

        <q-btn
            class="gt-sm col"
            id="ScoresNavItem"
            @click="route('/support')"
            align="center"
            :style="{ color: navTextColor, margin: '.25rem' }"
            flat
            no-caps
            size="sm"
        >
            <span style="position: relative;">
                <q-icon name="fas fa-medkit" style="font-size: 1rem;" />
            </span>

            <span class="gt-md" style="font-size: .8rem;">Support</span>
        </q-btn>

        <q-btn
            class="gt-sm col"
            id="ScoresNavItem"
            @click="route('/account')"
            align="center"
            :style="{ color: navTextColor, margin: '.25rem' }"
            flat
            no-caps
            size="sm"
        >
            <span style="position: relative;">
                <q-icon name="fas fa-cog" style="font-size: 1rem;" />
            </span>

            <span class="gt-md" style="font-size: .8rem;">Account</span>
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

                <div class="mobileMenuItem full-width" v-for="navItem in menuItems" :key="navItem.id">
                    <q-btn class="full-width" flat @click="navAction(navItem), showMobileMenu = false">
                        <q-icon :name="`fas ${navItem.icon}`" />
                        <h6>{{ navItem.title }}</h6>
                    </q-btn>
                </div>

                <div class="mobileMenuItem full-width" v-if="authenticated">
                    <q-btn class="full-width" flat @click="navToScoresOrDictionary('scores'), showMobileMenu = false">
                        <q-icon name="fas fa-clipboard" />
                        <h6>My Scores</h6>
                    </q-btn>
                </div>

                <div class="mobileMenuItem full-width" v-if="authenticated">
                    <q-btn class="full-width" flat @click="navToScoresOrDictionary('dictionary'), showMobileMenu = false">
                        <q-icon name="fas fa-book" />
                        <h6>Dictionary</h6>
                    </q-btn>
                </div>

                <div class="mobileMenuItem full-width">
                    <q-btn class="full-width" flat @click="route('/support'), showMobileMenu = false">
                        <q-icon name="fas fa-medkit" />
                        <h6>Support</h6>
                    </q-btn>
                </div>

                <div class="mobileMenuItem full-width">
                    <q-btn class="full-width" flat @click="route('/account'), showMobileMenu = false">
                        <q-icon name="fas fa-cog" />
                        <h6>Account</h6>
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
    import { courseRabbitTools } from '../../../mixins/courseRabbitTools'
    import { purchaseAndActivation } from '../../../mixins/purchaseAndActivation'

    export default {

        mixins: [ topNavTools, authentication, userAndProductInfo, globalComputedData, courseRabbitTools, purchaseAndActivation ],

        data() {
            return {
                showMobileMenu: false
            }
        },

        computed: {
            menuItems () {
                return this.displayMenu.filter(navItem =>
                    !navItem.hide ||
                    (!navItem.hide && !navItem.hideIfAuth) ||
                    (!navItem.hide && !navItem.hideIfNotAuth)
                )
            }
        },

        methods: {
            navToScoresOrDictionary(route) {
                if (this.userHasAccess([138345])) {
                    this.route(`/play/138345/${route}`)
                } else {
                    this.$store.commit('activationCode', 'signit_dictionary')
                    this.activateCode((res) => {
                        if (res) {
                            this.route(`/play/138345/${route}`)
                        }
                    })
                }
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
        border-bottom: 1px solid #ccc;
    }

    .mobileMenuItem .q-btn {
        padding: 2rem;
    }
</style>
