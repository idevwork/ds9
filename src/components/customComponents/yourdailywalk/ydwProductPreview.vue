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
            
            <div class="row well" style="padding: 2rem;">
                
                <div class="col-12">
                    <div class="row">
                        <div class="col-lg-3 col-md-5" :align="windowWidth < 576 ? 'center' : 'left'">
                            <img :src="coverImageUrl" style="max-width: 100%;" />
                        </div>
                        <div class="col-lg-8 col-md-7" :style="windowWidth < 768 ? 'padding: 1rem 0;' : 'padding: 0 1rem;'">
                            <h2 :style="'font-size: ' + adaptiveFontSize(1.4) + 'rem; line-height: ' + adaptiveFontSize(1.6) + 'rem;'">
                                {{productPreviewData.productName}}
                            </h2>
                            <p :style="'color: ' + brandColor + '; margin-top: .5rem;'">{{productPreviewData.byLine}}</p>
                            <p v-html="productPreviewData.productBlurb" style="margin-top: .5rem;"></p>
                        </div>
                    </div>
                </div>
                    
                <!--<div class="col-lg-3 col-sm-5 col-xs-12">-->
                    
                <!--    <h2 align="center" style="margin-bottom: 1rem;">{{numeral(productPreviewData.productPrice).format('$0.00')}}</h2>-->
    
                <!--    <q-btn size="lg" v-if="!owned && !inCart" @click="add2cart" id="add2cart" color="green" class="full-width" icon="fa-cart-plus">-->
                <!--        <h6>Add To Cart</h6>-->
                <!--    </q-btn>-->
                    
                <!--    <q-btn size="lg" v-if="inCart && !owned" @click="removeFromCart" id="removeFromCart" color="red" class="full-width" icon="fa-times">-->
                <!--        <h6>Remove From Cart</h6>-->
                <!--    </q-btn>-->
                
                <!--    <q-btn size="lg" v-if="owned" color="purple" class="full-width" icon="fa-check-circle" @click="">-->
                <!--        <h6>Owned</h6>-->
                <!--    </q-btn>-->
                    
                <!--    <q-btn size="lg" id="giveAsGift" color="orange" class="full-width" @click="openGift()" icon="fa-gift" style="margin-top: 1rem;">-->
                <!--        <h6>Give Gift</h6>-->
                <!--    </q-btn>-->
                    
                <!--    <div v-if="!productIsInShop && environmentProductAndTagState.includes('fetched')" class="col-md-12 padded" align="center">-->
                <!--        <h6>This product is not available for purchase.</h6>-->
                <!--    </div>-->
                    
                <!--    <div class="row justify-around" style="margin-top: 1rem;" align="center">-->
                <!--        <div style="col">-->
                <!--            <q-btn size="sm" round @click="showProductPreviewLink = !showProductPreviewLink" color="grey">-->
                <!--                <q-icon name="fa-link" style="font-size: 1rem;" />-->
                <!--            </q-btn>-->
                <!--        </div>-->
                            
                <!--        <div style="col">-->
                <!--            <q-btn size="sm" round @click="share2Facebook(productPreviewData)" color="blue-9">-->
                <!--                <q-icon name="fab fa-facebook" style="font-size: 1rem;" />-->
                <!--            </q-btn>-->
                <!--        </div>-->
                            
                <!--        <div style="col">-->
                <!--            <q-btn size="sm" round @click="share2Twitter(productPreviewData)" color="blue-5">-->
                <!--                <q-icon name="fab fa-twitter" style="font-size: 1rem;" />-->
                <!--            </q-btn>-->
                <!--        </div>-->
                <!--    </div>-->
                <!--</div>-->
                
                <!--<div style="margin-top: .5rem;">-->
                <!--    <p v-html="productPreviewData.productBlurb" class="md"></p>-->
                <!--    <p v-html="productPreviewData.productBlurb" class="sm"></p>-->
                <!--</div>-->
            </div>
            
            <div class="well" style="padding: 2rem 1.5rem;">
                <h5 class="dividerHeader" style="margin-top: 0;"><span style="background: #fff; padding-left: 0;">Description</span></h5>
                <div v-if="productPreviewData" class="" v-html="productPreviewData.moreInfo"></div>
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
            
            <div class="col-12 padded" :style="'background: ' + brandColor + ';'">
                <h4 class="text-white" align="center" style="margin-bottom: 0;">
                    Subscribe now!
                </h4>        
                <ydwSubscribeButtons @closePreview="$root.$emit('closeProductPreview')" />
            </div>
            
            <div style="height: 4rem"></div>
    
            <!--<div v-if="relatedProducts" class="bg-grey-3" style="padding: 1rem;">-->
            <!--    <div id="relatedProducts" class="row items-stretch justify-center relative-position padded well">-->
            <!--        <h4 class="col-12 dividerHeader" style="margin-top: 0;">-->
            <!--            <span style="background: #efefef; padding-left: 0;">You May Also Like</span>-->
            <!--        </h4>-->
            <!--        <div class="col-xs-6 col-sm-4 col-md-4 col-lg-3 col-xl-2" v-for="product in relatedProducts" :key="product.productID" style="padding: .5rem;">-->
            <!--            <productCard class="productCard" :componentData="product" />-->
            <!--        </div>-->
            <!--    </div>-->
            <!--</div>-->
        </div>
    </div>
    
</template>
<script>
    import ydwSubscribeButtons from './ydwSubscribeButtons'
    import { productPreviewTools } from '../../../mixins/productPreviewTools'

    export default {
        components: {
            ydwSubscribeButtons
        },
        
        mixins: [productPreviewTools]
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