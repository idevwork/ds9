import { globalComputedData } from '../../../mixins/globalComputedData'
import { authentication } from '../../../mixins/authentication'

export const pvolveSignUpTools = {
    data() {
        return {
            subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
            
            showGeoBlock: false,
            
            userEmailInput: '',
            fieldError: {
                userEmail: false
            },
            
            userIPInfo: ''
        }
    },
    
    mixins: [ globalComputedData, authentication ],
    
    computed: {
        
    },
    
    methods: {
        
        redirectUserThatHasAccess() {
            if (this.signUpModalOpen) this.signUpModalOpen = false
            this.route('/library')
            
            this.$q.notify({
                message: 'You are already subscribed! Redirecting you to your library.',
                type: 'positive',
                icon: 'fas fa-check-circle',
                position: 'bottom-left'
            })
        },
        
        redirectUserThatPreviouslyHadAccess() {
            if (this.signUpModalOpen) this.signUpModalOpen = false
            this.goToSignUpNow()
            
            this.$q.notify({
                message: 'Your trial has ended. Redirecting you to sign up for the subscription.',
                type: 'positive',
                icon: 'fas fa-check-circle',
                position: 'bottom-left'
            })
        },
        
        goToSignUpNow() {
            this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.signUpNow', value: true })
            this.route('/offer/special?signUpNow=true')
        },
                
        addUserToEmailList(userEmail, listName, mergeFields, cb) {
            // https://api-v4-dev2.platformpurple.com/api/client/mypvolve/subscribeUser2MailingList

            var req = {
                userEmail: userEmail,
                listName: listName
            }
            
            if (mergeFields) req.mergeFields = mergeFields
            
            k('addUserToEmailList req: ', req)
            
            this.api.post(this.api.apiv4Route + this.subscribeRoute, req, (res) => {
                k('addUserToEmailList res: ', res)
                
                cb(res.success)
            })
        },
        
        checkGeoBlocking(cb) {
            cb(false)
            
            // this.api.get(this.api.ioRoute + 'events/userIPInfo', (res) => {
            //     k('checkGeoBlocking res: ', res)
                
                // if (res) {
                    // this.userIPInfo = res
                    
                    // TODO: for testing 
                    // if (res.country_code && res.country_code === 'US') {
                        
                    // if (res.country_code && res.country_code === 'AU' || res.country_code === 'NZ') {
                    //    cb(true)
                    // } else {
                        // cb(false)
                    // }
                // } else {
                    // cb(false)
                // }
            // })
        },
        
        geoBlockedUserToEmailList() {
            if (this.userEmailInput) {
                this.addUserToEmailList(this.userEmailInput, '6ba594722b', { MMERGE6: this.userIPInfo.country_code }, (success) => {
                    // alert user
                    this.$q.notify({
                        message: success ? 'You have been added to our email list!' : 'There was an issue, please try again.',
                        type: success ? 'positive' : 'negative',
                        icon: success ? 'fas fa-check-circle' : 'fas fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                })
            } else {
                this.fieldError.userEmail = true
            }
        },
        
        initPurchaseSuccessHandler() {
            k('initPurchaseSuccessHandler')
            
            this.$root.$off('purchaseSuccess')
            
            this.$root.$on('purchaseSuccess', (res) => {
                this.$root.$off('purchaseSuccess')

                this.trackImpactSale()
                
                pintrk('track', 'signup', {
                    lead_type: '15 day free trial'
                })
                
                let subscriptionProduct = this.$store.state.receiptInfo.products.find(product => product.interval)
                
                k('initPurchaseSuccessHandler cart is not empty: ', subscriptionProduct, this.$store.state.receiptInfo.products, this.$store.state.receiptInfo)
                
                if (subscriptionProduct.interval) {
                    fbq('track', 'Subscribe', {
                        currency: "USD",
                        value: this.$store.state.purchaseTotal,
                        subscription_id: subscriptionProduct.productID
                    })
                }
                
                // inject Loop.me pixel
                this.injection.injectImgIntoDOM({
                    "headOrBody": "head",
                    "type": "img",
                    "id": "loopMePixel",
                    "src": "https://tk0x1.com/sj/tr?id=__ADID__&et=CONVERSION&pt=sp&f=0&event_name=pvolve_signups&campaign_id=2000673",
                    "style": "display: none; height: 0; width: 0;"
                })
                
                this.injection.injectScriptIntoDOM({
                    "id": "clickMeterVars",
                    "headOrBody": "head",
                    "code": `var ClickMeter_conversion_id= '6CCB1A2841104DD39561EF52E1380B05'; var ClickMeter_conversion_value = '${ this.$store.state.purchaseTotal }';`
                })
                
                this.injection.injectScriptIntoDOM({
                    "id": "cmconvscript",
                    "headOrBody": "head",
                    "src": "http://www.clickmeter.com/js/conversion.js"
                })
            })
        }
    }
}