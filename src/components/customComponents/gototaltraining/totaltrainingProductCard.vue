<template>
    
    <div class="product-card animate-fade row" align="center" @click="selectItem()">
        <div class="col-12">
            <img :src="coverImageURL" style="max-width: 100%; margin: 0 auto; display: block;" />
        </div>
        
        <div class="col-12 product-card__name">
            {{componentData.productName}}
        </div>
        
        <div class="actions">
            <div v-if="owned" align="center" class="col-12">
                <!--<q-btn v-if="giftable" class="float-right" flat @click.stop="giftItem()" style="padding: 0 .5rem;">-->
                <!--    <q-icon color="orange" name="fa-gift" style="font-size: 1.5rem;" />-->
                <!--</q-btn>-->
                <!--<q-btn v-if="canBePlayed" class="float-left" flat style="padding: 0 .5rem;">-->
                <!--    <q-icon color="grey-5" :style="playChipStyle" name="fa-play-circle" />-->
                <!--</q-btn>-->
                <!--<q-btn v-if="!canBePlayed" size="sm" flat class="float-left" :style="ownedChipStyle">Owned</q-btn>-->
                
                <div class="col-sm-12 col-md-4" align="right">
                    <q-icon v-if="codingGenre" name="fa-code" :style="`font-size: 1rem !important; color: ${darkRed};`" />
                    <q-icon v-if="productivityGenre" name="fa-lightbulb" :style="`font-size: 1rem !important; color: ${darkBlue};`" />
                    <q-icon v-if="creativeGenre" name="fa-paint-brush" :style="`font-size: 1rem !important; color: ${darkGreen};`" />
                </div>
                
                <q-btn flat :size="windowWidth > 767 ? 'md' : 'sm'" class="col-12 product-card__btn full-width"  :style="`color: ${lightBlue}; border: 2px solid ${lightBlue};`">
                    <span>{{canBePlayed ? 'Play' : 'Owned'}}</span>
                    <q-icon v-if="canBePlayed" name="fa-play-circle" />
                </q-btn>
            </div>
            
            <div v-if="!owned" class="col-12 row">
                <!--<q-icon class="float-right" color="grey" name="fa-info-circle"/>-->
                <!--<div class="float-right"><p style="margin: 0;"><strong>{{componentData.productPrice && componentData.productPrice != 0 ? numeral(componentData.productPrice).format('$0.00') : 'FREE'}}</strong></p></div>-->
                
                <div class="col-6 product-card__price">
                    <h5 :style="`${windowWidth < 552 ? 'font-size: 1rem;' : ''} font-weight: 900;`">{{componentData.productPrice && componentData.productPrice != 0 ? numeral(componentData.productPrice).format('$0.00') : 'FREE'}}</h5>
                </div>
                            
                <div class="col-6 product-card__price" align="right">
                    <h5 :style="`${windowWidth < 552 ? 'font-size: 1rem;' : ''} color: grey; text-decoration: line-through; font-weight: 900;`">{{onSale ? numeral(componentData.productAttributes.regularPrice).format('$0.00') : ''}}</h5>
                </div>
                
                <div class="col-6">
                    <h6 v-if="onSale" :style="`font-weight: 900; color: ${lightBlue};`">SAVE {{ 100 - ((componentData.productPrice / componentData.productAttributes.regularPrice) * 100).toFixed(0)}}%</h6>
                </div>
                
                <div class="col-6" align="right">
                    <q-icon v-if="codingGenre" name="fa-code" :style="`font-size: 1rem !important; color: ${darkRed};`" />
                    <q-icon v-if="productivityGenre" name="fa-lightbulb" :style="`font-size: 1rem !important; color: ${darkBlue};`" />
                    <q-icon v-if="creativeGenre" name="fa-paint-brush" :style="`font-size: 1rem !important; color: ${darkGreen};`" />
                </div>
                
                <q-btn flat :size="windowWidth > 767 ? 'md' : 'sm'" class="col-12 product-card__btn full-width"  :style="`color: ${lightBlue}; border: 2px solid ${lightBlue};`">
                    <span class="gt-sm">Learn More</span>
                    <q-icon class="lt-md" name="fa-info-circle" />
                </q-btn>
            </div>
        </div>
    </div>
    
</template>

<script>
    import { productCardTools } from '../../../mixins/productCardTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { totaltrainingColors } from './totaltrainingColors'

    export default {
        mixins: [ productCardTools, totaltrainingColors, globalComputedData ],
        
        computed: {
            
            // coverImageURL() {
            //     return `https://f3r6v6t8.ssl.hwcdn.net/static/previews/${this.componentData.productSKU}/${this.componentData.productSKU}_500px_cover.png`
            // },
               
            codingGenre() {
                let productTags = this.componentData.tags.split(',')
                return productTags.includes('2775')
            },
            
            creativeGenre() {
                let productTags = this.componentData.tags.split(',')
                return productTags.includes('1029')
            },
            
            productivityGenre() {
                let productTags = this.componentData.tags.split(',')
                return productTags.includes('1032')
            },
            
        },
        
        mounted() {
            // k('componentData: ', this.componentData)
        }
    }
</script>

<style scoped>
    .product-card {
        display: block;
        position: relative;
        /*background: #fff;*/
        height: 100%;
        cursor: pointer;
        overflow: hidden;
        text-align: left;
        /*padding: .5rem;*/
        padding-bottom: 8rem;
    }
    
    .product-card .product-card__name {
        color: #5c5c5c;
        position: relative;
        font-weight: 600;
        font-size: .9rem;
        margin-top: 0.5rem;
        text-transform: uppercase;
    }
    
    .product-card .product-card__price {
        color: #313131;
        position: relative;
        font-size: 1rem;
        font-weight: 900;
    }
    
    .product-card .product-card__btn {
        position: relative;
        margin-top: 0.5rem;
        font-weight: 700;
        font-size: .8rem;
    }
    
    .actions {
        position: absolute; 
        bottom: 0;
        left: 0;
        /*padding: .5rem; */
        width: 100%; 
        font-size: .8rem;
        cursor: pointer;
    }
    
    /*.q-icon {*/
    /*    font-size: 1.5rem !important;*/
    /*}*/
</style>
