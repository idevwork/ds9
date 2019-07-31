<template>
    
    <div>
        <div id="hero" class="row" :style="heroStyle">
            
            <div id="headerColor" :style="innerHeroStyle">
                
                <h2 v-if="heroUnitComponentData.heroTitle" align="center" :style="heroTitleStyle" v-html="heroUnitComponentData.heroTitle"></h2>
                
                <signUpOfferOld 
                    v-if="localOfferProductID" 
                    class="shadow-14"
                    :productIDsToCheck="environmentJSON.e.validSubscriptionProductIDs" 
                    :offerProductID="localOfferProductID" 
                    :completeSignUpComponentData="completeSignUpComponentData" 
                    :buttonColor="pvolveMintTitle" 
                    :signUpBackgroundColor="pvolveMintBG" 
                    :subscribeRoute="subscribeRoute" 
                    subscribeLabel="Yes, I would like to receive news, updates and exclusive tips from P." 
                    style="margin: 1rem auto; max-width: 35rem; padding: 1rem; border-radius: .25rem;" 
                    @userHasAccess="route('/library')"
                />
                
            </div>
        
        </div>

        <div class="row well">
        
            <div class="col-sm-12" style="padding: 2rem 0;">
                
                <h1 align="center">everything you need<br/><span class="thickHeader" :style="'color: ' + pvolveMintTitle + ';'">to succeed & more</span></h1>
                <p class="thickHeader" align="center" :style="'margin: 1rem 0; color: ' + pvolveMintTitle + ';'">We've got your back from the very start, with a comprehensive program <br /> designed to support your fitness evolution.</p>
                
            </div>
            
            <div class="col-sm-12 col-md-4" align="center" style="padding: 1rem;">
                <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/MaximumWorkoutFull.png" style="width: 100%;" />
                <p class="thickHeader" :style="'margin: 0; color: ' + pvolveMintTitle + ';'">Premium workout selection</p>
                <p style="font-size: .8rem; margin: 0;">Start with how-to tutorials</p>
                <p style="font-size: .8rem; margin: 0;">New workouts added weekly</p>
                <p style="font-size: .8rem; margin: 0;">Archived workout library</p>
                <p style="font-size: .8rem; margin: 0;">Structured workout plans</p>
            </div>
            
            <div class="col-sm-12 col-md-4" align="center" style="padding: 1rem;">
                <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PVolveFull.png" style="width: 100%;" />
                <p class="thickHeader" :style="'margin: 0; color: ' + pvolveMintTitle + ';'">Maximize every workout</p>
                <p style="font-size: .8rem; margin: 0;">Exercise with custom gear</p>
                <p style="font-size: .8rem; margin: 0;">Workout options for no equipment</p>
                <p style="font-size: .8rem; margin: 0;">Filter workouts by body part or equipment</p>
            </div>
            
            <div class="col-sm-12 col-md-4" align="center" style="padding: 1rem;">
                <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV002-17_Website_StreamingPage_Features.jpg" style="width: 100%;" />
                <p class="thickHeader" :style="'margin: 0; color: ' + pvolveMintTitle + ';'">Personalized features</p>
                <p style="font-size: .8rem; margin: 0;">Data tracker to track your evolution</p>
                <p style="font-size: .8rem; margin: 0;">Workout calendar to keep you on schedule</p>
                <p style="font-size: .8rem; margin: 0;">Motivating workout reminders</p>
            </div>
            
            <div class="col-12" align="center" style="padding: 2rem 0;">
                <q-btn @click="scrollIt('seeHowItWorks')" big :style="'background: ' + pvolveMintTitle + '; color: #fff;'">
                    <span class="monty" style="font-size: 140%;">
                        See how it works
                        <q-icon name="fa-caret-right" style="margin-left: 1rem; font-size: 2rem !important;" />
                    </span>
                </q-btn>
            </div>

        </div>
        
        <div class="bg-grey-3 row" style="padding: 1rem;">
            <div class="well row">
            
                <q-carousel class="col-12" quick-nav infinite autoplay color="grey" style="padding-bottom: 4rem;">
                    <q-carousel-slide v-for="slide in brandTestimonials" :key="slide.id" align="center">
                        <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/quote_icon.png" />
                        <h1 class="thinHeader" style="text-transform: none; color: #444;">{{slide.quote}}</h1>
                        <img align="center" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/' + slide.imageFilename" style="width: 100%; max-width: 300px; padding: 2rem;" />
                    </q-carousel-slide>
                </q-carousel>
                
            </div>
        </div>
        
        <div class="row" style="padding: 2rem 0; background: rgb(134,142,154); background: radial-gradient(circle, rgba(134,142,154,1) 0%, rgba(134,142,154,1) 35%, rgba(63,68,75,1) 100%);">
            <div class="col-12">
                <h6 class="text-white" align="center" style="text-transform: uppercase;">Featured In:</h6>
            </div>
            
            <div class="well row justify-center" style="padding: 2rem 1rem;">
                
                <div class="col-xs-12 col-sm-6 col-md relative-position" style="padding: 1rem;">
                    <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/Shape-Magazine-Logo_small_white.png" style="width: 100%; max-width: 300px; margin: 0 auto; display: block;" />
                </div>   
                
                <div class="col-xs-12 col-sm-6 col-md relative-position" style="padding: 3rem 1rem;">
                    <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/popsugar-logo_small_white.png" style="width: 100%; max-width: 500px; margin: 0 auto; display: block;" />
                </div>    
                
                <div class="col-xs-12 col-sm-6 col-md relative-position" style="padding: 2rem;">
                    <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/VOGUE_LOGO_small_white.png" style="width: 100%; max-width: 500px; margin: 0 auto; display: block;" />
                </div> 
                
                <div class="col-xs-12 col-sm-6 col-md relative-position" style="padding: 2rem 1rem;">
                    <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/well-good-Logo_small_white.png" style="width: 100%; max-width: 500px; margin: 0 auto; display: block;" />
                </div>
                
                <div class="col-xs-12 col-sm-6 col-md relative-position" style="padding: 2rem 1rem;">
                    <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/Cosmopolitan_logo_small_white.png" style="width: 100%; max-width: 500px; margin: 0 auto; display: block;" />
                </div>   
            </div>
        </div>
        
        <div class="row">
            <div id="seeHowItWorks" class="well row" style="padding: 3rem 0;">
                <div class="col-12">
                    <q-video src="https://player.vimeo.com/video/240917495?color=ffffff&title=0&byline=0&portrait=0" style="width: 100%; height: 480px; margin: 0 auto;" />
                </div>
            </div>
        </div>
        
        <div class="bg-grey-3" style="padding: 1rem;">
            <pvolveTestimonials />
        </div>

    </div>
      
</template>

<script>
    import signUpOfferOld from '../../common/showcase/signUpOfferOld.vue'
    import heroUnit from '../../common/showcase/heroUnit.vue'
    import pvolveFooter from './pvolveFooter.vue'
    import pvolveTestimonials from './pvolveTestimonials'
    import { pvolveColors } from './pvolveColors'
    import { designTools } from '../../../mixins/designTools'
    import { impactTools } from './impactTools'
    
    export default {
        props: ['componentData'],
        
        components: {
            pvolveTestimonials,
            signUpOfferOld,
            heroUnit,
            pvolveFooter
        },

        data() {
            return {
                footerData: '',
                localOfferProductID: '',

                subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList',
                
                completeSignUpComponentData: {
                    header: 'Step 2: Payment information',
                    componentName: 'CreditCardForm',
                    productInfo: '',
                    showFirstAndLastNameFields: true,
                    firstName: '',
                    lastName: '',
                    promoCodeText: 'subway30',
                    showCodeFields: false,
                    loadHook: 'addProductToCart',
                    submitButtonLabel: 'Submit',
                    noToast: true
                },
                
                heroUnitComponentData: {
                    backgroundImageURL: 'mypvolve/PLV003-17-PP_Bannerimages_LG_Library.jpg',
                    padding: '2rem',
                    textColor: '#fff',
                    heroTitle: "<h1 style='margin: 0;'>access 30 days of <br /><span class='thickHeader'>free streaming workouts!</span></h1>"
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
                
                testimonials: [{
                    quote: 'The focus to execute the movements is the thing that makes you sweat.',
                    author: '@Blancabyana (obsessed w/ P.volve since 2015)'
                }, {
                    quote: 'I did my second pvolve workout yesterday and my booty is sore in a way it\'s never been before !!! Please let me know when you have a pop up class in Michigan :) I would love to come!',
                    author: 'Vistoriazo (new P.volve streamer)'
                }, {
                    quote: 'I\'m seeing lines of definition on my stomach and ass that I didn\'t even know existed :)',
                    author: 'Sivantra (streaming P.volve for a few weeks)'
                }]
            }
        },
        
        mixins: [pvolveColors, designTools, impactTools],

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
            
            offerProductID() {
                return this.$root.$store.state.offerProductID
            },
            
            heroImageSrc() {
                return 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/' + this.heroUnitComponentData.backgroundImageURL
            },
            
            heroTitleStyle() {
                return 'color: ' + this.heroUnitComponentData.textColor + ';' + (this.heroUnitComponentData.textShadow ? 'text-shadow: 0px 0px 4px #000;' : '')
            },
    
            heroStyle() {
                var styleStr = ""
                styleStr += this.heroUnitComponentData.backgroundImageURL ? "background: url(" + this.heroImageSrc + "); " : ""
                styleStr += this.heroUnitComponentData.headerColor ? "background-color: " + this.heroUnitComponentData.headerColor + "; " : ""
                styleStr += "background-position: 50%; "
                styleStr += "background-size: " + (this.heroUnitComponentData.backgroundSize || 'cover') + "; "
                styleStr += "background-repeat: no-repeat; "
                styleStr += this.heroUnitComponentData.heroHeight ? "height: " + this.heroUnitComponentData.heroHeight + "; " : ""
                styleStr += this.heroUnitComponentData.logoLink ? "cursor: pointer;" : ""
                styleStr += "padding: " + (this.windowWidth > 992 ? " 4rem" : "1rem") + ";"
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
                var styleStr = "z-index: 1; width: 100%;"
                    styleStr += (this.heroUnitComponentData.padding && this.windowWidth > 767 ? 'padding: ' + this.heroUnitComponentData.padding + ' 0;' : this.heroUnitComponentData.mobilePadding && this.windowWidth < 768 ? 'padding: ' + this.heroUnitComponentData.mobilePadding + ' 0;' : '')
                    styleStr += (this.heroUnitComponentData.margin && this.windowWidth > 767 ? 'margin: ' + this.heroUnitComponentData.margin + ' 0;' : this.heroUnitComponentData.mobileMargin && this.windowWidth < 768 ? 'margin: ' + this.heroUnitComponentData.mobileMargin + ' 0;' : '')
                return styleStr
            },
            
            testimonialComponentData() {
                return {
                    id: 'pvolveSubwayTestimonials',
                    testimonials: this.testimonials
                }
            }
        },

        methods: {
            initPurchaseSuccessHandler() {
                this.$root.$off('purchaseSuccess')
                
                this.$root.$on('purchaseSuccess', (res) => {
                    k('subway purchase success!')
                    
                    this.trackImpactSale()
                    
                    fbq('track', 'OOHStreaming')
                    
                    this.$root.$off('purchaseSuccess')
                })
            }
        },
        
        watch: {
            environmentJSON() {
                k('environmentJSON watch: ', this.environmentJSON)
                this.footerData = this.$root.homePageSectionFromID('footer')
                k('footerData watch: ', this.$root.homePageSectionFromID('footer'))
            }
        },
        
        mounted() {
            k('offerProductID: ', this.offerProductID)
            
            if (!this.offerProductID) {
                // no productID to use
                // this.$store.commit('addKeyPathInStore', { keyPath: 'offerProductID', value: String(148014) })
                this.localOfferProductID = 148014
            } else {
                this.localOfferProductID = this.offerProductID    
            }
            
            k('localOfferProductID: ', this.localOfferProductID)
            
            this.initPurchaseSuccessHandler()
            
            if (this.environmentJSON) {
                k('environmentJSON init: ', this.environmentJSON)
                this.footerData = this.$root.homePageSectionFromID('footer')
                k('footerData init: ', this.$root.homePageSectionFromID('footer'))
            }
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
      
    .q-carousel-quick-nav {
        background: rgba(0, 0, 0, 0);
    }
</style>