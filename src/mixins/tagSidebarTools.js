export const tagSidebarTools = {
    
    props: ['productScope', 'tagScope', 'tagHeadingsObj4Scope'],
    
    data() {
        return {
            tagHeading: false,
            currentTagObjCount: '',
            
            anyTagsSelected4Heading(key) {
                var selectedTags = false
                var tags4heading = this.tagHeadingsObj4ScopeComputed[key].tags
                // k('key: ', key, tags4heading)

                Object.keys(tags4heading).forEach((tagKey) => {
                    var tag = tags4heading[tagKey]
                    if (tag.selected) selectedTags = true
                })
                return selectedTags
            },
            
            numberOfProductsForTagName(tagID) {
                var numberOfProducts = this.currentTagObjCount.productCountPerTag[tagID]
                // k('numberOfProducts: ', tagID, numberOfProducts)
                return numberOfProducts
            },
            
            headingLabel(heading, key) {
                return `<span style="font-size: 1rem; color: #000;">${key.charAt(0).toUpperCase() + key.slice(1)}</span>`
            },
            
            filteredHeadingTags(heading) {
                var filteredHeadingTags = Object.keys(heading.tags).filter((key) => {
                    var tag = heading.tags[key]
                    return this.currentView === 'myLibrary' ? tag.userActiveProductTag && tag.webplayer : tag.available4Sale
                })  
                
                // k('filteredHeadingTags: ', filteredHeadingTags)
                return filteredHeadingTags
            },
            
            showTag(tag) {
                return this.currentView === 'myLibrary' ? tag.userActiveProductTag && tag.webplayer : tag.available4Sale
            },
            
            showHeading(heading) {
                // k('showHeading: ', this.filteredHeadingTags(heading).length)
                return this.filteredHeadingTags(heading).length
            }
        }
    },
    
    computed: {
        tagHeadingsObj4ScopeComputed(){
            let data = this.tagHeadingsObj4Scope
            delete data.warehouse
            return data
        },

        brandColor() {
            return this.$store.state.environment.json.e.brandColor
        },

        userSelectedTags() {
            return this.$store.state.userSelectedTags
        },
    
        currentView() {
            return this.$store.state.currentView
        }
    },

    watch: {
        productScope() {
            this.generateCurrentTagObjCount()
        }
    },
    
    created() {
        this.generateCurrentTagObjCount()
    },
    
    methods: {
        
        tagPchipStyle(selected) {
        //   if (selected) {
              return "background-color: white"
        //   } else {
        //       return "background-color: #E8E8E8"
        //   }
        },
        
        tagStyle(selected) {
            if (selected) {
                return `background-color: ${this.brandColor}; color: #fff;`
            } else {
                return "";
            }
        },
        
        userClickedTag(id) {
            k('userClickedTag: ', id)
            this.$emit('selectTag', id)
        },
        
        generateCurrentTagObjCount() {
            var tagObj = {}
            var tagHeadingObj = {}
            var usedProducts = []
            var products = this.productScope
            var allTags = this.tagScope
            k('currentTagObjCount products: ', products, allTags)

            products.forEach((product) => {
                // k('product: ', product.tags, product.productName, product)
                
                var tags = product.tags
                if (tags && tags.includes(',')) {
                    tags = tags.split(',')
                } else {
                    tags = [tags]
                }

                if (tags) tags.forEach((tagID) => {
                    var tag = allTags[tagID]

                    if (tag) {
                        // k('tag: ', tag)
                        if (!tagHeadingObj[tag.tagHeadingID]) {
                            tagHeadingObj[tag.tagHeadingID] = 0
                        }
                        tagHeadingObj[tag.tagHeadingID]++

                        if (!tagObj[tag.id]) {
                            tagObj[tag.id] = 0
                        }
                        tagObj[tag.id]++
                    }
                })
            })

            this.currentTagObjCount = { productCountPerTag: tagObj, productCountPerHeading: tagHeadingObj }
            k('currentTagObjCount: ', this.currentTagObjCount)
        },

        collapseAll() {
            this.tagHeading = false
        },

        deselectAll() {
            k('deselectAll: ', this.userSelectedTags)
            if (!this.userSelectedTags.length) return false

            // this.markSelectedTags()
            this.$store.commit('setUserSelectedTags', '')
            
            if (this.currentView !== 'myLibrary') {
                this.route('/shop')
            }
        }
    }
}