import Vue from 'vue'
import Vuex from 'vuex'
import j_ from '@jmellicker/j_'
import api from '../js/api'
import cookies from '../js/cookies'
import localStorageLibrary from 'store'

import LogRocket from 'logrocket'
import createPlugin from 'logrocket-vuex'
const logrocketPlugin = createPlugin(LogRocket)

Vue.use(Vuex)

function removeDiscountFromProduct(state) {
    var cartForStorage = j_.cloneObject(state.cart).map((product) => {
        if (product.discountedPrice || product.discountedPrice === 0) delete product.discountedPrice
        if (product.itemIsDiscounted) delete product.itemIsDiscounted
        return product
    })
    k('cartForStorage: ', cartForStorage)
    return cartForStorage
}

const store = new Vuex.Store({
    plugins: [logrocketPlugin],
    state: {
        // jjtest: '',
        windowWidth: '',
        windowHeight: '',

        sessionGroup: '',
        sessionLogObj: '',
        userAgentInfo: '',

        firstVisitToEnvironment: true,

        user: {
            userLoginToken: '',
            anonymousUserID: '',
            authenticated: false,
            info: '',
            preferences: '',
            preferencesState: '',
            sourceAffID: '',
            referralToken: ''
        },

        userCourseCompletionData: '',

        environment: {
            name: '',
            data: '',
            json: ''
        },

        navBarData: [{
            pageRoute: '/',
            icon: 'fa-home',
            title: 'Home',
            id: 'home',
            navItemSKU: 'home'
        }, {
            pageRoute: '/library',
            icon: 'fa-play-circle',
            title: 'My Library',
            id: 'library',
            navItemSKU: 'library'
        }, {
            pageRoute: '/shop',
            icon: 'fa-shopping-bag',
            title: 'Shop',
            id: 'shop',
            navItemSKU: 'shop'
        }, {
            action: 'openShopCart',
            icon: 'fa-shopping-cart',
            title: 'Cart',
            id: 'cart',
            navItemSKU: 'cart'
        }, {
            pageRoute: '/support',
            icon: 'fa-medkit',
            title: 'Support',
            id: 'support',
            navItemSKU: 'support'
        }, {
            pageRoute: '/account',
            icon: 'fa-cog',
            title: 'Account',
            id: 'account',
            navItemSKU: 'account'
        }],

        initialParameters: '',

        editMode: false,
        currentSectionEditIndex: '',
        originalHomePageSections: '',

        currentPlaylistID: '',

        newOrganizationName: '',

        cart: [],
        saveCartToLocalStorage: true,
        productPreviewModalOpen: false,
        productPreviewData: '',
        giftBoxes: {},
        giftCard: '',
        receiptHTML: '',
        receiptInfo: '',
        userSelectedTags: [],

        purchaseTotal: '',

        shopifyProductData: '',
        equipmentUsed: '',

        environmentProducts: '',
        environmentTags: '',
        environmentTagHeadingObj: '',
        environmentProductAndTagState: '',

        userSubscriptionProductStatusHistory: '',

        activationCode: '',

        currentMediaType: '',

        allComponentsForViewLoaded: false,
        currentView: '',
        productID2Preview: '',
        currentProduct: '',
        productLaunchContext: '',
        currentChapter: '',
        currentChapterIndex: '',
        nestedChapters: '',
        previewOpen: false,
        searchString: '',
        // offerBrand: '',
        // offerProductID: '',

        chapterIndexToStartFrom: '',
        chapterStartSecondsToPlayFrom: '',

        sortLibraryTopRated: '',
        sortLibraryMostRecent: '',
        showFavoritesOnly: '',
        showExclusiveContentOnly: '',
        sortLibraryWorkoutLength: '',
        showOnlyOwnedAndPlayable: '',

        openPlayerModal: '',
        resumableDropZone: {
            uploadNow: false,
            query: '',
            fileName: '',
            fileInfo: '',
            imageSrc: '',
            pdfSrc: '',
            droppedImageSrc: '',
            mediaDropped: '',
            mediaUploading: '',
            mediaUploadProgress: 0,
            fileTypesAllowed: '',
            fileExtensionsAllowed: '',
            mediaPurpose: '',
            target: '',
            maxFiles: undefined,
            fileSizeLimit: ''
        },

        support: {
            issueLoader: false,
            issuesReassigned: false,
            pageOffset: 1,
            batchSize: 10,
            displayStart: 0,
            totalNumberOfOpenIssuesInDB: '',
            currentIssueIndex: -1,
            supportIssues: '',
            onlineSupportTeam: [],
            issueFilter: 'open',
            searchString: ''
        },

        columnsPerRowMap: {
            'eight': 'col-xs-6 col-sm-4 col-md-3 col-lg-2',
            'seven': 'col-xs-6 col-sm-4 col-md-3 col-lg-2',
            'six': 'col-xs-6 col-sm-4 col-md-3 col-lg-2',
            'five': 'col-xs-6 col-sm-4 col-md-3 col-lg-2',
            'four': 'col-xs-6 col-sm-3',
            'three': 'col-xs-6 col-sm-4',
            'two': 'col-xs-6',
        }
    },

    mutations: {
        addKeyPathInStore(state, obj) {
            k('addKeyPathInStore: ', obj)
            // send a keyPath, e.g. 'environment.data.affiliateID' and i will add it
            // the path must exist (for now, will add .set to make dynamic generation of reactive keypaths possible in the future)
            switch (typeof obj.value) {
                case 'string':
                    eval(`state.${obj.keyPath} = "${obj.value}"`)
                    break
                case 'object':
                    eval(`state.${obj.keyPath} = ${JSON.stringify(obj.value)}`)
                    break
                default:
                    eval(`state.${obj.keyPath} = ${obj.value}`)
            }
        },

        deleteKeyPathInStore(state, keyPath) {
            // send a keyPath, e.g. 'environment.data.affiliateID' and i will delete it
            eval('delete state.' + keyPath)
        },

        windowWidth(state, width) {
            state.windowWidth = width
        },

        windowHeight(state, height) {
            state.windowHeight = height
        },

        firstVisitToEnvironment(state, val) {
            state.firstVisitToEnvironment = val
        },

        newOrganizationName(state, val) {
            state.newOrganizationName = val
        },

        currentPlaylistID(state, id) {
            state.currentPlaylistID = id
        },

        openPlayerModal(state, val) {
            state.openPlayerModal = val
        },

        chapterIndexToStartFrom(state, index) {
            state.chapterIndexToStartFrom = index
        },

        chapterStartSecondsToPlayFrom(state, val) {
            state.chapterStartSecondsToPlayFrom = val
        },

        issueLoader(state, val) {
            state.support.issueLoader = val
        },

        issuesReassigned(state, val) {
            state.support.issuesReassigned = val
        },

        batchSize(state, index) {
            state.support.batchSize = index
        },

        pageOffset(state, index) {
            state.support.pageOffset = index
        },

        issueFilter(state, val) {
            state.support.issueFilter = val
        },

        currentIssueIndex(state, index) {
            state.support.currentIssueIndex = index
        },

        updateSupportIssue(state, data) {
            state.support.supportIssues.splice(data.index, 1, data.issue)
        },

        supportIssues(state, data) {
            state.support.supportIssues = data
        },

        onlineSupportTeam(state, data) {
            state.support.onlineSupportTeam = data
        },

        totalNumberOfOpenIssuesInDB(state, count) {
            state.support.totalNumberOfOpenIssuesInDB = count
        },

        sessionGroup(state, id) {
            state.sessionGroup = id
        },

        sessionLogObj(state, obj) {
            state.sessionLogObj = obj
        },

        userAgentInfo(state, obj) {
            state.userAgentInfo = obj
        },

        authenticated(state, boolean) {
            state.user.authenticated = boolean
        },

        userInfo(state, info) {
            try {
                window.user = {}
                window.user.email = info.userEmail
            } catch(error){

            }

            state.user.info = info
        },

        userFirstName(state, data) {
            state.user.info.firstName = data
        },

        userLastName(state, data) {
            state.user.info.lastName = data
        },

        userEmail(state, data) {
            state.user.info.userEmail = data
        },

        userPreferences(state, data) {
            state.user.preferences = data
        },

        userPreferencesState(state, data) {
            state.user.preferencesState = data
        },

        goingTo(state, route) {
            state.goingTo = route
        },

        editMode(state, val) {
            state.editMode = val
        },

        currentSectionEditIndex(state, val) {
            state.currentSectionEditIndex = val
        },

        updateHomePageSection(state, index, key, val) {
            state.environment.json.homePageSections[index][key] = val
        },

        homePageSections(state, val) {
            state.environment.json.homePageSections = val
        },

        originalHomePageSections(state, val) {
            state.originalHomePageSections = val
        },

        currentView(state, view) {
            state.currentView = view
        },

        initialParameters(state, data) {
            state.initialParameters = data
        },

        activationCode(state, data) {
            state.activationCode = data
        },

        userLoginToken(state, token) {
            state.user.userLoginToken = token
            cookies.setCookie('userLoginToken', token)
        },

        referralToken(state, token) {
            state.user.referralToken = token
            cookies.setCookie('referralToken', token)
        },

        sourceAffID(state, token) {
            state.user.sourceAffID = token
            cookies.setCookie('sourceAffID', token)
        },

        anonymousUserID(state, token) {
            state.user.anonymousUserID = token
            cookies.setCookie('anonymousUserID', token)
        },

        saveEnvironmentName(state, data) {
            state.environment.name = data
        },

        saveEnvironmentData(state, data) {
            state.environment.data = data
        },

        saveHomePageJSON(state, data) {
            state.environment.json = data
        },

        saveNavBarData(state, data) {
            state.navBarData = data
        },

        allComponentsForViewLoaded(state, boolean) {
            state.allComponentsForViewLoaded = boolean
        },

        setProductID2Preview(state, data) {
            state.productID2Preview = data
        },

        receiptHTML(state, data) {
            state.receiptHTML = data
        },

        receiptInfo(state, data) {
            state.receiptInfo = data
        },

        setProductLaunchContext(state, data) {
            state.productLaunchContext = data
        },

        setCurrentProduct(state, data) {
            state.currentProduct = data
        },

        setCurrentChapter(state, data) {
            state.currentChapter = data
        },

        setCurrentChapterIndex(state, data) {
            state.currentChapterIndex = data
        },

        nestedChapters(state, data) {
            state.nestedChapters = data
        },

        setProductPreviewData(state, data) {
            state.productPreviewData = data
        },

        productPreviewModalOpen(state, bool) {
            state.productPreviewModalOpen = bool
        },

        openShopCart(state, bool) {
            state.openShopCart = bool
        },

        add2cart(state, product) {
            state.cart.push(product)

            if (state.saveCartToLocalStorage) {
                var cartForStorage = removeDiscountFromProduct(state)
                localStorageLibrary.set(state.environment.name, cartForStorage)
            }

            var logEventObj = {
                eventType: product.recipientName ? 'giftAdded2Cart' : 'add2cart',
                eventDesc: 'added to cart: "' + product.productName + '"',
                productID: product.productID,
                productSKU: product.productSKU,
                productName: product.productName,
                publisherID: product.publisherID,
                productPrice: product.productPrice,
                clientProductSKU: product.clientProductSKU
            }
            api.sendEvent(logEventObj)
        },

        saveCart(state, newCart) {
            state.cart = newCart

            if (state.saveCartToLocalStorage) {
                var cartForStorage = removeDiscountFromProduct(state)
                localStorageLibrary.set(state.environment.name, cartForStorage)
            }
        },

        updateCartItem(state, index, item) {
            state.cart[index] = item
            if (state.saveCartToLocalStorage) {
                var cartForStorage = removeDiscountFromProduct(state)
                localStorageLibrary.set(state.environment.name, cartForStorage)
            }
        },

        removeFromCart(state, item2remove) {
            var newCart = []
            for (var i = 0; i < state.cart.length; i++) {
                if (state.cart[i].productID == item2remove.productID && state.cart[i].recipientName == item2remove.recipientName) {
                    // this is the item to remove; don't do anything
                    k('item 2 remove: ', state.cart[i])
                }
                else {
                    // k('add to new cart')
                    newCart.push(state.cart[i])
                }
            }
            state.cart = newCart

            if (state.saveCartToLocalStorage) {
                var cartForStorage = removeDiscountFromProduct(state)
                localStorageLibrary.set(state.environment.name, cartForStorage)
            }

            var logEventObj = {
                eventType: 'removeFromCart',
                productID: item2remove.productID,
                productSKU: item2remove.productSKU,
                clientProductSKU: item2remove.clientProductSKU,
                productName: item2remove.productName,
                publisherID: item2remove.publisherID,
                productPrice: item2remove.productPrice,
                eventDesc: 'removed from cart: "' + item2remove.productName + '"',
                eventCategory: 'cart'
            }
            api.sendEvent(logEventObj)
        },

        saveCartToLocalStorage(state, bool) {
            state.saveCartToLocalStorage = bool
        },

        clearCart(state) {
            state.cart = []

            if (state.saveCartToLocalStorage) {
                var cartForStorage = removeDiscountFromProduct(state)
                localStorageLibrary.set(state.environment.name, cartForStorage)
            }
        },

        giftBoxes(state, boxes) {
            state.giftBoxes = boxes
            localStorageLibrary.set(state.environment.name + 'GiftBoxes', state.giftBoxes)
        },

        searchString(state, str) {
            state.searchString = str
        },

        userSelectedTag(state, id) {
            if (state.userSelectedTags.includes(id)) {
                state.userSelectedTags.splice(state.userSelectedTags.indexOf(id), 1)
            }
            else {
                state.userSelectedTags.push(id)
            }
        },

        setUserSelectedTags(state, tagIDs) {
            if (tagIDs) {
                state.userSelectedTags = tagIDs.includes(',') ? tagIDs.split(',') : [tagIDs]
            }
            else {
                state.userSelectedTags = []
            }
        },

        giftCard(state, data) {
            state.giftCard = data
        },

        purchaseTotal(state, data) {
            state.purchaseTotal = data
        },

        environmentProducts(state, data) {
            state.environmentProducts = data
        },

        environmentTags(state, data) {
            state.environmentTags = data
        },

        environmentTagHeadingObj(state, data) {
            state.environmentTagHeadingObj = data
        },

        environmentProductAndTagState(state, data) {
            state.environmentProductAndTagState = data
        },

        userSubscriptionProductStatusHistory(state, data) {
            state.userSubscriptionProductStatusHistory = data
        },

        currentMediaType(state, type) {
            state.currentMediaType = type
        },

        dropZoneTarget(state, val) {
            state.resumableDropZone.target = val
        },

        dropZoneMaxFiles(state, val) {
            state.resumableDropZone.maxFiles = val
        },

        dropZoneMaxFiles(state, val) {
            state.resumableDropZone.maxFiles = val
        },

        dropZoneFileTypesAllowed(state, val) {
            state.resumableDropZone.fileTypesAllowed = val
        },

        dropZoneFileExtensionsAllowed(state, val) {
            state.resumableDropZone.fileExtensionsAllowed = val
        },

        dropZoneMediaDropped(state, val) {
            state.resumableDropZone.mediaDropped = val
        },

        dropZoneFileName(state, val) {
            state.resumableDropZone.fileName = val
        },

        dropZoneImageSrc(state, val) {
            state.resumableDropZone.imageSrc = val
        },

        dropZonepdfSrc(state, val) {
            state.resumableDropZone.pdfSrc = val
        },

        dropZoneDroppedImageSrc(state, val) {
            state.resumableDropZone.droppedImageSrc = val
        },

        dropZoneFileInfo(state, val) {
            state.resumableDropZone.fileInfo = val
        },

        dropZoneQuery(state, val) {
            state.resumableDropZone.query = val
        },

        dropZoneUploadNow(state, val) {
            state.resumableDropZone.uploadNow = val
        },

        dropZoneMediaUploading(state, val) {
            state.resumableDropZone.mediaUploading = val
        },

        dropZoneMediaUploadProgress(state, val) {
            state.resumableDropZone.mediaUploadProgress = val
        },

        dropZoneFileSizeLimit(state, val) {
            state.resumableDropZone.fileSizeLimit = val
        },

        shopifyProductData(state, val) {
            state.shopifyProductData = val
        },

        equipmentUsed(state, val) {
            state.equipmentUsed = val
        },

        sortLibraryTopRated(state, val) {
            state.sortLibraryTopRated = val
        },

        sortLibraryMostRecent(state, val) {
            state.sortLibraryMostRecent = val
        },

        sortLibraryWorkoutLength(state, val) {
            state.sortLibraryWorkoutLength = val
        },

        setShowFavoritesOnly(state, data) {
            state.showFavoritesOnly = data;
        },

        setActualProductScope(state, data) {
            state.actualProductScope = data
        },

        setShowExclusiveContentOnly(state, data) {
            state.showExclusiveContentOnly = data;
        },

        showOnlyOwnedAndPlayable(state, data) {
            state.showOnlyOwnedAndPlayable = data;
        },

        userCourseCompletionData(state, data) {
            state.userCourseCompletionData = data;
        }
    }
})

export default store
