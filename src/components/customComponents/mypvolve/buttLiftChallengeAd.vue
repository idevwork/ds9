<template>
    
    <div v-if="!hideContestAd" style="height: 100%;">
        
        <div v-if="!showExpanded" align="center" style="padding: .5rem 1.7rem; background: #333; position: relative;">
            <h6 class="text-white" style="line-height: 1.3rem;">Join the <span :style="`color: ${pvolveSalmon};`">21 Day Butt Lift Challenge!</span> Starts Oct 1st. <br /><a @click="showExpanded = true" style="color: #ddd; font-size: 80%;">learn more</a></h6>
            
            <q-btn @click.stop="hideContestAd = true" flat style="max-height: 25px; padding: 0 .7rem; position: absolute; top: 0; right: 0;">
                <q-icon name="fas fa-times" color="white" style="font-size: 1rem; margin: 0;"/>
            </q-btn>
        </div>
        
        <q-slide-transition>
            <div v-if="showExpanded" style="background: url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV078-18-Cheeky-Challenge_Topbanner.png) 50% center / cover no-repeat; height: 100%;">
                <div class="row" :style="`padding: 1rem; height: 100%; ${windowWidth < 768 ? 'background-color: rgba(255, 255, 255, 0.8);' : ''}`">
                    <div class="col-12" align="right">
                        <q-btn @click="showExpanded = false" flat round style="padding: 0 .7rem;">
                            <q-icon name="fas fa-times" style="font-size: 1rem; margin: 0;"/>
                        </q-btn>
                    </div>
                    
                    <div class="col-sm-12 col-md-6">
                        <div :style="`height: 100%; ${windowWidth > 767 ? 'padding: 1rem 2rem;' : ''}`">
                            <h1 style="margin: .5rem 0 1.5rem; color: #524F4C;">P.'s 21 Day <br /><span class="thickHeader" :style="`color: ${pvolveSalmon}; font-size: 2.75rem;`">BUTT LIFT <br/> CHALLENGE</span></h1>
                            <h3 :style="`color: #524F4C; line-height: 2rem; margin: .5rem 0; text-transform: unset;`">Complete the 21 Day Butt Lift program within 4 weeks* to <br /><span :style="`color: ${pvolveSalmon};`">unlock exclusive P.volve content!</span></h3>
                            
                            <p class="monty" style="margin: 1rem 0; color: #524F4C;"><span class="thickHeader" :style="`color: ${pvolveSalmon};`">PLUS</span> Everyone who submits before and after photos will receive a 24-hour nutrition plan created by P.</p>
                            <p class="monty" style="margin: 1rem 0; color: #524F4C; font-size: .7rem;">*Between 10/1/18–10/28/18, limited to streaming customers</p>
                            
                            <q-btn flat @click="letsDoThis()" :style="`background: ${pvolveSalmon}; color: #fff; margin: .5rem 0; padding: 1rem;`">
                                <h6 class="thickHeader">Let's Do This!</h6>
                                <q-icon name="fas fa-caret-right" style="font-size: 1.4rem;" />
                            </q-btn>
                            
                            <q-btn outline :style="`color: #444; margin: .5rem 0; padding: 1rem;`" @click="hideContestAdAndSave()">
                                <h6 style="font-size: .9rem;">Hide and don't show again</h6>
                                <q-icon name="fas fa-caret-right" style="font-size: 1rem;" />
                            </q-btn>    
                            
                            <p style="font-size: .9rem;"><a href="https://www.pvolve.com/pages/21-day-butt-challenge" target="_blank">Click here for more info.</a></p>
                            
                        </div>
                    </div>
                                        
                    <div v-if="windowWidth > 767" class="col-sm-12 col-md-6">
                    
                    </div>
                    
                </div>
            </div>
        </q-slide-transition>
        
    </div>
    
</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { contestTools } from './contestTools'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    
    export default {
        name: 'buttLiftAd',
        
        mixins: [ pvolveColors, contestTools, globalComputedData, userAndProductInfo ],
        
        components: {

        },
        
        data () {
            return {
                showExpanded: false,
                hideContestAd: false,
                contestName: '21DayButtLift',
                contestMailListName: '21DAYBUTT'
            }
        },
        
        computed: {

        },
        
        watch: {
            userInfo() {
                this.getUserPreferences(() => {})
            },
            
            userPreferences() {
                if (this.contestOptIn) this.hideContestAd = true
            },  
        },
        
        methods: {
            
            letsDoThis() {
                if (this.authenticated && this.validSubscription) {
                    this.addUserToChallenge(() => {
                        this.$q.notify({
                            message: 'You are now in the 21 Day Butt Lift Challenge!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                        this.route('/library')
                    })    
                } else {
                    this.route('/offer/buttLiftChallenge')
                }
            },
            
            hideContestAdAndSave() {
                this.hideContestAd = true
                this.localStorage.set(`hideContestAd${this.contestName}`, true)
            }
        },
        
        created() {
            k('buttLiftAd: ', this.validSubscription)
            
            let hideContestAd = this.localStorage.get(`hideContestAd${this.contestName}`)
            if (hideContestAd) {
                this.hideContestAd = true
            }
            
            if (this.userPreferences) {
                if (this.contestOptIn) this.hideContestAd = true
            } else {
                if (this.userInfo) this.getUserPreferences(() => {})
            }
        }
    }
</script>

<style scoped>
    
</style>
