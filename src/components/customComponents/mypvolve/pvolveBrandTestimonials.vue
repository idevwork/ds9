<template>
    
    <div class="row" style="padding: 2rem 1rem; background: #FFF8F5;">
        <div class="well row">
        
            <q-carousel v-if="componentData && componentData.brandTestimonials" class="col-12" quick-nav infinite autoplay color="grey" style="padding: 1rem 0 2rem 0;">
                <q-carousel-slide v-for="slide in componentData.brandTestimonials" :key="slide.id" align="center">
                    <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/quote_icon.png" />
                    <h1 class="thinHeader" style="text-transform: none; color: #444;">{{slide.quote}}</h1>
                    <img align="center" :src="'https://vault.platformpurple.com/static/clients/mypvolve/' + slide.imageFilename" style="width: 100%; max-width: 300px; padding: 2rem;" />
                </q-carousel-slide>
            </q-carousel>
            
        </div>
    </div>        
      
</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        components: {
        },

        data() {
            return {
            }
        },

        mixins: [globalComputedData],

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

<style>
    
</style>
