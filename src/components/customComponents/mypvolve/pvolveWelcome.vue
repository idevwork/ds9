<template>

    <div id="pvolveWelcome" class="relative-position bg-grey-2">
    
        <div v-if="environmentProducts && !userHasAccess(environmentJSON.e.validSubscriptionProductIDs)" class="row layout-padding justify-center">
            <div v-if="!authenticated" class="col-sm-12 col-md-6" align="center" style="padding: 1rem;">
                <h6 style="line-height: 2rem; letter-spacing: 1px;">
                    Already a p.volve subscriber?
                    <q-btn flat class="pchip" @click="route('/signin')" :style="`background: #fff !important; color: #333; border: 1px solid #333; padding: .1rem .5rem;`">
                        Sign In
                    </q-btn>
                </h6>
            </div>
    
            <div class="col-sm-12 col-md-6" align="center" style="padding: 1rem;">
                <pvolveTrialOrSubscribe :componentData="{}" @subscribe="goToSignUpNow()" @trial="route('/trial')" />
            </div>    
        </div>
    
        <div v-if="!environmentProducts" class="layout-padding">
            <q-inner-loading :visible="!environmentProducts" />
        </div>
    
    </div>

</template>

<script>
    import pvolveTrialOrSubscribe from './pvolveTrialOrSubscribe.vue'
    
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { pvolveColors } from './pvolveColors'
    
    export default {
        props: ['componentData'],
    
        data() {
            return {
    
            }
        },
        
        mixins: [ userAndProductInfo, pvolveColors ],
    
        components: {
            pvolveTrialOrSubscribe
        },
    
        computed: {
            environmentJSON() {
                return this.$store.state.environment.json
            },
            
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
    
            userActiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer
                }) : ''
            },
    
            authenticated() {
                return this.$store.state.user.authenticated
            }
        },
        
        methods: {
            goToSignUpNow() {
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.signUpNow', value: true })
                this.route('/offer/special?signUpNow=true')
            }
        }
    }
</script>

<style scoped>
    .pchip {
        /* width: fit-content; */
        color: #fff;
        background: #fff;
        border-radius: .25rem;
        padding: .25rem .5rem;
        margin: 0;
    }
</style>
