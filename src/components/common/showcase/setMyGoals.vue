<template>

    <div id="setMyGoals" class="row justify-center relative-position justify-center">

        <questionMarkHelp class="col-12" :componentData="{}" :helpContents="`
            <p class='monty' style='font-size: .9rem'>'Set My Goals' enables you to:</p>
            <ol class='monty' style='font-size: .9rem'>
                <li>Enter goals for your progress</li>
                <li>You can track: workout time, weight (${weightMeasureUnit}), waist (${lengthMeasureUnit}), and thigh (${lengthMeasureUnit})</li>
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

        <div class="col-lg-6 row" style="padding: 2rem 1rem;">

            <h6 class="col-12" style="margin: 1rem 0; letter-spacing: 1px;">
                Measurement goals:
            </h6>

            <q-input 
                id="weightInput" 
                type="tel" 
                class="full-width inputBox" 
                color="grey" 
                v-model="assessmentGoals.weight" 
                :float-label="'Weight (' + weightMeasureUnit + ')'" 
                placeholder="" 
                @input="showSaveProgressGoal = true" 
            />

            <div class="col-6" style="padding-right: .5rem;">
                <q-input 
                    id="waistInput" 
                    class="inputBox" 
                    type="tel" color="grey" 
                    v-model="assessmentGoals.waist" 
                    :float-label="'Waist Measurement (' + lengthMeasureUnit + ')'" 
                    placeholder="" 
                    @input="showSaveProgressGoal = true" 
                />
            </div>

            <div class="col-6" style="padding-left: .5rem;">
                <q-input 
                    id="thighInput" 
                    class="inputBox" 
                    type="tel" color="grey" 
                    v-model="assessmentGoals.thigh" 
                    :float-label="'Thigh Measurement (' + lengthMeasureUnit + ')'" 
                    placeholder="" 
                    @input="showSaveProgressGoal = true" 
                />
            </div>

            <div v-if="showSaveProgressGoal" class="col-12" style="margin-top: 1rem;">
                <q-btn outline id="saveProgressGoal" @click="saveProgressGoal()" :disabled="!assessmentGoals.weight || !assessmentGoals.waist || !assessmentGoals.thigh" :style="`color: #333; background: #fff !important;`">
                    <h6 style="font-size: .8rem; letter-spacing: 1px;">Save Progress Goal</h6>
                </q-btn>
            </div>

        </div>

    </div>

</template>

<script>
    import questionMarkHelp from '../questionMarkHelp'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'
    import { measurementSystem } from '../../../mixins/measurementSystem'

    export default {
        props: ['cardBackgroundColor', 'buttonBackgroundColor'],
        
        components: {
            questionMarkHelp
        },

        mixins: [ globalComputedData, userAndProductInfo, measurementSystem ],

        data() {
            return {
                showHelp: false,
                assessmentGoals: {
                    weight: '',
                    waist: '',
                    thigh: ''
                },

                workoutsPerWeek: '',
                minutesPerWorkout: '',

                currentGoal: '',
                currentProgressGoal: '',

                showSaveGoal: false,
                showSaveProgressGoal: false,
            }
        },

        computed: {
            // currentProgressGoal() {
            //     return this.userPreferences ? this.userPreferences.filter((item) => {
            //         return item.type === 'goal' && item.goalType === 'progress'
            //     })[0] : ''
            // }
        },

        methods: {

            checkUserInfoData() {
                k('checkUserInfoData: ', this.userPreferences)

                this.userPreferences.forEach((item) => {
                    if (item.type === 'goal' && item.goalType === 'mediaPlaySeconds') {
                        k('found current goal: ', item)
                        this.currentGoal = item
                        // this.goalTarget = (item.goalTarget / 60 / 60).toFixed(2)
                        this.workoutsPerWeek = item.goalWorkoutsPerWeek
                        this.minutesPerWorkout = item.goalMinutesPerWorkout
                    }

                    if (item.type === 'goal' && item.goalType === 'progress') {
                        k('found current goal: ', item)
                        let itemClone = {...item}
                        let weightValue = itemClone.goalTargets.find(p => p.label === 'weight').value
                        let waistValue = itemClone.goalTargets.find(p => p.label === 'waist').value
                        let thighValue = itemClone.goalTargets.find(p => p.label === 'thigh').value
                        itemClone.goalTargets = [
                            {label: "weight", value: this.displayWeight(weightValue)},
                            {label: "waist", value: this.displayLength(waistValue)},
                            {label: "thigh", value: this.displayLength(thighValue)},
                        ]
                        this.currentProgressGoal = itemClone
                    }
                })
            },

            saveWorkoutGoal() {
                var req = {
                    userID: this.userInfo.userID,
                    userLoginToken: this.userLoginToken,
                    type: 'goal',
                    environment: this.environmentName,
                    goalType: 'mediaPlaySeconds',
                    goalInterval: 'week',
                    goalTarget: (this.workoutsPerWeek * this.minutesPerWorkout) * 60,
                    goalWorkoutsPerWeek: this.workoutsPerWeek,
                    goalMinutesPerWorkout: this.minutesPerWorkout,
                    notifyUser: true
                }

                // k('workoutGoal req: ', req)

                if (this.currentGoal) {
                    req.id = this.currentGoal.id
                    this.sendGoalUpdateToAPI(req)
                } else {
                    this.sendGoalToAPI(req)
                }
            },

            sendGoalUpdateToAPI(req) {
                this.api.put(this.api.ioRoute + 'userInfo/' + this.currentGoal.id, req, (res) => {
                    // k('workoutGoal res: ', res)

                    if (res.success) {
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        //remove current obj before locally adding
                        var index
                        var i = 0
                        this.userPreferences.forEach((item) => {
                            if (item.id === this.currentGoal.id) index = i
                            i++
                        })
                        this.userPreferences.splice(index, 1)

                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.currentGoal = req
                        this.showSaveGoal = false
                        this.$q.notify({
                            message: 'Goal updated!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'Goal was not saved. Please try again.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            sendGoalToAPI(req) {
                this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                    // k('workoutGoal res: ', res)

                    if (res.success) {
                        req.id = res.docID
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.currentGoal = req
                        this.showSaveGoal = false

                        this.$q.notify({
                            message: 'Goal updated!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'Goal was not saved. Please try again.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            saveProgressGoal() {

                var req = {
                	userID: this.userInfo.userID,
                	userLoginToken: this.userLoginToken,
                	type: 'goal',
                	environment: this.environmentName,
                	goalType: 'progress',
                	goalInterval: 'week',
                	goalTargets: [],
                	notifyUser: true
                }

                if (this.assessmentGoals.weight) {
                    req.goalTargets.push({
            			"label": "weight",
            			"value": this.convertWeightForApi(this.assessmentGoals.weight)
            		})
                }

                if (this.assessmentGoals.waist) {
                    req.goalTargets.push({
            			"label": "waist",
            			"value": this.convertLengthForApi(this.assessmentGoals.waist)
            		})
                }

                if (this.assessmentGoals.thigh) {
                    req.goalTargets.push({
            			"label": "thigh",
            			"value": this.convertLengthForApi(this.assessmentGoals.thigh)
            		})
                }

                k('saveProgressGoal req: ', req)

                if (this.currentProgressGoal) {
                    req.id = this.currentProgressGoal.id
                    this.updateProgressGoalToAPI(req)
                } else {
                    this.saveProgressGoalToAPI(req)
                }

            },

            saveProgressGoalToAPI(req) {
                this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                    // k('saveProgressGoal res: ', res)
                    if (res.success) {
                        req.id = res.docID
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.showSaveProgressGoal = false
                        this.$q.notify({
                            message: 'Goal set!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'Goal was not saved. Please try again.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            updateProgressGoalToAPI(req) {
                this.api.put(this.api.ioRoute + 'userInfo/' + this.currentProgressGoal.id, req, (res) => {
                    // k('saveProgressGoal res: ', res)
                    if (res.success) {
                        if (!this.userPreferences) this.$store.commit('userPreferences', [])
                        //remove current obj before locally adding
                        var index
                        var i = 0
                        this.userPreferences.forEach((item) => {
                            if (item.id === this.currentProgressGoal.id) index = i
                            i++
                        })
                        this.userPreferences.splice(index, 1)

                        this.userPreferences.push(req)
                        this.$store.commit('userPreferences', this.userPreferences)

                        this.showSaveProgressGoal = false
                        this.$q.notify({
                            message: 'Goal updated!',
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: 'Goal was not saved. Please try again.',
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            },

            measurementSystemChange(value) {
                this.saveMeasurementSystem(value)
            },

        },

        watch: {

            userPreferences() {
                this.checkUserInfoData()
            },

            userInfo() {
                this.getUserPreferences(() => {})
            },

            workoutsPerWeek() {
                if (this.minutesPerWorkout) this.goalTarget = ((this.workoutsPerWeek * this.minutesPerWorkout) / 60).toFixed(2)
            },

            minutesPerWorkout() {
                if (this.workoutsPerWeek) this.goalTarget = ((this.workoutsPerWeek * this.minutesPerWorkout) / 60).toFixed(2)
            },

            currentProgressGoal() {
                k('currentProgressGoal watch: ', this.currentProgressGoal)

                if (this.currentProgressGoal) {
                    this.currentProgressGoal.goalTargets.forEach((item) => {
                        this.assessmentGoals[item.label] = item.value
                    })
                }
            },

            measurementSystem() {
                this.checkUserInfoData()
            }
        },

        created() {

            if (this.userPreferences) {
                this.checkUserInfoData()
            } else {
                if (this.userInfo) {
                    this.getUserPreferences(() => {})
                }
            }
        }
    }

</script>

<style scoped>
    .productCard {
        height: 100%;
    }
</style>
