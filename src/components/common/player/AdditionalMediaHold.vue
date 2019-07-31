<template>
        
    <div 
        :is="additionalMediaLayout" 
        @launchPDF="launchPDF"
        @launchZip="launchZip"
    />
        
</template>

<script>
    import DefaultAdditionalMediaLayout from './DefaultAdditionalMediaLayout'
    
    export default {
        props: ['additionalMediaLayout'],
        
        components: {
            DefaultAdditionalMediaLayout
        },

        data() {
            return {

            }
        },

        computed: {
            currentProduct() {
                return this.$store.state.currentProduct
            },

            userInfo() {
                return this.$store.state.user.info
            },

            userLoginToken() {
                return this.$store.state.user.userLoginToken
            }
        },

        methods: {

            launchPDF(fileInfo) {
                k('launchPDF:', fileInfo)

                var theHeight = Math.round(window.screen.availHeight * .9)
                var theWidth = Math.round(theHeight)
                
                // for homescreen apps
                // if (window.navigator.standalone) {
                //     getPDFURL(function(url) {
                //         var modifiedURL = encodeURIComponent(url.replace('http://vault.platformpurple.com', 'https://f3r6v6t8.ssl.hwcdn.net/'))
                //         k('modifiedURL: ', modifiedURL)
                        
                //         r.set('inlinePDFSrc', modifiedURL)
                //         r.showPurpleModal('inlinePDF', function() {
                            
                //             // trying to modify child frame
                //             document.getElementById("theFrame").contentWindow.onload = function() {
                //                 this.document.getElementsByTagName("img")[0].style.width="100%";
                //             }
                //         })
                        
                //         if (cb) cb(url)
                //     })
                // } else {
        
                    if (navigator.appVersion.indexOf('CriOS') !== -1) {
                        // if mobile chrome
                        this.getPDFURL(fileInfo, (url) => {
                            if (url) window.open(url, 'reader', 'height=' + theHeight + ', width=' + theWidth + ', toolbar=no, menubar=no, scrollbars=yes, resizable=yes')
                        })
                    }
                    else {
                        // if anything else
                        var newWindow = window.open("#", 'reader - ' + Date.now(), 'height=' + theHeight + ', width=' + theWidth + ', toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, directories=no, status=no')
                            newWindow.document.write('Please wait while we personalize your PDF, it could take a minute if the PDF is very large, thanks for your patience!' )
                        k('newWindow: ', newWindow)
                        
                        this.getPDFURL(fileInfo, (url) => {
                            if (url) newWindow.location = url
                        })
                    }
                // }
                
                var logEventObj = {
                    eventType: 'pdfLaunch',
                    eventDesc: 'launch pdf "' + this.currentProduct.productName + '"',
                    productSKU: this.currentProduct.productSKU,
                    productID: this.currentProduct.productID,
                    fileName: fileInfo.fileName
                }
                this.api.sendEvent(logEventObj)
            },
            
            getPDFURL(fileInfo, cb) {
                if (fileInfo.remotePath.indexOf('directpdf') >= 0) {
                    this.watermarkPDF(fileInfo.remotePath, this.userInfo.userEmail, (url) => {
                        cb(url)
                    })
                }
                else {
                    this.api.signURL(this.currentProduct.productSKU, fileInfo.fileName, this.userLoginToken, 'pdf', (res) => {
                        if (res.success) {
                            this.$q.notify({
                                message: 'Opening pdf!',
                                type: 'positive',
                                icon: 'fa-check-circle',
                                position: 'bottom-left'
                            })
                            cb(res.signedURL)
                        } else {
                            this.$q.notify({
                                message: 'Problem getting your pdf. Please try again.',
                                type: 'negative',
                                icon: 'fa-exclamation-circle',
                                position: 'bottom-left'
                            })
                            cb(false)
                        }
                    })
                }
            },
        
            watermarkPDF(remotePath, userEmail, cb) {
                var req = {
                    "watermarkText": userEmail,
                    "PDF2watermark": remotePath
                }
        
                k('product watermark req: ', req)
        
                this.api.post(this.api.apiv3Route + 'product/watermark', req, (pdfURL) => {
                    k('watermark res: ', pdfURL)
                    if (pdfURL.outputURL) {
                        this.$q.notify({
                            message: 'Opening your pdf!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                        cb(pdfURL.outputURL)
                    } else {
                        this.$q.notify({
                            message: 'Problem getting your pdf. PLease try again.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                        cb(false)
                    }
                })
            },
            
            launchZip(fileInfo) {
                var theHeight = Math.round(window.screen.availHeight * .9)
                var theWidth = Math.round(theHeight)
                var newWindow = null
        
                var mobileChrome = navigator.appVersion.indexOf('CriOS') < -1
                if (!mobileChrome) {
                    // not mobile chrome; launch new window first
                    k('mobileChrome?', mobileChrome)
                    newWindow = window.open("#", 'reader', 'height=' + theHeight + ', width=' + theWidth + ', toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, directories=no, status=no')
                    newWindow.document.write('Please wait while we download your zip!' )
                }
        
                this.api.signURL(this.currentProduct.productSKU, fileInfo.fileName, this.userLoginToken, 'zip', (res) => {
                    k('signed zip: ', res, newWindow)
                    
                    var logEventObj = {
                        eventType: 'zipLaunch',
                        eventDesc: 'launch zip "' + this.currentProduct.productName + '"',
                        productSKU: this.currentProduct.productSKU,
                        productID: this.currentProduct.productID,
                        fileName: fileInfo.fileName
                    }
                    this.api.sendEvent(logEventObj)
        
                    if (!res.success && mobileChrome) {
                        this.$q.notify({
                            message: 'Sorry, we were not able to retrieve this zip at this time. Please try again later or contact support.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    } else if (!res.success) {
                        newWindow.document.write('Sorry we are having trouble retrieving this zip at this time. Please try again later or contact support.')
                    } else if (res.success && mobileChrome) {
                        this.$q.notify({
                            message: 'Downloading your zip to your default downloads folder!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                        newWindow = window.open(res.signedURL)
                    } else {
                        this.$q.notify({
                            message: 'Downloading your zip to your default downloads folder!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                        newWindow.location = res.signedURL
                    }
        
                    setTimeout(() => {
                        newWindow.close()
                    }, 3000)
                })
            },
        },

        created() {
           
        }

    }
</script>

<style>

</style>