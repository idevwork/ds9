<template>
    <div class="cardStyle animate-fade" align="center" @click="selectItem()">
        <img :src="coverImageURL" style="max-width: 100%; border-top-left-radius: .5rem; border-top-right-radius: .5rem;" @click="selectItem()"/>
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
            <p style="font-size: .9rem; margin: 0;">
                <!--<span style="color: red; text-decoration: line-through;">{{componentData.productAttributes && componentData.productAttributes.regularPrice ? numeral(componentData.productAttributes.regularPrice).format('$0.00') : ''}}</span>-->
                {{componentData.productPrice && componentData.productPrice != 0 ? numeral(componentData.productPrice).format('$0.00') : 'FREE'}}
            </p>
        </div>
    </div>
</template>

<script>
    import { productCardTools } from '../../../mixins/productCardTools'

    export default {
        mixins: [ productCardTools ],
        
        computed: {
            // coverImageURL() {
            //     return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.componentData.productSKU + '/' + this.componentData.productSKU + '_500px_cover.png'
            // },
        },
        
        mounted() {
            // k('componentData: ', this.componentData)
        }
    }
</script>

<style scoped>
    .cardStyle {
        position: relative;
        /*background: #fff;*/
        height: 100%;
        padding-bottom: 3rem;
        /*border: 1px solid #c7c7c7;*/
        /*border-radius: .5rem;*/
        cursor: pointer;
    }

    .actions {
        position: absolute; bottom: 0; padding: .5rem; width: 100%; font-size: 1.5rem; cursor: pointer;
    }
</style>
