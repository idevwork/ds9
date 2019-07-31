<template>
    
    <div>
        <div :style="`background: ${heroUnitData.backgroundColor || '#fff'};`">
            <div id="hero" :class="`row ${windowWidth < 768 ? 'angled' : ''}`" :style="heroStyle">
                <div class="color-overlay" :style="overlayStyle"></div>
                
                <div v-if="windowWidth > 767" id="headerColor" class="well" :style="innerHeroStyle">
                    <img v-if="heroUnitData.logoURL" :src="logoSrc" style="max-height: 500px; max-width: 100%; margin: 2rem auto; padding: 0 1rem; display: block;" />
                    <h1 v-if="heroUnitData.heroTitle || heroUnitData.title" :style="heroTitleStyle" v-html="heroUnitData.heroTitle"></h1>
                    
                    <div v-if="componentData.infoVideoSrc" class="full-width" align="center">
                        <q-btn flat @click="openSummerChallengeVideoModal()">
                            <q-icon name="fas fa-play-circle" color="white" style="font-size: 4rem;" />
                        </q-btn>
                    </div>
                    
                </div>
                
                <div v-else align="center" :style="innerHeroStyle">
                    <h1 v-if="heroUnitData.heroTitle || heroUnitData.title" :style="heroTitleStyle" v-html="heroUnitData.heroTitle"></h1>
                    
                    <div v-if="componentData.infoVideoSrc" class="full-width" align="center">
                        <q-btn flat @click="openSummerChallengeVideoModal()">
                            <q-icon name="fas fa-play-circle" color="white" style="font-size: 4rem;" />
                        </q-btn>
                    </div>
                </div>
                
            </div>
        </div>
        
        <div class="row well">
            <div class="col-sm-12" align="center">
                <div v-if="!optInPeriodOver && !contestOptIn">
                    <p v-if="!contestOptIn">
                        <q-btn
                            outline
                            size="lg"
                            class="monty q-my-sm"
                            :style="`background: ${pvolveMintBG} !important; color: #fff; padding: .8rem 2rem;`"
                            @click="joinChallenge()"
                            >
                            <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px;">Join Challenge</h6>
                        </q-btn>
                    </p>
                </div>

                <div v-if="optInPeriodOver && !contestOptIn">
                    <p class="text-weight-medium q-mt-lg" style="font-size: 30px;">We're Sorry!</p>
                    <p class="text-weight-light q-mt-md">This challenge has already started, and the opt-in period is over.</p>
                    
                    <p v-if="!authenticated" class="text-weight-light q-mt-md">If you have already opted in, please sign in to see your calendar.</p>
                    <q-btn
                        v-if="!authenticated"
                        outline
                        size="lg"
                        class="monty q-my-sm"
                        :style="`background: ${pvolveMintBG} !important; color: #fff; padding: .8rem 2rem;`"
                        @click="navigateToSignIn()"
                        >
                        <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px;">Sign In</h6>
                    </q-btn>
                </div>
                
                <h4
                    v-if="!challengeHasStarted"
                    class="thickHeader"
                    style="margin: 1rem 0; color: #524F4C; letter-spacing: 1px; text-transform: uppercase;"
                >
                    starts in
                    <span :style="`color: ${pvolveMintBG};`">{{daysLeft}}</span> days,
                    <span :style="`color: ${pvolveMintBG};`">{{hoursLeft}}</span> hours,
                    <span :style="`color: ${pvolveMintBG};`">{{minutesLeft}}</span> minutes and
                    <span :style="`color: ${pvolveMintBG};`">{{secondsLeft}}</span> seconds
                </h4>

                <h6 v-if="!challengeHasStarted" class="thickHeader" style="margin: .5rem 0; color: #524F4C;">Opt-In Period: APR 29 - MAY 6</h6>

                <div v-if="contestOptIn" class="col-12 q-py-md" align="center">
                    <div class="well relative-position" :style="`padding: ${windowWidth < 768 ? '1rem' : '1rem 2rem'};`">
                        <h6 class="q-my-md" style="letter-spacing: 1px; font-size: 24px;">You are in the Summer Sprint Challenge!</h6>
                    </div>
                </div>

            </div>
        </div>
        
        <summerChallengeMarketing v-if="!contestOptIn" :contestOptIn="contestOptIn" :optInPeriodOver="optInPeriodOver" @launchOptInModal="joinChallenge()" />
            
        <div class="row well" v-if="contestOptIn || (!contestOptIn && !optInPeriodOver)">
            
            <div class="col-xs-12 col-sm-6 col-md-9 col-lg-9" :style="{ order: contestOptIn ? '1' : 'unset', padding: '1rem' }">

                <h1 :style="`color: ${ pvolveMintTitle };`">
                    SUMMER SPRINT CHALLENGE
                </h1>
                <p>
                    Only the videos within this calendar will count towards the Summer Sprint challenge and only one workout counts per day. Streamers - you are not tied to the calendar schedule! You have the flexibility to work out on the days that work best for you.*
                </p>
                <p style="font-size: 12px;">
                    * Workouts are counted based on EST timezone
                </p>

            </div>

            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" :style="{ order: contestOptIn ? '2' : 'unset', padding: '1rem' }">
                <div style="border: 1px solid #ccc;">
                    <div class="full-width text-white monty" :style="`background: ${ pvolveMintBG }; padding: .5rem;`" align="center">
                        WORKOUTS COMPLETE
                        
                            <q-btn
                                v-if="contestOptIn"
                                flat
                                size="sm"
                                class="monty q-my-sm q-pa-none"
                                :style="`background: ${pvolveMintBG} !important; color: #fff;`"
                                @click="getUserChallengeStatus()"
                            >
                                <q-icon name="fas fa-sync"/>
                            </q-btn>
                        
                    </div>
    
                    <div align="center" class="monty" style="font-size: 54px;line-height: 2;">
                        <span :style="`color: ${ pvolveMintTitle };`">{{ completedDays }}</span> <span :style="`color: ${ pvolveBlueGrey };`">/ 10</span>
                    </div>
                    
                </div>
            </div>
            
            <transition appear enter-active-class="animated fadeIn">
                <div class="col-12 row relative-position q-mt-xl" style="order: 3;">

                    <div id="calendar" class="col-12">
                        <div class="day" v-for="(day, index) in calendarDays">
                            <div v-if="day.dayNumber" @click="launchWorkout(day)" class="card">

                                <div :style="`font-size: ${adaptiveFontSize(.8)}rem;`" class="dayDate monty allCaps">
                                    {{ day.theMonth }}
                                    <span class="lt-sm"><br /></span> {{ moment(day.theDate, 'MM-DD-YYYY').format('D') }}
                                </div>

                                <div v-if="day.today" :style="`background: ${pvolveMintBG}; font-size: ${adaptiveFontSize()}rem;`" class="dayHeader monty allCaps" align="center">
                                    <span class="gt-xs">today</span>
                                    <span class="lt-sm"><q-icon name="fas fa-calendar" style="margin: .65rem 0;" /></span>
                                </div>

                                <div v-else :style="`font-size: ${adaptiveFontSize()}rem;`" class="dayHeader monty allCaps" align="center">
                                    Day
                                    <span class="lt-sm"><br /></span> {{ day.dayNumber }}
                                </div>
                                
                                <template v-if="contestOptIn && challengeHasStarted">
                                    <div class="workouts-container cursor-pointer" :style="day.backgroundImage">
    
                                        <div class="row flex flex-center" :style="{ height: '100%', width: '100%', background: day.productInfo ? 'rgba(80, 80, 80, 0.7)' : '#fff' }">
    
                                            <div v-if="day.productInfo" style="font-size: 0.8rem; padding: 0.25rem;" class="monty allCaps text-weight-bold col-12">
                                                <span class="gt-sm text-white">{{ day.productInfo ? day.productInfo.productName : '' }}</span>
                                            </div>
                                        
                                            <div class="col-12 row self-end">
                                                    
                                                <div class="col-sm-12 col-md-6" :align="windowWidth < 768 ? 'center' : 'left'" style="padding: .25rem;">
                                                    <div v-if="day.viewingData" :style="{ background: `url('${ contentCompleteImageSrc }')`, 'background-size': 'cover', 'background-position': '50%', 'background-repeat': 'no-repeat', width: '1.7rem', height: '1.7rem' }"></div>
                                                </div>
                                                <div class="col-sm-12 col-md-6" :align="windowWidth < 768 ? 'center' : 'right'" style="padding: .25rem;">
                                                    <q-icon v-if="day.productInfo" color="white" style="padding: .25rem; font-size: 1.4rem;" name="fas fa-play-circle" />
                                                </div>
                                                
                                            </div>
    
                                        </div>
    
                                    </div>
                                    
                                </template> 
                                
                                <template v-else>
                                    <div class="workouts-container"></div>
                                </template>
                                
                            </div>
                        </div>
                    </div>

                </div>
            </transition>

        </div>

        <summerChallengeMarketing v-if="contestOptIn" :contestOptIn="contestOptIn" :optInPeriodOver="optInPeriodOver" @launchOptInModal="joinChallenge()" />
        
        <q-modal v-model="summerChallengeVideoModal" :content-css="{minWidth: '60vw', minHeight: '60vh', background: windowWidth > 767 ? 'rgba(0, 0, 0, 0)' : '', boxShadow: 'none'}" >
            <q-modal-layout v-if="summerChallengeVideoModal">
                <div align="right">
                    <q-btn flat dense :color="windowWidth > 767 ? 'white' : ''" icon="fas fa-times" @click="summerChallengeVideoModal = false" style="padding: .5rem;" />
                    <video :src="componentData.infoVideoSrc" autoplay controls controlsList="nodownload" style="width: 100%;" />    
                </div>
            </q-modal-layout>
        </q-modal>

        <q-modal v-model="summerChallengeOptInModal" :content-css="{minWidth: '60vw', minHeight: '60vh'}" >
            <q-modal-layout v-if="summerChallengeOptInModal">
                <q-toolbar slot="header" :style="modalBackgroundStyle">
                    <div class="q-toolbar-title">
                        <h5>Summer Sprint Challenge Info</h5>
                    </div>
                    <q-btn flat dense color="white" icon="fas fa-times" @click="summerChallengeOptInModal = false" style="padding: .5rem;" />
                </q-toolbar>

                <div v-if="!optInPeriodOver && showNameFields" align="center" :style="`padding: ${ windowWidth < 768 ? '1rem 1rem' : '1rem 5rem' };`">
                    <img src="https://vault.platformpurple.com/static/clients/mypvolve/trial_video.png" width="80%" height="100%" />
                </div>

                <div v-if="showNameFields">

                    <div align="center" class="q-my-md monty" :style="`padding: ${ windowWidth < 768 ? '0rem 4rem' : '0 10rem' };`">
                        <p class="text-weight-medium" style="font-size: 24px;">Before signing up to the challenge</p>
                        <p class="text-weight-light">Let us know your name and you're in!</p>
                    </div>

                    <div class="row full-width justify-center" style="margin: .5rem 0;">
                        <div class="col-6">

                            <div style="padding: 0 .5rem;">
                                <q-input
                                    v-model="firstName"
                                    float-label="First Name"
                                    color="grey-7"
                                    class="inputBox"
                                    @input="missingNameError = false"
                                />
                            </div>
                            <div style="padding: 0 .5rem;">
                                <q-input
                                    v-model="lastName"
                                    float-label="Last Name"
                                    color="grey-7"
                                    class="inputBox"
                                    @input="missingNameError = false"
                                />
                            </div>

                            <div v-if="missingNameError" class="col-12">
                                <p align="center" style="color: red;">Please fill in your first and last name!</p>
                            </div>

                            <div align="center">
                                <q-btn outline @click="updateInfo()" size="lg" :style="`background: ${brandColor} !important; color: #fff;`">
                                    <h6 style="font-size: .8rem; letter-spacing: 1px;">Join Challenge</h6>
                                </q-btn>
                            </div>

                        </div>
                    </div>

                </div>

                <div v-if="!showNameFields" class="q-my-lg">
                    <div :style="`background: rgba(255, 255, 255, .7); padding: ${windowWidth < 768 ? '2rem 1rem' : '3rem'};`">
                        <signUpOffer
                            :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs"
                            :offerProductID="offerProductID"
                            :completeSignUpComponentData="completeSignUpComponentData"
                            :buttonColor="pvolveMintBG"
                            :signUpBackgroundColor="'rgba(0,0,0,0)'"

                            :showCompleteSignUp="showCompleteSignUp"
                            :extraMessaging="extraMessaging"

                            subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P."

                            @userHasAccess="checkChallenge = true, checkOptIn()"
                            @userPreviouslyOwned="userNeedsToSignUpForSubscription()"
                            @userNeedsToCheckout="checkIfUserNeedsToCheckout()"

                            style="max-width: 30rem; margin: 0 auto;"
                        />
                    </div>
                </div>
            </q-modal-layout>
        </q-modal>
    </div>
    
</template>

<script>
    import signUpOffer from '../../common/showcase/signUpOffer.vue'
    import summerChallengeMarketing from './summerChallengeMarketing.vue'

    import { impactTools } from './impactTools'
    import { contestTools } from './contestTools'
    import { pvolveColors } from './pvolveColors'
    import { pvolveSignUpTools } from './pvolveSignUpTools'
    import { designTools } from '../../../mixins/designTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {

        props: [ 'componentData' ],

        mixins: [ pvolveColors, contestTools, designTools, globalComputedData, userAndProductInfo, impactTools, pvolveSignUpTools ],

        components: { signUpOffer, summerChallengeMarketing },

        data: () => ({
            offerProductID: 148014,
            showCompleteSignUp: false,
            contestName: 'SummerSprintChallenge',
            contestMailListName: 'SummerSprintChallenge',
            promoCode: 'SUMMERSPRINT',
            displaySignUpIn: false,

            showNameFields: false,
            firstName: '',
            lastName: '',
            missingNameError: false,

            daysLeft: null,
            hoursLeft: null,
            minutesLeft: null,
            secondsLeft: null,
            challengeHasStarted: false,

            completeSignUpComponentData: {
                header: 'Payment info',
                description: '',
                componentName: 'PvolveCreditCardForm',
                componentPath: 'mypvolve/PvolveCreditCardForm',
                loadHook: 'addProductToCart',
                showFirstAndLastNameFields: true,
                firstName: '',
                lastName: '',
                showCodeFields: false,
                promoCodeText: 'summersprint',
                submitButtonLabel: 'Activate trial',
                noToast: true,
                stopThankYouPageRedirect: true
            },
            
            heroUnitData: {
                "id": "summerChallengeHero",
                "component": "pvolveHero",
                "componentPath": "mypvolve/pvolveHero.html",
                "backgroundImageURL": "mypvolve/summer_sprint_challenge_header.jpg",
                "backgroundColor": "#f5f5f5",
                "heroTitle":
                "<p class='monty text-white text-weight-medium text-center uppercase' style='font-size: 16px;'>Work out with the nyc studio</p><p class='monty text-white' style='font-size: 48px; text-align: center; line-height: 3rem;'>Summer Sprint Challenge</p><p class='monty text-white text-weight-medium text-center uppercase q-pt-md' style='font-size: 16px;'>may 6 - may 19</p>",
                "textColor": "#444",
                "padding": "8rem",
                "mobilePadding": "3rem",
                "overlayColor": "#000",
                "overlayOpacity": "0.4",
                "visibility": {
                    "summerSprint": true
                }
            },
            
            summerChallengeVideoModal: false,
            checkChallenge: false,
            summerChallengeOptInModal: false,
            optInPeriodOver: false,

            userChallengeStatus:  {},
            calendarDays: [],
            calendarOffset: 0,
            completedDays: 0,

            contentCompleteImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png',
            viewingData: ''
        }),

        computed: {

            modalHeaderImage() {
                return {
                    'background': `url("https://vault.platformpurple.com/static/clients/mypvolve/trial_video.png")`,
                    'background-position': '50% 0%',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'height': '540px'
                }
            },

            modalBackgroundStyle() {
                return {
                    'background': this.pvolveMintBG
                }
            },

            countdownTimeLeft() {
                k('timeleft: ', this.daysLeft > -1, this.hoursLeft > -1, this.minutesLeft > -1, this.secondsLeft > -1)
                return this.daysLeft > -1 &&
                    this.hoursLeft > -1 &&
                    this.minutesLeft > -1 &&
                    this.secondsLeft > -1
            },

            extraMessaging() {
                return [{
                    text: `<span class="monty" style="margin: 0; font-size: .9rem;">${ this.completeSignUpComponentData.promoCodeText ? '21 days free, then $29.99 per month after.' : '$29.99 per month.'}</span>`,
                    icon: 'fas fa-caret-right',
                    iconColor: this.pvolveMintBG
                }, {
                    text: '<span class="monty" style="margin: 0; font-size: .9rem;">Monthly memberships can be cancelled at any time.</span>',
                    icon: 'fas fa-caret-right',
                    iconColor: this.pvolveMintBG
                }, {
                    text: '<span class="monty" style="margin: 0; font-size: .9rem;">Instantly access 150+ premium workouts.</span>',
                    icon: 'fas fa-caret-right',
                    iconColor: this.pvolveMintBG
                }]
            },

            // change countdowntime left state to show calendar
            countdownEndedAndUserOptedIn() {
                return !this.countdownTimeLeft && this.contestOptIn && !this.showNameFields
            },

            startDate() {
                return this.componentData.startDate
            },

            productsID() {
                return this.componentData.productsID
            },
            
            userIsSubscribed() {
                return this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)
            },
            
            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/' + this.heroUnitData.backgroundImageURL
            },
    
            logoSrc() {
                return this.heroUnitData.logoURL + '?t=' + Date.now()
            },
            
            heroTitleStyle() {
                return `color: ${this.heroUnitData.textColor}; ${this.heroUnitData.textShadow ? `text-shadow: 0px 0px 10px ${this.heroUnitData.textShadow};` : ``} ${this.windowWidth < 768 ? `font-size: 2rem;` : ''}`
            },
    
            heroStyle() {
                var styleStr = ""
                styleStr += this.heroUnitData.backgroundImageURL ? "background: url(" + this.heroImageSrc + "); " : ""
                styleStr += this.heroUnitData.headerColor ? "background-color: " + this.heroUnitData.headerColor + "; " : ""
                styleStr += `background-position: ${this.heroUnitData.backgroundPosition ? this.heroUnitData.backgroundPosition : this.windowWidth < 768 ? '50% 0%' : '50% 0%'};`
                styleStr += "background-size: " + (this.heroUnitData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.heroUnitData.heroHeight ? "height: " + this.heroUnitData.heroHeight + "; " : ""
                styleStr += this.heroUnitData.logoLink ? "cursor: pointer;" : ""
                styleStr += "padding: " + (this.windowWidth > 992 ? "8rem" : "1rem") + ";"
                return styleStr
            },
            
            overlayStyle() {
                let overlayColor = this.heroUnitData.overlayColor
                let overlayOpacity = this.heroUnitData.overlayOpacity
                
                let styleStr = ''
                styleStr += overlayColor ? `background-color: ${overlayColor};`: ''
                styleStr += overlayOpacity ? `opacity: ${this.windowWidth < 768 ? '.5' : overlayOpacity};` : ''
                
                return styleStr
            },
            
            innerHeroStyle() {
                var styleStr = "z-index: 1; width: 100%;"
                    styleStr += (this.heroUnitData.padding && this.windowWidth > 767 ? 'padding: ' + this.heroUnitData.padding + ' 0;' : this.heroUnitData.mobilePadding && this.windowWidth < 768 ? 'padding: ' + this.heroUnitData.mobilePadding + ' 0;' : '')
                    styleStr += (this.heroUnitData.margin && this.windowWidth > 767 ? 'margin: ' + this.heroUnitData.margin + ' 0;' : this.heroUnitData.mobileMargin && this.windowWidth < 768 ? 'margin: ' + this.heroUnitData.mobileMargin + ' 0;' : '')
                return styleStr
            }
        },

        methods: {
            
            joinChallenge() {
                k('joinChallenge: ', this.userIsSubscribed, this.userInfo.firstName, this.userInfo.lastName, this.optInPeriodOver)
                
                if (this.userIsSubscribed && this.userInfo.firstName && this.userInfo.lastName && !this.optInPeriodOver ) {
                    this.checkChallenge = true
                    this.checkOptIn()
                } else {
                    this.openSummerChallengeOptInModal()
                }
            },
            
            navigateToSignIn() {
              this.route('/signin')  
            },
            
            userNeedsToSignUpForSubscription() {
                k('userNeedsToSignUpForSubscription')

                this.completeSignUpComponentData.promoCodeText = ''
                this.completeSignUpComponentData.submitButtonLabel = 'Activate'

                this.showCompleteSignUp = true
            },

            checkOptIn(userPurchased) {
                k('checkOptIn: ', this.checkChallenge, this.userPreferences)

                this.$q.loading.hide()

                if (this.checkChallenge && this.userPreferences) {
                    k('contestOptIn: ', this.contestOptIn, this.userInfo.firstName, this.userInfo.lastName, this.optInPeriodOver)
                    
                    if (!this.contestOptIn && this.userInfo.firstName && this.userInfo.lastName && !this.optInPeriodOver) {
                        k('addingUserToChallenge: ', userPurchased)
                        this.addUserToChallenge(userPurchased, () => {
                            this.addUserToMailingList()
                        })
                    } else {
                        k('checkOptIn else')
                        if (this.contestOptIn) {
                            this.getUserChallengeStatus()
                        } else {
                            if (this.userIsSubscribed) {
                                this.route('/')
                                return
                            }
                        }

                        this.checkChallenge = false
                        this.summerChallengeOptInModal = false
                    }
                }
            },

            generateChallengeCalendar() {
                k('generateChallengeCalendar: ', this.userChallengeStatus, this.startDate)
                
                this.calendarDays = []

                for (let i = 0; i < 14; i++) {
                    let referenceDay = this.moment(this.startDate, 'MM-DD-YYYY HH:mm:ss a').add(i, 'days')

                    const completedDay = this.userChallengeStatus.datesCompleted ? this.userChallengeStatus.datesCompleted.filter(date => referenceDay.format('MM-DD-YYYY') === this.moment(date, 'YYYY-MM-DD').format('MM-DD-YYYY')) : []
                    
                    const productID = this.productsID[i]
                    
                    const productInfo = productID ? this.environmentProducts.find(product => productID === product.productID) : null
                    const backgroundImage = productInfo ?
                        `background: url(https://f3r6v6t8.ssl.hwcdn.net/static/previews/${productInfo.productSKU}/${productInfo.productSKU}_500px_cover.png);` :
                        `background-color: #fff;`

                    this.calendarDays[i] = {
                        theMonth: referenceDay.format('MMM'),
                        theDate: referenceDay.format('MM-DD-YYYY'),
                        dayNumber: i + 1,
                        viewingData: completedDay.length ? true : false,
                        backgroundImage: backgroundImage,
                        productInfo: productInfo || null
                    }

                    // labels today's day in calendar
                    if (referenceDay.isSame(Date.now(), 'day')) { // it's today
                        this.calendarDays[i].today = true
                    }
                }

                // now pad the beginning of calendar with an offset
                this.calendarOffset = this.moment(this.startDate, 'MM-DD-YYYY HH:mm:ss a').day()

                for (let i = 0; i < this.calendarOffset; i++) {
                    this.calendarDays.unshift({})
                }

                kw('calendarDays')
                k(this.calendarDays)
            },

            launchWorkout(day) {
                k('launchWorkout: ', day, this.currentProduct)

                if (!day.productInfo) {
                    return false
                }

                this.route('/play/' + day.productInfo.productID)
            },

            updateInfo() {
                if (!this.firstName || !this.lastName) {
                    this.missingNameError = true
                    return
                }
                
                k('update user info')
                var req = {
                    "firstName": this.firstName,
                    "lastName": this.lastName,
                    "userEmail": this.newUserEmail,
                    "userPassword": this.userPassword,
                    "userLoginToken": this.userLoginToken
                }

                k(j(req))

                this.updateUserInfo(req, (res) => {
                    k(res)
                    
                    if (res.success) {
                        this.$q.notify({
                            message: 'User information updated!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                        this.showNameFields = false

                        this.$store.commit('userFirstName', this.firstName)
                        this.$store.commit('userLastName', this.lastName)
                    }
                    
                    this.checkOptIn()
                })

            },

            addUserToMailingList() {
                const req = {
                    userLoginToken: this.userLoginToken,
                    environment: 'mypvolve',
                    data: {
                        userEmail: this.userInfo.userEmail,
                        journeyID: 'APIEvent-fcf867db-dfb7-1828-607b-b7256f892f26',
                        fields: {
                            FirstName: this.userInfo.firstName
                        }
                    }
                }

                this.api.post(this.api.apiv4Route + 'api/crm/subscribeUser', req, (res) => {
                    k('added to mailing list: ', res)
                    this.summerChallengeOptInModal = false
                })
            },

            checkIfUserNeedsToCheckout() {
                k('checkIfUserNeedsToCheckout', this.countdownTimeLeft)
                if (!this.optInPeriodOver) {
                
                    if (this.userIsSubscribed) {
                        this.route('/')
                        return
                    }
                    
                    this.showCompleteSignUp = true
                    this.optInPeriodEnded()
                } else {
                    this.showNameFields = false
                    this.showCompleteSignUp = true
                }

                return this.showCompleteSignUp
            },

            getUserChallengeStatus() {
                const req = {
                    userLoginToken: this.userLoginToken,
                    challengeName: 'summerSprint'
                }
                k('getUserChallengeStatus req: ', req)

                this.api.post(this.api.apiv4Route + 'api/client/mypvolve/challengeUserCompletionResults', req, (res) => {
                    k('userChallengeStatus: ', res)
                    
                    if (res.success) {
                        this.userChallengeStatus = res.data
                        this.completedDays = this.userChallengeStatus.datesCompleted ? this.userChallengeStatus.datesCompleted.length : 0
                        if (this.environmentProducts) this.generateChallengeCalendar()
                    }
                })
            },
            
            initPurchaseSuccessHandler() {
                this.$root.$off('purchaseSuccess')

                this.$root.$on('purchaseSuccess', () => {
                    k('contest purchase success!')

                    this.$q.notify({
                        message: 'Your activation was successful!',
                        type: 'positive',
                        icon: 'fa-check-circle',
                        position: 'bottom-left'
                    })

                    this.checkChallenge = true

                    let userPurchased = true
                    this.checkOptIn(userPurchased)

                    this.trackImpactSale()

                    this.$root.$off('purchaseSuccess')
                })
            },
            
            openSummerChallengeVideoModal() {
                if (this.summerChallengeOptInModal) this.summerChallengeOptInModal = false
                
                this.summerChallengeVideoModal = true
            },
            
            openSummerChallengeOptInModal() {
                if (this.summerChallengeVideoModal) this.summerChallengeVideoModal = false
                
                this.summerChallengeOptInModal = true
            },
            
            optInPeriodEnded() {
                const today = this.moment().format('MM-DD-YYYY')
                const startDay = this.moment(this.startDate, 'MM-DD-YYYY HH:mm:ss a').format('MM-DD-YYYY')
                
                k('optInPeriodEnded: ', today, startDay)
                
                if (today > startDay) {
                    this.optInPeriodOver = true
                }
            }
        },

        watch: {
            environmentProducts(value) {
                if (value) {
                    this.generateChallengeCalendar()
                }
            },

            userInfo(value) {
                k('watching user info')
                this.getUserPreferences(() => { })
                
                if (this.userInfo) {
                    this.showNameFields = !this.userInfo.firstName || !this.userInfo.lastName
                }
            },
            
            contestOptIn() {
                if (this.contestOptIn && !this.checkChallenge) {
                    this.getUserChallengeStatus()
                }
            },

            userPreferences() {
                k('userPreferences watch: ', this.contestOptIn)
                this.checkOptIn()
            }
        },

        created() {
            this.optInPeriodEnded()
            
            this.countdown('05/06/2019 00:00:01 AM', (countdownStats) => {
                
                if (!countdownStats) {
                    this.challengeHasStarted = true
                    return
                }
                
                this.daysLeft = countdownStats.days
                this.hoursLeft = countdownStats.hours
                this.minutesLeft = countdownStats.minutes
                this.secondsLeft = countdownStats.seconds
            })
            
            if (this.initialParameters) {
                k('initialParameters: ', this.initialParameters)
                
                if (this.initialParameters.payPalReturnCode) {
                    this.openSummerChallengeOptInModal()
                }
            }
            
            if (this.userInfo) {
                this.showNameFields = !this.userInfo.firstName || !this.userInfo.lastName
            }

            if (this.userPreferences) {
                k('checkUserPreferences')
                this.checkOptIn()
            } else {
                if (this.userInfo) {
                    this.getUserPreferences(() => {})
                }
            }
            
            if (this.environmentProducts) {
                this.generateChallengeCalendar()
            }

            this.initPurchaseSuccessHandler()
        },
        
        mounted() {
            if (this.contestOptIn && !this.checkChallenge) {
                setTimeout(() => {
                    this.getUserChallengeStatus()
                }, 2000)
            }
        }

    }
</script>

<style scoped>
    #hero {
        position: relative;
    }
    
    .color-overlay {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    .angled {
        clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
        -webkit-clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
    }
    
    #calendar {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-bottom: 2rem;
    }

    .card {
        position: relative;
        background: #fff;
        height: 100%;
        border: 1px solid #ddd;
        margin-bottom: 2rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .day {
        width: 14.28%;
        display: block;
    }

    .dayDate {
        color: #999;
        background: #fff;
        padding: .3rem;
    }

    .dayHeader {
        background: #8C909A;
        color: #fff;
        padding: .3rem;
    }

    .playButton {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .workouts-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 95px;
        max-width: 100%;
        background-size: cover !important;
        background-position: 50% !important;
        cursor: default;
    }

    .q-option {
        color: rgb(140, 144, 154) !important;
    }

    .q-list {
        border: none;
        color: rgb(140, 144, 154);
    }

    .q-list .q-collapsible,
    .q-list .q-item {
        border: 1px solid #ddd;
        margin-bottom: 10px;
    }
</style>