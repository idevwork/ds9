<template>
    
    <div style="width: 100%; height: 300px; background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/signingtime/my-signing-time-academy-hero-image.jpg'); background-size: cover; background-position: 50%;">
        <h5 align="center" :style="(windowWidth > 768 ? 'padding: 1.5rem;' : 'padding: 1rem;') + 'margin: 0; color: #fff;'">{{shopName}}</h5>
        <img :src="componentData.logoURL" style="margin: 0 auto; display: block; max-width: 300px;" />
        <p align="center" style="color: #fff;"><strong>Digital Shop & Player - DVDs available at SigningTime.com</strong></p>
    </div>

</template>

<script>

   export default {
        props: ['componentData'],
        
        computed: {
            environmentData() {
                return this.$store.state.environment.data
            },
            
            environmentName() {
                return this.$store.state.environment.name
            },
            
            shopName() {
                return this.$store.state.environment.data.shopName
            },
            
            windowWidth() {
                return this.$store.state.windowWidth
            }
        },
        
        methods: {
            goToLibrary() {
                this.route('/library')
            }
        }
    }

</script>