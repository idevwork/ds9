<template>
    
    <div id="pvolveOwnedProducts" v-if="showOwnedProducts" :style="`margin: 3rem 0; background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'};`">
        <h2 class="col-12 dividerHeader" align="center" style="margin: 1rem 0;">
            <span :style="`color: #333; background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'}`">{{componentData.heading}}</span>
        </h2>
            
        <div v-if="!$q.platform.is.mobile && ownedProducts.length" class="row well justify-center col-12">
            <div v-for="product in ownedProducts" :class="componentData.columnClass ? componentData.columnClass : 'col-xs-6 col-sm-4 col-md-3 col-lg-2'" style="padding: .5rem;">
                <div :is="productCardComponent" class="productCard" :componentData="product"></div>
            </div>
        </div>
        
        <div v-if="$q.platform.is.mobile && ownedProducts.length">
            <div v-if="ownedProducts.length" id="mobileCards" class="relative-position">
                <div 
                    class="mobileCard"
                    v-for="product in ownedProducts"
                    style="padding: .5rem;" 
                >
                    <div :is="productCardComponent" class="productCard" :componentData="product"></div>
                </div>
            </div>
            <!--<div align="right" style="padding: 0 .5rem;">-->
            <!--    <h6 class="text-grey-5" style="font-size: .8rem; vertical-align: middle;">scroll <q-icon name="fas fa-chevron-right" style="font-size: .7rem; vertical-align: baseline;" /> <q-icon name="fas fa-chevron-right" style="font-size: .7rem; vertical-align: baseline;" /></h6>-->
            <!--</div>-->
        </div>
        
        <!--<div class="col-12" align="center" style="margin: 2rem 0;">-->
        <!--    <h2>Access your exclusive products</h2>-->
            
        <!--    <q-btn outline @click="route('/library')" size="lg" :style="`background: #fff !important; color: #333; margin: 1rem 0;`">-->
        <!--        <h6 style="font-size: 1rem; letter-spacing: 1px;">Go To My Library</h6>-->
        <!--    </q-btn>-->
        <!--</div>-->
        
    </div>
      
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { productCardLoad } from '../../../mixins/productCardLoad'

    import pvolveStructuredProductPreview from './pvolveStructuredProductPreview.vue'

    export default {
        props: [ 'componentData' ],
        
        components: {
            pvolveStructuredProductPreview
        },
        
        mixins: [ pvolveColors, userAndProductInfo, globalComputedData, productInfoTools, productCardLoad ],
        
        data() {
            return {

            }
        },
        
        computed: {
            ownedProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    // k('exclusiveProduct: ', product.productName, product)
                    return product.userActiveProduct && product.webplayer
                }) : []
            },
            
            validSubscriptionProductIDs() {
                return this.environmentJSON.e.validSubscriptionProductIDs
            },
            
            showOwnedProducts() {
                return this.ownedProducts.length && !this.userHasAccess(this.validSubscriptionProductIDs)
                // return this.ownedProducts.length 
            }
        },
        
        created() {
            kw('pvolveOwnedProducts! ', this.ownedProducts)
            // k('userSubscriptionProductStatusHistory: ', this.userSubscriptionProductStatusHistory)
        },
        
        mounted() {
            
        },
        
        watch: {
            environmentProducts() {
                k('ownedProducts: ', this.ownedProducts)
            },

            currentProduct() {
                kw('currentProduct pvolve: ', this.currentProduct)
            }
        },
        
        methods: {
         
        }
    }
</script>

<style scoped>

    .floatingBadge {
        position: absolute;
        right: 0;
        top: 0;
        padding: .25rem .5rem;
        color: #fff;
        font-size: .8rem;
        font-weight: 700;
        border: 2px solid white;
    }
    
    #mobileCards {
        min-width: 100%;
        min-height: 5rem;
        display: flex;
        overflow-x: scroll;
        overflow: -moz-scrollbars-none;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
    }
    
    .mobileCard {
        min-width: 20rem;
        max-width: 20rem;
    }
    
    #mobileCards::-webkit-scrollbar {
        display: none;
    }

</style>
