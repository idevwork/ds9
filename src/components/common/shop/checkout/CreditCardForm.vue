<template>

    <div>
        <div v-if="componentData.showCodeFields" class="relative-position" style="margin: 0 0 1rem 0;">

            <q-inner-loading :visible="paypalLoad" />

            <div class="row">
                <!--<div class="col-sm-12 col-md-6" style="padding: 0 .5rem 0 0;">-->
                <div class="col-sm-12">
                    <q-input
                        id="promoCode"
                        hide-underline
                        :class="[{'rounded': roundedDesign}, 'inputBox']"
                        color="grey"
                        @input="!promoCodeText.length ? resetPromoCode() : ''"
                        float-label="Promo Code"
                        v-model="promoCodeText"
                        @keyup.enter="applyPromoCode()"
                        :before="promoCodeBefore()"
                    />
                    <q-btn id="applyPromoCodeBtn" color="green" class="full-width" @click="applyPromoCode()" :style="(buttonColor || brandColor) ? 'background: ' + (buttonColor || brandColor) + ' !important;' : ''">
                        <h6 class="thickHeader">Apply</h6>
                        <q-icon name="fa-caret-right" style="font-size: 1.3rem; margin-left: .5rem;" />
                    </q-btn>
                </div>

                <!--<div class="col-sm-12 col-md-6" style="padding: 0 0 0 .5rem;">-->
                <!--    <q-input -->
                <!--        id="giftCard" -->
                <!--        class="inputBox" -->
                <!--        color="grey" -->
                <!--        float-label="Gift Code" -->
                <!--        v-model="giftCardText" -->
                <!--        @keyup.enter="applyGiftCard()" -->
                <!--        :before="giftCardBefore()" -->
                <!--    />-->
                <!--    <q-btn size="sm" color="green" class="full-width" @click="applyGiftCard()">-->
                <!--        <h6 class="thickHeader">Apply</h6>-->
                <!--    </q-btn>-->
                <!--</div>-->
            </div>
        </div>

        <div v-if="componentData.showCodeFields && componentData.productInfo" style="margin: 1.5rem 0;">
            <h6 v-if="promoCode" align="center" class="text-green" style="margin: .5rem 0;">CODE ACCEPTED</h6>

            <hr v-if="promoCode" />

            <div v-if="componentData.productInfo">
                <p style="clear: both;">
                    {{componentData.productInfo.productName}}
                    <span class="float-right">{{numeral(componentData.productInfo.productPrice).format('$0.00')}}</span>
                </p>
                <p v-if="promoCode" style="clear: both;">
                    <strong>
                        VIP access code:
                        <span id="originalCartTotal" class="float-right" v-if="originalCartTotal && originalCartTotal > cartTotal">
                            -{{numeral(componentData.productInfo.productPrice - cartTotal).format('$0.00')}}
                        </span>
                    </strong>
                </p>
                <p style="clear: both;">
                    <strong>
                        Total:
                        <span class="float-right">{{numeral(cartTotal).format('$0.00')}}</span>
                    </strong>
                </p>
            </div>

        </div>

        <q-card class="bg-grey-3 relative-position" style="margin: 0;">

            <q-inner-loading :visible="paypalLoad" />

            <q-card-main class="row">
                <div class="col-6">
                    <h5 align="left">
                        <q-icon name="fa-credit-card" style="font-size: 1.5rem; vertical-align: middle;" /> Card
                    </h5>
                </div>

                <div class="col-6">
                    <q-btn :disabled="paypalLoad" :class="[{'rounded': roundedDesign}, 'float-right', 'monty']" color="yellow-8" @click="initPayPalPurchase()" :style="(buttonColor || brandColor) ? 'background: ' + (buttonColor || brandColor) + ' !important;' : ''">
                        <q-icon name="fab fa-paypal" />
                        <span class="gt-xs">Use PayPal</span>
                        <q-icon name="fa-caret-right" />
                    </q-btn>
                </div>

                <div class="col-12">
                    <p style="margin: 1.5rem 0 0 0; font-size: .9rem;" v-if="subscriptionProductInCart && cartTotal === 0">We ask for payment information so your subscription can continue without interruption at the end of your trial period. An authorization for $1 will appear on your account, but you will not be charged anything during the initial time period. You can easily cancel anytime by clicking “account” in the top bar.</p>
                </div>
            </q-card-main>

            <q-card-main style="padding: .5rem;" align="left">

                <div v-if="componentData.showFirstAndLastNameFields" class="row sm-gutter">
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            v-model="componentData.firstName"
                            type="text"
                            :attributes="{autocompletetype: 'given-name', autocorrect: 'off'}"
                            float-label="first name"
                            hide-underline
                            :class="[{'rounded': roundedDesign}, 'inputBox']"
                            color="grey-7"
                            :disabled="paypalLoad"
                            v-mask="'SSSSSSSSSSSSSSSSSSSSSSSSSSSSS'"
                        />
                    </div>

                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-input
                            v-model="componentData.lastName"
                            type="text"
                            :attributes="{autocompletetype: 'family-name', autocorrect: 'off'}"
                            float-label="last name"
                            hide-underline
                            :class="[{'rounded': roundedDesign}, 'inputBox']"
                            color="grey-7"
                            :disabled="paypalLoad"
                            v-mask="'SSSSSSSSSSSSSSSSSSSSSSSSSSSSS'"
                        />
                    </div>
                </div>

                <q-field
                    :error="cardDetailError.number"
                    error-label="Please enter a valid card number."
                    style="padding: 0 .5rem;"
                >
                    <q-input
                        v-model="cardDetail.number"
                        type="number"
                        :attributes="{autocompletetype: 'cc-number', autocorrect: 'off'}"
                        float-label="Card #"
                        hide-underline
                        :class="[{'rounded': roundedDesign}, 'inputBox']"
                        color="grey-7"
                        :disabled="paypalLoad"
                        @input="cardDetailError.number = false, creditCardAPIError = false"
                        v-mask="'###################'"
                    />
                </q-field>

                <p v-if="creditCardAPIError" style="margin: 0; color: red; padding: 0 .5rem;">We were unable to process this credit card number. Could you enter the number again?</p>

                <div class="row">
                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-field
                            :error="cardDetailError.expiry"
                            error-label="Please enter a valid expiration."
                        >
                            <q-input
                                v-model="cardDetail.expiry"
                                float-label="Expires (mm/yy)"
                                hide-underline
                                :class="[{'rounded': roundedDesign}, 'inputBox']"
                                :attributes="{autocompletetype: 'cc-exp', autocorrect: 'off'}"
                                color="grey-7"
                                @input="cardDetailError.expiry = false, creditCardExpired = false"
                                v-mask="'##/##'"
                                :disabled="paypalLoad"
                            />
                        </q-field>
                    </div>

                    <div class="col-md-6" style="padding: 0 .5rem;">
                        <q-field
                            :error="cardDetailError.cvc"
                            error-label="Please enter a valid cvc."
                        >
                            <q-input
                                v-model="cardDetail.cvc"
                                float-label="CVC"
                                hide-underline
                                :class="[{'rounded': roundedDesign}, 'inputBox']"
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

                <div style="padding: .5rem;">
                    <q-btn :disabled="paypalLoad" size="lg" @click="initPurchase()" color="green" :class="[{'rounded': roundedDesign}, 'full-width', 'monty']" :style="(buttonColor || brandColor) ? 'background: ' + (buttonColor || brandColor) + ' !important;' : ''">
                        {{ componentData.submitButtonLabel }}
                        <!--<q-icon name="fa-caret-right" style="font-size: 1.5rem; margin-left: .5rem;" />-->
                    </q-btn>
                </div>

            </q-card-main>
        </q-card>
    </div>
</template>

<script>
    import { purchaseAndActivation } from '../../../../mixins/purchaseAndActivation'

    export default {
        props: ['componentData', 'buttonColor', 'noToast'],

        mixins: [purchaseAndActivation],

        computed: {
            roundedDesign() {
                return this.environmentJSON.e.noRoundedDesign ? false : true
            }
        },

        // watch: {
        //     componentData: {
        //         handler(val, oldVal) {
        //             k('componentData update: ', val.promoCodeText, oldVal.promoCodeText)
        //             if (val.promoCodeText && val.promoCodeText !== oldVal.promoCodeText) this.applyPromoCode()
        //         },
        //         deep: true
        //     }
        // },

        created() {
            if (this.componentData && this.componentData.promoCodeText) {
                this.promoCodeText = this.componentData.promoCodeText
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.coupon', value: this.componentData.promoCodeText })
            }

            this.$emit('componentLoaded')
            kw("CART: ", this.cart)

            this.initCheckoutPage()
        }
    }
</script>

<style>

</style>