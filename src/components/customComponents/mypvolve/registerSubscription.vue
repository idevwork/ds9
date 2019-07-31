<template>

    <div>
        <div id="hero" class="row relative-position" :style="heroStyle">

            <div class="color-overlay" :style="overlayStyle"></div>

            <div id="headerColor" class="row well justify-center items-center" style="z-index: 1;  background: rgba(255, 255, 255, .7)">

                <div class="col-sm-12 col-md-5" :style="`padding: 1rem;`">
                    <h1 :style="`font-size: ${adaptiveFontSize(2)}rem;`">Register Your <span class='thickHeader' :style="`color: ${pvolveMintBG};`">Subscription</span></h1>

                    <h6 style="margin: 1rem 0;">You’re one step closer to looking and feeling your best!</h6>
                    <p class="monty" style="margin: 1rem 0; font-size: 1rem;">Please enter your credit card to finish creating your account to ensure your membership is renewed at the end of your plan. Don’t worry, you can cancel anytime prior to renewal!</p>
                    <p class="monty" style="margin: 1rem 0; font-size: 1rem;">(A $1 authorization will be processed at this time, but you will not be charged)</p>
                </div>

                <div class="col-sm-12 col-md-7" :style="`padding: 1rem;`">
                    <div v-if="jwtValue" style="max-width: 30rem; margin: 0 auto;">
                        <signUpOffer
                            :userEmailProp="jwtValue ? jwtValue.userEmail : ''"
                            :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs"
                            :offerProductID="offerProductID"
                            :completeSignUpComponentData="completeSignUpComponentData"
                            :buttonColor="pvolveMintTitle"
                            :signUpBackgroundColor="'rgba(0,0,0,0)'"

                            :showCompleteSignUp="showCompleteSignUp"
                            :extraMessaging="extraMessaging()"

                            subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P."

                            @userHasAccess="showCompleteSignUp = true"
                            @userPreviouslyOwned="showCompleteSignUp = true"
                            @userNeedsToCheckout="showCompleteSignUp = true"
                        />
                    </div>

                    <div v-else-if="initialParameters.payPalReturnCode && initialParameters.payPalReturnCode == 1" class="relative-position" align="center" style="padding: 1rem;">
                        <h6 style="margin: 1rem 0;">Continuing with paypal...</h6>
                        <q-spinner :size="30" />
                    </div>

                    <div v-else align="center">
                        <h6>No registration token.</h6>
                    </div>
                </div>

            </div>
        </div>

    </div>

</template>

<script>
    import signUpOffer from '../../common/showcase/signUpOffer.vue'

    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { designTools } from '../../../mixins/designTools'
    import { pvolveColors } from './pvolveColors'
    import { pvolveSignUpTools } from './pvolveSignUpTools'


    const jwtDecode = require('jwt-decode')
    export default {
        props: ['componentData'],

        components: {
            signUpOffer
        },

        mixins: [pvolveColors, designTools, globalComputedData, userAndProductInfo, pvolveSignUpTools],

        data() {
            return {
                offerProductID: 148014,
                showCompleteSignUp: false,

                jwtValue: '',

                completeSignUpComponentData: {
                    header: 'Payment info',
                    description: '',
                    componentName: 'PvolveCreditCardForm',
                    componentPath: 'mypvolve/PvolveCreditCardForm',
                    loadHook: '',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    showCodeFields: false,
                    promoCodeText: '',
                    submitButtonLabel: 'Start Subscription',
                    noToast: true,
                    stopThankYouPageRedirect: true,
                    customPurchaseAction: 'activatePvolveSubscriptionToken',
                    forceHideAuthMessage: true
                },

                extraMessaging() {
                    return [{
                        text: `<span class="monty" style="margin: 0; font-size: .9rem;">${this.jwtValue && this.jwtValue.cart ? this.jwtValue.cart[0].productName : ''}, then $29.99 per month after.</span>`,
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveMintTitle
                    // }, {
                    //     text: '<span class="monty" style="margin: 0; font-size: .9rem;">Cancel within your <strong>trial period to not be charged.</strong></span>',
                    //     icon: 'fas fa-caret-right',
                    //     iconColor: this.pvolveMintTitle
                    }, {
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">Monthly memberships can be cancelled at any time.</span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveMintTitle
                    }, {
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">Instantly access 150+ premium workouts.</span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveMintTitle
                    }]
                }
            }
        },

        computed: {

            heroUnitComponentData() {
                return {
                    backgroundImageURL: 'mypvolve/90DayChallenge_header.jpg',
                    padding: '0',
                    textColor: '#444',
                    overlayColor: '#fff',
                    overlayOpacity: '.5'
                }
            },

            heroImageSrc() {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + this.heroUnitComponentData.backgroundImageURL
            },

            heroStyle() {
                var styleStr = ""
                styleStr += this.heroUnitComponentData.backgroundImageURL ? "background: url(" + this.heroImageSrc + "); " : ""
                styleStr += this.heroUnitComponentData.headerColor ? "background-color: " + this.heroUnitComponentData.headerColor + "; " : ""
                styleStr += "background-position: 80% 50%; "
                styleStr += "background-size: " + (this.heroUnitComponentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.heroUnitComponentData.heroHeight ? "height: " + this.heroUnitComponentData.heroHeight + "; " : ""
                styleStr += this.heroUnitComponentData.logoLink ? "cursor: pointer;" : ""
                styleStr += "padding: " + (this.windowWidth > 992 ? " 4rem" : "1rem") + ";"
                // k('styleStr: ', styleStr)
                return styleStr
            },

            overlayStyle() {
                let overlayColor = this.heroUnitComponentData.overlayColor
                let overlayOpacity = this.heroUnitComponentData.overlayOpacity
                let styleStr = ''
                styleStr += overlayColor ? `background-color: ${overlayColor};`: ''
                styleStr += overlayOpacity ? `opacity: ${overlayOpacity};` : ''

                return styleStr
            },

            innerHeroStyle() {
                var styleStr = "z-index: 1; width: 100%; padding: 1rem;"
                    // styleStr += (this.heroUnitComponentData.padding && this.windowWidth > 767 ? 'padding: ' + this.heroUnitComponentData.padding + ' 0;' : this.heroUnitComponentData.mobilePadding && this.windowWidth < 768 ? 'padding: ' + this.heroUnitComponentData.mobilePadding + ' 0;' : '')
                    // styleStr += (this.heroUnitComponentData.margin && this.windowWidth > 767 ? 'margin: ' + this.heroUnitComponentData.margin + ' 0;' : this.heroUnitComponentData.mobileMargin && this.windowWidth < 768 ? 'margin: ' + this.heroUnitComponentData.mobileMargin + ' 0;' : '')
                return styleStr
            },

            testimonialComponentData() {
                return {
                    id: 'pvolveSubwayTestimonials',
                    testimonials: this.testimonials
                }
            }
        },

        methods: {

            activatePvolveSubscriptionToken(res) {
                k('activatePvolveSubscriptionToken: ', res)

                this.$q.loading.show()

                let req = {
                    token: this.initialParameters['token'],
                    environment: 'mypvolve',
                    userLoginToken: this.userLoginToken,

                    creditCard: res.creditCard,
                    expirationMonth: res.expirationMonth,
                    expirationYear: res.expirationYear,
                    cvv: res.securityCode,
                    saveCreditCard: res.saveCreditCard
                }

                k('activatePvolveSubscriptionToken req: ', req)

                this.sendTokenToAPI(req, res => {
                    this.$q.loading.hide()

                    if (res.success) {
                        this.successfulPurchase(res)
                    } else {
                        this.failedPurchase(res)
                    }
                })
            },

            completePayPalSubscriptionToken(pvolveSubscriptionURLTokenFromStorage) {
                let req = {
                    token: pvolveSubscriptionURLTokenFromStorage,
                    environment: 'mypvolve',
                	userLoginToken: this.userLoginToken,

                	payPalToken: this.initialParameters.token,
                	payerID: this.initialParameters.PayerID
                }

                // finish paypal trial update
                this.sendTokenToAPI(req, res => {
                    if (res.success) {
                        this.successfulPurchase()
                    } else {
                        this.failedPurchase()
                    }
                })
            },

            sendTokenToAPI(req, cb) {
                this.api.post(`${this.api.apiv4Route}api/token/use`, req, res => {
                    k('activatePvolveSubscriptionToken res: ', res)

                    cb(res)
                })
            },

            successfulPurchase(res) {
                k('purchase success!')

                this.removeURLParams()
                this.getProductsAndTags4Environment()
                this.getUserSubscriptionProductStatusHistory()

                this.$q.notify({
                    message: 'Your activation was successful!',
                    type: 'positive',
                    icon: 'fa-check-circle',
                    position: 'bottom-left'
                })

                this.route('/')

                this.localStorage.set('pvolveSubscriptionURLToken', '')
                
                // after custom purchaseSuccess, run tracking code methods
                
                // shopify is handling the sale
                // this.trackImpactSale()

                pintrk('track', 'signup', {
                    lead_type: '15 day free trial'
                })

                // inject Loop.me pixel
                this.injection.injectImgIntoDOM({
                    "headOrBody": "head",
                    "type": "img",
                    "id": "loopMePixel",
                    "src": "https://tk0x1.com/sj/tr?id=__ADID__&et=CONVERSION&pt=sp&f=0&event_name=pvolve_signups&campaign_id=2000673",
                    "style": "display: none; height: 0; width: 0;"
                })

                this.injection.injectScriptIntoDOM({
                    "headOrBody": "head",
                    "id": "clickMeterVars",
                    "code": `var ClickMeter_conversion_id= '6CCB1A2841104DD39561EF52E1380B05'; var ClickMeter_conversion_value = '${ this.$store.state.purchaseTotal }';`
                })

                this.injection.injectScriptIntoDOM({
                    "headOrBody": "head",
                    "id": "cmconvscript",
                    "src": "http://www.clickmeter.com/js/conversion.js"
                })
            },

            failedPurchase(res) {
                ke('failedPurchase')

                let messageStr = 'Sorry, it looks like this token has already been used. Please contact support.'

                this.$q.notify({
                    message: messageStr,
                    type: 'negative',
                    icon: 'fa-exclamation-circle',
                    position: 'bottom-left'
                })
            },

            removeURLParams() {
                k('removeURLParams! ', j(this.initialParameters))

                if (this.initialParameters.giftCard) this.$store.commit('deleteKeyPathInStore', 'initialParameters.giftCard')
                if (this.initialParameters.cart) this.$store.commit('deleteKeyPathInStore', 'initialParameters.cart')
                if (this.initialParameters.coupon) this.$store.commit('deleteKeyPathInStore', 'initialParameters.coupon')
                if (this.initialParameters.payPalReturnCode) this.$store.commit('deleteKeyPathInStore', 'initialParameters.payPalReturnCode')
                if (this.initialParameters.token) this.$store.commit('deleteKeyPathInStore', 'initialParameters.token')
                if (this.initialParameters.PayerID) this.$store.commit('deleteKeyPathInStore', 'initialParameters.PayerID')
            },
        },

        watch: {
            userInfo() {
                this.getUserPreferences(() => {})
            },

            userPreferences() {
                k('userPreferences watch: ', this.contestOptIn)
            }
        },

        created() {
            k('offerProductID: ', this.offerProductID)

            this.$store.commit('clearCart')

            k('returning from paypal: ', this.initialParameters.payPalReturnCode)
            if (this.initialParameters.payPalReturnCode && this.initialParameters.payPalReturnCode == 1) {

                let pvolveSubscriptionURLTokenFromStorage = this.localStorage.get('pvolveSubscriptionURLToken')
                k('pvolveSubscriptionURLTokenFromStorage: ', pvolveSubscriptionURLTokenFromStorage)

                if (pvolveSubscriptionURLTokenFromStorage) {
                    this.completePayPalSubscriptionToken(pvolveSubscriptionURLTokenFromStorage)
                }

            } else {

                let pvolveSubscriptionURLToken = this.initialParameters['token']

                if (pvolveSubscriptionURLToken) {
                    this.localStorage.set('pvolveSubscriptionURLToken', pvolveSubscriptionURLToken)
                    let decode = jwtDecode(pvolveSubscriptionURLToken)
                    k('decode: ', decode)
                    
                    this.jwtValue = decode && decode.tokenData ? decode.tokenData : decode
                    k('jwtValue: ', this.jwtValue)

                    if (this.jwtValue && this.jwtValue.cart) {
                        this.offerProductID = this.jwtValue.cart[0].productID
                        this.completeSignUpComponentData.loadHook = 'addProductToCart'
                        this.completeSignUpComponentData.promoCodeText = 'subscriptionRegistration'
                    }
                }

            }

            if (!this.userPreferences && this.userInfo) {
                this.getUserPreferences(() => {})
            }

            this.$root.$on('activatePvolveSubscriptionToken', this.activatePvolveSubscriptionToken)
        }
    }
</script>

<style scoped>
    .color-overlay {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>