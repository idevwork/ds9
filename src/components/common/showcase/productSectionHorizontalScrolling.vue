<template>
               
    <div>
        
        <div v-if="componentData.heading" class="row" style="padding: 1rem;">
            <h2 class="col-12 dividerHeader" align="center" :style="componentData.headingColor ? 'color: ' + componentData.headingColor + ';' : ''">
                <span :style="'background: ' + (componentData.backgroundColor ? componentData.backgroundColor : '#efefef') + ';'">{{componentData.heading}}</span>
            </h2>
        </div>
        
        <div id="mobileCards" class="relative-position">
            <div 
                class="mobileCard" 
                v-if="displayProducts.length" 
                v-for="(product, index) in displayProducts" 
                :key="index"
                :style="{ padding: `.5rem` }" >
                <div :is="productCardComponent" :componentData="product" />
            </div>
        </div>
        
        <!--<div align="right" style="padding: 0 .5rem;">-->
        <!--    <h6 class="text-grey-5" style="font-size: .8rem; vertical-align: middle;">scroll <q-icon name="fas fa-chevron-right" style="font-size: .7rem; vertical-align: baseline;" /> <q-icon name="fas fa-chevron-right" style="font-size: .7rem; vertical-align: baseline;" /></h6>-->
        <!--</div>-->
    </div>
    
</template>

<script>

    import { productCardLoad } from '../../../mixins/productCardLoad'
    
    export default {
        props: ['componentData'],
        
        mixins: [ productCardLoad ],
        
        components: {

        },
        
        data() {
            return {

            }
        },
        
        computed: {
            
            displayProducts() {
                return this.showOnlyOwnedAndPlayable ? this.ownedAndPlayableProducts : this.componentData.products
            },
                        
            showOnlyOwnedAndPlayable: {
                get() {
                    return this.$store.state.showOnlyOwnedAndPlayable
                },
                
                set(value) {
                    this.$store.commit('showOnlyOwnedAndPlayable', value)
                }
            },
            
            ownedAndPlayableProducts() {
                return this.componentData.products && this.componentData.products.length ? this.componentData.products.filter((product) => {
                    // userActiveProduct
                    // webplayer
                    return product.webplayer && product.userActiveProduct
                }) : []
            },
        },
        
        watch: {

        },
    
        methods: {
            
        },
    
        created() {

        }
    }
</script>

<style scoped>
    
    #mobileCards {
        min-width: 100%;
        min-height: 200px;
        display: flex;
        overflow-x: scroll;
        overflow: -moz-scrollbars-none;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
    }
    
    .mobileCard {
        min-width: 20rem;
        max-width: 20rem;
    }
    
    #mobileCards::-webkit-scrollbar {
        display: none;
    }
</style>
