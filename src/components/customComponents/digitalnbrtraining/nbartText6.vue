<template>

<div class="row" align="center" style="rowStyle">
    <div class="col-12">
        <a @click="route('/shop')">
            <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/digitalnightclubbarandrestauranttraining/Shop-Our-Digital-Library-Button.jpg" />
        </a>
        <h4 class="ui centered header">Browse, Search & Preview</h4>
    </div>
</div>

</template>

<script>
    export default {
        props: ['componentData'],
        
        computed: {
            rowStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#fff') + '; padding: 3rem 0;'
            }
        }
    }
</script>