<template>
    <div id="giftEdit">
        <!--<div style="padding: .5rem;">-->
        <!--    <h6 align="center">Gift Box {{currentGiftBox.recipientName ? '- for ' + currentGiftBox.recipientName : ''}}</h6>-->
        <!--</div>-->
        
        <div v-if="!hideGiftProducts" class="row justify-center" style="padding: 1rem;">
            <div v-for="(product, index) in currentGiftBoxProducts" :class="singleGiftItem ? '' : 'col-xs-6 col-sm-4 col-md-3 col-lg-2'" align="center">
                <q-card class="bg-white" style="position: relative; height: calc(100% - 1rem); max-width: 10rem;">
                    <q-btn v-if="!notEditable" class="removeProductFromGiftBox" color="white" size="sm" style="position: absolute; top: 0; right: 0; padding: .25rem; pointer-events: auto;" @click="removeProductFromGiftBox(product, index)">
                        <q-icon name="fa-times" color="red" />
                    </q-btn>
                    
                    <q-card-main style="padding: 0;">
                        <img class="full-width" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + product.productSKU + '/' + product.productSKU + '_image_cover.png'" />
                        <p style="font-size: 0.8rem; line-height: 1rem; padding: .5rem;">{{product.productName}}</p>
                    </q-card-main>
                </q-card>
            </div>
        </div>

        <div class="row bg-grey-3" style="padding: .5rem;">
            <div :class="inlineForm ? 'col-md-12 col-lg-6' : 'col-sm-12 col-md-6 col-lg-3'" style="padding: 0 .5rem;">
                <q-input 
                    id="recipientName" 
                    class="inputBox"
                    color="grey"
                    v-model="currentGiftBox.recipientName" 
                    :error="currentGiftBoxError.recipientName" 
                    float-label="Recipient Name" 
                    @input="currentGiftBoxError.recipientName = false" 
                />
            </div>
            
            <div :class="inlineForm ? 'col-md-12 col-lg-6' : 'col-sm-12 col-md-6 col-lg-3'" style="padding: 0 .5rem;">
                <q-input 
                    id="recipientEmail" 
                    class="inputBox"
                    color="grey"
                    v-model="currentGiftBox.recipientEmail" 
                    :error="currentGiftBoxError.recipientEmail" 
                    float-label="Recipient Email" 
                    @input="currentGiftBoxError.recipientEmail = false" 
                />
            </div>
            
            <div :class="inlineForm ? 'col-md-12 col-lg-6' : 'col-sm-12 col-md-6 col-lg-3'" style="padding: 0 .5rem;">
                <q-input 
                    id="giftGiverFrom" 
                    class="inputBox"
                    color="grey"
                    v-model="currentGiftBox.giftGiverFrom" 
                    :error="currentGiftBoxError.giftGiverFrom" 
                    float-label="Your Name" 
                    @input="currentGiftBoxError.giftGiverFrom = false" 
                />
            </div>

            <div :class="inlineForm ? 'col-md-12 col-lg-6' : 'col-sm-12 col-md-6 col-lg-3'" style="padding: .5rem;">
                <q-datetime 
                    id="giftDate" 
                    class="inputBox"
                    color="grey"
                    v-model="currentGiftBox.sendWhen"
                    :min="moment().format('M/DD/YY')"
                    :error="currentGiftBoxError.sendWhen" 
                    format="M/DD/YY" 
                    float-label="When should we send?" 
                    @input="currentGiftBoxError.sendWhen = false" 
                />
            </div>
            
            <div class="col-12" style="padding: 0 .5rem;">
                <q-input 
                    id="giftMessage" 
                    class="inputBox"
                    color="grey"
                    v-model="currentGiftBox.giftMessage"
                    :error="currentGiftBoxError.giftMessage"
                    type="textarea"
                    float-label="Your gift message"
                    :max-height="100"
                    rows="7"
                    @input="currentGiftBoxError.giftMessage = false"
                />
            </div>
            
            <div class="col-12" style="padding: .5rem;">
                <q-btn id="saveGiftBox" @click="saveGiftBox()" class="full-width" color="green">
                    <h6>{{saveButtonText ? saveButtonText : 'Save Gift Box'}}</h6>
                </q-btn>
            </div>
        </div>
    </div>

</template>

<script>
    
    export default {
        props: ['currentGiftBox', 'currentGiftBoxProducts', 'currentProductToAddToGiftBox', 'singleGiftItem', 'notEditable', 'inlineForm', 'saveTheBox', 'saveButtonText', 'hideGiftProducts', 'noToast'],
    
        data() {
            return {
                originalRecipientName: '',
    
                newGiftBox: {
                    recipientName: '',
                    recipientEmail: '',
                    sendWhen: new Date(),
                    giftMessage: '',
                    giftGiverFrom: ''
                },
    
                currentGiftBoxError: {
                    recipientName: false,
                    recipientEmail: false,
                    sendWhen: false,
                    giftMessage: false,
                    giftGiverFrom: false
                }
            }
        },
    
        computed: {
            environmentData() {
                return this.$root.$store.state.environment.data
            },
    
            environmentJSON() {
                return this.$root.$store.state.environment.json
            },
    
            giftBoxes() {
                return this.$root.$store.state.giftBoxes
            },
    
            cart() {
                return this.$root.$store.state.cart
            },
    
            currentView() {
                return this.$root.$store.state.currentView
            }
        },
    
        methods: {
    
            add2cart() {
                k('gift edit add2cart: ', this.currentProductToAddToGiftBox)
                this.$store.commit('add2cart', this.currentProductToAddToGiftBox)
                
                if (!this.noToast || !this.environmentJSON.e.hideNotifyAddCart){
                    this.$q.notify({
                        message: 'Added product to cart!',
                        type: 'positive',
                        icon: 'fa-check-circle',
                        position: 'bottom-left'
                    })
                }
            },
    
            removeProductFromGiftBox(product, index) {
                var product2remove = this.currentGiftBoxProducts[index]
                k('product2remove: ', product2remove)
    
                this.currentGiftBoxProducts.splice(index, 1)
                this.$store.commit('removeFromCart', product)
    
                k('currentProductToAddToGiftBox: ', this.currentProductToAddToGiftBox)
    
                if (product.productID === this.currentProductToAddToGiftBox.productID) this.currentProductToAddToGiftBox = ''
                if (!this.currentGiftBoxProducts.length) {
                    this.$root.$emit('closeGiftDetail')
                    this.$root.$emit('closeGiftBoxEditModal')
                }
            },
    
            modifyMatchingCartItemRecipientNames(recipientName) {
                var newCart = []
                this.cart.forEach((item) => {
                    k('cartItem: ', item)
                    if (item.recipientName && recipientName === item.recipientName) {
                        item.recipientName = this.currentGiftBox.recipientName
                    }
                    newCart.push(item)
                })
                this.$store.commit('saveCart', newCart)
            },
    
            saveGiftBox() {
    
                k('currentGiftBox: ', this.currentGiftBox)
                k('currentGiftBoxProducts: ', this.currentGiftBoxProducts)
                k('currentProductToAddToGiftBox: ', this.currentProductToAddToGiftBox)
    
                // validate form
                if (!this.currentGiftBox.recipientName || !this.currentGiftBox.recipientEmail || !this.currentGiftBox.recipientEmail.includes('@') || !this.currentGiftBox.recipientEmail.includes('.') || !this.currentGiftBox.sendWhen || !this.currentGiftBox.giftMessage || !this.currentGiftBox.giftGiverFrom) {
    
                    if (!this.currentGiftBox.recipientName) this.currentGiftBoxError.recipientName = true
    
                    if (!this.currentGiftBox.recipientEmail || !this.currentGiftBox.recipientEmail.includes('@') || !this.currentGiftBox.recipientEmail.includes('.')) this.currentGiftBoxError.recipientEmail = true
    
                    if (!this.currentGiftBox.sendWhen) this.currentGiftBoxError.sendWhen = true
    
                    if (!this.currentGiftBox.giftMessage) this.currentGiftBoxError.giftMessage = true
    
                    if (!this.currentGiftBox.giftGiverFrom) this.currentGiftBoxError.giftGiverFrom = true
    
                    if (!this.noToast) this.$q.notify({
                       message: 'Missing info. Please check your gift box information.',
                       type: 'negative',
                       icon: 'fa-exclamation-circle',
                       position: 'bottom-left'
                    })
    
                    return false
                }
    
                // add to gift boxes
                var giftBoxes = JSON.parse(JSON.stringify(this.giftBoxes))
                k('original giftBoxes: ', giftBoxes)
                
                k('currentProductToAddToGiftBox: ', this.currentProductToAddToGiftBox)
                if (this.currentProductToAddToGiftBox) {
                    var product2add = this.currentProductToAddToGiftBox
                        product2add.recipientName = this.currentGiftBox.recipientName
        
                    this.add2cart()
                    if (!this.noToast) this.$q.notify({
                        message: 'Added gift to cart!',
                        type: 'positive',
                        icon: 'fa-check-circle',
                        position: 'bottom-left'
                    })
                }
                
                // remove giftbox because no more products within giftbox
                if (!this.currentGiftBoxProducts.length) {
                    delete giftBoxes[this.giftBoxRecipientName]
                    this.modifyMatchingCartItemRecipientNames(this.giftBoxRecipientName)
                }
                
                // remove giftbox because there is a new recipient name
                k('gift box recipient names: ', this.originalRecipientName, this.currentGiftBox.recipientName)
                if (this.originalRecipientName && (this.originalRecipientName !== this.currentGiftBox.recipientName)) {
                    k('remove old box from obj')
                    delete giftBoxes[this.originalRecipientName]
                    this.modifyMatchingCartItemRecipientNames(this.originalRecipientName)
                }
                
                // set new giftBox
                giftBoxes[this.currentGiftBox.recipientName] = this.currentGiftBox
                this.$store.commit('giftBoxes', giftBoxes)
                
                k('saved gift boxes: ', giftBoxes)
                if (!this.noToast) this.$q.notify({
                    message: 'Saved gift box!',
                    type: 'positive',
                    icon: 'fa-check-circle',
                    position: 'bottom-left'
                })
    
                // close section, modals and open shop cart
                this.$emit('closeEditGiftBox')
                this.$root.$emit('closeGiftBoxEditModal')
            }
        },
    
        watch: {
            currentGiftBox() {
                k('current recipient name: ', this.currentGiftBox.recipientName)
                if (this.currentGiftBox.recipientName) this.originalRecipientName = this.currentGiftBox.recipientName
            },
            
            saveTheBox() {
                if (this.saveTheBox) this.saveGiftBox()
            }
        },
    
        created() {
            k('current recipient name: ', this.currentGiftBox.recipientName)
            if (this.currentGiftBox.recipientName) this.originalRecipientName = this.currentGiftBox.recipientName
            if (this.saveTheBox) this.saveGiftBox()
        },
    
        beforeDestroy() {
    
        }
    }
</script>

<style>

</style>