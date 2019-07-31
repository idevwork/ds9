<template>
  <div class="row well">
    
    <q-inner-loading :visible="true" />
    
  </div>
</template>

<script>
    
    import { userAndProductInfo } from '../mixins/userAndProductInfo'

    export default {
        // props: ['newOrganizationName'],
        
        mixins: [userAndProductInfo],
        
        data() {
            return {
                // agreeToTerms: false,
                // agreeToTermsError: false,
                // newOrganizationNameError: false,
                // newOrganizationName: ''
                inCart(product) {
                    var inCart = false
                    this.cart.forEach((item) => {
                        if (item.productID == product.productID && !item.recipientName) {
                            inCart = true
                        }
                    })
                    if (product.recipientName) inCart = false
                    return inCart
                }
            }
        },

        components: {
            // SigninForm
        },

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

            userInfo() {
                return this.$store.state.user.info
            },

            initialParameters() {
                return this.$store.state.initialParameters
            },

            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },

            inputStyle() {
                return 'background: ' + (this.brandColor || '#444') + ' !important; margin: 8px; color: white;'
            },

            cart() {
                return this.$store.state.cart
            },
      
            newOrganizationName() {
                return this.$store.state.newOrganizationName
            },
            
            subdomain() {
                return this.api.whichServer() ? '-dev' : ''
            },
            
            dashboardLink() {
                // return 'https://my' + this.subdomain + '.platformpurple.com?userLoginToken=' + this.userLoginToken
                return 'https://go' + this.subdomain + '.platformpurple.com/console?userLoginToken=' + this.userLoginToken
            }

        },

        methods: {

            newContentOwner() {
                k('newOrganizationName: ', this.newOrganizationName)
                k('userInfo: ', this.userInfo)

                // logEvent: user agreed to terms
                this.api.sendEvent({
                    eventType: 'userAgreedToPublisherTerms',
                    eventDesc: 'user checked agree when signing up to be a publisher',
                    userID: this.userInfo.userID,
                    userEmail: this.userInfo.userEmail
                })

                var alreadyContentOwner = (this.userInfo && this.userInfo.userOrgs && this.userInfo.userOrgs.length > 0 && this.userInfo.userOrgs[0].publishers) ? true : false
                k('user has orgs? ', alreadyContentOwner)

                switch (true) {
                    case (alreadyContentOwner):
                        this.alreadyContentOwner()
                        break;

                    case (this.initialParameters.activatePublisher === 'true'):
                        this.verifyPublisherPurchase((res) => {
                            if (res.success) {
                                this.activatePublisher()
                            } else {
                                this.goBackToSiteWithError('errorVerifyingPublisherPurchase')
                            }
                        })
                        break;

                    default:
                        k('take user to checkout')
                        
                        this.localStorage.set('activateNewOrgName', this.newOrganizationName)

                        this.api.get(this.api.apiv3Route + 'product/' + 3986, (res) => {
                            if (res.success) {
                                if (!this.inCart(res.body[0])) {
                                    this.$store.commit('add2cart', res.body[0])
                                }
                                this.route('/shop/checkout')
                            }
                            else {
                                this.goBackToSiteWithError('errorActivatingPublisherAcct')
                            }
                        })
                }
            },
            
            goBackToSiteWithError(msg) {
                this.$q.notify({
                    message: msg,
                    type: 'negative',
                    icon: 'fa-exclamation-circle',
                    position: 'bottom-left'
                })
                this.route('/signUp')
            },
            
            alreadyContentOwner() {
                
                this.$q.dialog({
                    title: 'Already connected!',
                    message: 'Looks like you are already connected to a organization and can go to your console dashboard immediately:',
                    ok: 'Take me there!',
                    cancel: 'Cancel'
                }).then(() => {
                    window.location.href = this.dashboardLink
                }).catch(() => {
                    this.route('/')
                })
            },

            verifyPublisherPurchase(cb) {
                k('verify publisher purchase')
                
                this.api.get(this.api.apiv3Route + 'client/verifyPublisherPurchase/' + this.userLoginToken, (res) => {
                    k('verifyPublisherPurchase: ', res)

                    cb(res)
                })
            },
            
            showRedirectToDashboard(userHasNonPublisherOrg) {
                var message = userHasNonPublisherOrg ? 'Looks like you are already a part of Purple. Your organization has now been set up for publishing. We will now redirect you.' : 'Welcome to Purple! Your new organization has been successfully created. We will now redirect you.'
                k('create dialog: ', this.dashboardLink, message)
                
                this.$q.dialog({
                    title: 'You are now connected to your new publisher!',
                    message: message,
                    ok: 'Take me there!',
                    cancel: 'Cancel'
                }).then(() => {
                    window.location.href = this.dashboardLink
                }).catch(() => {
                    this.route('/')
                })
            },

            activatePublisher() {
                var self = this
                var userHasNonPublisherOrg = (this.userInfo.userOrgs && this.userInfo.userOrgs[0] && this.userInfo.userOrgs[0].organizationID)

                this.sendSignUp2API(userHasNonPublisherOrg, (res) => {
                    if (res.success) {
                        this.localStorage.remove('activateNewOrgName')
                        this.$store.commit('newOrganizationName', '')
                        k('REMOVE newOrganizationName: ', this.localStorage.get('activateNewOrgName'), this.newOrganizationName)
                        
                        this.getUserInfo((userInfo) => {
                            // get updated user info obj that includes updated userOrgs
                            k('request updated user info', userInfo)
                            
                            if (userInfo) {
                                this.$store.commit('userInfo', userInfo)
                                
                                this.showRedirectToDashboard(userHasNonPublisherOrg)
                            }
                        })
                    }
                    else {
                        this.route('/signUp')
                        this.$q.notify({
                            message: 'There was an error creating your publisher account. Please contact support.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            sendSignUp2API(newPublisherOnly, cb) {
                k('signUpAsContentOwner:', this.newOrganizationName, newPublisherOnly)
                
                var route = ''
                var req = {}
                
                if (newPublisherOnly) {
                    // user already has org but not a publisher account
                    route = 'client/newPublisher'

                    req.organizationID = this.userInfo.userOrgs[0].organizationID,
                    req.organizationName = this.userInfo.userOrgs[0].organizationName
                } else {
                    route = 'client/new'
                    
                    req.userID = this.userInfo.userID,
                    req.userEmail = this.userInfo.userEmail,
                    req.organizationName = this.newOrganizationName
                }

                if (this.environmentData.affiliateID != 1021) {
                    req.referringAffiliateID = this.environmentData.affiliateID
                    req.referringEnvironment = this.environmentName
                    
                    // TODO: empty shop for new pub accounts
                    // req.shopID2clone = this.environmentData.shopID
                }

                k('sendSignUp2API: ', route, req)

                this.api.post(this.api.apiv3Route + route, req, (res) => {
                    k('res: ', res)
                    cb(res)
                })
            }
        },

        watch: {
            userInfo() {
                if (this.userInfo && this.newOrganizationName) {
                    this.newContentOwner()
                } else {
                    if (this.initialParameters && this.initialParameters.activatePublisher) {
                        delete this.initialParameters.activatePublisher
                        this.$store.commit('initialParameters', this.initialParameters)
                    }
                    this.route('/')
                }
            }
        },

        mounted() {
            if (this.localStorage.get('activateNewOrgName')) this.$store.commit('newOrganizationName', this.localStorage.get('activateNewOrgName'))
            k('publisher access sign up: ', this.newOrganizationName)
            
            if (this.userInfo && this.newOrganizationName) this.newContentOwner()
        }
    }
</script>

<style>

</style>
