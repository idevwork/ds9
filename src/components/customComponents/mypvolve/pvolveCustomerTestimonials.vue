<template>
    
    <div class="row" style="padding: 2rem 1rem; background: #efefef;">
        <div class="well row">
            <q-carousel v-if="componentData && componentData.customerTestimonials" class="col-12" quick-nav infinite autoplay color="grey" style="padding: 1rem 0 2rem 0;">
                <q-carousel-slide v-for="slide in componentData.customerTestimonials" :key="slide.id" align="center">
                    <h1 class="thinHeader" style="text-transform: none; color: #444;">{{slide.quote}}</h1>
                    <h4 class="uppercase" style="margin-top: 1rem;">- {{ slide.customer }}</h4>
                </q-carousel-slide>
            </q-carousel>
            
        </div>
    </div>
      
</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { pvolveColors } from './pvolveColors'

    export default {
        props: ['componentData'],

        components: {
        },

        data() {
            return {
            }
        },

        mixins: [globalComputedData, pvolveColors],

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
