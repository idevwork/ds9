<template>

    <div class="row relative-position" style="min-height: 3rem; padding-bottom: 3rem;">

        <div class="col-12">
            <q-inner-loading :visible="showLoader" />
        </div>

        <div class="col-12" style="padding-bottom: .5rem;">
            <q-btn id="backToLibrary" @click="goBack()" flat :style="'color: ' + pvolveSalmon + '; margin-top: .5rem;'">
                <q-icon name="fas fa-chevron-left" style="margin-right: .5rem;" />
                <h6>Back</h6>
            </q-btn>
        </div>

        <div class="row full-width items-center justify-center" style="padding: 1rem; text-transform: uppercase;">
            <div class="vertical-middle" style="padding: .25rem;">
                <h3 :style="'font-size: ' + adaptiveFontSize(1.6) + 'rem; color: ' + pvolveSalmon + ';'">3 Day</h3>
            </div>
            <div class="vertical-middle" style="padding: .25rem;">
                <h1 :style="'font-size: ' + linearAdaptiveFontSize(3) + 'rem; color: ' + pvolveMintTitle + ';'">Body</h1>
            </div>
            <div class="vertical-middle" style="padding: .25rem;">
                <h3 :style="'font-size: ' + adaptiveFontSize(1.6) + 'rem; color: ' + pvolveSalmon + ';'">Burn</h3>
            </div>

            <div class="full-width">
                <h6 align="center" v-html="currentProduct.productBlurb"></h6>
            </div>
        </div>

        <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
        >
            <div v-if="currentProduct" class="bg-grey-3 full-width">
                <div class="well row" :style="`padding: ${windowWidth > 767 ? '2rem' : '1rem'};`">
                    <div v-for="(item, index) in chapters" class="col-xs-4 col-sm day" @click="launchWorkout(index)" style="cursor: pointer;">

                        <div class="card">

                            <div>
                                <img :src="'https://vault.platformpurple.com/static/clients/mypvolve/3DayBodyBurn_' + (index + 1) + '.jpg'" style="width: 100%;" />
                            </div>

                            <div style="margin-top: -1.75rem;" align="right">
                                <q-btn class="shadow-0" size="xs" :style="'background: ' + (index === currentChapterIndex ? pvolveSalmon : '#616161') + '; padding: .25rem;'" >
                                    <q-icon name="fas fa-play-circle" color="white" />
                                </q-btn>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </transition>

        <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
        >
            <div v-if="currentProduct" class="col-12 bg-grey-2" style="padding-bottom: 2rem;">
                <VideoHold :videoLayout="videoLayout" />
            </div>
        </transition>

    </div>

</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import VideoHold from '../../common/player/VideoHold'

    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { mediaTimeTracking } from '../../../mixins/mediaTimeTracking'
    import { designTools } from '../../../mixins/designTools'
    import { productInfoTools } from '../../../mixins/productInfoTools'

    export default {
        props: ['componentData'],

        components: {
            PurpleVideo, VideoHold
        },

        mixins: [pvolveColors, userAndProductInfo, mediaTimeTracking, designTools, productInfoTools],

        data() {
            return {
                showLoader: true,
                showVideo: false,
                productID2Play: 150811,
                videoLayout: ''
            }
        },

        computed: {

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            currentProduct() {
                return this.$store.state.currentProduct
            },

            chapters() {
                return this.$store.state.currentProduct.productJSON.video
            },

            currentChapterIndex() {
                return this.$store.state.currentChapterIndex
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },

            subscriptionAccessType() {
                return this.userSubscriptionProductStatusHistory &&
                    this.userSubscriptionProductStatusHistory.length ?
                    this.userSubscriptionProductStatusHistory[0].accessType : ''
            },

            productLaunchContext() {
                return this.$store.state.productLaunchContext
            }
        },

        methods: {

            goBack() {
                k('goBack: ', this.$store.state.comingFrom)
                this.$store.state.comingFrom !== '/' ? this.$router.back() : this.route('/')
            },

            getProductMeta() {
                k('getProductMeta: ', this.productID2Play)
                this.showLoader = true

                this.getProductMetaFromAPI(this.productID2Play, (res) => {
                    this.showLoader = false

                    if (res.success) {

                        let product = res.productMeta
                        k('PRODUCT META: ', product)

                        this.$store.commit('setCurrentProduct', product)

                        var logEventObj = {
                            eventType: 'productLaunch',
                            eventDesc: 'launching product "' + product.productName + '"',
                            productName: product.productName,
                            productSKU: product.productSKU,
                            productID: product.productID,
                            context: this.productLaunchContext ? this.productLaunchContext : 'directRoute',
                            userID: this.$store.state.user.info.userID,
                            os: this.$store.state.userAgentInfo.os.name,
                        }

                        this.api.sendEvent(logEventObj)
                    }
                })

            },

            launchWorkout(index) {
                k('launchWorkout: ', index)

                this.$store.commit('chapterIndexToStartFrom', index)

                this.showVideo = false
                this.$nextTick(() => {
                    this.showVideo = true
                })
            },

            checkUserAccess() {
                k('checkUserAccess to 3 day: ')
                k(this.userHasAccess([String(this.productID2Play)]))
                k('subscriptionAccessType: ', this.subscriptionAccessType)

                if (this.userHasAccess([String(this.productID2Play)])) {
                    this.getProductMeta()

                    this.loadIt('structuredProgramVideoLayout', 'customComponents/mypvolve/structuredProgramVideoLayout')
                    this.videoLayout = 'structuredProgramVideoLayout'
                } else {
                    // go back
                    this.route('/library')
                }
            }

        },

        watch: {
            environmentProducts() {
                this.checkUserAccess()
            }
        },

        created() {
            k('three day program created! ', this.componentData)

            this.$store.commit('setCurrentProduct', '')

            if (this.environmentProducts) {
                this.checkUserAccess()
            }
        }

    }

</script>

<style scoped>
    .card {
        position: relative;
        background: #fff;
        border: 1px solid #ddd;
        cursor: pointer;
    }

    .day {
        width: 14.28%;
        display: block;
    }

    .dayDate {
        color: #999;
        background: #fff;
        padding: .3rem;
    }

    .dayHeader {
        background: #999;
        color: #fff;
        padding: .3rem;
    }
</style>
