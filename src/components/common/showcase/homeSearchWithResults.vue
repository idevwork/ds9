<template>

    <div v-if="showBackButton || showSearchFld" :style="homeSearchStyle">
    
        <div class="row well" style="width: 100%;">
    
            <div v-if="showBackButton" :class="showSearchFld ? 'col-3' : 'col-12'" :style="`${windowWidth > 992 ? `padding: 0 1.5rem 0 1rem` : `padding: 0 .5rem`};`">
                <q-btn id="backToShowcase" class="full-width" @click="backToShowcase()" :style="brandColor ? 'background: ' + brandColor + '; color: white;' : 'background: #fff;'">
                    <q-icon name="fa-caret-left" style="margin-right: .5rem;" /> 
                    <span class="gt-xs">back <span class="gt-md">to showcase</span></span>
                </q-btn> 
            </div>
    
            <div v-if="showSearchFld" :class="showBackButton ? 'col-9' : 'col-12'" style="padding: 0 .5rem;">
                <q-search
                    v-model="searchString"
                    @input="filterBySearch"
                    type="text"
                    id="homeSearch"
                    class="bg-white shadow-1"
                    :placeholder="searchPlaceholder"
                    style="padding: .5rem; margin: 0;"
                    color="grey"
                    :clearable="true"
                />
                <!--<p v-if="userSelectedTags && userSelectedTags.length" style="margin: 0; font-size: .8rem; color: #fff; font-style: italic;">searching filtered products...</p>-->
            </div>
    
        </div>
        
        <div v-if="searchString && searchString.length">
            <div class="row well">
                <h2 class="col-12" align="center" style="margin-top: 1rem;">Results for "{{searchString}}"</h2>
            </div>
            
            <filterResultProductGrid :componentData="{ backgroundColor: componentData.backgroundColor || '#efefef'}" />
        </div>
    
    </div>

</template>

<script>
    import filterResultProductGrid from './filterResultProductGrid'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],
        
        mixins: [globalComputedData],
        
        components: {
            filterResultProductGrid
        },
        
        data() {
            return {
                searchString: '',
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
                return 'background: ' + (this.componentData.backgroundColor || '#efefef') + ';'
            },
            
            searchPlaceholder() {
                return 'Search ' + (this.environmentProducts ? (this.currentView !== 'myLibrary' ? this.forSaleProducts.length : this.userActiveProducts.length) + ' products' : '')
            }
        },
    
        methods: {
            filterBySearch(val) {
                k('filterBySearch: ', val)
                
                this.$store.commit('searchString', val)
                // if (this.currentView === 'showcase') {
                //     this.route('/shop')
                // }
                
                this.api.sendEvent({
                    eventType: "userSearchedContent",
                    eventDesc: "user searched for " + val,
                    searchVal: val,
                    userID: this.userInfo.userID
                })
            },
            
            backToShowcase() {
                this.route('/')
                this.searchString = ''
                this.$store.commit('searchString', '')
            }
        },
    
        mounted() {
            k('componentData search: ', this.componentData)
            
            if (this.$store.state.searchString) this.searchString = this.$store.state.searchString
        }
    }
</script>

<style scoped>
    .q-icon {
        margin: 0 .5rem;
    }
</style>
