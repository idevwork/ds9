<template>
    
    <div v-if="productPreviewData.productID != '10993' && productPreviewData.productID != '16008' && productPreviewData.productID != '138345' && productPreviewData.productID != '137222' && productPreviewData.productID != '137279'" class="row" style="text-align: center; background: #efefef; padding: 2rem 0;">
        <div class="col-12">
            <img align="center" style="max-width: 150px;" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/' + environmentName + '.png'" />
            <h4 align="center">All-Access Digital Subscription</h4>
        </div>
        
        <div class="well" style="width: 100%;">
            <div class="row">
                
                <q-card color="white" class="col-sm-12 col-md">
                    <q-card-main style="color: black;">
                        <h5 style="margin: 0;">MONTHLY</h5>
                        <p>unlimited streaming and downloads</p>
                        <q-btn @click="subscribeMonth()" size="lg" color="primary" icon="fa-cart-plus" class="full-width">sign up - $9.99</q-btn>
                    </q-card-main>
                </q-card>
                
                <q-card color="white" class="col-sm-12 col-md">
                    <q-card-main style="color: black;">
                        <h5 style="margin: 0;">ONE YEAR</h5>
                        <p>unlimited streaming and downloads</p>
                        <q-btn @click="subscribeYear()" size="lg" color="primary" icon="fa-cart-plus" class="full-width">sign up - $99.99</q-btn>
                    </q-card-main>
                </q-card>
                
            </div>
            <h5 align="center">Sign up now to get all your favorite Two Little Hands Videos!</h5>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['productPreviewData'],
        
        computed: {
            environmentName() {
                return this.$store.state.environment.name
            }
        },
        
        methods: {
            subscribeMonth() {
                this.$root.$emit('closeProductPreview')
                setTimeout(() => {
                    this.route('/shop/10993')
                }, 500)
            },
            
            subscribeYear() {
                this.$root.$emit('closeProductPreview')
                setTimeout(() => {
                    this.route('/shop/16008')
                }, 500)
            }
        }
    }
</script>