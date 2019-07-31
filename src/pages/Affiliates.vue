<template>
    
    <div class="row">
        
        <div v-if="!newShopInstructions" class="col-12" :style="affiliateHeaderStyle">
            <h2 align="center" style="color: white;">
                <q-icon name="fa-shopping-basket" style="font-size: 4rem !important;" />

                <div style="color: white; margin-top: 1rem;">Sign up to be a <strong>{{environmentData.shopName}}</strong> affiliate.</div>
            </h2>
            
            <h6 align="center" style="color: white; margin-top: 1rem;">
                Ten years ago, starting a video shop took years and cost millions of dollars.
            </h6>            
            <h6 align="center" style="color: white; margin-top: 1rem;">
                Now, it's free and takes just a few seconds...
            </h6>
        </div>
    
        <div v-if="!newShopInstructions" class="col-12 row" style="padding: 2rem;">
                
            <q-card v-if="!showSignIn" style="padding: 1rem; max-width: 750px; margin: 0 auto;">
                <q-card-main>
                    <h6 align="center">To get started, type in a name for your shop (you can always change it later):</h6>

                    <q-input id="affliateShopName" color="grey-7" v-model="affiliateShopName" float-label="Enter Your Shop Name" style="margin-top: 1rem;" />
                    
                    <q-btn id="createAffiliateShopBtn" v-if="!showUserOrgs" class="full-width" :style="inputStyle" @click="signUp()">
                        Create my shop!
                    </q-btn>
        
                    <div v-if="showUserOrgs">
                        <q-select v-model="selectedOrg" float-label="Select An Organization" radio color="grey-7" :options="orgOptions" @input="chooseOrganization" />
        
                        <div align="center">Or</div>

                        <q-btn class="full-width" :style="inputStyle" @click="chooseOrganization('new')">
                            <h6>Create new organization</h6>
                        </q-btn>
                    </div>
                </q-card-main>
            </q-card>

            <div class="full-width" v-if="showSignIn">
                <Signin :noredirect="true" />
            </div>
    
        </div>
        
        <div v-if="!newShopInstructions" class="row col-12">
            <div :class="'col-sm-12 col-md-6 col-lg-4 col-xl-2 text-white bg-' + item.color" v-for="item in benefits" :key="item.title" align="center" style="padding: 1rem;">
                <h4 style="margin: 1rem;">
                    <q-icon :name="item.icon" class="big-icon" />
                </h4>
                <h6 style="margin: 1rem 0;">{{item.header}}</h6>
                <p class="text-white" style="font-size: .8rem;">{{item.description}}</p>
            </div>
        </div>
    
        <div id="newShopInstructions" v-if="newShopInstructions" class="col-12" v-html="newShopInstructions"></div>
    </div>
    
</template>

<script>
    
    import Signin from '../components/common/auth/Signin'
    
    export default {
        data() {
            return {
                newShopInstructions: '',
                affiliateShopName: '',
                selectedOrg: '',
                showSignIn: false,
                showUserOrgs: false
            }
        },
    
        components: {
            Signin
        },
    
        computed: {
            authenticated() {
                return this.$store.state.user.authenticated
            },
    
            environmentData() {
                return this.$store.state.environment.data
            },
    
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },
    
            userInfo() {
                return this.$store.state.user.info
            },
    
            initialParameters() {
                return this.$store.state.initialParameters
            },
    
            inputStyle() {
                return 'background: ' + (this.brandColor || '#444') + ' !important; margin: 8px; color: white;'
            },
    
            affiliateHeaderStyle() {
                return 'padding: 3rem 1rem; background-color: ' + (this.brandColor || '#444') + ';'
            },
    
            orgOptions() {
                return this.userInfo.userOrgs.map((org) => {
                    return {
                        label: org.organizationName,
                        value: org
                    }
                })
            },
    
            benefits() {
                return [{
                        header: 'Easy.',
                        description: 'Launch your ' + this.environmentData.shopName + ' shop in under a minute. No security certificate, shopping cart or merchant account needed, no complicated widgets or code.',
                        color: 'teal',
                        icon: 'fa-smile'
                    },
                    {
                        header: 'Totally free.',
                        description: 'Always completely free. No monthly fees, no credit card fees, no hosting fees, no risk, nothing to cancel.',
                        color: 'pink',
                        icon: 'fa-thumbs-up'
                    },
                    {
                        header: 'Generous commission.',
                        description: '25% commission. Full commission on repeat sales. Forever. And ever. No limits, no “cookie expiration.”',
                        color: 'green',
                        icon: 'fa-dollar-sign'
                    },
                    {
                        header: 'Your website.',
                        description: 'You work hard to drive traffic to your website. With the ' + this.environmentData.shopName + ' Affiliate Program, you keep your customers on your website and in your brand environment.',
                        color: 'blue',
                        icon: 'fa-globe'
                    },
                    {
                        header: 'Your customers.',
                        description: this.environmentData.shopName + ' believes your customers should stay yours. Only you have access to their email addresses and the ability to market to them in the future.',
                        color: 'orange',
                        icon: 'fa-users'
                    },
                    {
                        header: 'Get started now!',
                        description: 'Join the ' + this.environmentData.shopName + ' Affiliate Program and promote the very best content of its kind on the planet.',
                        color: 'purple',
                        icon: 'fa-clock'
                    }
                ]
            }
        },
    
        methods: {
    
            chooseOrganization(val) {
                k('choose org: ', val)
    
                if (val === 'new') {
                    this.createNewOrg = true
                    this.selectedOrg = ''
                }
                else {
                    this.createNewOrg = false
                    this.selectedOrg = val
                }
                // self.set('userMessage')
                this.makeShop()
            },
    
            signUp() {
    
                var shopName = this.affiliateShopName.replace(/"/g, '')
                k('affiliateShopName: ', shopName)
    
                if (!shopName) {
                    this.$q.notify({
                        message: 'Please enter a shop name.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
    
                // has to work whether or not they are signed in
                if (!this.authenticated) this.showSignIn = true
    
                if (this.authenticated) {
                    var userHasOrgs = this.userInfo.userOrgs && this.userInfo.userOrgs.length > 0
    
                    if (userHasOrgs) {
                        if (this.createNewOrg) {
                            this.makeShop()
                        }
                        else {
                            this.$q.notify({
                                message: 'Looks like you are connected to one or more organizations. Please choose the organization you want to create this shop under or choose to create a new organization.',
                                type: 'info',
                                icon: 'fa-info-circle',
                                position: 'bottom-left'
                            })
                            this.showUserOrgs = true
                        }
    
                    }
                    else {
                        // user does not have multiple orgs and need to make shop
                        this.makeShop()
                    }
                }
    
            },
    
            makeShop() {
                var shopName = this.affiliateShopName.replace(/"/g, '')
                k('makeShop: ', shopName)
    
                if (!shopName) {
                    this.$q.notify({
                        message: 'Please enter a shop name.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
    
                var req = {
                    "shopName": shopName,
                    "shopID2clone": this.environmentData.shopID,
                    "userID": this.userInfo.userID,
                    // "ambassadorAffiliateID": paramObj.ambassadorAffiliateID, // optional
                    "userEmail": this.userInfo.userEmail,
                    "environmentName": this.environmentData.environmentName
                }
    
                if (this.initialParameters.ambassadorAffiliateID) {
                    req.ambassadorAffiliateID = this.initialParameters.ambassadorAffiliateID
                }
                else if (this.environmentData.affiliateID != 1021) {
                    req.ambassadorAffiliateID = this.environmentData.affiliateID
                }
    
                if (this.selectedOrg) {
                    k('selectedOrg: ', this.selectedOrg)
                    req.affiliateID = this.selectedOrg.affiliates.split(',').pop() // if no affiliateID is sent, then new org will be created
                }
    
                k('makeShop req: ', j(req))
                
                // this.api.post(this.api.apiv3Route + 'shop/new', req, (res) => {
                this.api.post(`${this.api.apiv4Route}api/entities/newAffiliate`, req, (res) => {
                    k('response from API /shop/new: ', res)
    
                    if (res.success) {
                        this.newShopInstructions = res.html
                        this.newShopID = res.shopID
                        this.newEnvironmentName = res.environmentName
                    }
                    else {
                        this.$q.notify({
                            message: 'Sorry, we could not create your shop at this time. Please try again later or contact support.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
    
                })
            }
        },
    
        watch: {
            authenticated() {
                k('now auth\'d')
                if (this.authenticated) {
                    this.showSignIn = false
                    this.signUp()
                }
            }
        },
    
        mounted() {
            // console.log('componentData: ', this.componentData)
    
        }
    }
</script>

<style scoped>
    .q-icon {
        font-size: 2rem;
    }
</style>
