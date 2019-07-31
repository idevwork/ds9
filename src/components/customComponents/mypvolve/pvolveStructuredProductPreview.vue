<template>

    <div id="pvolveStructuredProductPreview">
        <q-inner-loading :visible="!currentProduct" />

        <div v-if="currentProduct" style="padding: 1rem;">

            <div v-if="hasSampleVideo">
                <purple-video
                    ref="videoPlayer"
                    id="sampleWatch"
                    :options="samplePlayerOptions"
                    v-if="samplePlayerOptions.sources && samplePlayerOptions.sources.length"
                    @ready="playerReadied"
                    style="max-width: 720px; margin: 0 auto;"
                />
            </div>

            <img v-else :src="coverImageURL(currentProduct)" style="max-width: 100%; margin: 0 auto; display: block;" />

            <h5 class="thickHeader monty" :style="headerStyle">{{currentProduct.productName}}</h5>
            <div id="longDescription" v-html="currentProduct.moreInfo" style="line-spacing: 2rem;" />

            <pvolveCommentPreview v-if="commentLength" :commentLength="commentLength" :previewComment="previewComment" @readAllReviews="scrollToReviews()" />

        </div>

        <div id="commentsDisplay" v-if="showComments" class="col-12">
            <CommentsDisplay :productID="currentProduct.productID || productID2Preview" :previewMode="true" @comments="generateCommentQuickLook" :ratingImageSrc="ratingImageSrc" />
        </div>
    </div>


</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { pvolveShopifyData } from './pvolveShopifyData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { productPreviewTools } from '../../../mixins/productPreviewTools'

    import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
    import PvolveCommentPreview from './pvolveCommentPreview.vue'

    export default {
        props: [ 'componentData' ],

        components: {
            CommentsDisplay, PvolveCommentPreview
        },

        mixins: [ pvolveColors, userAndProductInfo, productInfoTools, pvolveShopifyData, productPreviewTools ],

        data() {
            return {
                showComments: false,
                commentLength: 0,
                previewComment: '',
                ratingImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png',

                coverImageURL(item) {
                    k('structured product coverImageURL: ', item)
                    return `https://vault.platformpurple.com/static/previews/${item.productSKU}/${item.productSKU}_500px_cover.png`
                }
            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },

            productPreviewData() {
                return this.$store.state.productPreviewData
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            authenticated() {
                return this.$store.state.user.authenticated
            },

            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },

            subscriptionAccessType() {
                return this.userSubscriptionProductStatusHistory &&
                    this.userSubscriptionProductStatusHistory.length ?
                    this.userSubscriptionProductStatusHistory[0].accessType : ''
            },

            userOwned() {
                return this.currentProduct.userActiveProduct
            },

            headerStyle() {
                return {
                    color: this.pvolveSalmon,
                    'margin-top': '.5rem'
                }
            }
        },

        created() {
            kw('pvolveStructuredProduct preview: ', this.productPreviewData)
        },

        mounted() {
            let userCameFromPvolveStructuredProducts = this.localStorage.get('userCameFromPvolveStructuredProducts')
            kw('userCameFromPvolveStructuredProducts: ', userCameFromPvolveStructuredProducts)

            if (userCameFromPvolveStructuredProducts) {
                this.$nextTick(() => {
                    this.scrollIt('pvolveStructuredProducts', '', 50)
                    this.localStorage.set('userCameFromPvolveStructuredProducts', false)
                })
            }
        },

        watch: {
            productPreviewData() {
                kw('productPreviewData pvolve: ', this.productPreviewData)
                this.$store.commit('setCurrentProduct', this.productPreviewData)
                // this.getShopifyProductDataIfNeeded()
                this.showComments = true
            }
        },

        methods: {

            generateCommentQuickLook(comments) {
                k('generateCommentQuickLook: ', comments)
                this.commentLength = comments.length
                this.previewComment = comments.length ? comments[0] : ''
            },

            scrollToReviews() {
                var container = '#structuredProductDetails .scroll'
                this.scrollIt('commentsDisplay', container)
            }
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
