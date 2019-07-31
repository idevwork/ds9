<template>
    
    <q-layout v-if="environmentData && environmentJson && sessionLogObj" view="lHH lpR lfr" v-model="sides" :reveal="reveal">

        <q-layout-header>
            <topHomeNav />
        </q-layout-header>
    
        <!--<q-layout-drawer v-if="userEditEnvironment && currentView === 'showcase'" v-model="sides.right" side="right" :content-style="{ width: '400px'}">-->
        <!--    <showcaseEditor v-if="sides.right" @closeEditor="cancelShowcaseEdit()" />-->
        <!--</q-layout-drawer>-->
    
        <transition name="component-fade" mode="out-in">
            <q-page-container>
                <!--<div class="row" v-if="userEditEnvironment && currentView === 'showcase'" style="background: #777 !important;">-->
                <!--    <div class="col-12" align="center">-->
                <!--        <q-btn id="editShowcase" color="white" style="color: black !important; margin: .5rem;" @click="sides.right ? cancelShowcaseEdit() : editShowcase()">-->
                <!--            <q-icon :name="sides.right ? 'fa-times' : 'fa-edit'" style="margin-right: .5rem;" /> -->
                <!--            {{sides.right ? 'Stop editing' : 'Edit this showcase!'}}-->
                <!--        </q-btn>-->
                <!--    </div>-->
                <!--</div>-->
                <router-view class="layout-view" />
            </q-page-container>
        </transition>
    
        <q-page-sticky position="top-right" :offset="[10, 10]" style="z-index: 9;">
            <q-btn
                v-if="!editMode && !preventShowcaseEdit && userEditEnvironment && currentView === 'showcase'"
                round
                size="md"
                icon="fa-edit"
                color="green"
                @click="editShowcase()"
            >
                <q-tooltip anchor="bottom middle" self="top right">
                    Edit showcase
                </q-tooltip>
            </q-btn>          
            <q-btn
                v-if="editMode"
                round
                size="md"
                icon="fa-times"
                color="grey"
                @click="cancelShowcaseEdit()"
            >
                <q-tooltip anchor="bottom middle" self="top right">
                    Cancel edit
                </q-tooltip>
            </q-btn>
        </q-page-sticky>
          
        <q-page-sticky position="top-right" :offset="[59, 10]" style="z-index: 9;">
            <q-btn
                v-if="editMode"
                round
                size="md"
                icon="fa-save"
                color="green"
                @click="saveShowcase()"
            >
                <q-tooltip anchor="bottom middle" self="top right">
                    Save showcase
                </q-tooltip>
            </q-btn>
        </q-page-sticky>   
        
        <q-page-sticky position="top-right" :offset="[110, 10]" style="z-index: 9;">
            <q-btn
                v-if="editMode"
                round
                size="md"
                icon="fa-plus"
                color="primary"
                @click="addNewShowcaseSection()"
            >
                <q-tooltip anchor="bottom middle" self="top right">
                    Add new section
                </q-tooltip>
            </q-btn>
        </q-page-sticky>
       
        <q-page-sticky position="bottom-right" :offset="[7, 75]">
            <q-btn
                v-back-to-top.animate="{offset: 500, duration: 200}"
                round
                size="lg"
                icon="fa-chevron-up"
                :style="backToTopStyle"
            />
        </q-page-sticky>
    
        <productPreviewModal />
        <shopCartModal />
        <giftBoxEditModal />
        <playerModal />
        
        <q-modal
            v-model="newShowcaseSectionModal" 
            :content-css="{minWidth: '80vw', minHeight: '50vh'}"
        >
            <q-modal-layout>
                <q-toolbar slot="header" :style="toolbarStyle">
                    <q-btn flat @click="newShowcaseSectionModal = false">
                        <q-icon name="fa-chevron-left" />
                    </q-btn>
                    <div class="q-toolbar-title">
                       Add New Showcase Section
                    </div>
                </q-toolbar>
                
                <div class="row" style="padding: 1rem;">
                    <div class="col-12" style="padding: .5rem;">
                        You can add a new section by selecting a current section to add the new one after, and a section type to add:
                    </div>
                    
                    <div class="col-sm-12" style="padding: .5rem;">
                        <q-select 
                            v-if="homePageSectionOptions.length"
                            float-label="Add new section after: " 
                            class="inputBox" 
                            color="grey"
                            v-model="afterID" 
                            :options="homePageSectionOptions" 
                            style="margin: 0 0 .5rem 0;" 
                        />
                    </div>
                                        
                    <div class="col-sm-12" style="padding: 0 .5rem;">
                        
                        <div v-for="item in newSectionStructures" :key="item.id" style="padding: .5rem 0;">
                            <q-btn @click="addSection(item.component)" color="grey" class="full-width">
                                <h6>
                                    <q-icon name="fa-plus" style="margin-right: .5rem;" />
                                    {{sectionDisplayNames[item.component]}}
                                </h6>
                            </q-btn>
                        </div>
                    </div>
                    
                </div>
            </q-modal-layout>
        </q-modal>
    </q-layout>
    
</template>

<script>
import { openURL } from 'quasar'

import topHomeNav from '../components/common/topHomeNav'
import productPreviewModal from '../components/common/productPreviewModal'
import shopCartModal from '../components/common/shopCartModal'
import giftBoxEditModal from '../components/common/giftBoxEditModal'
import playerModal from '../components/common/playerModal'
// import showcaseEditor from '../components/common/showcase/showcaseEditor'
import { showcaseEditing } from '../mixins/showcaseEditing'

export default {
    name: 'LayoutDefault',
    
    data() {
        return {
            newShowcaseSectionModal: false,
            sides: {
                left: false,
                right: false
            },
            reveal: true
        }
    },
    
    mixins: [showcaseEditing],
    
    components: {
        topHomeNav,
        productPreviewModal,
        shopCartModal,
        giftBoxEditModal,
        playerModal,
        // showcaseEditor
    },
    
    computed: {
        userInfo() {
            return this.$store.state.user.info
        },

        environmentData() {
            return this.$store.state.environment.data
        },

        environmentJson() {
            return this.$store.state.environment.json
        },

        backToTopStyle() {
            return (this.environmentJson && this.environmentJson.e.brandColor ? 'background: ' + this.environmentJson.e.brandColor + ';' : 'background: #564F8A !important;') + ' margin: 0px 1rem 1rem 0px; color: white;'
        },
        
        currentView() {
            return this.$store.state.currentView
        },
        
        userEditEnvironment() {
            // go through userOrgs to collate afiliateIDs
            var affiliates = []
            if (this.userInfo) {
                if (this.userInfo.userOrgs || this.userInfo.userOrgs.length) this.userInfo.userOrgs.forEach((org) => {
                    if (org.affiliates) {
                        var orgAffiliates = org.affiliates.split(',')
                        // kw('orgAffiliates: ', orgAffiliates)
                        orgAffiliates.forEach((orgAfiliate) => {
                            if (affiliates.indexOf(orgAfiliate) == -1) affiliates.push(orgAfiliate)
                        })
                    }
                })
            }
            
            // compare affiliates to e.affiliateID
            // if (affiliates.indexOf(String(this.environmentData.affiliateID)) > -1) self.set('userCanEditEnvironment', true)
            return affiliates.includes(String(this.environmentData.affiliateID)) ? true : false
        },
        
        preventShowcaseEdit() {
            return this.$store.state.environment.json.e.preventShowcaseEdit  
        },
        
        editMode() {
            return this.$store.state.editMode
        },
        
        homePageSections() {
            return this.$store.state.environment.json.homePageSections
        },
        
        originalHomePageSections() {
            return this.$store.state.originalHomePageSections
        },
        
        navBarData() {
            return this.$store.state.navBarData
        },
        
        firstVisitToEnvironment() {
            return this.$store.state.firstVisitToEnvironment
        },
        
        sessionLogObj() {
            return this.$store.state.sessionLogObj
        }
    },
    
    // created () {
    //   console.log('created in default is called')  
    // },
    
    methods: {
        openURL,
        
        cancelShowcaseEdit() {
            k('cancelShowcaseEdit!')
            this.$store.commit('homePageSections', this.originalHomePageSections)
            this.$store.commit('originalHomePageSections', '')
            this.$store.commit('editMode', false)
        },

        editShowcase() {
            // make copy of homePageSections
            this.$store.commit('originalHomePageSections', this.j_.cloneObject(this.homePageSections))
            this.$store.commit('editMode', true)
            
            this.$root.$on('closeNewShowcaseSectionModal', () => {
                // kw('closeNewShowcaseSectionModal')
                this.newShowcaseSectionModal = false
            })
        },
        
        addNewShowcaseSection() {
            k('addNewShowcaseSection')
            this.newShowcaseSectionModal = true
        }
    },
    
    watch: {
        environmentData() {
            kw('environmentData: ', this.environmentData)
        },
        
        environmentJson() {
            kw('environmentJson: ', this.environmentJson)
        },
        
        sessionLogObj() {
            kw('sessionLogObj: ', this.sessionLogObj)
        },
        
        editMode() {
            this.sides.right = !this.sides.right
        },
    }
}
</script>

<style>
</style>
