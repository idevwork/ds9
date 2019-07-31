<template>
    
    <div id="hero" class="row" @click="goToHeroLink" :style="heroStyle">
        <div class="color-overlay" :style="overlayStyle"></div>
        
        <div v-if="componentData.logoURL || componentData.heroTitle" id="headerColor" :style="innerHeroStyle">
            
            <img v-if="componentData.logoURL" :src="logoSrc" :style="logoStyle" />
            <h2 v-if="componentData.heroTitle || componentData.title" :style="heroTitleStyle" v-html="componentData.heroTitle"></h2>
    
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
                return `https://vault.platformpurple.com/static/clients/${this.componentData.backgroundImageURL}`
            },
    
            logoSrc() {
                return `${this.componentData.logoURL}?t=${Date.now()}`
                
            },
            
            heroTitleStyle() {
                return `color: ${this.componentData.textColor}; ${this.componentData.textShadow ? 'text-shadow: 0px 0px 4px #000;' : ''}`
            },
    
            windowWidth() {
                return this.$root.$store.state.windowWidth
            },
    
            heroStyle() {
                var styleStr = ""
                styleStr += this.componentData.backgroundImageURL ? `background: url(${this.heroImageSrc}); ` : ``
                styleStr += this.componentData.headerColor ? `background-color: ${this.componentData.headerColor}; ` : ``
                styleStr += `background-position: ${this.componentData.backgroundPosition ? this.componentData.backgroundPosition : `50%`}; `
                styleStr += `background-size: ${this.componentData.backgroundSize || 'cover'}; `
                styleStr += `background-repeat: no-repeat; `
                styleStr += this.componentData.heroHeight ? `height: ${this.componentData.heroHeight}; ` : ``
                styleStr += this.componentData.logoLink ? `cursor: pointer;` : ``
                styleStr += `padding: ${this.windowWidth > 992 ? `4rem` : `1rem`};`
                // k('styleStr: ', styleStr)

                return styleStr
            },
            
            overlayStyle() {
                let overlayColor = this.componentData.overlayColor
                let overlayOpacity = this.componentData.overlayOpacity
                let styleStr = ''
                styleStr += overlayColor ? `background-color: ${overlayColor};`: ''
                styleStr += overlayOpacity ? `opacity: ${overlayOpacity};` : ''
                
                return styleStr
            },
            
            innerHeroStyle() {
                var styleStr = "z-index: 1; width: 100%; text-align: center;"
                    styleStr += (this.componentData.padding && this.windowWidth > 767 ? `padding: ${this.componentData.padding} 0;` : this.componentData.mobilePadding && this.windowWidth < 768 ? `padding: ${this.componentData.mobilePadding} 0;` : ``)
                    styleStr += (this.componentData.margin && this.windowWidth > 767 ? `margin: ${this.componentData.margin} 0;` : this.componentData.mobileMargin && this.windowWidth < 768 ? `margin: ${this.componentData.mobileMargin} 0;` : ``)
                return styleStr
            },
            
            logoStyle() {
                return `max-height: ${this.componentData.logoMaxHeight ? this.componentData.logoMaxHeight : '300px' }; max-width: 100%; margin: 2rem auto; padding: 0 1rem; display: block;`
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

<style>
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
</style>