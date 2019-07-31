<template>

    <div>

        <div class="row well" style="width: 100%;">

            <div class="col-12">

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

            </div>

        </div>

    </div>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'

    export default {
        props: ['componentData'],

        mixins: [globalComputedData, userAndProductInfo, pvolveProductSectionTools],

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
                const forSaleProducts = (this.forSaleProducts.length > this.productLengthLimit && this.currentView !== 'myLibrary')
                const userActiveProducts = (this.userActiveProducts.length > this.productLengthLimit && this.currentView === 'myLibrary') ? true : false
                return forSaleProducts || userActiveProducts
            },

            showBackButton() {
                return this.currentView !== 'showcase'
            },

            searchPlaceholder() {
                let placeHolderStr = ''
                
                if (this.currentView === 'nutrition') {
                    placeHolderStr = `Search ${ this.nutritionProducts.length ? this.nutritionProducts.length : '' } recipes`
                } else {
                    placeHolderStr = `Search ${ this.authenticated && this.userIsSubscribed ? this.userActiveProducts.length : this.workoutProducts.length } products`
                }

                return placeHolderStr
            },

            userIsSubscribed() {
                return this.userHasAccess(this.validSubscriptionProductIDs)
            },

            validSubscriptionProductIDs() {
                return this.environmentJSON.validSubscriptionProductIDs ? this.environmentJSON.validSubscriptionProductIDs : ''
            }
        },

        methods: {
            filterBySearch(val) {
                k('filterBySearch: ', val)

                this.$store.commit('searchString', val)

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
