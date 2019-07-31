<template>

    <div style="padding: 2rem 0;">
    
        <div class="row justify-center well">
            <h2 class="col-12 dividerHeader" align="center">
                <span style="background: #fff;">MOST VALUED BUNDLES</span>
            </h2>
            
            <div v-if="bundleProducts.length" v-for="bundle in bundleProducts" class="col-sm-12 col-md-6 col-lg-4" style="padding: .5rem;">
                <q-card class="bg-grey-3 no-shadow" style="height: calc(100% - 1rem);">
                    <q-card-main class="row" style="padding: 0;">
                        
                        <div class="col-3" align="center" style="padding: 2rem 1rem;">
                            <q-icon v-if="bundle.productID !== 14692" :name="bundleIcons[bundle.productID]" :style="`font-size: 2.5rem; color: ${bundleColors[bundle.productID]};`" />
                            <img v-else :src="coverImageURL(bundle)" style="max-width: 100%; margin: 0 auto; display: block;" />
                        </div>
                        
                        <div class="col-9" style="padding: 1rem;">
                            <h5 style="margin: .5rem 0; font-weight: 700; line-height: 1.5rem;">{{bundle.productName}} Bundle</h5>
                            <h6 style="line-height: 1.25rem;">Unlimited access to {{bundle.bundleProducts.split(',').length}} {{bundle.productName}} courses.</h6>
                        </div>
                    </q-card-main>
                        
                    <q-card-main class="row" style="padding: 0;">
                        <div class="col-sm-12 col-md-7" align="center" style="padding: 1rem;">
                            <h4 style="line-height: 2rem;">${{bundle.productPrice}}<span style="font-size: 1rem;"> / mo</span></h4>
                        </div>
                        
                        <div class="col-sm-12 col-md-5" align="right" style="padding: 1rem;">
                            <q-btn @click="subscribeNow(String(componentData.bundleProductID))" :style="`background: ${brandColor}; color: #fff;`">
                                SUBSCRIBE NOW
                            </q-btn>
                        </div>
                    </q-card-main>
                </q-card>
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
                coverImageURL(bundle) {
                    // return `https://f3r6v6t8.ssl.hwcdn.net/static/previews/${this.componentData.productSKU}/${this.componentData.productSKU}_500px_cover.png`
                    return `https://f3r6v6t8.ssl.hwcdn.net/static/previews/${bundle.productSKU}/${bundle.productSKU}_image_cover.png`
                },
                
                bundleProductIDs: [151318, 151320, 151319, 14692],
                
                bundleProductData(productID) {
                    let product = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', productID)
                    k('bundleProductData: ', productID, this.environmentProducts, product)
                    return product
                },
                
                bundleIcons: {
                    151318: 'fa-code',
                    151319: 'fa-paint-brush',
                    151320: 'fa-lightbulb'
                }
            }
        },
    
        computed: {
            bundleProducts() {
                return this.environmentProducts ? this.bundleProductIDs.map((productID) => {
                    return this.bundleProductData(productID)
                }) : []
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
    
</style>
