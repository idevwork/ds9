<template>
    <div class="row" @click="goToHeroLink" :style="heroStyle">

        <div v-if="componentData.logoURL || componentData.heroTitle" id="headerColor" style="z-index: 999; width: 100%; text-align: center; padding: 18rem 0 0 0;">

            <img v-if="componentData.logoURL" :src="logoSrc" style="max-height: 300px; max-width: 100%; margin: 2rem auto; display: block; z-index: 9;" />
            <h5 v-if="componentData.heroTitle || componentData.title" :style="heroTitleStyle">{{componentData.heroTitle}}</h5>

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
            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/' + this.componentData.backgroundImageURL
            },

            logoSrc() {
                return this.componentData.logoURL + '?t=' + Date.now()
            },

            heroTitleStyle() {
                return 'color: ' + this.componentData.textColor + '; text-shadow: 0px 0px 4px #000;'
            },

            windowWidth() {
                return window.innerWidth
            },

            heroStyle() {
                var styleStr = ""
                styleStr += this.componentData.backgroundImageURL ? "background: url(" + this.heroImageSrc + "); " : ""
                styleStr += this.componentData.headerColor ? "background-color: " + this.componentData.headerColor + "; " : ""
                styleStr += "background-position: 50%; "
                styleStr += "background-size: " + (this.componentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.componentData.heroHeight ? "height: " + this.componentData.heroHeight + "; " : ""
                styleStr += "cursor: pointer; z-index: 9; padding: " + (this.windowWidth > 992 ? "4rem" : "0") + ";"
                // k('styleStr: ', styleStr)
                return styleStr
            }
        },

        methods: {
            goToHeroLink() {

            }
        },

        mounted() {
            // console.log('componentData: ', this.componentData)
        },

        beforeDestroy() {

        }
    }
</script>

<style>
</style>
