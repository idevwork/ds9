<template>
    
    <div style="height: 100%;">
        <div v-if="currentSlide === 1" align="center" class="stepCard" style="background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV003-17-PP_Bannerimages_Short_account.jpg'); background-size: cover; background-position: 50%;">
            <h3 class="thinHeader tightLetterSpacing text-white">New to P.volve?</h3>
            
            <h1 class="thickHeader tightLetterSpacing" :style="'font-weight: 700; color: ' + pvolveMintBG + ';' + (windowWidth < 992 ? 'font-size: 3rem;' : '')">Welcome!</h1>
            
            <hr />
            
            <p class="stepText biggerStepText">We want you to see maximum results, so before we start let’s go over some important info!</p>
            
            <q-btn @click="nextSlide()" :style="'padding: 0 2rem; background: ' + pvolveMintTitle + ';'">
                <h6 class="thickHeader" style="font-weight: 700;">
                    Get Started
                    <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                </h6>
            </q-btn>
        </div>
        
        <div v-if="currentSlide === 2" class="stepCard" :style="'background: ' + pvolveBrown + ';'">
            <h3 class="thinHeader tightLetterSpacing">The <span class="thickHeader tightLetterSpacing">Equipment</span></h3>
            <hr />
            
            <p class="stepText">
                I use different equipment frequently in my workouts. All the exercises can be done without equipment, but the equipment helps enhance the exercises so we’ve listed them below each video if you wish to order.
            </p>
            
            <div class="row bottomNav">
                <div class="col-6">
                    <p style="color: white; cursor: pointer;" @click="currentSlide = 1, $emit('doNotShowOnboarding'), $emit('close')">Skip <q-icon name="fa-caret-right" style="font-size: 1.2rem;" /></p>
                </div>
                
                <div class="col-6" align="right">
                    <span style="padding: .5rem;">{{currentSlide}} / 9</span>
                    <q-btn @click="nextSlide()" :style="'margin: .5rem 0; background: ' + pvolveMintTitle + ';'">
                        <h6>
                            Next
                            <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="currentSlide === 3" class="stepCard" :style="'background: ' + pvolveSalmon + ';'">
            <h3 class="thinHeader tightLetterSpacing">Where should <span class="thickHeader tightLetterSpacing"> I start?</span></h3>
            <hr />
            
            <p class="stepText">Click or tap the filter tag buttons to filter the workouts. Get started with a couple of full body workouts, then move on to targeting the body focus areas you want to tone most. Keep your workout fresh by switching up workouts, new videos are added every week.</p>
            
            <div class="row bottomNav">
                <div class="col-6">
                    <span style="color: white; cursor: pointer;" @click="currentSlide = 1, $emit('doNotShowOnboarding'), $emit('close')">Skip <q-icon name="fa-caret-right" style="font-size: 1.2rem;" /></span>
                </div>
                
                <div class="col-6" align="right">
                    <span style="padding: .5rem;">{{currentSlide}} / 9</span>
                    <q-btn @click="nextSlide()" class="bg-white" :style="'margin: .5rem 0; color: ' + pvolveSalmon + ';'">
                        <h6>
                            Next
                            <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="currentSlide === 4" class="stepCard" :style="'background: ' + pvolveMintTitle + ';'">
            <h3 class="thinHeader tightLetterSpacing">How often should <span class="thickHeader tightLetterSpacing">I work out?</span></h3>
            <hr />
            
            <p class="stepText">Ideally, 4 - 5 workouts a week will deliver maximum results. Generally, two workout days followed by a rest day is the best, but you can do three workout days in a row if you want to push yourself. Always follow three days of working out with a rest day, perhaps with some light stretching if you feel at all sore.</p>
            
            <div class="row bottomNav">
                <div class="col-6">
                    <span style="color: white; cursor: pointer;" @click="currentSlide = 1, $emit('doNotShowOnboarding'), $emit('close')">Skip <q-icon name="fa-caret-right" style="font-size: 1.2rem;" /></span>
                </div>
                
                <div class="col-6" align="right">
                    <span style="padding: .5rem;">{{currentSlide}} / 9</span>
                    <q-btn @click="nextSlide()" class="bg-white" :style="'margin: .5rem 0; color: ' + pvolveMintTitle + ';'">
                        <h6>
                            Next
                            <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="currentSlide === 5" class="stepCard" :style="'background: ' + pvolveBrown + ';'">
            <h3 class="thinHeader tightLetterSpacing">Mix <span class="thickHeader tightLetterSpacing"> It Up!</span></h3>
            <hr />
            
            <p class="stepText">It's important not to re-do the same workout in one week. I like to vary the workouts so that your body doesn't get too used to them, and to ensure you are always working different parts of the body. You can do a similar workout that focuses on the same part of the body if you like, but try to do a different video so the moves aren't identical.</p>
            
            <div class="row bottomNav">
                <div class="col-6">
                    <span style="color: white; cursor: pointer;" @click="currentSlide = 1, $emit('doNotShowOnboarding'), $emit('close')">Skip <q-icon name="fa-caret-right" style="font-size: 1.2rem;" /></span>
                </div>
                
                <div class="col-6" align="right">
                    <span style="padding: .5rem;">{{currentSlide}} / 9</span>
                    <q-btn @click="nextSlide()" class="bg-white text-grey-9" :style="'margin: .5rem 0; color: ' + pvolveBrown + ';'">
                        <h6>
                            Next
                            <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="currentSlide === 6" class="stepCard" :style="'background: ' + pvolveSalmon + ';'">
            <h3 class="thinHeader tightLetterSpacing">Form Comes <span class="thickHeader tightLetterSpacing">First</span></h3>
            <hr />
            
            <p class="stepText">One of the most important things about my method is that it is scalable and can work for everyone. Form is the most important thing. Go at your own pace, take your time, and focus on your form. If we are moving too fast in the video, slow down and focus on getting 4 or 5 perfect reps, and slowly build up to 8. You can always check out our Tutorials section to get extra instruction. </p>
            
            <div class="row bottomNav">
                <div class="col-6">
                    <span style="color: white; cursor: pointer;" @click="currentSlide = 1, $emit('doNotShowOnboarding'), $emit('close')">Skip <q-icon name="fa-caret-right" style="font-size: 1.2rem;" /></span>
                </div>
                
                <div class="col-6" align="right">
                    <span style="padding: .5rem;">{{currentSlide}} / 9</span>
                    <q-btn @click="nextSlide()" class="bg-white" :style="'margin: .5rem 0; color: ' + pvolveSalmon + ';'">
                        <h6>
                            Next
                            <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="currentSlide === 7" class="stepCard" :style="'background: ' + pvolveMintTitle + ';'">
            <h3 class="thinHeader tightLetterSpacing">Range of <span class="thickHeader tightLetterSpacing">Motion</span></h3>
            <hr />
            
            <p class="stepText">Range of motion will vary for everyone. The workout is meant to create greater ranges of motion throughout all your joints by continually opening them up and lengthening your muscles. I do a lot of leg lifts, and you’ll notice some girls in my videos lift their legs higher than others. This is because of the range of motion they have in their hips. As your hips gain more mobility, you will be able to get your leg higher and higher. As you do, you will be able to work more of your butt and lengthen the muscles in your legs. Always stay within your range of motion and don’t push it.</p>
            
            <div class="row bottomNav">
                <div class="col-6">
                    <span style="color: white; cursor: pointer;" @click="currentSlide = 1, $emit('doNotShowOnboarding'), $emit('close')">Skip <q-icon name="fa-caret-right" style="font-size: 1.2rem;" /></span>
                </div>
                
                <div class="col-6" align="right">
                    <span style="padding: .5rem;">{{currentSlide}} / 9</span>
                    <q-btn @click="nextSlide()" class="bg-white" :style="'margin: .5rem 0; color: ' + pvolveMintTitle + ';'">
                        <h6>
                            Next
                            <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="currentSlide === 8" class="stepCard" :style="'background: ' + pvolveBrown + ';'">
            <h3 class="thinHeader tightLetterSpacing">Take <span class="thickHeader tightLetterSpacing">Rest Days</span></h3>
            <hr />
            
            <p class="stepText">Always be sure to take rest days. Rest days are crucial for getting lean, tight muscles and maximum results. It allows the body to recover and reduce inflammation. Don't overdo it, and know that rest is good for your body.</p>
            
            <div class="row bottomNav">
                <div class="col-6">
                    <span style="color: white; cursor: pointer;" @click="currentSlide = 1, $emit('doNotShowOnboarding'), $emit('close')">Skip <q-icon name="fa-caret-right" style="font-size: 1.2rem;" /></span>
                </div>
                
                <div class="col-6" align="right">
                    <span style="padding: .5rem;">{{currentSlide}} / 9</span>
                    <q-btn @click="nextSlide()" class="bg-white" :style="'margin: .5rem 0; color: ' + pvolveBrown + ';'">
                        <h6>
                            Next
                            <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <div v-if="currentSlide === 9" class="stepCard" style="background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV003-17-PP_Bannerimages_Short_account.jpg'); background-size: cover; background-position: 50%;">
            <h3 class="thinHeader tightLetterSpacing">Let's <span class="thickHeader tightLetterSpacing">Get Started!</span></h3>
            <hr />
            
            <p class="stepText">Thank you! I am looking forward to your fitness journey and can't wait to see your results. <br /> -P</p>
            
            <div class="row bottomNav">
                <div class="col-6">
                    <span style="color: white; cursor: pointer;" @click="currentSlide = 1, $emit('doNotShowOnboarding'), $emit('close')">Skip <q-icon name="fa-caret-right" style="font-size: 1.2rem;" /></span>
                </div>
                
                <div class="col-6" align="right">
                    <span style="padding: .5rem;">{{currentSlide}} / 9</span>
                    <q-btn @click="currentSlide = 1, $emit('close')" :style="'margin: .5rem 0; background: ' + pvolveMintTitle + ';'">
                        <h6>
                            Next
                            <q-icon name="fa-caret-right" style="font-size: 1.1rem;" />
                        </h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
    </div>

</template>

<script>
import { pvolveColors } from './pvolveColors'

export default {
    
    mixins: [ pvolveColors ],

    data() {
        return {
            // slides: [{
                
            // }],
            currentSlide: 1
        }
    },
    
    computed: {
        windowWidth() {
            return this.$store.state.windowWidth
        }  
    },

    methods: {
        nextSlide() {
            this.currentSlide++
            document.querySelector('#pvolveOnboardingModalLayout > .scroll').scrollTop = 0
        }
    },

    mounted() {
        // console.log('componentData: ', this.componentData)
    }
}
</script>

<style scoped>
     .tightLetterSpacing {
        letter-spacing: -1px;
        margin: 0;
    }
    
    .stepCard {
        position: relative;
        width: 100%;
        min-height: 100%;
        padding: 1rem; 
        padding-bottom: 2rem;
        color: white;
    }
    
    .stepText {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.2rem;
        text-transform: none;
        margin-bottom: 3rem;
        line-height: 2rem;
        color: white;
    }
    
    .biggerStepText {
        font-size: 1.6rem;
    }
    
    .bottomNav {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 1rem 2rem;
        width: 100%;
        color: white;
    }

</style>
