<template>
    
    <div v-if="authenticated && validSubscription && userInChallenge && challengeStatusData" class="bg-grey-2" style="padding: 1rem 1rem 0 1rem;">
        
        <div class="row well" style="background: url(https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV078-18-Cheeky-Challenge_Topbanner.png) 50% center / cover no-repeat; height: 100%; padding: 0;">
            
            <div v-if="challengeStatusData && challengeStatusData.totalDaysCompletedWRestDays >= 21" class="col-12" style="background: rgba(255, 255, 255, 0.85); padding: 2rem; position: relative;">
                <q-inner-loading :visible="showLoader" />
                
                <h2 align="center" class="col-12 text-grey-8 thinHeader" style="margin-bottom: 1rem;">21 Day Butt Lift Challenge <span class="thickHeader">COMPLETED</span></h2>
                <h3 align="center" class="col-12 text-grey-8" style="margin-bottom: 1rem;">Congratulations!</h3>
                
                <div align="center" style="max-width: 60rem; margin: 0 auto;">
                    <h6 class="text-grey-8" style="margin: 1rem 0;">You completed the challenge and unlocked access to exclusive content!</h6>
                    <p>Look for the "EXCLUSIVE CONTENT" section in your library!</p>
                    
                    <q-btn flat size="lg" @click="route('/library')" :style="`background: ${pvolveSalmon}; color: #fff; margin-top: 1rem;`">
                        <h6 class="thickHeader">
                            Go to your library
                            <q-icon name="fas fa-caret-right" style="font-size: 1.1rem; vertical-align: bottom;" />
                        </h6>
                    </q-btn>
                </div>

            </div>
            
            <div v-if="challengeStatusData && challengeStatusData.totalDaysCompletedWRestDays < 21" class="col-12" style="background: rgba(255, 255, 255, 0.85); padding: 2rem; position: relative;">
                <q-inner-loading :visible="showLoader" />
                
                <h2 align="center" class="col-12 text-grey-8 thinHeader" style="margin-bottom: 1rem;">21 Day Butt Lift Challenge <span class="thickHeader">Is Now Over</span></h2>
                
                <div v-if="challengeStatusData" style="max-width: 40rem; margin: 0 auto;">
                    <h6 class="text-grey-8" align="center" style="margin-top: 1rem;">You completed <span :style="`color: ${pvolveSalmon}; font-size: 1.5rem;`">{{challengeStatusData.totalDaysCompletedWRestDays}} / 21</span> days.</h6>
                    
                    <h6 align="center" class="text-grey-8" style="margin-top: 1rem;">Keep up the hard work!</h6>
                </div>
            </div>
        </div>
        
    </div>
    
</template>

<script>
    import { pvolveColors } from '../../customComponents/mypvolve/pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    
    export default {
        name: 'cheekyChallengeAd',
        
        mixins: [ pvolveColors, globalComputedData, userAndProductInfo ],
        
        components: {

        },
        
        data () {
            return {
                contestName: '21DayButtLift',
                userInChallenge: false,
                showLoader: false,
                challengeStatusData: '',
                challengeOverviewData: '',
                workoutCompleteImageSrc: 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/PLV010-17_PeachIcon_CMYK.png'
            }
        },
        
        computed: {
            validSubscription() {
                k('validSubscription: ', this.environmentJSON.e.validSubscriptionProductIDs)
                return this.environmentJSON.e.validSubscriptionProductIDs ? this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs) : false
            }
        },
        
        watch: {
            userInfo() {
                this.getUserPreferences(() => {})
            },
            
            userPreferences() {
                this.checkContestOptIn()
            },  
            
            userInChallenge() {
                if (this.userInChallenge) {
                    this.getChallengeStatus()
                    // this.getCheekyChallengeOverview()
                }
            }
        },
        
        methods: {
            checkContestOptIn() {
                let contestOptIn = this.userPreferences.find((pref) => { return pref.contestName === this.contestName })
                k('contestOptIn: ', contestOptIn)
                
                if (contestOptIn) this.userInChallenge = true
            },
            
            getChallengeStatus() {
                this.showLoader = true
                
                this.api.get(`${this.api.apiv4Route}api/client/mypvolve/challengeUserCompletionResults?challengeName=${this.contestName}&userLoginToken=${this.userLoginToken}`, (res) => {
                    k('getChallengeStatus res: ', res)
                    
                    if (res.success) {
                        this.challengeStatusData = res
                    }
                    
                    this.showLoader = false
                })
            },
            
            getCheekyChallengeOverview() {
                this.api.get(`${this.api.apiv4Route}api/client/mypvolve/cheekyChallengeOverviewAvg`, (res) => {
                    k('getCheekyChallengeOverview res: ', res)
                    
                    if (res.success) {
                        this.challengeOverviewData = res
                    }
                })
            }
        },
        
        created() {
            k('buttLiftChallengeStatus: ', this.validSubscription)
            
            if (this.userPreferences) {
                this.checkContestOptIn()
            } else {
                if (this.userInfo) this.getUserPreferences(() => {})
            }
        }
    }
</script>

<style scoped>
    
</style>
