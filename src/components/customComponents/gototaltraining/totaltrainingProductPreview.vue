<template>
    
    <div id="productPreview" class="layout-view">
        
        <q-inner-loading :visible="!productPreviewData" />
        
        <div v-if="productPreviewData">
            <div v-if="hasSampleVideo" class="row bg-grey-5" :style="windowWidth > 768 ? 'padding: 2rem;' : ''">
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
                
                <div class="col-xs-12 col-md-5" align="center" style="padding: .5rem;">
                    
                    <img :src="coverImageUrl" style="max-width: 100%;" />
                    
                    <div class="" style="margin-top: 1rem; padding-bottom: 1rem;" align="center">
                        <!--<div style="col">-->
                            <q-btn size="sm" round @click="goToProductPreviewLink()" color="grey">
                                <q-icon name="fa-link" style="font-size: 1rem;" />
                            </q-btn>
                        <!--</div>-->
                            
                        <!--<div style="col">-->
                            <q-btn size="sm" round @click="share2Facebook(productPreviewData)" color="blue-9">
                                <q-icon name="fab fa-facebook" style="font-size: 1rem;" />
                            </q-btn>
                        <!--</div>-->
                            
                        <!--<div style="col">-->
                            <q-btn size="sm" round @click="share2Twitter(productPreviewData)" color="blue-5">
                                <q-icon name="fab fa-twitter" style="font-size: 1rem;" />
                            </q-btn>
                        <!--</div>-->
                    </div>
                    
                    <q-slide-transition>
                        <div v-if="showProductPreviewLink">
                            <div id="productPreviewLink" class="bg-grey-3 shadow-1 padded">
                                <q-field
                                    icon="fa-link"
                                    helper="Select and copy this link to send people to this product"
                                >
                                    <q-input v-model="productPreviewLink" readonly />
                                </q-field>
                            </div>
                        </div>
                    </q-slide-transition>
                </div>
                    
                <div class="col-xs-12 col-md-7">
        
                    <h2 :style="`font-size: ${adaptiveFontSize(1.4)}rem; line-height: ${adaptiveFontSize(1.6)}rem;`">
                        {{productPreviewData.productName}}
                    </h2>
                    <h5 v-if="productPreviewData.duration" style="margin-top: .5rem;">Duration: <span :style="`color: ${brandColor};`">{{j_.secondsToHms(productPreviewData.duration)}}</span></h5>
                    <p :style="`color: ${brandColor}; margin-top: .5rem;`">{{productPreviewData.byLine}}</p>
                    <p v-html="productPreviewData.productBlurb" style="margin-top: .5rem;"></p>
                    <!--<p v-html="productPreviewData.productBlurb" class="xs" style="margin-top: .5rem;"></p>-->
                    
                    <div class="row">
                        <div :class="`col-sm-12 ${productIsNotBundle ? 'col-md-6' : ''}`" align="center" v-if="productIsInShop && environmentProductAndTagState.includes('fetched')" style="padding: .5rem;">
                            <span v-if="productIsNotBundle">Single Class</span>
                            
                            <h5 align="center" style="margin-bottom: .5rem;">
                                <span style="color: red; text-decoration: line-through;">{{productPreviewData.productAttributes && productPreviewData.productAttributes.regularPrice ? numeral(productPreviewData.productAttributes.regularPrice).format('$0.00') : ''}}</span>
                                {{productPreviewData.productPrice && productPreviewData.productPrice != 0 ? numeral(productPreviewData.productPrice).format('$0.00') : 'FREE'}}
                            </h5>
            
                            <q-btn v-if="!owned && !inCart" @click="add2cart" id="add2cart" outline class="full-width" :style="`color: ${lightBlue};`">
                                <q-icon name="fa-cart-plus" style="margin-right: .5rem;" />
                                <h6>Add To Cart</h6>
                            </q-btn>
                            
                            <q-btn v-if="inCart && !owned" @click="removeFromCart" id="removeFromCart" outline color="red" class="full-width">
                                <q-icon name="fa-times" style="margin-right: .5rem;" />
                                <h6>Remove From Cart</h6>
                            </q-btn>
                        
                            <q-btn v-if="owned" color="purple" class="full-width" @click="">
                                <q-icon name="fa-check-circle" style="margin-right: .5rem;" />
                                <h6>Owned</h6>
                            </q-btn>
                            
                            <q-btn id="giveAsGift" color="orange" outline class="full-width" @click="openGift()" style="margin-top: 1rem;">
                                <q-icon name="fa-gift" style="margin-right: .5rem;" />
                                <h6>Give Gift</h6>
                            </q-btn>
                        </div>
                        
                        <div v-if="productIsNotBundle" class="col-sm-12 col-md-6" align="center" style="padding: .5rem;">
                            Subscribe To All Access Monthly
                            
                            <h5 align="center" style="margin-bottom: .5rem;">
                                $24.99 / mo
                            </h5>
                            <q-btn id="subscribe" outline :style="`color: ${lightBlue};`" class="full-width" @click="subscribeNow('14692')">
                                <h6>Subscribe</h6>
                                <q-icon name="fas fa-chevron-right" style="margin-right: .5rem; font-size: .8rem;" />
                            </q-btn>
                            
                            <q-btn outline :style="`margin-top: 1rem;`" color="grey-8" class="full-width" @click="showMoreSubscriptionOptions = !showMoreSubscriptionOptions">
                                <h6>More options</h6>
                                <q-icon :name="showMoreSubscriptionOptions ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" style="margin-right: .5rem; font-size: .8rem;" />
                            </q-btn>
                        </div>
                    </div>
                    
                    <div v-if="!productIsInShop && environmentProductAndTagState.includes('fetched')" class="col-md-12 padded" align="center">
                        <h6>This product is not available for purchase.</h6>
                    </div>
                </div>
                
            </div>
                
            <div v-if="showMoreSubscriptionOptions" class="col-12 row justify-center" style="padding: 1rem 0;">
                <!--<div v-for="item in subscriptionOptions" class="col-sm-6 col-md-3" align="center" style="padding: .5rem;">-->
                <!--    <h6>{{item.productName.replace('Total Training™ All-Access Library - ', '').replace('Total Training All Access Library - ', '')}}</h6>-->
                <!--    <h5 align="center" style="margin: .5rem 0;">-->
                <!--        ${{item.productPrice}}-->
                <!--    </h5>-->
                    
                <!--    <q-btn outline :style="`color: ${lightBlue};`" class="full-width" @click="subscribeNow(item.productID)">-->
                <!--        <h6>Subscribe</h6>-->
                <!--        <q-icon name="fas fa-chevron-right" style="margin-right: .5rem; font-size: .8rem;" />-->
                <!--    </q-btn>-->
                <!--</div>-->
                
                <subscriptionProducts :componentData="{
                  'id': 'subscriptionProducts',
                  'component': 'subscriptionProducts',
                  'componentPath': 'gototaltraining/subscriptionProducts.html',
                  'backgroundColor': '#efefef',
                  'monthlyProductIDs': [
                    151318, 
                    151320, 
                    151319, 
                    14692
                  ],
                  'visibility': {
                    'showcase': true
                  }
                }" />
            </div>
            
            <div class="bg-grey-2">
                <div class="row well" style="padding: 0 1rem;">
                    <div class="col-12" style="padding: .5rem;">
                        <h6 style="margin: .7rem 0;">
                            <span style="padding-left: 0;">Tags</span>
                        </h6>
                        
                        <template v-if="productPreviewData.productJSON">
                            <template v-for="key in Object.keys(productPreviewData.productJSON)" v-if="key && productPreviewData.productJSON && productPreviewData.productJSON[key] && productPreviewData.productJSON[key].length">
                                <div class="pchip" color="white" :style="`color: ${lightBlue}; border: 1px solid ${lightBlue};`">
                                    <q-icon :name="iconForMediaTypeMap[key]" style="font-size: .6rem; margin: 0 .5rem 0 0;" />
                                    <span style="text-transform: capitalize;">{{key}}</span>
                                </div>
                            </template>
                        </template>
                        
                        <div v-if="productTags && (expandTags || index < 5)" v-for="(tag, index) in productTags" class="pchip" color="white" :style="`color: ${lightBlue}; border: 1px solid ${lightBlue};`">
                            <q-icon name="fa-tag" style="font-size: .6rem; margin: 0 .5rem 0 0;" />
                            {{tag}}
                        </div>
                        
                        <q-btn v-if="productTags && productTags.length > 5" size="sm" outline class="bg-white text-black" @click="expandTags = !expandTags">Show {{expandTags ? 'less' : 'more'}}</q-btn>
                    </div>
                    
                </div>
            </div>
        
            <giftDetail v-if="showGift" />
            
            <div class="well" style="padding: 1rem 1.5rem 2rem;">
                <q-tabs inverted v-if="productPreviewData" color="white">
                    <!-- Tabs - notice slot="title" -->
                    <q-tab color="grey-9" default slot="title" name="tab-1" label="Description" />
                    <q-tab color="grey-9" v-if="productPreviewData.productJSON && Object.keys(productPreviewData.productJSON).length" slot="title" name="tab-2" label="Course Outline" />
                    <q-tab color="grey-9" v-if="productPreviewData.authorBio" slot="title" name="tab-3" label="Instructor" />
                    <!--<q-tab color="grey-9" slot="title" name="tab-4" label="Reviews" />-->
                
                    <!-- Targets -->
                    <!--<q-tab-pane name="tab-1" v-html="productPreviewData.moreInfo" />-->
                    <q-tab-pane name="tab-1" class="row">
                        <div class="col-sm-12" style="padding: .5rem; font-size: .9rem;" v-html="productPreviewData.moreInfo" />
                        <!--<div v-if="hasSampleVideo" class="col-sm-12 col-md-6" style="padding: .5rem;">-->
                        <!--    <purple-video-->
                        <!--        class="shadow-7"-->
                        <!--        ref="videoPlayer" -->
                        <!--        id="sampleWatch"-->
                        <!--        :options="samplePlayerOptions"-->
                        <!--        v-if="samplePlayerOptions.sources && samplePlayerOptions.sources.length"-->
                        <!--        @ready="playerReadied"-->
                        <!--        style="max-width: 720px; margin: 0 auto;"-->
                        <!--    />-->
                        <!--</div>-->
                    </q-tab-pane>
                    
                    <q-tab-pane v-if="productPreviewData.productJSON && Object.keys(productPreviewData.productJSON).length" name="tab-2" class="row">
                        <!--{{productPreviewData.productJSON}}-->
                        
                        <template v-if="productPreviewData.productJSON">
                            <div v-for="key in Object.keys(productPreviewData.productJSON)" v-if="key && productPreviewData.productJSON && productPreviewData.productJSON[key] && productPreviewData.productJSON[key].length" class="col-sm-12">
                                <h5 v-if="key !== 'zip'" style="text-transform: capitalize;">{{key === 'video' ? 'chapters' : key}}</h5>
                                
                                <hr />
                                
                                <div v-if="key !== 'zip'" v-for="item in productPreviewData.productJSON[key]" :style="`padding: .5rem; ${item.nonMovieChapter ? 'background: #efefef;' : ''}`">
                                    <h6 v-if="item.nonMovieChapter" style="margin: 0; font-size: .9rem;">{{item.displayName}}</h6>
                                    <p style="margin: 0; font-size: .9rem;" v-else><q-icon name="fas fa-chevron-right" style="font-size: .9rem;" /> {{item.displayName}}</p>
                                </div>
                            </div>
                            
                            <div v-if="Object.keys(productPreviewData.productJSON).includes('zip')">
                                <h5 style="text-transform: capitalize;">Project files included</h5>
                            </div>
                        </template>
                    </q-tab-pane>
                    
                    <q-tab-pane v-if="productPreviewData.authorBio" name="tab-3">
                        <h5 style="margin-bottom: 1rem;">Instructor: {{productPreviewData.authorName}}</h5>
                        <span style="font-size: .9rem;" v-html="productPreviewData.authorBio" />
                    </q-tab-pane>
                    
                    <!--<q-tab-pane name="tab-4">-->
                    <!--    <CommentsDisplay :previewMode="true" @comments="generateCommentQuickLook" :ratingImageSrc="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/gototaltraining/total_training_logo.jpg'" />-->
                        
                    <!--    <h6 v-if="comments && !comments.length" style="padding: 1rem;">No reviews yet.</h6>-->
                    <!--</q-tab-pane>-->
                </q-tabs>
            </div>
        
            <div v-if="relatedProducts" class="bg-grey-3" style="padding: 1rem;">
                <div id="relatedProducts" class="row items-stretch justify-center relative-position padded well">
                    <h4 class="col-12 dividerHeader" style="margin-top: 0;">
                        <span style="background: #efefef; padding-left: 0;">You May Also Like</span>
                    </h4>
                    <div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 col-xl-2" v-for="product in relatedProducts" :key="product.productID" style="padding: .5rem;">
                        <div :is="productCardComponent" :componentData="product" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
    import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
    import subscriptionProducts from './subscriptionProducts'
    
    import { totaltrainingColors } from './totaltrainingColors'
    import { productPreviewTools } from '../../../mixins/productPreviewTools'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    
    export default {
        
        data() {
            return {
                expandTags: false,
                comments: '',
                showMoreSubscriptionOptions: false,
                relatedProductCount: 4
            }
        },
        
        mixins: [totaltrainingColors, productPreviewTools, productInfoTools, globalComputedData],
        
        components: {
            CommentsDisplay,
            subscriptionProducts
        },
        
        computed: {
            productIsNotBundle() {
                k('productIsNotBundle: ', this.productPreviewData)
                return this.productPreviewData && this.productPreviewData.productType ? !this.productPreviewData.productType.includes('bundle') && !this.productPreviewData.productType.includes('channel') : false
            },
            
            subscriptionOptionIDs() {
                let subscriptionProducts = this.homePageSections ? this.homePageSections.find((section) => { return section.id === 'subscriptionProducts'}) : ''
                return subscriptionProducts ? subscriptionProducts.productIDs.filter((id) => { return id !== 14692 }) : []
            },
            
            subscriptionOptions() {
                // return this.environmentProducts.filter((product) => { return this.subscriptionOptionIDs.includes(product.productID) })
                return this.subscriptionOptionIDs.map((id) => {
                    return this.environmentProducts.find((product) => { return id === product.productID })
                })
            }
        },
        
        watch: {
            productPreviewData() {
                // if (this.productPreviewData) {
                //     kw('get product meta watch: ', this.productPreviewData)
                //     this.getProductMetaFromAPI(this.productPreviewData.productID, (res) => {
                //         if (res.success) this.productPreviewData.productJSON = res.productMeta.productJSON
                //     })
                // }
                this.showMoreSubscriptionOptions = false
            }
        },
        
        methods: {
            subscribeNow(productID) {
                k('subscribeNow: ', productID)
                
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.cart', value: String(productID) })
                this.route('/shop/checkout')
            },
            
            generateCommentQuickLook(comments) {
                k('generateCommentQuickLook: ', comments)
                this.comments = comments
            },
            
            goToProductPreviewLink() {
                this.showProductPreviewLink = !this.showProductPreviewLink
                // this.scrollIt('')
            }
        }

    }
</script>

<style scoped>
    .padded {
        padding: .5rem;
    }

    .video-js {
        height: 50vh;
    }
    
    .pchip {
        background: #fff;
        font-size: .7rem; 
        margin: .25rem;
        padding: .25rem .5rem;
        border-radius: .2rem;
        width: fit-content;
        width: -moz-fit-content;
        display: inline-flex;
    }
    
    .q-tabs-bar {
        color: blue;
    }
    
    /*@media only screen and (min-width: 768px ) {*/
    /*    .preview-action-buttons {*/
    /*        max-width: 450px;*/
    /*        margin: 0 auto;*/
    /*    }*/
    /*}*/
    /*h1 {*/
    /*    font-size: 2rem;  */
    /*}*/
    /*h2, h3, h4, h5 {*/
    /*    font-size: 1.5rem;  */
    /*}*/
    /*h6 {*/
    /*    font-size: 1rem;*/
    /*}*/
</style>
