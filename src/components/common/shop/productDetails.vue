<template>
  <div style="background: #f6f6f6; padding-top: 0px; margin-top: .25rem;">
      <!--<div style="text-align: right; width: 100%; margin-right: 0.5rem;">-->
      <!--</div>-->

        <q-toolbar style="background-color: #285283;">
            <div class="row full-width" style="font-size: 18px; font-weight: 500;">
                <div :class="!hideClose ? 'col-9' : 'col-10'">{{productDetailsData.productName}}</div>
                <div class="col-2">
                    <span v-if="productDetailsData.duration" class="float-right">
                      {{ productDuration }}
                    </span>
                </div>
                <div v-if="!hideClose" class="col-1">
                    <q-btn id="closePreviewModal" flat icon="fa-times" @click="closeProductDetails" style="padding: .5rem;" />
                </div>
            </div>
        </q-toolbar>

        <div class="row">
            <div class="col-12 padded">
                <purple-video ref="videoPlayer" id="sampleWatch" :options="samplePlayerOptions" v-if="samplePlayerOptions.sources && samplePlayerOptions.sources.length" @ready="playerReadied" style="max-width: 100%;margin-bottom: 1rem;" />
                <span v-html="productDetailsData.byLine"></span>
                <!--<div v-if="productIsInShop" class="full-width">-->
                <!--    <h2 class="pchip" style="margin: .5rem 0; font-size: 2rem; float: left;">{{numeral(productDetailsData.productPrice).format('$0.00')}}</h2>-->
                <!--</div>-->
                <div style="margin-top: 1rem;" v-html="productDetailsData.moreInfo"></div>
            </div>
        </div>

        <div v-if="showProductPreviewLink" class="col-12 padded">
            <div class="bg-white shadow-3 padded">
                <q-field icon="fa-link" helper="Select and copy this link to send people to this product">
                    <q-input v-model="productPreviewLink" readonly />
                </q-field>
            </div>
        </div>
  </div>
</template>

<script>
    import PurpleVideo from '../../common/player/PurpleVideo'
    import { social } from '../../../mixins/social'

    export default {
        props: ['productDetailsData', 'allowPurchase', 'hideClose'],

        components: {
            PurpleVideo
        },

        mixins: [social],

        data() {
            return {
                showProductPreviewLink: false,
                videoID: '',
                samplePlayerOptions: {
                    // component options
                    start: 0,
                    playsinline: true,
                    controls: true,

                    // videojs options
                    autoplay: false,
                    muted: false,
                    language: 'en',
                    sources: [],
                    height: "100%",
                    aspectRatio: '16:9'
                }
            }
        },

        computed: {
            hasSampleVideo() {
                return this.productDetailsData.sampleMovieDimensions && this.productDetailsData.sampleMovieDimensions !== 'null'
            },
            environmentTags() {
                return this.$store.state.environmentTags
            },

            productTags() {
                var productTagReturn = null

                if (this.environmentTags && this.productDetailsData.tags) {
                    // k('productTags: ', this.environmentTags, this.productPreviewData.tags)
                    productTagReturn = []

                    var productTagNames = this.productDetailsData.tags.split(',').map((tagID) => {
                        // k('tagObj: ', this.environmentTags[tagID])
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

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            productIsInShop() {
                var available = false
                var product = this.environmentProducts && this.environmentProducts.length ? this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(this.productDetailsData.productID)) : false
                if (product && product.available4Sale) available = true
                return available
            },

            coverImageUrl() {
                return this.productDetailsData ? 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.productDetailsData.productSKU + '/' + this.productDetailsData.productSKU + '_image_cover.png' : ''
            },

            sampleVideoSrc() {
                return this.productDetailsData ? "https://w2d4h2w3.ssl.hwcdn.net/static/previews/" + this.productDetailsData.productSKU + "/" + this.productDetailsData.productSKU + "_sample.mp4" : ''
            },

            productPreviewLink() {
                return window.location.origin + '/shop/' + this.productDetailsData.productID + window.location.search
            },

            productDuration() {
                let duration = this.j_.secondsToHms(this.productDetailsData.duration)
                let [hours, minutes, seconds] = duration.split(':')

                let numHours = parseInt(hours) ? hours : ''
                let numMinutes = parseInt(minutes) ? minutes : ''

                let stringHour = parseInt(hours) > 1 ? 'hours' : 'hour'
                let stringMinute = parseInt(minutes) > 1 ? 'minutes' : 'minute'

                return `${numHours} ${numHours && stringHour} ${numMinutes} ${numMinutes && stringMinute}`
            }

        },

        methods: {
            playerReadied(player) {
                // k('the player is readied', player)
                this.videoID = player.id_ + '_html5_api'
            },

            initVideo() {
                k('init video: ', this.productDetailsData, this.sampleVideoSrc)

                this.samplePlayerOptions.sources = []
                this.samplePlayerOptions.sources.push({
                    type: 'video/mp4',
                    src: this.sampleVideoSrc
                })
            },
            closeProductDetails() {
                this.$emit('closeProductDetails')
            }
        },

        watch: {
            productDetailsData: {
                immediate: true,
                handler() {
                    this.initVideo()
                }
            }
        }
    }
</script>

<style>
    .video-js {
        height: 50vh;
    }
</style>

<style scoped>
    .padded {
        padding: 1rem;
    }

    .margin-top {
        margin-top: 15px;
    }

    .pchip {
        background: #fff;
        color: #000;
        font-size: .8rem;
        margin: .25rem;
        padding: .25rem .5rem;
        border-radius: .2rem;
        width: fit-content;
        width: -moz-fit-content;
    }
</style>
