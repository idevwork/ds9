import PurpleVideo from '../components/common/player/PurpleVideo'
import giftDetail from '../components/common/shop/giftDetail'

import { productCardLoad } from './productCardLoad'
import { social } from './social'
import { designTools } from './designTools'
import { productInfoTools } from './productInfoTools'

export const productPreviewTools = {

    props: ['componentData'],

    components: {
        giftDetail,
        PurpleVideo
    },

    mixins: [productCardLoad, social, designTools, productInfoTools],

    data() {
        return {
            videoID: '',
            showGift: '',
            relatedProducts: '',
            showProductPreviewLink: false,
            samplePlayerOptions: {
                // component options
                start: 0,
                playsinline: true,
                controls: true,

                // videojs options
                autoplay: true,
                muted: false,
                language: 'en',
                sources: [],
                height: "100%",
                aspectRatio: '16:9'
            },
            stripHTML(data) {
                return data.replace(/<\/?[^>]+>/gi, '')
            },
            currentDocumentTitle: '',

            iconForMediaTypeMap: {
                video: 'fa-play-circle',
                audio: 'fa-music',
                pdf: 'fa-file-pdf',
                zip: 'fa-folder'
            }
        }
    },
    computed: {

        hasSampleVideo() {
            return this.productPreviewData.sampleMovieDimensions && this.productPreviewData.sampleMovieDimensions !== 'null'
        },

        windowWidth() {
            return this.$store.state.windowWidth
        },

        productTags() {
            var productTagReturn = null
            if (this.environmentTags && this.productPreviewData.tags) {

                productTagReturn = []
                var productTagNames = this.productPreviewData.tags.split(',').map((tagID) => {

                    return this.environmentTags[tagID] ? this.environmentTags[tagID].tagName : false
                })
                productTagNames.forEach((tagName) => {
                    if (tagName && !productTagReturn.includes(tagName)) {
                        productTagReturn.push(tagName)
                    }
                })
            }
            return productTagReturn
        },

        productPreviewData() {
            return this.$root.$store.state.productPreviewData
        },

        productID2Preview() {
            return this.$root.$store.state.productID2Preview
        },

        environmentProducts() {
            return this.$root.$store.state.environmentProducts
        },

        environmentTags() {
            return this.$root.$store.state.environmentTags
        },

        productIsInShop() {
            var available = false
            var product = this.environmentProducts && this.environmentProducts.length ? this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(this.productID2Preview)) : false
            if (product && product.available4Sale) available = true
            return available
        },

        owned() {
            var active = false
            var product = this.environmentProducts && this.environmentProducts.length ? this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(this.productID2Preview)) : false
            if (product && product.userActiveProduct) active = true
            return active
        },

        inCart() {
            var product = this.productPreviewData
            var inCart = false
            this.cart.forEach((item) => {
                if (item.productID == product.productID && !item.recipientName) {
                    inCart = true
                }
            })
            if (product.recipientName) inCart = false
            return inCart
        },

        coverImageUrl() {
            return this.productPreviewData ? 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.productPreviewData.productSKU + '/' + this.productPreviewData.productSKU + '_image_cover.png' : ''
        },

        sampleVideoSrc() {
            return this.productPreviewData ? "https://w2d4h2w3.ssl.hwcdn.net/static/previews/" + this.productPreviewData.productSKU + "/" + this.productPreviewData.productSKU + "_sample.mp4" : ''
        },

        environmentData() {
            return this.$root.$store.state.environment.data ? this.$root.$store.state.environment.data : ''
        },

        environmentJSON() {
            return this.$root.$store.state.environment.json ? this.$root.$store.state.environment.json : ''
        },

        cart() {
            return this.$root.$store.state.cart
        },

        productPreviewLink() {
            return window.location.origin + '/shop/' + this.productPreviewData.productID + window.location.search
        },

        brandColor() {
            return this.$root.$store.state.environment.json ? this.$root.$store.state.environment.json.e.brandColor : ''
        },

        environmentProductAndTagState() {
            return this.$root.$store.state.environmentProductAndTagState
        },

        productPreviewModalOpen() {
            return this.$root.$store.state.productPreviewModalOpen
        },

        relatedProductCount() {
            let productPreviewSectionData = this.environmentJSON.homePageSections.find(section => section.id === 'productPreview')
            return productPreviewSectionData && productPreviewSectionData.relatedProductCount ? productPreviewSectionData.relatedProductCount : 6
        }
    },
    methods: {

        openGift() {
            this.showGift = !this.showGift
            if (document.getElementById(this.videoID)) document.getElementById(this.videoID).pause()

            if (this.showGift) {
                this.$nextTick(() => {
                    this.scrollIt('giftDetail', '#previewContainer .scroll')
                })
            }
        },

        add2cart() {
            k('add2cart!')

            if (this.inCart) {
                k('already in cart')
                return false
            }
            if (!this.productIsInShop) {
                this.$q.notify({
                   message: 'This product is not available for purchase.',
                   type: 'negative',
                   icon: 'fa-exclamation-circle',
                   position: 'bottom-left'
                })
                return false
            }

            var productInfo = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(this.productID2Preview))
            k('productInfo: ', productInfo)


            this.$store.commit('add2cart', productInfo)

            if (!this.environmentJSON.e.hideNotifyAddCart) {
                this.$q.notify({
                    message: 'Added product to cart!',
                    type: 'positive',
                    icon: 'fa-check-circle',
                    position: 'bottom-left'
                })
            }

            if (this.productPreviewModalOpen) {
                this.$root.$emit('closeProductPreview')
                this.$root.$on('closedProductPreview', () => {
                    this.$root.$off('closedProductPreview')
                    this.$root.$emit('openShopCart')
                })
            } else {
                this.$root.$emit('openShopCart')
            }
        },

        removeFromCart() {
            this.$store.commit('removeFromCart', this.productPreviewData)
            this.$q.notify({
               message: 'Removed product from cart!',
               type: 'negative',
               icon: 'fa-exclamation-circle',
               position: 'bottom-left'
            })
        },

        getProductPreviewData() {
            k('getProductPreviewData: ', this.productID2Preview)

            this.getProductMetaFromAPI(this.productID2Preview, (res) => {
                k('product preview data: ', res)

                var productData = res.productMeta
                if (productData.byLine) productData.byLine = this.stripHTML(productData.byLine)
                if (productData.productAttributes) productData.productAttributes = JSON.parse(productData.productAttributes)
                k('productPreviewData: ', productData)

                this.$store.commit('setProductPreviewData', productData)

                this.currentDocumentTitle = document.title
                document.title = productData.productName

                this.initVideo()

                if (this.environmentProducts) this.generateRelatedProducts(productData)
                var logEventObj = {
                    eventType: 'productDetail',
                    eventDesc: 'viewing product detail for "' + productData.productName + '"',
                    productSKU: productData.productSKU,
                    clientProductSKU: productData.clientProductSKU,
                    productID: this.productID2Preview
                }
                this.api.sendEvent(logEventObj)
            })
        },

        initVideo() {
            k('init video: ', this.productPreviewData, this.sampleVideoSrc)
            this.samplePlayerOptions.sources = []
            this.samplePlayerOptions.sources.push({
                type: 'video/mp4',
                src: this.sampleVideoSrc
            })
        },

        playerReadied(player) {
            this.videoID = player.id_ + '_html5_api'
        },

        generateRelatedProducts(product) {
            // relies on environmentProducts existing
            k('generateRelatedProducts product tags: ', product.tags)

            var currentProductTags = product.tags.includes(',') ? product.tags.split(',') : [product.tags]
            
            var scoredProducts = this.environmentProducts.map((product) => {
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

            this.relatedProducts = scoredProducts.slice(0, this.relatedProductCount)
        },

        initProductPreview() {
            if (this.productID2Preview) {
                this.getProductPreviewData()
            }
        }
    },

    watch: {
        productID2Preview() {
            k('productID2Preview preview watch: ', this.productID2Preview)

            this.initProductPreview()
        },

        environmentProducts() {
            if (this.productPreviewData && this.environmentProducts) this.generateRelatedProducts(this.productPreviewData)
        }
    },

    mounted() {
        k('productID2Preview preview init: ', this.productID2Preview)

        this.initProductPreview()

        this.$root.$on('closeGiftDetail', () => {
            this.showGift = false
        })
    },

    beforeDestroy() {
        document.title = this.currentDocumentTitle
    }
}