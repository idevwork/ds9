<template>
    
    <div>
        <div class="row full-width">
            <div class="col-12">
                <pvolveHero :componentData="heroUnitComponentData" />
            </div>
        </div>
        
        <div class="row" :style="'max-width: 1200px; margin: 1rem auto;' + (windowWidth > 767 ? 'padding: 1rem;' : '')"> <!--under header -->
            
            <div class="col-sm-12 col-lg-7" style="padding: 1rem;"> <!--right block -->
                
                <h1 class="monty thinHeader" style="color: #524F4C; letter-spacing: -2px;">
                    SCULPT, TONE & DEFINE
                    <br />
                    <span class="monty thickHeader" :style="'color: ' + pvolveSalmon + ';'">
                        ANYTIME, ANYWHERE
                    </span>
                </h1>
                
                <div class="monty" style="color: #524F4C; line-height: 2rem; margin-top: 1rem;">
                    <p style="font-size: 1rem;">
                        We are so excited you're ready to join the P.volve evolution
                        with your purchase of the P.band! To get started, please create an account or sign in to
                        your existing account to enjoy full length P.band workouts!
                    </p>
                </div>
                
                <!--<div v-if="!userIsSubscribed">-->
                
                <!--    <h4 class="thickHeader" :style="`letter-spacing: -1px; color: #524F4C; line-height: 2rem; text-transform: unset; margin: .5rem 0;`">Then...</h4>-->
                <!--    <h2 class="thickHeader" :style="`letter-spacing: -1px; color: ${pvolveMintTitle}; line-height: 2rem; text-transform: unset;`">TRY us for FREE for 15 Days</h2>-->
                    
                <!--    <div class="monty" style="color: #524F4C; line-height: 2rem; margin-top: 1rem;">-->
                <!--        <p style="font-size: 1rem;">The P.volve digital membership brings the P.volve Studio to you! After trying your free products, sign up for a free trial to experience the full library of premium workouts:</p>-->
                        
                <!--        <div align="center">-->
                <!--            <h4 align="center" style="margin: 0;">Sign up for a free trial!</h4>-->
                <!--            <q-btn align="center" @click="route('/trial')" style="background: #5CC1A3; color: white; min-width: 12rem;">-->
                <!--                <h6>Go</h6>-->
                <!--                <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />-->
                <!--            </q-btn>-->
                <!--        </div>-->
                <!--    </div>-->
                <!--</div>-->
                
            </div>
        
            <div class="col-sm-12 col-lg-5" style="padding: 1rem;"> <!--left block -->
            
                <signUpOfferOld 
                    :offerProductID="offerProductID" 
                    :completeSignUpComponentData="completeSignUpComponentData" 
                    :buttonColor="pvolveSalmon" 
                    :signUpBackgroundColor="'#FFF1F0'" 
                    :subscribeRoute="subscribeRoute" 
                    subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                    newUserButtonText="Create Free Account"
                    @userHasAccess=""
                />
              
            </div>
            
        </div>
    </div>
      
</template>

<script>
    import pvolveTestimonials from './pvolveTestimonials'
    import pvolveHero from './pvolveHero'
    import signUpOfferOld from '../../common/showcase/signUpOfferOld.vue'
    
    import { pvolveColors } from './pvolveColors'
    import { pvolveSignUpTools } from './pvolveSignUpTools'
    import { designTools } from '../../../mixins/designTools'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { impactTools } from './impactTools'
    
    export default {
        props: ['componentData'],
        
        components: {
            pvolveTestimonials,
            signUpOfferOld,
            pvolveHero
        },

        mixins: [pvolveColors, designTools, userAndProductInfo, impactTools, pvolveSignUpTools],
        
        data() {
            return {

                offerProductID: 151876,
                subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
                
                completeSignUpComponentData: {
                    header: 'Step 2: Auto Activation',
                    description: '',
                    componentName: 'AutoActivation',
                    loadHook: '',
                    activationCode: 'pband_purchase',
                    afterActivateContinueButtonAction: 'goToLibrary',
                    noToast: true
                },
                
                heroUnitComponentData: {
                    backgroundImageURL: 'mypvolve/PBand_hero.jpg',
                    padding: '8rem',
                    textColor: '#444',
                    mobilePadding: "2rem",
                    overlayColor: "#FFF8F5",
                    overlayOpacity: "0.8",
                    heroTitle: "<h1 style='margin: 0;'>Get Started <br /> With Your</h1><h1 class='thickHeader'> P.Band <br/> Workouts</h1>"
                },
            }
        },

        computed: {
            environmentJSON() {
                return this.$root.$store.state.environment.json
            },
            
            windowWidth() {
                return this.$root.$store.state.windowWidth
            },
            
            userInfo() {
                return this.$root.$store.state.user.info
            },

            userIsSubscribed() {
                return this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)
            }
        },

        methods: {
            
        },
        
        mounted() {
            this.$root.$on('activateCodeSuccess', (res) => {
                this.addUserToEmailList(this.userInfo.userEmail, '6ba594722b', { PBANDOFFER: this.userIsSubscribed ? 'streamer' : 'nonstreamer' }, (success) => {})
                
                this.trackImpactSale()
                
                this.$root.$off('activateCodeSuccess')
            })
        }
    }
</script>

<style>
    .smallHead {
        font-family: 'Montserrat', 'sans-serif';
        font-size: 1.2rem;
        margin: 0;
    }
    .headerBkgd {
        background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/sign-up-now-header-fpo.jpg') no-repeat center center;
        background-position: top;
        -webkit-background-size: contain;
        -moz-background-size: contain;
        -o-background-size: contain;
        background-size: 100vw auto;
        max-width: 100%;
      }
</style>
