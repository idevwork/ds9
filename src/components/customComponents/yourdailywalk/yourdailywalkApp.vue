<template>
    
    <div class="bg-grey-3" style="padding-bottom: 6rem;">

        <ydwSubscriberMarketing v-if="!ydwSubscriber" />
            
        <div class="col-12" style="padding: 0 1rem;">
            <walkTalk  />
        </div>
        
        <div class="well row">
            
            <div class="gt-sm col-md-4 col-xs-12" style="padding: .5rem;">
                <q-btn class="full-width" :style="'background: ' + brandColor + '; color: #fff;'" @click="goToDayView()">
                    <h6><q-icon name="fa-calendar-alt" style="font-size: 1rem; vertical-align: baseline;" /> Day View</h6>
                </q-btn>
            </div>
            
            <div class="gt-sm col-md-4 col-xs-12" style="padding: .5rem;">
                <q-btn class="full-width" :style="'background: ' + brandColor + '; color: #fff;'" @click="goToCalendarView()">
                    <h6><q-icon name="fa-calendar" style="font-size: 1rem; vertical-align: baseline;" /> Month View</h6>
                </q-btn>
            </div>
                   
            <div class="col-md-4 col-sm-12 col-xs-12" style="padding: .5rem;">
                <q-btn class="full-width" color="grey-7" @click="openMobileAppModal = true">
                    <h6><q-icon name="fa-mobile-alt" style="font-size: 1rem; vertical-align: baseline;" /> Get the mobile app!</h6>
                </q-btn>
            </div>
        
        </div>
        
        <div v-if="ydwViewPartial === 'dayView'" class="row" align="center" style="padding: 0; margin: 0;">
                            
            <div class="col-12" align="center" style="margin: 1rem 0;">
                <q-btn size="sm" :style="'background: ' + brandColor + '; color: #fff;'" @click="todaysIndex = todayMemory">
                    <h6>GO TO TODAY</h6>
                </q-btn>
            </div>
                
            <div class="col-2 relative-position" align="center">
                <q-btn v-if="todaysIndex > 0 && validScheduleData[todaysIndex - 1].date" flat @click="changeDate(-1)" style="height: 100%; width: 100%;">
                    <q-icon name="fa-chevron-left" style="color: #61980F; font-size: 2rem;" />
                </q-btn>
            </div>
            
            <div class="col-8">
                
                <q-card class="full-width" align="center" color="white" style="color: black !important; cursor: pointer; min-height: 20rem; margin: 0;">
                    <q-card-title :style="'background: ' + brandColor + '; position: relative; color: #fff;'">
                        <h4 style="margin: 0;">{{niceDate(validScheduleData[todaysIndex].dateTimeSeconds)}}</h4>
                        
                        <q-chip floating v-if="dateToday === moDay(validScheduleData[todaysIndex].dateTimeSeconds)" color="pink" style="z-index: 9; margin: 0 -.75rem !important; background: rgb(255, 42, 82); color: rgb(255, 255, 255); padding: 0.1rem 0.4rem 0.4rem;">
                            <q-icon name="fa-calendar" style="font-size: 1rem;" />
                        </q-chip>
                    </q-card-title>
                    
                    <q-card-main>
                        <div v-if="validScheduleData[todaysIndex].contentType === 'text'" style="padding: 2rem 0;">
                            <h4 :style="(windowWidth < 768 ? 'font-size: 1.5rem;' : '')">
                                It's {{dayOfWeek(validScheduleData[todaysIndex].dateTimeSeconds)}}!
                            </h4>
                            <h6 v-html="validScheduleData[todaysIndex].content"></h6>
                        </div>

                        <div v-if="validScheduleData[todaysIndex].contentType !== 'text'" class="row" style="padding: 1rem 0;" @click="launchProduct(validScheduleData[todaysIndex])">
                            
                            <div class="col-md-6" align="center">
                                <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + validScheduleData[todaysIndex].productSKU + '/' + validScheduleData[todaysIndex].productSKU + '_ws.jpg'" style="width: 100%;" />
                            </div>
                            
                            <div class="col-md-6" style="padding: 0 1rem;">
                                <h5 style="margin: 0;">
                                    {{validScheduleData[todaysIndex].productName}} 

                                </h5>
                                <div v-if="validScheduleData[todaysIndex].duration" style="border-radius: 0; background: rgba(0, 0, 0, 0);">{{(validScheduleData[todaysIndex].duration / 60).toFixed(0)}}m</div>
                                <div style="line-height: 2rem; font-size: 1rem;">
                                    <div style="font-weight: 100;" v-html="validScheduleData[todaysIndex].productBlurb"></div>
                                </div>
                            </div>
                        </div>
                        <h2 v-if="validScheduleData[todaysIndex].contentType !== 'text'" style="margin: 0; font-size: 1.5rem;">It's {{dayOfWeek(validScheduleData[todaysIndex].dateTimeSeconds)}}! Let's get healthy! <q-icon name="fa-play-circle" style="color: #61980F" /></h2>

                    </q-card-main>
                    
                </q-card>
            </div>
            
            <div class="col-2 relative-position" align="center">
                <q-btn v-if="todaysIndex !== validScheduleData.length - 1" flat @click="changeDate(1)" style="height: 100%; width: 100%;">
                    <q-icon name="fa-chevron-right" style="color: #61980F; font-size: 2rem;" />
                </q-btn>
            </div>
                
        </div>
        
        <div v-if="ydwViewPartial === 'calendarView'" class="row" align="center" style="padding: 1rem; text-align: center;" intro-outro="fade">
            <!--<div align="center" class="row" style="margin: 0 auto;">-->
            <!--    <q-btn size="sm" style="width: 8rem;" color="green" @click="showLastMonth()">Last Month</q-btn>-->
            <!--    <q-btn size="sm" style="width: 8rem;" color="green" @click="showCurrentMonth()">Current Month</q-btn>-->
            <!--</div>-->
            
            <h4 class="col-12">{{currentMonth + ' '}} {{currentYear}}</h4>
            
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
                    
                        <q-card color="white" :style="'height: calc(100% - 1rem); position: relative; color: black !important; cursor: pointer;' + (day.date ? '' : 'opacity: .5;')">
                            
                            <q-card-main v-if="day.date && day.contentType !== 'text'" @click.native="launchProduct(day)" style="padding: 0; height: 100%;">
                                <q-chip floating v-if="day.currentDay" style="z-index: 9; margin: 0 -.75rem !important; background: rgb(255, 42, 82); color: rgb(255, 255, 255); padding: 0.1rem 0.4rem 0.4rem;">
                                    <q-icon name="fa-calendar" style="font-size: 1rem;" />          
                                </q-chip>
                            
                                <div align="center" :style="'padding: ' + (windowWidth < 768 ? '.3rem;' : '.5rem;')">
                                    <div class="row" :style="(windowWidth < 768 ? 'margin: -.5rem;' : '')">
                                        
                                        <div class="col-2">
                                            <!--<a class="ui circular label" style="background: #b9b9b9; color: #fff;">{{day.date}}</a>-->
                                            <h6 :style="'margin: 0;' + (windowWidth < 768 ? 'font-size: .8rem;' : '')">{{day.date}}</h6>
                                        </div>
                                        
                                        <div class="col-10" align="right">
                                            <span style="font-size: 0.8rem;">{{day.duration ? (day.duration / 60).toFixed(0) + 'm' : ''}}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                                <q-card-media>
                                    <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/previews/' + day.productSKU + '/' + day.productSKU + '_ws.jpg'" />
                                </q-card-media>
                            </q-card-main>
                            
                            <q-card-main v-if="day.date && day.contentType === 'text'" @click.native="launchRestDay(day)" style="padding: 0; height: 100%;">
                                <q-chip floating v-if="day.currentDay" style="z-index: 9; margin: 0 -.75rem !important; background: rgb(255, 42, 82); color: rgb(255, 255, 255); padding: 0.1rem 0.4rem 0.4rem;">
                                    <q-icon name="fa-calendar" />          
                                </q-chip>
                                
                                <div align="center" :style="'padding: ' + (windowWidth < 768 ? '.3rem;' : '.5rem;')">
                                    <div class="row" :style="(windowWidth < 768 ? 'margin: -.5rem;' : '')">
                                        
                                        <div class="col-2">
                                            <h6 class="float-left" :style="'margin: 0; ' + (windowWidth < 768 ? 'font-size: .8rem;' : '')">{{day.date}}</h6>
                                        </div>
                                        
                                        <div class="col-10" align="right"></div>
                                        
                                    </div>
                                </div>
                                
                                <div class="full-width">
                                    <h6 v-if="windowWidth > 767" :style="'margin: 0;' + (windowWidth < 992 ? 'font-size: .8rem;' : '')">Rest Day!</h6>
                                    <p v-if="windowWidth > 767" :style="'margin: 0; line-height: 1rem; font-size: ' + (windowWidth < 992 ? '.6rem;' : '.8rem;')">Tap for a message!</p>
                                    <q-icon v-else name="fas fa-comment" />
                                </div>
                            </q-card-main>
                        
                        </q-card>
                    
                    </div>

                </div>

            </div>
            
        </div>
        
        <q-modal
          v-model="openMobileAppModal"
          :content-css="{minWidth: '50vw', minHeight: '30vh'}"
        >
            <q-modal-layout id="ydwMobileAppModal">
            
                <q-toolbar slot="header" :style="'background: ' + brandColor + ';'">
                    <q-btn id="closePreviewModal" flat icon="fa-chevron-left" @click="openMobileAppModal = false" />
                    <q-toolbar-title>
                        <h6><span class="thickHeader">Your Daily Walk</span> on your mobile devices!</h6>
                    </q-toolbar-title>
                </q-toolbar>
                
                <div class="row" style="padding: 2rem 1rem;">
                    <div class="col-12" align="center">
                        <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/yourdailywalk/wah_gold_icon.png" style="max-width: 6rem;" />
                        <h5 style="margin: 1rem 0;">Download <span class="thickHeader">Walk At Home Instant Access</span> to use <span class="thickHeader">Your Daily Walk</span> on your favorite mobile device!</h5>
                    </div>
                    <div class="col-6" style="padding: 1rem;">
                        <q-btn @click="goToAppLink('ios')" size="lg" class="full-width text-white" icon="fab fa-apple" :style="'background: ' + brandColor + ';'">
                            <span class="gt-sm">iOS</span>
                        </q-btn>
                    </div>
                    <div class="col-6" style="padding: 1rem;">
                        <q-btn @click="goToAppLink('android')" size="lg" class="full-width text-white" icon="fab fa-android" :style="'background: ' + brandColor + ';'">
                            <span class="gt-sm">Android</span>
                        </q-btn>
                    </div>
                </div>
            
            </q-modal-layout>
        </q-modal>
        
        <q-modal
            v-model="openRestDayModal"
            :content-css="{minWidth: '80vw', minHeight: '30vh'}"
        >
            <q-modal-layout id="ydwRestDayModal">
                
                <q-toolbar slot="header" align="center" :style="'background: ' + brandColor + ';'">
                    <q-toolbar-title>
                        <h5>
                            <q-icon name="fa-calendar" style="font-size: 1.5rem" />
                            {{restDayProductInfo.dayOfWeekName}} - Rest Day
                        </h5>
                    </q-toolbar-title>
                    
                    <q-btn id="closePreviewModal" flat icon="fa-times" @click="openRestDayModal = false" style="padding: .5rem;" />
                </q-toolbar>
                
                <div style="padding: 1rem;" align="center">
                    <p v-html="restDayProductInfo.content"></p>
                </div>
            
            </q-modal-layout>
        </q-modal>
        
    </div>

</template>

<script>
    import ydwSubscriberMarketing from './ydwSubscriberMarketing'
    import ydwCalendarMenu from './ydwCalendarMenu'
    import walkTalk from '../gowalkathome/walkTalk'
    
    export default {
        
        components: {
            ydwSubscriberMarketing,
            ydwCalendarMenu,
            walkTalk
        },
    
        data() {
            return {
                openRestDayModal: false,
                restDayProductInfo: '',
                
                openMobileAppModal: false,
                ydwSubscriber: false,
                
                dateToday: '',
                todaysIndex: '',
                todayMemory: '',
                currentMonth: '',
                currentYear: '',
                
                scheduleData: '',
                validScheduleData: '',
                monthDisplayArray: '',
                
                introAnim: 'bounceLeftIn',
                outroAnim: 'bounceRightOut',
                ydwViewPartial: '',
                calendarHeader: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],

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
            environmentProducts() {
                return this.$store.state.environmentProducts
            },
            
            userOwnsSubscription() {
                var monthlyActive = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', 109776).userActiveProduct
                var yearlyActive = this.j_.queryArrayFirstMatch(this.environmentProducts, 'productID', 109777).userActiveProduct
                k('userOwnsSubscription: ', monthlyActive, yearlyActive)
                
                return this.environmentProducts ? (monthlyActive || yearlyActive) : false
            },
            
            windowWidth() {
                return this.$store.state.windowWidth
            },
            
            windowHeight() {
                return this.$store.state.windowHeight
            },
            
            brandColor() {
                return this.$store.state.environment.json ? this.$store.state.environment.json.e.brandColor : ''
            },
        },
        
        created() {
            
            this.dateToday = this.moment().format("MMM DD")
            k('today is:', this.dateToday)
            
            this.ydwViewPartial = this.localStorage.get('ydwViewPartial') ? this.localStorage.get('ydwViewPartial') : this.windowWidth > 767 ? 'calendarView' : 'dayView'
            
            this.getTimeReleaseData()
            
            if (this.environmentProducts) {
                this.checkSubscriberStatus()
            }
        },
        
        watch: {
            environmentProducts() {
                this.checkSubscriberStatus()
            },
            
            ydwViewPartial() {
                this.localStorage.set('ydwViewPartial', this.ydwViewPartial)
            }
        },
        
        methods: {
            
            checkSubscriberStatus() {
                if (this.userOwnsSubscription) {
                    k('they are a subscriber, so changeView("myLibrary")')
                    this.ydwSubscriber = true
                    this.route('/')
                } else {
                    k('they are not a subscriber, so tapping a card opens productPreview, but with a custom subscribe section a lot like signingtime')
                    this.ydwSubscriber = false
                }
                
                k('subscriber status: ', this.ydwSubscriber)
            },
            
            goToDayView() {
                
                // var foundToday
                // var i = 0
                // var monthCalendar = this.get('monthArray')
                // while (!foundToday && i < monthCalendar.length) {
                //     if (monthCalendar[i].date === moment(Date.now()).format('D')) {
                //         this.set({
                //             'todaysIndex': i,
                //             'todayMemory': i
                //         })
                //         foundToday = true
                //     }
                //     i++
                // }
                
                this.ydwViewPartial = 'dayView'
                this.todaysIndex = this.todayMemory
            },
            
            goToCalendarView() {
                this.ydwViewPartial = 'calendarView'
            },
            
            goToPreview(e) {
                // k(e.node)
                if (e === 'annual') {
                    this.route('/shop/109777')
                } else {
                    this.route('/shop/109776')
                }
            },
            
            fbShare(e) {
                // var url = 'https://walkathome.com/your-daily-walk-app/'
                
                var quote = 'I just finished a workout: ' + e.context.productName + '!'
                var shareURL = 'https://share.yourdailywalk.com/product-preview/yourdailywalk/109776/' + quote
                var url = 'https://www.facebook.com/sharer/sharer.php?u=' + shareURL
                
                var w = window.open(url, 'name', 'width=600,height=400,toolbar=0,menubar=0,location=-100,status=1,scrollbars=0,resizable=0')
                w.focus()
                
                // r.fbSocialShare(url, function() {
                //     k('share cb')
                // }, function() {
                //     k('share cancelled')
                // })
                
                logEvent({
                    eventType: 'facebookShare',
                    eventDesc: 'user shared to Facebook: ' + e.context.productName
                })
            },
                
            twitterShare(e) {
                // var url = 'https://walkathome.com/your-daily-walk-app/'
                var text = 'I just finished a workout: ' + e.context.productName + '!'
                var shareURL = 'https://share.yourdailywalk.com/product-preview/yourdailywalk/109776/'
                // purpleLib.twitterShare(url, text)
                var url = 'https://www.twitter.com/share?url=' + shareURL
                var w = window.open(url, 'name', 'width=600,height=400,toolbar=0,menubar=0,location=-100,status=1,scrollbars=0,resizable=0')
                w.focus()
                
                logEvent({
                    eventType: 'twitterShare',
                    eventDesc: 'user shared to Twitter: ' + e.context.productName
                })
            },
            
            changeDate(delta) {
                
                // this.set({
                //     introAnim: (delta === 1) ? 'bounceRightIn' : 'bounceLeftIn',
                //     outroAnim: (delta === 1) ? 'bounceLeftOut' : 'bounceRightOut'
                // })
                
                // once you are on the last day where there is data, just jump back to today
                var todaysIndex = this.todaysIndex
                k('current day index: ', todaysIndex)
                var newIndex = todaysIndex + delta
                
                k('is there data for newIndex? ', newIndex, this.validScheduleData[newIndex])
                if (newIndex > -1 && this.validScheduleData[newIndex]) this.todaysIndex = newIndex
            },
            
            launchProduct(product) {
                k('launchProduct: ', product)
                
                if (!product.date && !product.dateTimeSeconds) return false
                if (this.ydwSubscriber) {
                    this.ydwProduct = product
                    this.route('/play/' + product.productID)
                } else {
                    this.$store.commit('setProductID2Preview', product.productID)
                    this.$root.$emit('openProductPreview', true)
                }
            },     
            
            launchRestDay(product) {
                if (!product.date && !product.dateTimeSeconds) return false
                
                this.restDayProductInfo = product
                this.openRestDayModal = true
            },
            
            getTimeReleaseData() {
                ki('*** getTimeReleaseData ***')
                
                this.api.get(this.api.apiv3Route + 'product/timeReleased/dailyWalkApp', (res) => {
                    // k('timeReleasedData: ', res)
                    if (!res || res.error) {
                        // logEvent({
                        //     eventType: 'requestError',
                        //     eventDesc: 'error requesting timeReleasedData from API',
                        // })
                    }
        
                    var scheduleData = res.body
        
                    scheduleData.sort((a, b) => {
                        return a.dateTimeSeconds - b.dateTimeSeconds
                    })
                    
                    ki('scheduleData: ', scheduleData)
                    
                    this.scheduleData = scheduleData
                    
                    this.lastMonth = this.moment().subtract(1, 'month').format('MMMM'),
                    this.currentMonth = this.moment().format('MMMM'),
                    this.currentYear = this.moment().format('YYYY')
                    this.setupMonthData()
                })
            },
            
            setupMonthData() {
                
                var scheduleData = this.scheduleData
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
                
                scheduleData.forEach((day) => {
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
                        day.dayOfWeekName = this.moment.utc(day.dateTimeSeconds).format('dddd')
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
                k('todaysIndex', todaysIndex)
                
                this.todaysIndex = todaysIndex
                this.todayMemory = todaysIndex
                this.validScheduleData = lastMonthArray.concat(monthArray)
                
                // now add any blank days upfront
                var howManyBlanksUpFront = this.moment.utc(monthArray[0].dateTimeSeconds).day()
                ki('howManyBlanksUpFront', howManyBlanksUpFront)
                for (var i = 0; i < howManyBlanksUpFront; i++) {
                    monthArray.unshift({
                        date: ''
                    })
                }
                
                // now add any blank days on end
                k('last day: ', monthArray[monthArray.length - 1])
                var howManyBlanksOnEnd = this.moment.utc(monthArray[monthArray.length - 1].dateTimeSeconds).day()
                ki('howManyBlanksOnEnd', howManyBlanksOnEnd)
                for (var i = 0; i < 6 - howManyBlanksOnEnd; i++) {
                    monthArray.push({
                        date: ''
                    })
                }

                k('monthArray: ', monthArray)
                k('lastMonthArray: ', lastMonthArray)
                
                this.monthArray = monthArray
                this.lastMonthArray = lastMonthArray
                this.monthDisplayArray = monthArray

            },
            
            showCurrentMonth() {
                this.monthDisplayArray = this.monthArray
            },
            
            showLastMonth() {
                this.monthDisplayArray = this.lastMonthArray
            },
    
            shuffleArray(array) {
                var currentIndex = array.length,
                    temporaryValue, randomIndex;
    
                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
    
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
    
                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
    
                return array
            },
            
            goToAppLink(platform) {
                if (platform === 'ios') window.open('https://itunes.apple.com/us/app/walktv-from-walk-at-home/id1329990096?mt=8', '_blank')
                if (platform === 'android') window.open('https://play.google.com/store/apps/details?id=com.platformpurple.wah.walkTV', '_blank')
            }
            
        }
    }
</script>