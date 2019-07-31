<template>

    <div>
        <q-toolbar id="pvolveTopNav" class="row" :style="`background: #fff; padding: 0;`">
            <div class="col pvolveLogo" @click="logoClick()">
                <img :src="logoSrc" crossorigin="anonymous" :style="'max-height: 35px; max-width: 100%; width: auto; display: block;' + (windowWidth > 768 ? 'margin: 0 auto;' : 'margin-left: .5rem;')" />
            </div>

            <span v-for="navItem in displayMenu" v-if="showNavItem(navItem)" :key="navItem.id" class="gt-md col">
                <q-btn @click="navAction(navItem)" align="center" class="full-width" :style="{ color: '#222', padding: '1rem' }" flat push>
                    <h6 class="gt-md" style="font-size: .8rem; letter-spacing: 1px;">{{ navItem.title }}</h6>
                    <q-chip v-if="navItem.id === 'cart'" size="sm" style="margin-left: .5rem;">{{cart.length}}</q-chip>
                </q-btn>
            </span>

            <div class="col">
                <div class="row" style="padding: .4rem;">

                    <div class="gt-md offset-4 col-6" v-if="authenticated">
                        <q-btn @click="signout()" class="full-width" style="color: #222;" flat push>
                            <!--<q-icon name="fas fa-user-circle" style="margin-right: .3rem;" /> -->
                            <h6 style="font-size: .8rem; letter-spacing: 1px;">Sign out</h6>
                        </q-btn>
                    </div>

                    <div class="gt-md offset-6 col-6" v-if="!authenticated">
                        <q-btn @click="route('/signin')" class="full-width" align="center" style="color: #222;" flat push>
                            <!--<q-icon name="fas fa-user-circle" style="margin-right: .3rem;" /> -->
                            <h6 style="font-size: .8rem; letter-spacing: 1px;">Sign in</h6>
                        </q-btn>
                    </div>

                    <div class="gt-md col-2" v-if="authenticated">
                        <q-btn @click="route('/account')" class="full-width" align="center" style="color: #222;" icon="fas fa-user-circle" flat push />
                    </div>

                </div>
            </div>

            <q-btn @click="showMobileMenu = true" flat class="lt-lg" style="padding: 0.5rem;">
                <q-icon name="fas fa-bars"  style="font-size: 1.5rem !important;" :color="navBackgroundColor !== '#fff' ? 'white' : 'black'" />
            </q-btn>
        </q-toolbar>

        <div id="trialBanner" align="center" v-if="showUserStatusBanner" :style="`background: ${pvolveBlueGrey}; position: relative; padding: .5rem; overflow: hidden;`">
            <h6 v-if="userIsOnTrial" style="font-size: .75rem; color: white; padding: 0 1rem;">
                <span v-if="trialDaysLeft > -1">
                    You have {{trialDaysLeft}} day{{trialDaysLeft === 1 ? '' : 's'}} left in your trial period.
                </span>
                <span v-else>
                    Your trial has ended. Don't miss out, sign up for the subscription <a class="pchip" @click="goToSignUpNow()" :style="`color: ${pvolveBlueGrey}; cursor: pointer; margin: 0 .25rem;`">here</a>.
                </span>
            </h6>

            <h6 v-if="userIsSubscribed" style="font-size: .75rem; color: white; padding: 0 1rem; letter-spacing: 1px;">
                You are currently subscribed.
            </h6>

            <h6 v-if="specialAccessUser" style="font-size: .75rem; color: white; padding: 0 1rem; letter-spacing: 1px;">
                You have special access.
            </h6>

            <h6 v-if="userSubscriptionHasExpired" style="font-size: .75rem; color: white; padding: 0 1rem; line-height: 1rem; letter-spacing: 1px;">
                Welcome back! <span class="lt-md"><br/></span>Continue your subscription <a class="pchip" @click="goToSignUpNow()" :style="`color: ${pvolveBlueGrey}; cursor: pointer; margin: 0 .25rem;`">here</a>.
            </h6>

            <q-btn @click="hideTrialBanner" flat style="max-height: 25px; padding: 0 .5rem; position: absolute; top: -.2rem; right: 0;">
                <q-icon name="fas fa-times" color="white" style="font-size: .8rem; margin: 0;"/>
            </q-btn>
        </div>

        <div id="referAFriendBanner" align="center" v-if="!userHidReferAFriendBanner && authenticated && !challengeOrSaleIsLive" :style="`background: ${pvolveSalmon}; position: relative; padding: .5rem; overflow: hidden;`">
            <a @click="openReferAFriendAd">
                <h6 style="font-size: .75rem; color: white; padding: 0 1rem;">
                    Refer a friend & <span class="thickHeader">get $30!</span>
                </h6>
            </a>

            <q-btn @click="hideReferAFriendBanner" flat style="max-height: 25px; padding: 0 .5rem; position: absolute; top: -.2rem; right: 0;">
                <q-icon name="fas fa-times" color="white" style="font-size: .8rem; margin: 0;"/>
            </q-btn>
        </div>
        
        <banners @navigate="bannerNavigation" :userIsSubscribed="userIsSubscribed" />

        <q-modal
            v-model="showMobileMenu"
            :style="{ backgroundColor: navBackgroundColor }"
            :content-css="{minWidth: '100vw', minHeight: '100vh'}"
        >
            <q-modal-layout>
                <div slot="header" align="right">
                    <q-btn @click="showMobileMenu = false" flat style="padding: 1rem;">
                        Close Menu <q-icon name="fas fa-times" />
                    </q-btn>
                </div>

                <div class="mobileMenuItem full-width" v-if="showNavItem(navItem)" v-for="navItem in displayMenu" :key="navItem.id" :style="`background: ${pvolveMintTitle};`">
                    <q-btn class="full-width" flat @click="navAction(navItem), showMobileMenu = false">
                        <h6>{{ navItem.title }}</h6>
                    </q-btn>
                </div>

                <div class="mobileMenuItem full-width" :style="`background: ${pvolveMintTitle};`" v-if="authenticated">
                    <q-btn class="full-width" flat @click="route('/account'), showMobileMenu = false">
                        <h6>Account</h6>
                    </q-btn>
                </div>

                <div class="mobileMenuItem full-width" v-if="authenticated">
                    <q-btn class="full-width" flat @click="signout(), showMobileMenu = false" :style="`background: ${pvolveMintTitle};`">
                        <h6>Sign out</h6>
                    </q-btn>
                </div>

                <div class="mobileMenuItem full-width" v-if="!authenticated">
                    <q-btn class="full-width" flat @click="route('/signin'), showMobileMenu = false" :style="`background: ${pvolveMintTitle};`">
                        <h6>Sign in</h6>
                    </q-btn>
                </div>
            </q-modal-layout>

        </q-modal>

        <q-modal
            v-model="displayingReferAFriendAd"
            :content-css="{width: '100vw'}"
        >
            <q-btn flat round style="position: absolute; top: 0; right: 0; padding: .5rem;" @click="displayingReferAFriendAd = false">
                <q-icon name="fas fa-times" style="font-size: 1.5rem;" />
            </q-btn>

            <refer-a-friend-ad />

            <!--<friendsgiving />-->
        </q-modal>

        <q-modal
            v-model="showSubscribeNagModal"
            :content-css="{width: '460px', height: '500px'}"
        >
            <q-modal-layout style="background: linear-gradient(#fff, #fff1eb);">
                <div>
                    <q-btn @click="showSubscribeNagModal = false" class="float-right" flat round>
                        <q-icon name="fas fa-times" :style="`color: ${pvolveMintBG};`" />
                    </q-btn>
                </div>

                <div class="monty" style="padding: 1rem; clear: both;" align="center">
                    <h1 :style="`text-transform: unset; color: ${pvolveMintBG};`">Keep your transformation <br/> <span class="thickHeader">going strong!</span></h1>
                    <p style="margin: 1rem 0; color: #666;">You have <span :style="`font-size: 1.2rem; color: ${pvolveMintBG};`">{{trialDaysLeft}} day{{trialDaysLeft === 1 ? '' : 's'}}</span> left until your access ends. Enter your credit card information to keep the peach lifting, thigh toning and arm sculpting workouts coming!</p>

                    <div align="center" style="padding: 1rem 0;">
                        <q-btn outline size="lg" @click="showSubscribeNagModal = false, route('/updateSubscription')" class="monty" style="background: #fff !important; color: #333;">
                            <h6 style="font-size: .8rem; letter-spacing: 1px;">enter credit card info</h6>
                        </q-btn>
                    </div>

                    <div align="center">
                        <q-btn flat @click="showSubscribeNagModal = false" class="monty" style="color: #333;">
                            <h6 style="font-size: .8rem; letter-spacing: 1px; text-transform: lowercase;">not now</h6>
                        </q-btn>
                    </div>
                </div>
            </q-modal-layout>
        </q-modal>

        <q-modal
            v-model="openMobileAppModal"
        >
            <getMobileAppModal v-if="openMobileAppModal" @close="openMobileAppModal = false" />
        </q-modal>

    </div>

</template>

<script>
    import friendsgiving from './friendsgiving'
    import ReferAFriendAd from './referAFriendAd'
    import pvolveTrialUpdate from './pvolveTrialUpdate'
    import getMobileAppModal from './getMobileAppModal'
    import banners from './banners'

    import { pvolveColors } from './pvolveColors'
    import { topNavTools } from '../../../mixins/topNavTools'
    import { authentication } from '../../../mixins/authentication'
    import { impactTools } from './impactTools'
    import { contestTools } from './contestTools'

    export default {
        // props: ['componentData'],

        data() {
            return {
                userHidTrialBanner: false,
                userHidSaleBanner: false,
                displayingReferAFriendAd: false,
                userHidReferAFriendBanner: false,
                showSubscribeNagModal: false,
                openMobileAppModal: false,
                contestName: '',

                showNavItem(navItem) {
                    // k('showNavItem: ', navItem)
                    // if (navItem.hideIfAuth) k('hideIfAuth: ', this.userActiveProducts)
                    // if (navItem.hideIfNotAuth) k('hideIfNotAuth: ', this.userActiveProducts)

                    return !navItem.hide &&
                    ((!navItem.hideIfNotAuth && !navItem.hideIfAuth) ||
                    (!navItem.hideIfNotAuth && this.userActiveProducts && !this.userActiveProducts.length) ||
                    (!navItem.hideIfAuth && this.userActiveProducts && this.userActiveProducts.length))
                }
            }
        },

        mixins: [ pvolveColors, topNavTools, impactTools, contestTools, authentication ],

        components: {
            friendsgiving,
            ReferAFriendAd,
            pvolveTrialUpdate,
            getMobileAppModal,
            banners
        },

        computed: {

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            userActiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer
                }) : ''
            },

            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },

            // TODO: lets not assume the most recent record is the boss, but instead check for any active records

            mostRecentUserSubscriptionProductStatusHistory() {
                return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length ? this.userSubscriptionProductStatusHistory[0] : ''
            },

            specialAccessUser() {
                return this.mostRecentUserSubscriptionProductStatusHistory &&
                (this.mostRecentUserSubscriptionProductStatusHistory.freeAccess || this.mostRecentUserSubscriptionProductStatusHistory.accessType === 'freeAccess') &&
                this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'ownedAccess'
            },

            userIsOnTrial() {
                k('userIsOnTrial: ', this.mostRecentUserSubscriptionProductStatusHistory, this.mostRecentUserSubscriptionProductStatusHistory.accessType === 'freeTrialAccess', this.mostRecentUserSubscriptionProductStatusHistory.accessStatus !== 'inactive')
                return this.mostRecentUserSubscriptionProductStatusHistory && this.mostRecentUserSubscriptionProductStatusHistory.accessType === 'freeTrialAccess' && this.mostRecentUserSubscriptionProductStatusHistory.accessStatus !== 'inactive'
            },

            userIsSubscribed() {
                return this.mostRecentUserSubscriptionProductStatusHistory &&
                !this.mostRecentUserSubscriptionProductStatusHistory.freeAccess &&
                this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'subscriptionAccess'
            },

            userSubscriptionHasExpired() {
                return this.mostRecentUserSubscriptionProductStatusHistory &&
                this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'inactive'
            },

            nagRentalUserToSubscribe() {
                return this.mostRecentUserSubscriptionProductStatusHistory &&
                this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'rentalAccess' &&
                this.trialDaysLeft > -1 && this.trialDaysLeft < 11
            },

            trialDaysLeft() {
                let daysLeft = 0
                if (this.mostRecentUserSubscriptionProductStatusHistory) {

                    let endDateUnix = null
                    if (this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'subscriptionAccess') {
                        endDateUnix = this.moment(this.mostRecentUserSubscriptionProductStatusHistory.nextBillingDate).format('x')
                    }
                    if (this.mostRecentUserSubscriptionProductStatusHistory.accessStatus === 'rentalAccess') {
                        endDateUnix = this.moment(this.mostRecentUserSubscriptionProductStatusHistory.endDateTime).format('x')
                    }

                    let currentUnix = this.moment().format('x')

                    // test trial ended with current trial user
                    // daysLeft = ((currentUnix - endDateUnix) / 1000 / 60 / 60 / 24).toFixed(0)

                    var dayCalc = Math.floor(((endDateUnix - currentUnix) / 1000 / 60 / 60 / 24)).toFixed(0)
                    daysLeft = dayCalc > 0 ? dayCalc : 0
                    k('trialDaysLeft: ', this.mostRecentUserSubscriptionProductStatusHistory, endDateUnix, currentUnix, daysLeft)
                }
                return daysLeft
            },

            initialParameters() {
                return this.$root.$store.state.initialParameters
            },

            userInfo() {
                return this.$store.state.user.info
            },

            impactRes() {
                return window.ire
            },

            showUserStatusBanner() {
                return this.mostRecentUserSubscriptionProductStatusHistory && !this.userHidTrialBanner
            },

            challengeOrSaleIsLive() {
                // date that should be set when it's good to go
                // let challengeOptInStart = 1556510400000
                
                // let challengeOptInStart = 1546318800000 // new years 2019 for testing
                
                // let challengeOptInEnd = 1557201600000

                // return Date.now() > challengeOptInStart && Date.now() < challengeOptInEnd
                return false
            }
        },

        methods: {

            openMailTo() {
                window.open('mailto:help@pvolve.com?bcc=josh@platformpurple.com&subject=I%20have%20a%20question%20about%20P.volve%20on%20demand...', '_blank')
            },

            hideTrialBanner() {
                this.userHidTrialBanner = true
                this.$q.sessionStorage.set('userHidTrialBanner', true)
            },

            hideReferAFriendBanner() {
                this.userHidReferAFriendBanner = true
                this.localStorage.set('userHidReferAFriendBanner', true)
            },

            hideSaleBanner() {
                this.userHidSaleBanner = true
                this.localStorage.set('userHidSaleBanner', true)
            },

            openReferAFriendAd() {
                this.displayingReferAFriendAd = true
            },

            launchNagDialog() {
                let userHasSeenOnboarding = this.localStorage.get('pvolveOnboardingSeen')
                k('launchNagDialog: ', this.nagRentalUserToSubscribe, userHasSeenOnboarding)

                if (this.nagRentalUserToSubscribe && userHasSeenOnboarding && !this.openMobileAppModal && !this.displayingReferAFriendAd) {

                    let nagLimitCount = this.localStorage.get('nagFreeUserToSubscribeCount') || 0
                    k('nagLimitCount: ', nagLimitCount, this.initialParameters.payPalReturnCode)

                    if (nagLimitCount < 3 && !this.initialParameters.payPalReturnCode) {
                        this.localStorage.set('nagFreeUserToSubscribeCount', Number(nagLimitCount) + 1)
                    } else if (!this.initialParameters.payPalReturnCode) {
                        this.localStorage.set('nagFreeUserToSubscribeCount', 0)

                        this.showSubscribeNagModal = true
                    }
                }
            },

            checkForImpact() {
                k('checkForImpact: ', this.userInfo, this.impactRes)

                if (this.impactRes) {
                    this.sendUserInfoToImpact()
                }
            },

            goToSignUpNow() {
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.signUpNow', value: true })
                this.route('/offer/special?signUpNow=true')
            },

            bannerNavigation(navigationObject) {
                if (navigationObject.type === 'url') {
                    window.open(navigationObject.url, '_blank')
                }

                if (navigationObject.type === 'route') {
                    this.route(navigationObject.url)
                }
            }
        },

        watch: {
            mostRecentUserSubscriptionProductStatusHistory() {
                k('mostRecentUserSubscriptionProductStatusHistory watch: ', this.mostRecentUserSubscriptionProductStatusHistory, this.userIsOnTrial, this.userIsSubscribed, this.trialDaysLeft)

                this.launchNagDialog()
            },

            impactRes() {
                this.checkForImpact()
            },

            userInfo() {
                this.checkForImpact()
            },

            userPreferences() {
                k('userPreferences watch: ', this.contestOptIn)
            }
        },

        created() {
            kw('pvolvetopnav componentData: ', this.componentData)

            this.$root.$on('openMobileAppModal', () => {
                this.openMobileAppModal = true
            })

            let userHasSeenOnboarding = this.localStorage.get('pvolveOnboardingSeen')
            let userHasSeenReferAFriend = this.localStorage.get('displayedReferAFriendAd')
            let userHasSeenAppModal = this.localStorage.get('pvolveAppModalSeen')

            if (userHasSeenOnboarding) {
                // if (!userHasSeenAppModal) {
                //     if (this.userIsSubscribed) {
                //         this.openMobileAppModal = true
                //         this.localStorage.set('pvolveAppModalSeen', true)
                //     }
                // } else
                if (this.authenticated && !userHasSeenReferAFriend && (this.goingTo === '/' || this.goingTo === '/library' || this.goingTo === '/me')) {
                    this.openReferAFriendAd()
                    this.localStorage.set('displayedReferAFriendAd', this.moment())
                }
            }

            this.userHidTrialBanner = this.$q.sessionStorage.get.item('userHidTrialBanner')
            this.userHidReferAFriendBanner = this.localStorage.get('userHidReferAFriendBanner')
            this.userHidSaleBanner = this.localStorage.get('userHidSaleBanner')

            this.launchNagDialog()
            this.checkForImpact()

            if (this.userPreferences) {

            } else {
                if (this.userInfo) {
                    this.getUserPreferences(() => {})
                }
            }

            k('topNav mostRecentUserSubscriptionProductStatusHistory: ', this.mostRecentUserSubscriptionProductStatusHistory)
            k('topNav userIsOnTrial: ', this.userIsOnTrial)
            k('topNav userIsSubscribed: ', this.userIsSubscribed)
            k('topNav userHidTrialBanner: ', this.userHidTrialBanner)
            k('topNav userHidReferAFriendBanner: ', this.userHidReferAFriendBanner)
        },

    }
</script>

<style scoped>
    .q-btn-standard .q-icon {
        font-size: 14px;
        margin-right: .3rem;
    }

    .cartChip {
        background: #888;
        color: #fff;
        padding: .1rem .5rem;
        margin: 0 0 0 .5rem;
        border-radius: 1rem;
        bottom: 1.6rem;
        right: .7rem;
    }

    @media (max-width: 946px) {
        .cartChip {
            position: absolute;
        }
    }

    .pchip {
        /* width: fit-content; */
        color: #fff;
        background: #fff;
        border-radius: .25rem;
        padding: .1rem .25rem;
        margin: 0;
    }

    .pvolveLogo {
        cursor: pointer;
        background-color: white;
        padding: .5rem;
        min-height: 50px;
        max-width: 200px;
        clip-path: polygon(95% 0%, 0% 0%, 0% 100%, 100% 100%);
        -webkit-clip-path: polygon(95% 0%, 0% 0%, 0% 100%, 100% 100%);
    }

    .mobileMenuItem {
        /*padding: .5rem;*/
        border-bottom: 1px solid #fff;
    }

    .mobileMenuItem .q-btn {
        padding: 2rem;
        color: #fff !important;
    }

    .mobileMenuItem .q-btn h6 {
        color: #fff !important;
    }

    .mobileMenuItem .q-btn .q-icon {
        /*margin-left: 0;*/
    }
</style>
