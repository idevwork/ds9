<template>

    <div id="pvolveFilterResultProductGrid" class="bg-white">
        <div class="row" style="padding: 2rem 0 0;">
            <div class="col-12" v-if="(currentView === 'preview' || pbandOnlyUser) && environmentProductAndTagState.indexOf('fetching') === -1" style="padding-bottom: 1rem;">
                <pvolveTrialOrSubscribe :componentData="{}" @subscribe="goToSignUpNow()" @trial="route('/trial')" />
            </div>

            <h2 class="col-12" align="center" :style="`color: #333; margin: 1rem 0;`">{{ title }}</h2>
        </div>

        <div class="bg-grey-2">
            <div class="row well">
                <div class="col-12 justify-center" align="center" style="padding: .5rem;">

                    <q-btn v-if="tagHeadingsObj4Scope && showTagSidebar" flat @click="toggleFilters()" style="color: #333; margin: .25rem;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">
                            {{ filterTitle }}
                            <span v-if="userSelectedTags.length" :style="'background: ' + pvolveMintTitle + '; color: #fff; padding: 0 .25rem; border-radius: .25rem;'">{{userSelectedTags.length}}</span>
                            <q-icon :name="openFilters ? `fas fa-chevron-up` : `fas fa-chevron-down`" style="font-size: .7rem;" />
                        </h6>
                    </q-btn>

                    <q-btn v-if="environmentProducts" flat @click="toggleSearch()" style="color: #333; margin: .25rem;" icon="fas fa-search" />

                </div>

                <q-slide-transition>
                    <div class="col-12" v-if="openSearch">
                        <pvolveHomeSearch :componentData="{}" />
                    </div>
                </q-slide-transition>

                <q-slide-transition>
                    <div class="col-12" v-if="tagHeadingsObj4Scope && showTagSidebar && openFilters" style="padding: 1rem .5rem;">
                        <div
                            class="bg-grey-3"
                            style="padding: .5rem;"
                            :is="tagSidebar"
                            :productScope="productScope"
                            :tagHeadingsObj4Scope="tagHeadingsObj4Scope"
                            @selectTag="selectTag"
                        />
                    </div>
                </q-slide-transition>
            </div>
        </div>

        <div id="displayProducts" v-if="showDisplayProducts" class="row well justify-center relative-position" style="min-height: 5rem;">

            <div class="col-12">
                <div class="row items-stretch justify-center">
                    <div :class="componentData.columnClass || (showTagSidebar ? 'col-xs-6 col-sm-4 col-md-4 col-lg-3' : 'col-xs-6 col-sm-4 col-md-3 col-lg-2')" v-if="displayProducts && displayProducts.length" v-for="product in displayProducts" :key="product.productID" style="padding: .5rem;">
                        <div :is="productCardComponent" class="productCard" :componentData="product"></div>
                    </div>
                </div>
            </div>

            <q-inner-loading :visible="!displayProducts && (environmentProductAndTagState ? true : false)" align="center">
                <q-spinner :size="30" />
                loading products...
            </q-inner-loading>

            <h5 v-if="displayProducts && !displayProducts.length" align="center" class="full-width">No videos found, please try again.</h5>

            <div class="col-12" id="bottom"></div>

        </div>

        <div v-else>
            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('beginner')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> Beginner workouts</h6>
            </div>

            <productSection :componentData="beginnerSectionComponentData" :sectionIndex="-1" />

            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('intermediate')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> Intermediate workouts</h6>
            </div>

            <productSection :componentData="intermediateSectionComponentData" :sectionIndex="-1" />

            <div class="row well" style="margin-top: 2rem; padding: 0 1rem;">
                <h6 style="text-transform: uppercase;"><img :src="levelImageSrc('advanced')" style="max-width: 3rem; vertical-align: bottom; margin: -0.5rem 0;" /> Advanced workouts</h6>
            </div>

            <productSection :componentData="advancedSectionComponentData" :sectionIndex="-1" />

            <div class="row well">
                <div class="col-12" align="center" style="padding: 0 0.5rem;">
                    <div :style="`background: ${componentData.nutritionBanner.backgroundColor || '#fff'};`">
                        <div id="hero" @click="navigate" :style="bannerStyle">

                            <div class="color-overlay" :style="overlayStyle"></div>
                            <div style="height: 100%;" class="flex justify-end items-center q-mr-lg">
                                <h1 class="text-weight-medium" v-if="componentData.nutritionBanner.title" :style="`color: ${pvolveMintTitle};`" v-html="componentData.nutritionBanner.title"></h1>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <productSection :componentData="nutritionSectionComponentData" :sectionIndex="-1">
                <template slot="showAllButton">
                    <q-btn outline @click="route('/nutrition')" style="background-color: #fff !important;">
                        <h6>SHOW ALL</h6>
                    </q-btn>
                </template>
            </productSection>

        </div>

        <q-modal
            v-model="openOnboardingModal"
            :content-css="{width: '550px', minHeight: '80vh'}"
        >
            <q-modal-layout id="pvolveOnboardingModalLayout">

                <pvolveOnboarding v-if="openOnboardingModal" @close="openOnboardingModal = false" />

            </q-modal-layout>
        </q-modal>

    </div>

</template>

<script>
    import pvolveStructuredProducts from './pvolveStructuredProducts'
    import defaultTagSidebar from '../../common/tagSidebar'
    import pvolveHomeSearch from './pvolveHomeSearch'
    import pvolveOnboarding from './pvolveOnboarding'
    import pvolveTrialOrSubscribe from './pvolveTrialOrSubscribe'
    import productSection from '../../common/showcase/productSection'

    import { pvolveColors } from './pvolveColors'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'
    import { contentItemFiltering } from '../../../mixins/contentItemFiltering'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productCardLoad } from '../../../mixins/productCardLoad'
    import { pvolveLibrarySortTools } from './pvolveLibrarySortTools'
    import { designTools } from '../../../mixins/designTools'

    import OnScreen from 'onscreen'

    const os = new OnScreen()

    export default {
        props: ['componentData'],

        mixins: [userAndProductInfo, globalComputedData, contentItemFiltering, productCardLoad, pvolveColors, pvolveProductSectionTools, pvolveLibrarySortTools, designTools],

        components: {
            defaultTagSidebar,
            pvolveHomeSearch,
            pvolveStructuredProducts,
            pvolveOnboarding,
            pvolveTrialOrSubscribe,
            productSection
        },

        data() {
            return {
                openOnboardingModal: false,
                openSearch: false,
                openFilters: false,
                batchIndex: 1,
                gridDelta: 12,
                tagSidebar: 'defaultTagSidebar',
                showMobileFilters: false,
                doNotShowOnboarding: false,

                showProductButton(productID) {
                    return this.userHasAccess([productID])
                }
            }
        },

        computed: {
            showDisplayProducts() {
                return !this.componentData.filterOnlyMode || (this.searchString.length || this.userSelectedTags.length || this.sortLibraryTopRated || this.sortLibraryMostRecent || this.sortLibraryWorkoutLength || this.showFavoritesOnly || this.showExclusiveContentOnly)
            },

            ownsSubscription() {
                return this.userSubscriptionProductStatusHistory ? this.userSubscriptionProductStatusHistory.filter((status) => {
                    return status.accessStatus && status.accessStatus !== 'inactive'
                }).length ? true : false : false
            },

            forSaleProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.available4Sale
                }) : []
            },

            ownsSubscription() {
                return this.userSubscriptionProductStatusHistory ? this.userSubscriptionProductStatusHistory.filter((status) => {
                    return status.accessStatus && status.accessStatus !== 'inactive'
                }).length ? true : false : false
            },

            userActiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer && (product.productType == 'bundleProduct' || product.productType === 'exclusiveContent')
                }) : []
            },

            productScope() {
                k('product scope: ', this.componentData.productScope, this.ownsSubscription, this.userActiveProducts)

                return this.componentData.productScope ? this[this.componentData.productScope] : this.forSaleProducts
            },

            topRatedSort() {
                var productPool = this.j_.cloneObject(this.productPool)
                return productPool.sort((a, b) => {
                    return b.avgRating - a.avgRating
                })
            },

            mostRecentSort() {
                let productPool = this.j_.cloneObject(this.productPool)
                let productSort = []

                if (this.componentData.productScope === 'nutritionProducts') {
                    productSort = productPool.sort((a, b) => {
                        const secondDate = this.moment(b.lastUpdate).valueOf()
                        const firstDate = this.moment(a.lastUpdate).valueOf()
                        return secondDate - firstDate
                    })
                } else {
                    productSort = productPool.sort((a, b) => b.productID - a.productID)
                }

                return productSort
            },

            workoutLengthSort() {
                let productPool = this.j_.cloneObject(this.productPool)

                return productPool.sort((a, b) => a.duration - b.duration)
            },

            onlyFavoritedProducts() {
                var productPool = this.j_.cloneObject(this.productPool)
                return productPool.filter(product => this.favoritedProductIDs.includes(product.productID))
            },

            onlyExclusiveContent() {
                var productPool = this.j_.cloneObject(this.productPool)
                return productPool.filter(product => product.productType === 'exclusiveContent')
            },

            productPool() {
                var products = this.productScope

                k('products: ', products, this.userSelectedTags, this.userSelectedTags.length)

                if (this.userSelectedTags && this.userSelectedTags.length) {
                    products = this.getProductsThatMatchTags(this.userSelectedTags, this.productScope)
                }

                if (this.searchString) products = this.j_.queryArrayAllPartialMatches(this.productScope, 'searchString', this.searchString)

                k('productPool: ', products)
                k('environmentProducts: ', this.environmentProducts)

                return products
            },

            displayProducts() {
                var displayProducts = this.productsToLoad.slice(0, this.batchIndex * this.gridDelta)
                k('displayingProducts: ', displayProducts)

                return displayProducts
            },

            productsToLoad() {
                var productsToLoad = ''

                if (this.productPool) {
                    productsToLoad = this.productPool

                    // only one sort at a time
                    if (this.sortLibraryTopRated) productsToLoad = this.topRatedSort
                    if (this.sortLibraryMostRecent || this.componentData.productScope !== 'workoutProducts') productsToLoad = this.mostRecentSort
                    if (this.sortLibraryWorkoutLength) productsToLoad = this.workoutLengthSort
                    if (this.showFavoritesOnly) productsToLoad = this.onlyFavoritedProducts
                    if (this.showExclusiveContentOnly) productsToLoad = this.onlyExclusiveContent
                }

                return productsToLoad
            },

            searchString() {
                return this.$store.state.searchString
            },

            tagHeadingsObj4Scope() {
                let tagHeadingsObj4Scope

                if (this.componentData.productScope && this[this.componentData.productScope] && this[this.componentData.productScope].length) {
                    //grab all tagIDs from productScope
                    let allTagIDs4Scope = []
                    this[this.componentData.productScope].forEach((product) => {
                        if (product.tags) product.tags.split(',').forEach((tagID) => {
                            if (!allTagIDs4Scope.includes(tagID)) allTagIDs4Scope.push(tagID)
                        })
                    })

                    let localEnvironmentTagHeadingObj = this.j_.cloneObject(this.environmentTagHeadingObj)

                    let tagHeadings = Object.keys(localEnvironmentTagHeadingObj)

                    tagHeadings.forEach((heading) => {

                        let tagNames = Object.keys(localEnvironmentTagHeadingObj[heading].tags)

                        tagNames.map((name) => {
                            let tag = localEnvironmentTagHeadingObj[heading].tags[name]

                            if (!allTagIDs4Scope.includes(String(tag.id))) delete localEnvironmentTagHeadingObj[heading].tags[name]
                        })

                        if (!Object.keys(localEnvironmentTagHeadingObj[heading].tags).length) delete localEnvironmentTagHeadingObj[heading]
                    })

                    tagHeadingsObj4Scope = localEnvironmentTagHeadingObj

                } else {
                    tagHeadingsObj4Scope = this.environmentTagHeadingObj
                }

                return tagHeadingsObj4Scope
            },

            userActiveTags() {
                return this.environmentTags ? Object.keys(this.environmentTags).filter((tagKey) => {
                    var tag = this.environmentTags[tagKey]
                    return tag.userActiveProduct && tag.webplayer
                }) : ''
            },

            showTagSidebar() {
                return this.componentData.showTagSidebar
            },

            homePageData() {
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

            pbandOnlyUser() {
                return this.userHasAccess([151876]) && !this.userHasAccess(this.homePageData.e.validSubscriptionProductIDs)
            },

            title() {
                return this.componentData.title || ''
            },

            filterTitle() {
                return this.componentData.filterTitle || ''
            },

            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/' + this.componentData.nutritionBanner.backgroundImageURL
            },

            bannerStyle() {
                return {
                    'background': this.componentData.nutritionBanner.backgroundImageURL ? `url("${this.heroImageSrc}")` : '',
                    'background-position': this.componentData.nutritionBanner.backgroundPosition || '50% 0%',
                    'background-size': this.componentData.nutritionBanner.backgroundSize || 'cover',
                    'background-repeat': 'no-repeat',
                    'height': this.componentData.nutritionBanner.height || '300px',
                    'cursor': this.componentData.nutritionBanner.route ? 'pointer' : '',
                    'padding': this.windowWidth > 992 ? '8rem' : '1rem'
                }
            },

            overlayStyle() {
                return {
                    'overlayColor': this.componentData.nutritionBanner.overlayColor ? `background-color: ${overlayColor};`: '',
                    'overlayOpacity':this.componentData.nutritionBanner.overlayOpacity ? `opacity: ${this.windowWidth < 768 ? '.5' : overlayOpacity};` : ''
                }
            }

        },

        methods: {
            lazyLoad(element) {
                if (this.displayProducts && (this.displayProducts.length !== this.productPool.length)) this.batchIndex = Number(this.batchIndex) + 1
            },

            hideElement(element) {
                element.style.visibility = 'hidden'
            },

            showElement(element) {
                element.style.visibility = 'visible'
            },

            selectTag(tagID) {
                k('selectTag: ', tagID, this.userSelectedTags)
                this.$store.commit('userSelectedTag', String(tagID))
            },

            closeOnboarding() {
                this.openOnboardingModal = false
            },

            openOnboarding() {
                this.api.sendEvent({
                    eventType: 'userLaunchedOnboarding',
                    eventDesc: 'user tapped to see the onboarding modal',
                    userID: this.userInfo.userID
                })

                this.openOnboardingModal = true
            },

            structuredProductButton(routePath) {
                this.$store.commit('setProductLaunchContext', 'productCard')
                this.route(routePath)
            },

            sortLibrary(type) {
                switch (type) {
                    case 'favorites':
                        this.$store.commit('setShowFavoritesOnly', !this.showFavoritesOnly)
                        this.$store.commit('sortLibraryTopRated', false)
                        this.$store.commit('sortLibraryMostRecent', false)
                        this.$store.commit('sortLibraryWorkoutLength', false)
                        break;

                    case 'topRated':
                        this.$store.commit('setShowFavoritesOnly', false)
                        this.$store.commit('sortLibraryTopRated', !this.sortLibraryTopRated)
                        this.$store.commit('sortLibraryMostRecent', false)
                        this.$store.commit('sortLibraryWorkoutLength', false)
                        break;

                    case 'mostRecent':
                        this.$store.commit('setShowFavoritesOnly', false)
                        this.$store.commit('sortLibraryTopRated', false)
                        this.$store.commit('sortLibraryMostRecent', !this.sortLibraryMostRecent)
                        this.$store.commit('sortLibraryWorkoutLength', false)
                        break;

                    case 'workoutLength':
                        this.$store.commit('setShowFavoritesOnly', false)
                        this.$store.commit('sortLibraryTopRated', false)
                        this.$store.commit('sortLibraryMostRecent', false)
                        this.$store.commit('sortLibraryWorkoutLength', !this.sortLibraryWorkoutLength)
                        break;

                    default:
                        this.$store.commit('setShowFavoritesOnly', false)
                        this.$store.commit('sortLibraryTopRated', false)
                        this.$store.commit('sortLibraryMostRecent', false)
                        this.$store.commit('sortLibraryWorkoutLength', false)
                }
            },

            goToSignUpNow() {
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.signUpNow', value: true })
                this.route('/offer/special?signUpNow=true')
            },

            toggleSearch() {
                this.openSearch = !this.openSearch
                if (this.openFilters) {
                    this.openFilters = false
                }

                if (this.userSelectedTags && this.userSelectedTags.length) {
                    this.$root.$emit('clearPvolveFilters')
                }
            },

            toggleFilters() {
                this.openFilters = !this.openFilters
                if (this.openSearch) {
                    this.openSearch = false
                }

                if (this.searchString) {
                    this.$store.commit('searchString', '')
                }
            },

            navigate() {
                const route = this.componentData.nutritionBanner.route
                if (route) this.$router.push(`/${route}`)
            }
        },

        watch: {
            searchString() {
                k('filter by search: ', this.searchString)

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
                if (this.userSelectedTags && this.userSelectedTags.length) {

                    const tagNames = this.userSelectedTags.map(tagID => this.environmentTags[tagID].tagName)

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

                    this.api.sendEvent(logEventObj)
                }
            },

            doNotShowOnboarding() {
                if (this.doNotShowOnboarding) this.localStorage.set('onboarded', true)
            },

            favoritedProductIDs() {
                k('favoritedProductIDs: ', this.favoritedProductIDs)

                if (this.favoritedProductIDs && !this.favoritedProductIDs.length && this.showFavoritesOnly) {
                    this.$store.commit('setShowFavoritesOnly', false)
                }
            },

            userInfo() {
                if (this.userInfo) {
                    this.getUserPreferences(() => {})
                }
            },
            
            productPool() {
                k('productPool watch')
                this.batchIndex = 1
            }
        },

        created() {
            // TODO: need to clean applied filters when productScope changes, but is there a better way to compare views?
            // case: user moves to a product and comes back, need to save filters
            // case: user moves to different filter view, need to reset filters

            if (this.componentData.productScope !== this.$store.state.actualProductScope) {
                this.$store.commit('setUserSelectedTags', '')
                this.$store.commit('setShowExclusiveContentOnly', false)
                this.$store.commit('setShowFavoritesOnly', false)
                this.$store.commit('sortLibraryTopRated', false)
                this.$store.commit('sortLibraryMostRecent', false)
                this.$store.commit('sortLibraryWorkoutLength', false)
                this.$store.commit('searchString', '')
            }

            this.$store.commit('setActualProductScope', this.componentData.productScope)

            if (this.userInfo) {
                this.getUserPreferences(() => {})
            }

            if (this.componentData.customTagSidebar) {
                var sidebarData = this.homePageSectionFromID(this.componentData.customTagSidebar)
                this.loadIt(sidebarData.component, 'customComponents/' + sidebarData.componentPath.replace('.html', ''))
                this.tagSidebar = sidebarData.component
            }

            os.on('enter', '#bottom', this.lazyLoad)
            os.on('leave', '.productCard', this.hideElement)
            os.on('enter', '.productCard', this.showElement)

        }
    }
</script>

<style scoped>
    .productCard {
        height: 100%;
    }

    .pchip {
        color: #fff;
        background: #fff;
        border-radius: .25rem;
        padding: .25rem .5rem;
        margin: 0;
    }
</style>
