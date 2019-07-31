<template>
    
    <div>
        <div style="background: #35302E;">
            <div :style="`background: url('https://vault.platformpurple.com/static/clients/mypvolve/Black-Friday-Confetti.png'); background-size: cover; background-position: 50% 0%; padding: 0 ${ windowWidth > 767 ? '6rem' : '1rem' };`">
                <div align="center" :style="`background: #35302E; padding: 4rem 2rem; border-left: 2px solid #fff; border-right: 2px solid #fff; ${windowWidth > 767 ? 'transform: skew(-5deg);' : '' }`">
                    <div :style="`${windowWidth > 767 ? 'transform: skew(5deg);' : '' }`">
                        <h1 class="text-white" style="letter-spacing: 10px; font-size: 3rem;">BLACK FRIDAY</h1>
                        
                        <h6 class="thickHeader" :style="`color: ${pvolveMintBG}; letter-spacing: 2px; margin: 1rem 0;`">exclusive offer, save up to $60!</h6>
                        
                        <div style="border-bottom: 2px solid #fff; max-width: 300px; margin: 1rem;"></div>
                        
                        <div style="max-width: 325px; margin: 2rem auto;">
                            <p class="text-white monty">From 11/19–11/25, lock in your streaming membership for </p>
                            
                            <h6 class="text-white thickHeader"><span style="font-size: 4rem; font-weight: 100;">$</span><span style="font-size: 4rem;">9.99</span> / month</h6>
                            
                            <h6 class="text-white thickHeader" style="margin: 1rem; line-height: 1.5rem;">for your first 3 months.*</h6>
                            
                            <q-btn v-if="!showGeoBlock" @click="startTransformation()" class="monty full-width" :style="`margin-top: .5rem; background: ${pvolveMintBG}; color: #35302E; padding: 1rem 0;`">
                                <h6 class="thickHeader">{{ windowWidth > 420 ? 'Start Your Transformation' : 'Start'}}</h6>
                                <q-icon name="fa-caret-right" style="margin-left: 1rem;" />
                            </q-btn>
                            
                            <p class="text-white monty" style="margin: 1rem 0; font-size: .8rem;">*Offer valid for new streaming memberships only.</p>
                            
                            <div v-if="showGeoBlock" style="max-width: 420px; margin: .5rem auto;">
                                <h4 :style="`text-transform: none; line-height: 1.5rem; color: ${pvolveMintBG};`">So sorry, the P.volve subscription is not currently available in your area!</h4>
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
                                
                                <q-btn @click="geoBlockedUserToEmailList()" class="monty full-width" :style="`margin-top: .5rem; background: ${pvolveMintBG}; color: #35302E;`">
                                    <h6 class="thickHeader">Submit</h6>
                                    <q-icon name="fa-caret-right" style="margin-left: 1rem;" />
                                </q-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <pvolveAccessDetails :componentData="{ trialVideoImageSrc: 'https://vault.platformpurple.com/static/clients/mypvolve/PLV149-18-BF_streamingpage_video-image.jpg', headerTextColor: pvolveMintTitle }" />
        
        <div class="row bg-grey-3" style="padding: 1rem;">
        </div>
        
        <pvolveTransformationExamples :componentData="{ transformations: transformations }" />
        
        <pvolveFeaturedLogos />
        
        <pvolveBrandTestimonials :componentData="{ brandTestimonials: brandTestimonials }" />
        
        <pvolveVictoriasSecretModelQuote />
        
        <q-modal
            v-model="signUpModalOpen"
            :content-css="{minWidth: '100vw', minHeight: '100vh', background: 'rgba(255, 255, 255)'}"
        >
            <q-modal-layout v-if="signUpModalOpen" id="pvolveSignUpModalLayout">
                <q-btn flat round style="background: white; position: absolute; top: 1rem; right: 1rem; padding: .5rem;" @click="signUpModalOpen = false">
                    <q-icon name="fa-times" style="font-size: 1.5rem;" />
                </q-btn>
                
                <!--<div style="display: flex; align-items: center; justify-content: center; height: 100%;">-->
                <!--    <div class="shadow-10" style="max-width: 500px; background: #fff; padding: 2rem; border-radius: .25rem;">-->
                    <div style="margin: 3rem auto; max-width: 500px; padding: 1rem;">
                        <!--<h1 style="margin: 1rem 0;"><span class="thinHeader" style="margin: 0;">Unlock Your </span> <br /> <span class="thickHeader" style="margin: 0; color: #F69477;"> free 15 day trial!</span></h1>-->
                        <!--<h5 style="line-height: 1.3rem; margin: .5rem 0; text-transform: unset; color: #524F4C;"><span style="margin-top: .5rem; color: #524F4C;">NO COMMITMENT. NO RISK.</span></h5>-->
                        
                        <signUpOffer 
                            :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                            :offerProductID="offerProductID" 
                            :completeSignUpComponentData="completeSignUpComponentData"
                            :newUserSubHeader="'Use your email and create a password to start streaming P.volve workouts anytime, anywhere.'"
                            :buttonColor="pvolveMintTitle"
                            :signUpBackgroundColor="'rgba(0,0,0,0)'"
                            :userEmailProp="userEmailInput"
                            :showCompleteSignUp="showCompleteSignUp"
                            :extraMessaging="extraMessaging()"
                            
                            subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                            
                            @userHasAccess="checkIfUserIsOnTrial()"
                            @userPreviouslyOwned="showCompleteSignUp = true"
                            @userNeedsToCheckout="showCompleteSignUp = true"
                        />
                    </div>
                <!--    </div>-->
                <!--</div>-->
    
            </q-modal-layout>
        </q-modal>
            
    </div>
      
</template>

<script>

    import pvolveFeaturedLogos from './pvolveFeaturedLogos'
    import pvolveAccessDetails from './pvolveAccessDetails'
    import pvolveTransformationExamples from './pvolveTransformationExamples'
    import pvolveBrandTestimonials from './pvolveBrandTestimonials'
    import pvolveVictoriasSecretModelQuote from './pvolveVictoriasSecretModelQuote'
    import signUpOffer from '../../common/showcase/signUpOffer.vue'
    
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { pvolveColors } from './pvolveColors'
    import { designTools } from '../../../mixins/designTools'
    import { impactTools } from './impactTools'
    import { pvolveSignUpTools } from './pvolveSignUpTools'
    import { authentication } from '../../../mixins/authentication'
    
    export default {
        props: ['componentData'],
        
        components: {
            pvolveFeaturedLogos,
            pvolveAccessDetails,
            pvolveTransformationExamples,
            pvolveBrandTestimonials,
            pvolveVictoriasSecretModelQuote,
            signUpOffer
        },
        
        mixins: [globalComputedData, pvolveColors, designTools, impactTools, authentication, pvolveSignUpTools],

        data() {
            return {
                showLoader: true,
                showCompleteSignUp: false,

                signUpModalOpen: false,
                
                offerProductID: 148014,
                
                completeSignUpComponentData: {
                    header: 'Payment info',
                    description: '',
                    componentName: 'PvolveCreditCardForm',
                    componentPath: 'mypvolve/PvolveCreditCardForm',
                    loadHook: 'addProductToCart',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    showCodeFields: false,
                    promoCodeText: 'blackfriday',
                    submitButtonLabel: 'Activate Subscription',
                    noToast: true
                },
                
                brandTestimonials: [{
                    quote: 'The burns-so-good workout Victoria\'s Secret Angels swear by',
                    imageFilename: 'Shape-Magazine-Logo-300x129.png'
                }, {
                    quote: 'This Victoria Secret\'s Model\'s Leg-Sculpting Exercise Ball Will Change Your Body',
                    imageFilename: 'VOGUE_LOGO.png'
                }, {
                    quote: '...after just a few weeks of training, butts begin to lift, biceps take form, and abdomen grooves appear',
                    imageFilename: 'ELLE_Magazine_Logo.svg'
                }],        
                
                transformations: [{
                    imageFilename: 'pvolve-transformation1.jpg'
                }, {
                    imageFilename: 'pvolve-transformation2.jpg'
                }, {
                    imageFilename: 'pvolve-transformation3.jpg'
                }, {
                    imageFilename: 'pvolve-transformation4.jpg'
                }, {
                    imageFilename: 'pvolve-transformation5.jpg'
                }],
                
                extraMessaging() {
                    return [{
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">First 3 months $9.99 per month, $29.99 per month after.</span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveSalmon
                    // }, {
                    //     text: '<span class="monty" style="margin: 0; font-size: .9rem;">Cancel your trial within <strong>the trial period to not be charged.</strong></span>',
                    //     icon: 'fas fa-caret-right',
                    //     iconColor: this.pvolveSalmon
                    }, {
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">Monthly memberships can be cancelled at any time.</span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveSalmon
                    }, {
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">Instantly access 150+ premium workouts.</span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveSalmon
                    }]
                }
            }
        },
        
        computed: {
            userSubscriptionProductStatusHistory() {
                return this.$store.state.userSubscriptionProductStatusHistory
            },
            
            mostRecentUserSubscriptionProductStatusHistory() {
                return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length ? this.userSubscriptionProductStatusHistory[0] : ''
            },
            
            userIsOnTrial() {
                return this.mostRecentUserSubscriptionProductStatusHistory && this.mostRecentUserSubscriptionProductStatusHistory.accessType === 'freeTrialAccess'
            }
        },

        methods: {
            checkIfUserIsOnTrial() {
                k('checkIfUserIsOnTrial: ', this.mostRecentUserSubscriptionProductStatusHistory)
                
                if (this.userIsOnTrial) {
                    this.showCompleteSignUp = true
                } else {
                    this.redirectUserThatHasAccess()
                }
            },
                    
            checkIfUserOwnsProduct() {
                k('checkIfUserOwnsProduct pvolveSignUp')
                k(this.environmentProducts)
                
                // now have environmentProducts
                this.$q.loading.hide()
                
                if (this.environmentJSON.e.validSubscriptionProductIDs && this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)) {
                    kw('user has access')   
    
                    this.checkIfUserIsOnTrial()
                }
            },
            
            startTransformation() {
                this.signUpModalOpen = true
            },
            
            initPurchaseSuccessHandler() {
                this.$root.$off('purchaseSuccess')
                
                this.$root.$on('purchaseSuccess', (res) => {
                    this.$root.$off('purchaseSuccess')
    
                    this.trackImpactSale()
                    
                    pintrk('track', 'signup', {
                        lead_type: '15 day free trial'
                    })
                    
                    // inject Loop.me pixel
                    this.injectImgIntoDOM({
                        "headOrBody": "head",
                        "type": "img",
                        "id": "loopMePixel",
                        "src": "https://tk0x1.com/sj/tr?id=__ADID__&et=CONVERSION&pt=sp&f=0&event_name=pvolve_signups&campaign_id=2000673",
                        "style": "display: none; height: 0; width: 0;"
                    })
                })
            }
        },
        
        watch: {
            environmentProducts() {
                k('watch environmentProducts! ', this.environmentProducts)
                
                if (this.environmentProducts) this.checkIfUserOwnsProduct()
            },
        },
        
        mounted() {
            if (this.authenticated) {
                this.$q.loading.show()
                
                if (this.environmentProducts) {
                    this.checkIfUserOwnsProduct()
                }
            }
            
            if (this.initialParameters) {
                k('initialParameters: ', this.initialParameters)
                
                if (this.initialParameters.signUpNow || this.initialParameters.payPalReturnCode) {
                    this.startTransformation()
                }
            }
            
            this.checkGeoBlocking((block) => {
                // this.showLoader = false
                
                if (block) {
                    this.showGeoBlock = true
                    if (this.signUpModalOpen) this.signUpModalOpen = false
                    this.$q.loading.hide()
                }
            })
            
            this.initPurchaseSuccessHandler()
        }
    }
</script>

<style scoped>
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
      
    .q-carousel-quick-nav,
    .q-carousel-left-arrow, 
    .q-carousel-right-arrow {
        background: rgba(0, 0, 0, 0);
    }
    
    #hero {
        position: relative;
    }
    
    .color-overlay {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    .angled {
        clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
        -webkit-clip-path: polygon(-450% 0%, 550% 0%, 50% 100%, 50% 100%);
    }    
    
    .angledUp {
        -webkit-clip-path: polygon(0% 10%, 50% 0%, 550% 100%, 0% 100%);
         clip-path: polygon(0% 10%, 50% 0%, 550% 100%, 0% 100%);
    }
</style>