<template>
    
    <div class="row" :style="'background: ' + brandColor + '; padding: 3rem 0; margin: 1rem 0;'">
        <div class="row well">
            <q-card class="bg-white shadow-12" style="margin: 0 auto;"> 
            
                <q-card-title>
                    <h1 class="full-width" align="center">
                        <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/yourdailywalk/wah_icon_180.png" style="max-height: 2rem; padding: 0 .5rem;" />
                        Your Daily Walk subscription
                    </h1>
                    <h3 class="full-width text-grey-7" align="center">
                        only $4.99/month, $49.99/year!
                    </h3>
                </q-card-title>
                
                <q-card-main class="row">
                
                    <div class="col-sm-12 col-md-4" style="padding: 1rem;" align="center">
                        <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/digitalwalkathome/ydw-ipad-horizontal.jpg" style="max-height: 300px; width: auto; max-width: 100%; margin: 0 auto;" />
                    </div>
                    
                    <div class="col-sm-12 col-md-8" style="padding: 1rem;">
                        <h4 class="thickHeader" style="color: #00b0df; line-height: 2rem;">Keep your workout fresh with a new video every day.</h4>

                        <p style="margin-top: 1rem;">For a curated walking experience, we hand-pick a special sequence of video workouts every month for our “Your Daily Walk” subscribers.</p>
                        <p>Every day of each month is planned for you… some days you’ll take a long walk…
                        some days a mini walk… or even a rest day… just tap the screen and WALK!</p>
                        
                        <p>NOTE: Your Daily Walk is included in the All Access Pass above!</p>

                    </div>
                    
                </q-card-main>
                
                <q-card-main class="row" style="background-color: #1e1b1d; color: white;">
                        
                    <h4 class="col-12 thickHeader" align="center" style="margin-top: 1rem;">
                        WELCOME TO A BRAND NEW YOU!
                    </h4>
    
                    <div class="col-sm-12 col-md-6" style="padding: 1rem;" align="center">
                        <q-btn size="lg" style="background: #dc3972;" @click="goToPreview('annual')">
                            <h6>ANNUAL MEMBERSHIP</h6>
                        </q-btn>
                        <p class="text-white" style="margin: .5rem 0 0 0; font-size: .8rem;">Annual membership (best value): $49.99</p>
                    </div>
                    
                    <div class="col-sm-12 col-md-6" style="padding: 1rem;" align="center">
                        <q-btn size="lg" style="background: #dc3972;" @click="goToPreview('monthly')">
                            <h6>MONTHLY MEMBERSHIP</h6>
                        </q-btn>
                        <p class="text-white" style="margin: .5rem 0 0 0; font-size: .8rem;">First month free, $4.99 afterwards. Credit card required.</p>
                        <p class="text-white" style="margin: 0; font-size: .8rem;">Use the code "1monthfree" to get your first month free!.</p>
                    </div>
                    
                </q-card-main>
                
            </q-card>
        </div>
        
    </div>

</template>
<script>
    export default {
        
        computed: {
            brandColor() {
                return this.$root.$store.state.environment.json.e.brandColor
            },  
        },
        
        methods: {
            goToPreview(type) {
                if (type === 'annual') {
                    this.route('/shop/109777')
                } else {
                    this.route('/shop/109776')
                }
            }
        }
    }
</script>