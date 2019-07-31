<template>
    <div class="shadow-1 cardStyle row animate-fade" align="center" @click="selectItem()">
        <div class="col-12 relative-position" style="padding-bottom: 2rem;">
            <img :src="coverImageURL" style="max-width: 100%;" />

            <div style="padding: .5rem; word-break: break-word;">
                {{componentData.productName}}
            </div>
            
            <div style="padding: .5rem; word-break: break-word;">
                {{componentData.productBlurb}}
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
                <q-chip size="sm" class="float-right">
                    <span style="color: red; text-decoration: line-through;">{{componentData.productAttributes && componentData.productAttributes.regularPrice ? numeral(componentData.productAttributes.regularPrice).format('$0.00') : ''}}</span>
                    {{componentData.productPrice && componentData.productPrice != 0 ? numeral(componentData.productPrice).format('$0.00') : 'FREE'}}
                </q-chip>
            </div>
        </div>
    </div>
</template>

<script>
    import { productCardTools } from '../../../mixins/productCardTools'

    export default {
        mixins: [ productCardTools ],
        
        computed: {
            coverImageURL() {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + this.componentData.productSKU + '/' + this.componentData.productSKU + '_500px_cover.png'
            },    
        },
        
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
        border: 1px solid #c7c7c7;
        cursor: pointer;
    }

    .actions {
        position: absolute;
        bottom: 0;
        padding: .5rem;
        width: 100%;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .q-icon {
        font-size: 1.5rem !important;
    }
</style>
