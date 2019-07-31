<template>

    <div v-if="showBackButton || showSearchFld" :style="homeSearchStyle">
    
        <div class="row well" style="width: 100%;">
    
            <div v-if="showBackButton" :class="showSearchFld ? 'col-3' : 'col-12'" style="padding: 0 1rem 0 .5rem;">
                <q-btn id="backToShowcase" class="full-width" @click="backToShowcase()" :style="brandColor ? 'background: ' + brandColor + '; color: white;' : 'background: #fff;'">
                    <q-icon name="fa-caret-left" style="margin-right: .5rem;" /> 
                    <span>back</span>
                </q-btn> 
            </div>
    
            <div v-if="showSearchFld" :class="showBackButton ? 'col-9' : 'col-12'" style="padding: 0 .5rem;">
                <q-search
                    v-model="searchString"
                    @input="filterBySearch"
                    type="text"
                    id="homeSearch"
                    class="bg-white"
                    :placeholder="searchPlaceholder"
                    style="padding: .5rem; margin: 0;"
                    color="grey"
                    :clearable="true"
                />
            </div>
    
        </div>
    
    </div>

</template>

<script>

    export default {
        props: ['componentData'],
    
        data() {
            return {
                searchString: ''
            }
        },
    
        computed: {
    
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            },
            
            currentView() {
                return this.$store.state.currentView
            },
    
            userSelectedTags() {
                return this.$store.state.userSelectedTags
            },
    
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
    
            userActiveProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.userActiveProduct && product.webplayer
                }) : ''
            },
            
            forSaleProducts() {
                return this.environmentProducts ? this.environmentProducts.filter((product) => {
                    return product.available4Sale
                }) : ''
            },

            showSearchFld() {
                return (this.forSaleProducts.length > 10 && this.currentView !== 'myLibrary') || (this.userActiveProducts.length > 10 && this.currentView === 'myLibrary') ? true : false
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
                if (this.currentView === 'showcase') this.route('/shop')
                this.$store.commit('searchString', val)
            },
            
            backToShowcase() {
                this.searchString = ''
                this.$store.commit('searchString', '')
                this.route('/')
            }
        },
    
        mounted() {
            // console.log('componentData: ', this.componentData)
            
            if (this.$store.state.searchString) this.searchString = this.$store.state.searchString
        }
    }
</script>

<style>
  .q-input-target {
    height: inherit !important;
  }
</style>
