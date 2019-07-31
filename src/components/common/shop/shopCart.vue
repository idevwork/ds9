<template>
    <div id="cart" class="relative-position" style="overflow: auto; max-height: calc(100% - 1rem);">
        <div
            v-if="cart && cart.length"
            v-for="(product, index) in cart"
            :key="product.productName"
            class="shopCartProduct"
        >
            <div class="row full-width justify-center relative-position">

                <div @click="openPreview(product)" class="col-xs-12 col-sm-2 col-md-2" :align="windowWidth > 575 ? 'center' : 'left'" :style="windowWidth > 575 ? 'padding: 0 .5rem;' : ''">
                    <img :class="roundedDesign ? 'rounded' : ''" :src="coverImageUrl(product)" style="max-width: 100%; max-height: 10rem;" />
                </div>

                <div class="col-xs-9 col-sm-7 col-md-7 col-lg-7" style="padding: 0 .25rem;">
                    <h5 :style="`font-size: ${adaptiveFontSize(.8)}rem; margin: 0; line-height: 1.5rem;`">{{product.productName}}</h5>
                    <p style="font-size: .8rem;" v-html="product.byLine" />

                    <div class="pwywchip" v-if="product.pwyw_active">
                        Pay What You Want
                    </div>

                    <div class="gift" @click="editGiftBox(product.recipientName)" v-if="product.recipientName">
                        <q-btn size="sm" color="orange" style="padding: .1rem .5rem;">
                            <q-icon name="fa-pencil-alt" style="margin-right: .5rem;" />

                            <q-icon name="fa-gift" style="margin-right: .5rem;" />

                            <strong>{{product.recipientName}}</strong>
                        </q-btn>
                    </div>
                </div>

                <div class="col-xs-3 col-sm-2 q-pa-sm" align="center">
                    <h6 class="" :style="`font-size: ${adaptiveFontSize(.9)}rem;`">
                        <span :style="product.discountedPrice || product.discountedPrice === 0 ? 'color: red; text-decoration: line-through;' : ''">{{numeral(displayPrice(product)).format('$0.00')}}</span>

                        <span v-if="product.discountedPrice || product.discountedPrice === 0">{{numeral(product.discountedPrice).format('$0.00')}}</span>
                    </h6>

                    <q-btn round size="md" flat @click="removeFromCart(product)" class="lt-sm removeFromCart" icon="far fa-trash-alt" color="grey-7"></q-btn>
                </div>

                <div class="gt-xs col-sm-1" style="text-align: right;">
                    <q-btn round size="md" flat @click="removeFromCart(product)" class="removeFromCart" icon="far fa-trash-alt" color="grey-7"></q-btn>
                </div>

                <div v-if="product.interval" class="col-12" align="right" style="padding: 0 1rem;">
                    <p style="font-size: .8rem; margin: 0;">will renew on {{intervalTimePeriod(product)}} for {{numeral(displayPrice(product)).format('$0.00')}}</p>
                </div>
            </div>
        </div>

        <div class="shopCartProduct" v-if="cart && !cart.length">
            <h4 class="text-center">
                Your cart is empty.
            </h4>
        </div>

    </div>
</template>

<script>
    import { designTools } from '../../../mixins/designTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {

        props: {
            'componentData': null,
            modal: {type: Boolean}
        },

        mixins: [ designTools, globalComputedData ],

        data() {
            return {
                selected: '1',
                selectOptions: [
                    { label: '1', value: '1' },
                    { label: '2', value: '2' }
                ],

                coverImageUrl(product) {
                    return 'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + product.productSKU + '/' + product.productSKU + '_image_cover.png'
                },

                displayPrice(product) {
                    return product.pwywPrice ? product.pwywPrice : product.productPrice
                },

                intervalTimePeriod(product) {
                    var interval = product.interval ? product.interval : ''

                    if (product.itemIsDiscounted && product.discountedPrice === '0.00') {
                        interval = product.freeSubscriptionInterval || product.freeInterval || product.interval
                    }

                    if (interval) {
                        let intervalNumber = interval.split(' ')[0]
                        let intervalPeriod = interval.split(' ')[1]

                        return this.moment().add(intervalNumber, intervalPeriod).format('MM/DD/YYYY')
                    } else {
                        return false
                    }
                }
            }
        },

        computed: {
            selectedProduct() {
                return this.$store.state.selectedProduct
            },

            toolbarStyle() {
                return 'background: ' + this.brandColor + ' !important ;'
            },

            giftBoxes() {
                return this.$store.state.giftBoxes
            }
        },

        methods: {
            openPreview(product) {
                // k('openPreview: ', product)
                // this.$store.commit('setProductID2Preview', product.productID)
                // this.$root.$emit('openProductPreview', true)
            },

            removeFromCart(product) {
                this.$store.commit('removeFromCart', product)

                if (product.recipientName) {
                    k('this is a gift, check giftbox: ', product.recipientName, this.giftBoxes)

                    // check cart for other gift box items for this recipientName
                    var recipientNameCartItems = this.cart.filter((item) => {
                        return item.recipientName && item.recipientName === product.recipientName
                    })

                    // if none then remove box
                    if (!recipientNameCartItems.length) {
                        k('no more items for gift box, remove')
                        var newGiftBoxes = this.j_.cloneObject(this.giftBoxes)
                        delete newGiftBoxes[product.recipientName]
                        this.$store.commit('giftBoxes', newGiftBoxes)
                    }
                }
                // this.$q.notify({
                //     message: 'Removed product from cart!',
                //     type: 'positive',
                //     icon: 'fa-check-circle',
                //     position: 'bottom-left'
                // })
            },

            editGiftBox(recipientName) {
                k('recipientName: ', recipientName)
                this.$root.$emit('openGiftBoxEditModal', recipientName)
            }
        }
    }
</script>

<style scoped>
    /*.q-card-primary.q-card-container.row.no-wrap{*/
    /*    border    */
    /*}*/

    .q-if-control,
    .bg-grey.bg-primary{
        background-color: #e5e5e5!important;
        color: black!important;
    }

    .pchip {
        background: transparent;
        color: #000;
        /*font-size: .8rem; */
        margin: .25rem 0;
        padding: .25rem .5rem;
        border-radius: .2rem;
        font-size: 9rem;
        font-weight: 800;
        width: fit-content;
        width: -moz-fit-content;
    }

    .pwywchip {
        background: #ff9800 !important;
        color: #fff;
        font-size: .8rem;
        margin: .25rem 0;
        padding: .25rem .5rem;
        border-radius: .2rem;
        width: fit-content;
        width: -moz-fit-content;
    }

    .shopCartProduct {
        border-top: 1px solid #ccc;
        /*margin: 1rem;*/
        padding: 1rem;
        /*background: white;*/
    }

</style>
