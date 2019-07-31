<template>

    <div :style="productSectionStyle">
        <div id="displayProducts" class="row well justify-center relative-position" style="min-height: 5rem;">

            <h4 v-if="componentData.heading" class="full-width">{{componentData.heading}}</h4>

            <div class="col-12 lt-lg" v-if="tagsExistForScope && showTagSidebar" style="padding: 1rem .5rem 1rem .5rem;">
                <q-btn flat class="full-width bg-grey-4" icon="fa-filter" @click="showMobileFilters = !showMobileFilters" :style="brandColor ? 'background : ' + brandColor + ' !important; color: white;' : ''">
                    Filters
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

            <div class="col-3 gt-md" v-if="tagsExistForScope && showTagSidebar" style="padding: .5rem 1rem;">
                <div
                    :is="tagSidebar"
                    style="margin-right: .5rem;"
                    :productScope="productScope"
                    :tagScope="tagScope"
                    :tagHeadingsObj4Scope="tagHeadingsObj4Scope"

                    @selectTag="selectTag"
                />
            </div>

            <div :class="tagsExistForScope && showTagSidebar && windowWidth > 991 ? 'col-9' : 'col-12'">
                <div v-if="componentData.showSearch" class="row" style="margin: 1.75rem 0;">
                    <div class="col-12" style="padding: 0 .5rem;">
                        <filterGridSearch :componentData="componentData" />
                    </div>
                </div>

                <div class="row">
                    <div :class="orderOptionsColSize" v-if="productPool && productPool.length && !componentData.hideCoursesAvailable" :align="orderOptionsAlign" style="padding: .5rem;">
                        <span style="font-size: .8rem; font-style: italic;">{{productPool.length}} available course{{productPool.length > 1 ? 's' : ''}}</span>
                    </div>

                    <div class="col-xs-12 col-sm-7" v-if="displayProducts && displayProducts.length && componentData.displayProductSort" align="right" style="padding: .5rem;">
                        <span style="font-size: .8rem;">
                            sort by:
                        </span>

                        <q-btn v-for="item in orderOptions" :key="item.id" size="sm" flat @click="orderByKey = item.id">
                            {{item.title}}
                        </q-btn>
                    </div>
                </div>

                <div id="displayProducts" v-if="showDisplayProducts" class="relative-position" style="min-height: 5rem;">
                    <div v-if="displayProducts && displayProducts.length" class="row items-stretch justify-center">
                        <div :class="showDisplayProductsColSize" v-for="product in displayProducts" :key="product.productID" style="padding: .5rem;">
                            <div :is="productCardComponent" class="productCard" :componentData="product"></div>
                        </div>
                    </div>

                    <h6 v-if="!environmentProductAndTagState">Please sign in to see your owned products.</h6>

                    <q-inner-loading :visible="environmentProductAndTagState !== 'fetched'" align="center">
                        <q-spinner :size="30" />
                        loading products...
                    </q-inner-loading>

                    <div align="center" v-if="displayProducts && !displayProducts.length && environmentProductAndTagState.indexOf('fetching') === -1" style="padding: 3rem 1rem;">
                        <div v-if="!searchString && !userSelectedTags.length">
                            <h5 class="full-width" style="margin: 1rem 0;">
                                No products found, let's go shopping!
                            </h5>
                            <q-btn :style="showAllProductsButtonColor" @click="seeAllProducts()">
                                Show All Products
                            </q-btn>
                        </div>
                        <div v-else>
                            <h5>No products found that match your criteria.</h5>
                        </div>
                    </div>

                    <div id="bottom"></div>
                </div>

                <div v-else>
                    <div v-for="sectionID in componentData.productShowcase" :key="sectionID">
                        <div :is="isComponent(sectionID)" :componentData="addProductsToSection(sectionID)" :sectionIndex="-1" />
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
    import { contentItemFiltering } from '../../../mixins/contentItemFiltering'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productCardLoad } from '../../../mixins/productCardLoad'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    import defaultTagSidebar from '../tagSidebar'
    import filterGridSearch from './filterGridSearch'
    import productSection from './productSection'

    import OnScreen from 'onscreen'
    import Fuse from 'fuse.js'

    const os = new OnScreen()
    const COMPONENT_PRODUCT_METADATA_URL = 'api/productBundle/componentProductsMetadata?productID='

    export default {
        props: ['componentData'],

        mixins: [userAndProductInfo, contentItemFiltering, productCardLoad, globalComputedData],

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
                }],

                addProductsToSection(sectionID) {
                    const section = this.homePageSectionFromID(sectionID)

                    if (section.component === 'productSection') {
                        let productsForSection = []

                        if (this.environmentProducts) {
                            // collate based on section content
                            productsForSection = this[section.content](section)
                            k('productsForSection: ', productsForSection)

                            if (this.userSelectedTags && this.userSelectedTags.length) {
                                productsForSection = this.getProductsThatMatchTags(this.userSelectedTags, productsForSection)
                            }

                            // is there a search?
                            if (this.searchString) {
                                k('searchString: ', this.searchString)
                                productsForSection = this.searchProductsBySearchString(productsForSection)
                                k('productsForSection: ', productsForSection)
                            }
                        }

                        section.products = productsForSection
                    }

                    return section
                }
            }
        },

        components: {
            productSection,
            filterGridSearch,
            defaultTagSidebar
        },

        computed: {
            showDisplayProducts() {
                return !this.componentData.productShowcase && (!this.componentData.filterOnlyMode || (this.searchString.length || this.userSelectedTags.length || this.sortLibraryTopRated || this.sortLibraryMostRecent || this.showFavoritesOnly || this.showExclusiveContentOnly))
            },

            navBarData() {
                return this.$store.state.navBarData
            },

            componentDataBackgroundColor() {
                return this.componentData.backgroundColor ? this.componentData.backgroundColor : '#fff'
            },

            productSectionStyle() {
                return `background: ${this.componentData.backgroundImageURL ? `url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/${this.componentData.backgroundImageURL})` : this.componentDataBackgroundColor };`
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

            nonSubscriptionProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.productType !== 'channel'
                }) : ''
            },

            productScope() {
                const productScope = this.componentData.productScope ? this[this.componentData.productScope] : this.forSaleProducts
                return this.currentView === 'myLibrary' ? this.userActiveProducts : productScope
            },

            productPool() {
                let products = this.productScope

                k('productPool userSelectedTags: ', this.userSelectedTags)
                if (this.userSelectedTags && this.userSelectedTags.length) {
                    products = this.getProductsThatMatchTags(this.userSelectedTags, this.productScope)
                }

                k('productPool searchString: ', this.searchString)
                if (this.searchString) {
                    products = this.searchProductsBySearchString(products)
                }

                if (this.orderByKey) {
                    products = this.orderBy(products)
                }

                k('productPool: ', products)
                return products
            },

            displayProducts() {
                let displayProducts = this.productPool ? this.productPool.slice(0, this.batchIndex * this.gridDelta) : ''

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
                let userActiveTags = this.userActiveTags && Object.keys(this.userActiveTags).length > this.tagLimit
                let environmentTags = this.environmentTags && Object.keys(this.environmentTags).length > this.tagLimit
                return this.currentView === 'myLibrary' ? userActiveTags : environmentTags
            },

            userActiveTags() {
                let tags = {}
                let tagHeadingKeys = this.environmentTags ? Object.keys(this.environmentTags).filter((tagKey) => {
                    let tag = this.environmentTags[tagKey]
                    return tag.userActiveProductTag && tag.webplayer
                }) : ''

                if (tagHeadingKeys) {
                    tagHeadingKeys.forEach((key) => {
                        tags[key] = this.environmentTags[key]
                    })
                }

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
            },

            showOnlyOwnedAndPlayable() {
                return this.$store.state.showOnlyOwnedAndPlayable
            },

            showMobileFilterButtonColor() {
                return this.brandColor ? 'background : ' + this.brandColor + ' !important; color: white;' : ''
            },

            orderOptionsColSize() {
                return `col-xs-12 ${ this.componentData.displayProductSort ? 'col-sm-5' : '' }`
            },

            orderOptionsAlign() {
                return this.windowWidth > 576 && this.componentData.displayProductSort ? 'left' : 'center'
            },

            showDisplayProductsColSize() {
                return this.componentData.columnClass || (this.showTagSidebar && this.tagsExistForScope ? 'col-xs-6 col-sm-4 col-md-4 col-lg-3' : 'col-xs-6 col-sm-4 col-md-3 col-lg-2')
            },

            showAllProductsButtonColor() {
                return this.brandColor ? 'background: ' + this.brandColor + '; color: #fff;' : 'background: #fff;'
            }
        },

        methods: {
            isComponent(sectionID) {
                const section = this.homePageSectionFromID(sectionID)

                return section.component
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
                let route
                if (this.componentData.productScope === 'channelProducts') {
                    route = `${this.api.apiv4Route}${COMPONENT_PRODUCT_METADATA_URL}${this.componentData.channelProductID}`
                }

                this.api.get(route, (res) => {
                    k('getProductDataBasedOnScope: ', res)

                    if (res.success) {
                        this.specialProductSelection = res.products
                        this.specialProductSelectionTags = this.makeTagObj(res.tags)
                        this.specialProductSelectionTagsHeadingObj = this.makeTagHeadingObj(res.tags)
                    }
                })
            },

            searchProductsBySearchString(products) {
                k('searchProductsBySearchString: ', this.componentData)

                if (!this.componentData.fuzzySearch) {
                    k('no fuzzySearch!')
                    products = this.j_.queryArrayAllPartialMatches(products, 'searchString', this.searchString)
                } else {
                    k('fuzzySearch!', products)

                    let fuse = new Fuse(products, {
                        shouldSort: true,
                        threshold: this.componentData.fuzzyThreshold ? this.componentData.fuzzyThreshold : 0.6,
                        location: 0,
                        distance: this.componentData.fuzzyDistance ? this.componentData.fuzzyDistance : 70,
                        maxPatternLength: 32,
                        minMatchCharLength: 2,
                        keys: this.componentData.fuzzyKeys ? this.componentData.fuzzyKeys : [ "productName", "searchString", "authorName" ]
                    })

                    products = fuse.search(this.searchString)
                }

                return products
            },

            selectTag(tagID) {
                k('selectTag: ', tagID, this.userSelectedTags)

                if (this.componentData.singleTagFiltering) {
                    this.$store.commit('setUserSelectedTags', '')
                }

                this.$store.commit('userSelectedTag', String(tagID))

                if (!this.componentData.haltTagRouting && this.currentView !== 'myLibrary') {
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

                const shopNavItem = this.navBarData.filter((item) => {
                    return item.navItemSKU === 'shop'
                })[0]

                k('shopNavItem: ', shopNavItem)

                this.route(shopNavItem.hide ? '/' : '/shop')
            },

            initProductGrid() {

                if (this.componentData.customTagSidebar) {
                    let sidebarData = this.homePageSectionFromID(this.componentData.customTagSidebar)
                    this.loadIt(sidebarData.component, `customComponents/${sidebarData.componentPath.replace('.html', '')}`)
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

                if (this.componentData.displayProductSort && this.componentData.defaultOrderByKey) {
                    this.orderByKey = this.componentData.defaultOrderByKey
                }
            },

            orderBy(products) {
                k('orderBy: ', this.orderByKey)

                switch(this.orderByKey) {
                    case 'newest':
                        return products.sort((a, b) => { return b.productID - a.productID })

                    case 'oldest':
                        return products.sort((a, b) => { return a.productID - b.productID })

                    case 'alpha':
                        return products.sort((a, b) => { return this.j_.naturalSorter(a.productName, b.productName) })

                    default:
                        return products
                }
            }
        },

        watch: {
            searchString() {
                k('filter by search')

                if (this.searchString) {
                    let logEventObj = {
                        searchText: this.searchString,
                        eventDesc: 'filtering products by search string "' + this.searchString + '"',
                        eventType: this.currentView === 'myLibrary' ? 'filterLibraryProductsBySearch' : 'filterShopProductsBySearch'
                    }

                    this.api.sendEvent(logEventObj)
                }
            },

            userSelectedTags() {
                k('environmentTags: ', this.environmentTags)

                if (this.userSelectedTags && this.userSelectedTags.length && this.environmentTags) {

                    let tagNames = []
                    this.userSelectedTags.forEach((tagID) => {
                        tagNames.push(this.environmentTags[tagID].tagName)
                    })

                    let logEventObj = {
                        eventDesc: 'filtering products by tags: "' + tagNames.join(', ') + '"',
                        eventType: this.currentView === 'myLibrary' ? 'filterLibraryProductsByTag' : 'filterShopProductsByTag',
                        userSelectedTagIDs: this.userSelectedTags,
                        userSelectedTagNames: tagNames
                    }

                    k('logEventObj: ', logEventObj)

                    this.api.sendEvent(logEventObj)
                }
            },

            environmentProductAndTagState() {
                kw('environmentProductAndTagState: ', this.environmentProductAndTagState)
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
