<template>
    
    <div :id="componentData.id" :style="productSectionStyle">
        <div class="row well items-stretch justify-center relative-position" :style="showEditor ? 'border: 5px dashed #999;' : ''">
            
            <div v-if="editMode" style="position: absolute; top: 1rem; right: 1rem;">
                <q-btn v-if="!showEditor" @click="showEditor = true" class="float-right" size="sm" round color="grey">
                    <q-icon name="fa-edit" />
                    <q-tooltip anchor="center right" self="center left">
                        Edit section
                    </q-tooltip>
                </q-btn>
                
                <q-btn v-else @click="showEditor = false" class="float-right" size="sm" round color="grey">
                    <q-icon name="fa-times" />
                    <q-tooltip anchor="center right" self="center left">
                        Close editor
                    </q-tooltip>
                </q-btn>
            </div>
            
            <inlineShowcaseEditor class="col-12" v-if="showEditor" :componentData="componentData" :sectionIndex="sectionIndex" style="margin-bottom: 1rem;" />
            
            <h2 v-if="componentData.heading" class="full-width dividerHeader" align="center">
                <span :style="'background: ' + (componentData.backgroundColor ? componentData.backgroundColor : '#efefef') + ';' + (componentData.headingColor ? 'color: ' + componentData.headingColor + ';' : '')">{{componentData.heading}}</span>
            </h2>
            
            <p v-if="componentData.description" align="center" class="col-12" :style="componentData.headingColor ? 'color: ' + componentData.headingColor + ';' : ''">{{componentData.description}}</p>
            
            <div
                v-if="!showEditor"
                :class="componentData.columnsPerRow ? columnsPerRowMap[componentData.columnsPerRow] : columnsPerRowMap['six']"  
                v-for="column in columns2show" 
                :key="column.decodedHtml" 
                v-html="column.decodedHtml" 
                style="padding: 1rem;" 
            />
            
            <div v-if="showEditor && !columns2show.length" align="center">
                <h6>Add your first column: </h6>
                <q-btn @click="addHTMLColumn()" round style="margin: .5rem;">
                    <q-icon name="fa-plus" />
                </q-btn>
            </div>

            <draggable v-if="showEditor && columns2show.length"  class="col-12 row items-stretch justify-center" v-model="homePageSections[sectionIndex].columns" @start="drag=true" @end="drag=false">
                <div 
                    v-if="showEditor && columns2show.length" 
                    v-for="(column, columnIndex) in homePageSections[sectionIndex].columns" 
                    :class="homePageSections[sectionIndex].columnsPerRow ? columnsPerRowMap[homePageSections[sectionIndex].columnsPerRow] : columnsPerRowMap['six']" 
                >
                    <q-card style="height: calc(100% - 1rem);">
                        <q-card-title v-if="currentHTMLColumnEditIndex !== columnIndex" style="padding: 0;">
                            <q-btn @click="editHTMLColumn(columnIndex)" class="float-left" size="sm" flat style="padding: .5rem;">
                                <q-icon name="fa-edit" />
                            </q-btn>
                            
                            <q-btn @click="deleteHTMLColumn(columnIndex)" class="float-right" size="sm" flat style="padding: .5rem;">
                                <q-icon name="fa-times" color="red" />
                            </q-btn>
                        </q-card-title>
                        
                        <q-card-main v-if="currentHTMLColumnEditIndex !== columnIndex" style="padding: .5rem;" v-html="column.decodedHtml"></q-card-main>
                        
                        <div v-if="currentHTMLColumnEditIndex === columnIndex">
                            <quill-editor 
                                ref="htmlTextEditor" 
                                v-model="homePageSections[sectionIndex].columns[currentHTMLColumnEditIndex].decodedHtml" 
                                :options="editorOptions" 
                                @input="htmlChanged"
                            />
    
                            <q-btn color="grey" class="full-width" @click="currentHTMLColumnEditIndex = null">
                                <h6>Finished Editing</h6>
                            </q-btn>
                        </div>
                    </q-card>                
                    
                </div>
                
                <div 
                    v-if="showEditor" 
                    :class="homePageSections[sectionIndex].columnsPerRow ? columnsPerRowMap[homePageSections[sectionIndex].columnsPerRow] : columnsPerRowMap['six']" 
                >
                    <q-card @click.native="addHTMLColumn()" style="height: calc(100% - 1rem); cursor: pointer;" align="center">
                        <q-card-main>
                            <q-icon name="fa-plus" /> 
                            <h5>Add New Column!</h5>
                        </q-card-main>
                    </q-card>
                </div>
            </draggable>
            
        </div>
    </div>

</template>

<script>
    import inlineShowcaseEditor from './inlineShowcaseEditor'
    
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    
    import { quillEditor } from 'vue-quill-editor'
    import draggable from 'vuedraggable'
    
    export default {
        props: ['componentData', 'sectionIndex'],
        
        components: {
            inlineShowcaseEditor,
            quillEditor,
            draggable
        },
    
        data() {
            return {
                showEditor: false,
                columns2show: [],
                openHTMLModal: false,
                currentHTMLColumnEditIndex: '',
                
                editorOptions: {
                    modules: {
                        toolbar: [
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        //   [{ 'size': ['small', false, 'large', 'huge'] }],
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          [{ 'align': [] }],
                          [{ 'indent': '-1' }, { 'indent': '+1' }],
                          [{ 'color': [] }, { 'background': [] }],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ]
                    }
                },
            }
        },
    
        computed: {
            productSectionStyle() {
                return 'background: ' + (this.componentData.backgroundColor || '#efefef') + '; position: relative;'
            },
            
            columnsPerRowMap() {
                return this.$store.state.columnsPerRowMap
            },
            
            editMode() {
                return this.$store.state.editMode
            },
            
            homePageSections() {
                return this.$store.state.environment.json.homePageSections
            },
            
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },
            
            toolbarStyle() {
                return 'background: ' + this.brandColor + ' !important ;'
            },
            
            currentSectionEditIndex() {
                return this.$store.state.currentSectionEditIndex
            }
        },
        
        watch: {
            editMode() {
                this.showEditor = false
            }
        },
    
        methods: {
            setupColumns() {
                var columns = this.componentData.columns
                k('setupColumns: ', columns)
    
                if (columns.length) {
                    this.setDisplayHTML()
                }
            },
    
            setDisplayHTML() {
                this.columns2show = this.componentData.columns.map((obj) => {
                    obj.decodedHtml = atob(obj.html)
                    k('columns obj: ', obj)
                    return obj
                })
            },
            
            addHTMLColumn() {
                k('addHTMLColumn: ', this.homePageSections[this.sectionIndex].columns)
                
                this.homePageSections[this.sectionIndex].columns.push({
                    decodedHtml: '<p>Edit me!</p>',
                    html: 'PHA+RWRpdCBtZSE8L3A+'
                })
                this.$store.commit('homePageSections', this.homePageSections)
                
                this.refreshShowcaseView()
            },
            
            editHTMLColumn(columnIndex) {
                k('editHTMLColumn: ', this.sectionIndex, columnIndex)
                
                this.currentHTMLColumnEditIndex = columnIndex
                // this.openHTMLModal = true
            },
            
            deleteHTMLColumn(columnIndex) {
                k('deleteHTMLColumn: ', this.homePageSections[this.sectionIndex])
                
                this.homePageSections[this.sectionIndex].columns.splice(columnIndex, 1)
                this.$store.commit('homePageSections', this.homePageSections)
                
                this.setupColumns()  
            },
            
            htmlChanged(val) {
                val = val.replace(/’|‘/g, "'").replace(/“|”/g,'"')
                k('htmlChanged: ', val)  
                k('current edit indices: ', this.sectionIndex, this.currentHTMLColumnEditIndex)
                
                var sections = this.j_.cloneObject(this.homePageSections)
                k('sections: ', sections)
                
                var section = sections[this.sectionIndex].columns[this.currentHTMLColumnEditIndex]
                k('section: ', section)
                
                section.decodedHtml = val
                k('section decodedHtml: ', section.decodedHtml)
                
                section.html = btoa(val)
                k('section html: ', section.html)
                
                this.$store.commit('homePageSections', sections)
                
                // k('current html context: ', section)
                // k('current html columns: ', sections[this.sectionIndex].columns)
            },
            
            refreshShowcaseView() {
                // refresh showcase view
                this.$store.commit('allComponentsForViewLoaded', false)
                this.$nextTick(() => {
                    this.$store.commit('allComponentsForViewLoaded', true)
                })
            }
        },

        mounted() {
            this.setupColumns()
            
            // if this is mounted while edit mode is on
            if (this.editMode && this.sectionIndex === this.currentSectionEditIndex) {
                k('EDIT THIS')
                this.showEditor = true
                this.scrollIt(this.componentData.id, null, 110)
            }
        }
    }
</script>

<style>
    .ql-container {
        min-height: 150px;
    }
</style>

