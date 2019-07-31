export const cartTools = {
    
    data() {
        return {
            cartTotal: '',
            originalCartTotal: '',
        }
    },
    
    computed: {
        cart() {
            return this.$store.state.cart
        }
    },
    
    methods: {
        setCartTotal() {
            k('cartTotal cart: ', this.cart)

            var cartTotal = 0
            if (this.cart && this.cart.length) this.cart.forEach((item) => {
                if (item.discountedPrice || item.discountedPrice === 0) {
                    k('has discounted price')
                    cartTotal += Number(item.discountedPrice)
                }
                else if (item.pwyw_active) {
                    cartTotal += Number(item.pwywPrice)
                }
                else {
                    k('has regular price')
                    cartTotal += Number(item.productPrice)
                }
            })

            if (this.giftCard) {
                this.giftCard.giftCardAmtApplied = (this.giftCard.giftCardBalance > cartTotal) ? cartTotal : this.giftCard.giftCardBalance
                cartTotal -= this.giftCard.giftCardAmtApplied
                k('there is giftCardInfo: ', this.giftCard)
            }
            k('cartTotal: ', cartTotal)

            this.cartTotal = cartTotal
        },

        setOriginalCartTotal() {
            var originalCartTotal = 0
            if (this.cart && this.cart.length) this.cart.forEach((item) => {
                if (item.pwyw_active) {
                    originalCartTotal += Number(item.pwywPrice)
                }
                else {
                    originalCartTotal += Number(item.productPrice)
                }
            })

            this.originalCartTotal = originalCartTotal
        }
    }
}