<template>
    
    <div id="enterCurrentProgress" class="row relative-position justify-center">
        
        <questionMarkHelp class="col-12" :componentData="{}" :helpContents="`
            <p class='monty' style='font-size: .9rem'>'Enter My Current Progress' enables you to:</p>
            <ol class='monty' style='font-size: .9rem'>
                <li>Track your progress through entering your measurements</li>
                <li>Update your progress for days that you have already tracked</li>
                <li>You can track: weight (${weightMeasureUnit}), waist (${lengthMeasureUnit}), and thigh (${lengthMeasureUnit})</li>
                <li>You can then check your progress up above in the 'My Progress' section</li>
            </ol>
        `" 
            style="margin-top: 1rem; padding: 1rem 0;"
        />
        
        <div class="col-12" align="right">
            <q-field style="padding: 1rem;">
                <q-checkbox v-model="measurementSystem" @input="measurementSystemChange" label="Use metric units" color="grey-7" true-value="metric" false-value="imperial" />
            </q-field>
        </div>
        
        <div v-if="myStats && Object.keys(myStats).length" class="col-md-6" style="padding: 2rem 1rem;">
            <q-datetime 
                id="progressDate" 
                color="grey-7" 
                class="full-width" 
                float-label="Date" 
                format="M/DD/YY" 
                :max="Date.now()" 
                v-model="displayDateTimeStamp" 
                type="date" 
            />
        
            <q-input 
                v-for="label in statLabelsToShow"
                :key="label"
                :id="`${label}ProgressInput`" 
                :float-label="`${label} (${label === 'weight' ? weightMeasureUnit : lengthMeasureUnit})`"
                color="grey-7" 
                type="number" 
                class="full-width" 
                v-model="myStats[label]"
            />
            
            <div class="row full-width">
                <q-btn outline id="saveProgress" @click="saveAssessment()" style="color: #333; background: #fff !important; margin-top: 1rem !important;">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">Save Progress</h6>
                </q-btn>
            </div>  
        </div>
        
    </div>

</template>

<script>
    import questionMarkHelp from '../questionMarkHelp'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { measurementSystem } from '../../../mixins/measurementSystem'
    
    export default {
        
        components: {
            questionMarkHelp
        },
        
        mixins: [userAndProductInfo, globalComputedData, measurementSystem],
    
        data() {
            return {
                showHelp: false,
                
                myStats: {
                    weight: '',
                    waist: '',
                    thigh: ''
                },
                
                statLabelsToShow: ['weight', 'waist', 'thigh'],
        
                labelDate: '',
                displayDateTimeStamp: '',
            }
        },
        
        computed: {
            progressData() {
                return  this.userPreferences ? this.userPreferences.filter((item) => {
                    return item.type === 'progress'
                }) : []
            },
            
            userInfoStatsMap() {
                
                var userInfoStatsMap = {}
                
                if (this.progressData && this.progressData.length) {
                    this.progressData.sort((a, b) => {
                        // k('sort: ', a, b, a.displayDateTimeStamp - b.displayDateTimeStamp)
                        return a.displayDateTimeStamp - b.displayDateTimeStamp
                    })
                    // k('progressData: ', this.progressData)
                    
                    this.progressData.forEach((stat) => {
                        var label = this.moment(stat.displayDateTimeStamp).format('M/DD/YY')
                        // k('stat: ', label, stat)
                        userInfoStatsMap[label] = stat
                    })
                }
                
                k('userInfoStatsMap: ', j(userInfoStatsMap))
                
                return userInfoStatsMap
            }
        },
    
        methods: {
    
            saveAssessment() {
                k('saveAssessment: ', this.displayDateTimeStamp, this.myStats.weight, this.myStats.waist, this.myStats.thigh)
                
                if (!this.displayDateTimeStamp) {
                    this.$q.notify({
                        message: 'Please enter a date.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                if (!this.myStats.weight && !this.myStats.waist && !this.myStats.thigh) {
                    this.$q.notify({
                        message: 'Please enter at least one statistic to track.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                
                let progress = []
                this.statLabelsToShow.forEach(statLabel => {
                    progress.push({
                        label: statLabel,
                        value: statLabel === 'weight' ? this.convertWeightForApi(this.myStats[statLabel]) : this.convertLengthForApi(this.myStats[statLabel])
                    })
                })
    
                var req = {
                    userID: this.userInfo.userID,
                    userLoginToken: this.userLoginToken,
                    type: 'progress',
                    environment: this.environmentName,
                    displayDateTimeStamp: this.displayDateTimeStamp,
                    progress: progress
                }
    
                k('progress req: ', req)
                
                var labelDate = this.moment(this.displayDateTimeStamp).format('M/DD/YY')
                let id = this.userInfoStatsMap && labelDate && this.userInfoStatsMap[labelDate]  && this.userInfoStatsMap[labelDate].id ? this.userInfoStatsMap[labelDate].id : ''
                
                this.saveUserPreferenceToAPI(id, req, res => {
                    this.displayDateTimeStamp = Date.now()
                })
            },
            
            saveUserPreferenceToAPI(preferenceID, req, cb) {
                const method = preferenceID ? 'put' : 'post';
                const endpointURL = `${this.api.ioRoute}userInfo${preferenceID ? '/' + preferenceID : ''}`
                
                k('saveUserPreferenceToAPI req: ', req, method, endpointURL)
                
                this.api[method](endpointURL, req, (res) => {
                    k('saveUserPreferenceToAPI res: ', res)
                    
                    if (res.success) {
                        if (res.docID) {
                            req.id = res.docID
                        } else {
                            req.id = preferenceID
                        }
        
                        this.replaceOrAddLocalUserPreference(req)
                    }
                    
                    cb(res)
                })
            },
            
            replaceOrAddLocalUserPreference(newPreference) {
                if (!this.userPreferences) {
                    this.$store.commit('userPreferences', []);
                }
                
                let cloneUserPreferences = this.j_.cloneObject(this.userPreferences)
                
                // this clone of this function from userAndProductInfo also needs to compare labelDates so there is only one record from each day
                let index = cloneUserPreferences.findIndex(preference =>  {
                    return preference['type' || 'userInfoType'] === newPreference['type' || 'userInfoType'] && this.moment(preference.displayDateTimeStamp).format('M/DD/YY') === this.moment(newPreference.displayDateTimeStamp).format('M/DD/YY')
                })
                k('replaceOrAddLocalUserPreference index: ', index)
                
                if (index > -1) {
                    cloneUserPreferences[index] = newPreference;
                } else {
                    cloneUserPreferences.push(newPreference)
                }
    
                this.$store.commit('userPreferences', cloneUserPreferences)
            },
            
            setDateProgress() {
                k('setDateProgressFor: ', this.moment(this.displayDateTimeStamp).format('M/DD/YY'))
                
                let preferenceForTimeStamp = this.progressData.find((item) => {
                    k('progressData find: ', this.moment(item.displayDateTimeStamp).format('M/DD/YY'))
                    return this.moment(item.displayDateTimeStamp).format('M/DD/YY') === this.moment(this.displayDateTimeStamp).format('M/DD/YY')
                })
                
                k('setDateProgress: ', preferenceForTimeStamp)
                
                if (preferenceForTimeStamp) {
                    preferenceForTimeStamp.progress.forEach((item) => {
                        let displayValue = item.label === 'weight' ? this.displayWeight(item.value) : this.displayLength(item.value)
                        this.myStats[item.label] = displayValue
                    })
                    
                    k('myStats: ', this.myStats)
                } else {
                    this.resetMyStats()
                }
            },

            measurementSystemChange(value) {
                k('measurementSystemChange: ', value)
                this.saveMeasurementSystem(value)
            },
            
            resetMyStats() {
                k('reset myStats')
                                    
                this.statLabelsToShow.forEach(statLabel => {
                    this.myStats[statLabel] = ''
                })
            }
    
        },
    
        watch: {
            userInfo() {
                if (this.userInfo && this.userInfo.userID) {
                    this.getUserPreferences(() => {})
                }
            },
            
            userPreferences() {

            },
            
            displayDateTimeStamp() {
                k('displayDateTimeStamp: ', this.displayDateTimeStamp)
                this.setDateProgress()
            },
                
            measurementSystem() {
                this.setDateProgress()
            }
        },
    
        created() {
            if (this.statLabelsToShow) this.resetMyStats()
            
            this.displayDateTimeStamp = Date.now()
            
            if (this.userPreferences) {
                
            } else if (this.userInfo && this.userInfo.userID) {
                this.getUserPreferences(() => {})
            }
        }
    }
</script>

<style scoped>
    .padded {
      padding: .5rem;
    }
</style>