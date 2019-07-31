<template>
    
    <q-list id="tagSidebar" class="bg-white" v-if="tagHeadingsObj4Scope" style="border: none; padding-top: 0px; padding-bottom: 8px;">
        <q-list-header>
            <h5 class="float-left" style="font-size: 1rem; margin-bottom: 0.5rem; margin-top: 0.5rem;">
                Tags
                <!--<q-icon name="fa-tags" style="margin-left: 0px'" />-->
            </h5>
            <div v-if="userSelectedTags.length" class="float-right" style="padding: 0 .5rem;">
                <a @click="deselectAll()" style="cursor: pointer;">Clear tags</a>
            </div>
        </q-list-header>
    
        <!--<q-item class="row" :style="'background: ' + brandColor + ';'">-->
        <!--    <div class="col" style="padding: 0 .5rem;">-->
        <!--        <q-btn size="sm" outline class="full-width" color="white" @click="collapseAll()">collapse all</q-btn>-->
        <!--    </div>-->
        <!--    <div class="col" style="padding: 0 .5rem;">-->
        <!--        <q-btn size="sm" outline class="full-width" color="white" @click="deselectAll()">deselect all</q-btn>-->
        <!--    </div>-->
        <!--</q-item>-->
        
        <q-item-separator style="clear: both;" />
    
        <div v-for="(heading, key, index) in tagHeadingsObj4Scope" :key="key">

            <q-collapsible class="tagHeading" v-model="heading.opened" v-if="showHeading(heading)" @show="heading.opened = true" @hide="heading.opened = false">
                <template slot="header">
                    <q-item-main v-html="headingLabel(heading, key)" />
                </template>                
            
                <q-list class="full-width bg-white" highlight style="border-right: none; border-left: none; padding: 0px;">
                    <div v-if="showTag(tag)" v-for="tag in heading.tags" :key="tag.id" @click="userClickedTag(tag.id)">
                        <q-item class="child-category" :class="(userSelectedTags.includes(String(tag.id)) ? 'selected ' : '') + 'cursor-pointer tagButton'" :style="tagStyle(userSelectedTags.includes(String(tag.id)))">
                            <q-item-main>
                                <q-item-tile label>
                                    <span class="tagName" :style="`color: ${userSelectedTags.includes(String(tag.id)) ? 'white' : '#333'} !important;`">{{tag.tagName}}</span>
                                </q-item-tile>
                            </q-item-main>
            
                            <q-item-side right>
                                <span class="pchip gt-lg" :style="tagPchipStyle(userSelectedTags.includes(String(tag.id)))">{{numberOfProductsForTagName(tag.id)}}</span>
                                <span class="pchip lt-lg" :style="tagPchipStyle(userSelectedTags.includes(String(tag.id)))">{{numberOfProductsForTagName(tag.id)}}</span>
                                <q-item-tile icon="fa-tag" :color="userSelectedTags.includes(String(tag.id)) ? 'white' : 'grey'" />
                            </q-item-side>
                        </q-item>
                    </div>
                </q-list>
            </q-collapsible>
            
            <div v-for="tag in heading.tags" :key="tag.id" @click="userClickedTag(tag.id)" v-if="userSelectedTags.includes(String(tag.id)) && !heading.opened">
                <q-item class="cursor-pointer selected" style="border-top: 1px solid #fff; border-bottom: 1px solid #fff; font-size: .8rem;" :style="tagStyle(true)">
                    <q-item-main>
                        <q-item-tile label>{{tag.tagName}}</q-item-tile>
                    </q-item-main>
        
                    <q-item-side right>
                        <q-item-tile icon="fa-tag" :color="userSelectedTags.includes(String(tag.id)) ? 'white' : 'grey'" />
                    </q-item-side>
                </q-item>
            </div>
        </div>
    
    </q-list>

</template>

<script>
    import { tagSidebarTools } from '../../../mixins/tagSidebarTools'
    
    export default {
        mixins: [ tagSidebarTools ],
        
        methods: {
            deselectAll() {
                // k('userSelectedTags: ', this.userSelectedTags)
                if (!this.userSelectedTags.length) return false
    
                // this.markSelectedTags()
                this.$store.commit('setUserSelectedTags', '')
            }
        }
    }
</script>

<style scoped>
    .pchip {
        font-size: .8rem;
        background: #fff;
        color: #000;
        padding: .25rem .5rem;
        /*margin: .25rem;*/
        border-radius: .2rem;
        /*float: right;*/
    }
    
    .q-icon {
        font-size: 1rem !important;
    }
    
    .tagButton {
        background: #efefef;
    }
</style>

<style>
    .q-collapsible-sub-item {
        padding: 0;
        border-width: 0;
    }
    .q-item {
        border-top: 1px solid white;
        border-bottom: 1px solid white;
    }
    .child-category {
        padding-left: 1.5rem;
    }
    .q-item.child-category:hover {
        background-color: rgba(189,189,189,0.5);
    }
    .tagName {
        font-size: .9rem;
    }
</style>