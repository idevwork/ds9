<template>

    <div>
        <!--<q-inner-loading :visible="!productID2Play || !environmentProducts" />-->

        <div v-if="currentMediaType">
            <div v-if="currentMediaType === 'html5'" :is="html5Component"></div>

            <VideoHold v-if="currentMediaType === 'video'" :videoLayout="videoLayout" />

            <AudioHold v-if="currentMediaType === 'audio'" :audioLayout="audioLayout" />

            <div :is="eBookReader" v-if="currentMediaType === 'ebook'" />

            <AdditionalMediaHold v-if="currentMediaType === 'additionalMedia'" :additionalMediaLayout="additionalMediaLayout" />

            <CourseBoss v-if="currentMediaType === 'course'" :courseID="productID2Play" :courseContextID="productContextID" />
        </div>
        
        <q-modal
            id="resumeModal"
            v-model="openResumeModal"
            :content-css="{minWidth: '60vw', maxHeight: '50vh' }"
        >
            <!--<q-modal-layout>-->

                <q-btn @click="openResumeModal = false" flat style="padding: .5rem; position: absolute; right: 0;">
                    <q-icon name="fas fa-times" />
                </q-btn>
                
                <div v-if="lastMediaPlayForUserProduct" align="center" style="padding: 1rem 1rem 2rem;">
                    <h5 style="margin-top: 1rem;">Resume from where you left off?</h5>
                    
                    <h6 style="margin: 1rem; line-height: 1.25rem;">
                        {{lastMediaPlayForUserProduct.productName}}: 
                        {{lastMediaPlayForUserProduct.contentType ? '(' + lastMediaPlayForUserProduct.contentType + ')' : ''}} 
                        {{lastMediaPlayForUserProduct.chapterTitle}} - 
                        {{j_.secondsToHms(lastMediaPlayForUserProduct.mediaEndSeconds + (lastMediaPlayForUserProductChapter.chapterStartSeconds || lastMediaPlayForUserProductChapter.chapterOffset || 0))}}
                    </h6>
                    
                    <q-btn color="grey" size="lg" @click="openResumeModal = false">
                        <q-icon name="fas fa-times" style="margin-right: .5rem; font-size: 1rem;" />
                        close
                    </q-btn>
                    
                    <q-btn color="green" size="lg" @click="resumePlayback()">
                        <q-icon name="fas fa-play" style="margin-right: .5rem; font-size: 1rem;" />
                        resume!
                    </q-btn>
                </div>
                
            <!--</q-modal-layout>-->
        </q-modal>
    </div>

</template>

<script>

    import VideoHold from '../components/common/player/VideoHold'
    import AudioHold from '../components/common/player/AudioHold'
    import AdditionalMediaHold from '../components/common/player/AdditionalMediaHold'
    import DefaultEBookReader from '../components/common/player/DefaultEBookReader'
    import CourseBoss from '../components/common/courseRabbit/CourseBoss'
    import { productInfoTools } from '../mixins/productInfoTools'

    export default {
        name: 'superPlayer',

        props: ['productID2Play', 'productContextID'],

        components: {
            VideoHold,
            AudioHold,
            AdditionalMediaHold,
            DefaultEBookReader,
            CourseBoss
        },
        
        mixins: [ productInfoTools ],

        data() {
            return {
                videoLayout: '',
                audioLayout: '',
                eBookReader: '',
                additionalMediaLayout: '',
                html5Component: '',
                lastMediaPlayForUserProduct: false,
                openResumeModal: false
            }
        },

        computed: {
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            environmentProductAndTagState() {
                return this.$store.state.environmentProductAndTagState
            },
            
            currentProduct() {
                return this.$store.state.currentProduct
            },

            currentMediaType() {
                return this.$store.state.currentMediaType
            },

            homePageData() {
                return this.$store.state.environment.json
            },
            
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },

            toolbarStyle() {
                return 'background: ' + this.brandColor + ' !important ;'
            },
            
            lastMediaPlayForUserProductChapter() {
                return this.lastMediaPlayForUserProduct ? this.j_.queryArrayFirstMatch(this.currentProduct.productJSON[this.lastMediaPlayForUserProduct.contentType], 'displayName', this.lastMediaPlayForUserProduct.displayName || this.lastMediaPlayForUserProduct.chapterTitle) : ''
            },
            
            productLaunchContext() {
                return this.$store.state.productLaunchContext
            }
        },

        methods: {
            // changeMediaPlayer(mediaType) {
            //     k('changeMediaPlayer: ', mediaType)
            //     this.currentMediaType = mediaType
            // },

            getProductMeta() {
                k('getProductMeta: ', this.productID2Play)
                
                this.$store.commit('currentMediaType', '')
                
                this.getProductMetaFromAPI(this.productID2Play, (res) => {
                    if (res.success) {

                        let product = res.productMeta
                        k('PRODUCT META: ', product)
                        
                        if (product.userActiveProduct) {
                            this.$store.commit('setCurrentProduct', product)
                            this.routeToCorrectMedia()
                            
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
                        } else {
                            this.$q.notify({
                                message: 'Sorry, but you are not connected to this product.',
                                type: 'negative',
                                icon: 'fa-exclamation-circle',
                                position: 'bottom-left'
                            })
                            this.route('/library')
                        }
                    }
                    
                })

            },

            routeToCorrectMedia() {
                const product = this.currentProduct
                k('WHAT PRODUCT AM I? : ', product)

                if (product.contentJSON) {
                    k('launchCourse! ', this.currentProduct)  
                    this.$store.commit('currentMediaType', 'course')
                } else {
                    if (product.productJSON) {
                        if (product.productJSON.html && Object.keys(product.productJSON.html).length > 0) {
                            k('is html5')
                            this.launchHTMLComponent()
                        } 
                        else if ((product.productJSON.booklength && product.productJSON.booklength !== 0) || product.productJSON.ebook) {
                            k('is book')
                            this.$store.commit('currentMediaType', 'ebook')
                        }
                        else if (product.productJSON.video) {
                            this.$store.commit('currentMediaType', 'video')
                        }
                        else if (product.productJSON.audio) {
                            this.$store.commit('currentMediaType', 'audio')
                        }
                        else if (product.productJSON.pdf || product.productJSON.zip) {
                            this.$store.commit('currentMediaType', 'additionalMedia')
                        }
                    }
                }
                
                // switch (true) {
                //     case (product.contentJSON):
                //         // this is a course product
                //         k('launchCourse! ', this.currentProduct)  

                //         this.$store.commit('currentMediaType', 'course')
                //     break;                    
                    
                //     case (product.productJSON.html && Object.keys(product.productJSON.html).length > 0):
                //         // this is an html products
                //         k('is html5')
                //         this.launchHTMLComponent()
                //     break;

                //     case ((product.productJSON.booklength && product.productJSON.booklength !== 0) || product.productJSON.ebook):
                //         k('is book')
                //         this.$store.commit('currentMediaType', 'ebook')
                //     break;

                //     default:
                //         k('is video')
                //         // this.getLastMediaPlayForProduct()
                        
                //         if (product.productJSON) {
                //             if (product.productJSON.video) {
                //                 this.$store.commit('currentMediaType', 'video')
                //             }
                //             else if (product.productJSON.audio) {
                //                 this.$store.commit('currentMediaType', 'audio')
                //             }
                //             else if (product.productJSON.pdf || product.productJSON.zip) {
                //                 this.$store.commit('currentMediaType', 'additionalMedia')
                //             }
                //         }
                // }
            },
            
            launchCourse() {
                k('launchCourse! ', this.currentProduct)  

                this.$store.commit('currentMediaType', 'course')
            },

            launchHTMLComponent() {
                var product = this.currentProduct
                // k('PRODUCT: ', product)

                // api.sendEvent({
                //     'eventType': 'launchCustomHTMLComponent',
                //     'productSKU': product.productSKU,
                //     'productID': product.productID,
                //     'eventDesc': 'launching html component for ' + product.productName
                // })
                
                var componentName = product.productJSON.html.customComponentName
                var componentPath = 'customComponents/' + product.productJSON.html.customComponentFile.replace('.html', '')
                // k('launchHTMLComponent: ', componentName, componentPath)
                
                this.loadIt(componentName, componentPath)
                this.html5Component = componentName
                this.$store.commit('currentMediaType', 'html5')
                
                // var loadObj = {}
                //     loadObj[product.productJSON.html.customComponentName] = product.productJSON.html.customComponentFile

                // purpleLib.loadCustomComponent(loadObj, () => {
                //     k('now switching to html5 component')
                //     // self.root.set('html5Product', true)
                //     // self.root.set('scene', product.productJSON.html.customComponentName)
                //     this.$store.commit('currentMediaType', 'html5')
                // })
            },
            
            getLastMediaPlayForProduct() {
                // https://api-v4-dev2.platformpurple.com/api/user/stats
                var route = this.api.apiv4Route + 'api/user/stats'
                var req = {
                    "stat": "lastMediaPlayForUserProduct",
                    "userLoginToken": this.userLoginToken,
                    "productSKU": this.currentProduct.productSKU
                }
                k('getLastMediaPlayForProduct req: ', req)
                
                this.api.post(route, req, (res) => {
                    k('getLastMediaPlayForProduct res: ', res)
                    
                    if (res.success) {
                        kw('OPEN MODAL!')
                        
                        this.lastMediaPlayForUserProduct = res.lastMediaPlay
                    
                    }
                })
            },
            
            resumePlayback() {
                k('resumePlayback: ', this.lastMediaPlayForUserProduct)
                
                // close resume playback modal
                this.openResumeModal = false
                
                // set media type from last mediaPlay                
                k('mediaType is: ', this.lastMediaPlayForUserProduct.contentType)
                this.$store.commit('currentMediaType', this.lastMediaPlayForUserProduct.contentType)
                
                // set chapter/track index for player to use
                var chapterIndexToStartFrom = this.j_.indexFromArray(this.currentProduct.productJSON[this.lastMediaPlayForUserProduct.contentType], 'displayName', this.lastMediaPlayForUserProduct.chapterTitle)
                k('chapterIndexToStartFrom: ', chapterIndexToStartFrom)
                this.$store.commit('chapterIndexToStartFrom', chapterIndexToStartFrom)
                
                // set seconds to start from for player
                if (this.lastMediaPlayForUserProduct.mediaEndSeconds) {
                    var chapterToStartFrom = this.currentProduct.productJSON[this.lastMediaPlayForUserProduct.contentType][chapterIndexToStartFrom]
                    var chapterStartSeconds = chapterToStartFrom.chapterStartSeconds || chapterToStartFrom.chapterOffset || 0
                    k('chapterToStartFrom: ', chapterToStartFrom)
                    k('chapterStartSeconds: ', chapterStartSeconds)
                    
                    var startSeconds = this.lastMediaPlayForUserProduct.mediaEndSeconds + chapterStartSeconds
                    k('set chapterStartSecondsToPlayFrom: ', startSeconds)
                    this.$store.commit('chapterStartSecondsToPlayFrom', startSeconds)
                }
            }
            
        },

        created() {
            k('superPlayer: ', this.productID2Play)
            if (this.productID2Play) this.getProductMeta()
            
            this.loadNeededComponentsForView(() => {
                // k('homePageData: ', this.homePageData)
                if (this.homePageData) {
                    this.eBookReader = this.homePageData.e.customEbookLayout || 'DefaultEBookReader'
                    this.videoLayout = this.homePageData.e.customVideoLayout || 'DefaultVideoLayout'
                    this.audioLayout = this.homePageData.e.customAudioLayout || 'DefaultAudioLayout'
                    this.additionalMediaLayout = this.homePageData.e.customAdditionalMediaLayout || 'DefaultAdditionalMediaLayout'
                }
            })
            
        },

        watch: {
            productID2Play() {
                k('productID2Play watch: ', this.productID2Play)
                this.getProductMeta()
            },

            homePageData() {
                this.eBookReader = this.homePageData.e.customEbookLayout || 'DefaultEBookReader'
                // k('eBookReader component: ', this.eBookReader)
            },
            
            lastMediaPlayForUserProduct() {
                k('lastMediaPlayForUserProduct: ', this.lastMediaPlayForUserProduct)
                // this.openResumeModal = true
            },
            
            openResumeModal() {
                kw('openResumeModal: ', this.openResumeModal)
            },
            
            currentMediaType() {
                k('currentMediaType in superplayer: ', this.currentMediaType)
            }
        },

        beforeDestroy() {

        }
    }
</script>

<style>

</style>
