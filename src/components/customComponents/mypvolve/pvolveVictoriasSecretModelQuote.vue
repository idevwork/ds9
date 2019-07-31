<template>
    
    <div class="row">
        
        <div class="col-sm-12 col-md-6" align="center" style="margin: -5px auto;">
            <img style="max-width: 100%;" src="https://vault.platformpurple.com/static/clients/mypvolve/p_casual.jpg" />
        </div>
        
        <div class="col-sm-12 col-md-6" style="position: relative;">
            <div :style="windowWidth > 767 ? 'width: 100%; padding: 1rem 3rem; position: absolute; top: 50%; transform: translateY(-50%);' : 'padding: 1rem;'">
                <h4 class="thinHeader" :style="`margin: .5rem 0; line-height: 2.5rem; text-transform: none;`">“For me it changed my body completely because it doesn’t bulk you—it gives you amazing lines and it’s a very ‘female workout’, so I really like it.”</h4>
                <p>— Nadine Leopold, <span :style="`color: ${pvolveSalmon}; text-transform: uppercase;`">Victoria’s secret model</span> <br /> <span style="margin-left: 1rem; font-weight: 700;">In Harper's Bazaar, 2018</span></p>
            </div>
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
