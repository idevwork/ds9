<template>
    
    <div class="relative-position wahCard" @click="selectItem()">
        <!--<div class="topLeftHeader">-->
        <!--    <div class="pchip" v-if="productIsNew" :style="'background: ' + pvolveMintTitle + '; padding-right: 1rem; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);'">-->
        <!--        <h6>NEW!</h6>-->
        <!--    </div>-->
        <!--    <div class="pchip" v-if="exclusiveProduct" :style="`margin-top: .25rem; background:${pvolveSalmon}; padding-right: 1rem; clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%); -webkit-clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 85% 100%);`">-->
        <!--        <h6 style="margin: 0;">EXCLUSIVE</h6>-->
        <!--    </div>-->
            <!--<q-btn @click.stop="" flat size="xs" :style="`border-radius: unset; background: ${pvolveMintTitle}; color: #fff; padding: .25rem;`">-->
            <!--    <q-icon name="fa-calendar" style="font-size: .8rem !important; margin: .25rem .25rem;" />-->
            <!--    <q-icon name="fa-plus" style="font-size: .8rem !important; margin: .25rem .25rem;" />-->
            <!--</q-btn>-->
        <!--</div>-->
        
        <!--<div class="pvolveCoverImage" :style="cardStyle">-->
            
        <!--</div>-->
        <img :src="coverImageURL" style="width: 100%;" />
        
        <!--<q-tooltip v-if="componentData.productBlurb" v-html="truncate(componentData.productBlurb)" anchor="center middle" self="bottom left" max-height="12rem" :style="'font-size: .9rem; overflow: hidden; max-width: 20rem; color: white; ' + 'background: ' + pvolveMintTitle + ';'" />-->
        
        <!--<div class="bottomHeader">-->
            <div style="padding: .5rem .75rem;">
                <h6 class="monty" style="line-height: 1.25rem;">
                    {{componentData.productName}}
                </h6>
                <!--<div style="padding-top: .5rem; font-size: .8rem; color: #777;">A fun and inspiring walk that will give you energy all day long!</div>-->
                <!--<h6 class="monty" style="margin: 1rem 0 0; font-size: .7rem; color: #524F4C;">BEGINNER | 2 MILE | HEART FRIENDLY</h6>-->
                
                <!--<div style="margin-top: .25rem; max-height: 1rem; overflow: hidden; font-size: .7rem; color: #555; width: 100%;">-->
                    <!--<q-icon name="fa-tag" style="font-size: .6rem !important;" />-->
                <!--    <span v-if="productTags" v-for="(tag, index) in productTags" class="monty allCaps">-->
                        <!--<q-icon name="fa-tag" style="font-size: .8rem !important; margin: 0 .5rem 0 0;" />-->
                        <!--{{index > 0 ? ' | ' + tag : tag}}-->
                <!--        {{index !== productTags.length - 1 ? tag + ' | ' : tag}}-->
                <!--    </span>-->
                <!--</div>-->
                
                <!--<div class="row" style="padding-top: .5rem;">-->
                    <!--<div class="col">-->
                    <!--    <div v-if="componentData.avgRating" style="margin-top: .25rem;">-->
                    <!--        <img v-for="n in Math.floor(Number(componentData.avgRating))" src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png" style="width: .9rem;" />-->
                    <!--    </div>-->
                    <!--</div>-->
                    
                <!--</div>-->

            </div>
            
            <div v-if="owned && validProductFilter(componentData)" class="actions">
                <q-btn v-if="showFavoriting" class="float-left" flat size="sm" @click.stop="toggleFavorite()" style="padding: .25rem 0;">
                    <q-icon :name="isFavorite ? 'fas fa-heart' : 'far fa-heart'" class="vertical-middle"  style="font-size: 1rem;" />
                </q-btn>

                <q-btn v-if="giftable" class="float-right" flat size="sm" @click.stop="giftItem()" style="padding: .25rem 0;">
                    <q-icon color="orange" name="fa-gift" style="font-size: 1rem;" />
                </q-btn>
                <!--<q-btn v-if="canBePlayed" class="float-left" flat style="padding: 0 .5rem;">-->
                <!--    <q-icon color="grey-5" :style="playChipStyle" name="fa-play-circle" />-->
                <!--</q-btn>-->
                <!--<q-btn v-if="!canBePlayed" size="sm" flat class="float-left" :style="ownedChipStyle">Owned</q-btn>-->
            </div>
            
            <div v-if="!owned" class="actions">
                <q-chip size="sm" class="float-right">
                    <span style="color: red; text-decoration: line-through;">{{componentData.productAttributes && componentData.productAttributes.regularPrice ? numeral(componentData.productAttributes.regularPrice).format('$0.00') : ''}}</span>
                    {{componentData.productPrice && componentData.productPrice != 0 ? numeral(componentData.productPrice).format('$0.00') : 'FREE'}}
                </q-chip>
            </div>
        <!--</div>-->
    </div>
    
</template>

<script>

    // import { pvolveColors } from './pvolveColors'
    import { productCardTools } from '../../../mixins/productCardTools'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { validProducts } from './walkAtHomeValidProducts'

    export default {
        props: ['componentData', 'notSelectable'],
        
        mixins: [
            // pvolveColors,
            productCardTools,
            userAndProductInfo,
            globalComputedData,
            validProducts
        ],
        
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
                return `https://vault.platformpurple.com/static/previews/${this.componentData.productSKU}/${this.componentData.productSKU}_ws.jpg`
            },
            
            environmentTags() {
                return this.$root.$store.state.environmentTags
            },
            
            productTags() {
                var productTagReturn = null
                if (this.environmentTags && this.componentData.tags) {
                    // k('productTags: ', this.environmentTags, this.componentData.tags)
                    productTagReturn = []
                    var productTagNames = this.componentData.tags.split(',').map((tagID) => {
                        // k('tagObj: ', tagID, this.environmentTags[tagID], !this.excludedTagIDs.includes(tagID))
                        return this.environmentTags[tagID] && !this.excludedTagIDs.includes(tagID) ? this.environmentTags[tagID].tagName : false
                    })
                    productTagNames.forEach((tagName) => {
                        if (tagName && !productTagReturn.includes(tagName)) {
                            productTagReturn.push(tagName)
                        }
                    })
                }
                return productTagReturn
            },

            isFavorite() {
                return this.favoritedProductIDs.includes(this.componentData.productID);
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
                k('showFavoriting: ', this.authenticated, this.userPreferences, this.componentData.productID, this.userHasAccess([this.componentData.productID]))
                return this.authenticated && this.userPreferences && this.userHasAccess([this.componentData.productID]) && this.componentData.webplayer
                
                //TODO: until we hook up favoriting
                // return false
            }
        },
        
        methods: {
            selectItem() {
                k('selectItem: ', this.componentData)

                if (this.notSelectable) return false
                
                this.$store.commit('setCurrentProduct', this.componentData)
                
                // if (this.specialProductRoutes[this.componentData.productID]) {
                //     k('SPECIAL PRODUCT: ', this.specialProductRoutes[this.componentData.productID])
                //     k('access: ', this.componentData.productID, this.userHasAccess([this.componentData.productID]))
                    
                //     if (this.userHasAccess([this.componentData.productID])) {
                //         this.route(this.specialProductRoutes[this.componentData.productID])
                //     } else {
                //         this.$store.commit('setProductID2Preview', this.componentData.productID)
                //         this.$root.$emit('openProductPreview', true)
                //     }
                // } else {
    
                    if (this.owned && this.componentData.webplayer) {
                        this.$store.commit('setProductLaunchContext', 'productCard')
                        this.route('/play/' + this.componentData.productID)
                    } else {
                        this.$store.commit('setProductID2Preview', this.componentData.productID)
                        this.$root.$emit('openProductPreview', true)
                    }
                // }
            },

            giftItem() {
                // k('giftItem: ', this.componentData)
                if (this.notSelectable) return false
                
                // this.route('/shop/' + this.componentData.productID)
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
        },
        
        watch: {
            userPreferences() {
                // k('pvolveProductCard userPreferences watch: ', this.userPreferences)
            },
            
            mediaFavoritesPreference() {
                // k('mediaFavoritesPreference watch: ', this.mediaFavoritesPreference)
            }
        },

        created() {
            // k('componentData: ', this.componentData)
            // k('pvolveProductCard userPreferences: ', this.userPreferences)
            // k('pvolveProductCard mediaFavoritesPreference: ', this.mediaFavoritesPreference)

            if (this.userPreferences) {
                this.addToWorkoutShortcut = this.userPreferences.filter((item) => {
                    return item.type === 'workoutPreferences'
                })[0]
            } else {
                this.getUserPreferences(() => {})
            }
        }
    }
</script>

<style scoped>

    .wahCard {
        /*background-size: cover !important;*/
        /*background-position: 50% !important;*/
        background: #fff;
        position: relative;
        height: 100%;
        padding-bottom: 2.5rem;
        /*padding: .5rem;*/
        /*border: 1px solid #c7c7c7;*/
        border-radius: .2rem;
        overflow: hidden;
        cursor: pointer;
    }
    
    .pvolveCoverImage {
        height: 10rem;
        background-size: cover !important; 
        background-position: 50% !important;
    }
    
    .bottomHeader {
        background: rgba(0, 0, 0, .5);
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        /*padding: .5rem;*/
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
        /*background: rgba(0, 0, 0, .4);*/
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
        position: absolute; bottom: 0; padding: .5rem; width: 100%; font-size: 1.5rem; cursor: pointer;
    }
    
    .q-icon {
        /*font-size: 1.5rem !important;*/
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
        /*background: rgba(0, 0, 0, 0.4);*/
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
        color: rgb(220, 35, 56);
        font-size: 21px;
    }

</style>