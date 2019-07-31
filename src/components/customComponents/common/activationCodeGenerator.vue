<template>
    
    <div class="row" style="padding: 3rem; background: #efefef;">
        <div class="full-width row well">
            <h4 class="full-width" align="center">
                Activation Code Generator
            </h4>
            <h5 class="full-width" align="center">
                Choose a code and a product to generate an activation code (if you leave the code blank then we will generate one for you). 
                <!--<br /> Select 'multiple users' to have it work for many users.-->
            </h5>
            
            <q-card v-if="userInfo.userOrgs" class="col-12" color="white">
                
                <q-card-main style="color: #000;">
                    
                    <div v-if="displayCodeInfo" class="ui success message">
                        <i class="close icon" on-tap="this.displayCodeInfo = false)"></i>
                        <div class="ui content" style="text-align: center;">
                            <h6 class="ui header" style="margin: 1rem auto;">Your code has been generated!</h6>
                            <h6 class="ui header">Make sure to take a screenshot or make a record of this code: <strong>{{displayCodeInfo.code}}</strong></h6>
                            <img class="ui tiny centered image" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + displayCodeInfo.product.productSKU + '/' + displayCodeInfo.product.productSKU + '_image_cover.png'" style="margin: 1rem auto;" />
                            <h6 class="ui header">Name: {{displayCodeInfo.product.productName}}</h6>
                        </div>
                    </div>
                    
                    <div class="row">
                        
                        <div class="col-md-12 col-lg-6">
                            <label><strong>Selected Product</strong></label>
                            <!--<img class="ui tiny centered image" src="https://f3r6v6t8.ssl.hwcdn.net/static/previews/{{productSKU}}/{{productSKU}}_image_cover.png">-->
                            <h6>Name: {{selectedProduct.productName}}</h6>
                            <h6>SKU: {{selectedProduct.productSKU}}</h6>
                            <h6>ID: {{selectedProduct.productID}}</h6>
                        </div>
                        
                        <div class="col-md-12 col-lg-6">
                            <q-input float-label="Code" type="text" v-model="newCode" placeholder="" />
                        </div>
                        
                        <div class="col-12">
                            <hr />
                        </div>
                    </div>
                    
                    <div class="col-12" style="max-height: 40vh; overflow: auto;">
                        <Searchselect v-if="environmentProducts" @selected="setSelectedSearchItems" :searchSelection="environmentProducts" :key2search="'searchString'" :keys2show="['productID', 'productSKU', 'productName']" :selectedSearchItems="selectedSearchItems" :singleSelect="true"></Searchselect>
                    </div>
                    
                    <q-btn class="full-width" @click="generateCode(event)" :style="buttonStyle">Generate!</q-btn>
                </q-card-main>
                
            </q-card>
        </div>
    </div>
    
</template>

<script>
    import Searchselect from '../../common/Searchselect'
    
    export default {
        components: {
            Searchselect
        },
        
        data() {
            return {
                newCode: '',
                displayCodeInfo: '',
                selectedProduct: '',
                multiUser: false,
                selectedSearchItems: []
            }
        },
        
        computed: {
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
        
            environmentData() {
                return this.$store.state.environment.data
            },
        
            userInfo() {
                return this.$store.state.user.info
            },
        
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },
        
            buttonStyle() {
                return 'background: ' + (this.brandColor || '#777') + '!important; margin-top: .5rem; color: white;'
            },
        },
        
        created() {
            // self.on({
            //     '*.selectedProduct': function(e) {
            //         k(e)
            //         self.set('selectedProduct', e)
            //     }
            // })
            
            // self.observe('selectProductError codeGenerationError', function(n, o, keypath) {
            //     if (n) {
            //         setTimeout(function() {
            //             self.set(keypath, false)
            //         }, 5000)
            //     }
            // })
        },
        
        methods: {
            
            
            setSelectedSearchItems(item) {
                k('setSelectedSearchItems: ', item)
                
                // if (!this.selectedSearchItems.includes(item)) {
                //     this.selectedSearchItems.push(item)
                // }
                // else {
                //     this.selectedSearchItems.splice(this.selectedSearchItems.indexOf(item), 1)
                // }
                
                this.selectedSearchItems = [item]
            },
            
            generateCode(e) {
                
                if (!this.selectedSearchItems[0]) {
                    this.$q.notify({
                        message: 'Please select a product to apply the code.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                var req = {
                    shopID: this.environmentData.shopID,
                    affiliateID: this.environmentData.affiliateID,
                    productID: this.selectedSearchItems[0].productID,
                    multiUser: this.multiUser,
                    code: this.newCode
                }
                k('generateCode req: ', req)
                
                this.api.post(this.api.apiv3Route + 'activationCode/create', req, (res) => {
                    k('/activationCode/create res: ', res)
                    
                    if (res.error) throw res.error
                    
                    if (res.success) {
                        
                        this.displayCodeInfo = {
                            product: this.selectedSearchItems[0],
                            code: res.code
                        }
                        
                        this.selectedSearchItems = []
                    } else {
                        self.set('codeGenerationError', res.message === 'activationCodeExists' ? 'Sorry, this activation code already exists.' : 'Sorry, there was a problem generating your code. Please try again.')
                    }
                })
            }
        }
    }
</script>