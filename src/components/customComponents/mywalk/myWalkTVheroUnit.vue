<template>

    <div style="width: 100%; height: 100px;">
        <!--<div style="filter: opacity(.2);">-->
        <div class="videoDiv">
            <VideoBackground
                :sources="['https://w2d4h2w3.ssl.hwcdn.net/static/previews/wp_ls_justwalkhits/wp_ls_justwalkhits_sample.mp4']" img="https://f3r6v6t8.ssl.hwcdn.net/static/previews/wp_fastfirm/wp_fastfirm_image_cover.png">
                <h1>hi</h1>
            </VideoBackground>
        </div>
    </div>
    
</template>

<script>

    import VideoBackground from '../../common/VideoBackground'
    
    export default {
        
        props: ['componentData'],
        components: {
            VideoBackground    
        },
        
        computed: {
            environmentData() {
                return this.$root.$store.state.environment.data
            },
            
            environmentName() {
                return this.$root.$store.state.environment.name
            },
            
            windowWidth() {
                return window.innerWidth
            }
        },
        
        methods: {

        }
    }

</script>

<style>
    .videoDiv {
        /*filter: brightness(40%);*/
        /*filter: blur(10px);*/
    }
</style>