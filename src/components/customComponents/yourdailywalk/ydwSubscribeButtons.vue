<template>

    <div class="row">
        <div class="col-12" align="center">
            <h2 style="margin: 1rem;">7 DAY FREE TRIAL OFFER!</h2>
        </div>
        
        <div class="col" style="padding: .5rem;">
            
            <q-card align="center" color="white" style="color: black !important; margin: 0;" @click.native="goToMonthly">
                <q-card-title>
                    <h6 align="center">MONTHLY MEMBERSHIP</h6>
                </q-card-title>
                
                <q-card-main align="center">
                    <q-btn size="lg" color="pink" style="background: #dc3972; padding: 0 2rem;">
                        <h6>JOIN!</h6>
                    </q-btn>
                    <p style="font-size: .8rem; margin-top: 1rem;">Monthly membership: $4.99</p>
                </q-card-main>
            </q-card>
        </div>
        
        <div class="col" style="padding: .5rem;">
                    
            <q-card align="center" color="white" style="color: black !important; margin: 0;" @click.native="goToAnnual">
                <q-card-title>
                    <h6 align="center">ANNUAL MEMBERSHIP</h6>
                </q-card-title>
                
                <q-card-main align="center">
                    <q-btn size="lg" color="pink" style="background: #dc3972; padding: 0 2rem;">
                        <h6>JOIN!</h6>
                    </q-btn>
                    <p style="font-size: .8rem; margin-top: 1rem;">Annual membership (best value): $49.99</p>
                </q-card-main>
            </q-card>
        </div>
        
        <div class="col-12" align="center">
            <p style="font-size: .8rem; margin-top: 1rem;">Use the code "7dayfree", full price afterwards. Credit card required. Cancel anytime within the 7 days and you will not be charged.</p>
        </div>

    </div>
    
</template>

<script>
    export default {
        computed: {
            initialParameters() {
                return this.$store.state.initialParameters
            },
            
            productPreviewModalOpen() {
                return this.$store.state.productPreviewModalOpen
            }
        },
        
        methods: {
            goToAnnual() {
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.cart', value: '109777' })
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.coupon', value: '7dayfree' })
                
                if (this.productPreviewModalOpen) {
                    this.$root.$emit('closeProductPreview')
                    this.$root.$on('closedProductPreview', () => {
                        this.$root.$off('closedProductPreview')
                        this.route('/shop/checkout?cart=109777&coupon=7dayfree')
                    })
                } else {
                    this.route('/shop/checkout?cart=109777&coupon=7dayfree')
                }
            },
            
            goToMonthly() {
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.cart', value: '109776' })
                this.$store.commit('addKeyPathInStore', { keyPath: 'initialParameters.coupon', value: '7dayfree' })
                
                if (this.productPreviewModalOpen) {
                    this.$root.$emit('closeProductPreview')
                    this.$root.$on('closedProductPreview', () => {
                        this.$root.$off('closedProductPreview')
                        this.route('/shop/checkout?cart=109776&coupon=7dayfree')
                    })
                } else {
                    this.route('/shop/checkout?cart=109776&coupon=7dayfree')
                }
            }
        }
    }
</script>