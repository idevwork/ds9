<template>

    <q-list id="tagSidebar" no-border v-if="tagHeadingsObj4Scope" style="border-radius: .2rem; padding-top: 0px; padding-bottom: 8px;">

        <div class="col-12 q-pa-sm" align="center" style="min-height: 3rem;">
            <q-btn v-if="ownedAndPlayableProducts.length" outline color="white" size="md" class="cursor-pointer tagButton full-width" @click="showOnlyOwnedAndPlayable = !showOnlyOwnedAndPlayable">
                <h6 class="text-white" style="font-size: .9rem;">
                    <!--<q-icon :name="showOnlyOwnedAndPlayable ? 'fas fa-check-circle' : 'far fa-circle'" color="white" />-->
                    {{showOnlyOwnedAndPlayable ? 'Show All Products' : 'Only Show My Products'}}
                </h6>
            </q-btn>
        </div>

        <div style="border-bottom: 1px solid #ccc; margin: .5rem;"></div>

        <q-btn flat size="lg" class="cursor-pointer tagButton full-width" @click="deselectAll()">
            <h6 class="text-white">SHOW ALL</h6>
        </q-btn>

        <div v-if="showTag(tagID)" v-for="tagID in tagsToShow" :key="tagID">
            <q-btn flat size="lg" :class="(userSelectedTags.includes(String(tagID)) ? 'selected ' : '') + 'cursor-pointer tagButton full-width justify-start items-start'" @click="userClickedTag(tagID)" align="left">
                <h6 class="text-white">
                    <q-icon :name="activeTag(tagID)" color="white" />
                    {{fullTag(tagID)}}
                </h6>
            </q-btn>
        </div>

    </q-list>

</template>

<script>

    import { tagSidebarTools } from '../../../mixins/tagSidebarTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    export default {

        data() {
            return {
                tagsToShow: [
                    5908,
                    5909,
                    5889,
                    5907,
                    2332,
                    508,
                    2915,
                    773
                ],

                showTag(tagID) {
                    return this.tagsToShow.includes(tagID)
                },

                fullTag(tagID) {
                    k('fullTag: ', this.tagScope[tagID])
                    let tagName = {
                        "5908": "AGES 0+",
                        "5909": "AGES 1+",
                        "5889": "AGES 2+",
                        "5907": "AGES 3+",
                        "2332": "EBOOKS",
                        "508": "MUSIC",
                        "2950": "VIDEO",
                        "2915": "GUIDES",
                        "773": "CURRICULUM"
                    }
                    return tagName[tagID]
                }
            }
        },

        mixins: [ tagSidebarTools, globalComputedData, userAndProductInfo ],

        computed: {
            userIsSubscribed() {
                return this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)
            },

            showOnlyOwnedAndPlayable: {
                get() {
                    return this.$store.state.showOnlyOwnedAndPlayable || false
                },

                set(value) {
                    this.$store.commit('showOnlyOwnedAndPlayable', value)
                }
            },

            ownedAndPlayableProducts() {
                return this.environmentProducts && this.environmentProducts.length ? this.environmentProducts.filter((product) => {
                    // userActiveProduct
                    // webplayer
                    return product.webplayer && product.userActiveProduct
                }) : []
            }
        },

        methods: {
            deselectAll() {
                k('deselectAll: ', this.userSelectedTags)
                if (!this.userSelectedTags.length) return false

                // this.markSelectedTags()
                this.$store.commit('setUserSelectedTags', '')
            },

            activeTag(tagID) {
                return this.userSelectedTags[0] === String(tagID) ? 'fas fa-check-circle' : 'far fa-circle'
            }
        },

        watch: {
            environmentProducts() {
                if (this.authenticated && this.ownedAndPlayableProducts && this.ownedAndPlayableProducts.length) {
                    this.$store.commit('showOnlyOwnedAndPlayable', true)
                }
            }
        },

        created() {
            k('tagScope: ', this.tagScope)
            // if (this.authenticated && this.userIsSubscribed) {

            if (this.authenticated && this.ownedAndPlayableProducts && this.ownedAndPlayableProducts.length) {
                this.$store.commit('showOnlyOwnedAndPlayable', true)
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
        background: #006783;
    }
</style>

<style>
    .q-collapsible-sub-item {
        padding: 0;
        border-width: 0;
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