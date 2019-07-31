<template>

    <q-btn v-if="showFavoriting" flat size="sm" @click.stop="toggleFavorite()">
        <q-icon class="fa-heart vertical-middle" :class="isFavorite ? 'fas' : 'far'" color="red" style="font-size: 1rem;" /> 
        {{buttonTitle}}
    </q-btn>
             
</template>

<script>
    
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    
    export default {
        props: ['productData', 'buttonTitle'],
        
        mixins: [ globalComputedData, userAndProductInfo ],
        
        computed: {
            isFavorite() {
                return this.favoritedProductIDs.includes(this.productData.productID);
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
                // k('showFavoriting: ', this.authenticated, this.userPreferences, this.productData.productID, this.userHasAccess([this.productData.productID]))
                return this.authenticated && this.userPreferences && this.userHasAccess([this.productData.productID])
            }
        },
        
        methods: {
            getNewFavorites() {
                if (this.favoritedProductIDs.includes(this.productData.productID)) {
                    return this.favoritedProductIDs.filter(productId => productId !== this.productData.productID);
                } 
                return [...this.favoritedProductIDs, this.productData.productID];
            },
            
            toggleFavorite() {
                k('toggleFavorite: ', this.mediaFavoritesPreference, this.favoriteProductsPreferenceID)
                
                const req = {
                    userID: this.userInfo.userID,
                    userLoginToken: this.userLoginToken,
                    type: 'mediaFavorites',
                    environment: this.environmentName,
                    favorites: this.getNewFavorites(),
                }
                
                k('saveFavoritesToDB req: ', req)

                this.saveUserPreferenceToAPI(this.favoriteProductsPreferenceID, req, () => {})
            }
        }
    }
</script>
<style>
    
</style>