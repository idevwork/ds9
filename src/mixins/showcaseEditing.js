import { contentItemFiltering } from '../mixins/contentItemFiltering'

export const showcaseEditing = {
    
    mixins: [ contentItemFiltering ],
    
    data() {
        return {
            openProductModal: false,
            openTagModal: false,
            openHTMLModal: false,
            
            afterID: '',

            seeAllProducts: false,
            
            sectionDisplayNames: {
                'heroUnit': 'Hero Unit',
                'productSection': 'Product Section',
                'htmlSection': 'HTML Section'
            },
            
            keyDisplayNames: {
                'id': 'Section ID',
                'component': 'Component Name',
                'content': 'Section Content',
                'heading': 'Heading',
                'headingColor': 'Heading Title Color',
                'backgroundColor': 'Background Color',
                'columnsPerRow': 'Columns Per Row',
                'productIDs': 'Product IDs',
                'products': 'Included Products',
                'visibility': 'Visibility',
                'description': 'Description',
                'customProductCard': 'Product Card'
            },
            
            editEnabledSections: [
                // 'heroUnit',
                'productSection',
                'htmlSection'
            ],
            
            nonEditableKeys: [
                // 'id',
                // 'component',
                // 'visibility',
                // 'productIDs'
            ],
            
            inputKeys: [
                'heading',
                // 'description'
            ],
            
            selectKeys: [
                'content',
                'columnsPerRow'
            ],
            
            colorPickerKeys: [
                'headingColor',
                'backgroundColor'    
            ],
            
            contentSelectOptions: [{
                label: 'Specific Products',
                value: 'specificProducts'
            }, {
                label: 'Random Products',
                value: 'randomProducts'
            }, {
                label: 'Random From Tag Products',
                value: 'randomFromTagProducts'
            }],          
            
            columnsPerRowSelectOptions: [{
                label: 'six',
                value: 'six'
            }, {
                label: 'four',
                value: 'four'
            }, {
                label: 'three',
                value: 'three'
            }, {
                label: 'two',
                value: 'two'
            }, {
                label: 'one',
                value: 'one'
            }],
            
            newSectionStructures: {
                productSection: {
                    "id": "productSection",
                    "description": "",
                    "component": "productSection",
                    "content": "randomProducts",
                    "heading": "Featured Products",
                    "headingColor": "#000",
                    "backgroundColor": "#fff",
                    "productIDs": [],
                    "columnsPerRow": "six",
                    "products": [],
                    "seeAllProducts": false,
                    "visibility": {
                        "showcase": true
                    }
                },
                htmlSection: {
                    "id": "htmlSection",
                    "component": "htmlSection",
                    "columns": [],
                    "columnsPerRow": "two",
                    "heading": "Custom Title",
                    "headingColor": "#000",
                    "backgroundColor": "#fff",
                    "visibility": {
                        "showcase": true
                    }
                }
            },
            
            newSectionStructureIDs: {
                productSection: "products",  
                htmlSection: "customHtml"  
            },
            
            customProductCardOptions: [{
                label: 'default product card',
                value: 'productCard'
            }, {
                label: 'wide image product card',
                value: 'fullWidthWideImageProductCard'
            }, {
                label: 'wide image with blurb',
                value: 'fullWidthWideImageProductCardWithBlurb'
            }, {
                label: 'two column product card',
                value: 'twoColumnProductCard'
            }, {
                label: 'two column product card with blurb',
                value: 'twoColumnProductCardWithBlurb'
            }],
            
            // customProductCards: {
            //     'default': 'productCard',
            //     'wideImageWithBlurb': 'fullWidthWideImageProductCard',
            //     'twoColumnsWithBlurb': 'twoColumnProductCardWithBlurb'
            // },
            
            customProductCardDisplayName: {
                'productCard': 'default product card',
                'fullWidthWideImageProductCard': 'wide image product card',
                'fullWidthWideImageProductCardWithBlurb': 'wide image with blurb',
                'twoColumnProductCard': 'two column product card',
                'twoColumnProductCardWithBlurb': 'two column product card with blurb'
            },
            
            currentHTMLColumnEditIndex: '',
            customProductCardDisplay: '',
            selectedSearchItems: [],
            
            collapseMap: {}
        }
    },
    
    computed: {
        environmentJson() {
            return this.$store.state.environment.json
        },
        
        homePageSections() {
            return this.$store.state.environment.json.homePageSections
        },
        
        userLoginToken() {
            return this.$store.state.user.userLoginToken
        },
        
        userInfo() {
            return this.$store.state.user.info
        },

        environmentName() {
            return this.$store.state.environment.name
        },
        
        environmentTags() {
            return this.$store.state.environmentTags
        },
        
        editableKeys() {
            return this.colorPickerKeys.concat(this.selectKeys).concat(this.inputKeys)
        },
        
        brandColor() {
            return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
        },

        toolbarStyle() {
            return 'background: ' + this.brandColor + ' !important ;'
        },
        
        homePageSectionOptions() {
            return this.homePageSections.filter((section) => {
                return this.editEnabledSections.includes(section.component)
            }).map((section) => {
                return {
                    label: section.heading ? section.heading : section.id,
                    value: section.id
                }
            })
        },
        
        currentSectionEditIndex() {
            return this.$store.state.currentSectionEditIndex
        }
    },
    
    methods: {
        addSection(type) {
            k('addSection: ', type, this.afterID)
            
            if (!this.afterID) {
                if (this.homePageSectionOptions.length) {
                    this.$q.notify({
                       message: 'Please select a section to add new section after.',
                       type: 'info',
                       icon: 'fa-info-circle',
                       position: 'bottom-left'
                    })
                } else {
                    this.afterID = 'search'
                }
            }
            
            if (type && this.afterID) {
                // make sure new section is in webpack
                Object.keys(this.newSectionStructures).forEach((key) => {
                    this.loadIt(key, 'common/showcase/' + key) 
                })
                
                // get index and splice it in
                var sectionIndex = this.j_.indexFromArray(this.homePageSections, 'id', this.afterID) || 1
                var newSection = this.j_.cloneObject(this.newSectionStructures[type])
                    newSection.id = this.newSectionStructureIDs[type] + Date.now()
                k('newSection to splice: ', sectionIndex, newSection.id)
                
                this.homePageSections.splice(sectionIndex + 1, 0, newSection)
                this.$store.commit('homePageSections', this.homePageSections)
                
                this.$store.commit('currentSectionEditIndex', sectionIndex + 1)
                
                // k('commiting new homePageSections: ', this.homePageSections)
                
                this.$root.$emit('closeNewShowcaseSectionModal')
                
                this.$nextTick(() => {
                    this.scrollToEditSection(newSection)
                })
            }
        },
        
        reorderSection(direction, sectionIndex) {
            
            // get section and splice it in
            var sectionToMove = this.j_.cloneObject(this.homePageSections)[sectionIndex]
            k('to splice: ', sectionIndex, direction, sectionIndex + direction)
            k('sectionToMove: ', sectionToMove)
            
            var freshHomePageSections = this.j_.cloneObject(this.homePageSections)
            k('reorder sections: ', freshHomePageSections)
            
            freshHomePageSections.splice(sectionIndex, 1)
            freshHomePageSections.splice(sectionIndex + direction, 0, sectionToMove)
            
            this.$store.commit('homePageSections', freshHomePageSections)
            k('after reorder sections: ', this.homePageSections)
            
            this.refreshShowcaseView()
            
            this.$nextTick(() => {
                this.scrollToEditSection(sectionToMove)
            })
        },
        
        deleteConfirm() {
            this.$q.dialog({
                title: 'Are you sure?',
                message: 'This will remove the section from the editor, but you must still save your changes above to permenently delete this section.',
                ok: {
                    label: 'Yes, DELETE',
                    color: 'red'
                },
                cancel: 'Cancel'
            }).then(() => {
                this.deleteSection()
            }).catch(() => {
                
            })
        },
        
        deleteSection() {
            this.homePageSections.splice(this.currentSectionEditIndex, 1)
            
            k('delete section: ', this.homePageSections)
            this.$store.commit('homePageSections', this.homePageSections)
        },
        
        initSectionForEditing(section, index) {
            k('now editing: ', section, index)
            
            this.$store.commit('currentSectionEditIndex', index)
            
            // if (this.environmentJson.e.customProductCard) {
            //     k('add custom product card from env!')
            //     this.customProductCards.push()
            // }
            
            this.customProductCardDisplay = section.customProductCard ? this.customProductCardDisplayName[section.customProductCard] : this.customProductCardDisplayName['productCard']
            
            this.seeAllProducts = section.seeAllProducts ? true : false
            this.scrollToEditSection(section)  
        },
      
        scrollToEditSection(section) {
            this.scrollIt(section.id, null, 110)
        },
        
        updateColor(val, index, key) {
            k('updateColor: ', val, index, key)
            
            this.homePageSections[index][key] = val.hex
        },
        
        modifyIncludedProducts() {
            this.openProductModal = true
            
            var section = this.homePageSections[this.currentSectionEditIndex]
            this.selectedSearchItems = section.products && section.products.length ? this.j_.cloneObject(section.products) : []
            
            // productCard
            if (section.customProductCard) {
                this.customProductCardDisplay = this.customProductCardDisplayName[section.customProductCard]
            } else {
                this.customProductCardDisplay = this.customProductCardDisplayName['productCard']
            }
        },   
        
        modifyIncludedCategories() {
            this.openTagModal = true
            
            var section = this.homePageSections[this.currentSectionEditIndex]
            var items = []
            if (section.categories ) {
                items = section.categories.map((id) => {
                    return this.environmentTags[id]
                })
            }
            this.selectedSearchItems = items
        },
        
        selectedItem(item) {
            if (!this.selectedSearchItems.includes(item)) {
                this.selectedSearchItems.push(item)
            }
            else {
                this.selectedSearchItems.splice(this.selectedSearchItems.indexOf(item), 1)
            }
            
            k('selectedSearchItems: ', this.selectedSearchItems)
            
            var section = this.homePageSections[this.currentSectionEditIndex]
            if (section.content === 'specificProducts') {
                section.products = this.selectedSearchItems
                section.productIDs = this.selectedSearchItems.map((item) => {
                    return item.productID
                })
            }
            
            if (section.content === 'randomFromTagProducts') {
                // section.tagsForDisplay = this.selectedSearchItems
                section.categories = this.selectedSearchItems.map((tag) => {
                    return tag.id
                })
                
                section.products = this[section.content](section)
            }
            
            this.$store.commit('homePageSections', this.homePageSections)
        },
        
        selectedCustomProductCard(val) {
            k('selectedCustomProductCard: ', val) 
            
            this.customProductCardDisplay = val
            
            this.refreshShowcaseView()
        },
        
        selectedNewContentType(val) {
            k('selectedNewContentType: ', val) 
            
            var section = this.homePageSections[this.currentSectionEditIndex]
            section.products = this[section.content](section)
            
            this.refreshShowcaseView()
        },
        
        closeEditor() {
            this.$emit('closeEditor')  
        },
        
        saveShowcase() {
            this.saveHomePageDataToDB()
            
            this.$store.commit('originalHomePageSections', '')
            this.$store.commit('editMode', false)
            
            this.refreshShowcaseView()
        },
        
        saveHomePageDataToDB() {
            var data = this.modifyHomePageDataForSave()
            
            this.sendHomePageDataToAPI(data)
            this.saveShowcaseRevision(data)
        },
        
        modifyHomePageDataForSave() {
            var data = this.j_.cloneObject(this.environmentJson)
            
            //loop through all sections and modify keys
            for (var i = 0; i < data.homePageSections.length; i++) {
                var section = data.homePageSections[i]
                
                switch (section.component) {
                    case 'productSection':
                        section.products = []
                        break;
                        
                    case 'htmlSection':
                        section.columns.forEach((obj) => {
                            if (obj.decodedHtml) delete obj.decodedHtml
                            if (obj.moreInfo) delete obj.moreInfo
                        })
                        break;
                    
                    default:
                        // code
                }
            }
            
            k('modify home page data: ', data)
            return data
        },
        
        sendHomePageDataToAPI(data) {
            // https://api-v4-dev2.platformpurple.com/api/entities/saveEnvJSON
            
            var req = {
                "environmentName": this.environmentName,
                "userLoginToken": this.userLoginToken,
                "envJSON": data
            }
            k('sendHomePageDataToAPI req: ', req)
            
            this.api.post(this.api.apiv4Route + 'api/entities/saveEnvJSON', req, (res) => {
                k('save JSON success? ', res)
                
                if (res.success) {
                    this.$q.notify({
                        message: 'Showcase saved!',
                        type: 'positive',
                        icon: 'fa-check-circle',
                        position: 'bottom-left'
                    })
                } else {
                    this.$q.notify({
                        message: 'Showcase was not saved. Please try again or contact support.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                }
            })
        },
        
        saveShowcaseRevision(data) {
            var event = {
                eventType: 'homePageJSONupdated',
                clientTimestamp: Date.now(),
                environmentName: this.environmentName,
                organizationID: this.userInfo.organizationID,
                userLoginToken: this.userLoginToken,
                homePageJSON: JSON.stringify(data)
            }
            // api.sendEvent(event)
            
            k('showcase revision obj: ', event)
            this.api.post(this.api.ioRoute + 'showcaseRevision', event, (res) => {
                ki(res)
                // _version
                if (res.error) {
                    throw res.error
                }
            })
        },
        
        refreshShowcaseView() {
            k('refreshShowcaseView')
            
            // refresh showcase view
            this.$store.commit('allComponentsForViewLoaded', false)
            this.$nextTick(() => {
                this.$store.commit('allComponentsForViewLoaded', true)
            })
        }
    }
}