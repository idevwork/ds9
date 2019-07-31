<template>
    
    <div class="row" align="center" style="padding: 2rem; text-align: center;">
        <q-btn @click="seeAllProducts()" :style="'margin: 0 auto; background-color: ' + (componentData.backgroundColor || brandColor || '#fff') + '; color: ' + (componentData.textColor || '#000') + ';'">
            Browse all products
        </q-btn>
    </div>
    
</template>

<script>
    export default {
        props: ['componentData'],

        data() {
            return {

            }
        },

        computed: {
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            }
        },

        methods: {
            seeAllProducts() {
                this.route('/shop')
            }
        }
    }
</script>

<style>
</style>