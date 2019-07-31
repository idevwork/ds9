<template>
        
    <div :style="videoStyle">
        <div align="center" class="well">
            <video controls :src="componentData.videoURL" style="width: 100%;"></video>
        </div>
    </div>
    
</template>

<script>
    export default {
        props: ['componentData'],
        
        computed: {
            videoStyle () {
                return 'background-color: ' + this.componentData.backgroundColor + '; padding: 2rem 0;'
            }
        }
    }
</script>