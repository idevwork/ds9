<template>

    <div id="thankyouPage" class="row well">
        <div class="col-12" v-html="receipt" style="border: 1px solid #ccc;"></div>
    </div>

</template>

<script>
    
    export default {
    
        data() {
            return {
                receipt: ''
            }
        },
    
        computed: {
            environment() {
                return this.$store.state.environment
            },
    
            homePageData() {
                return this.$store.state.environment.json
            },
    
            userInfo() {
                return this.$store.state.user.info
            },
    
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
    
            authenticated() {
                return this.$store.state.user.authenticated
            },
    
            initialParameters() {
                return this.$store.state.initialParameters
            }
        },
    
        methods: {
    
            sendToken2API() {
                k('token is', this.initialParameters.token)
    
                var req = {}
                req.encryptedToken = this.initialParameters.token
                req.userLoginToken = this.userLoginToken // send login token for comparision
    
                k('send to api')
                // https://api-v4-dev2.platformpurple.com/api/token/use
                
                this.api.post(this.api.apiv4Route + 'api/token/use', req, (res) => {
                    k('sendToken2API: ', res)
                    
                    if (res.messageCode) {
                        var messageStr = ''
                        
                        switch (res.messageCode) {
                            case 'giftExchangeCreditSuccess':
                                messageStr = 'Credit redemption successful!'
                                break;
                            case 'giftRedeemSuccess':
                                messageStr = 'Gift redemption successful!'
                                break;
                            case 'tokenUsed':
                                messageStr = 'Sorry, it looks like this token has already been used. Please contact support if you did not receive your gift.'
                                break;
                        }
    
                        this.$q.notify({
                            message: messageStr,
                            type: res.success ? 'positive' : 'negative',
                            icon: res.success ? 'fa-check-circle' : 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                    
                    if (res.success) this.sendToken2APISuccess(res)
                    if (!res.success) {
                        kw('now page to:', res.pageRoute)
    
                        this.route(res.pageRoute)
                    }
                })
            },
    
            sendToken2APISuccess(res) {
                if (!this.authenticated && res.userLoginToken) {
                    // auto log in user
                    this.$store.commit('userLoginToken', res.userLoginToken)
                    this.$store.commit('authenticated', true)
                }
    
                if (res.paramObj) {
                    // save these params
                    Object.keys(res.paramObj).forEach((key) => {
                        this.initialParameters[key] = res.paramObj[key]
                    })
                }
                
                this.$store.commit('deleteKeyPathInStore', 'initialParameters.token')
                
                this.receipt = res.html
            }
    
        },
    
        mounted() {
            // console.log('componentData: ', this.componentData)
    
            k('gift preview token: ', this.initialParameters.token)
            if (this.initialParameters.token) this.sendToken2API()
        },
    
        beforeDestroy() {
    
        }
    }
</script>

<style scoped>
    /*#thankyouPage {*/
    /*    width: fit-content;*/
    /*    width: -moz-fit-content;*/
    /*}*/
</style>
