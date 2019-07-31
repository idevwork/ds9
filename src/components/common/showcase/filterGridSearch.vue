<template>
    <q-search
        v-model="searchString"
        @input="filterBySearch"
        type="text"
        id="homeSearch"
        class="text-white"
        :placeholder="searchPlaceholder"
        style="padding: .5rem; margin: 0;"
        color="grey"
        :clearable="true"
    />
</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: ['componentData'],

        mixins: [globalComputedData],

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

            showOnlyOwnedAndPlayable() {
                return this.$store.state.showOnlyOwnedAndPlayable
            },

            searchPlaceholder() {
                let productAmount = this.environmentProducts ? (this.currentView !== 'myLibrary' ? this.forSaleProducts.length : this.userActiveProducts.length) : ''
                if (this.showOnlyOwnedAndPlayable) productAmount = this.userActiveProducts.length
                return `Search ${productAmount} products`
            }
        },

        methods: {
            filterBySearch(val) {
                k('filterBySearch: ', val)

                this.$store.commit('searchString', val)
                if (this.currentView === 'showcase' && !this.componentData.haltSearchRouting) {
                    this.route('/shop')
                }

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

    [data-v-7ca6b998] >>> .q-input-target {
        color: #fff !important;
    }
</style>
