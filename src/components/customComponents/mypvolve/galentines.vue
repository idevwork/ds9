<template>
    
    <div :style="windowWidth > 767 ? `background: url('https://vault.platformpurple.com/static/clients/mypvolve/Galentines-Landing-page_banner.jpg'); background-size: cover; background-position: 20% 0%;` : ''">
        <img v-if="windowWidth < 768" src="https://vault.platformpurple.com/static/clients/mypvolve/Galentines-Landing-page_banner.jpg" style="max-width: 100%; margin: -6px 0;" />
        
        <div v-if="afterPromotionEnd" class="row" :style="`padding: ${ windowWidth > 1200 ? '6rem' : windowWidth > 767 ? '3rem' : '1rem' }; ${ windowWidth > 767 ? '' : `background: ${pvolvePink};` }`">
            <div class="col-md-12 col-lg-6">
                <div style="max-width: 33rem; padding: 4rem 0;">
                    <h2 class="text-white" :style="`font-size: ${ windowWidth > 552 ? '2.5rem' : '2rem'}; line-height: 2.5rem; text-transform: unset;`">Sorry, this promotion has ended.</h2>
                </div>
            </div>
        </div>
        
        <div v-else class="row" :style="`padding: ${ windowWidth > 1200 ? '6rem' : windowWidth > 767 ? '3rem' : '1rem' }; ${ windowWidth > 767 ? '' : `background: ${pvolvePink};` }`">
            <div class="col-md-12 col-lg-6">
                <div style="max-width: 33rem;">
                    <h5 class="thickHeader text-white">Working out is better with a friend!</h5>
                    
                    <h1 class="text-white" :style="`font-size: ${ windowWidth > 552 ? '3.5rem' : '2rem'}; line-height: 3rem; margin-top: 2rem;`">CELEBRATE <q-icon name="fas fa-heart" :style="`font-size: ${ windowWidth > 552 ? '3rem' : '2rem'}; vertical-align: middle;`" /> </h1>
                    <h1 class="thickHeader text-white" :style="`font-size: ${ windowWidth > 552 ? '3.5rem' : '2rem'};`">GALENTINE'S DAY</h1>
                    <h2 class="thinHeader text-white" :style="`font-size: ${ windowWidth > 552 ? '2.5rem' : '2rem'}; line-height: 2.5rem; text-transform: unset;`">by sharing the gift of streaming!</h2>
                    
                    <p class="text-white monty" style="margin: 1rem 0; font-size: 1.2rem;">{{ !authenticated || !userIsSubscribed ? 'Start your own 15 day free trial. Then r' : 'R'}}efer <strong>5 Friends</strong> to receive <strong>6 Months</strong> of Streaming - <strong>$180</strong> value!*</p>
                    <p class="text-white monty" style="margin: 1rem 0; font-size: 1rem;">Each friend referred will receive a 15-Day free trial** PLUS a $30 credit to their account towards their next month of streaming for 1 FREE MONTH!</p>
                    
                    <q-btn flat @click="signUpModalOpen = true" size="lg" :style="`color: ${pvolvePink}; background: #fff;`">
                        <h5 class="thickHeader">GO</h5>
                        <q-icon name="fa-caret-right" />
                    </q-btn>
                    
                    <p class="text-white monty" style="font-size: 1rem; margin-top: 1rem;">*You will receive a $30 credit in your account for each friend you refer after their first renewal. If you have 5 friends that renew, you'll get an extra $30 credit to complete your 6 months of streaming - a $180 value!</p>
                    <p class="text-white monty" style="font-size: 1rem;">**Free trial users can cancel any time during their trial without being charged.</p>
                </div>
            </div>
        </div>
        
        <q-modal
            v-model="signUpModalOpen"
            :content-css="{minWidth: '100vw', minHeight: '100vh', background: 'rgba(255, 255, 255)'}"
        >
            <q-modal-layout v-if="signUpModalOpen" id="pvolveSignUpModalLayout">
                <q-btn flat round style="background: white; position: absolute; top: 1rem; right: 1rem; padding: .5rem;" @click="signUpModalOpen = false">
                    <q-icon name="fa-times" style="font-size: 1.5rem;" />
                </q-btn>

                    <div style="margin: 3rem auto; padding: 1rem;">
                        
                        <div v-if="authenticated && (userIsSubscribed || userHasBeenActivated)" align="center">
                            <h1 style="text-transform: uppercase;">Hello <span v-if="userInfo.firstName" class="thickHeader" :style="`color: ${pvolvePink};`"> {{ userInfo.firstName }}</span>!</h1>
                            <p class="monty" style="max-width: 500px; margin: 1rem 0;">Ready to share the P.volve experience? Enter your friend’s email below to send them an exclusive invitation!</p>
                            
                            <referFriend :buttonColor="pvolvePink" :buttonTextColor="'#fff'" :textAccentColor="pvolvePink" promotionID="pvolve_galentines" style="max-width: 500px; padding: 1rem;" />
                        </div>
                        
                        <div v-else style="margin-top: 2rem; max-width: 500px; margin: 0 auto;">
                            <signUpOffer
                                v-if="!showGeoBlock"
                                :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                                :offerProductID="offerProductID" 
                                :completeSignUpComponentData="completeSignUpComponentData" 
                                :newUserSubHeader="'Use your email and create a password to start streaming P.volve workouts anytime, anywhere.'"
                                :buttonColor="pvolvePink"
                                :signUpBackgroundColor="'rgba(0,0,0,0)'"
                                :userEmailProp="userEmailInput"
                                :showCompleteSignUp="showCompleteSignUp"
                                
                                @userHasAccess="userHasBeenActivated = true"
                                @userPreviouslyOwned="showCompleteSignUp = true"
                                @userNeedsToCheckout="showCompleteSignUp = true"
                                
                                subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                            />
                            
                            <div v-if="showGeoBlock" style="max-width: 420px; margin: .5rem auto;">
                                <h4 :style="`text-transform: none; line-height: 1.5rem; color: ${pvolvePink};`">So sorry, the P.volve subscription is not currently available in your area!</h4>
                                <p class="monty" style="font-size: .9rem; margin: .5rem 0;">Please sign up for our e-newsletter to stay in the loop and we'll let you know when the subscription is available, along with some great health tips and blog posts!</p>
                                
                                <q-field 
                                    :error="fieldError.userEmail"
                                    error-label="Please fill in your email address"
                                >
                                    <q-input
                                        v-model="userEmailInput"
                                        class="inputBox"
                                        name="userEmail"
                                        type="email"
                                        :attributes="{autocompletetype: 'email', autocorrect: 'off'}"
                                        color="grey-7"
                                        float-label="your email"
                                        @input="fieldError.userEmail = false"
                                    />
                                </q-field>
                                
                                <q-btn @click="geoBlockedUserToEmailList()" class="monty full-width" :style="`margin-top: .5rem; background: ${pvolvePink}; color: #fff;`">
                                    <h6 class="thickHeader">Submit</h6>
                                    <q-icon name="fa-caret-right" style="margin-left: 1rem;" />
                                </q-btn>
                            </div>
                           
                        </div>
                    </div>
    
            </q-modal-layout>
        </q-modal>
    </div>
      
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { authentication } from '../../../mixins/authentication'
    import { pvolveSignUpTools } from './pvolveSignUpTools'
    
    import signUpOffer from '../../common/showcase/signUpOffer.vue'
    import referFriend from './referFriend'

    export default {
        props: ['componentData'],
        
        components: {
            referFriend,
            signUpOffer
        },

        data() {
            return {
                promotionEnd: 1550206800000, // Thursday, February 14, 2019 9:00:00 PM GMT-08:00
                
                signUpModalOpen: false,
                offerProductID: 148014,
                
                userHasBeenActivated: false,
                showCompleteSignUp: false,
                
                completeSignUpComponentData: {
                    header: 'Step 2: Auto activate',
                    componentName: 'AutoActivation',
                    addToMailingList: true,
                    productInfo: '',
                    loadHook: '',
                    activationCode: 'galentines15',
                    submitButtonLabel: 'Apply code'
                }
            }
        },

        mixins: [pvolveColors, globalComputedData, authentication, pvolveSignUpTools],

        computed: {
            userIsSubscribed() {
                return this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)
            },
            
            pvolvePink() {
                return '#ECBFBB'
            },
            
            afterPromotionEnd() {
                k('afterPromotionEnd? ', Date.now(), this.promotionEnd, Date.now() > this.promotionEnd)
                
                // TODO: for testing
                // return Date.now() > 1548987411467
                // return true
                
                return Date.now() > this.promotionEnd
            }
        },

        created() {
            k('environmentJSON: ', this.environmentJSON)
            
            this.checkGeoBlocking((block) => {
                // this.showLoader = false
                
                if (block) {
                    this.showGeoBlock = true
                    if (this.signUpModalOpen) this.signUpModalOpen = false
                    this.$q.loading.hide()
                }
            })
            
            this.$root.$on('activateCodeSuccess', (res) => {
                this.$root.$off('activateCodeSuccess')
                this.userHasBeenActivated = true
            })
        }
    }
</script>

<style>
    
</style>
