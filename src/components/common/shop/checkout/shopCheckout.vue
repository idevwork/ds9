<template>

    <div class="bg-grey-3" :style="calculateDivHeight">

        <div class="well relative-position">
            <q-inner-loading :visible="paypalLoad" />

            <div class="row">

                <div class="col-sm-12 col-md-7 q-pa-md">
                    <div class="row full-width q-py-md">
                        <div class="col-6">
                            <h5>
                                <q-icon name="fa-lock" style="font-size: 1.3rem; margin-right: .5rem;" /> Secured Checkout
                            </h5>
                        </div>

                        <div class="col-6" align="right">
                            <!-- TODO: confirm if route is correct-->
                            <q-btn icon="fa-arrow-left" @click="route('/')" label="Continue Shopping" class="capitalize" flat :style="`padding: .5rem; color: ${environmentJSON.e.brandColor ? environmentJSON.e.brandColor : '#000'};`" />
                        </div>
                    </div>

                    <div v-if="authenticated" class="bg-white row full-width q-pa-md">
                        <div class="col-sm-3 col-md-3 text-bold text-grey-9">E-MAIL</div>
                        <div class="col-sm-5 col-md-5">{{ userInfo.userEmail }}</div>
                        <div class="col-sm col-md" align="right">
                            <div @click="signout()" class="text-blue cursor-pointer">Not You?</div>
                        </div>
                    </div>

                    <span class="text-bold q-py-md block">REVIEW ORDER</span>

                    <div :style="(windowWidth > 768 ? 'max-height: 80vh; overflow: auto;' : '')">

                        <div v-if="giftCard && giftCard.giftCardAmtApplied" style="margin-top: 1rem;">
                            <q-item class="bg-grey-3" style="padding: 1rem;">
                                <q-item-side>
                                    <q-icon name="fa-gift" color="orange" class="big-icon" />
                                </q-item-side>
                                <q-item-main>
                                    <!--<h6 style="font-size: .8rem;">'{{giftCardText}}' current balance:</h6>-->
                                    <!--<hr />-->
                                    <h6 style="font-size: .8rem;">Amount Applied:</h6>
                                    <hr />
                                    <h6 style="font-size: .8rem;">Remaining gift card balance after purchase:</h6>
                                </q-item-main>
                                <q-item-side align="right">
                                    <!--<h6 style="font-size: .8rem;"><span class="pchip">{{numeral(giftCard.giftCardAmount).format('$0.00')}}</span></h6>-->
                                    <h6 style="font-size: .8rem;"><span class="pchip">{{numeral(giftCard.giftCardAmtApplied).format('$0.00')}}</span></h6>
                                    <h6 style="margin-top: 1rem; font-size: .8rem;"><span class="pchip">{{numeral(giftCard.giftCardBalance - giftCard.giftCardAmtApplied).format('$0.00')}}</span></h6>
                                </q-item-side>
                            </q-item>
                        </div>

                    </div>

                    <shopCart background-color="transparent" />

                    <div
                        id="cartPrice"
                        :class="[{'showingOriginalCartTotal': originalCartTotal && originalCartTotal > cartTotal ? true : false }, 'q-pa-sm', 'full-width']"
                        align="right"
                        style="margin: 0; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;"
                    >
                        <div class="q-headline text-bold text-grey-9" detail :style="`font-size: ${adaptiveFontSize(1.1)}rem; ${windowWidth > 576 ? `margin-right: 10%;` : ``}`">
                            Total:

                            <span id="originalCartTotal" v-if="originalCartTotal && originalCartTotal > cartTotal" style="color: red; text-decoration: line-through; padding-right: .5rem;">
                                {{originalCartTotal && originalCartTotal > cartTotal ? numeral(originalCartTotal).format('$0.00') : ''}}
                            </span>

                            <span>
                                {{cartTotal ? numeral(cartTotal).format('$0.00') : (giftCard ? '$0.00' : 'FREE')}}
                            </span>
                        </div>
                    </div>

                </div>

                <div v-if="!authenticated" class="col-sm-12 col-md-5 q-pa-md">
                    <div id="signinHold">
                        <Signin :noredirect="true" :signInBackgroundColor="'#fff'" />
                    </div>
                </div>

                <div v-else class="col-sm-12 col-md-5 q-py-md">
                    <q-card v-if="cartTotal || (!cartTotal && promoCode) || (!cartTotal && giftCard)" :class="{'rounded': roundedDesign}" :style="shopCheckoutBackgroundColor">
                        <q-card-title>
                            <h5 class="no-margin" :style="cardDetailsTextColor">Codes</h5>
                        </q-card-title>

                        <q-card-main>
                            <q-input
                                id="promoCode"
                                :class="[{'rounded': roundedDesign}, 'inputBox']"
                                hide-underline
                                color="grey"
                                @input="!promoCodeText.length ? resetPromoCode() : ''"
                                float-label="Promo Code"
                                v-model="promoCodeText"
                                @keyup.enter="applyPromoCode()"
                                :before="promoCodeBefore()"
                            />
                            <q-btn id="applyPromoCodeBtn" v-if="promoCodeText" size="md" :class="[{'roundedButton': roundedDesign}, 'full-width', 'text-white']" :style="cardDetailsButtonColor" @click="applyPromoCode()">
                                <h6 class="thickHeader">Apply</h6>
                            </q-btn>

                            <q-input
                                id="giftCard"
                                :class="[{'rounded': roundedDesign}, 'inputBox']"
                                hide-underline
                                color="grey"
                                float-label="Gift Code"
                                v-model="giftCardText"
                                @keyup.enter="applyGiftCard()"
                                :before="giftCardBefore()"
                                style="margin-top: 1rem;"
                            />
                            <q-btn v-if="giftCardText" size="md" @click="applyGiftCard()" :class="[{'roundedButton': roundedDesign}, 'full-width', 'text-white']"  :style="cardDetailsButtonColor">
                                <h6 class="thickHeader">Apply</h6>
                            </q-btn>
                        </q-card-main>
                    </q-card>

                    <q-card :class="[{'rounded': roundedDesign}, 'error-white-card']" :style="`${shopCheckoutBackgroundColor} margin-top: 1rem;`">
                        <q-card-title>
                            <h5 class="no-margin" :style="cardDetailsTextColor">Card Details</h5>
                            <p :style="`${cardDetailsTextColor} margin-top: 1.5rem; font-size: .9rem;`" v-if="subscriptionProductInCart && cartTotal === 0">We ask for payment information so your subscription can continue without interruption at the end of your trial period. An authorization for $1 will appear on your account, but you will not be charged anything during the initial time period. After this period is over, you will be charged full price for the subscription. You can easily cancel anytime by clicking “account” in the top bar.</p>
                        </q-card-title>

                        <q-card-main v-if="cartTotal || subscriptionProductInCart">
                            <div v-if="cardIsSaved" :style="cardDetailsTextColor">
                                <h6>Hey, looks like we saved your card info for you.</h6>
                                <h6 style="margin: .5rem 0;">Confirm the last four digits are correct and you are good to go:</h6>
                                <div align="center">
                                    <h5 :style="`${cardDetailsTextColor}, margin: 1rem 0;`">**** **** **** {{lastFour}}</h5>

                                    <q-btn size="sm" color="red" :class="[{ 'roundedButton': roundedDesign }, 'q-mb-md']" @click="removeSavedCard()">
                                        <q-icon name="fa-times" /> Forget my card info
                                    </q-btn>
                                </div>
                            </div>

                            <div v-if="!cardIsSaved">
                                <!--<q-input float-label="Full Name" v-model="cardDetail.name" />-->

                                <q-field
                                    :error="cardDetailError.number"
                                    error-label="Please enter a valid card number."
                                >
                                    <q-input
                                        :class="[{'rounded': roundedDesign}, 'inputBox']"
                                        hide-underline
                                        color="grey"
                                        :attributes="{autocompletetype: 'cc-number', autocorrect: 'off'}"
                                        float-label="Card #"
                                        v-model="cardDetail.number"
                                        @input="cardDetailError.number = false"
                                        v-mask="'###################'"
                                    />
                                </q-field>

                                <div class="row">
                                    <div class="col-6" style="padding-right: .5rem;">
                                        <q-field
                                            id="expiryField"
                                            :error="cardDetailError.expiry"
                                            error-label="Please enter a valid expiration."
                                        >
                                            <q-input
                                                :class="[{'rounded': roundedDesign}, 'inputBox']"
                                                hide-underline
                                                color="grey"
                                                :attributes="{autocompletetype: 'cc-exp', autocorrect: 'off'}"
                                                float-label="Expires (mm/yy)"
                                                v-model="cardDetail.expiry"
                                                @input="cardDetailError.expiry = false, creditCardExpired = false"
                                                v-mask="'##/##'"
                                            />
                                        </q-field>
                                    </div>

                                    <div class="col-6" style="padding-left: .5rem;">
                                        <q-field
                                            id="cvcField"
                                            :error="cardDetailError.cvc"
                                            error-label="Please enter a cvc."
                                        >
                                            <q-input
                                                :class="[{'rounded': roundedDesign}, 'inputBox']"
                                                hide-underline
                                                color="grey"
                                                :attributes="{autocompletetype: 'cc-csc', autocorrect: 'off'}"
                                                float-label="CVC"
                                                v-model="cardDetail.cvc"
                                                @input="cardDetailError.cvc = false"
                                                v-mask="'####'"
                                            />
                                        </q-field>
                                    </div>

                                    <div class="col-12" v-if="creditCardExpired" :style="`background: #f44336 !important; margin: 0; padding: .5rem 0;`">
                                        <p class="q-pl-sm no-margin" style="color: #fff !important;">
                                            This credit card is expired. Can you check your expiration date and try again?
                                        </p>
                                    </div>
                                </div>

                                <q-btn @click="saveCard = !saveCard" flat class="q-pl-none q-my-md" size=".8rem" label="Securely save my info for next time" :icon="saveCard ? 'fas fa-check-square' : 'far fa-square'" :style="cardDetailsTextColor"></q-btn>
                            </div>

                            <q-btn
                                id="purchaseBtn"
                                :class="[{'roundedButton': roundedDesign}, 'full-width', 'text-white']"
                                size="lg"
                                :style="cardDetailsButtonColor"
                                @click="initPurchase()"
                            >
                                <q-icon name="fas fa-lock" style="font-size: 1.25rem;" />

                                <h6 style="font-size: 1.25rem;">
                                    {{subscriptionProductInCart ? 'Activate Subscription' : 'Checkout'}}
                                </h6>
                            </q-btn>

                            <h6 align="center" :style="`${cardDetailsTextColor} margin: 1rem 0;`">OR</h6>

                            <q-btn id="paypalPurchase" :class="[{'roundedButton': roundedDesign}, 'text-black', 'full-width']" color="white" size="lg" @click="initPayPalPurchase()">
                                <q-icon name="fab fa-paypal" size="24px" color="blue-9" />
                                <span style="text-transform: none;" class="text-blue-9">PAYPAL</span>
                            </q-btn>
                        </q-card-main>

                        <q-card-main v-if="!cartTotal && cart.length && !subscriptionProductInCart">
                            <q-btn id="freeCheckout" size="lg" @click="completePurchase()" :class="[{'roundedButton': roundedDesign}, 'full-width', 'text-white']" :style="cardDetailsButtonColor">
                                <h6 class="thickHeader">{{giftCard ? 'Complete Order' : 'Free Checkout'}}</h6>
                            </q-btn>
                        </q-card-main>

                        <q-card-main v-if="componentData.beforePurchaseText" align="center">
                            <span v-html="componentData.beforePurchaseText" />
                        </q-card-main>
                    </q-card>
                </div>

            </div>

            <div v-html="componentData.clientCustomCheckoutText"></div>

        </div>
    </div>
</template>

<script>
    //use this object key on shopCheckout component (on eJSON) to change error field font color, defaulted to #fff -> creditCardErrorFieldColor
    import shopCart from '../shopCart'
    import Signin from '../../auth/Signin'
    import { purchaseAndActivation } from '../../../../mixins/purchaseAndActivation'
    import { authentication } from '../../../../mixins/authentication'
    import { designTools } from '../../../../mixins/designTools'

    export default {
        props: ['componentData'],

        mixins: [purchaseAndActivation, authentication, designTools],

        computed: {
            windowWidth() {
                return this.$store.state.windowWidth
            },

            calculateDivHeight() {
                try {
                    let windowHeight = window.innerHeight
                    let topNavHeight = document.getElementById('topNav').clientHeight
                    let footerHeight = document.getElementById('footer').clientHeight
                    let height =  windowHeight - topNavHeight - footerHeight

                    return `min-height: ${height}px; padding-bottom: 4rem;`
                } catch (e) {
                    return `min-height: calc(100vh - 10rem); padding-bottom: 4rem;`
                }
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            roundedDesign() {
                return this.environmentJSON.e.noRoundedDesign ? false : true
            },

            shopCheckoutBackgroundColor() {
                let brandColor = this.environmentJSON.e.brandColor ? this.environmentJSON.e.brandColor : '#777'
                let backgroundColor = `background: ${this.componentData.useDefaultForCardDetails ? '#777' : brandColor }; !important;`
                return backgroundColor
            },

            cardDetailsButtonColor() {
                let buttonColor = `background: ${this.componentData.cardDetailsButtonColor ? this.componentData.cardDetailsButtonColor : '#4caf50'} !important;`
                return buttonColor
            },

            cardDetailsTextColor() {
                // let whiteTextColor = this.componentData.useDefaultForCardDetails ? '#000' : '#fff'
                let textColor = `color: ${this.componentData.cardDetailsTextColor ? this.componentData.cardDetailsTextColor : '#fff' } !important;`
                return textColor
            }
        },

        components: {
            shopCart,
            Signin
        },

        created() {
            this.initCheckoutPage()

            k('shop checkout componentData: ', this.environmentJSON)
        },

        beforeDestroy() {
            this.removeURLParams()

            this.resetPromoCode()
            this.resetGiftCard()
        }
    }
</script>

<style>
    .error-white-card .q-field-error {
        cursor: not-allowed;
        color: white !important;
        background-color: #f44336;
        padding: .5rem;
        border-bottom: 2px solid #ff7474;
        /*border: 1px solid #555;*/
    }
</style>

<style scoped>
    h5 {
        color: #444;
    }

    .pchip {
        background: #fff;
        color: #000;
        /*font-size: .8rem; */
        margin: .25rem 0;
        padding: .25rem .5rem;
        border-radius: .2rem;
        width: fit-content;
        width: -moz-fit-content;
    }

    /*[data-v-63bc14f0] >>> .q-field-error {*/
    /*    color: #fff !important;*/
    /*}*/

    #signinHold {
        /*padding: 1rem;*/
        /*position: relative;*/
        /*top: 50%;*/
        /*transform: translateY(-50%);*/
    }

</style>