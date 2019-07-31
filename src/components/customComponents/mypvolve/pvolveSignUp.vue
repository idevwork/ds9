<template>
    
    <div>
        <div :style="`background: ${componentData.backgroundColor || '#fff'};`">
            <div id="hero" v-if="windowWidth > 767" class="row" :style="heroStyle">
                
                <div id="headerColor" class="well" :style="innerHeroStyle">
                    
                    <h1 :style="heroTitleStyle"><span class="thinHeader" style="margin: 0;">Unlock Your </span> <br /> <span class="thickHeader" style="margin: 0; color: #F69477;"> free 15 day trial!</span></h1>
            
                    <div style="margin: 1rem 0; max-width: 420px; position: relative;">
                        <h5 style="line-height: 1.3rem; margin: .5rem 0; text-transform: unset; color: #524F4C;"><span style="margin-top: .5rem; color: #524F4C;">NO COMMITMENT. NO RISK.</span></h5>
                        
                        <q-btn v-if="!showGeoBlock" @click="startTransformation()" outline style="margin-top: .5rem; background: #fff !important; color: #333;">
                            <h6 style="font-size: .9rem; letter-spacing: 1px;">{{ windowWidth > 420 ? 'Start Your Transformation' : 'Start'}}</h6>
                        </q-btn>
                        
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
                            
                            <q-btn @click="geoBlockedUserToEmailList()" outline style="margin-top: .5rem; background: #fff !important; color: #333;">
                                <h6 style="font-size: .9rem; letter-spacing: 1px;">Submit</h6>
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>
                
            <div id="hero" v-else class="row">
                <div style="margin: -5px auto;">
                    <img class="angled" :src="mobileHeroImageSrc" style="max-width: 100%;" />
                    
                    <div class="" style="background: #FEF8F5; padding: 6rem 1rem 3rem 1rem; margin-top: -4rem;">
        
                        <div style="max-width: 420px; margin: 0 auto; position: relative;">
                            <h1 :style="heroTitleStyle"><span class="thinHeader" style="margin: 0;">Unlock Your </span> <br /> <span class="thickHeader" style="margin: 0; color: #F69477;"> free 15 day trial!</span></h1>
                            
                            <h5 style="line-height: 1.3rem; margin: .5rem 0; text-transform: unset; color: #524F4C;"><span style="margin-top: .5rem; color: #524F4C;">NO COMMITMENT. NO RISK.</span></h5>
                            
                            <q-btn v-if="!showGeoBlock" @click="startTransformation()" outline style="margin-top: .5rem; background: #fff !important; color: #333;">
                                <h6 style="font-size: .9rem; letter-spacing: 1px;">{{ windowWidth > 420 ? 'Start Your Transformation' : 'Start'}}</h6>
                            </q-btn>
                            
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
                                
                                <q-btn @click="geoBlockedUserToEmailList()" outline style="margin-top: .5rem; background: #fff !important; color: #333;">
                                    <h6 style="font-size: .9rem; letter-spacing: 1px;">Submit</h6>
                                </q-btn>
                            </div>
                        </div>
                    </div>
                    
                </div>
            
            </div>
        </div>
        
        <pvolveAccessDetails :componentData="{}" />
        
        <div class="row bg-grey-3" style="padding: 1rem;">
        </div>
        
        <pvolveTransformationExamples :componentData="{ transformations: transformations }" />
        
        <pvolveFeaturedLogos />
        
        <pvolveBrandTestimonials :componentData="{ brandTestimonials: brandTestimonials }" />
        
        <pvolveVictoriasSecretModelQuote />
                    
        <div class="row" style="background: #8C909A; padding: 4rem 1rem;">
            <div class="col-12" align="center">
                <h1><span class='thinHeader' style='margin: 0; color: #fff;'>Unlock Your </span> <span class='thickHeader' style='margin: 0; color: #fff;'> free 15 day trial!</span></h1>
                <h5 style="line-height: 1.3rem; margin: .5rem 0; text-transform: unset; color: #fff;">NO COMMITMENT. NO RISK.</h5>
                
            </div>
            <div class="col-12" align="center">
                <div style="max-width: 420px; margin: 0 auto;">
                    <q-btn @click="startTransformation()" outline style="margin-top: .5rem; background: #fff !important; color: #333;">
                        <h6 style="font-size: .9rem; letter-spacing: 1px;">{{ windowWidth > 420 ? 'Start Your Transformation' : 'Start'}}</h6>
                    </q-btn>
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
                
                <!--<div style="display: flex; align-items: center; justify-content: center; height: 100%;">-->
                <!--    <div class="shadow-10" style="max-width: 500px; background: #fff; padding: 2rem; border-radius: .25rem;">-->
                    <div style="margin: 3rem auto; max-width: 500px; padding: 1rem;">
                        <!--<h1 style="margin: 1rem 0;"><span class="thinHeader" style="margin: 0;">Unlock Your </span> <br /> <span class="thickHeader" style="margin: 0; color: #F69477;"> free 15 day trial!</span></h1>-->
                        <!--<h5 style="line-height: 1.3rem; margin: .5rem 0; text-transform: unset; color: #524F4C;"><span style="margin-top: .5rem; color: #524F4C;">NO COMMITMENT. NO RISK.</span></h5>-->
                        
                        <signUpOffer
                            :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                            :offerProductID="offerProductID" 
                            :completeSignUpComponentData="completeSignUpComponentData" 
                            :buttonColor="pvolveSalmon"
                            :signUpBackgroundColor="'rgba(0,0,0,0)'"
                            :newUserSubHeader="'Use your email and create a password to start streaming P.volve workouts anytime, anywhere.'"
                            :userEmailProp="userEmailInput"
                            :showCompleteSignUp="showCompleteSignUp"
                            :extraMessaging="extraMessaging()"
                            
                            subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                            
                            @userHasAccess="redirectUserThatHasAccess()"
                            @userPreviouslyOwned="redirectUserThatPreviouslyHadAccess()"
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
    
    import { pvolveColors } from './pvolveColors'
    import { designTools } from '../../../mixins/designTools'
    import { impactTools } from './impactTools'
    import { pvolveSignUpTools } from './pvolveSignUpTools'
    
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
        
        mixins: [pvolveColors, designTools, impactTools, pvolveSignUpTools],

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
                    promoCodeText: '15dayfreetrial',
                    submitButtonLabel: 'Activate trial',
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
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">15 days free, then $29.99 per month after.</span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveSalmon
                    }, {
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">Cancel within your <strong>trial period to not be charged.</strong></span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveSalmon
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
            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/mypvolve/Pvolve-Streaming-Signup.png'
            },
                
            mobileHeroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/mypvolve/PLV133-18-Trial-Landing_VIP_3.png'
            },
            
            heroTitleStyle() {
                return `color: ${this.componentData.textColor}; ${this.componentData.textShadow ? `text-shadow: 0px 0px 10px ${this.componentData.textShadow};` : ``} ${this.windowWidth < 768 ? `font-size: 2rem;` : ''}`
            },
    
            heroStyle() {
                var styleStr = ""
                styleStr += "background: url(" + this.heroImageSrc + "); "
                styleStr += this.componentData.headerColor ? "background-color: " + this.componentData.headerColor + "; " : ""
                styleStr += `background-position: ${this.windowWidth > 1200 ? '50% 50%' : this.windowWidth > 992 ? '35% 50%' : '0% 50%'};`
                styleStr += "background-size: " + (this.componentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.componentData.heroHeight ? "height: " + this.componentData.heroHeight + "; " : ""
                styleStr += this.componentData.logoLink ? "cursor: pointer;" : ""
                styleStr += "padding: " + (this.windowWidth > 992 && !this.showGeoBlock ? "10rem 3rem" : "8rem 2rem") + ";"
                // k('styleStr: ', styleStr)
                return styleStr
            },
            
            innerHeroStyle() {
                var styleStr = "z-index: 1; width: 100%;"
                    styleStr += (this.componentData.padding && this.windowWidth > 767 ? 'padding: ' + this.componentData.padding + ' 0;' : this.componentData.mobilePadding && this.windowWidth < 768 ? 'padding: ' + this.componentData.mobilePadding + ' 0;' : '')
                    styleStr += (this.componentData.margin && this.windowWidth > 767 ? 'margin: ' + this.componentData.margin + ' 0;' : this.componentData.mobileMargin && this.windowWidth < 768 ? 'margin: ' + this.componentData.mobileMargin + ' 0;' : '')
                return styleStr
            },
            
            previouslyOwnedTrial() {
                return this.userSubscriptionProductStatusHistory && this.userSubscriptionProductStatusHistory.length
            }
        },

        methods: {
            checkIfUserOwnsProduct() {
                k('checkIfUserOwnsProduct pvolveSignUp')
                k(this.environmentProducts)
                
                // now have environmentProducts
                this.$q.loading.hide()
                
                if (this.environmentJSON.e.validSubscriptionProductIDs && this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs)) {
                    kw('user has access')   
    
                    this.redirectUserThatHasAccess()
                } else {
                    if (this.previouslyOwnedTrial) {
                        //user had previously had trial
                        k('userPreviouslyOwned')
                        
                        this.redirectUserThatPreviouslyHadAccess()
                    } else {
                        // user has not previosuly had trial
                        k('user needs to checkout')
                    }
                }
            },
            
            startTransformation() {
                this.signUpModalOpen = true
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
                
                if (this.environmentProducts) this.checkIfUserOwnsProduct()
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