<template>

    <div :style="'background: ' + (signUpBackgroundColor ? signUpBackgroundColor : '#efefef') + ';'">
    
        <div class="row" style="padding: 1rem;"> <!--email + password -->
            <div class="col-12">
                <p class="smallHead">Step 1: {{newUser ? 'Create your account' : 'Sign in to your account'}} <q-icon v-if="showCompleteSignUp" name="fa-check" color="green" style="font-size: 1.5rem;" /></p>
            </div>
             
            <div v-if="!showCompleteSignUp" class="col-sm-12" style="padding: 0 .5rem; margin-top: .5rem;">
                <q-field 
                    :error="fieldError.userEmail"
                    error-label="Please fill in your email address"
                >
                    <q-input
                        v-model="userEmail"
                        class="inputBox"
                        name="userEmail"
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
            
            <div v-if="!showCompleteSignUp" class="col-sm-12" style="padding: 0 .5rem;">
                <q-field 
                    :error="fieldError.userPassword"
                    error-label="Please enter a password"
                >
                    <q-input
                        v-model="userPassword"
                        class="inputBox"
                        name="userPassword"
                        type="password"
                        :attributes="{autocompletetype: 'current-password', autocorrect: 'off'}"
                        color="grey-7"
                        float-label="your password"
                        @input="fieldError.userPassword = false"
                    />
                </q-field>
                <a v-if="!newUser">
                    <p @click="resetPassword()" class="monty" style="cursor: pointer; margin: 0; text-transform: uppercase; font-size: 12px;">
                        forgot password
                    </p>
                </a>
            </div>
                
            <div v-if="!showCompleteSignUp" class="col-12 row full-width" style="padding: 0 .5rem;"> <!--next step btn -->

                <q-item v-if="subscribeRoute" style="padding: 1rem 0;">
                    <q-item-side>
                        <q-checkbox class="pull-left" v-model="subscribeToNewsletter" style="margin-bottom: 0;" />
                    </q-item-side>
                    <q-item-main>
                        <span v-html="subscribeLabel || 'Yes, I would like to subscribe to the newsletter'" style="font-size: .75rem;" />
                    </q-item-main>
                </q-item>
                
                <div class="col-12">
                    <q-btn @click="nextStep" class="full-width monty" :style="'margin-top: .5rem; background: ' + buttonColor + '; color: #fff;'" id="nextStepButton">
                        {{newUser ? (newUserButtonText || 'Create Account') : 'Sign In'}}
                        <q-icon name="fa-caret-right" style="margin-left: 1rem;" />
                    </q-btn>
                </div>
                
                <socialSignIn @socialSignInSuccess="afterSignInUp" :signUpBackgroundColor="signUpBackgroundColor" :noredirect="noredirect" />
            </div>
        </div>
        
        <div v-if="showCompleteSignUp">
            <div v-if="completeSignUpComponentData" class="row" style="padding: 1rem;"> <!--bottom part - pymt info -->
                <div class="col-12">
                    <p class="smallHead">{{completeSignUpComponentData.header}}</p>
                    <p v-if="completeSignUpComponentData.description" style="margin-top: 1rem;">
                        {{completeSignUpComponentData.description}}
                    </p>
                </div>
                
                <div class="col-12" style="margin-top: 1rem;">
                    <div :is="completeSignUpComponentData.componentName" :componentData="completeSignUpComponentData" :buttonColor="buttonColor" @componentLoaded="completeSignUpComponentLoaded()" :noToast="completeSignUpComponentData.noToast" />
                </div>
            </div>
        </div>
      
    </div>
      
</template>

<script>
    import { authentication } from '../../../mixins/authentication'
    import CreditCardForm from '../shop/checkout/CreditCardForm.vue'
    import ActivateForm from '../shop/checkout/ActivateForm.vue'
    import AutoActivation from '../shop/checkout/AutoActivation.vue'
    import socialSignIn from '../auth/socialSignIn.vue'
    
    export default {
        props: ['productIDsToCheck', 'newUserButtonText', 'offerProductID', 'completeSignUpComponent', 'completeSignUpComponentData', 'subscribeRoute', 'subscribeLabel', 'signUpBackgroundColor', 'buttonColor', 'giftCheckout'],
        
        components: {
            CreditCardForm,
            ActivateForm,
            AutoActivation,
            socialSignIn
        },

        data() {
            return {
                userEmail: '',
                userPassword: '',
                newUser: true,
                noredirect: true,
                
                showCompleteSignUp: false,
                needToCheckIfUserOwnsProduct: false,
                subscribeToNewsletter: true,
                
                fieldError: {
                    userEmail: false,
                    userPassword: false
                },
                
                inCart(productID) {
                    var inCart = false
                    if (this.cart.length) this.cart.forEach((item) => {
                        if (item.productID == productID && !item.recipientName) {
                            inCart = true
                        }
                    })
                    // if (product.recipientName) inCart = false
                    return inCart
                },
            }
        },
        
        mixins: [ authentication ],

        computed: {
            environmentProducts() {
                return this.$root.$store.state.environmentProducts
            },
            
            cart() {
                return this.$root.$store.state.cart
            },
            
            userLoginToken() {
                return this.$root.$store.state.user.userLoginToken
            },
            
            windowWidth() {
                return this.$root.$store.state.windowWidth
            },
            
            userOwnsProduct() {
                return this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', this.offerProductID).userActiveProduct
            },
            
            initialParameters() {
                return this.$root.$store.state.initialParameters
            },
            
            userInfo() {
                return this.$store.state.user.info
            }
        },

        methods: {
            checkEmail(cb) {
                if (!this.userEmail) {
                    this.fieldError.userEmail = true
                    this.newUser = false
                } else {
                    this.sendEmailToAPI((res) => {
                        kw('send email to api: ', res)
                        if (res.success) { // they are found
                            // this.completeSignUpComponentData.firstName = res.body[0].firstName
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
                
                // now have environmentProducts
                this.$q.loading.hide()
                
                // k('~~~ ', this.offerProductID, this.environmentProducts, this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', this.offerProductID))
                 
                if (this.productIDsToCheck && this.userHasAccess(this.productIDsToCheck) && !this.giftCheckout) {
                    kw('user has access')   

                    this.$emit('userHasAccess')
                } else {
                    k('user needs to checkout')
                    this.showCompleteSignUp = true 
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
                var product = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(this.offerProductID))
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
            
            // userTappedFacebookLogin() {
            //     this.fbLogin((res) => {
            //         if (res) {
            //             this.userFound(res)
                        
            //             this.$q.loading.show()
            //             this.afterSignInUp()
            //         }
            //     })  
            // },
            
            // userTappedGoogleLogin() {
            //     this.googleLogin((res) => {
            //         if (res) {
            //             this.userFound(res)
                        
            //             this.$q.loading.show()
            //             this.afterSignInUp()
            //         }
            //     })
            // },
            
            nextStep() {
                if (!this.userEmail || !this.userPassword) {
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
                        this.registerNewUser((res) => {
                            if (!res.success) {
                                this.$q.notify({
                                   message: res.errorCode,
                                   type: 'negative',
                                   icon: 'fa-exclamation-circle',
                                   position: 'bottom-left'
                                })
                            } else {
                                this.afterSignInUp()
                            }
                        })
                    } else {
                        this.signUserIn((res) => {
                            kw('signUserIn res: ', res)
                            if (!res.authenticated) {
                                this.$q.loading.hide()
                                
                                this.showBadPasswordDialog((res) => {
                                    k('res from dialog', res)
                                    switch (res) {
                                        case 'tryAgain':
                                            this.userPassword = ''
                                            break
                                        case 'resetPassword':
                                            this.resetPassword()
                                            break
                                    }
                                })
                            } else { // email & password is good
                                this.afterSignInUp()
                            }
                        })
                    }
                })
            },
            
            afterSignInUp() {
                k('afterSignInUp!')
                
                this.$q.loading.show()
                
                this.needToCheckIfUserOwnsProduct = true
                                
                k('environmentProducts: ', this.environmentProducts)
                
                if (this.environmentProducts) {
                    this.checkIfUserOwnsProduct()
                }  
            },
            
            resetPassword() {
                this.sendRequestPasswordChangeToAPI((res) => {
                    if (res.success) {
                        this.informUserPasswordResetHasBeenSent()
                    }
                    else {
                        var resStr = 'Sorry we could not reset your password. Please try again later or contact support.'
                        if (res.message) {
                            if (res.message === 'noUserEmailFound') resStr = 'This email was not found in our system. Please check that the email is correct.'
                        }
                        this.$q.notify({
                           message: resStr,
                           type: 'negative',
                           icon: 'fa-exclamation-circle',
                           position: 'bottom-left'
                        })
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
                this.$q.loading.show()
                
                if (this.environmentProducts) {
                    this.checkIfUserOwnsProduct()
                } else {
                    this.needToCheckIfUserOwnsProduct = true
                }
            }
            
            if (!this.initialParameters.payPalReturnCode && !this.giftCheckout) this.$store.commit('clearCart')
        },

        mounted() {
            k('mounted signUpOffer old')
            
            if (this.initialParameters.email) {
                this.userEmail = decodeURIComponent(this.initialParameters.email)
                // k('input: ', document.getElementsByName("userPassword")[0])
                this.checkEmail(() => {})
                document.getElementsByName("userPassword")[0].focus()
                
                delete this.initialParameters.email
                this.$store.commit('initialParameters', this.initialParameters)
            }
        },
        
        watch: {
            environmentProducts() {
                k('watch environmentProducts! ', this.environmentProducts)
                
                if (this.environmentProducts && this.needToCheckIfUserOwnsProduct) this.checkIfUserOwnsProduct()
            }
        }
    }
</script>

<style>
    .smallHead {
        /*font-family: 'Montserrat', 'sans-serif';*/
        font-size: 1.2rem;
        margin: 0;
    }
</style>
