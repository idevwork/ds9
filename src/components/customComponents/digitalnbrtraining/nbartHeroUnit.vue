<template>
    
    <!--<div class="row" style="background: green;">-->
    <!--    <img @click="route('/shop')" align="center" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + componentData.backgroundImageURL" style="max-width: 992px; height: 100%; cursor: pointer; margin: 0 auto;" />-->
    <!--</div>-->
    
    <div class="row" :id="componentData.id" align="center" style="background: green;">
        <a class="col-12" style="max-width: 992px; margin: -5px auto;">
            <img class="full-width" @click="route('/shop')" :src="heroImageSrc" />
        </a>
    </div>

</template>

<script>
    export default {
        props: ['componentData'],
        
        computed: {
            environment() {
                return this.$store.state.environment
            },
            
            heroImageSrc() {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + this.componentData.backgroundImageURL
            }
        },
        
        created() {
            
            var metaTagStr = ''
                metaTagStr += '<meta name="" property="fb:app_id" content="1714862968734311" />'
                metaTagStr += '<meta name="" property="og:title" content="' + this.environment.data.shopName + '" />'
	            metaTagStr += '<meta name="" property="og:description" content="Subscribe or Start Your Free Trial. A Year From Now, You\'ll Wish You Had Started Today!" />'
	            metaTagStr += '<meta name="" property="og:image" content="https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/' + this.environment.name + '.png" />'
	            metaTagStr += '<meta name="Description" content="Subscribe or Start Your Free Trial. A Year From Now, You\'ll Wish You Had Started Today!">'

            document.getElementsByTagName('head')[0].append(metaTagStr)
        }   
    }
</script>