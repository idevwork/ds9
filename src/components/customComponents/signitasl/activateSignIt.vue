<template>
    <div class="row well justify-center">
        <q-card class="col-12" style="max-width: 500px;">
            <q-card-main>
                <h5 align="center">Activate a product:</h5>
                <q-input id="redeem" v-model="$root.$store.state.activationCode" float-label="Enter Your Activation Code" />
                <q-btn id="redeemButton" color="green" v-if="$root.$store.state.activationCode" class="full-width" @click="submitCode()">Activate</q-btn>
            </q-card-main>
        </q-card>
    </div>
</template>

<script>
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {
        
        mixins: [userAndProductInfo],
        
        data() {
            return {
                // activationCode: ''
            }
        },

        computed: {
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
            
            activationCode() {
                return this.$store.state.activationCode
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },

            inputStyle() {
                return 'background: ' + (this.brandColor || '#555') + '!important;'
            },

            authenticated() {
                return this.$store.state.user.authenticated
            },

            userInfo() {
                return this.$store.state.user.info
            },

            initialParameters() {
                return this.$store.state.initialParameters
            }
        },

        methods: {

            submitCode() {
                k('submit code: ', this.activationCode)

                if (!this.activationCode) {
                    this.$q.notify({
                        message: 'Please type in your code and click enter...',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }

                if (!this.authenticated) {
                    this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.redirect', value: '/activate' })
                    this.route('/signin')
                }
                else {
                    this.$q.loading.show()
                    
                    if (this.initialParameters.redirect) {
                        this.$store.commit('deleteKeyPathInStore', 'initialParameters.redirect')
                        this.route('/activate')
                    }
                    this.activateCode()
                }

            },

            activateCode() {
                this.$q.loading.show()
                
                const req = {
                    'activationCode': this.activationCode,
                    'userLoginToken': this.userLoginToken,
                    'environmentName': this.environmentName
                }

                const url = `${this.api.apiv4Route}api/shop/useActivationCode`

                k('activateCode: ', req)

                this.api.post(url, req, (res) => {
                    k(res)

                    if (!res.success) {
                        this.$store.commit('activationCode', '')
                        this.$q.loading.hide()
                        
                        var replies = {
                            codeHasBeenUsed: "Sorry, this code has already been used.",
                            activationFail: "Sorry, we had trouble activating this code.",
                            codeNotFound: "Sorry, we couldn't find this code.",
                        }
                        this.$q.notify({
                            message: replies[res.messageCode],
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                    else {
                        this.$q.notify({
                            message: 'Your activation code has been registered! We\'re now going to refresh your library.',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                        
                        this.$store.commit('activationCode', '')
                        this.$q.loading.hide()
                        
                        // this.$store.commit('myLibrary', '')
                        // this.getProductsAndTags4Environment()
                        
                        // var route = this.environmentJSON && this.environmentJSON.e.afterActivateRoute ? this.environmentJSON.e.afterActivateRoute : '/library'
                        // this.route(route)
                        
                        window.location.href = 'https://signitasl.net?userLoginToken=' + this.userLoginToken
                    }
                })
            }
        },
        
        watch: {
            userInfo() {
                if (this.activationCode) {
                    this.submitCode()
                }
            }
        },

        mounted() {
            k('activationCode: ', this.activationCode)

            if (this.initialParameters && this.initialParameters.activationCode) {
                this.$store.commit('activationCode', this.initialParameters.activationCode)
                // this.activationCode = this.initialParameters.activationCode
                this.submitCode()
            }

            if (this.activationCode) {
                if (this.userInfo) this.submitCode()
            }
        }
    }
</script>

<style>
</style>
