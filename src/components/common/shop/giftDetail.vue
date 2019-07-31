<template>
    
    <div id="giftDetail" class="row" style="padding: 1rem;">

        <h5 class="dividerHeader col-12" align="center" style="margin-top: 0;">
            <span style="background: #fff;">
                <q-icon class="big-icon" name="fa-gift" />
            </span>
        </h5>

        <div v-if="!showEditGiftBox" class="col-sm-12 col-md-4" style="padding: .5rem 0;">
            <h6 class="col-12" align="center">
                Create a new gift box:
            </h6>
            <div style="padding: .5rem;">
                <q-btn v-if="Object.keys(giftBoxes).length" id="createNewGiftBox" @click="createNewGiftBox()" color="orange" class="full-width">
                    <q-icon name="fa-plus" /> <h6>CREATE</h6>
                </q-btn>
            </div>
        </div>
        
        <div v-if="!showEditGiftBox" class="col-sm-12 col-md-8" style="padding: .5rem 0;">
            <div class="row">
                <h6 class="col-12" align="center">Or choose an existing giftbox to add this product:</h6>
    
                <div class="col" v-for="box in giftBoxes" :key="box.recipientName" style="padding: .5rem;">
                    <q-btn :id="box.recipientName" class="full-width existingGiftBox" color="orange" @click="editExistingBox(box.recipientName)">
                        <q-icon name="fa-gift" /> <h6>{{box.recipientName}}</h6>
                    </q-btn>
                </div>
            </div>
        </div>

        <div v-if="showEditGiftBox" class="col-12" style="padding: .5rem;">

            <giftEdit :currentGiftBox="currentGiftBox" :currentGiftBoxProducts="currentGiftBoxProducts" :currentProductToAddToGiftBox="currentProductToAddToGiftBox" @closeEditGiftBox="closeEditGiftBox()" />

        </div>
    
    </div>

</template>

<script>
    import giftEdit from './giftEdit'

    export default {
        props: ['componentData'],
        
        components: {
            giftEdit  
        },

        data() {
            return {
                showGiftBoxList: false,
                showEditGiftBox: false,
                originalRecipientName: '',
                currentGiftBoxProducts: '',
                currentProductToAddToGiftBox: '',

                newGiftBox: {
                    recipientName: '',
                    recipientEmail: '',
                    sendWhen: new Date(),
                    giftMessage: '',
                    giftGiverFrom: ''
                },

                currentGiftBox: {
                    recipientName: '',
                    recipientEmail: '',
                    sendWhen: new Date(),
                    giftMessage: '',
                    giftGiverFrom: ''
                }
            }
        },

        computed: {
            environmentData() {
                return this.$store.state.environment.data
            },

            environmentJSON() {
                return this.$store.state.environment.json
            },

            giftBoxes() {
                return this.$store.state.giftBoxes
            },

            cart() {
                return this.$store.state.cart
            },

            productPreviewData() {
                return this.$store.state.productPreviewData
            },
        },

        methods: {
            
            createNewGiftBox() {
                this.showEditGiftBox = true
                this.currentGiftBox = JSON.parse(JSON.stringify(this.newGiftBox))
                this.currentGiftBoxProducts = [this.productPreviewData]
                this.currentProductToAddToGiftBox = this.productPreviewData

                kw('create new box', this.currentGiftBoxProducts)
            },

            editExistingBox(recipientName) {
                // var currentProduct = self.get('productPreviewData')
                // var recipientName = e.context.recipientName
                k('populate gift box', recipientName, this.giftBoxes[recipientName])

                var currentBox = JSON.parse(JSON.stringify(this.giftBoxes[recipientName]))
                var currentGiftBoxProducts = this.generateCurrentGiftBoxProducts(recipientName)

                var currentProduct = this.productPreviewData
                var productAddedAlready = this.checkIfProductAlreadyInCurrentGiftBox(currentProduct, currentGiftBoxProducts)
                k('productAddedAlready: ', productAddedAlready)

                if (!productAddedAlready) {
                    currentGiftBoxProducts.push(currentProduct)
                    
                    if (!this.environmentJSON.e.hideNotifyAddCart) {
                        this.$q.notify({
                            message: 'Added product to cart!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                    }
                }
                else {
                    currentProduct = ''
                    this.$q.notify({
                        message: 'Product already added. Now editing existing gift box.',
                        type: 'info',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                }

                this.showEditGiftBox = true
                this.showGiftBoxList = false
                this.currentProductToAddToGiftBox = currentProduct
                this.currentGiftBox = currentBox
                this.currentGiftBoxProducts = currentGiftBoxProducts
                kw('edit box', this.currentGiftBoxProducts)

            },

            generateCurrentGiftBoxProducts(recipientName) {
                k('generateCurrentGiftBoxProducts: ', this.cart)

                var currentGiftBoxProducts = this.cart.filter((product) => {
                    // k(product, product.receipientName)
                    return product.recipientName == recipientName ? product : false
                })
                k('currentGiftBoxProducts: ', currentGiftBoxProducts)

                return currentGiftBoxProducts
            },

            checkIfProductAlreadyInCurrentGiftBox(currentProduct, currentGiftBoxProducts) {
                var productAddedAlready = false

                currentGiftBoxProducts.forEach((product) => {
                    if (product.productID === currentProduct.productID) productAddedAlready = true
                })

                return productAddedAlready
            },
            
            closeEditGiftBox() {
                this.showEditGiftBox = false
                this.$root.$emit('closeProductPreview')
    
                if (this.currentView !== 'checkout') {
                    this.$nextTick(() => {
                        this.$root.$emit('openShopCart')
                    })
                }
            }
        },

        mounted() {
            k('giftBoxes: ', this.giftBoxes)
            if (!Object.keys(this.giftBoxes).length) {
                this.createNewGiftBox()
            }
        },

        beforeDestroy() {

        }
    }
</script>

<style>
    .q-chip.small .q-chip-main {
        padding: 0;
    }
</style>
