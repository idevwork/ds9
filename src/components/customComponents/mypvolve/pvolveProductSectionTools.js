export const pvolveProductSectionTools = {

    data() {
        return {
            levelImageSrc(level) {
                let fileName
                if (level === 'beginner') fileName = `PLV157-18_StreamingUpdates_Icons_Bar_Beginner.png`
                if (level === 'intermediate') fileName = `PLV157-18_StreamingUpdates_Icons_Bar_Intermediate.png`
                if (level === 'advanced') fileName = `PLV157-18_StreamingUpdates_Icons_Bar_Advanced.png`
                return `https://vault.platformpurple.com/static/clients/mypvolve/${fileName}`
            },
            bundleProductFilterForTags(tagArr) {
                return this.bundleOrConnectedExclusiveProducts ? this.bundleOrConnectedExclusiveProducts.filter((product) => {
                    return tagArr.every((tag) => {
                        return product.tags.split(',').includes(tag)
                    })
                }) : []
            },
            includedInSubscription(productID) {
                const channelProduct = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', this.monthlySubscriptionProductID)

                return channelProduct && channelProduct.bundleProducts.split(',').includes(String(productID))
            },
            // Remember to make sure about the variable type (string, number, etc)
            structuredProductTagID: '5763',
            nutritionProductTagID: '5896',
            tutorialWorkoutsTagID: '5494',
            beginnerTagID: '15',
            intermediateTagID: '59',
            advancedTagID: '60',
            monthlySubscriptionProductID: 148014
        }
    },

    computed: {
        bundleOrConnectedExclusiveProducts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                const bundleProducts = this.includedInSubscription(product.productID) && product.productType == 'bundleProduct'
                const exclusiveContentAndUserConnected = product.productType === 'exclusiveContent' && product.userActiveProduct

                return bundleProducts || exclusiveContentAndUserConnected
            }) : []
        },

        workoutProducts() {
            // removing nutrition products from products
            return this.bundleOrConnectedExclusiveProducts.filter(product => !product.tags.split(',').includes(this.nutritionProductTagID))
        },

        nutritionProducts() {
            // getting only nutrition products from products
            return this.bundleOrConnectedExclusiveProducts.filter(product => product.tags.split(',').includes(this.nutritionProductTagID))
        },

        homePageSections() {
            return this.$store.state.environment.json.homePageSections
        },

        beginnerHomePageSectionInfo() {
            return this.homePageSections.find((section) => { return section.id === 'beginners' })
        },

        tutorialProductOrder() {
            return this.beginnerHomePageSectionInfo.tutorialProductOrder
        },

        structuredProducts() {
            return this.environmentProducts ? this.environmentProducts.filter((product) => {
                const structuredProduct = this.includedInSubscription(product.productID)
                    && product.tags.split(',').includes(this.structuredProductTagID)

                return structuredProduct
            }) : []
        },

        beginnerStructuredProducts() {
            return this.structuredProducts ? this.structuredProducts.filter((product) => {
                k('beginner strucutred product? ', product.tags.split(','), this.beginnerTagID)
                return product.tags.split(',').includes(this.beginnerTagID)
            }) : []
        },

        intermediateStructuredProducts() {
            return this.structuredProducts ? this.structuredProducts.filter((product) => {
                k('intermidiate strucutred product? ', product.tags.split(','), this.intermediateTagID)
                return product.tags.split(',').includes(this.intermediateTagID)
            }) : []
        },

        advancedStructuredProducts() {
            return this.structuredProducts ? this.structuredProducts.filter((product) => {
                k('advanced strucutred product? ', product.tags.split(','), this.advancedTagID)
                return product.tags.split(',').includes(this.advancedTagID)
            }) : []
        },

        tutorialWorkouts() {
            let tutorialWorkouts = this.bundleProductFilterForTags([this.tutorialWorkoutsTagID])
            return tutorialWorkouts.map((product) => {
                let productIndex = this.tutorialProductOrder.findIndex((item) => { return product.productID === item })
                product.productOrder = productIndex > -1 ? productIndex : tutorialWorkouts.length

                return product
            }).sort((a, b) => {
                return a.productOrder - b.productOrder
            })
        },

        tutorialWorkoutIDs() {
            return this.tutorialWorkouts ? this.tutorialWorkouts.map((workout) => workout.productID) : []
        },

        beginnerWorkouts() {
            return this.bundleOrConnectedExclusiveProducts ? this.bundleOrConnectedExclusiveProducts.filter((product) => {

                return product.tags.split(',').includes(this.beginnerTagID) && !product.tags.split(',').includes(this.structuredProductTagID)
            }).sort((a, b) => { return b.productID - a.productID }) : []
        },

        beginnerWorkoutIDs() {
            k('beginnerWorkouts: ', this.beginnerWorkouts)
            return this.beginnerWorkouts ? this.beginnerWorkouts.map((workout) => workout.productID) : []
        },

        intermediateWorkouts() {
            return this.bundleOrConnectedExclusiveProducts ? this.bundleOrConnectedExclusiveProducts.filter((product) => {

                return product.tags.split(',').includes(this.intermediateTagID) && !product.tags.split(',').includes(this.structuredProductTagID)
            }) : []
        },

        intermediateWorkoutIDs() {
            k('intermediateWorkouts: ', this.intermediateWorkouts)
            return this.intermediateWorkouts ? this.intermediateWorkouts.map((workout) => workout.productID) : []
        },

        advancedWorkouts() {
            return this.bundleOrConnectedExclusiveProducts ? this.bundleOrConnectedExclusiveProducts.filter((product) => {

                return product.tags.split(',').includes(this.advancedTagID) && !product.tags.split(',').includes(this.structuredProductTagID)
            }) : []
        },

        advancedWorkoutIDs() {
            k('advancedWorkouts: ', this.advancedWorkouts)
            return this.advancedWorkouts ? this.advancedWorkouts.map((workout) => workout.productID) : []
        },

        nutritionProductsIDs() {
            k('nutritionProducts: ', this.nutritionProducts)
            return this.nutritionProducts ? this.nutritionProducts.map((workout) => workout.productID) : []
        },

        heroComponentData() {
            return {
                "id": "beginnerHero",
                "component": "pvolveHero",
                "componentPath": "mypvolve/pvolveHero.html",
                "backgroundImageURL": "mypvolve/beginner_page_header.jpg",
                "backgroundColor": "#fff",
                "textColor": "#fff",
                "padding": "2rem",
                "mobilePadding": "2rem",
                "overlayColor": "#522b23",
                "overlayOpacity": "0.5",
                "visibility": {}
            }
        },

        tutorialSectionComponentData() {
            return {
                "id": "tutorialProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "tutorials",
                "backgroundColor": "#fff",
                "productIDs": this.tutorialWorkoutIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.tutorialWorkouts,
                "useHorizontalScrolling": true
            }
        },

        beginnerSectionComponentData() {
            return {
                "id": "beginnerProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "beginners",
                "backgroundColor": "#fff",
                "productIDs": this.beginnerWorkoutIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.beginnerWorkouts,
                "useHorizontalScrolling": true
            }
        },

        intermediateSectionComponentData() {
            return {
                "id": "beginnerProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "intermediateWorkouts",
                "backgroundColor": "#fff",
                "productIDs": this.intermediateWorkoutIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.intermediateWorkouts,
                "useHorizontalScrolling": true
            }
        },

        advancedSectionComponentData() {
            return {
                "id": "beginnerProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "advancedWorkouts",
                "backgroundColor": "#fff",
                "productIDs": this.advancedWorkoutIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.advancedWorkouts,
                "useHorizontalScrolling": true
            }
        },

        nutritionSectionComponentData() {
            return {
                "id": "beginnerProducts",
                "component": "productSection",
                "content": "specificProducts",
                "rowID": "advancedWorkouts",
                "backgroundColor": "#fff",
                "productIDs": this.nutritionProductsIDs,
                "animated": true,
                "productDisplayLimit": 4,
                "columnCount": "four",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.nutritionProducts,
                "useHorizontalScrolling": true
            }
        },

        // Structured Products has a different way of displaying products and IDs are not needed

        beginnerStructuredProductComponentData() {
            return {
                "id": "pvolveBeginnerStructuredProducts",
                "component": "pvolveStructuredProducts",
                "componentPath": "mypvolve/pvolveStructuredProducts.html",
                "backgroundColor": "#fff",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.beginnerStructuredProducts,
                "visibility": {}
            }
        },

        intermediateStructuredProductComponentData() {
            return {
                "id": "pvolveIntermediateStructuredProducts",
                "component": "pvolveStructuredProducts",
                "componentPath": "mypvolve/pvolveStructuredProducts.html",
                "backgroundColor": "#fff",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.intermediateStructuredProducts,
                "visibility": {}
            }
        },

        advancedStructuredProductComponentData() {
            return {
                "id": "pvolveAdvancedStructuredProducts",
                "component": "pvolveStructuredProducts",
                "componentPath": "mypvolve/pvolveStructuredProducts.html",
                "backgroundColor": "#fff",
                "columnClass": "col-xs-12 col-sm-6 col-md-4 col-lg-3",
                "products": this.advancedStructuredProducts,
                "visibility": {}
            }
        }
    }
}
