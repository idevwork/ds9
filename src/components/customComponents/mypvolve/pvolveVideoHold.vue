<template>

    <div id="pvolveVideoHold" class="row">
        
        <pvolveVideoLayout
            v-if="!isNutritionProduct"
            class="col-12"
            :currentChapter="currentChapter"
            :playerOptions="playerOptions"
            @setVideoID="setVideoID"
            @playChapter="playChapter"
            @nextChapter="nextChapter"

        />

        <pvolveNutritionLayout
            v-else
            class="col-12"
            :currentChapter="currentChapter"
            :playerOptions="playerOptions"
        />

    </div>

</template>

<script>
    import pvolveVideoLayout from './pvolveVideoLayout.vue'
    import pvolveNutritionLayout from './pvolveNutritionLayout.vue'
    import { pvolveProductSectionTools } from './pvolveProductSectionTools'

    export default {
        props: ['currentChapter', 'playerOptions'],

        mixins: [ pvolveProductSectionTools ],

        components: { pvolveVideoLayout, pvolveNutritionLayout},

        data() {
            return {

            }
        },

        computed: {
            isNutritionProduct() {
                const product = this.currentProduct && Object.keys(this.currentProduct).length > 0 ? this.currentProduct : this.productPreviewData
                return product ? product.tags.split(',').includes(this.nutritionProductTagID) : false
            },

            currentProduct() {
                return this.$store.state.currentProduct
            },
            
            productPreviewData() {
                return this.$store.state.productPreviewData
            }
        },

        methods: {
            playChapter(index) {
                this.$parent.playChapter(index)
            },
            
            nextChapter() {
                this.$emit('nextChapter')
            },

            setVideoID(id) {
                this.$parent.setVideoID(id)
            }
        },

        created() {
            k('pvolve video hold created: ', this.isNutritionProduct)
        }

    }
</script>

<style scoped>

</style>
