<template>

    <q-modal
        :content-classes="{'rounded': roundedDesign}"
        v-model="openModal"
        :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        @show="showProductPreview = true"
        @hide="$root.$emit('closedProductPreview'), showProductPreview = false"
    >
        <q-modal-layout id="previewContainer" >

            <q-toolbar slot="header" color="grey" :style="toolbarStyle">

                <q-toolbar-title>
                    <!--<h6 v-if="!isPWYWProduct" style="padding: .25rem 0;">-->
                    <h6 style="padding: .25rem 0;">
                        {{productPreviewData.productName}}
                    </h6>
                </q-toolbar-title>

                <!--<q-btn color="grey-5" style="padding: 0 0 0 .5rem;" v-if="showAddToCartInHeader">-->
                <!--    <h6>-->
                <!--        <span style="color: red; text-decoration: line-through;">{{productPreviewData.productAttributes && productPreviewData.productAttributes.regularPrice ? numeral(productPreviewData.productAttributes.regularPrice).format('$0.00') : ''}}</span>-->
                <!--        {{productPreviewData.productPrice && productPreviewData.productPrice != 0 ? numeral(productPreviewData.productPrice).format('$0.00') : 'FREE'}}-->
                <!--    </h6>-->
                    <!--<q-btn @click="add2cart" id="add2cart" color="green" style="margin-left: .5rem;">-->
                    <!--    <q-icon name="fa-cart-plus" style="margin-right: .5rem;" />-->
                    <!--    <h6 class="gt-md">Add To Cart</h6>-->
                    <!--</q-btn>-->
                <!--</q-btn>-->

                <q-btn id="closePreviewModal" flat icon="fa-times" @click="openModal = false" style="padding: .5rem;" />

            </q-toolbar>

            <productPreviewHold v-if="showProductPreview" />
            <!--<defaultProductPreview />-->

        </q-modal-layout>
    </q-modal>

</template>

<script>
    import productPreviewHold from './showcase/productPreviewHold'
    import { globalComputedData } from '../../mixins/globalComputedData'

    export default {

        components: {
            productPreviewHold
        },

        mixins: [globalComputedData],

        data() {
            return {
                openModal: false,
                showProductPreview: false
            }
        },

        computed: {
            roundedDesign() {
                return this.environment.json.e.noRoundedDesign ? false : true
            },

            toolbarStyle() {
                return this.brandColor ? 'background: ' + this.brandColor + ' !important ;' : ''
            }
        },

        methods: {

        },

        created() {
            this.$root.$on('openProductPreview', (val) => {
                // k('event hub openProductPreview: ', val)
                this.$store.commit('productPreviewModalOpen', true)
                this.openModal = true
                document.querySelector('#previewContainer > .scroll').scrollTop = 0
            })

            this.$root.$on('closeProductPreview', (val) => {
                // k('event hub closeProductPreview: ', val)
                this.$store.commit('productPreviewModalOpen', false)
                this.openModal = false
            })

        },

        beforeDestroy() {

        }
    }
</script>

<style>

</style>