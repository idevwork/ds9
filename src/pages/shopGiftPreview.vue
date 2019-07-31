<template>

   <div id="giftPreview" class="well">
       <div class="row full-width">
           
           <q-card class="col-12 bg-white" style="margin: 0;">
               <q-card-main v-if="!giftPreview">
                   <q-inner-loading visible />
               </q-card-main>
               
               <q-card-main v-html="giftPreview" style="padding: 1rem 0 0 0;"></q-card-main>
           </q-card>
           
       </div>
   </div>

</template>

<script>

    export default {

        data() {
            return {
                giftPreview: ''
            }
        },

        computed: {
            initialParameters() {
                return this.$store.state.initialParameters
            },
            
            selectedProduct() {
                return this.$store.state.selectedProduct
            },

            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },

            toolbarStyle() {
                return 'background: ' + this.brandColor + ' !important ;'
            },

            cart() {
                return this.$store.state.cart
            }
        },
        
        methods: {
            getGiftPreviewBasedOnToken() {
                var logData = {
                    eventType: 'mailtoGiftPreviewOpened',
                    eventDesc: 'user opened gift preview as a result of a mailto link',
                    giftToken: this.initialParameters.token
                }
                
                this.api.sendEvent(logData)
                
                // https://api-v4-dev2.platformpurple.com/api/gifts/html
                var req = {
                    giftToken: this.initialParameters.token
                }
                k('getGiftPreviewBasedOnToken req: ', req)
                 
                this.api.post(this.api.apiv4Route + 'api/gifts/html', req, (res) => {
                    k('getGiftPreviewBasedOnToken res: ', res)
                    
                    if (res.html) {
                        this.giftPreview = res.html
                        
                        this.$store.commit('deleteKeyPathInStore', 'initialParameters.token')
                    }
                })
            }
        },

        created() {
            k('gift preview token: ', this.initialParameters.token)
            if (this.initialParameters.token) this.getGiftPreviewBasedOnToken()
        },

        beforeDestroy() {

        }
    }
</script>

<style>
    #giftPreview {
        background: #efefef;
    }
</style>
