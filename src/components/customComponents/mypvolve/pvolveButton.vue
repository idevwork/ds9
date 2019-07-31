<template>
    
    <q-btn outline @click="buttonTapped" class="monty" :style="`margin: .5rem 0; background: ${componentData.backgroundColor || '#fff'} !important; color: #333;`">
        <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px;">{{componentData.buttonText}}</h6>
    </q-btn>
      
</template>

<script>
    
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    
    export default {
        props: ['componentData'],
        
        components: {

        },
        
        mixins: [pvolveColors, globalComputedData],

        data() {
            return {
                
            }
        },

        computed: {
            
        },

        methods: {
            buttonTapped() {
                this.$emit('buttonTapped')
            }
        },
        
        watch: {
            
        },
        
        mounted() {
            
        }
    }
</script>

<style>
    
</style>
