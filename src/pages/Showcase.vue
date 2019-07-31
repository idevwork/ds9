<template>
    
    <div>
        <div v-if="allComponentsForViewLoaded">
            <div v-for="(section, index) in homePageSections" v-if="sectionFilter(section)" :is="section.component" :componentData="section" :sectionIndex="index" :key="section.id" />
        </div>
    </div>

</template>

<script>
    import Vue from 'vue'
    import VueAnalytics from 'vue-analytics'
    // import router from '../router'
    import { contentItemFiltering } from '../mixins/contentItemFiltering'
    import { LocalStorage } from 'quasar'

    export default {
        props: ['productID2Preview', 'tagIDs', 'playlistID', 'offerBrand', 'offerProductID'],

        name: 'showcase',

        mixins: [contentItemFiltering],

        data() {
            return {
                sectionFilter(section) {
                    return section.id !== 'nav' && (section.alwaysVisible || (section.visibility && section.visibility[this.currentView]))
                }
            }
        },

        computed: {

            environment() {
                return this.$store.state.environment
            },

            environmentData() {
                return this.$store.state.environment.data
            },
            
            homePageSections() {
                return this.$store.state.environment.json.homePageSections
            },

            currentView() {
                return this.$store.state.currentView
            },

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            allComponentsForViewLoaded() {
                return this.$store.state.allComponentsForViewLoaded
            },
            
            userSelectedTags() {
                return this.$store.state.userSelectedTags
            },
            
            goingTo() {
                return this.$store.state.goingTo
            },
        },

        methods: {
            addProductsToSection() {
                // idempotent
                var products = this.environmentProducts
                var data = this.homePageSections
                // k('addProductsToSection: ', products, data)

                if (!data || !products) return false

                for (var i = 0; i < data.length; i++) {
                    var section = data[i]
                    
                    // TODO: is there a better way of triggering this?
                    if (section.component === 'productSection' || section.component === 'productSectionCarousel') {
                        // collate based on section content
                        section.products = this[section.content](section)
                    }
                }

                // cache everything in homePageData
            },
            
            checkHomePageSectionsForViews() {
                // k('checkHomePageSectionsForCurrentView: ', this.currentView, this.homePageSections)
                
                var viewObj = {}
                this.homePageSections.forEach((section) => {
                    return section.visibility ? Object.keys(section.visibility).forEach(key => {
                        viewObj[key] = true
                    }) : ''
                })
                
                // k('viewObj: ', viewObj)
                if (!viewObj[this.currentView]) {
                    kw('VIEW DOES NOT EXIST, ROUTE TO 404')
                    this.route('/404')
                }
            }
        },

        watch: {
            currentView() {
                k('currentView: ', this.currentView)
                
                this.$store.commit('allComponentsForViewLoaded', false)
                
                if (this.homePageSections) this.loadNeededComponentsForView(() => {
                    // k('all components loaded.')
                    this.$store.commit('allComponentsForViewLoaded', true)
                })
                
                if (this.offerBrand) {
                    k('offerBrand watch: ', this.offerBrand)
                    this.$store.commit('addKeyPathInStore', { keyPath: 'offerBrand', value: String(this.offerBrand) })
                }
    
                if (this.offerProductID) {
                    k('offerProductID watch: ', this.offerProductID)
                    this.$store.commit('addKeyPathInStore', { keyPath: 'offerProductID', value: String(this.offerProductID) })
                }
            },
            
            homePageSections() {
                // k('homePageSections has changed: ', this.currentView)
                
                this.addProductsToSection()
                this.checkHomePageSectionsForViews()
                
                if (this.currentView) {
                    this.$store.commit('allComponentsForViewLoaded', false)
                    this.loadNeededComponentsForView(() => {
                        // k('all components loaded.')
                        this.$store.commit('allComponentsForViewLoaded', true)
                    })
                }
            },

            environmentProducts() {
                this.addProductsToSection()
            },

            productID2Preview() {
                k('productID2Preview watch: ', this.productID2Preview)
                if (this.productID2Preview) this.$store.commit('setProductID2Preview', this.productID2Preview)
            },

            playlistID() {
                // k('currentPlaylistID watch from showcase: ', this.playlistID)
                this.$store.commit('currentPlaylistID', this.playlistID)
            },

            tagIDs() {
                k('tagIDs watch: ', this.tagIDs)
                if (this.tagIDs) this.$store.commit('setUserSelectedTags', this.tagIDs)
            },
            
            // offerBrand() {
            //     if (this.offerBrand) {
            //         k('offerBrand watch: ', this.offerBrand)
            //         this.$store.commit('addKeyPathInStore', { keyPath: 'offerBrand', value: String(this.offerBrand) })
            //     }
            // },
            
            // offerProductID() {
            //     if (this.offerProductID) {
            //         k('offerProductID watch: ', this.offerProductID)
            //         this.$store.commit('addKeyPathInStore', { keyPath: 'offerProductID', value: String(this.offerProductID) })
            //     }
            // }
        },

        mounted() {
            // k('environmentData: ', this.environment.data)
            // k('homePageJSON: ', this.environment.json)
            // k('preview: ', this.productID2Preview)
            
            if (this.homePageSections) this.checkHomePageSectionsForViews()

            //if hitting sign in directly
            if (this.environmentProducts && this.environmentProducts.length && this.homePageSections) this.addProductsToSection()

            // to set product preview modal up
            if (this.productID2Preview) {
                k('productID2Preview init: ', this.productID2Preview)
                this.$store.commit('setProductID2Preview', this.productID2Preview)
            }
            
            // to setup offer pages
            if (this.offerBrand) {
                k('offerBrand init: ', this.offerBrand)
                this.$store.commit('addKeyPathInStore', { keyPath: 'offerBrand', value: String(this.offerBrand) })
            }

            if (this.offerProductID) {
                k('offerProductID init: ', this.offerProductID)
                this.$store.commit('addKeyPathInStore', { keyPath: 'offerProductID', value: String(this.offerProductID) })
            }

            // // to set prop for playlists
            // if (this.playlistID) {
            //     // k('currentPlaylistID init: ', this.playlistID)
            //     this.$store.commit('currentPlaylistID', this.playlistID)
            // }

            // for tagFilter direct route
            if (this.tagIDs) {
                k('tagIDs init: ', this.tagIDs)
                this.$store.commit('setUserSelectedTags', this.tagIDs)
            }

            if (this.currentView && this.homePageSections) {
                k('currentView: ', this.currentView)
                
                this.$store.commit('allComponentsForViewLoaded', false)
                this.loadNeededComponentsForView(() => {
                    // k('all components loaded.')
                    this.$store.commit('allComponentsForViewLoaded', true)
                })
            }

        }
    }
</script>

<style>
</style>