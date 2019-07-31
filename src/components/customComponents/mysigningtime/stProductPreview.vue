<template>

    <div id="productPreview" class="layout-view">
        <q-inner-loading :visible="!productPreviewData" />

        <div v-if="productPreviewData">
            <div v-if="hasSampleVideo" class="row bg-grey-3" :style="windowWidth > 768 ? 'padding: 2rem;' : ''">
                <div class="col">
                    <purple-video
                        class="shadow-7"
                        ref="videoPlayer"
                        id="sampleWatch"
                        :options="samplePlayerOptions"
                        v-if="samplePlayerOptions.sources && samplePlayerOptions.sources.length"
                        @ready="playerReadied"
                        style="max-width: 720px; margin: 0 auto;"
                    />
                </div>
            </div>

            <div class="row well">
                <div :class="showSubscriptionSection ? 'col-xs-12 col-lg-6' : 'col-xs-12 col-lg-7'" style="padding: 1rem;">
                    <div class="row" style="margin-bottom: 1rem;">

                        <productInfo>
                            <template slot="image">
                                <div class="col-xs-12 col-lg-12 col-xl-12" align="left">
                                    <img :src="coverImageUrl" class="rounded" style="max-width: 100%;" />
                                </div>
                            </template>
                        </productInfo>

                        <div v-if="productIsInShop && environmentProductAndTagState.includes('fetched')" class="col-md-12 col-lg-12 col-xl-12">

                            <h2 align="left" style="margin-bottom: 1rem;">
                                <span style="color: red; text-decoration: line-through;">{{productPreviewData.productAttributes && productPreviewData.productAttributes.regularPrice ? numeral(productPreviewData.productAttributes.regularPrice).format('$0.00') : ''}}</span>
                                {{productPreviewData.productPrice && productPreviewData.productPrice != 0 ? numeral(productPreviewData.productPrice).format('$0.00') : 'FREE'}}
                            </h2>

                            <div class="row" style="margin: 0 -.5rem;">
                                <div v-if="!owned && !inCart" class="col" style="padding: .5rem;">
                                    <q-btn size="lg"  @click="add2cart" id="add2cart" color="green" :class="[{ 'roundedButton': roundedDesign }, 'full-width']">
                                        <q-icon name="fa-cart-plus" style="margin-right: .5rem; font-size: 1rem;" />

                                        <h6 class="thickHeader">Add To Cart</h6>
                                    </q-btn>
                                </div>

                                <div v-if="inCart && !owned" class="col" style="padding: .5rem;">
                                    <q-btn size="lg" @click="removeFromCart" id="removeFromCart" color="red" :class="[{ 'roundedButton': roundedDesign }, 'full-width']">
                                        <q-icon name="fa-times" style="margin-right: .5rem; font-size: 1rem;" />

                                        <h6 class="thickHeader">Remove From Cart</h6>
                                    </q-btn>
                                </div>

                                <div v-if="owned" class="col" style="padding: .5rem;">
                                    <q-btn size="lg" color="purple" :class="[{ 'roundedButton': roundedDesign }, 'full-width']" @click="">
                                        <q-icon name="fa-check-circle" style="margin-right: .5rem; font-size: 1rem;" />

                                        <h6 class="thickHeader">Owned</h6>
                                    </q-btn>
                                </div>

                                <div class="col" style="padding: .5rem;">
                                    <q-btn size="lg" id="giveAsGift" color="orange" :class="[{ 'roundedButton': roundedDesign }, 'full-width']" @click="openGift()">
                                        <q-icon name="fa-gift" style="margin-right: .5rem; font-size: 1rem;" />

                                        <h6 class="thickHeader">Give Gift</h6>
                                    </q-btn>
                                </div>
                            </div>

                        </div>

                        <p v-html="productPreviewData.productBlurb" class="gt-xs lt-lg" style="margin-top: .5rem;"></p>
                    </div>
                </div>

                <div v-if="showSubscriptionSection" :class="`${!hasSampleVideo ? 'offset-lg-1 col-lg-5' : 'col-lg-6'} col-xs-12 q-pa-md-lg q-pa-md`">
                    <div align="center">
                        <h4 class="q-mb-sm" :style="`color: ${environmentJSON.e.brandColor};`">Get unlimited access to the entire library free for 14 days!</h4>
                    </div>
                    
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

                    <div v-if="!productIsInShop && environmentProductAndTagState.includes('fetched')" class="col-md-12 padded" align="center">
                        <h6>This product is not available for purchase.</h6>
                    </div>

                </div>

                <div v-else class="col-md-12 col-lg-5">
                    <div style="padding: 1rem 0;">

                        <span v-if="productIsInShop && environmentProductAndTagState.includes('fetched')">
                            <h2 align="center" style="margin-bottom: 1rem;">
                                <span style="color: red; text-decoration: line-through;">{{productPreviewData.productAttributes && productPreviewData.productAttributes.regularPrice ? numeral(productPreviewData.productAttributes.regularPrice).format('$0.00') : ''}}</span>
                                {{productPreviewData.productPrice && productPreviewData.productPrice != 0 ? numeral(productPreviewData.productPrice).format('$0.00') : 'FREE'}}
                            </h2>

                            <div class="row" style="margin: 0 -.5rem;">
                                <div v-if="!owned && !inCart" class="col-12" style="padding: .5rem;">
                                    <q-btn size="lg" :class="[{ 'roundedButton': roundedDesign }, 'full-width']"  @click="add2cart" id="add2cart" color="green">
                                        <q-icon name="fa-cart-plus" style="margin-right: .5rem; font-size: 1rem;" />
                                        <h6 class="thickHeader">Add To Cart</h6>
                                    </q-btn>
                                </div>
                                <div v-if="inCart && !owned" class="col-12" style="padding: .5rem;">
                                    <q-btn size="lg" :class="[{ 'roundedButton': roundedDesign }, 'full-width']" @click="removeFromCart" id="removeFromCart" color="red">
                                        <q-icon name="fa-times" style="margin-right: .5rem; font-size: 1rem;" />
                                        <h6 class="thickHeader">Remove From Cart</h6>
                                    </q-btn>
                                </div>
                                <div v-if="owned" class="col-12" style="padding: .5rem;">
                                    <q-btn size="lg" :class="[{ 'roundedButton': roundedDesign }, 'full-width']" color="purple" @click="">
                                        <q-icon name="fa-check-circle" style="margin-right: .5rem; font-size: 1rem;" />
                                        <h6 class="thickHeader">Owned</h6>
                                    </q-btn>
                                </div>
                                <div class="col-12" style="padding: .5rem;">
                                    <q-btn size="lg" :class="[{ 'roundedButton': roundedDesign }, 'full-width']" id="giveAsGift" color="orange" @click="openGift()">
                                        <q-icon name="fa-gift" style="margin-right: .5rem; font-size: 1rem;" />
                                        <h6 class="thickHeader">Give Gift</h6>
                                    </q-btn>
                                </div>
                            </div>

                        </span>
                    </div>

                    <div v-if="!productIsInShop && environmentProductAndTagState.includes('fetched')" class="col-md-12 padded" align="center">
                        <h6>This product is not available for purchase.</h6>
                    </div>
                </div>

            </div>

            <div class="row well" style="padding: 2rem;">
                <div class="col-12 q-pb-lg tags-section">
                     <h6 class="q-my-lg">
                        <strong>Tags</strong>
                    </h6>

                    <div class="pchip" v-if="productPreviewData.productJSON && productPreviewData.productJSON.video" color="white">
                        <q-icon name="fa-play-circle" style="font-size: .8rem; margin: 0 .5rem 0 0;" /> Video
                    </div>

                    <div class="pchip" v-if="productPreviewData.productJSON && productPreviewData.productJSON.audio" color="white">
                        <q-icon name="fa-music" style="font-size: .8rem; margin: 0 .5rem 0 0;" /> Audio
                    </div>

                    <div class="pchip" v-if="productPreviewData.productJSON && productPreviewData.productJSON.pdf" color="white">
                        <q-icon name="fa-file-pdf" style="font-size: .8rem; margin: 0 .5rem 0 0;" /> PDF
                    </div>

                    <div class="pchip" v-if="productPreviewData.productJSON && productPreviewData.productJSON.zip" color="white">
                        <q-icon name="fa-folder" style="font-size: .8rem; margin: 0 .5rem 0 0;" /> Additional Materials
                    </div>

                    <div v-if="productTags" v-for="tag in productTags" class="pchip" color="white">
                        <q-icon name="fa-tag" style="font-size: .8rem; margin: 0 .5rem 0 0;" /> {{tag}}
                    </div>

                </div>

            </div>

            <giftDetail v-if="showGift" />

            <div class="row well justify-center q-mt-lg"  style="padding: 0 2rem;">
                <div class="col-12">
                    <div class="product-section">
                        <h5 class="q-mb-xl">
                            <strong class="q-pr-lg">
                                DESCRIPTION
                            </strong>

                            <q-icon name="far fa-file-alt" class="q-mb-sm" size="1.25rem" />
                        </h5>

                        <div v-if="productPreviewData" class="" v-html="productPreviewData.moreInfo"></div>
                    </div>

                    <div v-if="relatedProducts">
                        <div id="relatedProducts" class="well row items-stretch justify-center relative-position padded">
                            <h4 class="col-12 q-my-lg">
                                <span class="q-pr-lg">You May Also Like</span>
                                <q-icon name="far fa-thumbs-up" size="1.5rem" />
                            </h4>
                            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 col-xl-2" v-for="product in relatedProducts" :key="product.productID" style="padding: .5rem;">
                                <div :is="productCardComponent" :componentData="product" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import { productPreviewTools } from '../../../mixins/productPreviewTools'
    import { productCardLoad } from '../../../mixins/productCardLoad'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    import signUpOffer from '../../common/showcase/signUpOffer.vue'
    import productCarousel from '../../common/showcase/productCarousel'
    import productInfo from '../../common/showcase/productInfo.vue'
    import specialOfferSubscription from '../../common/showcase/specialOfferSubscription.vue'

    export default {
        props: ['componentData'],

        components: {
            signUpOffer,
            productCarousel,
            productInfo,
            specialOfferSubscription
        },

        mixins: [productPreviewTools, globalComputedData, productCardLoad],

        data() {
            return {
                showSubscriptionSection: true,
                signMeUp: false,

                localOfferProductID: null,
                showCompleteSignUp: false,
                
                completeSignUpComponentData: {
                    componentName: 'CreditCardForm',
                    productInfo: '',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    showCodeFields: false,
                    loadHook: 'addProductToCart',
                    submitButtonLabel: 'Submit',
                    promoCodeText: '14daytrial',
                    noToast: true
                },

                subscriptionSectionBlacklist: [138345, 137222, 137279, 145363, 148865, 146772]
            }
        },

        computed: {
            validSubscriptionProductIDs() {
                return this.environmentJSON.e.validSubscriptionProductIDs
            },

            roundedDesign() {
                return this.environment.json.e.noRoundedDesign ? false : true
            }
        },

        methods: {
             hideSection() {
                this.showSubscriptionSection = false
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
            productPreviewData() {
                if (this.subscriptionSectionBlacklist.includes(this.productPreviewData.productID)) {
                    this.showSubscriptionSection = false
                } else {
                    this.showSubscriptionSection = true
                }
            }
        },

        created() {
            k('st product preview: ', this.subscriptionSectionBlacklist, this.productPreviewData.productID, this.subscriptionSectionBlacklist.includes(this.productPreviewData.productID))

            if (this.subscriptionSectionBlacklist.includes(this.productPreviewData.productID)) {
                this.showSubscriptionSection = false
            } else {
                this.showSubscriptionSection = true
            }

            this.localOfferProductID = this.componentData.specialOffer.defaultLocalOfferProductID ? this.componentData.specialOffer.defaultLocalOfferProductID : ''
        }
    }
</script>

<style scoped>
    .tags-section {
        border-top: 2px solid #cfcfcf;
        border-bottom: 2px solid  #cfcfcf;
    }

    .product-section {
        border-bottom: 2px solid  #cfcfcf;
    }

    .padded {
        padding: .5rem;
    }

    .video-js {
        height: 50vh;
    }

    .pchip::after{
        content: '';
        position: absolute;
        overflow: hidden;
        display: inline-block;
        font-size: 3px; /*set the size for arrow*/
        width: 4em;
        height: 4em;
        margin-top: -2em;
      	border-top: 1px solid #cfcfcf;
    	border-right: 1px solid #cfcfcf;
        transform: rotate(54deg) skew(20deg);
        top: 50%;
        right: -5px;
    }

    .pchip {
        position: relative;
        border-top: 1px solid #cfcfcf;
        border-left: 1px solid #cfcfcf;
        border-bottom: 1px solid #cfcfcf;
        color: #000;
        font-size: .8rem;
        margin: .25rem;
        padding: .05rem .5rem;
        border-radius: .2rem;
        width: fit-content;
        width: -moz-fit-content;
        display: inline-flex;

        margin-right: 15px;
    }
</style>
