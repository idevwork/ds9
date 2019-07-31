<template>

    <div id="pvolveEquipModal" class="row justify-center">
    
        <div class="col-12 bg-grey-3" align="center" style="padding: 1rem;">
            
            <h1 class="thinHeader" :style="`margin: 1rem 0; color: #545454; letter-spacing: 2px;`">Loved this <span class="thickHeader">workout?</span></h1>
            
            <div style="max-width: 400px;">
                <img style="width: 100%;" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + currentProduct.productSKU + '/' + currentProduct.productSKU + '_500px_cover.png'" />
            </div>
            
            <h5 :style="`color: ${pvolveMintTitle}; margin-top: 1rem;`">{{currentProduct.productName}}</h5>
            
            <!--<div v-html="currentProduct.moreInfo"></div>-->
            
        </div>
            
        <div class="col-12" align="center" style="padding: 1rem;">
            <h4 class="thinHeader">Share the <span class="thickHeader" :style="'color: ' + pvolveMintTitle + ';'">love!</span></h4>
            <a href="mailto:?subject=Check out p.volve on demand!&body=I just finished my p.volve workout! Check out p.volve here: https://pvolve.com" target="_blank">
                <q-btn round flat color="grey">
                    <q-icon name="fa-envelope" color="grey" />
                </q-btn>
            </a>
            <q-btn round flat @click="share2Facebook(currentProduct)" color="grey" style="cursor: pointer;">
                <q-icon name="fab fa-facebook-f" />
            </q-btn>
            <q-btn round flat @click="share2Twitter(currentProduct)" color="grey" style="cursor: pointer;">
                <q-icon name="fab fa-twitter" />
            </q-btn>
        </div>
        
        <div class="col-12 bg-grey-3" style="padding: 2rem;">
            <div class="row well">
                <recommendProductToFriend class="col-12" align="center" :product="currentProduct" />
            </div>
        </div>
    
        <div class="col-12" style="text-align: left; padding: 1rem 2rem;">
            <pvolveMiniShop :equipmentUsed="equipmentUsed" />
        </div>
        
        <div id="commentsDisplay" class="col-12">
            <CommentsDisplay :productID="currentProduct.productID || productID2Preview" :previewMode="!userOwned" :ratingImageSrc="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png'" />
        </div>
    
    </div>

</template>

<script>
    import CommentsDisplay from '../../common/comments/CommentsDisplay.vue'
    import pvolveMiniShop from './pvolveMiniShop'
    import recommendProductToFriend from './recommendProductToFriend.vue'
    
    import { pvolveColors } from './pvolveColors'
    import { social } from '../../../mixins/social'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    
    export default {
        props: ['componentData'],
        
        mixins: [pvolveColors, social, productInfoTools],
    
        data() {
            return {
                truncate(string) {
                    var truncateLength = 100
                    return string.length > truncateLength ? string.substring(0, truncateLength) + '...' : string
                },
            }
        },
    
        components: {
            pvolveMiniShop, CommentsDisplay, recommendProductToFriend
        },
    
        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },
            
            userOwned() {
                return this.currentProduct.userActiveProduct
            },
            
            equipmentUsed() {
                return this.$store.state.equipmentUsed
            }
        },
    
        methods: {
           
        },
    
        mounted() {
            // console.log('componentData: ', this.componentData)

        }
    }
</script>
