export const validProducts = {
    data() {
        return {
            previewBundleID: 150413,
            freeBundleID: 149196,
            
            freeProducts: [],
            previewProducts: [],
            
            myWalkTVSubscriptionsProductIDs: [149295, 149296],
            
            productTypes2Hide: ['channel', 'program_bundle', 'modcontent_bundle', 'test_modcontent_bundle', 'offline_channel'],
            
            checkMasterProductsForYDWSubIDs(masterProducts) {
                // k('checkMasterProductsForYDWSubIDs: ', this.ydwSubscriberIDs, Number(masterProducts))
                // masterProducts.indexOf(this.ydwSubscriberIDs[0]) === -1 && masterProducts.indexOf(this.ydwSubscriberIDs[1]) === -1 && masterProducts.indexOf(this.ydwSubscriberIDs[2]) === -1
                let includesSubID = false
                let masterProductIDs = masterProducts.indexOf(',') ? masterProducts.split(',').map((id) => { return Number(id) }) : [Number(masterProducts)]
                // k('masterProductIDs: ', masterProductIDs)
                
                this.ydwSubscriberIDs.forEach((subID) => {
                    // k('subID: ', subID)
                    if (masterProductIDs.includes(subID)) includesSubID = true
                })
                
                return !includesSubID
            },
            
            validProductFilter(product) {
                var productStatusIsPurchase = product.statusTypes && product.statusTypes.split(',').includes('2')
                var productStatusIsSub = product.statusTypes && (product.statusTypes.split(',').includes('9') || product.statusTypes.split(',').includes('11'))
                var masterProductsDoesNotIncludeYDWSubIDs = !product.masterProducts || (product.masterProducts && this.checkMasterProductsForYDWSubIDs(product.masterProducts))
                var productTypeIsNotExclusive = product.productType !== 'exclusiveContent'
                // kw('validProductFilter: ', product.productName, product)
                // kw('productTypeIsNotExclusive: ', productTypeIsNotExclusive)
                // kw('productStatusIsPurchase: ', productStatusIsPurchase)
                // kw('productStatusIsSub: ', productStatusIsSub)
                // kw('masterProductsDoesNotIncludeYDWSubIDs: ', masterProductsDoesNotIncludeYDWSubIDs)
                
                // return productTypeIsNotExclusive && (productStatusIsPurchase || (productStatusIsSub && masterProductsDoesNotIncludeYDWSubIDs))
                return (productStatusIsPurchase || (productStatusIsSub && masterProductsDoesNotIncludeYDWSubIDs))
            }
        }
    },
    
    computed: {
        ydwSubscriberIDs() {
            return this.$store.state.environment.json.e.ydwSubscriptionsProductIDs
        },
        
        validSubscriptionProductIDs() {
            return this.$store.state.environment.json.e.validSubscriptionProductIDs ? this.$store.state.environment.json.e.validSubscriptionProductIDs : ''
        },
        
        environmentProducts() {
            return this.$store.state.environmentProducts  
        }, 
        
        userActiveProducts() {
            k('userActiveProducts: ', this.validProducts)
            return this.validProducts && this.validProducts.length ? this.validProducts.filter((product) => {
                return product.userActiveProduct && product.webplayer
            }) : []
        },
        
        validProducts() {
            // k('mwtSubscriber: ', this.mwtSubscriber, this.nonExclusiveProducts)
            k('nonExclusiveProducts: ', this.nonExclusiveProducts)
            k('freeProducts: ', this.freeProducts)
            k('previewProducts: ', this.previewProducts)
            
            // return !this.mwtSubscriber ? this.nonExclusiveProducts.concat(this.freeProducts).concat(this.previewProducts) : this.nonExclusiveProducts.concat(this.exclusiveProducts)
            return this.nonExclusiveProducts.concat(this.freeProducts).concat(this.previewProducts)
            // return this.nonExclusiveProducts
        },

        nonExclusiveProducts() {
            var validProducts = this.environmentProducts ? this.environmentProducts.filter((product) => {
                // return this.validProductFilter(product) && !this.productTypes2Hide.includes(product.productType) && product.productType !== 'exclusiveContent' && product.webplayer
                return this.validProductFilter(product) && product.webplayer
            }) : []

            k('nonExclusiveProducts: ', validProducts)
            return validProducts
        },

        exclusiveProducts() {
            var validProducts = this.environmentProducts ? this.environmentProducts.filter((product) => {
                return product.productType === 'exclusiveContent' && Number(product.productID) !== this.freeBundleID && Number(product.productID) !== this.previewBundleID
            }) : ''

            k('exclusiveProducts: ', validProducts)
            return validProducts
        },

        mwtSubscriber() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                return this.myWalkTVSubscriptionsProductIDs.includes(product.productID)
            }).length ? true : false : ''
        }
    }
}