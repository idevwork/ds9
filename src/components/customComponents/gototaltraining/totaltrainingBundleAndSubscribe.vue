<template>

    <div>
    
        <div class="row well">
            <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                <div class="bg-grey-3 relative-position" style="height: calc(100% - 1rem); padding-bottom: 6rem;">
                    <div class="row" style="padding: .5rem;">
                        <div class="col-2" align="center" style="padding: 1rem;">
                            <q-icon :name="componentData.bundleIcon" :style="`font-size: 3rem; color: ${bundleColors[componentData.bundleProductID]};`" />
                        </div>
                        
                        <div class="col-10" style="padding: 1rem .5rem;">
                            <h5>{{componentData.bundleTitle}} Bundle</h5>
                            <h6 style="line-height: 1.25rem;">Unlimited access to {{bundleProductData(componentData.bundleProductID) && bundleProductData(componentData.bundleProductID).bundleProducts ? bundleProductData(componentData.bundleProductID).bundleProducts.split(',').length : ''}} {{bundleProductData(componentData.bundleProductID).productName}} courses.</h6>
                        </div>
                    </div>
                    
                    <div class="actions row">
                        <div class="col-xs-6" align="center" style="padding: .5rem;">
                            <h3 v-if="bundleProductData(componentData.bundleProductID)">${{bundleProductData(componentData.bundleProductID).productPrice}}<span style="font-size: 1rem;"> / mo</span></h3>
                        </div>
                        
                        <div class="col-xs-6" align="center" style="padding: .5rem;">
                            <q-btn @click="subscribeNow(String(componentData.bundleProductID))" :style="`color: white; background: ${brandColor};`">
                                Subscribe Now
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                <div class="bg-grey-3 relative-position" style="height: calc(100% - 1rem); padding-bottom: 6rem;">
                    <div class="row" style="padding: .5rem;">
                        <div class="col-2" align="center" style="padding: .5rem;">
                            <img v-if="monthlySubscriptionProductData" :src="coverImageUrl(monthlySubscriptionProductData)" style="max-width: 100%;" />
                        </div>
                        
                        <div class="col-10" style="padding: .5rem;">
                            <h5>Total Training: All Access</h5>
                            <h6>Unlimited access to our entire library of {{monthlySubscriptionProductData.bundleProducts.split(',').length}} courses.</h6>
                        </div>
                        
                    </div>
                    <div class="actions row">
                        <div class="col-xs-6" align="center" style="padding: .5rem;">
                            <h3 v-if="monthlySubscriptionProductData">${{monthlySubscriptionProductData.productPrice}}<span style="font-size: 1rem;"> / mo</span></h3>
                        </div>
                        
                        <div class="col-xs-6" align="center" style="padding: .5rem;">
                            <q-btn @click="subscribeNow(monthlySubscriptionProductData.productID)" :style="`color: white; background: ${brandColor};`">
                                Subscribe Now
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </div>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { totaltrainingColors } from './totaltrainingColors'

    export default {
        props: ['componentData'],
        
        mixins: [globalComputedData, totaltrainingColors],
        
        data() {
            return {
                coverImageUrl(product) {
                    return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + product.productSKU + '/' + product.productSKU + '_image_cover.png'
                },
                
                bundleProductData(productID) {
                    let product = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', productID)
                    k('bundleProductData: ', productID, this.environmentProducts, product)
                    return product
                },
                
                bundleIcons: {
                    151318: 'fa-code',
                    151319: 'fa-lightbulb',
                    151320: 'fa-paint-brush'
                }
            }
        },
    
        computed: {
            monthlySubscriptionProductData() {
                let product = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', 14692)
                k('monthlySubscriptionProductData: ', 14692, this.environmentProducts, product)
                return product
            },
            
            bundleColors() {
                return {
                    151318: this.darkRed,
                    151319: this.darkGreen,
                    151320: this.darkBlue
                }
            }
        },
    
        methods: {
            subscribeNow(productID) {
                k('subscribeNow!')
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.cart', value: String(productID) })
                this.route('/shop/checkout')
            }
        },
    
        mounted() {
            
        }
    }
</script>

<style scoped>
    .actions {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 1rem;
    }
</style>
