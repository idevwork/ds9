<template>
    <div class="row well justify-center content-center">
            <q-card class="bg-grey-3 col-12" style="max-width: 500px;">
                <q-card-main>
                    <h5 align="center">Activate a product:</h5>
                    
                    <q-input 
                        id="redeem" 
                        class="inputBox"
                        color="grey"
                        v-model="$root.$store.state.activationCode" 
                        float-label="Enter Your Activation Code" 
                        v-on:keydown.enter="submitCode()" 
                    />
                    
                    <q-btn id="redeemButton" color="green" v-if="$root.$store.state.activationCode" class="full-width" @click="submitCode()">Activate</q-btn>
                </q-card-main>
            </q-card>
    </div>
</template>

<script>
    import { userAndProductInfo } from '../mixins/userAndProductInfo'
    import { purchaseAndActivation } from '../mixins/purchaseAndActivation'

    export default {
        
        mixins: [userAndProductInfo, purchaseAndActivation],
        
        data() {
            return {
                // activationCode: ''
            }
        },

        computed: {
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
                    
                    this.activateCode((submitSuccess) => {
                        if (submitSuccess) {
                            var route = this.environmentJSON && this.environmentJSON.e.afterActivateRoute ? this.environmentJSON.e.afterActivateRoute : '/library'
                            this.route(route)
                        }
                    }) 
                }
            }
        },
        
        watch: {
            userInfo() {
                if (this.activationCode) {
                    this.submitCode()
                }
            }
        },

        created() {
            document.body.classList.add('windowheight-q-layout-page-container')
            k('activationCode: ', this.activationCode)

            if (this.initialParameters && this.initialParameters.activationCode) {
                this.$store.commit('activationCode', this.initialParameters.activationCode)
                // this.activationCode = this.initialParameters.activationCode
                if (this.userInfo) this.submitCode()
            }

            if (this.activationCode) {
                if (this.userInfo) this.submitCode()
            }
        },

        beforeDestroy(){
            document.body.classList.remove('windowheight-q-layout-page-container')

        }
    }
</script>

<style>
.windowheight-q-layout-page-container .q-layout-page-container{
    height: 100vh;
    display: flex;
}
</style>
