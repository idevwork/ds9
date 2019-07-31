<template>

    <div v-if="showBackButton || showSearchFld" :style="homeSearchStyle">
        <div class="color-overlay" :style="overlayStyle"></div>
        
        <div class="row well" align="center" style="width: 100%; padding: 4rem 1rem;">
            <div v-if="componentData.logoURL || componentData.headerIcon || componentData.headerText || componentData.subHeaderText" class="col-12 text-white" style="padding: 1rem; z-index: 1;">
                <img v-if="componentData.logoURL" :src="componentData.logoURL" />
                <q-icon :name="componentData.headerIcon" :style="`font-size: 3rem; color: ${componentData.textColor};`" />
                <h1 v-if="componentData.headerText" :style="`margin: 1rem 0; color: ${componentData.textColor};`">{{componentData.headerText}}</h1>
                <h6 :style="`color: ${componentData.textColor};`">{{componentData.subHeaderText}}</h6>
            </div>
            
            <div v-if="showSearchFld" class="col-12" style="z-index: 1;">
                <totaltrainingSearchInput :componentData="componentData" />
            </div>
    
        </div>
    
    </div>

</template>

<script>
    import totaltrainingSearchInput from './totaltrainingSearchInput'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],
        
        mixins: [globalComputedData],
        
        components: {
            totaltrainingSearchInput
        },
        
        data() {
            return {
                productLengthLimit: 10
            }
        },
    
        computed: {
            userActiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer
                }) : ''
            },

            showSearchFld() {
                return (this.forSaleProducts.length > this.productLengthLimit && this.currentView !== 'myLibrary') || (this.userActiveProducts.length > this.productLengthLimit && this.currentView === 'myLibrary') ? true : false
            },
            
            showBackButton() {
                // return this.currentView !== 'showcase' && (this.searchString || this.userSelectedTags.length)
                return this.currentView !== 'showcase'
            },
    
            homeSearchStyle() {
                // return 'background: ' + (this.componentData.backgroundColor || '#efefef') + ';'
                return 'background: url(' + this.componentData.backgroundImageURL + ') 50% center / cover; position: relative; padding: 1rem;'
            },
            
            overlayStyle() {
                let overlayColor = this.componentData.overlayColor
                let overlayOpacity = this.componentData.overlayOpacity
                let styleStr = ''
                styleStr += overlayColor ? `background-color: ${overlayColor};`: ''
                styleStr += overlayOpacity ? `opacity: ${overlayOpacity};` : ''
                
                return styleStr
            }
        },
    
        methods: {
            
            backToShowcase() {
                this.route('/')
                this.searchString = ''
                this.$store.commit('searchString', '')
            },
            
            deselectAllTags() {
                k('deselectAllTags: ', this.userSelectedTags)
                if (!this.userSelectedTags.length) return false
    
                // this.markSelectedTags()
                this.$store.commit('setUserSelectedTags', '')
                
                if (this.currentView !== 'myLibrary') {
                    this.route('/shop')
                }
            }
        },
    
        mounted() {
            // console.log('componentData: ', this.componentData)
            
            if (this.$store.state.searchString) this.searchString = this.$store.state.searchString
        }
    }
</script>

<style scoped>
    .q-icon {
        margin: 0 .5rem;
    }
    
    .color-overlay {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    #homeSearch:before, #homeSearch:after {
        background: none !important;
    }
</style>
