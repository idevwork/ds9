
import scapegoat from 'scapegoat'
import LogRocket from 'logrocket'

export const userAndProductInfo = {
    computed: {
        userLoginToken() {
            return this.$store.state.user.userLoginToken
        },

        environmentData() {
            return this.$store.state.environment.data
        },

        environmentName() {
            return this.$store.state.environment.name
        },

        environmentJSON() {
            return this.$store.state.environment.json
        },

        environmentProducts() {
            return this.$store.state.environmentProducts
        },

        environmentProductAndTagState() {
            return this.$store.state.environmentProductAndTagState
        },

        initialParameters() {
            return this.$store.state.initialParameters
        },

        userInfo() {
            return this.$store.state.user.info
        },

        userPreferences() {
            return this.$store.state.user.preferences
        },

        userPreferencesState() {
            return this.$store.state.user.preferencesState
        }
    },

    methods: {
        getUserInfo(cb) {

            this.api.get(this.api.apiv4Route + 'api/user/infoFromLoginToken?includeOrgData=true&userLoginToken=' + this.userLoginToken, res => {
                k('getUserInfo: ', res)

                if (!res || res.error || !res.success || !res.userInfo) {
                    cb(false)
                } else {

                    var userInfo = res.userInfo

                    // see if purpleTeam
                    if (userInfo.userOrgs.some((o) => {
                            return o.organizationID == 678 || o.organizationID == 3915
                        })) {
                        userInfo.purpleTeam = true
                    }

                    //set for console
                    userInfo.currentOrganizationIndex = 0

                    if (window.LRInited) {
                        LogRocket.identify('userInfo.userID', {
                          name: userInfo.firstName,
                          email: userInfo.userEmail
                        })
                    }

                    if (window.FSInited) {
                        FS.identify(userInfo.userID, {
                            displayName: userInfo.firstName,
                            email: userInfo.userEmail,
                            reviewsWritten_int: 14,
                        });
                    }

                    cb(userInfo)
                }
            })
        },

        getUserPreferences(cb, refreshData) {
            k('get user preferences: ', this.userPreferences, this.userPreferencesState)

            if ((!this.userPreferences || refreshData) && this.userInfo.userID && this.environmentName && this.userPreferencesState !== 'fetching') {
                this.$store.commit('userPreferencesState', 'fetching')

                this.api.get(this.api.ioRoute + 'userInfo/' + this.userInfo.userID + '/' + this.environmentName, (res) => {
                    k('getUserPreferences res: ', res)

                    this.$store.commit('userPreferencesState', 'fetched')

                    if (res.success) {
                        this.$store.commit('userPreferences', res.userInfo)
                        // this.generateUserInfoStatsMap()
                    }
                    cb()

                    // this.displayDateTimeStamp = Date.now()
                })
            } else {
                cb()
            }
        },
        
        getDataForUserPref(keyToFind, value) {
            let self = this
            
            const findPref = (keyToFind, value) => {
                return self.j_.queryArrayFirstMatch(this.userPreferences, keyToFind, value)
            }
            
            if (!this.userPreferences) {
                this.getUserPreferences(res => {
                    return findPref(keyToFind, value)
                })
            } else {
                return findPref(keyToFind, value)
            }
        },

        saveUserPreferenceToAPI(preferenceID, req, cb) {
            const method = preferenceID ? 'put' : 'post';
            const endpointURL = `${this.api.ioRoute}userInfo${preferenceID ? '/' + preferenceID : ''}`

            k('saveUserPreferenceToAPI req: ', req, method, endpointURL)

            this.api[method](endpointURL, req, (res) => {
                k('saveUserPreferenceToAPI res: ', res)

                if (res.success) {
                    if (res.docID) {
                        req.id = res.docID
                    } else {
                        req.id = preferenceID
                    }

                    this.replaceOrAddLocalUserPreference(req)
                }

                cb(res)
            })
        },

        replaceOrAddLocalUserPreference(newPreference) {
            if (!this.userPreferences) {
                this.$store.commit('userPreferences', []);
            }

            let cloneUserPreferences = this.j_.cloneObject(this.userPreferences)
            let index = cloneUserPreferences.findIndex(preference => preference['type' || 'userInfoType'] === newPreference['type' || 'userInfoType'])
            k('replaceOrAddLocalUserPreference index: ', index)

            if (index > -1) {
                cloneUserPreferences[index] = newPreference;
            } else {
                cloneUserPreferences.push(newPreference)
            }

            this.$store.commit('userPreferences', cloneUserPreferences)
        },

        updateUserInfo(req, cb) {
            // send me an object with any keys you want updated
            // k('updateUserInfo req: ', req)

            this.api.post(this.api.apiv4Route + 'api/user/updateUserInfo', req, (res) => {
                // k('updateUserInfo res: ', res)
                cb(res)
            })
        },

        getUserSubscriptionProductStatusHistory() {
            if (!this.environmentData || !this.environmentJSON || !this.environmentJSON.e.validSubscriptionProductIDs || !this.userLoginToken) {
                kw('wait for info to getUserSubscriptionProductStatusHistory')
                return false
            }

            var req = {
                "userLoginToken": this.userLoginToken,
            	"productIDs": this.environmentJSON.e.validSubscriptionProductIDs //optional
                // "affiliateID": this.environmentData.affiliateID  // optional
            }

            k('getUserSubscriptionProductStatusHistory req: ', req)

            this.api.post(this.api.apiv4Route + 'api/productsList/productStatusHistory', req, res => {
                k('getUserSubscriptionProductStatusHistory: ', res)

                if (res.success) {
                    if (res.data) {
                        this.$store.commit('userSubscriptionProductStatusHistory', res.data)
                    }
                }
            })
        },

        getProductsAndTags4Environment() {
            k('getProductsAndTags4Environment! ', this.environmentProductAndTagState)

            if (this.environmentProductAndTagState === 'fetchingWithToken') {
                k('already fetching with userLoginToken!')
                return false
            }

            this.$store.commit('environmentProductAndTagState', this.userLoginToken ? 'fetchingWithToken' : 'fetching')

            var route = this.api.apiv4Route + 'api/productsList/productsAndTags4Environment'

            var req = {
                userLoginToken: this.userLoginToken,
                environmentName: this.environmentName
            }

            if (this.environmentData.excludedProductTypes) req.excludedProductTypes = this.environmentData.excludedProductTypes.split(',')
            if (this.environmentData.includeAllEnvProducts) req.includeAllProducts = this.environmentData.includeAllEnvProducts
            if (this.initialParameters.testMode) req.testMode = true

            k('getProductsAndTags4Environment route/req: ', route, req)

            this.api.post(route, req, (res) => {
                k('getProductsAndTags4Environment res: ', res)

                if (res.success) {
                    for (var i = 0; i < res.products.length; i++) {
                        var product = res.products[i]
                        if (product.productAttributes) product.productAttributes = JSON.parse(product.productAttributes)
                    }

                    this.$store.commit('environmentTags', this.makeTagObj(res.tags))
                    this.$store.commit('environmentTagHeadingObj', this.makeTagHeadingObj(res.tags))
                    this.$store.commit('environmentProducts', res.products)
                    this.$store.commit('environmentProductAndTagState', 'fetched')
                } else {
                    this.$store.commit('environmentProductAndTagState', 'error')
                }
            })
        },

        getProductBundleInfo(bundleID, cb) {
            if (!bundleID) return false

            var route = `${this.api.apiv4Route}api/productBundle/componentProductsMetadata?productID=${bundleID}`
            k('getProductBundleInfo req: ', route)

            this.api.get(route, (res) => {
                k('getProductBundleInfo res: ', res)

                if (res.success) {
                    cb(res)
                } else {
                    cb(false)
                }
            })
        },

        removeEnvironmentProductInfo() {
            k('removeEnvironmentProductInfo!')

            this.$store.commit('environmentTags', '')
            this.$store.commit('environmentTagHeadingObj', '')
            this.$store.commit('environmentProducts', '')
            this.$store.commit('environmentProductAndTagState', '')
        },

        makeTagObj(tagData) {
            var tagObj = {}
            if (tagData && tagData.length > 0) {
                tagData.forEach((tag) => {
                    // k(tag)
                    if (!tagObj[tag.id]) tagObj[tag.id] = tag
                })
            }

            return tagObj
        },

        makeTagHeadingObj(tagData) {
            k('tagData: ', tagData)

            var tagHeadingObj = {}

            if (tagData && tagData.length > 0) {

                // sort by tagName
                var catArr = tagData.sort((a, b) => {
                    return this.j_.naturalSorter(a.tagName, b.tagName)
                })

                catArr.forEach((tag) => {
                    tag.selected = false
                    // if (tag.tagHeadingName === 'temp hidden') k('TAG: ', tag)

                    if (this.environmentJSON && this.environmentJSON.e.allowedTagHeadings) {
                        if (this.environmentJSON.e.allowedTagHeadings.indexOf(tag.tagHeadingName) === -1) {
                            // k('tagHeading not included: ', tag.tagHeadingName)
                            return false
                        }
                    }

                    var sanitizedTagName = tag.tagName.replace(/[^a-z0-9]/gi, '').toLowerCase()
                    if (tag.tagHeadingName === 'instructor') tag.tagHeadingName = 'instructors'

                    if (!tagHeadingObj[tag.tagHeadingName]) tagHeadingObj[tag.tagHeadingName] = {
                        tagHeadingID: tag.tagHeadingID,
                        opened: false
                    }
                    if (!tagHeadingObj[tag.tagHeadingName].tags) tagHeadingObj[tag.tagHeadingName].tags = {}
                    if (!tagHeadingObj[tag.tagHeadingName].tags[sanitizedTagName]) tagHeadingObj[tag.tagHeadingName].tags[sanitizedTagName] = tag
                })
            }

            k('makeTagHeadingObj: ', tagHeadingObj)
            return tagHeadingObj
        },

        userHasAccess(productIDArr2Check) {
            var userHasAccess

            for (var i = 0; i < productIDArr2Check.length; i++) {
                var product = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(productIDArr2Check[i]))
                // k('userHasAccess to product: ', product)

                var productStatus = product ? product.userActiveProduct : ''
                if (productStatus) {
                    userHasAccess = true
                    break;
                }
            }
            return userHasAccess
        }
    }
}
