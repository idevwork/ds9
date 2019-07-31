<template>
    <div class="product-carousel">
        <q-carousel
            key="carousel"
            v-model="slideIndex"
            arrows
            :color="carouselColor"
            :no-swipe="$q.platform.is.desktop"
            :quick-nav="slidePages > 1 && windowWidth > 767"
        >
            <q-carousel-slide
                :key="'carousel_' + indexFather"
                v-for="(item, indexFather) in slidePages"
                style="padding: 0 2rem 2rem 2rem;"
            >
                <div class="row justify-center">
                    <div
                        class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2"
                        v-for="(item, index) in dataSliced(indexFather)"
                        :key="index"
                        style="padding: .5rem;"
                    >
                        <div :is="component" :componentData="item" />
                    </div>
                </div>
            </q-carousel-slide>
        </q-carousel>
    </div>
</template>

<script>

    import productCard from '../productCard/productCard'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        props: {
            totalItems: null,
            productsToDisplay: {default: () => [], type: Array},
            component: {default: null, type: String, required: true},
            single: {default: false, type: Boolean},
            carouselColor: {default: 'grey-8', type: String}
        },

        mixins: [globalComputedData],

        components: {
            productCard
        },

        data() {
            return {
                breakpoints: [
                    { width: 320, perSlide: 2 },
                    { width: 576, perSlide: 3 },
                    { width: 768, perSlide: 4 },
                    { width: 992, perSlide: 6 }
                    // { width: 1024, perSlide: 6 }
                ],
                slideIndex: 0
            }
        },

        computed: {
            dataPerSlide () {
                if (this.single) return

                var perSlide = 1

                this.breakpoints.forEach(item => {
                    if (this.$store.state.windowWidth >= item.width) {
                        perSlide = item.perSlide
                    }
                })
                return perSlide
            },

            slidePages () {
                let ret

                if (this.totalItems) {
                    ret = Math.ceil(this.totalItems / this.dataPerSlide)
                } else {
                    ret = Math.ceil(this.productsToDisplay.length / this.dataPerSlide)
                }

                return ret
            }
        },

        methods: {
            dataSliced (index) {
                var from = this.calculateSlice(index, this.dataPerSlide)
                var to = this.calculateSlice(index, this.dataPerSlide) + this.dataPerSlide
                return this.productsToDisplay.slice(from, to)
            },

            calculateSlice (index, dataPerSlide) {
                if(!index) return 0

                return index * dataPerSlide
            }
        }
    }
</script>

<style >
.product-carousel .q-carousel-left-arrow, .q-carousel-right-arrow{
    top: calc(50% - 20px);
}
</style>
