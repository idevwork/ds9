<template>

    <div :id="componentData.id" v-if="showProductSection" :style="productSectionStyle">
        <q-inner-loading :visible="componentLoad" style="z-index: 99;" />

        <div v-if="!useMobileHorizontalScrolling" :class="`row well items-stretch justify-center relative-position ${showEditor ? ' editStyle' : ''}`" style="padding: 1rem 0 1.5rem;">

            <productSectionEditor v-if="editMode" class="col-12" :componentData="componentData" :sectionIndex="sectionIndex" :showEditor="showEditor" @changeShowEditorState="changeShowEditorState" />

            <h2 v-if="componentData.heading && !showEditor" :class="`col-12 ${componentData.hideDivider ? '' : 'dividerHeader'}`" :align="componentData.headerAlignment ? componentData.headerAlignment : 'center'" :style="`${headingColor}`">
                <span :style="`background: ${componentData.backgroundColor ? componentData.backgroundColor : '#efefef'}; font-size: ${adaptiveFontSize(1.3)}rem; line-height: ${adaptiveFontSize(1)}rem;`">{{componentData.heading}}</span>
            </h2>

            <p v-if="componentData.description" align="center" class="col-12" :style="headingColor">{{componentData.description}}</p>

            <div v-if="!showAllProducts && !showEditor && componentData.useCarouselLayout" class="col-12" style="margin: 1rem -2rem 0;">
                <productCarousel
                    :productsToDisplay="displayProducts"
                    :component="productCardComponent"
                    :carouselColor="componentData.carouselColor"
                />
            </div>

            <div v-if="!componentData.useCarouselLayout" class="col-12 row items-stretch justify-center relative-position" style="padding: 1rem;">
                <div
                    v-if="showDefaultProductLayout(index)"
                    v-for="(product, index) in displayProducts"
                    :class="`${componentData.columnClass ? componentData.columnClass : componentData.columnsPerRow ? columnsPerRowMap[componentData.columnsPerRow] : columnsPerRowMap['six']} ${componentData.animated ? 'animated-product-card' : ''}`"
                    :key="index"
                    :style="{animationDelay: `${componentData.animated ? (Math.random() * 0.2) + 's' : ''}`, padding: `.5rem`}" >
                    <div :is="productCardComponent" v-if="!showEditor" class="productCard" :componentData="product" />
                    <div :is="productCardComponent" v-if="showEditor" class="productCard" :componentData="product" :notSelectable="true" />
                </div>
            </div>

            <div v-if="displayProducts.length && componentData.seeMore" class="col-12" style="padding-top: 1rem; text-align: center;">

                <q-btn :style="seeMoreStyle" @click="cardTap(componentData.seeMore)">
                    {{componentData.seeMore.title}}
                </q-btn>

            </div>

            <div v-if="displayProducts.length && componentData.seeAllProducts && environmentProducts.length > 6" class="col-12" style="padding-top: 1rem; text-align: center;">

                <q-btn outline id="browseThem" @click="goToSeeAllProducts" :style="seeAllStyle">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">{{componentData.seeAllText ? componentData.seeAllText : 'Browse all products'}}</h6>
                </q-btn>

            </div>

            <div v-if="displayProducts.length && componentData.productDisplayLimit && displayProducts.length > componentData.productDisplayLimit" class="col-12" style="padding-top: 1rem; text-align: center;">
                <slot name="showAllButton">
                    <q-btn outline @click="showAllProducts = !showAllProducts" :style="seeAllStyle">
                        <h6>
                            {{ showAllProducts ? 'show less' : 'show all' }}
                            <q-icon :name="showAllProducts ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" style="font-size: .8rem;" />
                        </h6>
                    </q-btn>
                </slot>
            </div>

        </div>

        <productSectionHorizontalScrolling v-if="useMobileHorizontalScrolling" :componentData="componentData" />

    </div>

</template>

<script>

    import { productCardLoad } from '../../../mixins/productCardLoad'
    import { designTools } from '../../../mixins/designTools'
    import productSectionEditor from './productSectionEditor'
    import productSectionHorizontalScrolling from './productSectionHorizontalScrolling'
    import inlineShowcaseEditor from './inlineShowcaseEditor'
    import draggable from 'vuedraggable'
    import productCarousel from './productCarousel'

    export default {
        props: ['componentData', 'sectionIndex'],

        mixins: [ productCardLoad, designTools ],

        components: {
            draggable,
            productCarousel,
            inlineShowcaseEditor,
            productSectionEditor,
            productSectionHorizontalScrolling
        },

        data() {
            return {
                showEditor: false,
                showAllProducts: false,

                showDefaultProductLayout(index) {
                    return this.displayProducts.length &&
                        (!this.componentData.productDisplayLimit || this.componentData.productDisplayLimit && (!this.showAllProducts && index < this.componentData.productDisplayLimit || this.showAllProducts))
                        && (!this.showEditor || (this.showEditor && this.currentHomePageSection && this.currentHomePageSection.content !== 'specificProducts'))
                }

            }
        },

        computed: {

            showProductSection() {
                // k('showProductSection: ', this.sectionIndex)
                // k('componentLoad: ', this.componentLoad)
                // k('displayProducts: ', this.displayProducts)
                // k('showEditor: ', this.showEditor)
                return this.componentLoad || (!this.componentLoad && this.displayProducts.length) || this.showEditor
            },

            displayProducts() {
                return this.showOnlyOwnedAndPlayable ? this.ownedAndPlayableProducts : this.componentData.products
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
                return this.componentData.products && this.componentData.products.length ? this.componentData.products.filter((product) => {
                    // userActiveProduct
                    // webplayer
                    return product.webplayer && product.userActiveProduct
                }) : []
            },

            componentLoad() {
                // k('componentLoad: ')
                // k('this.displayProducts.length: ', this.displayProducts.length)
                // k('this.editMode: ', this.editMode)
                // k('this.showOnlyOwnedAndPlayable: ', this.showOnlyOwnedAndPlayable)

                return (!this.environmentProducts || !this.environmentProducts.length) && !this.editMode && !this.showOnlyOwnedAndPlayable
            },

            environmentProducts() {
                return this.$store.state.environmentProducts
            },

            environmentJson() {
                return this.$store.state.environment.json
            },

            headingColor() {
              return `color: ${this.componentData.headingColor ? this.componentData.headingColor : '#333'};`
            },

            productSectionStyle() {
                return 'background: ' + (this.componentData.backgroundImageURL ? 'url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + this.componentData.backgroundImageURL + ')' : this.componentData.backgroundColor ? this.componentData.backgroundColor : '#efefef') + '; position: relative;'
            },

            seeMoreStyle() {
                return 'color: ' + (this.componentData.seeMore.textColor || '#fff') + ';' + 'background: ' + (this.componentData.seeMore.backgroundColor || this.environmentJson.e.brandColor) + ';'
            },

            seeAllStyle() {
                // return this.environmentJson.e.brandColor ? `background-color: ${this.environmentJson.e.brandColor} !important; color: #333;` : 'background-color: #fff !important;'
                return 'background-color: #fff !important;'
            },

            navBarData() {
                return this.$store.state.navBarData
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

            currentSectionEditIndex() {
                return this.$store.state.currentSectionEditIndex
            },

            currentHomePageSection() {
                return this.homePageSections && this.sectionIndex > -1 ? this.homePageSections[this.sectionIndex] : ''
            },

            useMobileHorizontalScrolling() {
                k('useMobileHorizontalScrolling: ', this.$q.platform.is.mobile && this.componentData.useHorizontalScrolling ? true : false)
                return this.$q.platform.is.mobile && this.componentData.useHorizontalScrolling ? true : false
            }
        },

        watch: {
            editMode() {
                this.showEditor = false
            }
        },

        methods: {

            cardTap(card) {
                var tags = card.tags
                var link = card.link

                if (tags && tags.length) {
                    this.route('/tagFilter/' + tags)
                    // window.location.hash = 'topOfShowcase'
                }
                else if (link) {
                    if (link.indexOf('http') > -1) {
                        window.open(link, '_blank')
                    }
                    else {
                        this.route(link)
                        // window.location.hash = 'topOfShowcase'
                    }
                }
            },

            goToSeeAllProducts() {
                k('navData: ', this.navBarData)

                var shopNavItem = this.navBarData.filter((item) => {
                    return item.navItemSKU === 'shop'
                })[0]

                // k('shopNavItem: ', shopNavItem)

                this.route(this.componentData.seeAllRoute ? this.componentData.seeAllRoute : (shopNavItem.hide ? '/' : '/shop'))
                this.$nextTick(() => {
                    window.scrollTo(0, 0)
                })
            },

            changeShowEditorState(val) {
                this.showEditor = val
            }
        },

        mounted() {
            k('product section componentData: ', this.componentData)
            // k('editMode: ', this.editMode)
            // k('sectionIndex: ', this.sectionIndex)
            // k('currentSectionEditIndex: ', this.currentSectionEditIndex)

            // if this is mounted while edit mode is on
            if (this.editMode && this.sectionIndex === this.currentSectionEditIndex) {
            // if (this.editMode && this.sectionIndex === this.currentSectionEditIndex + 1) {
                k('EDIT THIS')
                this.showEditor = true
                this.scrollIt(this.componentData.id, null, 110)
            }
        }
    }
</script>

<style scoped>
    h2{
        line-height:2.7rem;
    }

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

    #mobileCards {
        min-width: 100%;
        min-height: 200px;
        display: flex;
        overflow-x: scroll;
        overflow: -moz-scrollbars-none;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
    }

    .mobileCard {
        min-width: 20rem;
        max-width: 20rem;
    }

    #mobileCards::-webkit-scrollbar {
        display: none;
    }
</style>
