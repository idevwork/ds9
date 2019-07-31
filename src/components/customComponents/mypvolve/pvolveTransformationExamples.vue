<template>
    
    <div class="row" style="padding: 2rem 1rem;">
        <div class="well row" align="center">
            <h2 class="col-12 thickHeader" :style="`color: #777; ${windowWidth < 768 ? 'font-size: 1.75rem;' : ''}`">Transformations</h2>
        
            <q-carousel v-if="componentData && componentData.transformations" class="col-12" arrows quick-nav infinite color="grey" style="padding-bottom: 4rem; max-width: 600px; margin: 0 auto;">
                <q-carousel-slide v-for="slide in componentData.transformations" :key="slide.id" align="center">
                    <img align="center" :src="'https://vault.platformpurple.com/static/clients/mypvolve/' + slide.imageFilename" style="max-width: 100%; padding: 1rem;" />
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
