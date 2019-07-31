<template>

    <div v-if="tagHeadingsObj4Scope && Object.keys(tagHeadingsObj4Scope).length">

        <q-card class="row bg-white no-shadow" style="margin: 0;">

            <q-card-main class="col-12 monty" align="center">
                <q-option-group
                    v-if="tagHeadingsObj4Scope && tagHeadingsObj4Scope['topic']"
                    color="secondary"
                    type="checkbox"
                    inline
                    v-model="selectedTopicOptions"
                    @input="multipleSelectTag"
                    :options="multipleSelectOptionsFromTagHeading('topic')"
                    style="font-size: 16px;"
                    :class="windowWidth < 768 ? 'small-left' : 'large-center'"
                />
            </q-card-main>

            <q-card-main v-if="userSelectedTags.length" align="center" class="col-12" style="padding: .5rem;">
                <q-btn size="sm" class="bg-grey-2" flat @click="clearFilters()">
                    Clear Filters
                </q-btn>
            </q-card-main>

            <q-card-main v-if="showFilterFavoriteButton || showFilterExclusiveContentButton" class="col-12" :align="windowWidth < 768 ? 'left' : 'center'" style="padding: .5rem;">
                <q-btn v-if="showFilterFavoriteButton" outline @click="sortLibrary('favorites')" style="background: #fff !important; color: #333; margin: .25rem;">
                    <q-icon :name="showFavoritesOnly ? 'fas fa-check-circle' : 'far fa-circle'" :style="`color: ${pvolveMintTitle}; font-size: 1rem; margin-left: 0;`" />
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">
                        Favorites
                    </h6>
                </q-btn>

                <q-btn v-if="showFilterExclusiveContentButton" outline @click="sortLibrary('exclusiveContent')" style="background: #fff !important; color: #333; margin: .25rem;">
                    <q-icon :name="showExclusiveContentOnly ? 'fas fa-check-circle' : 'far fa-circle'" :style="`color: ${pvolveMintTitle}; font-size: 1rem; margin-left: 0;`" />
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">
                        Exclusive Content
                    </h6>
                </q-btn>
            </q-card-main>

        </q-card>


    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { pvolveLibrarySortTools } from './pvolveLibrarySortTools'
    import { designTools } from '../../../mixins/designTools'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'

    export default {

        props: ['productScope', 'tagHeadingsObj4Scope'],

        mixins: [pvolveColors, designTools, pvolveLibrarySortTools, pvolveProductSectionTools],

        data() {
            return {

                multipleSelectOptionsFromTagHeading(headingName) {
                    return Object.keys(this.tagHeadingsObj4Scope[headingName].tags)
                    .map((tagKey) => {
                        let tag = this.tagHeadingsObj4Scope[headingName].tags[tagKey]
                        return {
                            label: tag.tagName,
                            value: tag.id
                        }
                    })
                },

                selectedTopicOptions: []
            }
        },

        computed: {

            windowWidth() {
                return this.$store.state.windowWidth
            },

            userSelectedTags() {
                return this.$store.state.userSelectedTags
            },

            environmentTags() {
                return this.$store.state.environmentTags
            },

            showFilterFavoriteButton() {
                const favoritedProductsToScope = this.favoritedProductIDs && this.favoritedProductIDs.length
                    ? this.productScope.filter(product => this.favoritedProductIDs.includes(product.productID) && product.tags.split(',').includes(this.nutritionProductTagID))
                    : []

                return this.favoritedProductIDs && this.favoritedProductIDs.length && favoritedProductsToScope.length
            },

            showFilterExclusiveContentButton() {
                let productScopeIDs = this.exclusiveProducts.map(product => product.productID)
                let exclusiveProductsToScope = productScopeIDs.length
                    ? this.productScope.filter(product => productScopeIDs.includes(product.productID))
                    : []

                return this.exclusiveProducts && this.exclusiveProducts.length && exclusiveProductsToScope.length
            }
            
        },

        methods: {
            multipleSelectTag(event) {
                k('multipleSelectTag: ', event)

                k('selectedTopicOptions: ', this.selectedTopicOptions)

                var allSelectedTags = this.selectedTopicOptions
                    allSelectedTags = allSelectedTags.join(',')

                k('allSelectedTags: ', allSelectedTags)
                this.$store.commit('setUserSelectedTags', allSelectedTags)
            },

            preselectTags() {
                // select these tags
                this.userSelectedTags.forEach((tagID) => {
                    let tag = this.environmentTags[tagID]
                    k('tag: ', tag)

                    switch (tag.tagHeadingName) {
                        case 'topic':
                            this.selectedTopicOptions.push(Number(tagID))
                            break;

                        default:
                            k('tag selected that does not match: ', Number(tagID), tag)
                    }
                })
            },

            clearFilters() {
                this.$store.commit('setUserSelectedTags', '')
                this.selectedTopicOptions = []
            }
        },

        created() {
            if (this.userSelectedTags) {
                this.preselectTags()
            }

            this.$root.$on('clearPvolveFilters', this.clearFilters)
        }
    }
</script>

<style scoped>
    .q-collapsible-sub-item {
      padding: 0;
    }

    .pvolveFilterButton {
        border: 2px solid #efefef;
        margin: 5px;
        cursor: pointer;
        height: calc(100% - .5rem);
    }

    [data-v-6e99f642] >>> .small-left.q-option-group-inline-opts > div {
        margin: 5px 40px !important;
        display: flex !important;
    }
    
    [data-v-6e99f642] >>> .large-center.q-option-group-inline-opts > div {
        margin: 5px 40px !important;
    }
</style>
