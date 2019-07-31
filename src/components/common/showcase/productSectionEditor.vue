<template>
    <div class="row">
            
        <div class="col-12">
            <q-btn v-if="!showEditor" @click="emitShowEditorState(true)" class="float-right" size="sm" round color="grey">
                <q-icon name="fa-edit" />
                <q-tooltip anchor="center right" self="center left">
                    Edit section
                </q-tooltip>
            </q-btn>
            
            <q-btn v-else @click="emitShowEditorState(false)" class="float-right" size="sm" round color="grey">
                <q-icon name="fa-times" />
                <q-tooltip anchor="center right" self="center left">
                    Close editor
                </q-tooltip>
            </q-btn>
        </div>
        
        <inlineShowcaseEditor class="col-12" v-if="showEditor" :componentData="componentData" :sectionIndex="sectionIndex" style="margin-bottom: 1rem;" />
        
        <h2 v-if="componentData.heading && showEditor" class="col-12 dividerHeader" align="center" :style="componentData.headingColor ? 'color: ' + componentData.headingColor + ';' : ''">
            <span :style="'background: ' + (componentData.backgroundColor ? componentData.backgroundColor : '#efefef') + ';'">{{componentData.heading}}</span>
        </h2>
        
        <draggable 
            v-if="currentHomePageSection && currentHomePageSection.products.length && showEditor && currentHomePageSection.content === 'specificProducts'" 
            class="col-12 row items-stretch justify-center" 
            v-model="currentHomePageSection.products" 
            @start="drag=true" 
            @end="drag=false, updateProductIDArray()"
        >
            <div :class="currentHomePageSection.columnClass ? currentHomePageSection.columnClass : currentHomePageSection.columnsPerRow ? columnsPerRowMap[currentHomePageSection.columnsPerRow] : columnsPerRowMap['six']"
                v-for="(product, index) in currentHomePageSection.products"
                style="padding: .5rem; position: relative;"
            >
                <q-btn @click="removeProduct(index)" round size="sm" color="red" style="padding: 0 .5rem; z-index: 99; position: absolute; top: -.5rem; right: -.5rem;">
                    <q-icon name="fa-times" />
                </q-btn>
                <div :is="productCardComponent" class="productCard" :componentData="product" :notSelectable="true" />
            </div>
        </draggable>
    
    </div>
</template>

<script>

    import { productCardLoad } from '../../../mixins/productCardLoad'
    import productSectionEditor from './productSectionEditor'
    import inlineShowcaseEditor from './inlineShowcaseEditor'
    import draggable from 'vuedraggable'
    
    export default {
        props: ['componentData', 'sectionIndex', 'showEditor'],
        
        mixins: [productCardLoad],
        
        components: {
            draggable,
            inlineShowcaseEditor,
            productSectionEditor
        },
        
        data() {
            return {
                showAllProducts: false
            }
        },
        
        computed: {
            
            columnsPerRowMap() {
                return this.$store.state.columnsPerRowMap
            },
            
            editMode() {
                return this.$store.state.editMode
            },
            
            homePageSections() {
                return this.$store.state.environment.json.homePageSections
            },
            
            currentSectionEditIndex() {
                return this.$store.state.currentSectionEditIndex
            },
            
            currentHomePageSection() {
                return this.homePageSections && this.sectionIndex > -1 ? this.homePageSections[this.sectionIndex] : ''
            }
        },
        
        watch: {
            showEditor() {
                this.$emit('currentlyEditing', this.showEditor)
            }
        },
    
        methods: {
            
            removeProduct(index) {
                k('remove product: ', index)
                k('products for section: ', this.homePageSections, this.sectionIndex)
                
                this.homePageSections[this.sectionIndex].products.splice(index, 1)
                this.homePageSections[this.sectionIndex].productIDs.splice(index, 1)
                
                this.selectedSearchItems = this.homePageSections[this.sectionIndex].products
                this.$store.commit('homePageSections', this.homePageSections)
            },
            
            updateProductIDArray() {
                k('updateProductIDArray: ', this.homePageSections[this.sectionIndex].products)
                this.homePageSections[this.sectionIndex].productIDs = this.homePageSections[this.sectionIndex].products.map((item) => {
                    return item.productID
                })
                k('updateProductIDArray ids: ', this.homePageSections[this.sectionIndex].productIDs)
                this.$store.commit('homePageSections', this.homePageSections)
            },
            
            emitShowEditorState(val) {
                this.$emit('changeShowEditorState', val) 
            }
            
        },
    
        mounted() {
            k('product section componentData: ', this.componentData)
        }
    }
</script>

<style scoped>
    .editStyle {
        border: 5px dashed #999;
    }
    
    .animated-product-card {
        opacity: 0;
        position: relative;
        transform: scale(.6);
        animation: fadein 0.3s; 
        animation-fill-mode: forwards;
    }
    
    @keyframes fadein {
        from { 
            opacity: 0;
            transform: scale(.5);
        }
        to { 
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
