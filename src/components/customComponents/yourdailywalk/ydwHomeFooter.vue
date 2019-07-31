<template>

    <div id="footer" class="row fixed-bottom" :style="footerStyle">
        <div class="col" align="center" style="color: white;">
            <!--<div v-if="socialMediaLinks" class="ui center aligned row">-->
            <!--    <a target="_blank" :href="link" style="color: white;"><i class="big circular {{icon}} icon"></i></a>-->
            <!--</div>-->
            <a href="https://walkathome.com" target="_blank">Return to walkathome.com</a>
            <br />

            <q-icon name="fa-copyright" style="font-size: 1rem;" /> {{moment().format('YYYY')}} {{environmentData.shopName ? ' ' + environmentData.shopName : ''}}. All Rights Reserved.
        </div>
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
            environmentData() {
                return this.$store.state.environment.data
            },

            homePageData() {
                return this.$store.state.environment.json
            },

            footerStyle() {
                return 'background: ' + (this.componentData.backgroundColor || this.homePageData.e.brandColor || '#564F8A') + '; margin: 0; border-radius: 0; padding: 1rem; z-index: 10;'
            }
        },

        methods: {

        },

        mounted() {
            // console.log('componentData: ', this.componentData)
        },

        beforeDestroy() {

        }
    }
</script>