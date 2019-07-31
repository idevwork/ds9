<template>
    
    <div>
        <div v-if="componentData.showCodeFields" style="margin: 0 0 1rem 0;">
        
            <q-inner-loading :visible="paypalLoad" />
            
            <div class="row">
                <div class="col-sm-12">
                    <q-input 
                        id="promoCode" 
                        class="inputBox" 
                        color="grey" 
                        @input="!promoCodeText.length ? resetPromoCode() : ''" 
                        float-label="Promo Code" 
                        v-model="promoCodeText" 
                        @keyup.enter="applyPromoCode()" 
                        :before="promoCodeBefore()" 
                    />
                    <q-btn id="applyPromoCodeBtn" @click="applyPromoCode()" outline style="background: #fff !important; color: #333;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Apply Code</h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="componentData.showCodeFields && componentData.productInfo" style="margin: 1.5rem 0; padding: 0 1rem;">
            <h6 v-if="promoCode" align="center" class="text-green monty" style="margin: 1rem 0;">CODE ACCEPTED</h6>
            
            <div v-if="componentData.productInfo">
                <p class="monty"  style="font-size: .9rem; clear: both;">
                    {{componentData.productInfo.productName}} 
                    <span class="float-right">{{numeral(componentData.productInfo.productPrice).format('$0.00')}}</span>
                </p>
                <p v-if="promoCode" class="monty" style="font-size: .9rem; clear: both;">
                    <strong>
                        VIP access code: 
                        <span id="originalCartTotal" class="float-right" v-if="originalCartTotal && originalCartTotal > cartTotal">
                            -{{numeral(componentData.productInfo.productPrice - cartTotal).format('$0.00')}}
                        </span>
                    </strong>
                </p>
                <p class="monty" style="font-size: .9rem; clear: both;">
                    <strong>
                        Total: 
                        <span class="float-right">{{numeral(cartTotal).format('$0.00')}}</span>
                    </strong>
                </p>
            </div>
            
            <hr /> 

        </div>
        
        <div style="margin: 0;">
            
            <q-inner-loading :visible="paypalLoad" />
            
            <div class="row">
                <div class="col-6">
                    <h5 style="color: #333;">
                        Use Card:
                    </h5>
                </div>
                
                <div class="col-6">
                    <q-btn outline :disabled="paypalLoad" class="float-right monty" @click="initPvolvePurchase(true)" style="background: #fff !important; color: #333;">
                        <q-icon color="blue" name="fab fa-paypal" /> 
                        <span class="gt-xs" style="color: #333; font-size: .8rem; letter-spacing: 1px;">Use PayPal</span>
                        <q-icon name="fas fa-chevron-right" style="font-size: .8rem;" /> 
                    </q-btn>
                </div>
                
            </div>
    
            <div style="padding: .5rem; margin: 0 -1rem;">
                
                <div v-if="componentData.showFirstAndLastNameFields && !cardIsSaved" class="row sm-gutter">
                    <div class="col-sm-12 col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            v-model="componentData.firstName"
                            type="text"
                            :attributes="{autocompletetype: 'given-name', autocorrect: 'off'}"
                            float-label="first name"
                            class="inputBox"
                            color="grey-7"
                            :disabled="paypalLoad"
                            v-mask="'SSSSSSSSSSSSSSSSSSSSSSSSSSSSS'"
                        />
                    </div>
    
                    <div class="col-sm-12 col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            v-model="componentData.lastName"
                            type="text"
                            :attributes="{autocompletetype: 'family-name', autocorrect: 'off'}"
                            float-label="last name"
                            class="inputBox"
                            color="grey-7"
                            :disabled="paypalLoad"
                            v-mask="'SSSSSSSSSSSSSSSSSSSSSSSSSSSSS'"
                        />
                    </div>
                </div>
                
                <div v-if="cardIsSaved" style="padding: 1rem;">
                    <h6 style="text-transform: unset;">Hey, looks like we saved your card info for you.</h6>
                    <h6 style="margin: .5rem 0; text-transform: unset;">Confirm the last four digits are correct and you are good to go:</h6>
                    <div>
                        <h5 style="margin: 1rem 0;">**** **** **** {{lastFour}}</h5>
                    
                        <q-btn size="sm" flat color="red" @click="removeSavedCard()">
                            <q-icon name="fa-times" style="margin-left: 0;" /> 
                            <h6 style="font-size: .9rem;">Forget my card info</h6>
                        </q-btn>
                    </div>
                </div>
                
                <div v-else>
                    <q-field
                        :error="cardDetailError.number"
                        error-label="Please enter a valid card number."
                        style="padding: 0 .5rem;"
                    >
                        <q-input
                            v-model="cardDetail.number"
                            type="number"
                            :attributes="{autocompletetype: 'cc-number', autocorrect: 'off'}"
                            float-label="Credit Card #"
                            class="inputBox"
                            color="grey-7"
                            :disabled="paypalLoad"
                            @input="cardDetailError.number = false, creditCardAPIError = false"
                            v-mask="'###################'"
                        />
                    </q-field>
                    
                    <p v-if="creditCardAPIError" style="margin: 0; color: red; padding: 0 .5rem;">We were unable to process this credit card number. Could you enter the number again?</p>
                    
                    <div class="row">
                        <div class="col-sm-12 col-md-6" style="padding: 0 .5rem;">
                            <q-field
                                :error="cardDetailError.expiry"
                                error-label="Please enter a valid expiration."
                            >
                                <q-input
                                    v-model="cardDetail.expiry"
                                    float-label="Expires (mm/yy)"
                                    class="inputBox"
                                    :attributes="{autocompletetype: 'cc-exp', autocorrect: 'off'}"
                                    color="grey-7"
                                    @input="cardDetailError.expiry = false, creditCardExpired = false"
                                    v-mask="'##/##'"
                                    :disabled="paypalLoad"
                                />
                            </q-field>
                        </div>
        
                        <div class="col-sm-12 col-md-6" style="padding: 0 .5rem;">
                            <q-field
                                :error="cardDetailError.cvc"
                                error-label="Please enter a valid cvc."
                            >
                                <q-input
                                    v-model="cardDetail.cvc"
                                    float-label="CVC Code"
                                    class="inputBox"
                                    :attributes="{autocompletetype: 'cc-csc', autocorrect: 'off'}"
                                    color="grey-7"
                                    @input="cardDetailError.cvc = false"
                                    :disabled="paypalLoad"
                                    v-mask="'####'"
                                />
                            </q-field>
                        </div>
                    </div>
                    
                    <p v-if="creditCardExpired" style="margin: 0; color: red; padding: 0 .5rem;">This is not a valid expiration. Can you check your expiration date and try again?</p>
                    
                    <!--<div style="padding: .5rem;">-->
                    <!--    <q-checkbox v-model="saveCard" class="monty" color="teal" label="Securely save my info for next time" style="margin: 0; font-size: .9rem;" />-->
                    <!--</div>-->
                </div>
                
                <div class="row cursor-pointer">
                    <div class="col-1" align="center">
                        <q-checkbox color="#000" v-model="generalTermsOfServiceAcceptance" />
                    </div>
                    <div class="col-11" style="font-size: 13px; margin-top: 5px;">
                        <h6>
                            <span @click="generalTermsOfServiceAcceptance = !generalTermsOfServiceAcceptance">
                                I have read and agree to the
                            </span>
                            <span :style="{ color: termsOfServiceTextColor }" @click="navigateToTermsOfService()"> 
                                terms of service
                            </span>
                        </h6>
                    </div>
                </div>
                
                <div :class="['q-py-sm', { 'rounded': roundedDesign }, 'error-field-color']" align="center" v-if="termsOfServiceErrorMessage">
                    {{ termsOfServiceErrorMessage }}
                </div>
                
                <div class="q-mt-md" style="padding: .5rem;">
                    <q-btn outline :disabled="paypalLoad" @click="initPvolvePurchase()" class="monty" style="background: #fff !important; color: #333;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">{{ componentData.submitButtonLabel }}</h6>
                    </q-btn>
                </div>
                
            </div>
            
            <p class="monty" style="margin: 1.5rem 0 0 0; font-size: .8rem; color: #545454;" v-if="!componentData.forceHideAuthMessage && subscriptionProductInCart && cartTotal === 0">An authorization for $1 will appear on your account, but you will not be charged anything during the initial trial period.</p>
        </div>
    </div>
</template>

<script>
    import { purchaseAndActivation } from '../../../mixins/purchaseAndActivation'
    
    export default {
        props: ['componentData', 'buttonColor', 'noToast'],
        
        mixins: [purchaseAndActivation],
        
        data() {
            return {
                disableCheckSavedCard: true,
                generalTermsOfServiceAcceptance: false,
                termsOfServiceErrorMessage: ''
            }
        },
        
        computed: {
            stopThankYouPageRedirect() {
                return this.componentData.stopThankYouPageRedirect
            },
    
            termsOfService() {
                return this.$store.state.environment.json.e.termsOfService
            },
            
            termsOfServiceTextColor() {
                if (this.termsOfService && this.termsOfService.textColor) {
                    return this.termsOfService.textColor
                } else {
                    return this.brandColor
                }
            }
        },
        
        methods: {
            initPvolvePurchase(userClickedPayPal = false) {
                this.termsOfServiceErrorMessage = ''
                k('pvolve purchase! ', this.componentData)
                
                if (!this.generalTermsOfServiceAcceptance) {
                    this.termsOfServiceErrorMessage = 'Please agree to our terms of service to sign up'
                    return false
                }
                
                if (userClickedPayPal) {
                    this.initPayPalPurchase()
                } else {
                    if (!this.componentData.customPurchaseAction) {
                        this.initPurchase()      
                    } else {
                        this.updateUserInfoIfNecessary()
                        
                        if (this.validatePaymentInfo()) this.$root.$emit(this.componentData.customPurchaseAction, {
                            creditCard: this.cardDetail.number,
                            expirationMonth: this.expiryMonth,
                            expirationYear: this.expiryYear,
                            securityCode: this.cardDetail.cvc,
                            saveCreditCard: this.saveCard
                        })
                    }
                }
            },
            
            navigateToTermsOfService() {
                if (this.termsOfService && this.termsOfService.url) {
                    window.open(this.termsOfService.url, '_blank')
                } else {
                    this.route(this.termsOfService.route)
                }
            }
        },
        
        mounted() {
            k('pvolve credit card form: ', this.componentData)
            
            this.initCheckoutPage()
            this.$emit('componentLoaded')
            
            if (this.componentData && this.componentData.promoCodeText) {
                this.promoCodeText = this.componentData.promoCodeText
                this.applyPromoCode()
            }
        }
    }
</script>

<style>
    
</style>