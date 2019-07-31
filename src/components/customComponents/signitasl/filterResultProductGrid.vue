<template>

    <div :style="productSectionStyle">
        <div id="displayProducts" class="row well justify-center relative-position" style="min-height: 5rem;">
            
            <div class="col-12" align="center" style="padding: 1rem 0;">
                <h5 class="q-ma-md">Welcome to Sign It!</h5>
                <h6 class="q-ma-md">To access the course click the button below:</h6>
            
                <q-btn class="q-ma-md" size="xl" :style="`background: ${brandColor}; color: #fff;`" @click="openSignIt()">
                    Go to Sign It!
                </q-btn>
            </div>
        </div>
    </div>

</template>

<script>
    // import defaultTagSidebar from '../tagSidebar'
    import { contentItemFiltering } from '../../../mixins/contentItemFiltering'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productCardLoad } from '../../../mixins/productCardLoad'
    import OnScreen from 'onscreen'
    import Fuse from 'fuse.js'
    
    const os = new OnScreen()
    
    export default {
        props: ['componentData'],
        
        mixins: [userAndProductInfo, contentItemFiltering, productCardLoad],
        
        data() {
            return {
                batchIndex: 1,
                gridDelta: 30,
                tagLimit: 10,
                tagSidebar: 'defaultTagSidebar',
                showMobileFilters: false,
                specialProductSelection: '',
                specialProductSelectionTags: '',
                specialProductSelectionTagsHeadingObj: '',
                
                orderByKey: '',
                orderOptions: [{
                    title: 'Newest',
                    id: 'newest'
                }, {
                    title: 'Oldest',
                    id: 'oldest'
                }, {
                    title: 'Alphabetical',
                    id: 'alpha'
                }]
            }
        },
        
        components: {
            // defaultTagSidebar
        },
        
        computed: {
            navBarData() {
                return this.$store.state.navBarData
            },
            
            productSectionStyle() {
                return `background: ${this.componentData.backgroundImageURL ? `url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/${this.componentData.backgroundImageURL})` : this.componentData.backgroundColor ? this.componentData.backgroundColor : '#fff'};`
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
            
            nonSubscriptionProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.productType !== 'channel'
                }) : ''
            },
    
            productScope() {
                return this.currentView === 'myLibrary' ? this.userActiveProducts : this.componentData.productScope ? this[this.componentData.productScope] : this.forSaleProducts
            },
    
            productPool() {
                var products = this.productScope
                
                // k('productPool userSelectedTags: ', this.userSelectedTags)
                if (this.userSelectedTags && this.userSelectedTags.length) {
                    products = this.getProductsThatMatchTags(this.userSelectedTags, this.productScope)
                }
                
                // k('productPool searchString: ', this.searchString)
                if (this.searchString) {
                    if (!this.componentData.fuzzySearch) {
                        k('no fuzzySearch!')
                        products = this.j_.queryArrayAllPartialMatches(products, 'searchString', this.searchString)
                    } else {
                        k('fuzzySearch!', products)

                        let fuse = new Fuse(products, {
                            shouldSort: true,
                            threshold: 0.6,
                            location: 0,
                            distance: 70,
                            maxPatternLength: 32,
                            minMatchCharLength: 3,
                            keys: [ "productName", "authorName", "searchString" ]
                        })
                        
                        products = fuse.search(this.searchString)
                    }
                }
                
                if (this.orderByKey) {
                    products = this.orderBy(products)
                }
    
                k('productPool: ', products)
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
                return this.currentView === 'myLibrary' ? this.userActiveTags && Object.keys(this.userActiveTags).length > this.tagLimit : this.environmentTags && Object.keys(this.environmentTags).length > this.tagLimit
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
            openSignIt() {
                let link = `https://signitasl.net/?userLoginToken=${this.userLoginToken}`
                k('openSignIt: ', link)
                window.open(link, '_blank')    
            },
            
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
                        this.route(`/tagFilter/${this.userSelectedTags.join(',')}`)
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
            },
            
            initProductGrid() {
                if (this.componentData.customTagSidebar) {
                    var sidebarData = this.homePageSectionFromID(this.componentData.customTagSidebar)
                    this.loadIt(sidebarData.component, 'customComponents/' + sidebarData.componentPath.replace('.html', ''))
                    this.tagSidebar = sidebarData.component
                }
                
                if (this.componentData.productScope) {
                    k('section has specific scope: ', this.componentData.productScope)
                    this.getProductDataBasedOnScope()
                }
                
                if (this.componentData.tags) {
                    k('section has pre selected tags: ', this.componentData.tags)
                    this.$store.commit('setUserSelectedTags', this.componentData.tags)
                }
                
                if (this.componentData.displayProductSort && this.componentData.defaultOrderByKey) this.orderByKey = this.componentData.defaultOrderByKey
            },
            
            orderBy(products) {
                k('orderBy: ', this.orderByKey)
                
                switch(this.orderByKey) {
                    case 'newest':
                        products.sort((a, b) => { return b.productID - a.productID })
                    break;
                    case 'oldest':
                        products.sort((a, b) => { return a.productID - b.productID })
                    break;
                    case 'alpha':
                        products.sort((a, b) => { return this.j_.naturalSorter(a.productName, b.productName) })
                    break;
                    default:
                }
                
                return products
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
            
            componentData() {
                kw('componentData: ', this.componentData)
                
                this.initProductGrid()
            }
        },
    
        created() {
            k('filter results created: ', this.componentData)
            
            this.initProductGrid()
    
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
