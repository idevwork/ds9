<template>

    <div :style="`background: ${componentData.backgroundColor || '#fff'};`">
        <div id="hero" :class="`row ${windowWidth < 768 ? 'angled' : ''}`" @click="goToHeroLink" :style="heroStyle">
            
            <div class="color-overlay" :style="overlayStyle"></div>

            <div id="headerColor" class="well" :style="innerHeroStyle">
                
                <div class="full-width" :style="howToCastToYourTVButton">
                    
                    <q-btn flat @click="route('/howtocast')" :style="{ background: `${ pvolveMintBG } !important`, color: '#fff' }">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">How to Cast to Your TV</h6>
                    </q-btn>
                    
                </div>
                
                <h6 align="center" class="text-white thickHeader q-mt-xl" style="text-transform: uppercase; letter-spacing: 1px; font-size: .8rem;">Welcome to p.volve streaming</h6>

                <h1 align="center":style="`color: ${componentData.textColor}; font-size: 3rem; margin: 2rem;`">Your workouts. Anytime. <br /> Anywhere.</h1>
                <h6 align="center" class="text-white thinHeader" style="letter-spacing: 1px;">Stream your workouts on your favorite device.</h6>
                
            </div>
            
        </div>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { designTools } from '../../../mixins/designTools'

    export default {
        props: ['componentData'],

        data() {
            return {

            }
        },

        mixins: [designTools, pvolveColors],

        computed: {
            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/' + this.componentData.backgroundImageURL
            },

            logoSrc() {
                return this.componentData.logoURL + '?t=' + Date.now()
            },

            heroTitleStyle() {
                return `color: ${this.componentData.textColor}; ${this.componentData.textShadow ? `text-shadow: 0px 0px 10px ${this.componentData.textShadow};` : ``} ${this.windowWidth < 768 ? `font-size: 2rem;` : ''}`
            },

            windowWidth() {
                return this.$root.$store.state.windowWidth
            },

            heroStyle() {
                var styleStr = ""
                styleStr += this.componentData.backgroundImageURL ? "background: url(" + this.heroImageSrc + "); " : ""
                styleStr += this.componentData.headerColor ? "background-color: " + this.componentData.headerColor + "; " : ""
                styleStr += `background-position: ${this.windowWidth < 768 ? '50% 0%' : '50% 0%'};`
                styleStr += "background-size: " + (this.componentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.componentData.heroHeight ? "height: " + this.componentData.heroHeight + "; " : ""
                styleStr += this.componentData.logoLink ? "cursor: pointer;" : ""
                styleStr += "padding: " + (this.windowWidth > 992 ? this.componentData.padding ? this.componentData.padding : "3rem" : "1rem") + ";"
                // k('styleStr: ', styleStr)
                return styleStr
            },

            overlayStyle() {
                let overlayColor = this.componentData.overlayColor
                let overlayOpacity = this.componentData.overlayOpacity

                let styleStr = ''
                styleStr += overlayColor ? `background-color: ${overlayColor};`: ''
                styleStr += overlayOpacity ? `opacity: ${this.windowWidth < 768 ? '.5' : overlayOpacity};` : ''

                return styleStr
            },

            innerHeroStyle() {
                var styleStr = "z-index: 1; width: 100%;"
                    styleStr += (this.componentData.padding && this.windowWidth > 767 ? 'padding: ' + this.componentData.padding + ' 0;' : this.componentData.mobilePadding && this.windowWidth < 768 ? 'padding: ' + this.componentData.mobilePadding + ' 0;' : '')
                    styleStr += (this.componentData.margin && this.windowWidth > 767 ? 'margin: ' + this.componentData.margin + ' 0;' : this.componentData.mobileMargin && this.windowWidth < 768 ? 'margin: ' + this.componentData.mobileMargin + ' 0;' : '')
                return styleStr
            },
            
            howToCastToYourTVButton() {
                let style = {
                    top: '54px',
                    right: '72px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    position: 'absolute'
                }
                
                if (this.windowWidth < 768) {
                    delete style.top
                    delete style.right
                    delete style.position
                    style.justifyContent = 'center'
                }
                
                return style
            }
        },

        methods: {
            goToHeroLink() {
                if (this.componentData.logoLink) window.open(this.componentData.logoLink, '_blank')
            }
        },

        mounted() {
            // k('componentData: ', this.componentData)
        },

        beforeDestroy() {

        }
    }
</script>

<style scoped>
    #hero {
        position: relative;
    }

    .color-overlay {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .angled {
        clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
        -webkit-clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
    }
</style>
