<template>

    <div id="pvolveVideoLayout" class="row">

        <div class="col-12 row">

            <div v-if="userOwned" class="col-12" style="padding-bottom: .5rem;">
                <q-btn id="backToLibrary" @click="goBack()" flat :style="`color: ${pvolveSalmon}; margin-top: .5rem;`">
                    <q-icon name="fa-chevron-left" style="margin-right: .5rem;" />
                    <h6>Back</h6>
                </q-btn>
            </div>

            <div v-if="userOwned" class="col-sm-12 col-xl-6" style="padding: 0 1rem;">

                <purple-video
                    ref="videoPlayer"
                    id="watch"
                    :options="pvolvePlayerOptions"
                    v-if="pvolvePlayerOptions.sources && pvolvePlayerOptions.sources.length"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @loadeddata="onPlayerLoadeddata($event)"
                    @playing="onPlayerPlaying($event)"
                    @timeupdate="onPlayerTimeupdate($event)"
                    @ended="onPlayerEnded($event)"
                    @error="onPlayerError($event)"
                    @ready="$emit('playerReady')"
                />

                <div v-if="chapters.length > 1" align="center">
                    <h5 :style="'color: ' + pvolveSalmon + ';'">{{ currentChapter.displayName }}</h5>
                </div>

            </div>

            <div v-if="!userOwned" class="col-sm-12 col-xl-6" style="padding: 1rem;">

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

                <img v-else :src="coverImageURL" style="max-width: 100%; margin: 0 auto; display: block;" />
            </div>

            <div class="col-sm-12 col-xl-6">

                <div style="padding: 1rem;">
                    <h5 :style="'letter-spacing: -1px; color: ' + pvolveMintTitle + '; text-transform: none; margin-top: 0;'" class="monty">{{currentProduct.productName || productPreviewData.productName}}</h5>
                    <p id="longDescription" v-html="currentProduct.moreInfo || productPreviewData.moreInfo" style="margin-top: 1rem; line-spacing: 2rem;"></p>
                </div>

                <div class="row" style="padding: 1rem;">

                    <div id="sharing" class="col-sm-4 q-mt-lg">
                        <h5 :style="`color: ${pvolveMintTitle}; margin: 0;`">Sharing:</h5>

                        <a id="share-email" :href="mailTo" target="_blank">
                            <q-btn size="md" round flat color="grey">
                                <q-icon name="fa-envelope" color="grey" />
                            </q-btn>
                        </a>

                        <q-btn id="share-facebook" size="md" round flat @click="share2Facebook(currentProduct || productPreviewData)" color="grey">
                            <q-icon name="fab fa-facebook-f" />
                        </q-btn>

                        <q-btn id="share-twitter" size="md" round flat @click="share2Twitter(currentProduct || productPreviewData)" color="grey">
                            <q-icon name="fab fa-twitter" />
                        </q-btn>
                    </div>

                    <div id="commentsPreview" class="col-sm-8">
                        <pvolveCommentPreview v-if="commentLength" :commentLength="commentLength" :previewComment="previewComment" @readAllReviews="scrollToReviews()" />
                    </div>

                </div>


                <div v-if="currentProduct.productJSON && chapters.length > 1" style="border-top: 1px solid #eee; margin: 1rem 0;">
                    <h4 :style="'color: ' + pvolveSalmon + ';'">Chapters</h4>

                    <div v-for="(chapter, index) in chapters">
                        <q-btn @click="$emit('playChapter', index)" color="grey-5" class="full-width" style="border: solid 1px #ccc; margin: .3rem 0;">
                            <q-icon name="fa-play" style="margin-right: .5rem; font-size: 1rem;" />
                            <span class="monty">{{ chapter.displayName }}</span>
                        </q-btn>
                    </div>
                </div>
            </div>

        </div>

        <div class="col-12 q-mt-lg bg-grey-3" style="padding: 1rem 0;">
            <recommendedProducts />
        </div>

        <div v-if="userOwned" class="col-12 bg-grey-3" style="padding: 2rem; margin-top: 1rem;">
            <recommendProductToFriend :product="currentProduct" />
        </div>

        <div v-if="!userOwned" class="col-12 bg-grey-3" align="center" style="padding: 2rem 1rem;">
            <pvolveTrialOrSubscribe :componentData="{}" @subscribe="goToSignUpNow()" @trial="goToTrial()" />
        </div>

        <div v-if="equipmentUsed && equipmentUsed.length" class="col-12" style="padding: 1rem;">
            <pvolveMiniShop :equipmentUsed="equipmentUsed" />
        </div>

        <div id="commentsDisplay" class="col-12">
            <CommentsDisplay :productID="currentProduct.productID || productID2Preview" :previewMode="!userOwned" @comments="generateCommentQuickLook" :ratingImageSrc="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png'" />
        </div>

    </div>

</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import pvolveMiniShop from './pvolveMiniShop'
    import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
    import PvolveCommentPreview from './pvolveCommentPreview.vue'
    import pvolveTrialOrSubscribe from './pvolveTrialOrSubscribe.vue'
    import pvolveNutritionLayout from './pvolveNutritionLayout.vue'
    import recommendProductToFriend from './recommendProductToFriend.vue'
    import recommendedProducts from './recommendedProducts.vue'

    import { pvolveColors } from './pvolveColors'
    import { pvolveShopifyData } from './pvolveShopifyData'
    import { videoPlayback } from '../../../mixins/videoPlayback'
    import { productPreviewTools } from '../../../mixins/productPreviewTools'
    import { social } from '../../../mixins/social'
    import { productInfoTools } from '../../../mixins/productInfoTools'

    export default {
        props: ['currentChapter', 'playerOptions'],

        mixins: [pvolveColors, videoPlayback, social, productInfoTools, pvolveShopifyData, productPreviewTools ],

        components: { pvolveMiniShop, CommentsDisplay, PurpleVideo, PvolveCommentPreview, pvolveTrialOrSubscribe, recommendProductToFriend, pvolveNutritionLayout, recommendedProducts },

        data() {
            return {
                commentLength: 0,
                previewComment: '',
                mailTo: 'mailto:?subject=Check out p.volve on demand!&body=I just finished my p.volve workout! Check out p.volve here: https://pvolve.com'
            }
        },

        computed: {
            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            pvolvePlayerOptions() {
                let pvolvePlayerOptions = this.playerOptions || {}
                    pvolvePlayerOptions.aspectRatio = '16:9'
                return pvolvePlayerOptions
            },

            goingTo() {
                return this.$store.state.goingTo
            },

            coverImageURL() {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + (this.currentProduct.productSKU || this.productPreviewData.productSKU) + '/' + (this.currentProduct.productSKU || this.productPreviewData.productSKU) + '_500px_cover.png'
            },

            userOwned() {
                return this.currentProduct.userActiveProduct
            },

            chapterIndexToStartFrom() {
                return this.$store.state.chapterIndexToStartFrom
            },

            environmentData() {
                return this.$store.state.environment.data
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            productPreviewModalOpen() {
                return this.$store.state.productPreviewModalOpen
            },

            initialParameters() {
                return this.$store.state.initialParameters
            },

            productID2Preview() {
                return this.$store.state.productID2Preview
            },

            productPreviewData() {
                return this.$store.state.productPreviewData
            }
        },

        methods: {
            goBack() {
                k('goBack: ', this.$store.state.comingFrom)
                this.$store.state.comingFrom !== '/' ? this.$router.back() : this.route('/')
            },

            goToTrial() {
                if (this.productPreviewModalOpen) {
                    this.$root.$emit('closeProductPreview')
                    this.$root.$on('closedProductPreview', () => {
                        this.route('/trial')
                        this.$root.$off('closedProductPreview')
                    })
                } else {
                    this.route('/trial')
                }
            },

            goToSignUpNow() {
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.signUpNow', value: true })
                this.route('/offer/special?signUpNow=true')
            },

            generateCommentQuickLook(comments) {
                k('generateCommentQuickLook: ', comments)
                this.commentLength = comments.length
                this.previewComment = comments.length ? comments[0] : ''
            },

            scrollToReviews() {
                var container = this.userOwned ? '' : '#previewContainer .scroll'
                this.scrollIt('commentsDisplay', container)
            }
        },

        created() {
            k('pvolve video layout created: ', this.productID2Preview)
            k('currentProduct: ', this.currentProduct)
            k('productPreviewData: ', this.productPreviewData)

            if (this.currentProduct) {
                this.getShopifyProductDataIfNeeded()
            }
        }

    }
</script>

<style scoped>
    .transportButton {
        padding: .5rem;
        color: #000 !important;
    }

    .pchip {
        /* width: fit-content; */
        color: #fff;
        background: #fff;
        border-radius: .25rem;
        padding: .25rem .5rem;
        margin: 0;
    }
</style>
