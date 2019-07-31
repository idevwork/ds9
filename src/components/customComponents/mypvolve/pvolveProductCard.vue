<template>

    <div class="relative-position pvolveCard" @click="selectItem()">

        <div class="topLeftHeader">
            <div class="pchip" v-if="productIsNew" :style="'background: ' + pvolveMintTitle + '; padding-right: 1rem; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);'">
                <h6>NEW!</h6>
            </div>
            <div class="pchip" v-if="exclusiveProduct" :style="`margin-top: .25rem; background:${pvolveSalmon}; padding-right: 1rem; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%); -webkit-clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);`">
                <h6 style="margin: 0;">EXCLUSIVE</h6>
            </div>

        </div>

        <div v-if="!isNutritionProduct" class="pvolveCoverImage" :style="cardStyle"></div>

        <img v-if="isNutritionProduct" :src="coverImageURL" class="full-width" />

        <div style="padding: .5rem .25rem 0; color: #524F4C;">
            <h6 class="thickHeader" style="margin: 0; text-transform: none; font-size: 0.8rem;">
                {{componentData.productName}}
                <span :style="`font-size: .7rem; color: ${pvolveSalmon};`">({{moment(componentData.duration * 1000).format('mm:ss')}})</span>
            </h6>

            <div v-if="productTags.length" style="margin-top: .25rem; max-height: 1rem; overflow: hidden; font-size: .7rem; color: #555; width: 100%;">
                <span v-for="(tag, index) in productTags" :key="tag" class="monty allCaps">
                    {{ index !== productTags.length - 1 ? tag + ' | ' : tag }}
                </span>
            </div>

            <div class="row" style="padding-top: .5rem;">
                <div class="col">
                    <div v-if="componentData.avgRating" style="margin-top: .25rem;">
                        <img v-for="(n, index) in averageRating" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png" style="width: .9rem;" :key="index" />
                    </div>
                </div>
                <div v-if="showFavoriting" class="col text-right">
                    <q-btn flat size="sm" @click.stop="toggleFavorite()" style="padding: .25rem 0;">
                        <q-icon class="fa-heart vertical-middle" :class="isFavorite ? 'fas' : 'far'" style="font-size: 1rem;" />
                    </q-btn>
                </div>
            </div>
        </div>

    </div>

</template>

<script>

    import { pvolveColors } from './pvolveColors'
    import { productCardTools } from '../../../mixins/productCardTools'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'

    export default {
        props: ['componentData', 'notSelectable'],

        mixins: [pvolveColors, productCardTools, userAndProductInfo, globalComputedData, pvolveProductSectionTools],

        data() {
            return {
                truncate(string) {
                    var truncateLength = 250
                    return string.length > truncateLength ? string.substring(0, truncateLength) + '...' : string
                },
                excludedTagIDs: ['1031', '2507', '4145', '5156', '5420'],
                addToWorkoutShortcut: false
            }
        },

        computed: {
            authenticated() {
                return this.$store.state.user.authenticated
            },

            cardStyle() {
                return `background: url(${this.coverImageURL});`
            },

            productIsNew() {
                return this.componentData.tags.includes('5521')
            },

            exclusiveProduct() {
                return this.componentData.productType === 'exclusiveContent'
            },

            coverImageURL() {
                return 'https://vault.platformpurple.com/static/previews/' + this.componentData.productSKU + '/' + this.componentData.productSKU + '_500px_cover.png'
            },

            environmentTags() {
                return this.$root.$store.state.environmentTags
            },

            productTags() {
                let productTagReturn = []

                if (this.environmentTags && this.componentData.tags) {
                    var productTagNames = this.componentData.tags.split(',').map((tagID) => {

                        return this.environmentTags[tagID] && !this.excludedTagIDs.includes(tagID) ? this.environmentTags[tagID].tagName : false
                    })

                    productTagReturn = productTagNames.filter(tagName => tagName && !productTagReturn.includes(tagName))
                }

                return productTagReturn
            },

            isFavorite() {
                return this.favoritedProductIDs.includes(this.componentData.productID);
            },

            isNutritionProduct() {
                return this.componentData.tags.split(',').includes(this.nutritionProductTagID)
            },

            mediaFavoritesPreference() {
                return this.userPreferences ? this.userPreferences.find(preference => preference.type === 'mediaFavorites') : null
            },

            favoritedProductIDs() {
                return this.mediaFavoritesPreference && this.mediaFavoritesPreference.favorites ? this.mediaFavoritesPreference.favorites : []
            },

            favoriteProductsPreferenceID() {
                return this.mediaFavoritesPreference && this.mediaFavoritesPreference.id ? this.mediaFavoritesPreference.id : ''
            },

            showFavoriting() {
                return this.authenticated && this.userPreferences && this.userHasAccess([this.componentData.productID])
            },

            averageRating() {
                return Math.round(parseFloat(this.componentData.avgRating))
            }
        },

        methods: {
            selectItem() {
                k('selectItem: ', this.componentData)

                if (this.notSelectable) {
                    return false
                }

                this.$store.commit('setCurrentProduct', this.componentData)

                    if (this.isNutritionProduct && !this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)) {
                        this.$store.commit('setProductID2Preview', this.componentData.productID)
                        this.$root.$emit('openProductPreview', true)
                        return
                    }


                    if (this.owned) {
                        this.$store.commit('setProductLaunchContext', 'productCard')
                        this.route('/play/' + this.componentData.productID)
                    } else {
                        this.$store.commit('setProductID2Preview', this.componentData.productID)
                        this.$root.$emit('openProductPreview', true)
                    }
            },

            giftItem() {
                if (this.notSelectable) {
                    return false
                }

                this.$store.commit('setProductID2Preview', this.componentData.productID)
                this.$root.$emit('openProductPreview', true)
            },

            getNewFavorites() {
                if (this.favoritedProductIDs.includes(this.componentData.productID)) {
                    return this.favoritedProductIDs.filter(productId => productId !== this.componentData.productID);
                }
                return [...this.favoritedProductIDs, this.componentData.productID];
            },

            toggleFavorite() {
                k('toggleFavorite: ', this.mediaFavoritesPreference, this.favoriteProductsPreferenceID)

                const req = {
                    userID: this.$store.state.user.info.userID,
                    userLoginToken: this.$store.state.user.userLoginToken,
                    type: 'mediaFavorites',
                    environment: this.$store.state.environment.name,
                    favorites: this.getNewFavorites(),
                }

                k('saveFavoritesToDB req: ', req)

                this.saveUserPreferenceToAPI(this.favoriteProductsPreferenceID, req, () => {})
            }
        }
    }
</script>

<style scoped>

    .pvolveCard {
        background: #f5f5f5;
        position: relative;
        height: 100%;
        padding: .5rem;
        cursor: pointer;
    }

    .pvolveCoverImage {
        height: 10rem;
        background-size: cover !important;
        background-position: 50% 0% !important;
    }

    .bottomHeader {
        background: rgba(0, 0, 0, .5);
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: inline;
        word-wrap: break-word;
    }

    .bottomLeftHeader {
        width: calc(100% - 3rem);
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        float: left;
    }

    .bottomRightHeader {
        text-align: center;
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        float: right;
    }

    .topLeftHeader {
        text-align: center;
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        position: absolute;
        top: 1rem;
        left: 0;
    }

    .topRightHeader {
        background: rgba(0, 0, 0, .4);
        text-align: right;
        font-size: .9rem;
        color: #fff;
        vertical-align: middle;
        position: absolute;
        top: 0;
        right: 0;
        border-bottom-left-radius: .25rem;
        padding: .25rem;
    }

    .actions {
        position: absolute;
        bottom: 0;
        padding: .5rem;
        width: 100%;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .pchip {
        width: fit-content;
        width: -moz-fit-content;
        color: #fff;
        padding: .25rem .5rem;
        margin: 0;
        border-bottom-right-radius: .2rem;
    }

    .tagchip {
        border: #fff 1px solid;
        color: #000;
        font-size: .6rem;
        margin: .1rem .1rem 0 0;
        padding: .1rem .25rem;
        border-radius: .2rem;
        width: fit-content;
        width: -moz-fit-content;
        display: inline-flex;
        text-transform: uppercase;
    }

    .fa-heart {
        color: #F69477;
        font-size: 21px;
    }

</style>