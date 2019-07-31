<template>
    <div @click="selectItem()" class="shadow-1 cardStyle animate-fade" align="center">
        <img :src="coverImageURL" style="max-width: 100%;" />
        <div style="padding: .5rem; word-break: break-word;">
            {{componentData.productName}}
        </div>
        <div v-if="owned" class="actions">
            <q-btn v-if="giftable" class="float-right" flat @click.stop="giftItem()" style="padding: 0 .5rem;">
                <q-icon color="orange" name="fa-gift" />
            </q-btn>
            <q-btn v-if="canBePlayed" class="float-left" flat style="padding: 0 .5rem;">
                <q-icon color="grey-5" :style="playChipStyle" name="fa-play-circle" />
            </q-btn>
            <q-btn v-if="!canBePlayed" size="sm" flat class="float-left" :style="ownedChipStyle">Owned</q-btn>
        </div>
        <div v-if="!owned" class="actions">
            <q-btn v-if="inCart" @click.stop="$root.$emit('openShopCart')" size="sm" flat color="green" class="float-left" style="padding: .25rem;">
                <q-icon name="fa-shopping-cart" />
            </q-btn>
            
            <!--When activating PWYW, apply this v-if to the q-chip-->
            <!--v-if="!componentData.pwyw_active"-->
            <q-chip v-if="!componentData.pwyw_active" size="sm" class="float-right">
                <span style="color: red; text-decoration: line-through;">{{componentData.productAttributes && componentData.productAttributes.regularPrice ? numeral(componentData.productAttributes.regularPrice).format('$0.00') : ''}}</span>
                {{componentData.productPrice && componentData.productPrice != 0 ? numeral(componentData.productPrice).format('$0.00') : 'FREE'}}
            </q-chip>
            
            <div class="pwywchip" v-if="componentData.pwyw_active">
                Pay What You Want
            </div>
        </div>
    </div>
    
</template>

<script>
    import { productCardTools } from '../../../mixins/productCardTools'

    export default {
        mixins: [ productCardTools ],
        mounted() {
            // k('componentData: ', this.componentData)
        }
    }
</script>

<style scoped>
    .cardStyle {
        position: relative;
        background: #fff;
        height: 100%;
        padding-bottom: 3rem;
        border: 1px solid #c7c7c7;
        cursor: pointer;
        overflow: hidden;
        border-radius: .25rem !important;
        max-width: 200px;
        margin: 0 auto;
    }

    .actions {
        position: absolute; bottom: 0; padding: .5rem; width: 100%; font-size: 1.5rem; cursor: pointer;
    }
    
    .pwywchip {
        background: #ff9800 !important;
        color: #fff;
        font-size: .8rem; 
        /*margin: .25rem 0;*/
        padding: .25rem .5rem;
        border-radius: .2rem;
        width: fit-content;
        width: -moz-fit-content;
        float: right;
    }
    
    /*.q-icon {*/
    /*    font-size: 1.5rem !important;*/
    /*}*/
</style>
