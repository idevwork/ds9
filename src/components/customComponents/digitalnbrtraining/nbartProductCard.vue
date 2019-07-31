<template>
    <div class="cardStyle shadow-1 animate-fade relative-position" align="center" @click="selectItem()">
        <div class="row" style="padding: .5rem;">
            <div class="col-4">
                <img :src="coverImageURL" style="width: 100%;"/>
            </div>
            
            <div class="col-8">
                <div align="left" style="padding: .5rem; padding-top: 0; word-break: break-word;">
                    <h6 style="margin-top: 0;">{{componentData.productName}}</h6>
                    <p align="left" style="font-size: .8rem; line-height: 1rem; margin-top: .5rem; margin-bottom: 0;">{{componentData.productBlurb}}</p>
                </div>
            </div>
            
            <div class="col-12">
                <div v-if="owned" class="actions" style="width: 100%; padding: 0 .5rem;">
                    <q-btn v-if="giftable" class="float-right" flat @click.stop="giftItem()" style="padding: 0;">
                        <q-icon color="orange" name="fa-gift" />
                    </q-btn>
                    <!--<q-btn v-if="canBePlayed" class="float-left" flat style="padding: 0 .5rem;">-->
                    <!--    <q-icon color="grey-5" :style="playChipStyle" name="fa-play-circle" />-->
                    <!--</q-btn>-->
                    <q-btn size="sm" flat class="float-left" style="background: #0c08b4; color: white; border-radius: .25rem;">View</q-btn>
                </div>
                <div v-if="!owned" class="actions" style="width: 100%; padding: 0 .5rem;">
                    <q-icon style="font-size: 1.5rem; margin: 0;" class="float-right" color="grey" name="fa-info-circle"/>
                    <div class="float-left">
                        <p style="margin-bottom: .5rem;">{{componentData.productPrice && componentData.productPrice != 0 ? numeral(componentData.productPrice).format('$0.00') : 'FREE'}}</p>
                    </div>
                </div>
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
        height: calc(100% - .5rem);
        border: 1px solid #c7c7c7;
        border-radius: .5rem;
        cursor: pointer;
        padding-bottom: 2.5rem;
    }
    
    .actions {
        position: absolute; bottom: 0; left: 0; width: 100%; cursor: pointer;
    }
</style>
