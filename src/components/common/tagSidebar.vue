<template>
    
    <q-list id="tagSidebar" class="bg-white" v-if="tagHeadingsObj4Scope" style="border-width: 0px; padding-top: 0px; padding-bottom: 8px;">
        <q-list-header >
            <h2 style="font-size: 1.3rem; clear: both; margin-bottom: 0.5rem; margin-top: 0.5rem; color: rgb(46, 46, 46);">
                <b>
                    Filter
                </b>

                <span v-if="userSelectedTags.length">
                    | <a @click="deselectAll()" style="color: #29859c; cursor: pointer; font-size: .9rem;">Reset</a>
                </span>
            </h2>
        </q-list-header>

        <q-item-separator style="clear: both;" />
        
        <div v-for="(heading, key, index) in tagHeadingsObj4ScopeComputed" :key="key">
            <q-collapsible 
                class="tagHeading"
                v-model="heading.opened" 
                v-if="showHeading(heading)" 
                @show="heading.opened = true" 
                @hide="heading.opened = false"
            >
                <template slot="header">
                    <q-item-main v-html="headingLabel(heading, key)" />
                </template>                
            
                <q-list class="full-width bg-white"  style="border-top: none;border-right: none; border-left: none; padding: 0px;">
                    <div v-if="showTag(tag)" v-for="tag in heading.tags" :key="tag.id" @click="userClickedTag(tag.id)">
                        <q-item 
                            class="child-category cursor-pointer tagButton" 
                            :class="(userSelectedTags.includes(String(tag.id)) ? 'selected ' : '')" 
                            :style="tagStyle(userSelectedTags.includes(String(tag.id)))"
                        >
                            <q-item-main>
                                <q-item-tile label>
                                    <span 
                                    class="tagName" 
                                    :style="`color: ${userSelectedTags.includes(String(tag.id)) ? 'white' : '#2e2e2e'} !important;`"
                                >
                                    {{tag.tagName}}
                                    
                                    <span :style="`color: ${userSelectedTags.includes(String(tag.id)) ? 'white' : '#969696'} !important;`">
                                        ({{numberOfProductsForTagName(tag.id)}})
                                    </span>
                                </span>
                                </q-item-tile>
                            </q-item-main>
                        </q-item>
                    </div>
                </q-list>
            </q-collapsible>
            
            <div v-for="tag in heading.tags" :key="tag.id" @click="userClickedTag(tag.id)" v-if="userSelectedTags.includes(String(tag.id)) && !heading.opened">
                <q-item 
                    class="child-category cursor-pointer tagButton" 
                    :class="(userSelectedTags.includes(String(tag.id)) ? 'selected ' : '')" 
                    :style="tagStyle(true)"
                >
                    <q-item-main>
                        <q-item-tile label>
                            <span 
                            class="tagName" 
                            :style="`color: ${userSelectedTags.includes(String(tag.id)) ? 'white' : '#2e2e2e'} !important;`"
                        >
                            {{tag.tagName}}
                            
                            <span :style="`color: ${userSelectedTags.includes(String(tag.id)) ? 'white' : '#969696'} !important;`">
                                ({{numberOfProductsForTagName(tag.id)}})
                            </span>
                        </span>
                        </q-item-tile>
                    </q-item-main>
                </q-item>
            </div>
        </div>

    </q-list>

</template>

<script>
    import { tagSidebarTools } from '../../mixins/tagSidebarTools'
    
    export default {
        mixins: [ tagSidebarTools ]
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
    
</style>

<style>
    .q-collapsible-sub-item {
        padding: 0;
        border-width: 0;
    }
    .q-item {
        border-top: 1px solid white;
    }
    .q-item.child-category:hover {
        background-color: rgba(189,189,189,0.5);
    }
    .child-category {
        padding-left: 1.5rem;
    }
    .tagName {
        font-size: .9rem;
    }
</style>