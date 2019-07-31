export const pvolveSharing = {
    methods: {
        share2Facebook(product) {
            k('share to fb: ', product)
            
            // TODO: use whichServer
            var defaultShareURL = 'https://share-dev2.platformpurple.com/product-preview/' + this.$store.state.environment.name + '/' + product.productID
            
            // todo custom share links
            //https://share.yourdailywalk.com/product-preview/yourdailywalk/109776/
            
            var url = 'https://www.facebook.com/sharer/sharer.php?u=' + (product.productJSON && product.productJSON.shareURL ? product.productJSON.shareURL : defaultShareURL)
            // open external fb share dialog
            var w = window.open(
                url,
                'name',
                'width=600,height=400,toolbar=0,menubar=0,location=-100,status=1,scrollbars=0,resizable=0')
            w.focus()
        },

        share2Twitter(product) {
            k('share to twitter: ', product)
            
            // TODO: use whichServer
            var defaultShareURL = 'https://share-dev2.platformpurple.com/product-preview/' + this.$store.state.environment.name + '/' + product.productID
            
            var url = 'https://www.twitter.com/share?url=' + (product.productJSON && product.productJSON.shareURL ? product.productJSON.shareURL : defaultShareURL)
            
            var w = window.open(url, 'name', 'width=600,height=400,toolbar=0,menubar=0,location=-100,status=1,scrollbars=0,resizable=0')
            w.focus()
        },
    }
}