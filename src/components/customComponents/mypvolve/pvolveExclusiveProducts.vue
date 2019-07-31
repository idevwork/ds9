<template>
    
    <div id="pvolveExclusiveProducts" v-if="userHasAccessToAnyShelfItems" :style="`background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'};`">
        <div class="row well">
            
            <h2 class="col-12 dividerHeader" align="center" style="margin: 1rem 0;">
                <span :style="`color: #333; background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'}`">{{componentData.heading}}</span>
            </h2>
            
            <div v-if="exclusiveProducts.length" class="row justify-center full-width">
                <div v-for="product in exclusiveProducts" :class="componentData.columnClass ? componentData.columnClass : 'col-xs-6 col-sm-4 col-md-3 col-lg-2'" style="padding: .5rem;">
                    <div :is="productCardComponent" class="productCard" :componentData="product"></div>
                </div>
            </div>
            
            <!--<div class="col-12" align="center" style="margin: 2rem 0;">-->
            <!--    <h2>Access your exclusive products</h2>-->
                
            <!--    <q-btn outline @click="route('/library')" size="lg" :style="`background: #fff !important; color: #333; margin: 1rem 0;`">-->
            <!--        <h6 style="font-size: 1rem; letter-spacing: 1px;">Go To My Library</h6>-->
            <!--    </q-btn>-->
            <!--</div>-->
        </div>
        
    </div>
      
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { productCardLoad } from '../../../mixins/productCardLoad'

    import pvolveStructuredProductPreview from './pvolveStructuredProductPreview.vue'

    export default {
        props: [ 'componentData' ],
        
        components: {
            pvolveStructuredProductPreview
        },
        
        mixins: [ pvolveColors, userAndProductInfo, productInfoTools, productCardLoad ],
        
        data() {
            return {

            }
        },
        
        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },
            
            environmentJSON() {
                return this.$store.state.environment.json
            },
            
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
    
            authenticated() {
                return this.$store.state.user.authenticated
            },
            
            // userSubscriptionProductStatusHistory() {
            //     return this.$store.state.userSubscriptionProductStatusHistory
            // },
            
            // previouslyOwnedTrial() {
            //     return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length
            // },
            
            // subscriptionAccessType() {
            //     return this.userSubscriptionProductStatusHistory && 
            //         this.userSubscriptionProductStatusHistory.length ?
            //         this.userSubscriptionProductStatusHistory[0].accessType : ''
            // },
            
            exclusiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    // k('exclusiveProduct: ', product.productName, product)
                    return product.productType === 'exclusiveContent' && product.userActiveProduct && product.webplayer
                }) : []
            },
            
            specialProductRoutes() {
                return this.environmentJSON.e.specialProductRoutes
            },
            
            userHasAccessToAnyShelfItems() {
                let exclusiveProductIDs = this.exclusiveProducts.map((product) => {
                    return product.productID
                })
                return this.userHasAccess(exclusiveProductIDs)
            }
        },
        
        created() {
            kw('pvolveExclusiveProducts! ', this.exclusiveProducts)
            // k('userSubscriptionProductStatusHistory: ', this.userSubscriptionProductStatusHistory)
        },
        
        mounted() {
            
        },
        
        watch: {
            environmentProducts() {
                k('exclusiveProducts: ', this.exclusiveProducts)
            },

            currentProduct() {
                kw('currentProduct pvolve: ', this.currentProduct)
            }
        },
        
        methods: {
         
        }
    }
</script>

<style>

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

</style>
