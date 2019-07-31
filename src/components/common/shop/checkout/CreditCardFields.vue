<template>
    
    <div>
        <q-inner-loading :visible="paypalLoad" />
            
        <div v-if="!hidePaypal" class="row">
            <div class="col-6" align="left">
                <h5 style="color: #333;">
                    Use Card:
                </h5>
            </div>
            
            <div class="col-6" align="left">
                <q-btn outline :disabled="paypalLoad" class="float-right monty" @click="usePaypal()" style="background: #fff !important; color: #333;">
                    <q-icon color="blue" name="fab fa-paypal" /> 
                    <span class="gt-xs" style="color: #333; font-size: .8rem; letter-spacing: 1px;">Use PayPal</span>
                    <q-icon name="fas fa-chevron-right" style="font-size: .8rem;" /> 
                </q-btn>
            </div>
            
        </div>
        
        <div style="padding: .5rem; margin: 0 -1rem;">
        
            <div v-if="cardIsSaved" align="left" style="padding: 1rem;">
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
            
            <div v-else align="left">
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
                
                <div v-if="!hideSaveInfo" style="padding: .5rem;">
                    <q-checkbox v-model="saveCard" class="monty" color="teal" label="Securely save my info for next time" style="margin: 0; font-size: .9rem;" />
                </div>
            </div>
            
            <div style="padding: .5rem;">
                <q-btn outline :disabled="paypalLoad" @click="submitPaymentDetails()" size="lg" class="monty" :style="buttonColor ? `background: ${buttonColor} !important; color: #fff;'` : `background: #fff !important; color: #333;`">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">{{ submitButtonLabel }}</h6>
                </q-btn>
            </div>
        </div>
        
    </div>
</template>

<script>
    import { purchaseAndActivation } from '../../../../mixins/purchaseAndActivation'
    
    export default {
        props: ['submitButtonLabel', 'buttonColor', 'hidePaypal', 'hideSaveInfo', 'paypalButtonColor'],
        
        mixins: [purchaseAndActivation],
        
        watch: {
            cardDetail: {
                handler(val, oldVal) {
                    k('cardDetail update: ', val, oldVal)
                    this.$emit('newCardDetails', val)
                },
                deep: true
            }
        },
        
        methods: {
            submitPaymentDetails() {
                if (this.validatePaymentInfo()) {
                    this.$emit('submitPayment')
                }
            },
            
            usePaypal() {
                this.$emit('userSelectedPaypal')
            }
        }
        
        // mounted() {
        //     this.initCheckoutPage()
        //     this.$emit('componentLoaded')
            
        //     if (this.componentData && this.componentData.promoCodeText) {
        //         this.promoCodeText = this.componentData.promoCodeText
        //         this.applyPromoCode()
        //     }
        // }
    }
</script>

<style>
    
</style>