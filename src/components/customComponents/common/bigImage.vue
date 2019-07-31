<template>
    
    <div class="row" align="center" :id="componentData.id">
        <a class="col-12" :href="componentData.imageHREF">
            <img class="full-width" :src="heroImageSrc" />
        </a>
    </div>

</template>

<script>
    export default {
        props: ['componentData'],
        
        computed: {
            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/' + this.componentData.imageSrc
            }
        }
    }
</script>