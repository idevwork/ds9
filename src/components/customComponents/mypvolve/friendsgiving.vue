<template>
    
    <div :style="windowWidth > 767 ? `background: url('https://vault.platformpurple.com/static/clients/mypvolve/Friendsgiving-Landing-page_banner.jpg'); background-size: cover; background-position: 50% 0%;` : ''">
        <img v-if="windowWidth < 768" src="https://vault.platformpurple.com/static/clients/mypvolve/Friendsgiving-Landing-page_banner.jpg" style="max-width: 100%; margin: -6px 0;" />
        
        <div class="row" :style="`padding: ${ windowWidth > 767 ? '6rem' : '1rem' }; ${ windowWidth > 767 ? '' : `background: ${pvolveSalmon};` }`">
            <div class="col-md-12 col-lg-6">
                <h5 class="thickHeader text-white">Working out is better with a friend!</h5>
                
                <h1 class="text-white" :style="`font-size: ${ windowWidth > 552 ? '3.5rem' : '2rem'}; line-height: 3rem; margin-top: 2rem;`">Celebrate <img src="https://vault.platformpurple.com/static/clients/mypvolve/pvolve_leaf.png" :style="`max-height: ${ windowWidth > 552 ? '4rem' : '3rem' }; margin: -.75rem;`" /></h1>
                <h1 class="thickHeader text-white" :style="`font-size: ${ windowWidth > 552 ? '3.5rem' : '2rem'};`">Friendsgiving</h1>
                <h2 class="thinHeader text-white" :style="`font-size: ${ windowWidth > 552 ? '2.5rem' : '2rem'}; line-height: 2.5rem; text-transform: unset;`">by sharing the gift of streaming!</h2>
                
                <p class="text-white monty" style="margin: 1rem 0; font-size: .9rem;">{{ !authenticated || !userIsSubscribed ? 'Start your own 15 day free trial. Then i' : 'I'}}nvite a friend and they’ll get a $20 credit towards their streaming membership. <span class="thickHeader">PLUS you’ll earn a $20 credit towards your next month of streaming!*</span></p>
                
                <q-btn flat @click="signUpModalOpen = true" size="lg" :style="`color: ${pvolveSalmon}; background: #fff;`">
                    <h5 class="thickHeader">GO</h5>
                    <q-icon name="fa-caret-right" />
                </q-btn>
                
                <p class="text-white monty" style="font-size: .9rem; margin-top: 3rem;">*Credits are applied to accounts after invitee’s paid subscription begins.</p>
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
                            <h1>HELLO<span v-if="userInfo.firstName" class="thickHeader" :style="`color: ${pvolveSalmon};`"> {{ userInfo.firstName }}</span>!</h1>
                            <p class="monty" style="max-width: 500px; margin: 1rem 0;">Ready to share the P.volve experience? Enter your friend’s email below to send them an exclusive invitation!</p>
                            
                            <referFriend :buttonColor="pvolveSalmon" :buttonTextColor="'#fff'" :textAccentColor="pvolveSalmon" promotionID="pvolve_friendsgiving" style="max-width: 500px; padding: 1rem;" />
                        </div>
                        
                        <div v-else style="margin-top: 2rem; max-width: 500px; margin: 0 auto;">
                            <signUpOffer
                                v-if="!showGeoBlock"
                                :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                                :offerProductID="offerProductID" 
                                :completeSignUpComponentData="completeSignUpComponentData" 
                                :newUserSubHeader="'Use your email and create a password to start streaming P.volve workouts anytime, anywhere.'"
                                :buttonColor="pvolveSalmon"
                                :signUpBackgroundColor="'rgba(0,0,0,0)'"
                                :userEmailProp="userEmailInput"
                                :showCompleteSignUp="showCompleteSignUp"
                                
                                @userHasAccess="userHasBeenActivated = true"
                                @userPreviouslyOwned="showCompleteSignUp = true"
                                @userNeedsToCheckout="showCompleteSignUp = true"
                                
                                subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                            />
                            
                            <div v-if="showGeoBlock" style="max-width: 420px; margin: .5rem auto;">
                                <h4 :style="`text-transform: none; line-height: 1.5rem; color: ${pvolveSalmon};`">So sorry, the P.volve subscription is not currently available in your area!</h4>
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
                                
                                <q-btn @click="geoBlockedUserToEmailList()" class="monty full-width" :style="`margin-top: .5rem; background: ${pvolveSalmon}; color: #fff;`">
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
                    activationCode: 'friendsgiving15',
                    submitButtonLabel: 'Apply code'
                }
            }
        },

        mixins: [pvolveColors, globalComputedData, authentication, pvolveSignUpTools],

        computed: {
            userIsSubscribed() {
                return this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)
            },
        },

        methods: {
           
        },

        watch: {

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
