<template>
    
    <div id="ydwHome" style="background: #efefef;">

        <yourdailywalkApp />

    </div>

</template>

<script>
    import yourdailywalkApp from './yourdailywalkApp'
    
    export default {
    
        data() {
            return {
            }
        },
        
        components: {
            yourdailywalkApp
        },
        
        computed: {
            environmentProducts() {
                return this.$store.state.environmentProducts
            }
        },
        
        mounted() {
            document.title = 'Your Daily Walk'
            
        }
    }
</script>