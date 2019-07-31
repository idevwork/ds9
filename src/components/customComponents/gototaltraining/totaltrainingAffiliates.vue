<template>
    <div class="layout-view">
        <div class="row well">
            <div class="col-12">
                <!--<img src="https://vault.platformpurple.com/static/clients/gototaltraining/cup-header-1024x576.jpg" style="max-width: 100%;" />-->
                <div style="background: url('https://vault.platformpurple.com/static/clients/gototaltraining/cup-header-1024x576.jpg'); background-position: 50%; background-size: cover; background-repeat: no-repeat; max-width: 1000px; margin: 0 auto;">
                    <div :style="`${windowWidth > 768 ? 'padding: 10rem 2rem;' : 'padding: 5rem 1rem;'}`">
                        <h2>Promote the very best in technology training.</h2>
                    </div>
                </div>
            </div>
            
            <div class="col-12" align="center" style="margin: 2rem 0;">
                <h3 style="margin: 1rem 0;">Join the Total Training Affiliate Program</h3>
                
                <p>Total Training has led the software training industry in quality video-based training since 1996.</p>
                
                <p>Today, Total Training offers total access to their entire in-demand library of award-winning courses on creative design, digital video, and office productivity software programs for one affordable price.</p>
                
                <p>Promote Total Training subscriptions, help people learn and master technology, and make money. Sign up now!</p>
                
                <q-btn flat size="lg" :style="`background: ${brandColor} !important; color: #fff;`">
                    Sign Up for free
                </q-btn>
            </div>
            
            <div class="col-12" align="center" style="padding: 2rem 0;">
                <iframe width="853" height="480" src="https://www.youtube.com/embed/nYJ0xIo0oy8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width: 100%;"></iframe>
            </div>
        
            <h3 class="col-12" align="center" style="margin: 1rem 0;">Total Training Affiliate Program Advantages</h3>
            
            <div class="col-12 row well justify-center" align="center">
                <div v-for="advantage in advanatges" class="col-xs-12 col-sm-6 col-md-4 relative-position" style="padding: 1rem 1rem 3rem;">
                    <q-btn round size="lg" :style="`background: ${brandColor} !important; color: #fff;`">
                        <q-icon :name="advantage.icon" />
                    </q-btn>
                    <h3 style="line-height: 2rem; margin: 1rem 0;">{{ advantage.title }}</h3>
                    <p>{{ advantage.text }}</p>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {

        components: {
            
        },
        
        mixins: [globalComputedData],
        
        data() {
            return {
                advanatges: [{
                    title: 'Easy',
                    text: 'Launch your Total Training shop in under a minute. No security certificate, shopping cart or merchant account needed, no complicated widgets or code.',
                    icon: 'far fa-smile'
                },
                {
                    title: 'Always free',
                    text: 'Totally, completely and always free. No monthly fees, no credit card fees, no hosting fees, no risk, nothing to cancel.',
                    icon: 'far fa-thumbs-up'
                },
                {
                    title: 'Generous commission',
                    text: 'Huge 20% commission. Full commission on repeat sales. Forever. And ever. No limits, no “cookie expiration.”',
                    icon: 'fas fa-dollar-sign'
                },
                {
                    title: 'Your website',
                    text: 'You work hard to drive traffic to your website. Unlike other affiliate programs, with the Total Training Affiliate Program, you keep your customers on your website and in your brand environment.',
                    icon: 'fas fa-globe'
                },
                {
                    title: 'Your customers',
                    text: 'Total Training believes your customers should stay yours. Only you have access to their email addresses and the ability to market to them in the future.',
                    icon: 'fas fa-users '
                },
                {
                    title: 'Get started now!',
                    text: 'Join the Total Training Affiliate Program and promote the very best technology training on the planet.',
                    icon: 'far fa-clock'
                },
                ]
            }
        },

        computed: {

        },

        methods: {

            
        },

        watch: {
            
        },

        created() {

        }

    }
    
    
</script>

<style scoped>
    
</style>
