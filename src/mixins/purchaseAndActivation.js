import { userAndProductInfo } from './userAndProductInfo'
import { globalComputedData } from './globalComputedData'
import { cartTools } from './cartTools'
import cookies from '../js/cookies'

export const purchaseAndActivation = {
    
    mixins: [ userAndProductInfo, globalComputedData, cartTools ],

    data() {
        return {
            promoCodeText: '',
            promoCode: '',
            giftCardText: '',
            giftCard: '',

            disableCheckSavedCard: false,
            saveCard: false,
            cardIsSaved: false,
            freePurchase: false,
            subscriptionProductInCart: false,
            needToCheckCartForOwnedProducts: false,

            // cartTotal: '',
            // originalCartTotal: '',

            cardDetail: {
                number: '',
                name: '',
                expiry: '',
                cvc: ''
            },

            lastFour: '',

            cardDetailError: {
                number: false,
                name: false,
                expiry: false,
                cvc: false
            },

            creditCardAPIError: false,
            creditCardExpired: false,

            owned(product) {
                return this.userHasAccess([product.productID])
            },

            inCart(product) {
                var inCart = false
                this.cart.forEach((item) => {
                    if (item.productID == product.productID && !item.recipientName) {
                        inCart = true
                    }
                })
                if (product.recipientName) inCart = false
                return inCart
            },

            productIsInShop(id) {
                var product = this.j_.queryArrayFirstMatch(this.forSaleProducts || [], 'productID', Number(id))
                // k('productIsInShop: ', this.forSaleProducts, product, id)
                return product
            },
            
            checkProductInCartForOwnership(item) {
                k('owned? ', this.owned(item), item.recipientName, item.interval)
                let owned = this.owned(item) && !item.recipientName && !item.interval
                k('owned: ', owned)
                return owned
            },
            
            purchaseLoad: false,
            paypalLoad: false,
            noToast: false
        }
    },

    computed: {
        // sessionGroup() {
        //     return this.$root.$store.state.sessionGroup
        // },

        // environment() {
        //     return this.$root.$store.state.environment
        // },

        // brandColor() {
        //     return this.$root.$store.state.environment.json.e.brandColor
        // },

        // userInfo() {
        //     return this.$root.$store.state.user.info
        // },

        // userLoginToken() {
        //     return this.$root.$store.state.user.userLoginToken
        // },

        // environmentProducts() {
        //     return this.$root.$store.state.environmentProducts
        // },

        userActiveProducts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.userActiveProduct && product.webplayer
            }) : ''
        },

        forSaleProducts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.available4Sale
            }) : ''
        },

        // initialParameters() {
        //     return this.$root.$store.state.initialParameters
        // },

        // cart() {
        //     return this.$root.$store.state.cart
        // },

        giftBoxes() {
            return this.$root.$store.state.giftBoxes
        },

        cartRecipients() {
            var recipients = {}
            for (var i = 0; i < this.cart.length; i++) {
                var recipient = this.cart[i].recipientName || 'myself'
                if (!recipients[recipient]) recipients[recipient] = []
                recipients[recipient].push(this.cart[i].productID)
            }
            return recipients
        },

        expiry() {
            return this.cardDetail.expiry.replace(/ /g, '')
        },

        expiryMonth() {
            return this.expiry.split('/')[0].length === 1 ? '0' + this.expiry.split('/')[0] : this.expiry.split('/')[0]
        },

        expiryYear() {
            return '20' + this.expiry.split('/')[1]
        },

        firstVisitToEnvironment() {
            return this.$root.$store.state.firstVisitToEnvironment
        },

        // authenticated() {
        //     return this.$root.$store.state.user.authenticated
        // },

        sessionLogObj() {
            return this.$root.$store.state.sessionLogObj
        },

        activationCode() {
            return this.$root.$store.state.activationCode
        }
    },

    watch: {

        authenticated() {
            if (this.promoCodeText) {
                k('applyPromoCode authenticated')
                this.applyPromoCode()
            }
            if (this.giftCardText) this.applyGiftCard()
            this.checkSavedCard()
        },

        cart() {
            // k('cart watch: ', this.cart)

            this.setCartTotal()
            this.setOriginalCartTotal()
            this.setSubscriptionInCartIfNeeded()

            if (!this.cart.length) {
                this.resetPromoCode()
                this.resetGiftCard()
            }
        },

        environmentProducts() {
            k('got environment products: ', this.environmentProducts, this.goingTo)

            if (this.goingTo !== '/activate' && this.goingTo !== '/redeem' && (!this.environmentProducts || !this.environmentProducts.length)) {
                k('no environment products')
                this.$q.loading.show()
                // this.purchaseLoad = true
            }
            else {
                this.$q.loading.hide()
                // this.purchaseLoad = false
            }

            if (this.environmentProducts) {
                if (this.initialParameters.cart) {
                    this.addCartParamItems2Cart()
                } else {
                    // k('should i check cart? ', this.authenticated, this.needToCheckCartForOwnedProducts)
                    if (this.authenticated && this.needToCheckCartForOwnedProducts && this.environmentProducts) {
                        this.checkCartForOwnedProducts()
                        this.needToCheckCartForOwnedProducts = false
                    }
                }
            }
        },

        giftCardText() {
            if (!this.giftCardText) {
                // k('remove gift card')
                this.resetGiftCard()
            }
        },

        promoCodeText() {
            if (!this.promoCodeText) {
                k('remove promo code')
                this.resetPromoCode()
            }
        }
    },

    // TODO: any components other than shopCheckout rely on this?
    // beforeDestroy() {
    //     this.removeURLParams()

    //     this.resetPromoCode()
    //     this.resetGiftCard()
    // },

    methods: {

        initCheckoutPage() {
            kw('checkout created: ', this.initialParameters)

            let cartItemsProductID = this.cart.map(item => item.productID)

            var logEventObj = {
                eventType: 'checkOutPageLoaded',
                eventDesc: 'user is on checkout page',
                userID: this.userInfo.userID,
                os: this.$root.$store.state.userAgentInfo.os.name,
                cartItems: cartItemsProductID
            }

            if (this.initialParameters.utm_source) logEventObj.utm_source = this.initialParameters.utm_source
            if (this.firstVisitToEnvironment) logEventObj.firstVisitToEnvironment = this.firstVisitToEnvironment

            this.api.sendEvent(logEventObj)

            this.checkSavedCard()
            this.setCartTotal()
            this.setOriginalCartTotal()

            // k('init checkout page environmentProducts: ', this.authenticated, this.environmentProducts)
            if (this.environmentProducts && this.authenticated) {
                this.checkCartForOwnedProducts()
            }
            else {
                this.needToCheckCartForOwnedProducts = true
            }

            if (this.initialParameters) {
                if (this.initialParameters.cart) {
                    // k('cart param!')
                    if (this.environmentProducts) {
                        this.addCartParamItems2Cart()
                    }
                    else {
                        // k('show loading')
                        this.$q.loading.show()
                    }
                } else if (this.initialParameters.coupon) {
                    this.promoCodeText = this.initialParameters.coupon

                    k('applyPromoCode init: ', this.initialParameters)
                    if (!this.initialParameters.cart) {
                        this.applyPromoCode()
                    }
                }

                if (this.initialParameters.giftCard) {
                    this.giftCardText = this.initialParameters.giftCard
                    if (!this.initialParameters.cart) this.applyGiftCard()
                }

                if (this.initialParameters.payPalReturnCode) {
                    // k('returning from paypal:', this.initialParameters.payPalReturnCode)

                    if (!this.initialParameters.cart && this.initialParameters.payPalReturnCode == 1) {
                        this.noToast = true
                        this.completePayPalPurchase()
                    }
                    else {

                        // console.log('cancelling paypal purchase')
                        // store.remove('paypalCartItems')

                        // api.sendEvent({
                        //     eventType: 'checkoutProcessCancel',
                        //     eventDesc: 'PayPal checkout cancelled',
                        // })
                    }
                }
            }
        },

        showToast(type, message) {
            if (!this.noToast) this.$q.notify({
                message: message,
                type: type,
                icon: type === 'positive' ? 'fa-check-circle' : 'fa-exclamation-circle',
                position: 'bottom-left'
            })
        },

        add2cart(product) {
            this.$store.commit('add2cart', product)

            if (!this.environmentJSON.e.hideNotifyAddCart) {
                this.$q.notify({
                    message: 'Added product to cart!',
                    type: 'positive',
                    icon: 'fa-check-circle',
                    position: 'bottom-left'
                })
            }
        },

        promoCodeBefore() {
            return this.promoCode ? [{
                id: 'promoCodeSuccess',
                color: 'green',
                icon: 'fa-check-circle',
                content: true,
                handler() {

                }
            }] : []
        },

        giftCardBefore() {
            return this.giftCard ? [{
                id: 'giftardSuccess',
                color: 'green',
                icon: 'fa-check-circle',
                content: true,
                handler() {

                }
            }] : []
        },

        logout() {
            cookies.resetCookie('userLoginToken')
            window.location.reload()
        },

        applyGiftCard() {

            // if (!this.authenticated) {
            //     k('wait for auth')
            //     return false
            // }

            if (!this.giftCardText) {
                k('how no text and running function?')
                return false
            }

            this.$q.loading.show()
            this.giftCard = ''

            let req = {
                giftCardCode: this.giftCardText
            }

            k('apply Gift Card req: ', req)

            this.api.post(this.api.apiv4Route + 'api/codes/giftCardBalance', req, (res) => {
                k('apply Gift Card res: ', res)
                this.$q.loading.hide()

                if (res.success && res.data) {
                    res.data.giftCardBalance = Number(res.data.giftCardBalance)
                    k('gift card balance: ', res.data.giftCardBalance)

                    if (res.data.giftCardBalance != 0) {
                        this.giftCard = res.data
                        this.setCartTotal()

                        this.showToast('positive', 'Gift card applied!')
                    } else {
                        this.showToast('negative', 'Sorry, this gift card has no balance.')
                    }
                } else {
                    if (res.messageCode) {
                        var message = res.messageCode
                        if (message === 'giftCardNotFound') message = 'Sorry, this gift card was not found.'
                        this.showToast('negative', message)

                    }
                    this.giftCard = ''
                    this.setCartTotal()
                }

                this.api.sendEvent({
                    eventType: 'giftCardEntered',
                    eventDesc: 'user entered gift card: ' + this.giftCardText,
                    result: res.errorCode ? res.errorCode : 'success'
                })
            })
        },

        applyPromoCode() {
            k('apply promo code', this.promoCodeText, this.cart)

            // if (!this.authenticated) {
            //     k('wait for auth')
            //     return false
            // }

            if (!this.cart.length) {
                k('no items to apply code to')
                return false
            }

            if (!this.promoCodeText) {
                k('how no promo code text?')
                return false
            }

            this.$q.loading.show()

            var req = {
                "promoCode": this.promoCodeText,
                "cart": this.cartRecipients,
                "affiliateID": this.environment.data.affiliateID,
                "userLoginToken": this.userLoginToken
            }
            k('promo req: ', j(req))

            k('cart recipients: ', this.cartRecipients)

            this.api.post(this.api.apiv4Route + 'api/codes/applyCoupon2Cart', req, (res) => {
                k('from sendPromoCode2API', res)
                this.$q.loading.hide()

                if (res.success && res.cart) {
                    this.showToast('positive', 'Promo code "' + this.promoCodeText + '" applied! Nice!')

                    this.promoCode = true
                    // this.$store.commit('saveCartToLocalStorage', false)
                    this.updateCartPrices(res.cart)
                }
                else {
                    k('promo error: ', res.messageCode)

                    var message = res.messageCode
                    if (res.messageCode === 'invalidRequest') message = 'Sorry, there is a problem with this coupon. Please contact support.'
                    if (res.messageCode === 'InvalidProductsForCode' || res.messageCode === 'codeDoesNotApplyToProducts' || res.messageCode === 'errorGettingProductData') message = 'Sorry, this code is not valid for these products.'
                    if (res.messageCode === 'couponCodeProblem') message = 'Sorry, there is a problem with this coupon. Please contact support.'
                    if (res.messageCode === 'couponCodeDoesNotApplyToAffiliate') message = 'Sorry, this code does not apply to this shop.'
                    if (res.messageCode === 'couponIsNotActive') message = 'Sorry, this coupon code is not active.'
                    if (res.messageCode === 'couponIsExpired') message = 'Sorry, this code is expired.'
                    if (res.messageCode === 'couponCodeAlreadyUsed') message = 'Sorry, this code has already been used.'
                    if (res.messageCode === 'promoCodeNotFound') message = 'Sorry, this code does not exist.'
                    if (res.messageCode === 'cartItemMinNotReached') message = 'Sorry, there are not enough items in the cart for this code.'

                    this.$q.notify({
                        message: message,
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })

                    this.resetPromoCode()
                }

                this.api.sendEvent({
                    eventType: 'promoCodeEntered',
                    eventDesc: 'user tried promo code: ' + this.promoCodeText,
                    result: res.errorCode ? res.errorCode : 'success'
                })
            })
        },

        resetPromoCode() {
            k('reset promo code')
            if (this.initialParameters && this.initialParameters.coupon) {
                this.$store.commit('deleteKeyPathInStore', 'initialParameters.coupon')
            }

            k('remove discounted prices')
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].discountedPrice || this.cart[i].discountedPrice === 0) {
                    this.cart[i].discountedPrice = false
                    this.cart[i].itemIsDiscounted = false
                }
            }

            this.promoCode = false
            this.promoCodeText = ''

            this.$store.commit('saveCart', this.cart)
            this.setCartTotal()
            this.setOriginalCartTotal()
        },

        resetGiftCard() {
            k('reset gift code')
            if (this.initialParameters && this.initialParameters.giftCard) {
                this.$store.commit('deleteKeyPathInStore', 'initialParameters.giftCard')
            }

            this.giftCard = ''
            this.giftCardText = ''
            this.setCartTotal()
            this.setOriginalCartTotal()
        },

        setSubscriptionInCartIfNeeded() {
            var cart = JSON.parse(JSON.stringify(this.cart))

            var subInCart = false
            for (var i = 0; i < cart.length; i++) {
                var cartItem = cart[i]

                // only need payment for subscriptions purchasing for yourself
                if (cartItem.interval && !cartItem.recipientName) {
                    subInCart = true
                }
            }

            k('setSubscriptionInCartIfNeeded: ', subInCart)
            this.subscriptionProductInCart = subInCart
        },

        updateCartPrices(resCart) {
            k('updateCartPrices', resCart)

            var cart = JSON.parse(JSON.stringify(this.cart))

            for (var i = 0; i < cart.length; i++) {
                var cartItem = cart[i]
                var recipient = cartItem.recipientName || 'myself'
                var resCartItem = resCart[recipient][cartItem.productID]
                kw('cart price to update: ', resCartItem.productPrice, resCartItem.originalPrice)

                cartItem.discountedPrice = resCartItem.productPrice && resCartItem.originalPrice && resCartItem.productPrice !== resCartItem.originalPrice ? resCartItem.productPrice : ''
                cartItem.itemIsDiscounted = resCartItem.productPrice !== resCartItem.originalPrice
                cartItem.freeSubscriptionInterval = resCartItem.freeSubscriptionInterval ? resCartItem.freeSubscriptionInterval : null
            }

            kw('update cart: ', cart)
            this.$store.commit('saveCart', cart)
        },

        checkSavedPaymentTokenID(cb) {
            // api/shop/savedPaymentTokenID
            // {
            //   userLoginToken
            //   shopID
            // }

            var req = {
                userLoginToken: this.userLoginToken,
                shopID: this.environment.data.shopID
            }
            k('checkSavedPaymentTokenID req: ', req)

            this.api.post(this.api.apiv4Route + 'api/shop/savedPaymentTokenID', req, (res) => {
                k('checkSavedPaymentTokenID res: ', res)

                cb(res)
            })
        },

        checkSavedCard() {
            if (this.disableCheckSavedCard) {
                k('disableCheckSavedCard')
                return false
            }

            if (this.authenticated) {
                this.checkSavedPaymentTokenID((res) => {
                    if (res.tokenID) {
                        this.lastFour = res.tokenID
                        this.cardIsSaved = true
                    }
                })
            }
        },

        updateUserInfoIfNecessary() {
            k('updateUserInfoIfNecessary: ', this.componentData, this.userInfo)

            if (this.componentData &&
                ((this.componentData.firstName && (this.componentData.firstName !== this.userInfo.firstName)) ||
                    (this.componentData.lastName && (this.componentData.lastName !== this.userInfo.lastName)))
            ) {
                var req = {
                    userLoginToken: this.userLoginToken,
                    firstName: this.componentData.firstName,
                    lastName: this.componentData.lastName
                }
                this.updateUserInfo(req, (res) => {
                    if (res.success) {
                        this.showToast('positive', 'User info saved!')
                    }
                    else {
                        this.showToast('negative', 'User info was not saved, please try again.')
                    }

                    if (this.componentData.firstName && (this.componentData.firstName !== this.userInfo.firstName)) this.userInfo.firstName = this.componentData.firstName
                    if (this.componentData.lastName && (this.componentData.lastName !== this.userInfo.lastName)) this.userInfo.lastName = this.componentData.lastName
                })
            }
        },

        initPurchase() {
            this.updateUserInfoIfNecessary()
            if (this.validatePaymentInfo()) this.completePurchase()
        },

        reformatExpiry() {
            this.cardDetail.expiry = this.j_.formatMonthYear(this.cardDetail.expiry) // TODO: check for date in the past
        },

        validatePaymentInfo() {
            k('validatePaymentInfo: ', this.cardIsSaved, this.cardDetail.number, this.cardDetail.expiry, this.cardDetail.cvc)

            var paymentInfoValid = false

            this.cardDetail.number = String(this.cardDetail.number)
            var expiration = JSON.parse(JSON.stringify(this.cardDetail.expiry)).replace('/', '/01/')
            var nextMonthUnix = this.moment(expiration, 'MM/DD/YY').add(1, 'month').valueOf()
            k('expiration: ', expiration)
            k('nextMonthUnix: ', nextMonthUnix)

            var isExpired = isNaN(nextMonthUnix) ? true : nextMonthUnix < this.moment().valueOf()
            var cardNumberIsValid = this.j_.luhnCheck(this.cardDetail.number.replace(/[^a-z0-9]/gi, ''))
            k('expired? ', isExpired)
            k('card number valid? ', cardNumberIsValid)

            if (this.cardIsSaved || (this.cardDetail.number && this.cardDetail.expiry && this.cardDetail.cvc && !isExpired && cardNumberIsValid)) {
                paymentInfoValid = true
            } else {
                // if (!this.cardDetail.name) this.cardDetailError.name = true
                if (!this.cardDetail.number || !cardNumberIsValid) this.cardDetailError.number = true
                if (!this.cardDetail.expiry || isExpired) {
                    this.cardDetailError.expiry = true
                    this.creditCardExpired = true
                }
                if (!this.cardDetail.cvc) this.cardDetailError.cvc = true

                this.showToast('negative', 'Oops! There was a problem with your card info. Please check what you entered and try again.')
            }

            return paymentInfoValid
        },

        returnAllHookParamsForPurchaseReq() {
            var parameters = this.j_.cloneObject(this.initialParameters)
            var hookObj = {}

            Object.keys(parameters).filter((parameterKey) => {
                return parameterKey.includes('hook_')
            }).forEach((hookKey) => {
                hookObj[hookKey] = parameters[hookKey]
            })

            return hookObj
        },

        removeSavedCard() {
            // https://api-v4-dev2.platformpurple.com/api/shop/removePaymentToken

            this.cardIsSaved = false

            var req = {
                userLoginToken: this.userLoginToken,
                shopID: this.environment.data.shopID
            }
            k('removeSavedCard req: ', req)

            this.api.post(this.api.apiv4Route + 'api/shop/removePaymentToken', req, (res) => {
                k('removeSavedCard res: ', res)
            })
        },

        initPurchaseAPIrequestObj() {
            k('init purchase API request')

            var req = {
                "data": {
                    "recipients": this.cartRecipients,
                    "shopID": this.environment.data.shopID,
                    "affiliateID": this.environment.data.affiliateID,
                    "environmentName": this.environment.name,
                    "userLoginToken": this.userLoginToken,
                    "currencyCode": "USD",
                    "giftBoxes": this.giftBoxes,
                    "displayDate": this.moment().format('MM-DD-YYYY HH:mm a')
                },
                "options": {
                    "linkUser": true
                },
                "apiKey": "purchase"
            }

            if (this.promoCodeText) req.data.couponCode = this.promoCodeText
            if (this.giftCardText) req.data.giftCards = [this.giftCardText]

            k('referralToken? ', cookies.getCookie('referralToken'))
            if (cookies.getCookie('referralToken')) {
                req.referralToken = cookies.getCookie('referralToken')
            }

            k('sourceAffID? ', cookies.getCookie('sourceAffID'))
            if (cookies.getCookie('sourceAffID')) {
                req.sourceAffID = cookies.getCookie('sourceAffID')
            }

            if (this.initialParameters) {
                var hookParamObj = this.returnAllHookParamsForPurchaseReq()
                k('hookParamObj: ', hookParamObj)

                if (Object.keys(hookParamObj).length) req.hooks = hookParamObj
            }

            // Add pwywBids key if the purchase contains pwyw products
            let pwywBids = this.pwywBidsForCart()
            if (pwywBids.length > 0) req.pwywBids = pwywBids

            k('initPurchaseAPIrequestObj: ', j(req))

            return req
        },

        completePurchase() {
            this.$q.loading.show()

            var req = this.initPurchaseAPIrequestObj()
            req.action = 'purchase'

            k('should we continue completing purchase? ', this.cartTotal, this.subscriptionProductInCart, this.cartTotal > 0 || this.subscriptionProductInCart)

            if (this.cartTotal > 0 || this.subscriptionProductInCart) {
                k('add cc info', this.cardDetail)

                if (this.cardIsSaved) {
                    req.data.useSavedCard = this.cardIsSaved
                } else {
                    req.data.creditCard = this.cardDetail.number
                    req.data.expirationMonth = this.expiryMonth
                    req.data.expirationYear = this.expiryYear
                    req.data.securityCode = this.cardDetail.cvc

                    if (this.saveCard) req.data.saveCreditCard = this.saveCard
                }
            }
            k('completePurchase req: ', req)

            // sendInfoToAPI
            this.sendPurchaseRequest2API(req, (res) => {
                k('purchase result: ', res)
                this.$q.loading.hide()

                if (res.success) {
                    var paypal = false
                    this.successfulCheckout(res, paypal)
                }
                else {
                    let errorMessage = 'Sorry, there was an issue with your purchase and it could not be completed. Please try again or contact support.'

                    if (res.messageCode === 'errorProcessingPayment') {
                        this.creditCardAPIError = true
                    }
                    if (res.messageCode === 'errorProcessingPaymentWSavedToken' || res.messageCode === 'errorGettingSavedPaymentToken') {
                        this.removeSavedCard()
                        errorMessage = 'Sorry, there was an error with your saved payment info, please re-enter it.'
                    }

                    this.showToast('negative', errorMessage)

                    this.api.sendEvent({
                        eventType: 'purchaseFailed',
                        eventDesc: 'purchase failed',
                        errorMsg: res.messageCode
                    })
                }
            })
        },

        generatePaypalReturnRoute() {
            var params = '?'

            if (this.initialParameters) {
                if (this.initialParameters.e) params += ('e=' + this.initialParameters.e)

                var hookParamObj = this.returnAllHookParamsForPurchaseReq()
                k('hookParamObj: ', hookParamObj)

                if (Object.keys(hookParamObj).length) {
                    Object.keys(hookParamObj).forEach((hookKey) => {
                        if (params !== '?') params += '&'
                        params += hookKey + '=' + hookParamObj[hookKey]
                    })
                }

                if (this.initialParameters.cart) {
                    if (params !== '?') params += '&'
                    params += 'cart=' + this.initialParameters.cart
                }
            }

            if (this.promoCodeText) {
                if (params !== '?') params += '&'
                params += 'coupon=' + this.promoCodeText
            }

            if (this.giftCardText) {
                if (params !== '?') params += '&'
                params += 'giftCard=' + this.giftCardText
            }

            if (params !== '?') params += '&'

            k('generatePaypalReturnRoute: ', window.location.origin, window.location.pathname, params)

            return window.location.origin + window.location.pathname + params
        },

        initPayPalPurchase() {
            this.updateUserInfoIfNecessary()

            this.$q.loading.show()

            var req = {
                userLoginToken: this.userLoginToken,
                cart: this.cart,
                shopID: this.environment.data.shopID
            }

            if (this.promoCodeText) req.couponCode = this.promoCodeText
            if (this.giftCardText) req.giftCard = this.giftCardText

            // Add pwywBids key if the purchase contains pwyw products
            let pwywBids = this.pwywBidsForCart()
            if (pwywBids.length > 0) req.pwywBids = pwywBids

            var returnRoute = this.generatePaypalReturnRoute()
            k('returnRoute for paypal: ', returnRoute)

            req.cancelURL = returnRoute + 'payPalReturnCode=0'
            req.returnURL = returnRoute + 'payPalReturnCode=1'

            this.sendExpressCheckoutRequest2API(req, (res) => {

                if (!res.success) {
                    this.$q.loading.hide()

                    this.showToast('negative', 'Paypal transaction was not successful. Please contact support.')

                    this.api.sendEvent({
                        eventType: 'purchaseFailed',
                        eventDesc: 'purchase failed',
                        errorMsg: res.message,
                        errorCode: res.errorCode || '',
                    })
                }
                else {
                    // go to paypal
                    k('GOING TO PAYAL: ', this.sessionLogObj)
                    this.localStorage.set('activePaypalCheckoutSessionInfoEventObj', this.sessionLogObj) // this is for logging

                    window.location.href = "https://www.paypal.com/webscr?cmd=_express-checkout&token=" + res.token
                    
                    // TODO: for dev, only use when testing payments
                    // window.location.href = "https://www.sandbox.paypal.com/webscr?cmd=_express-checkout&token=" + res.token
                }
            })

        },

        completePayPalPurchase() {
            k('completePayPalPurchase')

            this.paypalLoad = true

            var req = this.initPurchaseAPIrequestObj()
                req.action = 'purchase'
                req.data.payPalToken = this.initialParameters.token
                req.data.payerID = this.initialParameters.PayerID

            k('paypal send to API')
            k(j(req))

            this.sendPurchaseRequest2API(req, (res) => {
                this.noToast = false

                if (res.success) {
                    this.localStorage.remove('purple_paypal-req')

                    var paypal = true
                    this.successfulCheckout(res, paypal)
                }
                else {
                    let errorMessage = 'Sorry, there was an issue with your purchase and it could not be completed. Please try again or contact support.'
                    this.showToast('negative', errorMessage)

                    this.api.sendEvent({
                        eventType: 'purchaseFailed',
                        eventDesc: 'purchase failed',
                        errorMsg: res.messageCode
                    })
                }

            })
        },

        sendPurchaseRequest2API(req, cb) {
            k('sendPurchaseRequest2API: ', req)

            this.api.post(this.api.apiv4Route + 'api/shop/doPurchase', req, (res) => {
                k('response from purchase API: ', res)
                cb(res)
            })
        },

        sendExpressCheckoutRequest2API(req, cb) {
            k('sendExpressCheckoutRequest2API: ', req)

            this.api.post(this.api.apiv4Route + 'api/shop/initExpressCheckout', req, (res) => {
                k('response from express checkout API: ', res)
                cb(res)
            })
        },

        successfulCheckout(res, paypal) {
            k('successful checkout')

            var newCartItems = JSON.parse(JSON.stringify(this.cart))
            k('cart items', newCartItems)

            this.sendPurchaseSuccessEvent(res, newCartItems, paypal)
            this.$store.commit('purchaseTotal', this.cartTotal)
            this.saveReceipt(res)

            this.setReceiptInfo(res, newCartItems, paypal)

            k('before GA transaction')
            this.trackGATransaction(newCartItems, this.cartTotal)

            k('reset checkout')

            if (cookies.getCookie('referralToken')) {
                cookies.resetCookie('referralToken')
            }

            k('clear out items in local storage')
            this.localStorage.remove(this.environment.name, [])
            this.$store.commit('giftBoxes', {})
            this.$store.commit('saveCart', [])
            this.removeURLParams()

            this.refreshUserProductInfo()

            k('finish up')
            if (paypal) this.paypalLoad = false
            this.$root.$emit('purchaseSuccess', true)

            if (!this.stopThankYouPageRedirect) this.route('/shop/thankyou')
        },

        sendPurchaseSuccessEvent(res, newCartItems, paypal) {
            var eventInfo = {
                eventType: 'purchaseSuccess',
                eventDesc: 'user successfully purchased ' + newCartItems.length + ' product(s)',
                userID: this.userInfo.userID,
                cartTotal: this.cartTotal,
                cartItemsTotal: newCartItems.length,
                type: paypal ? 'paypal' : 'creditCard',
                os: this.$root.$store.state.userAgentInfo.os.name,
            }

            if (this.initialParameters.utm_source) eventInfo.utm_source = this.initialParameters.utm_source
            if (this.firstVisitToEnvironment) eventInfo.firstVisitToEnvironment = this.firstVisitToEnvironment
            if (this.promoCode) eventInfo.codeUsed = this.promoCodeText

            this.api.sendEvent(eventInfo)
        },

        activateCode(cb) {
            kw('activateCode!')

            if (!this.activationCode) {
                this.$q.notify({
                    message: 'Please enter an activation code.',
                    type: 'negative',
                    icon: 'fa-exclamation-circle',
                    position: 'bottom-left'
                })
                return false
            }

            this.$q.loading.show()

            var req = {
                'activationCode': this.activationCode,
                'userLoginToken': this.userLoginToken,
                'environmentName': this.environment.name
            }

            if (this.initialParameters) {
                var hookParamObj = this.returnAllHookParamsForPurchaseReq()
                k('hookParamObj: ', hookParamObj)

                if (Object.keys(hookParamObj).length) req.hooks = hookParamObj
            }

            k('activateCode req: ', req)

            this.api.post(this.api.apiv4Route + 'api/shop/useActivationCode', req, (res) => {
                k('activateCode res: ', res)

                this.$q.loading.hide()

                if (!res.success) {

                    var replies = {
                        codeHasBeenUsed: "Sorry, this code has already been used.",
                        codeNotFound: "Sorry, we couldn't find this code.",
                        activationFail: "Sorry, we had trouble activating this code. Please contact support.",
                        errorActivating: "Sorry, we had trouble activating this code. Please contact support."
                    }

                    this.api.sendEvent({
                        eventType: 'activationFailed',
                        eventDesc: 'activation failed',
                        errorMsg: replies[res.messageCode] ? replies[res.messageCode] : res.messageCode,
                        errorCode: res.messageCode,
                    })

                    this.$q.notify({
                        message: replies[res.messageCode] ? replies[res.messageCode] : res.messageCode,
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })

                    cb(false)

                }
                else {

                    var eventInfo = {
                        eventType: 'activationSuccess',
                        eventDesc: 'user successfully activated a product with ' + this.activationCode,
                        codeUsed: this.activationCode,
                        userID: this.userInfo.userID
                    }

                    this.api.sendEvent(eventInfo)

                    this.$q.notify({
                        message: 'Your activation was successful!',
                        type: 'positive',
                        icon: 'fa-check-circle',
                        position: 'bottom-left'
                    })

                    this.refreshUserProductInfo()

                    cb(res)
                }

                this.$store.commit('activationCode', '')
            })
        },

        refreshUserProductInfo() {
            this.getProductsAndTags4Environment()
            this.getUserSubscriptionProductStatusHistory()
        },

        saveReceipt(res) {
            kw('saveReceipt for thank you page: ', res)
            this.$store.commit('receiptHTML', res.receiptHTML)
        },

        setReceiptInfo(res, newCartItems, paypal) {
            // save info for receipt
            k('saving info for receipt', res)

            var receiptInfo = {
                // 'cartTotal': res.amount,
                'cartTotal': this.cartTotal,
                'legacyReceipt': res.receiptTemplate,
                'products': newCartItems,
                'originalCartTotal': this.originalCartTotal,
                'paymentType': paypal ? 'PayPal' : this.cartTotal > 0 ? 'Credit Card' : 'Free Checkout',
                'date': this.moment().format('MM/DD/YY')
            }

            if (res.siteLicenseInfo && res.siteLicenseInfo.length > 0) {
                receiptInfo.siteLicenseInfo = res.siteLicenseInfo
                receiptInfo.activateURL = window.location.hostname +
                    '/activate?' +
                    (this.initialParameters.e ? 'e=' + this.initialParameters.e + '&' : '') +
                    'activationCode=' +
                    res.siteLicenseInfo[0].activationCode
            }

            if (res.wrappedGiftTokens) {
                receiptInfo.wrappedGiftTokens = res.wrappedGiftTokens
            }

            if (this.giftCard) {
                receiptInfo.giftCardAmtApplied = this.giftCard.giftCardAmtApplied
                receiptInfo.giftCardBalance = this.giftCard.giftCardBalance - this.giftCard.giftCardAmtApplied
            }

            if (this.promoCode) {
                receiptInfo.promoCode = this.promoCodeText
            }

            k('receiptInfo 2 save:', receiptInfo)
            this.$store.commit('receiptInfo', receiptInfo)
        },

        addCartParamItems2Cart() {
            k('addCartParamItems2Cart!')

            var invalidProduct = false
            var productNotInShop = false
            var alreadyOwned = false
            var alreadyInCart = false
            var cartIDs = this.initialParameters.cart.indexOf(',') > -1 ? this.initialParameters.cart.split(',') : [this.initialParameters.cart]

            cartIDs.forEach((productID) => { // if not owned (and not already in cart, add to cart
                var productInfo = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', Number(productID))
                k('addCartParamItem to cart: ', productInfo)

                if (!productInfo) {
                    k('invalid product, do not add')
                    invalidProduct = true
                }
                else if (!this.checkProductInCartForOwnership(productInfo) && !this.inCart(productInfo) && this.productIsInShop(productInfo.productID)) {
                    k('add to cart', productInfo)
                    this.add2cart(productInfo)
                }
                else {
                    if (this.checkProductInCartForOwnership(productInfo)) alreadyOwned = true
                    if (this.inCart(productInfo)) alreadyInCart = true
                    if (!this.productIsInShop(productInfo.productID)) productNotInShop = true
                }
            })

            if (!invalidProduct && !alreadyOwned && !alreadyInCart) this.showToast('info', 'This is your digital cart. You can go back, or continue shopping for digital products here.')

            if (alreadyOwned) {
                this.$q.notify({
                    message: 'We removed one or more products you already own from your cart.',
                    type: 'negative',
                    timeout: 0,
                    icon: 'fa-exclamation-circle',
                    position: 'bottom-right',
                    actions: [{
                        label: 'Dismiss',
                        handler: () => {
                            k('dismissed')
                        }
                    }]
                })
            }

            if (productNotInShop) this.showToast('negative', 'This product is not available for purchase.')

            if (alreadyInCart) this.showToast('info', 'This product is already in your cart! You can go back, or continue shopping for digital products here.')

            if (invalidProduct) this.showToast('negative', 'Sorry this is not a valid product. You can go back, or continue shopping for digital products here.')

            if (this.initialParameters.coupon) {
                this.promoCodeText = this.initialParameters.coupon

                k('applyPromoCode addCartParamItems2Cart')
                this.applyPromoCode()
            }

            if (this.initialParameters.giftCard) {
                this.giftCardText = this.initialParameters.giftCard
                this.applyGiftCard()
            }

            this.$store.commit('deleteKeyPathInStore', 'initialParameters.cart')
            this.$q.loading.hide()
        },

        trackGATransaction(cartItems, cartTotal) {
            var transID = 'UID' + this.userInfo.userID + 'MS' + Date.now()
            this.$ga.ecommerce.addTransaction({
                'id': transID, // Transaction ID. Required.
                'affiliation': this.environment.data.affiliateID, // Affiliation or store name.
                'revenue': cartTotal // Grand Total.
            })
            Object.keys(cartItems).forEach((item) => {
                item = cartItems[item]
                this.$ga.ecommerce.addItem({
                    id: transID, // Transaction ID. Required.
                    name: item.productName, // Product name. Required.
                    sku: item.productSKU, // SKU/code.
                    category: this.environment.data.shopID, // Category or variation.
                    price: (item.discountedPrice || item.discountedPrice === 0) ? item.discountedPrice : item.productPrice, // Unit price.
                    quantity: '1' // Quantity.
                })
            })
            this.$ga.ecommerce.send()
        },

        checkCartForOwnedProducts() {
            kw('check cart for owned products: ', this.cart)

            this.$q.loading.show()

            var ownedItemFound = false
            var newCart = []
            this.cart.forEach((item) => {
                k('check item: ', item)
                if (this.checkProductInCartForOwnership(item)) {
                    ownedItemFound = true
                }
                else {
                    newCart.push(item)
                }
            })

            this.$store.commit('saveCart', newCart)
            k('ownedItemFound: ', ownedItemFound)

            if (ownedItemFound) {
                this.$q.notify({
                    message: 'Looks like you already own a product in your cart! We have removed it for you.',
                    type: 'negative',
                    timeout: 0,
                    icon: 'fa-exclamation-circle',
                    position: 'bottom-right',
                    actions: [{
                        label: 'Dismiss',
                        handler: () => {
                            k('dismissed')
                        }
                    }]
                })
                if (this.promoCodeText) {
                    k('applyPromoCode checkCartForOwnedProducts')
                    this.applyPromoCode()
                }
                if (this.giftCardText) this.applyGiftCard()
            }

            this.$q.loading.hide()
        },

        removeURLParams() {
            k('removeURLParams! ', j(this.initialParameters))

            if (this.initialParameters.giftCard) this.$store.commit('deleteKeyPathInStore', 'initialParameters.giftCard')
            if (this.initialParameters.cart) this.$store.commit('deleteKeyPathInStore', 'initialParameters.cart')
            if (this.initialParameters.coupon) this.$store.commit('deleteKeyPathInStore', 'initialParameters.coupon')
            if (this.initialParameters.payPalReturnCode) this.$store.commit('deleteKeyPathInStore', 'initialParameters.payPalReturnCode')
            if (this.initialParameters.token) this.$store.commit('deleteKeyPathInStore', 'initialParameters.token')
            if (this.initialParameters.PayerID) this.$store.commit('deleteKeyPathInStore', 'initialParameters.PayerID')

            var hookParamObj = this.returnAllHookParamsForPurchaseReq()
            if (hookParamObj) {
                Object.keys(hookParamObj).forEach((hookKey) => {
                    this.$store.commit('deleteKeyPathInStore', 'initialParameters.' + hookKey)
                })
            }
        },

        pwywBidsForCart() {
            let pwywBids = []

            k('pwywBidsForCart: ', this.cartRecipients)

            this.cart.forEach(cartItem => {
                if (cartItem.pwywBid) {
                    pwywBids.push(cartItem.pwywBid)
                }
            })

            kw('pwywBids before returning from pwywBidsForCart', pwywBids)

            return pwywBids
        }
    }
}