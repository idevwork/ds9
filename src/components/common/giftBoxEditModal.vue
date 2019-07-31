<template>
    
    <q-modal
      v-model="openModal"
      :content-css="{minWidth: '70vw', minHeight: '70vh'}"
      @show="showGiftEdit = true"
      @hide="showGiftEdit = false"
    >
        <q-modal-layout>
        
            <q-toolbar slot="header" color="grey" :style="toolbarStyle">
                <q-toolbar-title>
                    Edit Gift Box
                </q-toolbar-title>
                <q-btn flat icon="fa-times" @click="close" style="padding: .5rem;" />
            </q-toolbar>
            
            <div style="padding: 1rem; background: #fff;">
                <giftEdit v-if="showGiftEdit" :currentGiftBox="currentGiftBox" :currentGiftBoxProducts="currentGiftBoxProducts" :currentProductToAddToGiftBox="currentProductToAddToGiftBox" />
            </div>
            
        </q-modal-layout>

    </q-modal>
    
</template>

<script>
    import giftEdit from './shop/giftEdit'
    
    export default {
        components: {
            giftEdit
        },
        
        props: ['componentData'],

        data() {
            return {
                openModal: false,
                showGiftEdit: false,
                currentGiftBox: {
                    recipientName: '',
                    recipientEmail: '',
                    sendWhen: new Date(),
                    giftMessage: '',
                    giftGiverFrom: ''
                },
                
                currentGiftBoxProducts: '',
                currentProductToAddToGiftBox: ''
            }
        },

        computed: {
            
            environment() {
                return this.$store.state.environment
            },
        
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },
        
            toolbarStyle() {
                return 'background: ' + this.brandColor + ' !important ;'
            },

            giftBoxes() {
                return this.$store.state.giftBoxes
            },

            cart() {
                return this.$store.state.cart
            },
        },

        methods: {
            editExistingBox(recipientName) {
                var currentBox = JSON.parse(JSON.stringify(this.giftBoxes[recipientName]))
                var currentGiftBoxProducts = this.generateCurrentGiftBoxProducts(recipientName)

                this.showEditGiftBox = true
                this.showGiftBoxList = false
                // this.currentProductToAddToGiftBox = currentProduct
                this.currentGiftBox = currentBox
                this.currentGiftBoxProducts = currentGiftBoxProducts
                kw('edit box', this.currentGiftBoxProducts)

            },

            generateCurrentGiftBoxProducts(recipientName) {
                // k('generateCurrentGiftBoxProducts: ', this.cart)

                var currentGiftBoxProducts = this.cart.filter((product) => {
                    // k(product, product.receipientName)
                    return product.recipientName == recipientName ? product : false
                })
                // k('currentGiftBoxProducts: ', currentGiftBoxProducts)

                return currentGiftBoxProducts
            },

            checkIfProductAlreadyInCurrentGiftBox(currentProduct, currentGiftBoxProducts) {
                var productAddedAlready = false

                currentGiftBoxProducts.forEach((product) => {
                    if (product.productID === currentProduct.productID) productAddedAlready = true
                })

                return productAddedAlready
            },
        
            close() {
                this.openModal = false
            }
        },

        created() {
            
            this.$root.$on('openGiftBoxEditModal', (recipientName) => {
                // k('event hub openGiftBoxEditModal: ', recipientName)
                this.openModal = true
                this.editExistingBox(recipientName)
            })            
            
            this.$root.$on('closeGiftBoxEditModal', (recipientName) => {
                // k('event hub closeGiftBoxEditModal: ', recipientName)
                this.openModal = false
            })
        },

        beforeDestroy() {

        }
    }
</script>

<style>

</style>
