<template>
    
    <div id="productPreview" class="layout-view">
        <q-inner-loading :visible="!productPreviewData" />
        
        <div v-if="productPreviewData">
            <div class="row well">
                
                <div class="col-xs-12 col-md-5" align="center" style="padding: .5rem;">
                    <img :src="coverImageUrl" style="max-width: 100%;" />
                </div>
                    
                <div class="col-xs-12 col-md-7">
    
                    <h2 :align="windowWidth < 768 ? 'center' : 'left'" :style="'font-size: ' + adaptiveFontSize(1.4) + 'rem; line-height: ' + adaptiveFontSize(1.6) + 'rem;'">
                        {{productPreviewData.productName}}
                    </h2>
                    <p :align="windowWidth < 768 ? 'center' : 'left'" :style="'color: ' + brandColor + '; margin-top: .5rem;'">{{productPreviewData.productBlurb}}</p>
                    <!--<p v-html="productPreviewData.productBlurb" class="gt-md" style="margin-top: .5rem;"></p>-->
                    <!--<p v-html="productPreviewData.productBlurb" class="xs" style="margin-top: .5rem;"></p>-->
                    
                    <div class="row">
                        <div class="col-sm-12" align="center" v-if="productIsInShop && environmentProductAndTagState.includes('fetched')" style="padding: 0 0 1rem; max-width: 30rem; margin: 0 auto;">
                            
                            <h4 align="center" style="margin-bottom: .5rem;">
                                <span style="color: red; text-decoration: line-through;">{{productPreviewData.productAttributes && productPreviewData.productAttributes.regularPrice ? numeral(productPreviewData.productAttributes.regularPrice).format('$0.00') : ''}}</span>
                                {{productPreviewData.productPrice && productPreviewData.productPrice != 0 ? numeral(productPreviewData.productPrice).format('$0.00') : 'FREE'}}
                            </h4>
            
                            <q-btn v-if="!owned && !inCart" @click="add2cart" id="add2cart" color="blue-9" class="full-width no-shadow" :style="`background: ${brandColor} !important;`">
                                <q-icon name="fa-cart-plus" style="margin-right: .5rem;" />
                                <h6>Add To Cart</h6>
                            </q-btn>
                            
                            <q-btn v-if="inCart && !owned" @click="removeFromCart" id="removeFromCart" color="red" class="full-width no-shadow">
                                <q-icon name="fa-times" style="margin-right: .5rem;" />
                                <h6>Remove From Cart</h6>
                            </q-btn>
                        
                            <q-btn v-if="owned" color="purple" class="full-width no-shadow" @click="">
                                <q-icon name="fa-check-circle" style="margin-right: .5rem;" />
                                <h6>Owned</h6>
                            </q-btn>
                            
                            <q-btn id="giveAsGift" color="orange-9" class="full-width no-shadow" @click="openGift()" style="margin-top: 1rem;">
                                <q-icon name="fa-gift" style="margin-right: .5rem;" />
                                <h6>Give Gift</h6>
                            </q-btn>
                        </div>
                        
                        <!--<div v-if="productIsNotBundle" class="col-sm-12 col-md-6" align="center" style="padding: .5rem;">-->
                        <!--    Subscribe -->
                            
                        <!--    <h5 align="center" style="margin-bottom: .5rem;">-->
                        <!--        $24.99 / mo-->
                        <!--    </h5>-->
                        <!--    <q-btn id="subscribe" color="blue-9" class="full-width" @click="subscribeMonthlyNow()">-->
                                <!--<q-icon name="fa-gift" style="margin-right: .5rem;" />-->
                        <!--        <h6>Subscribe</h6>-->
                        <!--    </q-btn>-->
                        <!--</div>-->
                    </div>
                    
                    <div v-if="!productIsInShop && environmentProductAndTagState.includes('fetched')" class="col-md-12 padded" align="center">
                        <h6>This product is not available for purchase.</h6>
                    </div>
                    
                    <!--<div class="row justify-around" style="margin-top: 1rem;" align="center">-->
                    <!--    <div style="col">-->
                    <!--        <q-btn size="sm" round @click="showProductPreviewLink = !showProductPreviewLink" color="grey">-->
                    <!--            <q-icon name="fa-link" style="font-size: 1rem;" />-->
                    <!--        </q-btn>-->
                    <!--    </div>-->
                            
                    <!--    <div style="col">-->
                    <!--        <q-btn size="sm" round @click="share2Facebook(productPreviewData)" color="blue-9">-->
                    <!--            <q-icon name="fab fa-facebook" style="font-size: 1rem;" />-->
                    <!--        </q-btn>-->
                    <!--    </div>-->
                            
                    <!--    <div style="col">-->
                    <!--        <q-btn size="sm" round @click="share2Twitter(productPreviewData)" color="blue-5">-->
                    <!--            <q-icon name="fab fa-twitter" style="font-size: 1rem;" />-->
                    <!--        </q-btn>-->
                    <!--    </div>-->
                    <!--</div>-->
                </div>
                
            </div>
            
            <div class="bg-grey-2">
                <div class="row well" style="padding: 0 1rem;">
                    <div class="col-12" style="padding: 0.5rem .5rem 1rem;">
                        <h6 style="margin: .7rem 0;">
                            <span style="padding-left: 0;">Tags</span>
                        </h6>
                        
                        <template v-if="productPreviewData.productJSON">
                            <template v-for="key in Object.keys(productPreviewData.productJSON)" v-if="productPreviewData.productJSON[key].length">
                                <div class="pchip" color="white">
                                    <q-icon :name="iconForMediaTypeMap[key]" style="font-size: .6rem; margin: 0 .5rem 0 0;" />
                                    <span style="text-transform: capitalize;">{{key}}</span>
                                </div>
                            </template>
                        </template>
                        
                        <div v-if="productTags" v-for="tag in productTags" class="pchip" color="white">
                            <q-icon name="fa-tag" style="font-size: .6rem; margin: 0 .5rem 0 0;" />
                            {{tag}}
                        </div>
                    </div>
                    
                    <div v-if="showProductPreviewLink" class="col-12 well padded">
                        <div class="bg-white shadow-3 padded">
                            <q-field
                                icon="fa-link"
                                helper="Select and copy this link to send people to this product"
                            >
                                <q-input v-model="productPreviewLink" readonly />
                            </q-field>
                        </div>
                    </div>
                </div>
            </div>
        
            <giftDetail v-if="showGift" />
            
            <div class="well" style="padding: 1rem 1.5rem 2rem;">
                <q-tabs inverted v-if="productPreviewData" color="white">
                    <!-- Tabs - notice slot="title" -->
                    <q-tab color="grey-9" default slot="title" name="tab-1" label="Description" />
                    <q-tab color="grey-9" :disable="productPreviewData.productJSON && Object.keys(productPreviewData.productJSON).length ? false : true" slot="title" name="tab-2" label="Course Outline" />
                    <!--<q-tab color="grey-9" disable slot="title" name="tab-3" label="Instructor" />-->
                    <!--<q-tab color="grey-9" slot="title" name="tab-4" label="Reviews" />-->
                
                    <!-- Targets -->
                    <!--<q-tab-pane name="tab-1" v-html="productPreviewData.moreInfo" />-->
                    <q-tab-pane name="tab-1" class="row">
                        <div :class="`col-sm-12 ${hasSampleVideo ? 'col-md-6' : ''}`" style="padding: .5rem; font-size: .9rem;" v-html="productPreviewData.moreInfo" />
                        <div v-if="hasSampleVideo" class="col-sm-12 col-md-6" style="padding: .5rem;">
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
                    </q-tab-pane>
                    
                    <q-tab-pane name="tab-2" class="row">
                        <!--{{productPreviewData.productJSON}}-->
                        
                        <template v-if="productPreviewData.productJSON">
                            <div v-for="key in Object.keys(productPreviewData.productJSON)" v-if="productPreviewData.productJSON[key].length" class="col-sm-12">
                                <h5 style="text-transform: capitalize;">{{key}}</h5>
                                <hr />
                                <div v-for="item in productPreviewData.productJSON[key]" :style="`padding: .5rem; ${item.nonMovieChapter ? 'background: #efefef;' : ''}`">
                                    <h6 v-if="item.nonMovieChapter" style="margin: 0; font-size: .9rem;">{{item.displayName}}</h6>
                                    <p style="margin: 0; font-size: .9rem;" v-else><q-icon :name="iconForMediaTypeMap[key]" style="font-size: .9rem;" /> {{item.displayName}}</p>
                                </div>
                            </div>
                        </template>
                    </q-tab-pane>
                    
                    <!--<q-tab-pane name="tab-3">Instructor Info</q-tab-pane>-->
                    <!--<q-tab-pane name="tab-4">Reviews</q-tab-pane>-->
                </q-tabs>
            </div>
    
            <div v-if="relatedProducts" class="bg-grey-3" style="padding: 1rem;">
                <div id="relatedProducts" class="row items-stretch justify-center relative-position padded well">
                    <h4 class="col-12 dividerHeader" style="margin-top: 0;">
                        <span style="background: #efefef; padding-left: 0;">You May Also Like</span>
                    </h4>
                    <div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 col-xl-2" v-for="product in relatedProducts" :key="product.productID" style="padding: .5rem;">
                        <!--{{product}}-->
                        <painttubeProductCard class="productCard" :componentData="product"></painttubeProductCard>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
    import { productPreviewTools } from '../../../mixins/productPreviewTools'
    import painttubeProductCard from './painttubeProductCard'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    
    export default {
        
        mixins: [productPreviewTools, productInfoTools],
        
        components: {
            painttubeProductCard
        },
        
        computed: {
            productIsNotBundle() {
                return !this.productPreviewData.productType.includes('bundle') && !this.productPreviewData.productType.includes('channel')
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
            }
        },
        
        methods: {
            subscribeMonthlyNow() {
                k('subscribeMonthlyNow!')
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.cart', value: '14692' })
                this.route('/shop/checkout')
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
        color: #375084;
        font-size: .7rem; 
        margin: .25rem;
        padding: .25rem .5rem;
        border: 1px solid #375084;
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
