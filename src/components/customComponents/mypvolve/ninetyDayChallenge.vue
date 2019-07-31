<template>
    
    <div>
        <div id="hero" class="row relative-position" :style="heroStyle">
            
            <div class="color-overlay" :style="overlayStyle"></div>
            
            <div id="headerColor" class="row well justify-right" :style="innerHeroStyle">
                
                <div class="col-sm-12" style="">
                    <span v-if="heroUnitComponentData.heroTitle" :style="heroTitleStyle" v-html="heroUnitComponentData.heroTitle" />
                    
                    <h6 v-if="countdownTimeLeft" class="thickHeader" style="margin: 1rem 0; color: #524F4C; letter-spacing: 1px; text-transform: uppercase;">90 Day Challenge starts in <span :style="`color: ${pvolveMintBG};`">{{daysLeft}}</span> days, <span :style="`color: ${pvolveMintBG};`">{{hoursLeft}}</span> hours, <span :style="`color: ${pvolveMintBG};`">{{minutesLeft}}</span> minutes and <span :style="`color: ${pvolveMintBG};`">{{secondsLeft}}</span> seconds</h6>
                    <h6 v-else class="thickHeader" style="margin: 1rem 0; color: #524F4C; letter-spacing: 1px;">the challenge has started, sign up now!</h6>
                    <h6 class="thickHeader" style="margin: .5rem 0; color: #524F4C;">Opt In Period: 1/1 - 2/8</h6>
                    
                    <q-btn outline @click="openGuidelinesModal = true" class="monty" :style="`margin: .5rem 0; background: #fff !important; color: #545454; padding: .8rem 2rem;`">
                        <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px;">view challenge info</h6>
                    </q-btn>
                </div>
                
                <div v-if="!contestOptIn" class="col-sm-12 col-md-6" style="padding: 2rem 0;">
                    <div :style="`background: rgba(255, 255, 255, .7); padding: ${windowWidth < 768 ? '2rem 1rem' : '3rem'};`">
                        <signUpOffer
                            :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                            :offerProductID="offerProductID" 
                            :completeSignUpComponentData="completeSignUpComponentData" 
                            :buttonColor="pvolveMintBG"
                            :signUpBackgroundColor="'rgba(0,0,0,0)'"
                            
                            :showCompleteSignUp="showCompleteSignUp"
                            :extraMessaging="extraMessaging()"
                            
                            subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                            
                            @userHasAccess="checkChallenge = true, checkOptIn()"
                            @userPreviouslyOwned="userNeedsToSignUpForSubscription()"
                            @userNeedsToCheckout="showCompleteSignUp = true"
                            
                            style="max-width: 30rem; margin: 0 auto;"
                        />
                    </div>
                </div>
            </div>
            
        </div>
        
        <div v-if="contestOptIn" class="col-12" style="padding: 1rem 0; background: rgba(255, 255, 255, .7);">
            <div class="well relative-position" :style="`padding: ${windowWidth < 768 ? '1rem' : '1rem 2rem'};`">
                <h6 style="letter-spacing: 1px; margin: 1rem 0;">You are in the 90 Day Challenge!</h6>
                
                <p class="monty">Check out your responses and review your challenge status on the '/me' page.</p>
                
                <q-btn flat @click="route('/me')" class="monty" :style="`margin-top: .5rem; background: ${ pvolveMintBG }; color: #fff;  padding: .8rem 2rem;`">
                    <h6 class="thickHeader" style="font-size: .8rem; letter-spacing: 1px;">Check My Status</h6>
                </q-btn>
            </div>
        </div>
        
        <ninetyDayChallengeAfterOptIn v-if="contestOptIn" />
        
        <div class="bg-grey-3 row">
            <div class="well row" style="padding: 1rem 0;">
            
                <q-carousel class="col-12" quick-nav infinite autoplay color="grey" style="padding-bottom: 4rem;">
                    <q-carousel-slide v-for="slide in brandTestimonials" :key="slide.id" align="center">
                        <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/quote_icon.png" />
                        <h1 class="thinHeader" style="text-transform: none; color: #444;">{{slide.quote}}</h1>
                        <img align="center" :src="'https://vault.platformpurple.com/static/clients/mypvolve/' + slide.imageFilename" style="width: 100%; max-width: 300px; padding: 2rem;" />
                    </q-carousel-slide>
                </q-carousel>
                
            </div>
        </div>
        
        <q-modal
            v-model="openGuidelinesModal"
            :content-css="{minWidth: '50vw', minHeight: '50vh'}"
        >
            <q-modal-layout>
                <q-toolbar slot="header" class="text-white" :style="`background: ${pvolveMintBG};`">
                    <div class="q-toolbar-title">
                        <h5>90 Day Challenge Info</h5>
                    </div>
                    <q-btn @click="openGuidelinesModal = false" flat round style="padding: .5rem;">
                        <q-icon name="fa-times" color="white" />    
                    </q-btn>
                </q-toolbar>
                
                <ninetyDayChallengeGuidelines v-if="openGuidelinesModal" />
            </q-modal-layout>
        </q-modal>

    </div>
      
</template>

<script>
    import signUpOffer from '../../common/showcase/signUpOffer.vue'
    import pvolveTestimonials from './pvolveTestimonials'
    import ninetyDayChallengeGuidelines from './ninetyDayChallengeGuidelines'
    import ninetyDayChallengeAfterOptIn from './ninetyDayChallengeAfterOptIn'
    
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { designTools } from '../../../mixins/designTools'
    import { pvolveColors } from './pvolveColors'
    import { contestTools } from './contestTools'
    import { impactTools } from './impactTools'
    import { pvolveSignUpTools } from './pvolveSignUpTools'
    
    export default {
        props: ['componentData'],
        
        components: {
            pvolveTestimonials,
            signUpOffer,
            ninetyDayChallengeGuidelines,
            ninetyDayChallengeAfterOptIn
        },
        
        mixins: [pvolveColors, contestTools, designTools, globalComputedData, userAndProductInfo, impactTools, pvolveSignUpTools],

        data() {
            return {
                offerProductID: 148014,
                showCompleteSignUp: false,
                
                contestName: '90DayChallenge',
                contestMailListName: '90DayChallenge',
                
                daysLeft: null,
                hoursLeft: null,
                minutesLeft: null,
                secondsLeft: null,
                
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
                    promoCodeText: 'pvolve90day',
                    submitButtonLabel: 'Activate trial',
                    noToast: true,
                    stopThankYouPageRedirect: true
                },
                
                openGuidelinesModal: false,
                
                checkChallenge: false,
                
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
                
                testimonials: [{
                    quote: 'The focus to execute the movements is the thing that makes you sweat.',
                    author: '@Blancabyana (obsessed w/ P.volve since 2015)'
                }, {
                    quote: 'I did my second pvolve workout yesterday and my booty is sore in a way it\'s never been before !!! Please let me know when you have a pop up class in Michigan :) I would love to come!',
                    author: 'Vistoriazo (new P.volve streamer)'
                }, {
                    quote: 'I\'m seeing lines of definition on my stomach and ass that I didn\'t even know existed :)',
                    author: 'Sivantra (streaming P.volve for a few weeks)'
                }],
                
                extraMessaging() {
                    return [{
                        text: `<span class="monty" style="margin: 0; font-size: .9rem;">${ this.completeSignUpComponentData.promoCodeText ? '30 days free, then $29.99 per month after.' : '$29.99 per month.'}</span>`,
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveMintBG
                    // }, {
                    //     text: '<span class="monty" style="margin: 0; font-size: .9rem;">Cancel within your <strong>trial period to not be charged.</strong></span>',
                    //     icon: 'fas fa-caret-right',
                    //     iconColor: this.pvolveMintBG
                    }, {
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">Monthly memberships can be cancelled at any time.</span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveMintBG
                    }, {
                        text: '<span class="monty" style="margin: 0; font-size: .9rem;">Instantly access 150+ premium workouts.</span>',
                        icon: 'fas fa-caret-right',
                        iconColor: this.pvolveMintBG
                    }]
                }
            }
        },

        computed: {
            
            heroUnitComponentData() {
                return {
                    backgroundImageURL: 'mypvolve/90DayChallenge_header.jpg',
                    padding: '0',
                    textColor: '#444',
                    heroTitle: "<h1 style='font-size: 2.75rem;'>Turn your resolutions</h1> <h1 class='thickHeader' style='font-size: 2.75rem; color: " + this.pvolveMintBG + "'>into evolutions.</h1>",
                    overlayColor: '#fff',
                    overlayOpacity: '.7'
                }
            },
            
            heroImageSrc() {
                return 'https://vault.platformpurple.com/static/clients/' + this.heroUnitComponentData.backgroundImageURL
            },
            
            heroTitleStyle() {
                return 'color: ' + this.heroUnitComponentData.textColor + ';' + (this.heroUnitComponentData.textShadow ? 'text-shadow: 0px 0px 4px #000;' : '')
            },
    
            heroStyle() {
                var styleStr = ""
                styleStr += this.heroUnitComponentData.backgroundImageURL ? "background: url(" + this.heroImageSrc + "); " : ""
                styleStr += this.heroUnitComponentData.headerColor ? "background-color: " + this.heroUnitComponentData.headerColor + "; " : ""
                styleStr += "background-position: 80% 0%; "
                styleStr += "background-size: " + (this.heroUnitComponentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.heroUnitComponentData.heroHeight ? "height: " + this.heroUnitComponentData.heroHeight + "; " : ""
                styleStr += this.heroUnitComponentData.logoLink ? "cursor: pointer;" : ""
                styleStr += "padding: 0;"
                // k('styleStr: ', styleStr)
                return styleStr
            },
            
            overlayStyle() {
                let overlayColor = this.heroUnitComponentData.overlayColor
                let overlayOpacity = this.heroUnitComponentData.overlayOpacity
                let styleStr = ''
                styleStr += overlayColor ? `background-color: ${overlayColor};`: ''
                styleStr += overlayOpacity ? `opacity: ${overlayOpacity};` : ''
                
                return styleStr
            },
            
            innerHeroStyle() {
                var styleStr = `z-index: 1; width: 100%; padding: ${this.windowWidth > 768 ? "6rem 2rem" : "3rem 1rem"};`
                    // styleStr += (this.heroUnitComponentData.padding && this.windowWidth > 767 ? 'padding: ' + this.heroUnitComponentData.padding + ' 0;' : this.heroUnitComponentData.mobilePadding && this.windowWidth < 768 ? 'padding: ' + this.heroUnitComponentData.mobilePadding + ' 0;' : '')
                    // styleStr += (this.heroUnitComponentData.margin && this.windowWidth > 767 ? 'margin: ' + this.heroUnitComponentData.margin + ' 0;' : this.heroUnitComponentData.mobileMargin && this.windowWidth < 768 ? 'margin: ' + this.heroUnitComponentData.mobileMargin + ' 0;' : '')
                return styleStr
            },
            
            testimonialComponentData() {
                return {
                    id: 'pvolveSubwayTestimonials',
                    testimonials: this.testimonials
                }
            },
            
            countdownTimeLeft() {
                return this.daysLeft > -1 &&
                        this.hoursLeft > -1 &&
                        this.minutesLeft > -1 &&
                        this.secondsLeft > -1
            }
        },

        methods: {
            userNeedsToSignUpForSubscription() {
                k('userNeedsToSignUpForSubscription')
                this.completeSignUpComponentData.promoCodeText = ''
                this.completeSignUpComponentData.submitButtonLabel = 'Activate'
                
                this.showCompleteSignUp = true    
            },
            
            checkOptIn(userPurchased) {
                k('checkOptIn: ', this.checkChallenge, this.userPreferences, userPurchased)
                
                this.$q.loading.hide()
                
                if (this.checkChallenge && this.userPreferences) {
                    if (!this.contestOptIn) {
                        this.addUserToChallenge(userPurchased, () => {
                            // this.$q.notify({
                            //     message: 'You are now in the 90 Day Challenge!',
                            //     type: 'positive',
                            //     icon: 'fa-check-circle',
                            //     position: 'bottom-left'
                            // })
                            // if (!userPurchased) this.route('/library')
                            this.checkChallenge = false
                        })
                    } else {
                        // this.$q.notify({
                        //     message: 'You are now in the 90 Day Challenge!',
                        //     type: 'positive',
                        //     icon: 'fa-check-circle',
                        //     position: 'bottom-left'
                        // })
                        // if (!userPurchased) this.route('/library')
                        this.checkChallenge = false
                    }
                }
            },
            
            initPurchaseSuccessHandler() {
                this.$root.$off('purchaseSuccess')
            
                this.$root.$on('purchaseSuccess', () => {
                    k('contest purchase success!')
                    
                    this.scrollIt('hero', false, 50)
                    
                    this.$q.notify({
                        message: 'Your activation was successful!',
                        type: 'positive',
                        icon: 'fa-check-circle',
                        position: 'bottom-left'
                    })
                    
                    this.checkChallenge = true
                    
                    let userPurchased = true
                    this.checkOptIn(userPurchased)
                    
                    this.trackImpactSale()
                    
                    this.$root.$off('purchaseSuccess')
                })
            }
        },
        
        watch: {
            userInfo() {
                this.getUserPreferences(() => {})
            },
            
            userPreferences() {
                k('userPreferences watch: ', this.contestOptIn)
                this.checkOptIn()
            }
        },
        
        created() {
            k('offerProductID: ', this.offerProductID)
            
            if (this.userPreferences) {
                this.checkOptIn()
            } else {
                if (this.userInfo) {
                    this.getUserPreferences(() => {})
                }
            }
            
            this.countdown('01/10/2019 00:00:01 AM', (countdownStats) => {
                this.daysLeft = countdownStats.days
                this.hoursLeft = countdownStats.hours
                this.minutesLeft = countdownStats.minutes
                this.secondsLeft = countdownStats.seconds
            })
            
            this.initPurchaseSuccessHandler()
        }
    }
</script>

<style>
    .q-carousel-quick-nav {
        background: rgba(0, 0, 0, 0);
    }
</style>

<style scoped>
    .color-overlay {
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>