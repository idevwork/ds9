<template>

    <div id="pvolveNutritionLayout" class="row flex flex-center">

        <div v-if="userOwned" class="col-12" style="padding-bottom: .5rem;">
            <q-btn id="backToLibrary" @click="goBack()" flat :style="'color: ' + pvolveSalmon + '; margin-top: .5rem;'">
                <q-icon name="fa-chevron-left" style="margin-right: .5rem;" />
                <h6>Back</h6>
            </q-btn>
        </div>

        <div v-if="!userOwned && hasSampleVideo" class="col-sm-12 col-xl-6 q-mx-auto" style="padding: 1rem;">
            <purple-video
                ref="videoPlayer"
                id="sampleWatch"
                :options="samplePlayerOptions"
                v-if="samplePlayerOptions.sources && samplePlayerOptions.sources.length"
                @ready="playerReadied"
                style="max-width: 720px; margin: 0 auto;"
            />
        </div>

        <div v-else class="col-10 q-mt-lg" align="center">
            <img :src="coverImageURL" style="display: block; max-height: 700px; max-width: 100%;" />
        </div>


        <div class="col-10 q-pa-md">
            <div class="row well">
                <h5 :style="'letter-spacing: -1px; color: ' + pvolveSalmon + '; text-transform: none; margin-top: 0;'" class="monty">{{currentProduct.productName || productPreviewData.productName}}</h5>
                <div id="shortDescription" class="col-12" v-if="!userOwned" v-html="currentProduct.productBlurb || productPreviewData.productBlurb" style="margin-top: 1rem; line-spacing: 2rem;"></div>
                <div id="longDescription" class="col-12" v-else v-html="currentProduct.moreInfo || productPreviewData.moreInfo" style="margin-top: 1rem; line-spacing: 2rem;"></div>
            </div>
        </div>

        <div v-if="userOwned" class="col-sm-12 col-xl-6 q-mb-xl q-mx-auto" style="padding: 0 1rem;">

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

        </div>

        <div class="col-12 q-mt-lg bg-grey-3" style="padding: 1rem 0;">
            <recommendedProducts isNutritionProduct />
        </div>

        <div v-if="!userOwned" class="col-12 bg-grey-3 q-mt-lg" align="center" style="padding: 2rem 1rem; width: 100%;">
            <pvolveTrialOrSubscribe :componentData="{}" @subscribe="goToSignUpNow()" @trial="goToTrial()" />
        </div>

    </div>

</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import recommendedProducts from './recommendedProducts.vue'
    import pvolveTrialOrSubscribe from './pvolveTrialOrSubscribe.vue'

    import { pvolveColors } from './pvolveColors'
    import { videoPlayback } from '../../../mixins/videoPlayback'
    import { productPreviewTools } from '../../../mixins/productPreviewTools'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {

        props: ['currentChapter', 'playerOptions'],

        mixins: [pvolveColors, videoPlayback, productInfoTools, productPreviewTools, userAndProductInfo ],

        components: { PurpleVideo, recommendedProducts, pvolveTrialOrSubscribe },

        computed: {

            pvolvePlayerOptions() {
                let pvolvePlayerOptions = this.playerOptions || {}
                    pvolvePlayerOptions.aspectRatio = '16:9'
                return pvolvePlayerOptions
            },

            coverImageURL() {
                return `https://vault.platformpurple.com/static/previews/${(this.currentProduct.productSKU || this.productPreviewData.productSKU)}/${(this.currentProduct.productSKU || this.productPreviewData.productSKU)}_coverImage.png`
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            productPreviewData() {
                return this.$store.state.productPreviewData
            },

            userOwned() {
                return this.currentProduct.userActiveProduct
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
        }
    }
</script>

<style scoped>
    .transportButton {
        padding: .5rem;
        color: #000 !important;
    }

    .pchip {
        color: #fff;
        background: #fff;
        border-radius: .25rem;
        padding: .25rem .5rem;
        margin: 0;
    }
</style>
