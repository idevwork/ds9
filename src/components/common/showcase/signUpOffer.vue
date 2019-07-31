<template>
    <div :style="`background: ${signUpBackgroundColor ? signUpBackgroundColor : '#efefef'}';`">

        <div v-if="!showCompleteSignUp" class="row"> <!--email + password -->
            <div class="col-12" align="center">
                <h6 :style="`color: ${textColor}; margin-bottom: 1rem;`">Step 1 of 2</h6>

                <h2 :style="`margin: 1rem 0; text-transform: none; color: ${headingColor};`">{{newUser ? 'Create your account' : 'Sign in to your account'}}</h2>

                <p class="monty" :style="`font-size: .9rem; margin: .5rem 0; color: ${textColor};`">{{newUser ? (newUserSubHeader || 'Enter your email and a password to get started:') : 'Enter your password to sign in to your account:'}}</p>
            </div>

            <div class="col-sm-12" align="left">
                <q-field
                    :error="fieldError.userEmail"
                    error-label="Please fill in your email address"
                >
                    <q-input
                        v-model="userEmail"
                        :class="[{ rounded: roundedDesign }, 'inputBox']"
                        name="userEmail"
                        hide-underline
                        type="email"
                        :attributes="{autocompletetype: 'email', autocorrect: 'off'}"
                        color="grey-7"
                        float-label="your email"
                        @keydown.enter="checkEmail(() => {})"
                        @blur="checkEmail(() => {})"
                        @input="fieldError.userEmail = false"
                    />
                </q-field>

                <div v-if="completeSignUpComponentData.firstName">
                    <p class="monty" style="text-transform: uppercase; font-size: 12px;">
                        Welcome back, {{completeSignUpComponentData.firstName}}!
                    </p>
                </div>
            </div>

            <div class="col-sm-12" align="left">
                <q-field
                    :error="fieldError.userPassword"
                    error-label="Please enter a password"
                >
                    <q-input
                        v-model="userPassword"
                        :class="[{ rounded: roundedDesign }, 'inputBox']"
                        name="userPassword"
                        hide-underline
                        type="password"
                        :attributes="{autocompletetype: 'current-password', autocorrect: 'off'}"
                        color="grey-7"
                        :float-label="newUser ? 'create password' : 'your password'"
                        @input="fieldError.userPassword = false"
                        @keyup.enter="nextStep"
                    />
                </q-field>
                <a v-if="!newUser">
                    <p @click="resetPassword()" class="monty" :style="`cursor: pointer; margin: .5rem; text-transform: uppercase; font-size: 12px; color: ${textColor};`">
                        forgot password
                    </p>
                </a>
            </div>

            <div
                class="row cursor-pointer"
                v-if="enableNewsletterCheckbox && newUser"
                @click="generalSubscribeToNewsletter = !generalSubscribeToNewsletter"
            >
                <div class="col-1">
                    <q-checkbox color="#000" v-model="generalSubscribeToNewsletter" />
                </div>
                <div class="col-11" style="font-size: 13px; margin-top: 1px;">
                    Keep me up to date with P.volve newsletters and exclusive email offers
                </div>
            </div>

            <div :class="['col-12', 'q-py-sm', { 'rounded': roundedDesign }, 'error-field-color']" style="background-color: #fff;" align="center" v-if="contextErrorMessage">
                {{ contextErrorMessage }}
            </div>

            <div class="col-12 row full-width"> <!--next step btn -->

                <q-item v-if="subscribeRoute" style="padding: 0;">
                    <q-item-side>
                        <q-checkbox class="pull-left" v-model="subscribeToNewsletter" style="margin-bottom: 0;" />
                    </q-item-side>
                    <q-item-main>
                        <span v-html="subscribeLabel || 'Yes, I would like to subscribe to the newsletter'" style="font-size: .75rem;" />
                    </q-item-main>
                </q-item>

                <div class="col-12">
                    <q-btn @click="nextStep" :class="[{ 'roundedButton': roundedDesign }, 'monty', 'full-width']" :style="`margin-top: .5rem; background: ${buttonColor}; color: #fff;`" id="nextStepButton">
                        <h6 v-if="newUserButtonText" class="thickHeader">{{windowWidth < 768 ? 'Start' : newUserButtonText}}</h6>
                        <h6 v-else class="thickHeader">{{newUser ? (newUserButtonText || 'Create Account') : 'Continue'}}</h6>
                        <q-icon name="fa-caret-right" style="margin-left: 1rem;" />
                    </q-btn>
                </div>

                <socialSignIn @socialSignInSuccess="afterSignInUp" :signUpBackgroundColor="signUpBackgroundColor" :noredirect="noredirect" />
            </div>
        </div>

        <div v-else>
            <div v-if="completeSignUpComponentData" class="row relative-position"> <!--bottom part - pymt info -->
                <div class="col-12" align="center">
                    <h6 :style="`color: ${textColor}; margin-bottom: 1rem;`">Step 2 of 2</h6>

                    <h2 v-if="completeSignUpComponentData && completeSignUpComponentData.header" :style="`margin: 1rem 0; text-transform: none; color: ${buttonColor};`">{{completeSignUpComponentData.header}}</h2>
                </div>

                <div v-if="extraMessaging" class="col-12" style="margin-bottom: 1rem;">
                    <p v-for="item in extraMessaging" style="margin: 0;">
                        <q-icon v-if="item.icon" :name="item.icon" :style="`color: ${item.iconColor};`" />
                        <span v-html="item.text"></span>
                    </p>
                </div>

                <div v-if="checkoutComponent" class="col-12">
                    <div :is="checkoutComponent" :componentData="completeSignUpComponentData" :buttonColor="buttonColor" @componentLoaded="completeSignUpComponentLoaded()" :noToast="completeSignUpComponentData.noToast" />
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import { authentication } from '../../../mixins/authentication'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import socialSignIn from '../auth/socialSignIn.vue'

    export default {
        props: ['productIDsToCheck', 'newUserButtonText', 'newUserSubHeader', 'offerProductID', 'showCompleteSignUp', 'completeSignUpComponent', 'completeSignUpComponentData', 'subscribeRoute', 'subscribeLabel', 'signUpBackgroundColor', 'headingColor', 'textColor', 'buttonColor', 'giftCheckout', 'userEmailProp', 'extraMessaging'],

        components: {
            socialSignIn
        },

        data() {
            return {
                userEmail: '',
                userPassword: '',
                newUser: true,
                noredirect: true,

                needToCheckIfUserOwnsProduct: false,
                subscribeToNewsletter: true,
                generalSubscribeToNewsletter: false,

                checkoutComponent: '',

                fieldError: {
                    userEmail: false,
                    userPassword: false
                },

                contextErrorMessage: '',

                inCart(productID) {
                    var inCart = false
                    if (this.cart.length) this.cart.forEach((item) => {
                        if (item.productID == productID && !item.recipientName) {
                            inCart = true
                        }
                    })

                    return inCart
                },
            }
        },

        mixins: [ authentication, globalComputedData ],

        computed: {
            userOwnsProduct() {
                return this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', this.offerProductID).userActiveProduct
            },

            previouslyOwnedTrial() {
                return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length
            },

            roundedDesign() {
                return this.environmentJSON.e.noRoundedDesign ? false : true
            },

            enableNewsletterCheckbox() {
                return this.$store.state.environment.json.e.enableNewsletterCheckbox ? true : false
            }
        },

        methods: {
            checkEmail(cb) {
                if (!this.j_.validEmailAddress(this.userEmail)) {
                    this.fieldError.userEmail = true
                    return false
                }

                if (!this.userEmail) {
                    this.fieldError.userEmail = true
                    this.newUser = false
                } else {
                    this.contextErrorMessage = ''

                    this.sendEmailToAPI((res) => {
                        kw('send email to api: ', res)
                        if (res.success) { // they are found

                            this.newUser = false
                        } else {
                            this.newUser = true
                        }
                        cb()
                    })
                }
            },

            checkIfUserOwnsProduct() {
                k('checkIfUserOwnsProduct signUpOffer')
                k(this.environmentProducts, this.userSubscriptionProductStatusHistory, this.needToCheckIfUserOwnsProduct)

                // now have environmentProducts
                this.$q.loading.hide()

                if (this.productIDsToCheck && this.userHasAccess(this.productIDsToCheck) && !this.giftCheckout) {
                    kw('user has access')

                    this.$emit('userHasAccess')
                } else {
                    // user does not have access

                    if (this.previouslyOwnedTrial) {
                        //user had previously had trial
                        k('userPreviouslyOwned')
                        this.$emit('userPreviouslyOwned')
                    } else {
                        // user has not previosuly had trial
                        k('user needs to checkout')
                        this.$emit('userNeedsToCheckout')
                    }
                }

                this.needToCheckIfUserOwnsProduct = false
            },

            completeSignUpComponentLoaded() {
                k('completeSignUpComponentLoaded')
                if (this.completeSignUpComponentData.loadHook) this[this.completeSignUpComponentData.loadHook]()
            },

            findProductInfo() {
                k('findProductInfo: ', this.offerProductID, j(this.environmentProducts))
                if (!this.offerProductID) return false

                // add product to cart if not there
                var product = this.environmentProducts.find(product => {

                    return product.productID === Number(this.offerProductID)
                })
                k('found product: ', product)

                return product
            },

            addProductInfoToCompleteSignUpComponentData() {
                k('addProductInfoToCompleteSignUpComponentData!')

                var product = this.findProductInfo()
                this.completeSignUpComponentData.productInfo = product
                // k('addProductInfoToCompleteSignUpComponentData: ', this.completeSignUpComponentData)
            },

            addProductToCart() {
                var product = this.findProductInfo()
                k('addProductToCart product: ', product)

                if (product) {
                    if (this.inCart(this.offerProductID)) this.$store.commit('saveCart', [])
                    this.$store.commit('add2cart', product)

                    this.completeSignUpComponentData.productInfo = product

                    if (!this.completeSignUpComponentData.noToast) this.$q.notify({
                        message: 'Added subscription to cart!',
                        type: 'positive',
                        icon: 'fa-check-circle',
                        position: 'bottom-left'
                    })
                }

                if (this.initialParameters.coupon) {
                    kw('COUPON: ', this.initialParameters.coupon)
                    this.completeSignUpComponentData.promoCodeText = this.initialParameters.coupon
                }
            },

            nextStep() {
                this.contextErrorMessage = ''

                if (!this.userEmail || !this.userPassword || this.fieldError.userEmail) {
                    // show validation message on fields
                    if (!this.userEmail) this.fieldError.userEmail = true
                    if (!this.userPassword) this.fieldError.userPassword = true
                    return false
                }

                this.$q.loading.show()

                this.checkEmail(() => {

                    if (this.subscribeToNewsletter && this.subscribeRoute) this.sendSubscribeAPICall()

                    if (this.newUser) { // email not found in db
                        // add new user to db

                        if (this.generalSubscribeToNewsletter) {
                            this.marketingOptIn()
                        }

                        this.registerNewUser((res) => {

                            if (!res.success) {
                                var resStr = res.messageCode
                                if (res.messageCode === 'userAuthenticationFail') {
                                    resStr = 'We have an account for this email. Please tap the \'sign in\' button to log in.'
                                }

                                this.contextErrorMessage = resStr
                            } else {
                                this.afterSignInUp()
                            }
                        })
                    } else {
                        this.signUserIn((res) => {
                            kw('signUserIn res: ', res)
                            if (!res.authenticated) {
                                this.$q.loading.hide()

                                this.contextErrorMessage = 'The email or password is incorrect.'
                                this.userPassword = ''
                            } else { // email & password is good
                                this.afterSignInUp()
                            }
                        })
                    }
                })
            },

            afterSignInUp() {
                k('afterSignInUp!')

                this.needToCheckIfUserOwnsProduct = true

                k('environmentProducts: ', this.environmentProducts)
                k('userSubscriptionProductStatusHistory: ', this.userSubscriptionProductStatusHistory)

                if (this.environmentProducts && this.userSubscriptionProductStatusHistory) {
                    this.checkIfUserOwnsProduct()
                    return
                }
                this.$q.loading.hide()
            },

            resetPassword() {
                this.sendRequestPasswordChangeToAPI((res) => {
                    if (res.success) {
                        this.informUserPasswordResetHasBeenSent()
                    }
                    else {
                        var resStr = 'Sorry we could not reset your password. Please try again later or contact support.'

                        if (res.messageCode) {
                            if (res.messageCode === 'userEmailNotFound' || res.messageCode === 'errorGettingUserInfo') resStr = 'This email was not found in our system. Please try again.'
                        }
                    }
                })
            },

            sendSubscribeAPICall() {
                var route = this.subscribeRoute
                var req = {
                    userEmail: this.userEmail,
                    listID: 'fa610551dc',
                    mergeFields: {
                       FNAME: this.userInfo.firstName,
                       LNAME: this.userInfo.lastName
                    }
                }

                this.api.post(this.api.apiv4Route + route, req, (res) => {
                    k('sendSubscribeAPICall: ', route, req, res)

                    if (res.status) this.$q.notify({
                       message: this.userEmail + ': you are now ' + res.status + ' to our newsletter!',
                       type: 'info',
                       icon: 'fa-check-circle',
                       position: 'bottom-left'
                    })
                })
            }
        },

        created() {
            // if they are logged in, redirect to library
            if (this.userLoginToken) {
                kw('user is signed in already on offer')
                this.$q.loading.show()

                this.getUserSubscriptionProductStatusHistory()

                if (this.environmentProducts && this.userSubscriptionProductStatusHistory) {
                    this.checkIfUserOwnsProduct()
                } else {
                    this.needToCheckIfUserOwnsProduct = true
                }
            }

            if (!this.initialParameters.payPalReturnCode && !this.giftCheckout) this.$store.commit('clearCart')

            if (this.completeSignUpComponentData && this.completeSignUpComponentData.componentName) {
                let path = this.completeSignUpComponentData.componentPath ? `customComponents/${this.completeSignUpComponentData.componentPath}` : `common/shop/checkout/${this.completeSignUpComponentData.componentName}`
                this.loadIt(this.completeSignUpComponentData.componentName, path)

                this.checkoutComponent = this.completeSignUpComponentData.componentName
            }

            if (this.userEmailProp) {
                this.userEmail = this.userEmailProp
                this.checkEmail(() => {})
            }
        },

        mounted() {
            k('mounted signUpOffer')

            if (this.initialParameters.email) {
                this.userEmail = decodeURIComponent(this.initialParameters.email)

                this.checkEmail(() => {})
                document.getElementsByName("userPassword")[0].focus()

                delete this.initialParameters.email
                this.$store.commit('initialParameters', this.initialParameters)
            }
        },

        watch: {
            environmentProducts() {
                k('watch environmentProducts! ', this.environmentProducts, this.userSubscriptionProductStatusHistory, this.needToCheckIfUserOwnsProduct)

                if (this.environmentProducts && this.userSubscriptionProductStatusHistory && this.needToCheckIfUserOwnsProduct) this.checkIfUserOwnsProduct()
            },

            userSubscriptionProductStatusHistory() {
                k('watch userSubscriptionProductStatusHistory! ', this.environmentProducts, this.userSubscriptionProductStatusHistory, this.needToCheckIfUserOwnsProduct)

                if (this.environmentProducts && this.userSubscriptionProductStatusHistory && this.needToCheckIfUserOwnsProduct) this.checkIfUserOwnsProduct()
            },

            userEmailProp() {
                k('userEmailProp watch: ', this.userEmailProp)
                if (this.userEmailProp) {
                    this.userEmail = this.userEmailProp
                    this.checkEmail(() => {})
                }
            }
        }
    }
</script>

<style>
    .smallHead {
        font-size: 1.2rem;
        margin: 0;
    }

    .q-if-hide-underline:not(.q-if-inverted) {
        padding-bottom: 1rem;
    }
</style>