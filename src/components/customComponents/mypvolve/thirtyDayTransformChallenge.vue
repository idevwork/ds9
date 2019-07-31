<template>
    
    <div>

        <div class="row well">

            <div class="col-12">
                <h4
                    v-if="!challengeHasStarted"
                    class="thickHeader text-center q-py-md uppercase"
                    style="color: #524F4C; letter-spacing: 1px;"
                >
                    starts in
                    <span :style="{ color: pvolveMintBG }">{{daysLeft}}</span> days,
                    <span :style="{ color: pvolveMintBG }">{{hoursLeft}}</span> hours,
                    <span :style="{ color: pvolveMintBG }">{{minutesLeft}}</span> minutes and
                    <span :style="{ color: pvolveMintBG }">{{secondsLeft}}</span> seconds
                </h4>
            </div>

            <div class="col-12 q-py-md" align="center">
                    <h6 class="q-my-md" style="letter-spacing: 1px; font-size: 24px;">WORK OUT AT HOME, ON YOUR OWN TERMS</h6>
            </div>

            <div v-if="optInPeriodOver && !contestOptIn" class="col-12" align="center">
                <p class="text-weight-medium q-mt-lg" style="font-size: 30px;">We're Sorry!</p>
                <p class="text-weight-light q-mt-md">This challenge has already started, and the opt-in period is over.</p>
                
                <p v-if="!authenticated" class="text-weight-light q-mt-md">If you have already opted in, please sign in to see your calendar.</p>
            </div>


        </div>

        <div class="row well" style="border-bottom: 2px solid #c4c4c4">
            
            <div class="col-xs-12 col-sm-12 col-md-6 q-pa-md">
                <div :style="backgroundImages" style="background: url(http://vault.platformpurple.com/static/clients/mypvolve/thirtyDayTransform_module_1.jpg);" />
            </div>

                <div class="col-xs-12 col-sm-12 col-md-6 monty q-pa-xl flex flex-center">
                <h1 class="thickHeader text-left full-width uppercase" :style="`color: ${ pvolveMintTitle };`">30-day transform</h1>

                <p style="line-height: 2rem; color: #2f2f2f;">
                    New month, new challenge. Over the course of the next 30 days, you’ll commit to 18 workouts to transform your body and feel overall more energized. Ready to get started? Share your results with the rest of the community at <span class="thickHeader" :style="{ color: pvolveMintTitle }">#PvolveJourneyTo30.</span>
                </p>

                <p v-if="authenticated && !contestOptIn && !optInPeriodOver && !showNameFields && userIsSubscribed">
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
            
        </div>

        <div class="row well q-mt-lg" v-if="(!authenticated && !optInPeriodOver) || (authenticated && !contestOptIn && !optInPeriodOver && (showNameFields || !userIsSubscribed))">

            <div class="col-12" v-if="showNameFields">

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

            <div class="col-12" v-else-if="!showNameFields">

                <div style="background: rgba(255, 255, 255, .7);">

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

        </div>

        <template v-if="contestOptIn">

            <div class="row well reverse" style="border-bottom: 2px solid #c4c4c4;">

                <div class="col-xs-12 col-sm-12 col-md-6 q-pa-md">
                    <div :style="backgroundImages" style="background: url(http://vault.platformpurple.com/static/clients/mypvolve/thirtyDayTransform_module_2.jpg);" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 monty q-pa-xl">
                    <div class="flex flex-center">
                        <h3 class="thickHeader text-left full-width" :style="`color: ${ pvolveMintTitle };`">Challenge Guidelines:</h3>                
                        <ul style="line-height: 2; color: #2f2f2f;">
                            <li>Workouts must be completed between the challenge period of 8/1 - 8/30 to be counted.</li>
                            <li>One workout counts per day. Videos must be at least 15 minutes long to be counted.</li>
                            <li>Before and after photos must meet the <span :style="{ color: pvolveMintTitle }" class="cursor-pointer" @click="routeToChallengeFAQ"> guidelines </span> in order to count toward prize.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 monty q-pa-xl">
                    <div class="flex flex-center">
                        <h3 class="thickHeader text-left full-width" :style="`color: ${ pvolveMintTitle };`">Prizes:</h3>
                        <ul style="line-height: 2; color: #2f2f2f;">
                            <li>Complete 18 workouts within the 30-day period to receive one free month of streaming.</li>
                            <li>Get 50% off your next equipment purchase when you submit a before and after photo—our favorite way to see the results you earned!</li>
                        </ul>
                    </div>
                    
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 q-pa-md">
                    <div :style="backgroundImages" style="background: url(http://vault.platformpurple.com/static/clients/mypvolve/thirtyDayTransform_module_3.jpg);" />
                </div>


            </div>

            <div class="row well" :style="{ 'border-bottom': '2px solid #c4c4c4', 'padding': windowWidth < 768 ? '1rem' : '2rem' }">
                <h5 class="text-left full-width" :style="{ 'letter-spacing': '1px', 'color': '#2f2f2f' }">Challenge Stats</h5>

                <div class="col-xs-12 col-sm-4 q-pa-sm">

                    <div class="shadow-1" style="height: 24rem;">
                        <h4 class="thickHeader uppercase text-center text-white q-py-md" :style="{ 'font-size': '1.4rem', background: pvolveMintTitle }">workouts completed</h4>    

                        <div class="monty flex flex-center thickHeader" :style="{ 'font-size': `${adaptiveFontSize(6)}rem`, 'height': '70%', 'padding': windowWidth <= 768 ? '32px' : '64px' }">
                            <span :style="`color: ${ pvolveMintTitle };`">{{ completedDays }}</span> <span style="color: #c4c4c4;" class="q-ml-sm"> / 18</span>

                            <span class="thinHeader monty text-center" style="font-size: 1rem;">This is the total number of workouts you’ve completed within the challenge</span>
                        </div>
                    </div>

                </div>

                <div class="col-xs-12 col-sm-4 q-pa-sm">

                    <div class="shadow-1" style=" height: 24rem;">
                        <h4 class="thickHeader uppercase text-center text-white q-py-md" :style="{ 'font-size': '1.4rem', background: pvolveMintTitle }">streamer performance</h4>    

                        <div class="monty flex flex-center thickHeader" :style="{ 'font-size': `${adaptiveFontSize(6)}rem`, 'height': '70%', 'padding': windowWidth <= 768 ? '32px' : '64px' }">
                            <span :style="`color: ${ pvolveMintTitle };`">{{ userChallengeStatus.userRank }}</span> <span style="color: #c4c4c4;" class="q-ml-sm"> / {{ userChallengeStatus.totalNumUsers }}</span>

                            <span class="thinHeader monty text-center" style="font-size: 1rem;">Out of average streaming performance</span>
                        </div>
                    </div>

                </div>

                <div class="col-xs-12 col-sm-4 q-pa-sm">

                    <div class="shadow-1" style=" height: 24rem;">
                        <h4 class="thickHeader uppercase text-center text-white q-py-md" :style="{ 'font-size': '1.4rem', background: pvolveMintTitle }">challenge completion</h4>

                        <div class="monty flex flex-center thickHeader" :style="{ 'font-size': `${adaptiveFontSize(6)}rem`, 'height': '70%', 'padding': windowWidth <= 768 ? '32px' : '64px' }">
                            <span class="full-width text-center" :style="`color: ${ pvolveMintTitle };`">{{ percentageThruChallenge }}%</span>
                            <div class="full-width text-center">
                                <span class="thinHeader monty text-center" style="font-size: 1rem;">...through the challenge. {{ percentageThruChallenge > 0 ? `Keep it up!` : ''}}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <h2 v-if="challengeHasStarted" class="thickHeader text-center monty full-width q-my-lg" :style="{ 'letter-spacing': '1px', 'color': pvolveMintTitle }">You’re doing great!</h2>
            </div>

            <div class="row well q-mt-lg" :style="{ 'border-bottom': '2px solid #c4c4c4', 'padding': windowWidth < 768 ? '1rem' : '2rem' }">

                <div class="col-12 q-pa-md">

                    <h2 class="thickHeader uppercase monty full-width" :style="{ 'letter-spacing': '1px', 'color': pvolveMintTitle }">30 day transform challenge</h2>
                    <br>
                    <span class="monty" style="color: #2f2f2f;">
                        Use this calendar to track your progress. Each time you complete a video, you’ll earn a peach!
                    </span>

                </div>
            
                <transition appear enter-active-class="animated fadeIn">
                    <div class="col-12 row relative-position q-mt-xl" v-if="contestOptIn || (!contestOptIn && !optInPeriodOver)">

                        <div id="calendar" class="col-12">
                            <div class="day" v-for="(day, index) in calendarDays" :key="index">
                                <div v-if="day.dayNumber" class="card">

                                    <div :style="`font-size: ${adaptiveFontSize(.8)}rem;`" class="dayDate monty allCaps">
                                        {{ day.theMonth }}
                                        <span class="lt-sm"><br /></span> {{ day.theDate }}
                                    </div>

                                    <div v-if="day.today" :style="`background: ${pvolveMintBG}; font-size: ${adaptiveFontSize()}rem;`" class="dayHeader monty allCaps" align="center">
                                        <span class="gt-xs">today</span>
                                        <span class="lt-sm"><q-icon name="fas fa-calendar" style="margin: .65rem 0;" /></span>
                                    </div>

                                    <div v-else :style="`font-size: ${adaptiveFontSize()}rem;`" class="dayHeader monty allCaps" align="center">
                                        Day
                                        <span class="lt-sm"><br /></span> {{ day.dayNumber }}
                                    </div>
                                    
                                    <template v-if="contestOptIn">
                                        
                                        <div class="workouts-container">
        
                                            <div class="row flex flex-center" :style="{ height: '100%', width: '100%', background: day.productInfo ? 'rgba(80, 80, 80, 0.7)' : '#fff' }">
                                                
                                                <div v-if="day.viewingData" :style="{ background: `url('${ contentCompleteImageSrc }')`, 'background-size': 'cover', 'background-position': '50%', 'background-repeat': 'no-repeat', width: '4.5rem', height: '4.5rem' }"></div>
        
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

            <div class="row well q-mt-lg" :style="{ 'border-bottom': '2px solid #c4c4c4', 'padding': windowWidth < 768 ? '1rem' : '2rem' }">

                <div class="col-12 monty q-pa-xl flex flex-center">
                    <h3 class="thickHeader monty text-center uppercase full-width" :style="`color: ${ pvolveMintTitle };`">questions?</h3>
                    <h6>Visit our<span :style="{ color: pvolveMintTitle }" class="cursor-pointer" @click="route('/thirty-day-transform-faq')"> FAQ Page! </span>for more information.</h6>
                </div>

            </div>
            
            <div class="row well q-mt-lg" :style="{ 'border-bottom': '2px solid #c4c4c4', 'padding': windowWidth < 768 ? '1rem' : '2rem' }">
            
                <div class="col-12">
                    
                    <h2 class="thickHeader uppercase monty full-width q-mt-lg" :style="{ 'letter-spacing': '1px', 'color': pvolveMintTitle }">your 30 day transformation</h2>

                    <thirtyDayChallengeTransformation :highlightColor="pvolveMintBG" :disclaimer="`* By posting, uploading, inputting, providing, or submitting photos, videos, text, images, or any other copyrightable work (together and individually, “Your Submission”), you grant to Pvolve LLC, its affiliated companies, and its licensees (collectively, “p.volve”) a non-exclusive and compensation-free license to use Your Submission in connection with the operation of their businesses, including, without limitation, the license to: reproduce, prepare derivative works from, distribute, transmit, publicly display, publicly perform, edit, translate, and reformat Your Submission. p.volve has the sole discretion whether to use and/or remove Your Submission. Your Submission includes a representation that your results, and Your Submission, are true and accurate, not altered in any way (e.g., by Photoshop), and have been achieved through your participation in the p.volve program.`" />
                </div>
                
            </div>

        </template>
        
    </div>
    
</template>

<script>
    import signUpOffer from '../../common/showcase/signUpOffer.vue'

    import { impactTools } from './impactTools'
    import { contestTools } from './contestTools'
    import { pvolveColors } from './pvolveColors'
    import { pvolveSignUpTools } from './pvolveSignUpTools'
    import { designTools } from '../../../mixins/designTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import thirtyDayChallengeTransformation from './thirtyDayChallengeTransformation'

    export default {

        props: [ 'componentData' ],

        mixins: [ pvolveColors, contestTools, designTools, globalComputedData, userAndProductInfo, impactTools, pvolveSignUpTools ],

        components: { signUpOffer, thirtyDayChallengeTransformation },

        data: () => ({
            offerProductID: 148014,
            showCompleteSignUp: false,
            contestName: '',
            contestMailListName: '',
            promoCode: 'AUG302019',
            discountAmount: 0,
            displaySignUpIn: false,
            challengeStartTimestamp: '',
            startDate: '',

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
                promoCodeText: 'AUG302019',
                submitButtonLabel: 'Activate trial',
                noToast: true,
                stopThankYouPageRedirect: true
            },
            checkChallenge: false,
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
                // k('timeleft: ', this.daysLeft > -1, this.hoursLeft > -1, this.minutesLeft > -1, this.secondsLeft > -1)
                return this.daysLeft > -1 &&
                    this.hoursLeft > -1 &&
                    this.minutesLeft > -1 &&
                    this.secondsLeft > -1
            },

            extraMessaging() {
                return [{
                    text: `<span class="monty" style="margin: 0; font-size: .9rem;">First ${ this.completeSignUpComponentData.promoCodeText && this.discountAmount ? `${this.discountAmount} days free, then $29.99 per month after.` : '$29.99 per month.'}</span>`,
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
            },

            backgroundImages() {
                return {
                    'background-position': '50% 0%',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'height': '415px',
                    'padding': this.windowWidth > 992 ? '8rem' : '1rem'
                }
            },
            
            percentageThruChallenge() {
                return Math.round(this.completedDays / 18 * 100)
            }
        },

        methods: {
            
            joinChallenge() {
                // k('joinChallenge: ', this.userIsSubscribed, this.userInfo.firstName, this.userInfo.lastName, this.optInPeriodOver)
                
                if (this.userIsSubscribed && this.userInfo.firstName && this.userInfo.lastName && !this.optInPeriodOver ) {
                    this.checkChallenge = true
                    this.checkOptIn()
                }
            },
            
            userNeedsToSignUpForSubscription() {
                // k('userNeedsToSignUpForSubscription')

                this.completeSignUpComponentData.promoCodeText = ''
                this.completeSignUpComponentData.submitButtonLabel = 'Activate'
                
                this.showCompleteSignUp = true

                this.$q.loading.hide()
            },

            subscribeUserToCRMList(userPurchased) {
                const req = {                    
                    journeyID: 'APIEvent-11743a29-b7c4-e472-7c06-3c3cb32de6ed',
                    userEmail: this.userInfo.userEmail,
                    data: {
                        ExistingSubscriber: userPurchased ? false : true
                    }
                }

                this.api.post(this.api.apiv4Route + 'api/client/mypvolve/subscribeUser2CRMlist', req, (res) => {
                    // k('added to crm list: ', res)
                })
            },

            checkOptIn(userPurchased) {
                k('checkOptIn: ', this.checkChallenge, this.userPreferences)

                this.$q.loading.hide()

                if (this.checkChallenge && this.userPreferences) {
                    // k('contestOptIn: ', this.contestOptIn, this.userInfo.firstName, this.userInfo.lastName, this.optInPeriodOver)
                    
                    if (!this.contestOptIn && this.userInfo.firstName && this.userInfo.lastName && !this.optInPeriodOver) {
                        // k('addingUserToChallenge: ', userPurchased)
                        this.addUserToChallenge(userPurchased, () => {
                            this.subscribeUserToCRMList(userPurchased)
                        })
                    } else {
                        k('checkOptIn else')
                        if (this.contestOptIn) {
                            this.getUserChallengeStatus()
                        } else {
                            if (this.userIsSubscribed) {
                                // this.route('/')
                                return
                            }
                        }

                        this.checkChallenge = false
                    }
                }
            },

            generateChallengeCalendar() {
                
                this.calendarDays = []

                var challengeStartDate = this.moment(this.challengeStartTimestamp).utc().format("MM-DD-YY")
                k(challengeStartDate)
                
                for (let i = 0; i < 30; i++) {
                    
                    let referenceDay = this.moment(challengeStartDate, 'MM-DD-YYYY').add(i, 'days')

                    const completedDay = this.userChallengeStatus.datesCompleted ? this.userChallengeStatus.datesCompleted.filter(date => referenceDay.format('MM-DD-YYYY') === this.moment(date, 'YYYY-MM-DD').format('MM-DD-YYYY')) : []
                    
                    this.calendarDays[i] = {
                        theMonth: referenceDay.format('MMM'),
                        theDate: referenceDay.format('D'),
                        dayNumber: i + 1,
                        viewingData: completedDay.length ? true : false,
                    }

                    // labels today's day in calendar
                    if (referenceDay.isSame(Date.now(), 'day')) { // it's today
                        this.calendarDays[i].today = true
                    }
                }

                // now pad the beginning of calendar with an offset
                this.calendarOffset = this.moment(challengeStartDate, 'MM-DD-YY').day()

                for (let i = 0; i < this.calendarOffset; i++) {
                    this.calendarDays.unshift({})
                }
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

                // k(j(req))

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

            checkIfUserNeedsToCheckout() {
                this.$q.loading.hide()
                
                this.optInPeriodEnded()
                
                if (!this.optInPeriodOver) {
                    
                    this.showCompleteSignUp = true
                } else {
                    this.showNameFields = false
                    this.showCompleteSignUp = true
                }

                return this.showCompleteSignUp
            },

            getUserChallengeStatus() {
                const req = {
                    userLoginToken: this.userLoginToken,
                    challengeName: '30DayTransformChallenge'
                }

                this.api.post(this.api.apiv4Route + 'api/client/mypvolve/challengeUserCompletionResults', req, (res) => {
                    
                    if (res.success) {
                        this.userChallengeStatus = res
                        this.completedDays = this.userChallengeStatus.datesCompleted ? this.userChallengeStatus.datesCompleted.length : 0
                        this.generateChallengeCalendar()
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
                    
                    let subscriptionProduct = this.$store.state.receiptInfo.products.find(product => product.interval)
                
                    k('initPurchaseSuccessHandler cart is not empty: ', subscriptionProduct, this.$store.state.receiptInfo.products, this.$store.state.receiptInfo)
                    
                    if (subscriptionProduct.interval) {
                        fbq('track', 'Subscribe', {
                            currency: "USD",
                            value: this.$store.state.purchaseTotal,
                            subscription_id: subscriptionProduct.productID
                        })
                    }

                    this.$root.$off('purchaseSuccess')
                })
            },
            
            optInPeriodEnded() {
                const today = this.moment().format('MM-DD-YYYY')
                const optInPeriodEndDate = this.moment(this.componentData.challengeOptInEndMSeconds).format('MM-DD-YYYY')
                
                if (today > optInPeriodEndDate) {
                    this.optInPeriodOver = true
                }
            },
            routeToChallengeFAQ() {
                this.initialParameters['guidelines'] = true
                this.route('/thirty-day-transform-faq')
            }
        },

        watch: {
            userInfo(value) {
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
                if (this.userIsSubscribed) {
                    this.checkChallenge = true
                }
                
                this.checkOptIn()
            },
            
            cart(value) {
                this.discountAmount = value.length ? value[0].freeSubscriptionInterval.split(' ')[0] : 0
            }
        },

        created() {
            this.contestName = this.contestMailListName = this.componentData.contestName
            this.challengeStartTimestamp = this.componentData.challengeStartTimestamp

            this.optInPeriodEnded()
            
            this.countdown(this.challengeStartTimestamp, (countdownStats) => {
                
                if (!countdownStats) {
                    this.challengeHasStarted = true
                    return
                }
                
                this.daysLeft = countdownStats.days
                this.hoursLeft = countdownStats.hours
                this.minutesLeft = countdownStats.minutes
                this.secondsLeft = countdownStats.seconds
            })
            
            if (this.userInfo) {
                this.showNameFields = !this.userInfo.firstName || !this.userInfo.lastName
            }

            if (this.userPreferences) {
                
                if (this.userIsSubscribed) {
                    this.checkChallenge = true
                }
                
                this.checkOptIn()
            } else {
                if (this.userInfo) {
                    this.getUserPreferences(() => {})
                }
            }
            
            this.generateChallengeCalendar()

            this.initPurchaseSuccessHandler()
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
        min-height: 95px;
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