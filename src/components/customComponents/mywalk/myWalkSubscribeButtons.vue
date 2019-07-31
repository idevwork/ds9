<template>
    
    <div v-if="productPreviewData.productID !== 149296 && productPreviewData.productID !== 149295" class="row" style="text-align: center; background: #efefef; padding: 1rem 0;">
        <div class="well" style="width: 100%;">
            <div class="row">

                <q-card color="white" class="col">
                    <q-card-main style="color: black;">
                        <img style="max-width: 150px;" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/' + environmentName + '.png'" />
                        <!--<h5 style="margin: 0;">YEARLY</h5>-->
                        <h5 align="center" class="monty">Get it all for one low monthly price, or save $$$ with an annual pass.</h5>
                        <!--<p style="font-size: .8rem;">unlimited streaming and downloads</p>-->
                        
                        <div class="row">
                            <div class="col-6" style="padding: .5rem;">
                                <q-btn @click="subscribeMonth()" class="full-width monty thickHeader" :style="'background: ' + brandColor + '; color: #fff;'">monthly — $8.25</q-btn>
                            </div>
                            <div class="col-6" style="padding: .5rem;">
                                <q-btn @click="subscribeYear()" class="full-width monty thickHeader" :style="'background: ' + brandColor + '; color: #fff;'">yearly — $89.99</q-btn>
                            </div>
                        </div>
                    </q-card-main>
                </q-card>

            </div>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['productPreviewData'],
        
        computed: {
            environmentName() {
                return this.$store.state.environment.name
            },
            
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            }
        },
        
        methods: {
            subscribeMonth() {
                this.$root.$emit('closeProductPreview')
                this.$nextTick(() => {
                    this.route('/shop/149295')
                })
            },
            
            subscribeYear() {
                this.$root.$emit('closeProductPreview')
                this.$nextTick(() => {
                    this.route('/shop/149296')
                })
            }
        }
    }
</script>