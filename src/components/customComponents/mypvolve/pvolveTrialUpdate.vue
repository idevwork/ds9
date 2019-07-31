<template>
    
    <div class="row" :style="'max-width: 1200px; margin: 0 auto;' + (windowWidth > 767 ? 'padding: 1rem;' : '')"> <!--under header -->

        <div class="col-sm-12 col-lg-6" style="padding: 1rem;"> <!--left block -->

            <div style="padding: .5rem;">
                <!--<h2>Update Your Subscription</h2>-->
                <h6 style="color: #444; line-height: 1.3rem; text-transform: unset;">Enter your payment details to subscribe now. But don't worry, your subscription won't start until after your current access ends, we got you:</h6>
            </div>
            
            <q-inner-loading :visible="updateLoad" style="z-index: 1;" />
            
            <div class="col-12 monty" style="padding: .5rem; font-size: .8rem; color: #545454;">
                We ask for payment information so your subscription can continue without interruption at the end of your access period. An authorization for $1 will appear on your account, but you will not be charged anything during the initial time period. You can easily cancel anytime by clicking “account” in the top bar.
            </div>
            
            <div class="bg-grey-3" style="padding: 1rem; margin: 1rem 0;">
                <CreditCardFields 
                    :submitButtonLabel="'Subscribe'" 
                    :buttonColor="pvolveMintBG"
                    
                    :paypalButtonColor="pvolveSalmon"
                    @newCardDetails="setCardDetails" 
                    @submitPayment="updateSubscription" 
                    @userSelectedPaypal="userSelectedPaypal"
                />
            </div>
        </div>
        
        <div class="col-sm-12 col-lg-6" style="padding: 1rem;"> <!--right block -->
            
            <h1 class="monty thinHeader text-grey-7" style="letter-spacing: -2px; font-size: 2.3rem;">
                UNATTAINABLE DEFINITION & TONE
                <span class="monty thickHeader" :style="'color: ' + pvolveSalmon + ';'">
                    — UNTIL NOW
                </span>
            </h1>
            
            <div class="monty" style="color: #777; line-height: 2rem; margin-top: 1rem;">
                <p style="font-size: 1rem;">Don't miss out on the workouts trusted by Victoria’s Secret™ models - INSTANTLY ACCESS all of P's workouts for a lifted booty, defined inner/outer thighs and whole body lengthening and tone.</p>
                <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Unlimited access to all streaming workouts</p>
                <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Stream on any device</p>
                <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />New weekly workouts</p>
                <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />The ability to set up workout goals and track your progress</p>
                <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Weekly progress reports</p>
                <p><q-icon name="fa-caret-right" :style="'color: ' + pvolveSalmon + '; font-size: 2rem; margin-right: .5rem;'" />Custom workout reminders</p>
            </div>
            
            <div :style="'border-left: 10px solid ' + pvolveSalmon + '; padding: 1rem 3rem 1rem 2rem;'">
                <h4 class="thinHeader" :style="'margin-top: 0; letter-spacing: -1px; line-height: 2rem; color: ' + pvolveSalmon + ';'">"... after just a few weeks of training, <span class="thickHeader">butts begin to lift, biceps take form, and abdomen grooves appear"</span></h4>
                <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/ELLE_Magazine_Logo.svg" style="width: 7rem;" />
            </div>
        </div>
        
        <q-modal 
            v-model="showTrialUpdateSuccessModal"
            :content-css="{width: '460px', height: '350px'}"
        >   
            <q-modal-layout style="background: linear-gradient(#fff, #fff1eb);">
                <div>
                    <q-btn @click="showTrialUpdateSuccessModal = false" class="float-right" flat round>
                        <q-icon name="fa-times" :style="`color: ${pvolveSalmon};`" />
                    </q-btn>
                </div>
                
                <div class="monty" style="padding: 1rem; clear: both;" align="center">
                    <h1 :style="`text-transform: unset; color: ${pvolveSalmon};`">Thank you!</h1>
                    <p style="margin: 1rem 0; color: #666;">Your current access will continue for <span :style="`color: ${pvolveSalmon};`">{{trialDaysLeft}} day{{trialDaysLeft === 1 ? '' : 's'}}</span> and then your new subscription will begin.</p>
                    
                    <div align="center" style="padding: 1rem 0;">
                        <q-btn @click="showTrialUpdateSuccessModal = false, route('/me')" size="lg" :style="`background: ${pvolveSalmon}; color: #fff;`">
                            <h6 class="thickHeader">
                                OK
                                <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                            </h6>
                        </q-btn>
                    </div>
                </div>
            </q-modal-layout>
        </q-modal>
        
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import CreditCardFields from '../../../components/common/shop/checkout/CreditCardFields'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { purchaseAndActivation } from '../../../mixins/purchaseAndActivation'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    
    export default {
        data() {
            return {
                updateLoad: false,
                
                subscriptionProductID: 148014,
                showTrialUpdateSuccessModal: false,
                disableCheckSavedCard: true,
                
                cardDetail: {
                    number: '',
                    name: '',
                    expiry: '',
                    cvc: ''
                },
            }
        },
        
        mixins: [pvolveColors, globalComputedData, purchaseAndActivation, userAndProductInfo],
        
        components: {
            CreditCardFields
        },
        
        computed: {
            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory && this.$store.state.userSubscriptionProductStatusHistory.length ? this.$store.state.userSubscriptionProductStatusHistory[0] : ''
            },
            
            expiry() {
                return this.cardDetail.expiry.replace(/ /g, '')
            },
            
            expiryMonth() {
                return this.expiry.split('/')[0].length === 1 ? '0' + this.expiry.split('/')[0] : this.expiry.split('/')[0]  
            },
            
            expiryYear() {
                return '20' + this.expiry.split('/')[1]
            },
            
            trialDaysLeft() {
                let daysLeft = 0
                if (this.userSubscriptionProductStatusHistory) {
                    
                    let endDateUnix = null
                    if (this.userSubscriptionProductStatusHistory.accessStatus === 'subscriptionAccess') {
                        endDateUnix = this.moment(this.userSubscriptionProductStatusHistory.nextBillingDate).format('x')
                    } 
                    if (this.userSubscriptionProductStatusHistory.accessStatus === 'rentalAccess') {
                        endDateUnix = this.moment(this.userSubscriptionProductStatusHistory.endDateTime).format('x')
                    }
                    
                    let currentUnix = this.moment().format('x')
                    
                    // test trial ended with current trial user
                    // daysLeft = ((currentUnix - endDateUnix) / 1000 / 60 / 60 / 24).toFixed(0)
                    
                    var dayCalc = Math.floor(((endDateUnix - currentUnix) / 1000 / 60 / 60 / 24)).toFixed(0)
                    daysLeft = dayCalc > 0 ? dayCalc : 0
                    k('trialDaysLeft: ', this.userSubscriptionProductStatusHistory, endDateUnix, currentUnix, daysLeft)
                }
                return daysLeft
            }
    
        },
    
        methods: {
            
            setCardDetails(data) {
                k('setCardDetails: ', data)
                this.cardDetail = data
            },
            
            userSelectedPaypal() {
                k('userSelectedPaypal')
                
                // add monthly product to cart
                let product = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', this.subscriptionProductID)
                if (!this.inCart(product)) this.$store.commit('add2cart', product)
                this.promoCodeText = 'rentalUpgrade2Subscription'
                
                this.initPayPalPurchase()
            },
            
            updateSubscription() {
                this.updateLoad = true
                
                let req = {
                	userLoginToken: this.userLoginToken,
                	creditCard: this.cardDetail.number,
                    expirationMonth: this.expiryMonth,
                    expirationYear: this.expiryYear,
                    cvv: this.cardDetail.cvc,
                    environment: this.environmentName,
                    rentalProductID: this.userSubscriptionProductStatusHistory.productID
                }
                
                this.sendSubscriptionUpdateToAPI(req, (res) => {
                    this.updateLoad = false
                    
                    if (res.success) {
                        this.successfulSubscriptionUpdate()
                    }
                })
            },
            
            completePayPalSubscriptionUpdate() {
                this.updateLoad = true
                        
                let req = {
                	userLoginToken: this.userLoginToken,
                	payPalToken: this.initialParameters.token,
                	payerID: this.initialParameters.PayerID,
                    environment: this.environmentName,
                    rentalProductID: this.userSubscriptionProductStatusHistory.productID
                }
                
                // finish paypal trial update
                this.sendSubscriptionUpdateToAPI(req, (res) => {
                    this.updateLoad = false
                    
                    if (res.success) {
                        this.successfulSubscriptionUpdate()
                    }
                })
            },
            
            successfulSubscriptionUpdate() {
                // this.getUserSubscriptionProductStatusHistory()
                
                // thank you!
                // show nice message including when the user will be charged
                this.showTrialUpdateSuccessModal = true
                
                this.removeURLParams()
            },
            
            sendSubscriptionUpdateToAPI(req, cb) {
                k('sendSubscriptionUpdateToAPI req: ', req)
                
                this.api.post(this.api.apiv4Route + 'api/shop/upgradeRental2Subscription4User', req, (res) => {
                    k('sendSubscriptionUpdateToAPI res: ', res)
                    cb(res)
                })
            }
        },
        
        watch: {
            userSubscriptionProductStatusHistory() {
                if (this.authenticated && this.initialParameters.payPalReturnCode) {
                    k('returning from paypal and now have userSubscriptionProductStatusHistory: ', this.initialParameters.payPalReturnCode, this.userSubscriptionProductStatusHistory)
    
                    if (this.initialParameters.payPalReturnCode == 1) {
                        if (this.userSubscriptionProductStatusHistory) this.completePayPalSubscriptionUpdate()
                    }
                }
            }
        },
        
        created() {
            if (!this.authenticated) {
                this.route('/')
            } else {
                this.$store.commit('clearCart')
                
                if (this.initialParameters.payPalReturnCode) {
                    k('returning from paypal: ', this.initialParameters.payPalReturnCode)
    
                    if (this.initialParameters.payPalReturnCode == 1) {
                        if (this.userSubscriptionProductStatusHistory) this.completePayPalSubscriptionUpdate()
                    }
                }
            }
            
        },
    
    }
</script>

<style>
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
    
</style>
