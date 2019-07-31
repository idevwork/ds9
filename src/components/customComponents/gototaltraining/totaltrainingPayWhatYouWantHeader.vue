<template>

    <div :style="homeSearchStyle">
    
        <div class="row well" align="center">
            <div class="col-12 text-white" style="padding: 1rem;">
                <!--<q-icon :name="componentData.headerIcon" style="font-size: 3rem;" />-->
                <h1 style="margin: 1rem 0;">Pay What You Want</h1>
                <h6>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
            </div>
        </div>
    
    </div>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],
        
        mixins: [globalComputedData],
        
        data() {
            return {
               
            }
        },
    
        computed: {
            homeSearchStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#efefef') + ';'
            },
        },
    
        methods: {
            
        },
    
        mounted() {
            
        }
    }
</script>

<style scoped>
    
</style>
