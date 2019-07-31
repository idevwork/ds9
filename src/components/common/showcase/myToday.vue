<template>

    <div class="row justify-center">
        
        <q-toolbar style="cursor: pointer; background: #efefef;">
            <q-toolbar-title style="margin: 1rem;">
                <h4 align="center" style="margin: 0; color: #979692">
                    <span style="font-weight: 100;">MY</span> <span style="font-weight: 700; color: #F6987D;">TODAY</span>
                </h4>
            </q-toolbar-title>
        </q-toolbar>
        
        <div class="row well" style="width: 100%;">
            <div align="center" class="col-12" style="padding: 1rem;">
                <q-btn v-if="dayView && validScheduledContent" size="sm" style="background: #5CC1A3; color: white;" @click="todaysIndex = todayMemory">Go to today</q-btn>
    
                <q-btn size="sm" style="background: #5CC1A3; color: white;" @click="dayView = true, calendarView = false">Day View</q-btn>
    
                <q-btn size="sm" class="gt-sm" style="background: #5CC1A3; color: white;" @click="dayView = false, calendarView = true">Calendar View</q-btn>
            </div>
            
            <div v-if="dayView && validScheduledContent" class="row full-width" align="center">
        
                <div class="col-2 relative-position" align="center">
                    <q-icon class="verticalCenter" v-if="validScheduledContent[todaysIndex-1] && validScheduledContent[todaysIndex-1].date" name="fa-chevron-left" style="color: #5CC1A3; cursor: pointer; font-size: 4rem; right: 0;" @click="changeDate(-1)" />
                </div>
        
                <div class="col-8" style="padding: 1rem 0;">
        
                    <q-card class="full-width" align="center" color="white" style="color: black !important; cursor: pointer;">
                        <q-card-title style="background: #F6987D; position: relative; color: #fff;">
                            <h4 style="margin: 0;">{{niceDate(validScheduledContent[todaysIndex].dateTimeSeconds)}}</h4>
        
                            <q-chip floating v-if="dateToday === moDay(validScheduledContent[todaysIndex].dateTimeSeconds)" color="green-3" style="margin-top: 0; border-color: #DC3872 !important;">
                                <q-icon name="fa-calendar" />
                            </q-chip>
                        </q-card-title>
        
                        <q-card-main>
                            <h5 v-if="validScheduledContent[todaysIndex].contentType === 'text'" class="ui centered header" :style="'padding: 3rem 0 2rem; ' + (windowWidth < 768 ? 'font-size: 1.5rem;' : '')">
                                It's {{dayOfWeek(validScheduledContent[todaysIndex].dateTimeSeconds)}}!<br /><br /> {{validScheduledContent[todaysIndex].content}}
                            </h5>
        
                            <div v-if="validScheduledContent[todaysIndex].contentType !== 'text'" class="row" style="padding: 1rem 0;" @click="launchProduct(validScheduledContent[todaysIndex])">
                                <h5 style="margin-top: 0;" class="col-12">Today's Workout</h5>
                                
                                <div class="col-lg-6" align="center">
                                    <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + validScheduledContent[todaysIndex].productSKU + '/' + validScheduledContent[todaysIndex].productSKU + '_image_cover.png'" style="width: 100%;" />
                                </div>
        
                                <div class="col-lg-6">
                                    <h6 :style="windowWidth < 768 ? 'font-size: 1.5rem;' : ''">
                                        {{validScheduledContent[todaysIndex].productName}}
        
                                        <div v-if="validScheduledContent[todaysIndex].duration" class="ui label" style="border-radius: 0; background: rgba(0, 0, 0, 0);">{{(validScheduledContent[todaysIndex].duration / 60).toFixed(0)}}m</div>
                                    </h6>
                                    <div style="line-height: 2rem; font-size: 1rem;">
                                        <div style="font-weight: 100;" v-html="validScheduledContent[todaysIndex].productBlurb"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <q-icon name="fa-play-circle" style="color: #F6987D; font-size: 1.5rem;" />
        
                        </q-card-main>
        
                    </q-card>
                </div>
        
                <div class="col-2 relative-position" align="center">
                    <q-icon class="verticalCenter" v-if="todaysIndex !== validScheduledContent.length - 1" name="fa-chevron-right" style="color: #5CC1A3; cursor: pointer; font-size: 4rem; left: 0;" @click="changeDate(1)" />
                </div>
        
            </div>
            
            <q-card v-if="calendarView" align="center" style="background: #efefef;">
                <!--<div align="center" class="row" style="margin: 0 auto;">-->
                <!--    <q-btn size="sm" style="width: 8rem;" color="green" @click="showLastMonth()">Last Month</q-btn>-->
                <!--    <q-btn size="sm" style="width: 8rem;" color="green" @click="showCurrentMonth()">Current Month</q-btn>-->
                <!--</div>-->
                
                <q-card-title style="background: #F6987D; color: #fff;">
                    <h4 style="margin: 0;">{{currentMonth + ' '}} {{currentYear}}</h4>
                </q-card-title>
                
                <div class="well">
                    <div class="row">
                        
                        <div v-for="item in calendarHeader" class="col" style="max-width: 14.28%;">
                            <q-card color="white" style="color: black !important;">
                                <q-card-main style="padding: .7rem;">
                                    <h6>{{item}}</h6>
                                </q-card-main>
                            </q-card>
                        </div>
                    </div>
                        
                    <div class="row">
                    
                        <div v-for="day in monthDisplayArray" class="col" :style="(day ? '' : 'background: #777;') + 'min-width: 14.28%;'" >
                        
                            <q-card color="white" :style="'height: 88%; position: relative; color: black !important; cursor: pointer;' + (day.date ? '' : 'opacity: .5;')">
                            
                                <q-card-main v-if="day.date" style="padding: 0;">
                                
                                    <q-chip floating v-if="day.currentDay" :style="'z-index: 9; background: #FF2A52; color: #fff; font-size: ' + (windowWidth < 768 ? '.4rem;' : '.5rem;')">
                                        <q-icon name="fa-calendar" />          
                                    </q-chip>
                                
                                    <div v-if="day.contentType !== 'text'" align="center" :style="'padding: ' + (windowWidth < 768 ? '.3rem;' : '.5rem;')">
                                        <div class="row" :style="(windowWidth < 768 ? 'margin: -.5rem;' : '')">
                                            
                                            <div class="col-2">
                                                <!--<a class="ui circular label" style="background: #b9b9b9; color: #fff;">{{day.date}}</a>-->
                                                <h6 class="ui header" :style="windowWidth < 768 ? 'font-size: .8rem;' : ''">{{day.date}}</h6>
                                            </div>
                                            
                                            <div class="col-10" align="right">
                                                <span style="font-size: 0.8rem;">{{day.duration ? (day.duration / 60).toFixed(0) + 'm' : ''}}</span>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    
                                    <div @click="launchRestDay(day)" v-if="day.contentType === 'text'" align="center" :style="'padding: ' + (windowWidth < 768 ? '.25rem;' : windowWidth < 1100 ? '.25rem;' : '.5rem;')">
                                        <h6 class="float-left" :style="'line-height: .8rem; ' + (windowWidth < 768 ? 'font-size: .8rem;' : '')">{{day.date}}</h6>
                                        <h6 :style="'margin: ' + (windowWidth < 768 ? '1.2rem' : '2rem') + ' 0 .25rem 0;' + (windowWidth < 768 ? 'font-size: .8rem;' : '')">Rest Day!</h6>
                                        <p :style="'font-size: ' + (windowWidth < 768 ? '.5rem;' : '.8rem;')">Tap for a message!</p>
                                    </div>
                                    
                                    <q-card-media @click="launchProduct(day)">
                                        <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + day.productSKU + '/' + day.productSKU + '_image_cover.png'" />
                                    </q-card-media>
                                    
                                </q-card-main>
                            
                            </q-card>
                        
                        </div>
    
                    </div>
    
                </div>
                
            </q-card>
        </div>
        
    </div>

</template>

<script>
    export default {
        props: ['componentData'],
        
        data() {
            return {
                windowWidth: '',
                windowHeight: '',
                
                dayView: true,
                calendarView: false,
                
                scheduledContent: '',
                
                lastMonth: '',
                currentMonth: '',
                currentYear: '',
                
                todaysIndex: '',
                todayMemory: '',
                validScheduledContent: '',
                
                calendarHeader: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
                lastMonthArray: '',
                monthDisplayArray: '',
                
                niceDate(when) {
                    if (when) return this.moment.utc(when).format('dddd, MMMM D, YYYY')
                },
            
                dayOfMonth(when) {
                    if (when) return this.moment.utc(when).format('DD')
                },
                
                dayOfWeek(when) {
                    if (when) return this.moment.utc(when).format('dddd')
                }, 
                
                moDay(when) {
                    if (when) return this.moment.utc(when).format("MMM DD")
                }
            }
        },

        computed: {
    
            userInfo() {
                return this.$store.state.user.info
            },
    
            environmentName() {
                return this.$store.state.environment.name
            },
    
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
            
            windowWidth() {
                return this.$store.state.windowWidth
            },
            
            windowHeight() {
                return this.$store.state.windowHeight
            }
        },
    
        methods: {
            
            changeDate(delta) {
                
                // this.set({
                //     introAnim: (delta === 1) ? 'bounceRightIn' : 'bounceLeftIn',
                //     outroAnim: (delta === 1) ? 'bounceLeftOut' : 'bounceRightOut'
                // })
                
                // once you are on the last day where there is data, just jump back to today
                var todaysIndex = this.todaysIndex
                var newIndex = todaysIndex + delta
    
                this.todaysIndex = newIndex
            },
            
            getTimeReleaseData() {
                ki('*** getTimeReleaseData ***')
                
                // https://api-v4-dev2.platformpurple.com/api/scheduledContent/query?environmentName=pvolve&startMSeconds=1506816000000&endMSeconds=1507075200000
                // this.api.get(this.api.apiv4Route + 'api/scheduledContent/query?environmentName=' + this.environmentName, (res) => {
                //     k('timeReleasedData: ', res)
                //     if (!res || res.error) {
                //         // logEvent({
                //         //     eventType: 'requestError',
                //         //     eventDesc: 'error requesting timeReleasedData from API',
                //         // })
                //     }
        
                //     var scheduledContent = res.scheduledContent
                //     scheduledContent.sort((a, b) => {
                //         return a.dateTimeSeconds - b.dateTimeSeconds
                //     })
                    
                    this.scheduledContent = []
                    
                    var i = 0
                    while (i < 30) {
                        var dummyObj = {
                            "id": 2015,
                            "dateTimeSeconds": 1507161600000,
                            "contentType": "productID",
                            "content": "147844",
                            "project": "pvolve",
                            "startDateTimeSeconds": 1506988800000,
                            "endDateTimeSeconds": 1507593600000,
                            "productID": 147844,
                            "productName": "Toning Legs With Ankle Band",
                            "productSKU": "bodi4453_toninlegswith-210",
                            "productBlurb": "Sculpt, Lengthen, & Tone your thighs and legs with ankle band.",
                            "duration": 0
                        }
                        
                        dummyObj.dateTimeSeconds = this.moment(dummyObj.dateTimeSeconds).add(i, 'days').valueOf()
                        this.scheduledContent.push(dummyObj)
                        i++
                    }
                    ki('scheduledContent: ', this.scheduledContent)
                    
                    this.lastMonth = this.moment().subtract(1, 'month').format('MMMM'),
                    this.currentMonth = this.moment().format('MMMM'),
                    this.currentYear = this.moment().format('YYYY')
                    this.setupMonthData()
                // })
            },
            
            setupMonthData() {
                
                var scheduledContent = this.scheduledContent
                var lastMonth = this.lastMonth
                var currentMonth = this.currentMonth
                var currentYear = this.currentYear
                
                // randomize screenshots for the month
                // var screenshotOrder = this.generateScreenShotOrder()
                // k('screenshotOrder: ', screenshotOrder)
    
                var lastMonthArray = []
                var monthArray = []
                // var imageIndex = 0
                // var currentMonthIndex = 0
                
                scheduledContent.forEach((day) => {
                    // k(day)
                    var matchesCurrentMonth = currentMonth === this.moment.utc(day.dateTimeSeconds).format('MMMM')
                    var matchesLastMonth = lastMonth === this.moment.utc(day.dateTimeSeconds).format('MMMM')
                    if (matchesCurrentMonth) {
                    // if (matchesCurrentMonth || matchesLastMonth) {
                        day.date = this.moment.utc(day.dateTimeSeconds).format('D')
                       
                        // check if need to set screenshot
                        // if (day.contentType !== 'text') {
                        //     day.imageFilename = screenshotOrder[imageIndex]
                        //     imageIndex++
                        // }
                        
                        day.dayOfWeekIndex = this.moment.utc(day.dateTimeSeconds).day()
                        day.dayOfWeekName = this.moment.utc(day.dateTimeSeconds).format('ddd')
                        day.duration = day.duration || ''
                        day.currentDay = this.dateToday == this.moment(day.dateTimeSeconds).utc().format('MMM DD') ? true : false
                        
                        if (matchesCurrentMonth) monthArray.push(day)
                        if (matchesLastMonth) lastMonthArray.push(day)
                        
                        // currentMonthIndex++
                        
                    } 
                })
                
                var currentDate = this.moment().format('D')
                k('currentDate', currentDate)
                var todaysIndex = lastMonthArray.length + (currentDate - 1)
                // var todaysIndex = 0
                k('todaysIndex', todaysIndex)
                
                k('month arrays: ', monthArray, lastMonthArray)
                
                this.todaysIndex = todaysIndex
                this.todayMemory = todaysIndex
                this.validScheduledContent = lastMonthArray.concat(monthArray)
                
                // now add any blank days upfront
                var howManyBlanksUpFront = this.moment.utc(monthArray[0].dateTimeSeconds).day()
                ki('howManyBlanksUpFront', howManyBlanksUpFront)
                for (var i = 0; i < howManyBlanksUpFront; i++) {
                    monthArray.unshift({
                        date: ''
                    })
                }
                
                // var howManyBlanksUpFront = moment.utc(lastMonthArray[0].dateTimeSeconds).day()
                // ki('howManyBlanksUpFront', howManyBlanksUpFront)
                // for (var i = 0; i < howManyBlanksUpFront; i++) {
                //     lastMonthArray.unshift({
                //         date: ''
                //     })
                // }
                k('monthArray: ', monthArray)
                k('lastMonthArray: ', lastMonthArray)
                
                this.monthArray = monthArray
                this.lastMonthArray = lastMonthArray
                this.monthDisplayArray = monthArray

            },
    
        },
    
        watch: {
    
        },
    
        mounted() {
            this.dateToday = this.moment().format("MMM DD")
            k('today is:', this.dateToday)
            
            this.getTimeReleaseData()
        }
    }
</script>

<style scoped>
    .verticalCenter {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
