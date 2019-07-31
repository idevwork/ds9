<template>
    <div class="row cardStyle animate-fade rounded" align="center" @click="selectItem()">
        <div class="col-12">
            <img class="rounded shadow-1" :src="coverImageURL" style="max-width: 100%;" />
        </div>
            
        <!--<div class="col-12 actions">-->
            <!--<div v-if="owned">-->
            <!--    <q-btn v-if="giftable" class="float-right" flat @click.stop="giftItem()" style="padding: 0 .5rem;">-->
            <!--        <q-icon color="orange" name="fa-gift" />-->
            <!--    </q-btn>-->
            <!--    <q-btn v-if="canBePlayed" class="float-left" flat style="padding: 0 .5rem;">-->
            <!--        <q-icon color="grey-5" :style="playChipStyle" name="fa-play-circle" />-->
            <!--    </q-btn>-->
            <!--    <q-btn v-if="!canBePlayed" size="sm" flat class="float-left" :style="ownedChipStyle">Owned</q-btn>-->
            <!--</div>-->
            
            <!--<div v-if="!owned">-->
            <!--    <q-chip size="sm" class="float-right">-->
            <!--        <span style="color: red; text-decoration: line-through;">{{componentData.productAttributes && componentData.productAttributes.regularPrice ? numeral(componentData.productAttributes.regularPrice).format('$0.00') : ''}}</span>-->
            <!--        {{componentData.productPrice && componentData.productPrice != 0 ? numeral(componentData.productPrice).format('$0.00') : 'FREE'}}-->
            <!--    </q-chip>-->
            <!--</div>-->
        <!--</div>-->

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
        /*background: #8eb4e4;*/
        height: 100%;
        /*padding: .5rem .5rem 3rem .5rem;*/
        /*border: 1px solid #c7c7c7;*/
        cursor: pointer;
    }

    .actions {
        position: absolute;
        bottom: 0;
        padding: 1rem .5rem;
        margin: -.5rem;
        width: 100%;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .q-icon {
        font-size: 1.5rem !important;
    }
    
    .productName {
        font-size: 1rem;
        padding: .5rem;
    }
</style>
