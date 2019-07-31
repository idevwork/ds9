<template>
    
    <div :id="componentData.id" class="row" style="cursor: pointer; background: #efefef;">
        <div class="well">
            <div class="col-12" align="center">
                <img class="full-width" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/iisports/busterjr.jpg" />
                <h1 align="center" style="font-size: 3rem; margin: 1rem;">{{shopName}}</h1>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['componentData'],
        
        computed: {
            shopName() {
                return this.$store.state.environment.data.shopName
            }
        }
    }
</script>