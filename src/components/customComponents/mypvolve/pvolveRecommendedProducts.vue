<template>
    
    <div id="pvolveRecommendedProducts" v-if="recommendedProducts && recommendedProducts.length" :style="`background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'};`">
        <div class="row well">
            
            <h2 class="col-12 dividerHeader" align="center" style="margin: 1rem 0;">
                <span :style="`color: #333; background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'}`">{{componentData.heading}}</span>
            </h2>
            
            <div class="row justify-center full-width">
                <div v-for="product in recommendedProducts" :class="componentData.columnClass ? componentData.columnClass : 'col-xs-6 col-sm-4 col-md-3 col-lg-2'" style="padding: .5rem; position: relative;">
                    <q-btn round flat size="sm" @click="hideRecommendation(product)" style="background: white; color: red; z-index: 99; position: absolute; top: 0; right: 0; padding: 0 0.5rem;">
                        <q-icon name="fa-times" style="font-size: 1rem; margin: 0;" />
                    </q-btn>
                    
                    <div :is="productCardComponent" class="productCard" :componentData="product" style="height: auto;"></div>
                    
                    <div style="padding: .5rem;">
                        <p class="monty" align="center" style="margin: 0; font-size: .8rem;">Recommended By <span :style="`color: ${pvolveSalmon};`">{{productRecommendationForID(product).recommendedBy}}</span></p>
                    </div>
                </div>
                
            </div>
        </div>
        
    </div>
      
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { productCardLoad } from '../../../mixins/productCardLoad'

    import pvolveStructuredProductPreview from './pvolveStructuredProductPreview.vue'

    export default {
        props: [ 'componentData' ],
        
        components: {
            pvolveStructuredProductPreview
        },
        
        mixins: [ globalComputedData, pvolveColors, userAndProductInfo, productCardLoad ],
        
        data() {
            return {
                productRecommendationForID(product) {
                    return this.productRecommendationList.find(recommendation => { return recommendation.productID === product.productID })
                },
                
                userHid(product) {
                    return this.productRecommendationForID(product) ? this.productRecommendationForID(product).userHid : ''
                }
            }
        },
        
        computed: {
            specialProductRoutes() {
                return this.environmentJSON.e.specialProductRoutes
            },
                        
            productRecommendationList() {
                return this.userPreferences ? this.userPreferences.filter(preference => { return preference.type === 'productRecommendation' }) : []
            },
                                    
            productRecommendationListIDs() {
                return this.productRecommendationList ? this.productRecommendationList.map(product => {
                    return product.productID
                }) : []
            },
            
            recommendedProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    if (this.productRecommendationListIDs.includes(product.productID)) k('recommendedProduct: ', product.productName, product)
                    return this.productRecommendationListIDs.includes(product.productID) && product.userActiveProduct && product.webplayer && !this.productRecommendationForID(product).userHid
                }) : []
            }
        },
        
        watch: {
            environmentProducts() {
                k('recommendedProducts: ', this.recommendedProducts)
            },

            currentProduct() {
                kw('currentProduct pvolve: ', this.currentProduct)
            }
        },
        
        methods: {
            hideRecommendation(product) {
                let req = this.productRecommendationForID(product)
                    req.userHid = true
                k('hideRecommendation req: ', req)

                this.saveUserPreferenceToAPI(req.id, req, () => {
                    var logEventObj = {
                        eventType: 'productRecommendationHidByUser',
                        eventDesc: `${this.userInfo.firstName || this.userInfo.userEmail} hid the recommendation ${product.productName} from ${req.recommendedBy}`,
                        userID: this.userInfo.userID,
                        productID: product.productID,
                        productName: product.productName
                    }
                    
                    this.api.sendEvent(logEventObj)
                })
            },
        },
        
        created() {
            kw('productRecommendationList! ', this.productRecommendationList)
            // kw('productRecommendationListIDs! ', this.productRecommendationListIDs)
            // k('userSubscriptionProductStatusHistory: ', this.userSubscriptionProductStatusHistory)
            
            if (this.userInfo) this.getUserPreferences(() => {}, true)
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
