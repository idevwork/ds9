<template>

    <div id="walkAtHomeFilterResultProductGrid" :style="productSectionStyle">
        <div id="displayProducts" class="row well justify-center relative-position" style="padding: 0; min-height: 5rem;">
            
            <h4 v-if="componentData.heading" class="full-width">{{componentData.heading}}</h4>
    
            <div v-if="environmentTagHeadingObj && mwtSubscriber" class="col-12 row justify-center" style="padding: 0 .5rem 1rem;">
                <q-btn-group>
                    <q-btn
                        @click="clearFilters()"
                        :style="`${windowWidth < 525 ? 'padding: .5rem; ' : ''}${userSelectedTags && !userSelectedTags.length ? `color: #444 !important; background-color: ${brandColor} !important;` : 'color: #fff; background-color: #9e9e9e !important;'}`"
                    >
                        <span :style="windowWidth < 525 ? 'font-size: .7rem;' : ''">All</span>
                    </q-btn>
                    <q-btn
                        v-for="filter in multipleSelectOptionsFromTagHeading('distance')"
                        :key="filter.label"
                        @click="selectTag(filter.value)"
                        :style="`${windowWidth < 525 ? 'padding: .5rem; ' : ''}${userSelectedTags && userSelectedTags.includes(String(filter.value)) ? `color: #444 !important; background-color: ${brandColor} !important;` : 'color: #fff; background-color: #9e9e9e !important;'}`"
                    >
                        <span :style="windowWidth < 525 ? 'font-size: .7rem;' : ''">{{filter.label}}</span>
                    </q-btn>
                </q-btn-group>
            </div>      
            
            <div v-if="currentView === 'myLibrary' && favoritedProductIDs && favoritedProductIDs.length" class="col-12 row justify-center" style="padding: 0 .5rem 1rem;">
                <q-btn
                    @click="toggleFavorites()"
                    :style="`${windowWidth < 525 ? 'padding: .5rem; ' : ''}${showFavoritesOnly ? `color: #444 !important; background-color: ${brandColor} !important;` : 'color: #fff; background-color: #9e9e9e !important;'} margin-left: .5rem;`"
                >
                    <q-icon :name="showFavoritesOnly ? 'fas fa-heart' : 'far fa-heart'" :style="`${windowWidth < 525 ? 'font-size: .7rem;' : 'font-size: .9rem;'} margin: 0 .5rem 0 0;`" />
                    <span :style="windowWidth < 525 ? 'font-size: .7rem;' : ''">Show Favorites Only</span>
                </q-btn>
            </div>      
            
            <div class="col-3 gt-md" v-if="tagsExistForScope && showTagSidebar" style="padding: .5rem;">
                <div :is="tagSidebar" 
                    class="" 
                    style="margin-right: .5rem;" 
                    :productScope="productScope" 
                    :tagScope="tagScope" 
                    :tagHeadingsObj4Scope="tagHeadingsObj4Scope" 
                    
                    @selectTag="selectTag"
                />
            </div>
    
            <div :class="tagsExistForScope && showTagSidebar && windowWidth > 991 ? 'col-9' : 'col-12'">
                <div class="row items-stretch justify-center">
                    
                    <a 
                        :href="'https://yourdailywalk.com' + (userLoginToken ? '?userLoginToken=' + userLoginToken : '') " 
                        target="_blank" 
                        :class="componentData.columnClass || 'col-xs-6 col-sm-4 col-md-3 col-lg-2'" 
                        v-if="userHasAccess(ydwSubscriberIDs) && !showFavoritesOnly" 
                        style="padding: .5rem;"
                    >
                        <div class="ydwProductCard" align="center">
                            <div style="position: absolute; top: 50%; transform: translateY(-50%); width: 100%;">
                                <img style="max-height: 4rem;" src="https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/yourdailywalk.png" />
                                <h6 class="thickHeader text-white monty" style="text-transform: uppercase;">
                                    go to <br />Your Daily Walk
                                </h6>
                            </div>
                        </div>   
                    </a>
                    
                    <div :class="componentData.columnClass || (showTagSidebar ? 'col-xs-6 col-sm-4 col-md-4 col-lg-3' : 'col-xs-6 col-sm-4 col-md-3 col-lg-2')" v-if="displayProducts && displayProducts.length" v-for="product in displayProducts" :key="product.productID" style="padding: .5rem;">
                        <div :is="productCardComponent" class="productCard" :componentData="product"></div>
                    </div>
                    
                </div>
                
                <h6 v-if="!environmentProductAndTagState">Please sign in to see your owned products.</h6>
        
                <q-inner-loading :visible="environmentProductAndTagState !== 'fetched' ? true : false" align="center">
                    <q-spinner :size="30" />
                    loading products...
                </q-inner-loading>
                
                <div align="center" v-if="displayProducts && !displayProducts.length && environmentProductAndTagState.indexOf('fetching') === -1 && !userHasAccess(ydwSubscriberIDs)" class="col-12" style="padding: 3rem 1rem;">
                    <div v-if="!searchString && !userSelectedTags.length">
                        <h5 class="full-width">
                            No products found, let's go shopping!
                        </h5>
                        <q-btn :style="brandColor ? 'background: ' + brandColor + '; color: #fff;' : 'background: #fff;'" @click="seeAllProducts()">
                            Show All Products
                        </q-btn>
                    </div>
                    <div v-else>
                        <h5>No products found that match your criteria.</h5>
                    </div>
                </div>
            </div>
    
            <div class="col-12" id="bottom"></div>
            
        </div>
    </div>

</template>

<script>
    import defaultTagSidebar from '../../common/tagSidebar'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { contentItemFiltering } from '../../../mixins/contentItemFiltering'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productCardLoad } from '../../../mixins/productCardLoad'
    import { validProducts } from './walkAtHomeValidProducts'
    import OnScreen from 'onscreen'
    
    const os = new OnScreen()
    
    export default {
        props: ['componentData'],
        
        mixins: [globalComputedData, userAndProductInfo, contentItemFiltering, productCardLoad, validProducts],
        
        data() {
            return {
                batchIndex: 1,
                gridDelta: 30,
                tagSidebar: 'defaultTagSidebar',
                showMobileFilters: false,
                specialProductSelection: '',
                specialProductSelectionTags: '',
                specialProductSelectionTagsHeadingObj: '',
                
                multipleSelectOptionsFromTagHeading(headingName) {
                    return Object.keys(this.environmentTagHeadingObj[headingName].tags).map((tagKey) => {
                        let tag = this.environmentTagHeadingObj[headingName].tags[tagKey]
                        return {
                            label: tag.tagName,
                            value: tag.id
                        }
                    })
                },
            }
            
        },
        
        components: {
            defaultTagSidebar
        },
        
        computed: {
            searchString() {
                return this.$store.state.searchString
            },
            
            navBarData() {
                return this.$store.state.navBarData
            },
            
            productSectionStyle() {
                return 'background: ' + (this.componentData.backgroundImageURL ? 'url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + this.componentData.backgroundImageURL + ')' : this.componentData.backgroundColor ? this.componentData.backgroundColor : '#fff') + '; padding: 1rem;'
            },
            
            forSaleProducts() {
                return this.environmentProducts ?
                    this.componentData.productOrder ?

                        this.environmentProducts.filter((product) => {
                            return product.available4Sale
                        })
                        .map((product) => {
                            product.productOrder = this.componentData.productOrder.findIndex((item) => { return product.productID === item })
                            return product
                        })
                        .sort((a, b) => {
                            return a.productOrder - b.productOrder
                        })
                        
                    : this.environmentProducts.filter((product) => {
                        return product.available4Sale
                    })
                : ''
            },
            
            bundleProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.productType === 'bundleProduct'
                }) : ''
            },
    
            productScope() {
                return this.currentView === 'myLibrary' ? this.userActiveProducts : this.forSaleProducts
            },
    
            productPool() {
                var products = this.productScope
                
                if (this.userSelectedTags && this.userSelectedTags.length) {
                    products = this.getProductsThatMatchTags(this.userSelectedTags, this.productScope)
                }
                if (this.searchString) products = this.j_.queryArrayAllPartialMatches(this.productScope, 'searchString', this.searchString)
                
                 // k('productPool: ', products)
                return products
            },
            
            productsToLoad() {
                var productsToLoad = ''
    
                if (this.productPool) {
                    productsToLoad = this.productPool
    
                    // only one sort at a time
                    if (this.sortLibraryTopRated) productsToLoad = this.topRatedSort
                    if (this.sortLibraryMostRecent) productsToLoad = this.mostRecentSort
                    if (this.showFavoritesOnly) productsToLoad = this.onlyFavoritedProducts
                    if (this.showExclusiveContentOnly) productsToLoad = this.onlyExclusiveContent
                }
    
                return productsToLoad
            },
    
            displayProducts() {
                var displayProducts = this.productsToLoad ? this.productsToLoad.slice(0, this.batchIndex * this.gridDelta) : ''
                // k('displayingProducts: ', displayProducts)
                return displayProducts
            },
            
            showFavoritesOnly() {
                return this.$store.state.showFavoritesOnly
            },
            
            onlyFavoritedProducts() {
                var productPool = this.j_.cloneObject(this.productPool)
                return productPool.filter(product => this.favoritedProductIDs.includes(product.productID))
            },
            
            mediaFavoritesPreference() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'mediaFavorites') : null
            },
    
            favoritedProductIDs() {
                return this.mediaFavoritesPreference && this.mediaFavoritesPreference.favorites ? this.mediaFavoritesPreference.favorites : []
            },
    
            tagHeadingsObj4Scope() {
                return this.environmentTagHeadingObj
            },
                
            tagsExistForScope() {
                return this.currentView === 'myLibrary' ? this.userActiveTags && Object.keys(this.userActiveTags).length : this.environmentTags && Object.keys(this.environmentTags).length
            },
            
            userActiveTags() {
                var tags = {}
                var tagHeadingKeys = this.environmentTags ? Object.keys(this.environmentTags).filter((tagKey) => {
                    var tag = this.environmentTags[tagKey]
                    return tag.userActiveProductTag && tag.webplayer
                }) : ''
                
                if (tagHeadingKeys) tagHeadingKeys.forEach((key) => {
                    tags[key] = this.environmentTags[key] 
                })
                return tags
            },
            
            tagScope() {
                return this.currentView === 'myLibrary' ? this.userActiveTags : this.environmentTags
            },
    
            showTagSidebar() {
                return this.componentData.showTagSidebar
            }
        },
    
        methods: {
            lazyLoad(element) {
                kw('bottom of grid enter!')
                if (this.displayProducts && (this.displayProducts.length !== this.productPool.length)) this.batchIndex = Number(this.batchIndex) + 1
            },
    
            hideElement(element) {
                element.style.visibility = 'hidden'
            },
    
            showElement(element) {
                element.style.visibility = 'visible'
            },
            
            getProductDataBasedOnScope() {
                var route 
                if (this.componentData.productScope === 'channelProducts') route = this.api.apiv4Route + 'api/productBundle/componentProductsMetadata?productID=' + this.componentData.channelProductID
                
                this.api.get(route, (res) => {
                    k('getProductDataBasedOnScope: ', res)
                    
                    if (res.success) {
                        this.specialProductSelection = res.products
                        this.specialProductSelectionTags = this.makeTagObj(res.tags)
                        this.specialProductSelectionTagsHeadingObj = this.makeTagHeadingObj(res.tags)
                    }
                })
            },
            
            // selectTag(tagID) {
            //     k('selectTag: ', tagID, this.userSelectedTags)
            //     this.$store.commit('userSelectedTag', String(tagID))
    
            //     if (this.currentView !== 'myLibrary') {
            //         if (this.userSelectedTags.length) {
            //             this.route('/tagFilter/' + this.userSelectedTags.join(','))
            //         }
            //         else {
            //             this.route('/shop')
            //         }
            //     }
            // },
            
            selectTag(tagID) {
                k('selectTag: ', tagID, this.userSelectedTags)

                this.$store.commit('setUserSelectedTags', String(tagID))
            },

            clearFilters() {
                this.$store.commit('setUserSelectedTags', '')
                // this.selectedDistanceOptions = []
            },
            
            seeAllProducts() {
                k('navData: ', this.navBarData)
                
                var shopNavItem = this.navBarData.filter((item) => {
                    return item.navItemSKU === 'shop'
                })[0]
                
                k('shopNavItem: ', shopNavItem)
                
                this.route(shopNavItem.hide ? '/' : '/shop')
            },
            
            goToYDW() {
                k('goToYDW!')
                
                window.open('https://yourdailywalk.com', '_blank')
            },
            
            toggleFavorites() {
                this.$store.commit('setShowFavoritesOnly', !this.showFavoritesOnly)
            },
            
            getExtraProductInfo() {
                if (this.environmentProducts) {
                    // let filteredProducts = this.environmentProducts.filter((product) => {
                    //     return product.available4Sale
                    // })
                    // k('filteredProducts: ', filteredProducts)
                    
                    // let mappedProducts = filteredProducts.map((product) => {
                    //     product.productOrder = this.componentData.productOrder.findIndex((item) => { return product.productID === item })
                    //     return product
                    // })
                    // k('mappedProducts: ', mappedProducts)
                    
                    // let sortedProducts = mappedProducts.sort((a, b) => {
                    //     return a.productOrder - b.productOrder
                    // })
                    // k('sortedProducts: ', sortedProducts)
                    
                    this.getProductBundleInfo(this.freeBundleID, (res) => {
                        if (res) this.freeProducts = res.products.filter((product) => {
                            return this.environmentProducts.find((eProduct) => {
                                return eProduct.productID === product.productID
                            })
                        })
                    })
        
                    this.getProductBundleInfo(this.previewBundleID, (res) => {
                        if (res) this.previewProducts = res.products.filter((product) => {
                            return this.environmentProducts.find((eProduct) => {
                                return eProduct.productID === product.productID
                            })
                        })
                    })
                }
            }
        },
    
        watch: {
            searchString() {
                k('filter by search')
                
                if (this.searchString) {
                    var logEventObj = {
                        searchText: this.searchString,
                        eventDesc: 'filtering products by search string "' + this.searchString + '"'
                    }
                    
                    if (this.currentView === 'myLibrary') {
                        logEventObj.eventType = 'filterLibraryProductsBySearch'
                    } else {
                        logEventObj.eventType = 'filterShopProductsBySearch'
                    }
                    
                    this.api.sendEvent(logEventObj)
                }
            },
            
            userSelectedTags() {
                k('environmentTags: ', this.environmentTags)
                if (this.userSelectedTags && this.userSelectedTags.length) {
                    
                    var tagNames = []
                    this.userSelectedTags.forEach((tagID) => {
                        tagNames.push(this.environmentTags[tagID].tagName)
                    })
                    
                    var logEventObj = {
                        eventDesc: 'filtering products by tags: "' + tagNames.join(', ') + '"',
                        userSelectedTagIDs: this.userSelectedTags,
                        userSelectedTagNames: tagNames
                    }
                    
                    if (this.currentView === 'myLibrary') {
                        logEventObj.eventType = 'filterLibraryProductsByTag'
                    } else {
                        logEventObj.eventType = 'filterShopProductsByTag'
                    }
                    
                    k('logEventObj: ', logEventObj)
                    
                    this.api.sendEvent(logEventObj)
                }
            },
            
            environmentProducts() {
                this.getExtraProductInfo()
            },
            
            favoritedProductIDs() {
                k('favoritedProductIDs: ', this.favoritedProductIDs)
                
                if (this.favoritedProductIDs && !this.favoritedProductIDs.length && this.showFavoritesOnly) {
                    this.$store.commit('setShowFavoritesOnly', false)
                }
            },
        },
    
        created() {
            
            if (this.componentData.customTagSidebar) {
                var sidebarData = this.homePageSectionFromID(this.componentData.customTagSidebar)
                this.loadIt(sidebarData.component, 'customComponents/' + sidebarData.componentPath.replace('.html', ''))
                this.tagSidebar = sidebarData.component
            }
            
            if (this.componentData.productScope) {
                k('section has specific scope: ', this.componentData.productScope)
                this.getProductDataBasedOnScope()
            }
            
            this.getExtraProductInfo()
    
            os.on('enter', '#bottom', this.lazyLoad)
            os.on('leave', '.productCard', this.hideElement)
            os.on('enter', '.productCard', this.showElement)
        }
    }
</script>

<style>
  .productCard {
    height: 100%;
  }
  
  .ydwProductCard {
      position: relative;
      background: #80c830; 
      height: 100%; 
      min-height: 10rem; 
      border: 1px solid #fff;
      border-radius: .25rem;
      cursor: pointer;
  }
</style>
