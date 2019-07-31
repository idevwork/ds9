<template>
    <div v-if="showSection">

        <div style="background: #0081a4;">

            <div class="well row">

                <div class="col-12 row" :style="windowWidth > 1200 ? 'padding: 3rem' : windowWidth > 420 ? 'padding: 1rem;' : ''">
                    <div class="col-xs-12 col-md-5 col-lg-2" style="padding: 1rem;" align="center">
                        <img v-if="!localOfferProductID || localOfferProductID === 10993" class="rounded shadow-1" src="https://vault.platformpurple.com/static/previews/st_subscription-monthly/st_subscription-monthly_image_cover.png" style="width: 100%; max-width: 250px; display: block; margin: 0 auto;" />
                        <img v-if="localOfferProductID === 16008" class="rounded shadow-1" src="https://vault.platformpurple.com/static/previews/st_subscription-yearly/st_subscription-yearly_image_cover.png" style="width: 100%; max-width: 250px; display: block; margin: 0 auto;" />

                        <img src="https://vault.platformpurple.com/static/clients/signingtime/offer_ribbon.png" style="width: 100%; max-width: 250px; display: block; margin: 1rem auto;" />
                    </div>

                    <div class="col-xs-12 col-md-7 col-lg-5" style="padding: 1rem;">
                        <h2 class="text-white">What do I get?</h2>

                        <ol style="padding-left: 1rem;">
                            <li class="text-white" style="margin-bottom: .5rem;">
                                <span style="color: #80ff4b;">Unlimited streaming and download access</span> to
                                <span style="color: #80ff4b;">hundreds</span> of award-winning videos, music and eBooks!
                            </li>
                            <li class="text-white" style="margin-bottom: .5rem;">
                                Includes
                                <span style="color: #80ff4b;">Baby Signing Time</span>,
                                <span style="color: #80ff4b;">Potty Time</span>,
                                <span style="color: #80ff4b;">all Signing Time videos</span>, and even the complete
                                <span style="color: #80ff4b;">Rachel & the TreeSchoolers</span> series!
                            </li>
                            <li class="text-white" style="margin-bottom: .5rem;">
                                 Watch on all your favorite devices—laptops, tablets, smartTVs, smartphones, Roku or PlayStation!
                            </li>
                            <li class="text-white" style="margin-bottom: .5rem;">
                                Includes <span style="color: #80ff4b;">all chapters and bonus features</span> from the DVDs
                            </li>
                            <li class="text-white" style="margin-bottom: .5rem;">
                                <span style="color: #80ff4b;">New videos</span> are added to your subscription automatically
                            </li>
                        </ol>

                        <img src="https://vault.platformpurple.com/static/clients/signingtime/paper_plane.png" style="width: 100%; max-width: 100%; display: block; margin: 1rem auto;" />
                    </div>

                    <div class="col-md-12 col-lg-5" style="padding: 1rem;">
                        <special-offer-subscription :localOfferProductID="localOfferProductID" @input="selectSubscriptionItem" :componentData="componentData">
                            <signUpOffer
                                v-if="signMeUp"
                                :productIDsToCheck="validSubscriptionProductIDs"
                                :offerProductID="localOfferProductID"
                                :completeSignUpComponentData="completeSignUpComponentData"
                                :headingColor="componentData.specialOffer && componentData.specialOffer.headingColor ? componentData.specialOffer.headingColor : environmentJSON.e.brandColor"
                                :textColor="componentData.specialOffer && componentData.specialOffer.textColor ? componentData.specialOffer.textColor : environmentJSON.e.brandColor"
                                :buttonColor="componentData.specialOffer && componentData.specialOffer.buttonColor ? componentData.specialOffer.buttonColor : environmentJSON.e.brandColor"
                                :showCompleteSignUp="showCompleteSignUp"
                                @userHasAccess="hideSection()"
                                @userPreviouslyOwned="showCompleteSignUp = true"
                                @userNeedsToCheckout="showCompleteSignUp = true"
                            />
                        </special-offer-subscription>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import signUpOffer from '../../common/showcase/signUpOffer.vue'
    import specialOfferSubscription from '../../common/showcase/specialOfferSubscription.vue'

    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { designTools } from '../../../mixins/designTools'

    export default {
        props: ['componentData'],

        components: {
            signUpOffer,
            specialOfferSubscription
        },

        mixins: [ globalComputedData, userAndProductInfo, designTools ],

        data() {
            return {
                showSection: true,
                signMeUp: false,

                localOfferProductID: '',
                showCompleteSignUp: false,

                completeSignUpComponentData: {
                    // header: 'Step 2: Payment information',
                    componentName: 'CreditCardForm',
                    productInfo: '',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    showCodeFields: false,
                    loadHook: 'addProductToCart',
                    submitButtonLabel: 'Submit',
                    stepsTextColor: '#fff',
                    promoCodeText: '14daytrial',
                    noToast: true
                }
            }
        },

        computed: {
            cardStyle() {
                return `background: #fff; height: 100%; width: 100%; padding: 2rem;`
            },

            validSubscriptionProductIDs() {
                return this.environmentJSON.e.validSubscriptionProductIDs
            }
        },

        methods: {
            hideSection() {
                this.showSection = false
            },

            selectSubscriptionItem(productID) {
                k('selectSubscriptionItem: ', productID)

                this.localOfferProductID = ''
                this.$store.commit('saveCart', [])

                this.$nextTick(() => {
                    this.localOfferProductID = productID
                    this.signMeUp = true
                })
            }
        },

        watch: {
            authenticated() {
                k('authenticated watch: ', this.authenticated)
            },

            cart(newValue, oldValue) {
                kw('cart watch all access: ', newValue, oldValue)

                if (newValue && oldValue && !newValue.length && oldValue.length && this.signMeUp) {
                    kw('remove signMeUp')
                    this.signMeUp = false
                }
            },

            environmentProducts() {
                if (this.userHasAccess(this.validSubscriptionProductIDs)) this.hideSection()
            }
        },

        created() {
            k('authenticated: ', this.authenticated)

            if (this.environmentProducts) {
                if (this.userHasAccess(this.validSubscriptionProductIDs)) this.hideSection()
            }

            if (this.initialParameters.payPalReturnCode) {
                this.signMeUp = true
            }

            // TODO: this empties user cart when signUpOffer is created
            // this.localOfferProductID = this.componentData.specialOffer.defaultLocalOfferProductID ? this.componentData.specialOffer.defaultLocalOfferProductID : ''
        }
    }

</script>

<style scoped>

</style>

