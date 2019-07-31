const sha1 = require('js-sha1');
    
export const impactTools = {
    computed: {
        receiptInfo() {
            return this.$store.state.receiptInfo
        },
        
        userInfo() {
            return this.$root.$store.state.user.info
        }
    },
    
    methods: {
        sendUserInfoToImpact() {
            k('sendUserInfoToImpact: ', this.userInfo.userEmail)
            
            let sha1UserEmail = this.userInfo && this.userInfo.userEmail ? sha1(this.userInfo.userEmail) : ''
            let customerId = this.userInfo && this.userInfo.userID ? String(this.userInfo.userID) : ''
            let impactObj = { customerId: customerId, customerEmail: sha1UserEmail }
            kw('sending to IMPACT: ', impactObj, ire)
            
            ire('identify', impactObj)
        },
        
        trackImpactSale() {
            let impactCart = []
            let item = {
                subTotal: '',
                category: '',
                sku: '',
                quantity: 1
            }
            
            k('impact sale info: ', this.receiptInfo)
            
            if (this.receiptInfo.products) {
                this.receiptInfo.products.forEach((product) => {
                    let impactItem = this.j_.cloneObject(item)
                        impactItem.subTotal = product.productPrice
                        impactItem.category = product.productType
                        impactItem.sku = product.productSKU
                    impactCart.push(impactItem)
                })
            }
            
            let impactObj = { orderId: `${this.userInfo.userID}_${Date.now()}`, customerId: this.userInfo.userID, customerEmail: this.userInfo.userEmail, orderPromoCode: this.receiptInfo.promoCode, currencyCode: 'USD', items: impactCart }
            k('impactObj: ', impactObj)
            
            ire('trackConversion', 15861, impactObj, { verifySiteDefinitionMatch: true });
        }
    }
}