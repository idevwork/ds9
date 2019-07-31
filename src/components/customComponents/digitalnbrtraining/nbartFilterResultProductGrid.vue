<template>

    <div :style="productSectionStyle">
        <div id="displayProducts" class="row well justify-center relative-position" style="min-height: 5rem;">
            
            <h4 v-if="componentData.heading" class="full-width">{{componentData.heading}}</h4>
            
            <div class="col-12 lt-lg" v-if="tagsExistForScope && showTagSidebar" style="padding: 1rem .5rem 1rem .5rem;">
                <q-btn class="full-width bg-grey-4" @click="showMobileFilters = !showMobileFilters" :style="brandColor ? 'background : ' + brandColor + ' !important; color: white;' : ''">
                    <q-icon name="fa-filter" style="margin-right: .5rem;" />
                    Find What You’re Looking For
                    <q-icon :name="showMobileFilters ? 'fa-chevron-up' : 'fa-chevron-down'" style="margin-left: .5rem;" />
                </q-btn>
                
                <div 
                    v-if="showMobileFilters" 
                    :is="tagSidebar" 
                    :productScope="productScope" 
                    :tagScope="tagScope" 
                    :tagHeadingsObj4Scope="tagHeadingsObj4Scope" 
                    
                    @selectTag="selectTag"
                />
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
                <div class="row items-stretch">
                    <div :class="componentData.columnClass || (showTagSidebar ? 'col-xs-6 col-sm-4 col-md-4 col-lg-4' : 'col-xs-6 col-sm-4 col-md-4 col-lg-4')" v-if="displayProducts && displayProducts.length" v-for="product in displayProducts" :key="product.productID" style="padding: .5rem;">
                        <div :is="productCardComponent" class="productCard" :componentData="product"></div>
                    </div>
                </div>
                
                <h6 v-if="!environmentProductAndTagState">Please sign in to see your owned products.</h6>
        
                <q-inner-loading :visible="environmentProductAndTagState !== 'fetched' ? true : false" align="center">
                    <q-spinner :size="30" />
                    loading products...
                </q-inner-loading>
                
                <div align="center" v-if="displayProducts && !displayProducts.length && environmentProductAndTagState.indexOf('fetching') === -1" class="col-12" style="padding: 3rem 1rem;">
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
    import { contentItemFiltering } from '../../../mixins/contentItemFiltering'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productCardLoad } from '../../../mixins/productCardLoad'
    import OnScreen from 'onscreen'
    
    const os = new OnScreen()
    
    export default {
        props: ['componentData'],
        
        mixins: [userAndProductInfo, contentItemFiltering, productCardLoad],
        
        data() {
            return {
                batchIndex: 1,
                gridDelta: 30,
                tagSidebar: 'defaultTagSidebar',
                showMobileFilters: false,
                specialProductSelection: '',
                specialProductSelectionTags: '',
                specialProductSelectionTagsHeadingObj: ''
            }
        },
        
        components: {
            defaultTagSidebar
        },
        
        computed: {
            navBarData() {
                return this.$store.state.navBarData
            },
            
            productSectionStyle() {
                return 'background: ' + (this.componentData.backgroundImageURL ? 'url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + this.componentData.backgroundImageURL + ')' : this.componentData.backgroundColor ? this.componentData.backgroundColor : '#fff') + ';'
            },
    
            currentView() {
                return this.$store.state.currentView
            },
            
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            },
            
            environmentProducts() {
                return this.$store.state.environmentProducts  
            },       
            
            environmentProductAndTagState() {
                return this.$store.state.environmentProductAndTagState  
            },
    
            environmentTags() {
                return this.$store.state.environmentTags  
            },
    
            environmentTagHeadingObj() {
                return this.$store.state.environmentTagHeadingObj  
            },
            
            userActiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer
                }) : ''
            },
            
            bundleProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.productType === 'bundleProduct'
                }) : ''
            },
    
            forSaleProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.available4Sale
                }) : ''
            },
    
            productScope() {
                return this.currentView === 'myLibrary' ? this.userActiveProducts : this.componentData.productScope ? this[this.componentData.productScope] : this.forSaleProducts
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
    
            displayProducts() {
                var displayProducts = this.productPool ? this.productPool.slice(0, this.batchIndex * this.gridDelta) : ''
                // k('displayingProducts: ', displayProducts)
                return displayProducts
            },
    
            searchString() {
                return this.$store.state.searchString
            },
    
            userSelectedTags() {
                return this.$store.state.userSelectedTags
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
            },
            
            homePageData() {
                return this.$store.state.environment.json
            },
    
            windowWidth() {
                return this.$store.state.windowWidth
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
            
            selectTag(tagID) {
                k('selectTag: ', tagID, this.userSelectedTags)
                this.$store.commit('userSelectedTag', String(tagID))
    
                if (this.currentView !== 'myLibrary') {
                    if (this.userSelectedTags.length) {
                        this.route('/tagFilter/' + this.userSelectedTags.join(','))
                    }
                    else {
                        this.route('/shop')
                    }
                }
            },
            
            seeAllProducts() {
                k('navData: ', this.navBarData)
                
                var shopNavItem = this.navBarData.filter((item) => {
                    return item.navItemSKU === 'shop'
                })[0]
                
                k('shopNavItem: ', shopNavItem)
                
                this.route(shopNavItem.hide ? '/' : '/shop')
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
        },
    
        created() {
            k('nbart filter grid!')
            
            if (this.componentData.customTagSidebar) {
                var sidebarData = this.homePageSectionFromID(this.componentData.customTagSidebar)
                this.loadIt(sidebarData.component, 'customComponents/' + sidebarData.componentPath.replace('.html', ''))
                this.tagSidebar = sidebarData.component
            }
            
            if (this.componentData.productScope) {
                k('section has specific scope: ', this.componentData.productScope)
                this.getProductDataBasedOnScope()
            }
    
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
</style>
