<template>
    
    <div id="subscriptionProducts" :style="`background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'};`">
        
        <div class="row well">
            <h2 v-if="componentData.heading" class="col-12 dividerHeader" align="center">
                <span :style="`color: ${componentData.headingColor ? componentData.headingColor : '#333'}; background: ${componentData.backgroundColor ? componentData.backgroundColor : '#fff'}`">{{componentData.heading}}</span>
            </h2>
            
            <div v-if="subscriptionProductsForDisplay.length" class="col-12" align="center">
                <q-btn :style="showMonthly ? `background: ${brandColor}; color: #fff;` : 'background: #fff;'" @click="showMonthly = true">Monthly</q-btn>
                <q-btn :style="!showMonthly ? `background: ${brandColor}; color: #fff;` : 'background: #fff;'" @click="showMonthly = false">Long Term</q-btn>
            </div>
        </div>
        
        <div class="row well justify-center relative-position" style="min-height: 3rem;">
            <div class="col-12">
                <q-inner-loading :visible="!subscriptionProductsForDisplay.length" />
            </div>
            
            <div v-if="subscriptionProductsForDisplay.length" v-for="item in subscriptionProductsForDisplay" :class="componentData.columnClass ? componentData.columnClass : 'col-xs-12 col-sm-6 col-md-4 col-lg-3'" style="padding: .5rem; cursor: pointer; position: relative;" align="center">
                <!--<div :is="productCardComponent" class="productCard" :componentData="item" />-->
                
                <div class="shadow-2 bg-white relative-position" style="height: 100%; padding-bottom: 8rem;">
                    <div style="padding: 1rem;">
                        <q-btn v-if="!codingExclusionCourseIDs.includes(item.productID)" outline round size="sm" :style="`color: ${darkRed};`">
                            <q-icon name="fa-code" />
                        </q-btn>
                        <q-btn v-if="!productivityExclusionCourseIDs.includes(item.productID)" outline round size="sm" :style="`color: ${darkBlue};`">
                            <q-icon name="fa-lightbulb" />
                        </q-btn>
                        <q-btn v-if="!creativityExclusionCourseIDs.includes(item.productID)" outline round size="sm" :style="`color: ${darkGreen};`">
                            <q-icon name="fa-paint-brush" />
                        </q-btn>
                        
                        <h4 style="margin: 1rem 0; line-height: 1.5rem;">{{item.productName}}</h4>
                        <p>Unlimited access to our entire library of {{!codingExclusionCourseIDs.includes(item.productID) ? 'Coding' : ''}}{{!productivityExclusionCourseIDs.includes(item.productID) ? !codingExclusionCourseIDs.includes(item.productID) ? ', Productivity' : 'Productivity' : ''}} {{!creativityExclusionCourseIDs.includes(item.productID) ? !productivityExclusionCourseIDs.includes(item.productID) || !codingExclusionCourseIDs.includes(item.productID) ? ' and Creativity' : 'Creativity' : ''}} courses</p>
                    </div>
                    
                    <div class="actions">
                        <h6 v-if="item.bundleProducts" class="text-grey-7" style="font-style: italic;">{{item.bundleProducts.split(',').length}} courses</h6>
                        <h4>${{item.productPrice}} {{item.interval === '1 MONTH' ? '/ mo' : ''}}</h4>
                        <h6 v-if="item.interval !== '1 MONTH'" class="text-grey-7">${{perMonthPrice(item)}} / mo</h6>
                        <q-btn flat :style="`background: ${brandColor}; color: #fff; margin-top: .5rem;`" @click="selectItem(item)">
                            <h6>Select</h6>
                            <q-icon name="fas fa-chevron-right" style="font-size: .8rem;" />
                        </q-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
      
</template>

<script>
    import { totaltrainingColors } from './totaltrainingColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { productInfoTools } from '../../../mixins/productInfoTools'
    import { productCardLoad } from '../../../mixins/productCardLoad'

    export default {
        props: [ 'componentData' ],
        
        components: {

        },
        
        mixins: [ totaltrainingColors, globalComputedData, userAndProductInfo, productInfoTools, productCardLoad ],
        
        data() {
            return {
                showMonthly: true,
                
                coverImageURL(item) {
                    return `https://vault.platformpurple.com/static/previews/${item.productSKU}/${item.productSKU}_500px_cover.png`
                },
                
                userAccessToShelfItem(item) {
                    // let userSubscriptionAccessTypeCheck = !this.subscriptionAccessType || (this.subscriptionAccessType && this.subscriptionAccessType !== 'freeTrialAccess')
                    // k('userSubscriptionAccessTypeCheck: ', userSubscriptionAccessTypeCheck)
                    // k('user has access: ', this.userHasAccess([item.productID]))
                    return this.userHasAccess([item.productID]) 
                        // && (!item.hideIfFreeTrialAccess || (item.hideIfFreeTrialAccess && userSubscriptionAccessTypeCheck))
                },
                
                perMonthPrice(product) {
                    let numberOf = product.interval.split(' ')[0]
                    let intervalType = product.interval.split(' ')[1]
                    let numberOfMonths = intervalType === 'MONTH' ? numberOf : numberOf * 12
                    return product.productPrice / numberOfMonths
                },
                
                codingExclusionCourseIDs: [151320, 151319, 156120, 156119],
                
                productivityExclusionCourseIDs: [151318, 151319, 156121, 156120],
                
                creativityExclusionCourseIDs: [151318, 151320, 156119, 156121]
            }
        },
        
        computed: {
            
            // userSubscriptionProductStatusHistory() {
            //     return this.$store.state.userSubscriptionProductStatusHistory
            // },
            
            // previouslyOwnedTrial() {
            //     return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length
            // },
            
            // subscriptionAccessType() {
            //     return this.userSubscriptionProductStatusHistory && 
            //         this.userSubscriptionProductStatusHistory.length ?
            //         this.userSubscriptionProductStatusHistory[0].accessType : ''
            // },
            
            subscriptionProductsForDisplay() {
                k('subscriptionProductsForDisplay: ', this.monthlySubscriptionProducts)
                return this.showMonthly ? this.monthlySubscriptionProducts : this.annualSubscriptionProducts
            },
            
            monthlySubscriptionProducts() {
                return this.subscriptionProducts.filter((product) => {
                    return product ? product.interval === '1 MONTH' : false
                })  
            },      
            
            annualSubscriptionProducts() {
                return this.subscriptionProducts.filter((product) => {
                    return product ? product.interval !== '1 MONTH' : false
                })  
            },
            
            subscriptionProducts() {
                // return this.environmentProducts ? this.environmentProducts.filter((product) => {
                //     return this.environmentJSON.e.validSubscriptionProductIDs.includes(product.productID)
                // }) : []
                
                return this.environmentProducts ? this.environmentJSON.e.validSubscriptionProductIDs.map((productID) => {
                    return this.environmentProducts.find((product) => {
                        return product.productID === productID
                    })
                }) : []
            },
            
            userHasAccessToAnyShelfItems() {
                let subscriptionProductsIDs = this.subscriptionProductsForDisplay.map((product) => {
                    return product.productID
                })
                return this.userHasAccess(subscriptionProductsIDs)
            }
        },
        
        watch: {
            environmentProducts() {
                k('subscriptionProducts: ', this.subscriptionProducts)
            },
            
            showStructuredProductDetails() {
                if (!this.showStructuredProductDetails) {
                    this.$store.commit('setProductID2Preview', '')
                }
            },
            
            currentProduct() {
                kw('currentProduct pvolve: ', this.currentProduct)
            }
        },
        
        methods: {
            shelfAction(item) {
                k('shelfAction: ', item)
                    
                this.$store.commit('setProductID2Preview', item.productID)
                this.showStructuredProductDetails = true
            },
            
            selectItem(item) {
                this.$store.commit('setProductID2Preview', item.productID)
                
                if (this.currentView === 'productPreview') {
                    this.route('/shop/' + item.productID)
                } else {
                    this.$root.$emit('openProductPreview', true)
                }
            }
        },
        
        created() {

        }
    }
</script>

<style scoped>
    .actions {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 1rem;
    }
</style>
