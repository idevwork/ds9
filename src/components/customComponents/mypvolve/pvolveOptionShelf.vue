<template>
    
    <div id="pvolveOptionShelf" class="row full-width bg-white">
        
        <div v-if="shelfItems" class="row well justify-center">
            <div 
                v-for="item in shelfItems"
                @click="shelfAction(item)" 
                class="col-xs-12 col-sm-6 col-lg-3 cursor-pointer relative-position" 
                style="padding: .5rem;"
            >
                <div :style="shelfOptionStyle(item)">
                    <!--<img :src="item.imageURL" style="max-width: 100%;" />-->
                    <div v-html="item.title" style="line-height: .5rem;"></div>
                </div>
            </div>
            
            <!--<div class="col-sm-12 col-md-6" style="padding: .5rem;">-->
            <!--    <q-btn flat class="full-width" @click="$root.$emit('openMobileAppModal', true)" :style="`background: ${pvolveSalmon}; color: #fff;`">-->
            <!--        <h6 class="thickHeader">-->
            <!--            <q-icon name="fas fa-mobile" style="font-size: 1.1rem; vertical-align: bottom;" />-->
            <!--            Get The Mobile App-->
            <!--            <q-icon name="fas fa-caret-right" style="font-size: 1.1rem; vertical-align: bottom;" />-->
            <!--        </h6>-->
            <!--    </q-btn>-->
            <!--</div>-->
        </div>
        
        <div class="col-sm-12 bg-grey-3" align="center" style="padding: 1rem;">
            <!--<q-btn outline @click="$root.$emit('openMobileAppModal', true)" :style="`background: ${pvolveSalmon}; color: #333; background: #fff !important; margin: .25rem;`">-->
            <!--    <h6 style="font-size: .8rem; letter-spacing: 1px;">-->
            <!--        <q-icon name="fas fa-mobile" style="font-size: .8rem;" />-->
            <!--        Get The Mobile App-->
            <!--    </h6>-->
            <!--</q-btn>-->
            
            <h5 class="thinHeader">
                Need to update your custom workout plan?
            
                <q-btn outline @click="showOnboarding" :style="`background: ${pvolveMintBG}; color: #333; background: #fff !important; margin: .25rem;`">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">
                        Update Here
                    </h6>
                </q-btn>
            </h5>
        </div>
        
        <q-modal
            v-model="openOnboardingModal"
            :content-css="{width: '550px', minHeight: '80vh'}"
        >
            <q-modal-layout id="pvolveOnboardingModalLayout">
                
                <pvolveOnboarding v-if="openOnboardingModal" @close="openOnboardingModal = false" />
    
            </q-modal-layout>
        </q-modal>   
        
    </div>
      
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import pvolveOnboarding from './pvolveOnboarding'

    export default {
        
        mixins: [ pvolveColors, userAndProductInfo, globalComputedData],
        
        components: {
            pvolveOnboarding
        },
        
        data() {
            return {
                openOnboardingModal: false,
                
                addParamsIfNeeded(route) {
                    return window.location.search ? route + window.location.search : route
                },
                
                shelfOptionStyle(item) {
                    return `height: 100%; color: #fff; background: url(${item.imageURL}) 50% 0% / cover; padding: 2.5rem 1rem;`
                }
            }
        },
        
        created() {

            if (this.userInfo) {
                if (this.userPreferences) {
                    this.showModals()
                } else {
                    this.getUserPreferences(() => {})
                }
            } else {
                this.showModals()
            }
            
        },
        
        computed: {
            subscriptionAccessType() {
                return this.userSubscriptionProductStatusHistory && 
                    this.userSubscriptionProductStatusHistory.length ?
                    this.userSubscriptionProductStatusHistory[0].accessType : ''
            },
            
            shelfItems() {
                return [{
                    title: '<h2 style="line-height: 2rem;">Beginners <br /> start here</h2>',
                    imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/shelfOption1.jpg',
                    route: '/beginners'
                }, 
                {
                    title: `<h2 style="line-height: 2rem;">P's structured plans</h2>`,
                    imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/shelfOption2.jpg',
                    scrollTo: 'pvolveStructuredProductsHome'
                }, 
                {
                    title: '<h2 style="line-height: 2rem;">Create <br /> my workout</h2>',
                    imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/shelfOption3.jpg',
                    action: 'showOnboarding'
                }, 
                {
                    title: '<h2 style="line-height: 2rem;">Browse <br /> the library</h2>',
                    imageURL: 'https://vault.platformpurple.com/static/clients/mypvolve/shelfOption4.jpg',
                    scrollTo: 'pvolveFilterResultProductGrid'
                }]
            },
            
            shelfAccessIDs() {
                let accessIDs = []
                this.shelfItems.forEach((item) => {
                    accessIDs = accessIDs.concat(item.accessIDs)
                })
                return accessIDs
            },
            
            showShelf() {
                return this.environmentProducts && this.authenticated && this.userHasAccess(this.shelfAccessIDs)
            },
            
            contentSchedulePreferences() {
                return this.userPreferences ? this.userPreferences.filter((item) => {
                    return item.type === 'contentSchedulePreferences'
                })[0] : ''
            },
        },
        
        watch: {
            userInfo() {
                this.getUserPreferences(() => {})
            },
            
            // userPreferences() {
            //     if (this.userPreferences) this.showModals()
            // },
            
            contentSchedulePreferences() {
                k('contentSchedulePreferences: ', this.contentSchedulePreferences)
            }
        },
        
        methods: {
            shelfAction(item) {
                if (item.route) this.route(this.addParamsIfNeeded(item.route))
                if (item.scrollTo) {
                    this.scrollIt(item.scrollTo, '',  75)
                }
                if (item.action) this[item.action](item)
            },
            
            showModals() {
                let userHasSeenOnboarding = this.localStorage.get('pvolveOnboardingSeen')
                
                if (!userHasSeenOnboarding) {
                    this.showOnboarding()
                }
            },
            
            showOnboarding(item) {
                k('showOnboarding!')
                
                this.openOnboardingModal = true
                this.localStorage.set('pvolveOnboardingSeen', true)
                
                this.api.sendEvent({
                    eventType: 'userLaunchedOnboarding',
                    eventDesc: 'user tapped to see the onboarding modal',
                    userID: this.userInfo.userID
                })
            }
        }
    }
</script>

<style scoped>
    .angled {
        clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
        -webkit-clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
    }
</style>