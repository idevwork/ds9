<template>

    <div :is="productPreview" :componentData="productPreviewComponentData" />

</template>

<script>
    import defaultProductPreview from '../shop/productPreview'
    import pwywProductPreview from '../../common/shop/PWYWProductPreview'
    
    import { social } from '../../../mixins/social'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {

        components: {
            defaultProductPreview,
            pwywProductPreview
        },

        mixins: [social, productInfoTools, globalComputedData],

        data() {
            return {
                customProductPreview: false,
                productPreviewComponentData: ''
            }
        },

        computed: {
            productIsPwyw() {
                k('productIsPwyw: ', this.productPreviewData)
                let isPwyw = false

                if (this.productPreviewData && this.productPreviewData.pwyw_active) {
                  // check if date is valid
                  const [number, type] = this.productPreviewData.pwyw_saleInterval.split(" ")
                  const now = this.moment(new Date()) //today's date
                  const end = this.moment(this.productPreviewData.pwyw_saleStartDate).add(
                    number,
                    `${type.toLowerCase()}s`
                  ) // another date
                  const durationAsMinutes = this.moment.duration(end.diff(now)).asMinutes()
                  isPwyw = durationAsMinutes > 0

                }

                return isPwyw
            },

            productPreview() {
                k('productPreview computed: ', this.productIsPwyw, this.customProductPreview)
                let productPreview = this.productIsPwyw ? 'pwywProductPreview' : this.customProductPreview ? this.customProductPreview : 'defaultProductPreview'
                kw('productPreview: ', productPreview)
                
                return productPreview
            }
        },

        methods: {
            checkAndLoadCustomProductPreview() {
                this.productPreviewComponentData = this.homePageSectionFromID('productPreview')
                k('checkAndLoadCustomProductPreview: ', this.productPreviewComponentData)

                if (this.productPreviewComponentData.componentPath) {
                    this.loadIt(this.productPreviewComponentData.component, 'customComponents/' + this.productPreviewComponentData.componentPath.replace('.html', ''))
                    this.customProductPreview = this.productPreviewComponentData.component
                    
                    // this.initProductPreview()
                } else {
                    // this.initProductPreview()
                }
            }
        },

        watch: {
            homePageSections() {
                this.checkAndLoadCustomProductPreview()
            },
            
            productPreviewData() {
                k('productPreviewData hold: ', this.productPreviewData)
            }
        },

        created() {
            k('productPreviewHold init: ', this.productID2Preview, this.productPreviewData)
            
            this.checkAndLoadCustomProductPreview()
        }
    }
</script>

<style>
</style>
