<template>
    
    <div id="wahProductPreview" class="layout-view">
        
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
            
            <myWalkSubscribeButtons :productPreviewData="productPreviewData" />
            
            <div class="row well" style="padding: 2rem 1rem;">
                
                <div class="col-lg-9 col-sm-7 col-xs-12">
                    <div class="row"  style="margin: 0 -.5rem;">
                        <div class="col-md-12 col-lg-6" :align="windowWidth < 576 ? 'center' : 'left'" style="padding: .5rem;">
                            <img :src="coverImageURL" style="max-width: 100%;" />
                        </div>
                        <div class="col-md-12 col-lg-6" :style="windowWidth < 768 ? 'padding: .5rem;' : 'padding: 0 .5rem;'">
                            <h2 :style="'font-size: ' + adaptiveFontSize(1.4) + 'rem; line-height: ' + adaptiveFontSize(1.6) + 'rem;'">
                                {{productPreviewData.productName}}
                            </h2>
                            <p :style="'color: ' + brandColor + '; margin-top: .5rem;'">{{productPreviewData.byLine}}</p>
                            <p v-html="productPreviewData.productBlurb" class="gt-md" style="margin-top: .5rem;"></p>
                            <p v-html="productPreviewData.productBlurb" class="xs" style="margin-top: .5rem;"></p>
                        </div>
                    </div>
                </div>
                    
                <div class="col-lg-3 col-sm-5 col-xs-12" :style="windowWidth < 576 ? '' : 'padding: 0 0 0 1rem;'">
                    
                    <span v-if="productIsInShop && environmentProductAndTagState.includes('fetched')">
                        <h2 align="center" style="margin-bottom: 1rem;">
                            <span style="color: red; text-decoration: line-through;">{{productPreviewData.productAttributes && productPreviewData.productAttributes.regularPrice ? numeral(productPreviewData.productAttributes.regularPrice).format('$0.00') : ''}}</span>
                            {{productPreviewData.productPrice && productPreviewData.productPrice != 0 ? numeral(productPreviewData.productPrice).format('$0.00') : 'FREE'}}
                        </h2>
        
                        <q-btn size="lg" v-if="!owned && !inCart" @click="add2cart" id="add2cart" color="green" class="full-width">
                            <q-icon name="fa-cart-plus" style="margin-right: .5rem;" />
                            <h6>Add To Cart</h6>
                        </q-btn>
                        
                        <q-btn size="lg" v-if="inCart && !owned" @click="removeFromCart" id="removeFromCart" color="red" class="full-width">
                            <q-icon name="fa-times" style="margin-right: .5rem;" />
                            <h6>Remove From Cart</h6>
                        </q-btn>
                    
                        <q-btn size="lg" v-if="owned" color="purple" class="full-width" @click="">
                            <q-icon name="fa-check-circle" style="margin-right: .5rem;" />
                            <h6>Owned</h6>
                        </q-btn>
                        
                        <q-btn size="lg" id="giveAsGift" color="orange" class="full-width" @click="openGift()" style="margin-top: 1rem;">
                            <q-icon name="fa-gift" style="margin-right: .5rem;" />
                            <h6>Give Gift</h6>
                        </q-btn>
                    </span>
                    
                    <div v-if="!productIsInShop && environmentProductAndTagState.includes('fetched')" class="col-md-12 padded" align="center">
                        <h6>This product is not available for purchase.</h6>
                    </div>
                    
                    <div class="row justify-around" style="margin-top: 1rem;" align="center">
                        <div style="col">
                            <q-btn size="sm" round @click="showProductPreviewLink = !showProductPreviewLink" color="grey">
                                <q-icon name="fa-link" style="font-size: 1rem;" />
                            </q-btn>
                        </div>
                            
                        <div style="col">
                            <q-btn size="sm" round @click="share2Facebook(productPreviewData)" color="blue-9">
                                <q-icon name="fab fa-facebook" style="font-size: 1rem;" />
                            </q-btn>
                        </div>
                            
                        <div style="col">
                            <q-btn size="sm" round @click="share2Twitter(productPreviewData)" color="blue-5">
                                <q-icon name="fab fa-twitter" style="font-size: 1rem;" />
                            </q-btn>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: .5rem;">
                    <p v-html="productPreviewData.productBlurb" class="md"></p>
                    <p v-html="productPreviewData.productBlurb" class="sm"></p>
                </div>
            </div>
            
            <div class="bg-grey-3">
                <div class="row well" style="padding: 0 1rem;">
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
                
                    <div class="col-12" style="padding: 1rem;">
                        <h6 style="margin: .7rem 0;">
                            <span style="padding-left: 0;">Tags</span>
                        </h6>
                        
                        <div class="pchip" v-if="productPreviewData.productJSON && productPreviewData.productJSON.video" color="white">
                            <q-icon name="fa-play-circle" style="font-size: .8rem; margin: 0 .5rem 0 0;" />
                            Video 
                        </div>
                        <div class="pchip" v-if="productPreviewData.productJSON && productPreviewData.productJSON.audio" color="white">
                            <q-icon name="fa-music" style="font-size: .8rem; margin: 0 .5rem 0 0;" /> 
                            Audio 
                        </div>
                        <div class="pchip" v-if="productPreviewData.productJSON && productPreviewData.productJSON.pdf" color="white">
                            <q-icon name="fa-file-pdf" style="font-size: .8rem; margin: 0 .5rem 0 0;" /> 
                            PDF 
                        </div>
                        <div class="pchip" v-if="productPreviewData.productJSON && productPreviewData.productJSON.zip" color="white"> 
                            <q-icon name="fa-folder" style="font-size: .8rem; margin: 0 .5rem 0 0;" /> 
                            Additional Materials
                        </div>
                        
                        <div v-if="productTags" v-for="tag in productTags" class="pchip" color="white">
                            <q-icon name="fa-tag" style="font-size: .8rem; margin: 0 .5rem 0 0;" />
                            {{tag}}
                        </div>
                    </div>
                </div>
            </div>
        
            <giftDetail v-if="showGift" />
            
            <div class="well" style="padding: 2rem 1.5rem;">
                <h5 class="dividerHeader" style="margin-top: 0;"><span style="background: #fff; padding-left: 0;">Description</span></h5>
                <div v-if="productPreviewData" class="" v-html="productPreviewData.moreInfo"></div>
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
    import myWalkSubscribeButtons from '../mywalk/myWalkSubscribeButtons'
    
    import { productPreviewTools } from '../../../mixins/productPreviewTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { validProducts } from './walkAtHomeValidProducts'
    
    export default {
        
        mixins: [ productPreviewTools, globalComputedData, validProducts ],
        
        components: {
            myWalkSubscribeButtons
        },

        computed: {
            
            owned() {
                var active = false
                var product = this.environmentProducts && this.environmentProducts.length ? this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(this.productID2Preview)) : false
                if (product && product.userActiveProduct && this.validProductFilter(product)) active = true
                return active
            },
            
            coverImageURL() {
                return `https://vault.platformpurple.com/static/previews/${this.productPreviewData.productSKU}/${this.productPreviewData.productSKU}_ws.jpg`
            },
            
            productScope() {
                return this.currentView === 'myLibrary' ? this.userActiveProducts : this.forSaleProducts
            }
        },
        
        methods: {
            generateRelatedProducts(product) {
                k('generateRelatedProducts product tags: ', product.tags)
                
                var currentProductTags = product.tags.includes(',') ? product.tags.split(',') : [product.tags]
                var scoredProducts = this.productScope.map((product) => {
                    var productScore = 0
                    if (product.tags) {
                        var productTags = product.tags.includes(',') ? product.tags.split(',') : [product.tags]
                        currentProductTags.forEach((tagID) => {
                            productTags.forEach((productTagID) => {
                                if (tagID === productTagID) productScore++
                            })
                        })
                        
                        product.productScore = productScore
                        return product
                    }
                })
                .filter((product) => {
                    return product.productID !== Number(this.productID2Preview)
                })
                .sort((a, b) => {
                    return b.productScore - a.productScore
                })
                // k('scoredProducts: ', j(scoredProducts))
                this.relatedProducts = scoredProducts.slice(0, this.relatedProductCount)
            },
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
        color: #000;
        font-size: .8rem; 
        margin: .25rem;
        padding: .25rem .5rem;
        border-radius: .2rem;
        width: fit-content;
        width: -moz-fit-content;
        display: inline-flex;
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
