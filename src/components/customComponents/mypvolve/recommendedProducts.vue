<template>
    <div class="row well items-stretch justify-center q-pa-lg">
        <h3 class="monty q-ml-md col-12" :style="`color: ${pvolveMintTitle}`">
            YOU MAY ALSO LIKE:
        </h3>

        <div :class="colsSize" v-for="product in relatedProducts" :key="product.productID" style="padding: .5rem;">
            <div :is="productCardComponent" :componentData="product"></div>
        </div>
    </div>
</template>

<script>
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
import { globalComputedData } from '../../../mixins/globalComputedData'
import { productCardLoad } from '../../../mixins/productCardLoad'
import { pvolveColors } from './pvolveColors'
import { pvolveProductSectionTools } from './pvolveProductSectionTools'

import pvolveProductCard from './pvolveProductCard'

const RELATED_PRODUCT_COUNT = 4

export default {

    props: {
        //default bring workout products as recommended
        isNutritionProduct: {
            type: Boolean,
            default: () => false
        }
    },

    mixins: [ pvolveColors, userAndProductInfo, globalComputedData, productCardLoad, pvolveProductSectionTools ],

    components: { pvolveProductCard },

    data() {
        return {
            relatedProducts: []
        }
    },

    computed: {
        productPreviewData() {
            return this.$store.state.productPreviewData
        },

        relatedProductCount() {
            let productPreviewSectionData = this.environmentJSON.homePageSections.find(section => section.id === 'productPreview')
            return productPreviewSectionData && productPreviewSectionData.relatedProductCount || RELATED_PRODUCT_COUNT
        },

        userContentSchedulePreferences() {
            return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'contentSchedulePreferences') : null
        },

        userSelectedPreferenceTags() {
            return this.userContentSchedulePreferences ? this.userContentSchedulePreferences.userSelectedTags : null
        },

        colsSize() {
            return 'col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3'
        },

        equipmentTagHeadingID() {
            return this.$store.state.environmentTagHeadingObj.equipment.tagHeadingID
        },

        beginnerTagHeadingID() {
            return this.$store.state.environmentTagHeadingObj.level.tags.beginner.id
        },

        userSelectedEquipmentsTagID() {
            let matchingTags = this.userSelectedPreferenceTags
                ? this.userSelectedPreferenceTags.filter(tagID => this.environmentTags[tagID].tagHeadingID === this.equipmentTagHeadingID)
                : []

            return matchingTags.length > 0 ? matchingTags : [ this.beginnerTagHeadingID ]
        }
    },

    methods: {
        generateRelatedProducts() {
            let bundleProductIDs = this.bundleOrConnectedExclusiveProducts.map(bundleProduct => bundleProduct.productID)
            let productMatchTags = null
            let products = null

            if (this.isNutritionProduct) {
                products = this.nutritionProducts.filter(product => this.currentProduct.productID !== product.productID)
            } else {
                products = this.workoutProducts.filter(product => {
                    const productTags = product.tags.split(',')
                    const userSelectedEquipmentsTagIDToString = this.userSelectedEquipmentsTagID.map(tagID => String(tagID))
                    const tagsToMatch = [ ...userSelectedEquipmentsTagIDToString, ...this.userSelectedTags ]

                    const matchingProduct = productTags.filter(tagID => tagsToMatch.includes(tagID))

                    return matchingProduct.length && bundleProductIDs.includes(product.productID) && this.currentProduct.productID !== product.productID
                })
            }

            this.relatedProducts = this.j_.shuffleArray(products).slice(0, this.relatedProductCount)
        }
    },

    created() {
        if (this.environmentProducts && this.environmentProducts.length) this.generateRelatedProducts()
    },

    watch: {
        'productPreviewData': { deep: true, handler: 'generateRelatedProducts' },

        environmentProducts() {
            if (this.environmentProducts && this.environmentProducts.length) this.generateRelatedProducts()
        }
    }

}
</script>

<style>

</style>
