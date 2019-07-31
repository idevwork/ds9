<template>
    
    <div>

        <q-toolbar align="center">
            
            <q-btn v-if="ebookChapters && ebookChapters.length" @click="openModal = true" flat color="white">
                <q-icon name="fa-bars" /> Chapters
            </q-btn>
            
            <q-btn @click="toggleZoom()" flat color="white">
                <q-icon :name="zoomLevel ? 'fa-search-minus' : 'fa-search-plus'" />
            </q-btn>
        
            <q-toolbar-title align="center">
                <h6>{{ currentProduct.productName }}</h6>
            </q-toolbar-title>
            
            <q-btn flat>
                <h6>page {{ currentLeftPageIndex + 1 }} <span v-if="doublePage"> - {{ currentLeftPageIndex + 2 }}</span></h6>
            </q-btn>
            
            <q-btn flat style="padding: 0 .5rem;" @click="exitMedia()">
                <q-icon name="fa-times" style="font-size: 1.5rem; margin: 0;" />
            </q-btn>
            
        </q-toolbar>
        
        <div class="bg-grey-3" style="padding: 1rem;">
            <q-inner-loading :visible="!ready2render" />
            
            <div class="zoom" style="overflow: overlay">
                <div v-if="ready2render" id="ebookDisplay" v-touch-swipe.horizontal="swiped" v-touch-hold="touchHold" class="full-width row justify-between animate-fade" :style="zoomStyle">
                    <div v-if="eBookPages[currentLeftPageIndex]" :class="doublePage ? 'col-6' : 'col-12'" :style="doublePage ? 'text-align: right;' : 'text-align: center;'">
                        <img :src="eBookPages[currentLeftPageIndex]" :style="bookPageStyle">
                    </div>
                    <div v-if="doublePage" class="col-6" style="text-align: left;">
                        <img :src="eBookPages[currentLeftPageIndex + 1]" :style="bookPageStyle">
                    </div>
                </div>
            </div>
    
            <!-- image cache -->
            <div v-if="currentLeftPageIndex < eBookPages.length - 1" style="display: none;">
                <img :src="eBookPages[currentLeftPageIndex + 2]">
            </div>
            <div v-if="currentLeftPageIndex < eBookPages.length - 2" style="display: none;">
                <img :src="eBookPages[currentLeftPageIndex + 3]">
            </div>
    
            <div v-if="ready2render" class="full-width row">
                <div class="col-4" style="text-align: center;">
                    <q-btn v-if="currentLeftPageIndex > 0" @click="flipPage(-1)" size="lg" flat color="grey">
                        <q-icon name="fa-arrow-left" />
                    </q-btn>
                </div>
                <div class="col-4" style="text-align: center;">
                    <q-btn v-if="currentLeftPageIndex > 0" @click="currentLeftPageIndex = 0" size="lg" flat color="grey">
                        <q-icon name="fa-undo" />
                    </q-btn>
                </div>
                <div class="col-4" style="text-align: center;">
                    <q-btn v-if="currentLeftPageIndex < eBookPages.length - (doublePage ? 2 : 1)" @click="flipPage(1)" size="lg" flat color="grey">
                        <q-icon name="fa-arrow-right" />
                    </q-btn>
                </div>
            </div>
        </div>
        
        <q-modal
          v-model="openModal"
          :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout>
            
                <q-toolbar slot="header" color="grey" :style="toolbarStyle">
                    <q-btn flat icon="fa-chevron-left" @click="openModal = false" />
                    <q-toolbar-title>
                    Chapters
                    </q-toolbar-title>
                </q-toolbar>
                
                <div>
                    <q-list separator highlight>
                        
                        <q-item 
                            v-if="item.displayName"
                            v-for="(item, index) in currentProduct.productJSON.ebook" 
                            :key="item.displayName" 
                            :style="'cursor: pointer;' + ((item.chapterStartPage - 1) === currentLeftPageIndex ? 'background: rgba(189, 189, 189, 0.5);' : '')" 
                            @click.native="selectChapter(item), openModal = false"
                        >
                            <q-item-side icon="fa-bookmark" :style="((item.chapterStartPage - 1) === currentLeftPageIndex ? 'color: #564F8A;' : '')" />
                            <q-item-main>
                                {{item.displayName}} - Page {{item.chapterStartPage}}
                            </q-item-main>
                        </q-item>
                
                    </q-list>
                </div>
            
            </q-modal-layout>
        </q-modal>
        
    </div>

</template>

<script>
    export default {

        data() {
            return {
                openModal: false,
                eBookPages: [],
                ebookChapters: '',
                ready2render: false,
                zoomLevel: 0,
                currentLeftPageIndex: 0,
                doublePageThreshold: 1,
                
                pageWidth: '',
                pageHeight: '',
                
                readTimer: ''
            }
        },

        created() {
            this.getSignedPages( pages => {
                this.eBookPages = pages
                
                this.checkAndSetEbookChapters()
                
                this.getBookPageDimensions((w, h) => {
                    k('book page dimensions: ', w, h)
                    this.pageWidth = w
                    this.pageHeight = h
                    
                    this.goToLastPageViewedIfNecessary()
                })
            })
            
            this.readTimer = Date.now()
            
            var logEventObj = {
                eventType: 'ebookLaunch',
                eventDesc: 'launch ebook "' + this.currentProduct.productName + '"',
                productSKU: this.currentProduct.productSKU,
                productID: this.currentProduct.productID
            }
            this.api.sendEvent(logEventObj)
        },
        
        beforeDestroy() {
            var elasped = Math.round((Date.now() - this.readTimer) / 1000)
            var logEventObj = {
                eventType: 'ebookClose',
                eventDesc: 'close ebook "' + this.currentProduct.productName + '"',
                productSKU: this.currentProduct.productSKU,
                productID: this.currentProduct.productID,
                elapsed: elapsed
            }
            this.api.sendEvent(logEventObj)  
        },

        computed: {
            
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
            
            currentProduct() {
                return this.$store.state.currentProduct  
            },
            
            bookPageStyle() {
                let multiplier = this.doublePage ? 2 : 1
                let ratio = Math.min(this.windowWidth / (this.pageWidth * multiplier), (this.windowHeight - 150) / this.pageHeight)
                return 'width: ' + (Math.round(this.pageWidth * ratio) - 32) + 'px; height: ' + (Math.round(this.pageHeight * ratio) - 32) + 'px;'
            },
            
            doublePage() {
                return (this.windowWidth / this.windowHeight < this.doublePageThreshold
                    || this.currentLeftPageIndex === 0
                    || this.currentLeftPageIndex === this.eBookPages.length - 1
                ) ? false : true
            },
            
            windowWidth() {
                return this.$store.state.windowWidth
            },
            
            windowHeight() {
                return this.$store.state.windowHeight
            },
            
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },
        
            toolbarStyle() {
                return this.brandColor ? 'background: ' + this.brandColor + ' !important ;' : ''
            },
            
            zoomStyle() {
                return this.zoomLevel ? 'transform: scale(2, 2) translate(25%, 25%);' : ''
            },
            
            comingFrom() {
                return this.$store.state.comingFrom
            }
        },

        watch: {
            pageWidth() {
                this.ready2render = true
            },
            
            currentLeftPageIndex() {
                k('currentLeftPageIndex: ', this.currentLeftPageIndex)
                
                var lastPageViewedForSKU = this.currentLeftPageIndex
                this.localStorage.set(this.currentProduct.productSKU + 'LastPageViewed', lastPageViewedForSKU)
            }
        },

        methods: {
            
            exitMedia() {
                k('exitMedia: ', this.comingFrom)
                
                if (this.comingFrom && this.comingFrom !== '/signin') {
                    this.route(this.comingFrom)
                } else {
                    this.route('/library')
                }
            },
            
            checkAndSetEbookChapters() {
                k('this.currentProduct.productJSON.ebook: ', this.currentProduct.productJSON.ebook)
                
                var ebookChapters = []
                if (this.currentProduct.productJSON.ebook) {
                    ebookChapters = this.currentProduct.productJSON.ebook.filter((chapter) => {
                        return chapter.chapterStartPage
                    })
                }
                
                this.ebookChapters = ebookChapters
            },
            
            getSignedPages(cb) {
                var req = {
                    "userLoginToken": this.userLoginToken,
                    "productSKU": this.currentProduct.productSKU,
                    "mediaType": "ebook"
                }

                this.api.post(this.api.apiv4Route + 'api/product/signedURL', req, (res) => {
                    k('getSignedPages res: ', res)
                    if (res.success) cb(res.signedUrls)
                    if (!res.success) kw('book signing error!')
                })
            },
            
            getBookPageDimensions(cb) {
                var i = new Image
                i.onload = () => {
                    cb(i.width, i.height)
                }
                i.src = this.eBookPages[0]
            },
            
            selectChapter(item) {
                this.currentLeftPageIndex = item.chapterStartPage - 1
            },
            
            onResize(size) {
                this.windowWidth = size.width
                this.windowHeight = size.height
            },
            
            swiped(e) {
                kw('swiped: ', e.direction, this.currentLeftPageIndex, this.eBookPages.length - 1)
                
                var allowSwipe = true
                if (e.direction === 'right') {
                    if (this.currentLeftPageIndex === 0) allowSwipe = false
                } else {
                    if (this.currentLeftPageIndex >= this.eBookPages.length - 1) allowSwipe = false
                }
                
                if (allowSwipe) this.flipPage(e.direction === 'right' ? -1 : 1)
            },
            
            touchHold(e) {
                kw('zoomLevel: ', e)
                
                this.toggleZoom()
            },
            
            toggleZoom() {
                if (this.zoomLevel) {
                    this.zoomLevel = 0
                } else {
                    this.zoomLevel = 1
                }  
            },
            
            flipPage(n) {

                if (this.doublePage
                    && this.currentLeftPageIndex > 0
                    && this.currentLeftPageIndex < this.eBookPages.length - 1
                ) {
                    this.currentLeftPageIndex = this.currentLeftPageIndex + (n * 2) >= 0 ? this.currentLeftPageIndex + (n * 2) : 0 
                } else {
                    this.currentLeftPageIndex = this.currentLeftPageIndex + n
                }

                //
                // if (this.currentLeftPageIndex === 0) {
                //     this.currentLeftPageIndex = 1
                // } else if (this.currentLeftPageIndex === 1 && n === -1) {
                //     this.currentLeftPageIndex = 0
                // } else if (this.currentLeftPageIndex === this.eBookPages.length - 1) {
                //     this.currentLeftPageIndex++
                // } else {
                //     this.currentLeftPageIndex = this.currentLeftPageIndex + n * 2
                // }
            },
            
            goToLastPageViewedIfNecessary() {
                var lastPageViewedForSKU = this.localStorage.get(this.currentProduct.productSKU + 'LastPageViewed', lastPageViewedForSKU)
                if (lastPageViewedForSKU) {
                    this.currentLeftPageIndex = lastPageViewedForSKU
                }
            }
        }
    }
</script>

<style>

</style>
