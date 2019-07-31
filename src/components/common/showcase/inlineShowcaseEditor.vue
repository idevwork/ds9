<template>
    
    <div id="inlineShowcaseEditor" class="shadow-1 bg-grey-3">
        <!--{{editableKeys}}-->
        <div class="row" no-border style="padding: 1rem;">
            <div class="col-12">
                <h5 class="thickHeader">
                    <q-btn @click="showInstructions = true" color="purple" size="xs" round style="vertical-align: text-top;">
                        <q-icon name="fa-question" />
                    </q-btn>
                    Edit '{{componentData.heading}}' Section
                </h5>
            </div>
            
            <div class="col-xs-12 col-sm-6 col-md-4 row">
                <div class="col" style="padding: .5rem;">
                    <q-btn color="grey" class="full-width" @click="reorderSection(-1, sectionIndex)">
                        Move <q-icon name="fa-arrow-up" style="margin-left: .5rem;" />
                    </q-btn>
                </div>
                <div class="col" style="padding: .5rem;">
                    <q-btn color="grey" class="full-width" @click="reorderSection(1, sectionIndex)">
                        Move <q-icon name="fa-arrow-down" style="margin-left: .5rem;" />
                    </q-btn>
                </div>
            </div>
            
            <div :class="classForKey(key)" v-for="key in editableKeys" :key="key" v-if="Object.keys(homePageSections[sectionIndex]).includes(key)" style="padding: .5rem;">
                
                <q-input :id="key" v-if="inputKeys.includes(key)" :float-label="keyDisplayNames[key]" v-model="homePageSections[sectionIndex][key]" style="width: 100%; margin: 0;" />
                
                <p :id="key" v-if="nonEditableKeys.includes(key)" style="width: 100%; margin: 0;"><strong>{{keyDisplayNames[key]}}:</strong> {{homePageSections[sectionIndex][key]}}</p>
                
                <q-select 
                    v-if="key === 'content'" 
                    v-model="homePageSections[sectionIndex][key]" 
                    :id="key" 
                    :float-label="keyDisplayNames[key]" 
                    :options="contentSelectOptions" 
                    @input="selectedNewContentType(homePageSections[sectionIndex][key])"
                    style="width: 100%; margin: 0;" 
                />
                
                <q-select 
                    :id="key" 
                    v-if="key === 'columnsPerRow'" 
                    :float-label="keyDisplayNames[key]" 
                    v-model="homePageSections[sectionIndex][key]" 
                    :options="columnsPerRowSelectOptions" 
                    style="width: 100%; margin: 0;" 
                />
                
                <div :id="key" v-if="key === 'columns'" class="full-width row">
                    <strong class="col-12">Columns <q-icon name="fa-plus" @click.native="addHTMLColumn()" style="margin-left: .5rem; cursor: pointer;" /></strong>
                    <h6 v-if="!homePageSections[sectionIndex][key].length">No columns yet. Add one: <q-icon name="fa-plus" @click.native="addHTMLColumn()" style="margin-left: .5rem; cursor: pointer;" /></h6>
                    
                    <div v-else v-for="(column, sectionIndex) in homePageSections[sectionIndex][key]" :class="homePageSections[sectionIndex].columnsPerRow ? columnsPerRowMap[homePageSections[sectionIndex].columnsPerRow] : columnsPerRowMap['six']" >
                        <q-card style="height: calc(100% - 1rem);">
                            <q-card-title style="padding: 0;">
                                <q-btn @click="editHTMLColumn(sectionIndex)" class="float-left" size="sm" flat style="padding: .5rem;">
                                    <q-icon name="fa-edit" />
                                </q-btn>
                                
                                <q-btn @click="deleteHTMLColumn(sectionIndex)" class="float-right" size="sm" flat style="padding: .5rem;">
                                    <q-icon name="fa-times" color="red" />
                                </q-btn>
                            </q-card-title>
                            
                            <q-card-main style="padding: .5rem;" v-html="column.decodedHtml"></q-card-main>
                        </q-card>
                    </div>
                </div>
                
                <div :id="key" v-if="colorPickerKeys.includes(key)" style="width: 100%;">
                    <q-btn color="grey" class="full-width">
                        {{keyDisplayNames[key]}}
                        <q-popover>
                            <div style="padding: .5rem;">
                                <chrome-picker :value="homePageSections[sectionIndex][key]" @input="updateColor($event, sectionIndex, key)" style="width: 100%;" />
                            </div>
                        </q-popover>
                    </q-btn>
                </div>
                
            </div>
            
            <div class="col-12 row">
                <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                    <q-input 
                        id="description" 
                        :float-label="keyDisplayNames['description']" 
                        v-model="homePageSections[sectionIndex]['description']" 
                        color="grey" 
                        style="width: 100%; margin: 0;" 
                    />
                </div>
                
                <div class="col-sm-12 col-md-6" v-if="homePageSections[sectionIndex].component === 'productSection'" style="padding: .5rem;">
                    <q-select 
                        :float-label="keyDisplayNames['customProductCard']" 
                        v-model="homePageSections[sectionIndex].customProductCard" 
                        :display-value="customProductCardDisplay"
                        color="grey" 
                        :options="customProductCardOptions"
                        @input="selectedCustomProductCard"
                        style="margin: 0;" 
                    />
                </div>
                
                <div class="col-xs-12 col-md" style="padding: .5rem;" v-if="homePageSections[sectionIndex].component === 'productSection'">
                    <q-btn 
                        @click="seeAllProducts = !seeAllProducts, homePageSections[sectionIndex].seeAllProducts = seeAllProducts" 
                        color="grey" 
                        class="full-width"
                    >
                        {{seeAllProducts ? 'Hide' : 'Show'}} 'Browse All' Button
                    </q-btn>
                </div>
                
                <div class="col-xs-12 col-md" style="padding: .5rem;">
                    <q-btn @click="deleteConfirm(homePageSections[sectionIndex].id)" color="red" class="full-width">
                        <q-icon name="fa-times" color="white" style="margin-right: .5rem;" /> Delete Section
                    </q-btn>
                </div>         
                
                <div class="col-xs-12 col-md" style="padding: .5rem;">
                    <q-btn @click="saveShowcase()" color="green" class="full-width">
                        <q-icon name="fa-save" color="white" style="margin-right: .5rem;" /> Save Section
                    </q-btn>
                </div>
            </div>
            
            <div v-if="homePageSections[sectionIndex].component === 'productSection'" class="col-12" align="center" style="padding: .5rem;">
                <q-btn v-if="homePageSections[sectionIndex].content === 'specificProducts'" color="grey" class="full-width" @click="modifyIncludedProducts(sectionIndex)">
                    <q-icon name="fa-plus" style="margin-right: .5rem;" />
                    Modify products
                </q-btn>                
                
                <q-btn v-if="homePageSections[sectionIndex].content === 'randomFromTagProducts'" color="grey" class="full-width" @click="modifyIncludedCategories(sectionIndex)">
                    <q-icon name="fa-plus" style="margin-right: .5rem;" />
                    Modify tags
                </q-btn>
            </div>

        </div>
            
        <q-modal 
            v-model="openProductModal" 
            :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout class="bg-grey-3">
                <q-toolbar slot="header" :style="toolbarStyle">
                    <q-btn flat @click="openProductModal = false">
                        <q-icon name="fa-chevron-left" />
                    </q-btn>
                    <div class="q-toolbar-title">
                       Add Products
                    </div>
                </q-toolbar>
                
                <div v-if="sectionIndex" class="row" style="padding: 1rem;">
                    
                    <div class="col-sm-12">
                        <p align="center">Search for products to add, or remove products by selecting the 'x' icon</p>
                        <Searchselect 
                            v-if="environmentProducts" 
                            @selected="selectedItem($event)" 
                            :searchSelection="environmentProducts" 
                            :key2search="'searchString'" 
                            :keys2show="['productID', 'productSKU', 'productName']" 
                            :selectedSearchItems="selectedSearchItems" 
                            :singleSelect="true" 
                            style="max-height: 65vh; overflow: auto;"
                        />
                    </div>
                    
                </div>
            </q-modal-layout>
        </q-modal>
        
        <q-modal
            v-model="openTagModal" 
            :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout class="bg-grey-3">
                <q-toolbar slot="header" :style="toolbarStyle">
                    <q-btn flat @click="openTagModal = false">
                        <q-icon name="fa-chevron-left" />
                    </q-btn>
                    <div class="q-toolbar-title">
                       Modify Tags
                    </div>
                </q-toolbar>
                
                <div v-if="sectionIndex" class="row" style="padding: 1rem;">
                    
                    <div class="col-sm-12">
                        <p align="center">Search for tags to add, or remove tags by selecting the 'x' icon</p>
                        <Searchselect 
                            v-if="environmentTagArray" 
                            customName="tagName" 
                            @selected="selectedItem($event)" 
                            :searchSelection="environmentTagArray" 
                            :key2search="'tagName'" 
                            :keys2show="['tagName', 'id', 'tagHeadingName']" 
                            :selectedSearchItems="selectedSearchItems" 
                            :singleSelect="true"
                            style="max-height: calc(80vh - 8rem); overflow: auto;"
                        />
                    </div>
                    
                </div>
            </q-modal-layout>
        </q-modal>
        
        <q-modal
            v-model="showInstructions" 
            :content-css="{minWidth: '80vw', minHeight: '80vh'}"
        >
            <q-modal-layout class="bg-grey-3">
                <q-toolbar slot="header" :style="toolbarStyle">
                    <q-btn flat @click="showInstructions = false">
                        <q-icon name="fa-chevron-left" />
                    </q-btn>
                    <div class="q-toolbar-title">
                       How do I use the section editor?
                    </div>
                </q-toolbar>
                
                <div style="padding: 1rem;">
                    
                    <p>
                        You are currently editing this section! Tap the
                        <q-btn size="sm" round color="grey">
                            <q-icon name="fa-times" />
                        </q-btn>
                        in the top right of the editor to close it.
                    </p>
                    <p>
                        There are a couple things you can edit here:
                    </p>
                    <ul>
                        <li>
                            <p>
                                Reorder: tap
                                <q-btn color="grey" size="sm">
                                    Move
                                    <q-icon name="fa-arrow-up" style="margin-left: .5rem;" />
                                </q-btn>
                                <q-btn color="grey" size="sm">
                                    Move
                                    <q-icon name="fa-arrow-down" style="margin-left: .5rem;" />
                                </q-btn>
                                to change placement of current section
                            </p>
                        </li>
                        <li>
                            <p>Heading: edit text to modify section title</p>
                        </li>
                        <li v-if="!homePageSections[sectionIndex].columns">
                            <p>Section Content: tap to select a section content type</p>
                        </li>
                        <li>
                            <p>Heading Title Color: tap on the color swatch to modify section text color</p>
                        </li>
                        <li>
                            <p>Background Color: tap on the color swatch to modify section background color</p>
                        </li>
                        <li>
                            <p>Columns Per Row: select an option to edit the number of columns for products in the section</p>
                        </li>
                        <li v-if="!homePageSections[sectionIndex].columns">
                            <p>Product Card: select an option to change the product card template for this section</p>
                        </li>
                        <li v-if="!homePageSections[sectionIndex].columns">
                            <p>
                                Browse All: tap
                                <q-btn color="grey" size="sm">
                                    <q-icon v-if="seeAllProducts" name="fa-check-circle" style="margin-right: .5rem;" /> {{seeAllProducts ? 'Hide' : 'Show'}} 'Browse All' Button
                                </q-btn>
                                to toggle 'browse all' button within section
                            </p>
                        </li>
                        <li>
                            <p>
                                <q-btn v-if="homePageSections[sectionIndex].content === 'specificProducts'" size="sm" color="grey">
                                    <q-icon name="fa-plus" style="margin-right: .5rem;" /> Modify products
                                </q-btn>
                    
                                <q-btn v-if="homePageSections[sectionIndex].content === 'randomFromTagProducts'" size="sm" color="grey">
                                    <q-icon name="fa-plus" style="margin-right: .5rem;" /> Modify tags
                                </q-btn>
                    
                                <q-btn size="sm" v-if="homePageSections[sectionIndex].columns" align="center">
                                    <q-icon name="fa-plus" style="margin-right: .5rem;" />
                                    <h6>Add New Column!</h6>
                                </q-btn>
                    
                                to modify the contents of this section
                            </p>
                        </li>
                    
                        <li>
                            <p>
                                <q-btn color="red" size="sm">
                                    <q-icon name="fa-times" color="white" style="margin-right: .5rem;" /> Delete Section
                                </q-btn>
                                delete this section (also saves all data to custom home page database)
                            </p>
                        </li>
                        <li>
                            <p>
                                <q-btn color="green" size="sm">
                                    <q-icon name="fa-save" color="white" style="margin-right: .5rem;" /> Save Section
                                </q-btn>
                                save this section and all data to custom home page database
                            </p>
                        </li>
                    
                    </ul>
                    
                </div>
            </q-modal-layout>
        </q-modal>
        
    </div>
    
</template>

<script>
    import draggable from 'vuedraggable'
    import { Chrome } from 'vue-color'
    
    import { showcaseEditing } from '../../../mixins/showcaseEditing'
    
    import Searchselect from '../Searchselect'

    export default {
        props: ['componentData', 'sectionIndex'],
        
        mixins: [showcaseEditing],
    
        data() {
            return {
                classForKey(key) {
                    var classForKey = 'col-sm-6 col-md-4'
                    // if (key === 'headingColor' || key === 'backgroundColor') classForKey = 'col-sm-6 col-md-4'
                    return classForKey
                },
                
                editorOptions: {
                    // modules: {
                    //     toolbar: [
                    //       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    //       [{ 'size': ['small', false, 'large', 'huge'] }],
                    //       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    //       [{ 'align': [] }],
                    //       [{ 'indent': '-1' }, { 'indent': '+1' }],
                    //       [{ 'color': [] }, { 'background': [] }],
                    //       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    //       ['clean']
                    //     ]
                    // }
                },

                showAddProduct: false,
                
                sectionLabel(section) {
                    return section.heading ? section.heading : section.id + ' (' + this.sectionDisplayNames[section.component] + ')'
                },
                
                showInstructions: false
            }
        },
    
        components: {
            'chrome-picker': Chrome,
            draggable,
            Searchselect
        },
    
        computed: {
            
            rowStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#fff') + '; padding: 0 1rem 1rem;'
            },
            
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
            
            environmentTagArray() {
                var arr = []
                if (this.environmentTags) Object.keys(this.environmentTags).forEach(tagKey => {
                    arr.push(this.environmentTags[tagKey])
                })
                return arr
            },
            
            columnsPerRowMap() {
                return this.$store.state.columnsPerRowMap
            }
        },
        
        // watch: {
        //     homePageSections: {
        //         handler() {
        //             this.refreshShowcaseView()      
        //         },
        //         deep: true
        //     }
        // },
    
        mounted() {
            // console.log('componentData: ', this.componentData)
            k('inlineShowcaseEditor mounted: ', this.sectionIndex)
            
            if (this.sectionIndex) {
                this.initSectionForEditing(this.componentData, this.sectionIndex)
            }
        }
    }
</script>

<style>

</style>