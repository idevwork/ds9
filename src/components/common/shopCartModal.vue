<template>

    <q-modal
        id="shopCartModal"
        v-model="openModal"
        @show="updateTotals"
        @hide="teardown"
        :content-classes="{'rounded': roundedDesign}"
        :content-css="{minWidth: '70vw', minHeight: '60vh'}"
    >
        <q-modal-layout header-class="no-shadow" footer-class="no-shadow" >
            <q-toolbar slot="header" color="primary" inverted class="q-pa-md">
                <q-toolbar-title style="position: relative;">
                    <q-icon name="fa-shopping-cart" style="font-size: 1.5rem; vertical-align: text-bottom;" />

                    <span style="font-size: 1.5rem;">My Cart</span>

                    <span class="pchip" v-if="cart.length">{{cart.length}}</span>
                </q-toolbar-title>

                <q-btn id="closeCart" @click="toCheckoutOnClose = false; openModal = false" class="float-right" round flat style="padding: .5rem;">
                    <q-icon name="fa-times" style="font-size: 1.5rem;" />
                </q-btn>

            </q-toolbar>

            <div style="margin-top: 1rem;"></div>

            <shopCart modal />

            <q-toolbar slot="footer" color="primary" inverted class="justify-center" style="padding: 0;">
                <div
                    v-if="cartTotal || originalCartTotal > cartTotal"
                    id="cartPrice"
                    :class="originalCartTotal && originalCartTotal > cartTotal ? 'showingOriginalCartTotal': ''"
                    class="q-pa-md full-width"
                    align="right"
                    style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;"
                >
                    <div class="q-headline text-bold text-grey-9" detail :style="`font-size: ${adaptiveFontSize(1.1)}rem; ${windowWidth > 576 ? `margin-right: 10%;` : ``}`">
                        Total:

                        <span id="originalCartTotal" v-if="originalCartTotal && originalCartTotal > cartTotal" style="color: red; text-decoration: line-through; padding-right: .5rem;">
                            {{originalCartTotal && originalCartTotal > cartTotal ? numeral(originalCartTotal).format('$0.00') : ''}}
                        </span>

                        <span>
                            {{cartTotal ? numeral(cartTotal).format('$0.00') : 'FREE'}}
                        </span>
                    </div>
                </div>

                <div class="q-pa-md full-width" align="center">
                    <q-btn :class="{ 'float-left': windowWidth > 552 }" flat @click="toCheckoutOnClose = false; openModal = false" style="margin: .5rem 0;">
                        <q-icon name="fas fa-arrow-left"/>
                        Continue Shopping
                    </q-btn>

                    <q-btn id="toCheckout" v-if="cart.length" :class="{'q-ml-auto': true, 'float-right': windowWidth > 552, 'roundedButton': roundedDesign }" @click="toCheckout()" size="lg" color="orange">
                        <h5 class="thickHeader">PROCEED TO CHECKOUT</h5>
                        <!--<q-icon name="fas fa-arrow-right"/>-->
                    </q-btn>
                </div>
            </q-toolbar>

        </q-modal-layout>
    </q-modal>

</template>

<script>
    import shopCart from './shop/shopCart'
    import { designTools } from '../../mixins/designTools'
    import { globalComputedData } from '../../mixins/globalComputedData'
    import { cartTools } from '../../mixins/cartTools'

    export default {
        components: {
            shopCart
        },

        props: ['componentData'],

        mixins: [designTools, globalComputedData, cartTools],

        data() {
            return {
                openModal: false,
                toCheckoutOnClose: false
            }
        },

        computed: {
            selectedProduct() {
                return this.$store.state.selectedProduct
            },

            footerStyle() {
                return `background: ${this.brandColor} !important; padding: 1rem;`
            }
        },

        methods: {
            teardown() {
                if (this.toCheckoutOnClose) {
                    this.route('/shop/checkout')
                    this.toCheckoutOnClose = false
                }
            },

            toCheckout() {
                this.toCheckoutOnClose = true
                this.openModal = false
            },

            close() {
                this.openModal = false
            },
            
            updateTotals() {
                this.setCartTotal()
                this.setOriginalCartTotal()
            }
        },
        
        watch: {
            cart() {
                this.updateTotals()
            }
        },

        created() {
            this.$root.$on('openShopCart', (val) => {
                k('event hub openShopCart: ', val)
                this.openModal = true
            })

            this.updateTotals()
        },

        beforeDestroy() {

        }
    }
</script>

<style >
    .no-shadow{
        box-shadow: none !important;
    }
</style>

<style scoped>
    .q-toolbar-inverted.text-primary{
        color: black !important;
    }

    .pchip {
        display: inline-flex;
        background: #f26c4f;
        color: white;
        font-size: 1.2rem;
        margin-left: .5rem;
        padding: .1rem 0.6rem;
        border-radius: 50%!important;
        width: fit-content;
        width: -moz-fit-content;
    }

    .q-icon {
        margin: 0 .5rem;
    }
</style>