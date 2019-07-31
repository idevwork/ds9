<template>

    <div v-if="tagHeadingsObj4Scope && Object.keys(tagHeadingsObj4Scope).length">

        <q-card :class="['row', 'bg-white', 'no-shadow', windowWidth > 1200 ? 'justify-center' : '']">

            <q-card-main class="col-sm-6 col-md-4 col-lg-2">
                <h5>Types</h5>
                <q-option-group
                    v-if="tagHeadingsObj4Scope && tagHeadingsObj4Scope['type']"
                    color="secondary"
                    type="checkbox"
                    v-model="selectedTypeOptions"
                    @input="multipleSelectTag"
                    :options="multipleSelectOptionsFromTagHeading('type')"
                    style="font-size: 16px;"
                    class="capitalize"
                />
            </q-card-main>

            <q-card-main class="col-sm-6 col-md-4 col-lg-2">
                <h5>Length</h5>
                <q-option-group
                    v-if="tagHeadingsObj4Scope && tagHeadingsObj4Scope['duration']"
                    color="secondary"
                    type="checkbox"
                    v-model="selectedLengthOptions"
                    @input="multipleSelectTag"
                    :options="multipleSelectOptionsFromTagHeading('duration', true)"
                    style="font-size: 16px;"
                    class="text-left"
                />
            </q-card-main>

            <q-card-main class="col-sm-6 col-md-4 col-lg-2">
                <h5>Body Focus</h5>
                <q-option-group
                    v-if="tagHeadingsObj4Scope && tagHeadingsObj4Scope['body focus']"
                    color="secondary"
                    type="checkbox"
                    v-model="selectedBodyFocusOptions"
                    @input="multipleSelectTag"
                    :options="multipleSelectOptionsFromTagHeading('body focus')"
                    style="font-size: 16px;"
                    class="text-left"
                />
            </q-card-main>

            <q-card-main class="col-sm-6 col-md-4 col-lg-3">
                <h5>Equipment Used</h5>
                <q-option-group
                    v-if="tagHeadingsObj4Scope && tagHeadingsObj4Scope['equipment']"
                    color="secondary"
                    type="checkbox"
                    v-model="selectedEquipmentOptions"
                    @input="multipleSelectTag"
                    :options="multipleSelectOptionsFromTagHeading('equipment')"
                    style="font-size: 16px;"
                    class="text-left"
                />
                
            </q-card-main>

            <q-card-main class="col-sm-6 col-md-4 col-lg-3">
                <h5>View By</h5>
                <div class="row">
                    <div class="col-12" align="left" style="margin: 3.5px;">
                        <q-checkbox
                            v-if="showFilterFavoriteButton"
                            :value="showFavoritesOnly"
                            @input="sortLibrary('favorites')"
                            label="Favorites"
                            color="secondary"
                            style="font-size: 16px;"
                        />
                    </div>

                    <div class="col-12" align="left" style="margin: 3.5px;">
                        <q-checkbox
                            v-if="showFilterExclusiveContentButton"
                            :value="showExclusiveContentOnly"
                            @input="sortLibrary('exclusiveContent')"
                            label="Exclusive Content"
                            color="secondary"
                            style="font-size: 16px;"
                        />
                    </div>

                    <div class="col-12" align="left" style="margin: 3.5px;">
                        <q-checkbox
                            label="Top Rated"
                            :value="sortLibraryTopRated"
                            @input="sortLibrary('topRated')"
                            color="secondary"
                            style="font-size: 16px;"
                        />
                    </div>

                    <div class="col-12" align="left" style="margin: 3.5px;">
                        <q-checkbox
                            :value="sortLibraryMostRecent"
                            @input="sortLibrary('mostRecent')"
                            label="Most Recent"
                            color="secondary"
                            style="font-size: 16px;"
                        />
                    </div>

                    <div class="col-12" align="left" style="margin: 3.5px;">
                        <q-checkbox
                            :value="sortLibraryWorkoutLength"
                            @input="sortLibrary('workoutLength')"
                            label="Workout Length"
                            color="secondary"
                            style="font-size: 16px;"
                        />
                    </div>
                </div>
            </q-card-main>

            <q-card-main v-if="userSelectedTags.length" align="center" class="col-12" style="padding: .5rem;">
                <q-btn size="sm" class="bg-grey-2" flat @click="clearFilters()">
                    Clear Filters
                </q-btn>
            </q-card-main>

        </q-card>

    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { pvolveLibrarySortTools } from './pvolveLibrarySortTools'
    import { designTools } from '../../../mixins/designTools'

    const TYPES_TO_REMOVE = [
        "new"
    ]

    export default {

        props: ['productScope', 'tagHeadingsObj4Scope'],

        mixins: [pvolveColors, designTools, pvolveLibrarySortTools],

        data() {
            return {

                multipleSelectOptionsFromTagHeading(headingName, sort = false) {

                    let options = Object.keys(this.tagHeadingsObj4Scope[headingName].tags)
                    .filter(tagKey => !TYPES_TO_REMOVE.includes(tagKey))

                    // Sort tags by ID ascendingly
                    if (sort) {
                        options = options.sort((a,b) => {
                            let firstTag = this.tagHeadingsObj4Scope[headingName].tags[a]
                            let secondTag = this.tagHeadingsObj4Scope[headingName].tags[b]

                            return firstTag.id - secondTag.id
                        })
                    }

                    options = options.map(tagKey => {
                        let tag = this.tagHeadingsObj4Scope[headingName].tags[tagKey]

                        return {
                            label: tag.tagName,
                            value: tag.id
                        }
                    })

                    return options
                },

                selectedTypeOptions: [],
                selectedLengthOptions: [],
                selectedBodyFocusOptions: [],
                selectedEquipmentOptions: [],

                sortByFavorites: false,
                sortByExclusiveContent: false,
                sortByTopRated: false,
                sortByMostRecent: false,
                sortByWorkoutLength: false
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
                    ? this.productScope.filter(product => this.favoritedProductIDs.includes(product.productID))
                    : []

                return this.favoritedProductIDs && this.favoritedProductIDs.length && favoritedProductsToScope.length
            },

            showFilterExclusiveContentButton() {
                let productScopeIDs = this.exclusiveProducts.map(product => product.productID)
                let exclusiveProductsToScope = productScopeIDs.length
                    ? this.productScope.filter(product => productScopeIDs.includes(product.productID))
                    : []

                return this.exclusiveProducts && this.exclusiveProducts.length && exclusiveProductsToScope.length
            },

            centerAlignedHeader() {
                return this.windowWidth < 768 ? 'text-center': ''
            }
        },

        methods: {
            multipleSelectTag(event) {
                k('multipleSelectTag: ', event)
                
                var selectedTypeOptions = this.selectedTypeOptions
                var selectedLengthOptions = this.selectedLengthOptions
                var selectedBodyFocusOptions = this.selectedBodyFocusOptions
                var selectedEquipmentOptions = this.selectedEquipmentOptions

                k('selectedTypeOptions: ', selectedTypeOptions)
                k('selectedLengthOptions: ', selectedLengthOptions)
                k('selectedBodyFocusOptions: ', selectedBodyFocusOptions)
                k('selectedEquipmentOptions: ', selectedEquipmentOptions)

                var allSelectedTags = selectedTypeOptions
                                        .concat(selectedLengthOptions)
                                        .concat(selectedBodyFocusOptions)
                                        .concat(selectedEquipmentOptions)

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
                        case 'body focus':
                            this.selectedBodyFocusOptions.push(Number(tagID))
                            break;

                        case 'equipment':
                            this.selectedEquipmentOptions.push(Number(tagID))
                            break;

                        case 'type':
                            this.selectedTypeOptions.push(Number(tagID))
                            break;
                            
                        case 'duration':
                            this.selectedLengthOptions.push(Number(tagID))
                            break;

                        default:
                            k('tag selected that does not match: ', Number(tagID), tag)
                    }
                })
            },

            clearFilters() {
                this.$store.commit('setUserSelectedTags', '')
                this.selectedTypeOptions = []
                this.selectedLengthOptions = []
                this.selectedBodyFocusOptions = []
                this.selectedEquipmentOptions = []
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

</style>
