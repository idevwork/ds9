<template>
    <div>
        <div id="hero" class="row" @click="goToHeroLink" :style="heroStyle">
            <div class="color-overlay" :style="overlayStyle"></div>
            
            <div v-if="componentData.logoURL || componentData.heroTitle" id="headerColor" :style="innerHeroStyle">
                
                <div v-if="!globalSearchString" style="padding: 1rem 0;">
                    <h2 class="thickHeader monty" style="letter-spacing: 1px;">Hundreds of Expert Training Courses</h2>
                    <h6 class="monty" style="margin: .5rem 0;">Designed for Developers, Knowledge Workers and Creative Professionals</h6>
                </div>
                
                <div v-if="globalSearchString && componentData.logoURL"style="padding: 1rem;">
                    <img :src="componentData.logoURL" />
                </div>
                
                <totaltrainingSearchInput :componentData="componentData" />
                
                <div v-if="!globalSearchString" class="row" style="max-width: 500px; margin: 0 auto; padding: 1rem 0;">
                    <div class="col-4">
                        <q-btn class="full-width" @click="route('/learncoding')" flat :style="`color: ${darkRed}; padding: .5rem 0;`">
                            <q-icon name="fa-code" style="font-size: 3rem;" />
                            <div class="full-width" style="margin-top: .5rem;">Coding</div>
                        </q-btn>
                    </div>
                    <div class="col-4">
                        <q-btn class="full-width" @click="route('/beproductive')" flat :style="`color: ${darkBlue}; padding: .5rem 0;`">
                            <q-icon name="fa-lightbulb" style="font-size: 3rem;" />
                            <div class="full-width" style="margin-top: .5rem;">Productivity</div>
                        </q-btn>
                    </div>
                    <div class="col-4">
                        <q-btn class="full-width" @click="route('/getcreative')" flat :style="`color: ${darkGreen}; padding: .5rem 0;`">
                            <q-icon name="fa-paint-brush" style="font-size: 3rem;" />
                            <div class="full-width" style="margin-top: .5rem;">Creativity</div>
                        </q-btn>
                    </div>
                </div>
                
            </div>
        
        </div>
        
        <div v-if="globalSearchString && globalSearchString.length">
            <!--<div class="row well">-->
            <!--    <h2 class="col-12" align="center" style="margin-top: 1rem;">Results for "{{globalSearchString}}"</h2>-->
            <!--</div>-->
            
            <filterResultProductGrid :componentData="{ 
                backgroundColor: componentData.backgroundColor || '#fff', 
                showTagSidebar: true, 
                customTagSidebar: 'totaltrainingTagSidebar', 
                'productScope': 'nonSubscriptionProducts',
                'displayProductSort': true, 
                'defaultOrderByKey': '' 
            }" />
        </div>
    </div>

</template>

<script>
    import totaltrainingSearchInput from './totaltrainingSearchInput'
    import filterResultProductGrid from '../../common/showcase/filterResultProductGrid'
    import { totaltrainingColors } from './totaltrainingColors'
    
    export default {
        props: ['componentData'],
        
        mixins: [totaltrainingColors],
        
        components: {
            filterResultProductGrid,
            totaltrainingSearchInput
        },
    
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
                return 'color: ' + this.componentData.textColor + ';' + (this.componentData.textShadow ? 'text-shadow: 0px 0px 4px #000;' : '')
            },
    
            windowWidth() {
                return this.$root.$store.state.windowWidth
            },
    
            heroStyle() {
                var styleStr = ""
                styleStr += this.componentData.backgroundImageURL ? "background: url(" + this.heroImageSrc + "); " : ""
                styleStr += this.componentData.headerColor ? "background-color: " + this.componentData.headerColor + "; " : ""
                styleStr += "background-position: 50%; "
                styleStr += "background-size: " + (this.componentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.componentData.heroHeight ? "height: " + this.componentData.heroHeight + "; " : ""
                styleStr += this.componentData.logoLink ? "cursor: pointer;" : ""
                styleStr += "padding: 1rem;"
                k('styleStr: ', styleStr)
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
                    styleStr += (this.componentData.padding && this.windowWidth > 767 && !this.globalSearchString ? 'padding: ' + this.componentData.padding + ' 0;' : this.componentData.mobilePadding && (this.windowWidth < 768 || this.globalSearchString) ? 'padding: ' + this.componentData.mobilePadding + ' 0;' : '')
                    styleStr += (this.componentData.margin && this.windowWidth > 767 && !this.globalSearchString ? 'margin: ' + this.componentData.margin + ' 0;' : this.componentData.mobileMargin && (this.windowWidth < 768 || this.globalSearchString) ? 'margin: ' + this.componentData.mobileMargin + ' 0;' : '')
                return styleStr
            },
            
            globalSearchString() {
                return this.$store.state.searchString
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