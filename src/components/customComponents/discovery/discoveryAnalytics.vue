<template>

    <div class="row" style="margin-top: 2rem;">
        <h4 align="center" class="col-12">
            <q-icon name="fa-star" />
            Discovery Real Time Events
        </h4>
        
        <div class="row">
            <q-btn @click="discoveryAnalyticsPartial = 'analytics'" size="sm" color="primary">
                Analytics
            </q-btn>
            
            <q-btn @click="discoveryAnalyticsPartial = 'realtime'" size="sm" color="primary">
                Realtime Events
            </q-btn>
        </div>
    
        <div class="col-12" v-if="discoveryAnalyticsPartial === 'realtime'">
            
            <table class="q-table responsive cell-delimiter striped-odd auto p-smalltext" style="width: 100%; font-size: .8rem;">
                <thead>
                    <tr>
                        <th>Session ID</th>
                        <th>Date/Time</th>
                        <th>Device Info</th>
                        <th>User IP</th>
                        <th>Show Events</th>
                    </tr>
                </thead>
            </table>

            <q-card v-for="stat in stats" :key="stat.dateTime">
                
                <q-card-main>
                    <div class="row">
                        <div class="col">
                            {{stat.sessionGroup}}
                        </div>
                        <div class="col">
                            {{normalTime(UTCtimeShift(stat.dateTime))}}
                        </div>
                        <div class="col">
                            <q-chip @click='showSessionInfo' color="primary" style="cursor: pointer;">
                                {{stat.appPlatform}} {{stat.appVersion}}
                            </q-chip>
                        </div>
                        <div class="col">
                            <q-chip @click='linkToMap' color="teal" style="cursor: pointer;">
                                {{stat.userIP}}
                            </q-chip>
                        </div>
                        <div class="col">
                            <q-chip @click="showEvents(event)" color="orange" style="cursor: pointer;">
                                {{stat.showEvents ? 'hide' : 'show'}} {{stat.events.length}} events
                            </q-chip>
                        </div>
                    </div>
                </q-card-main>
            
                <q-card-main v-if="stat.showEvents">
                    <h6>Events</h6>

                    <table class="q-table responsive cell-delimiter striped-odd auto p-smalltext" style="width: 100%; font-size: .8rem;">
                        <thead>
                            <tr>
                                <th>Date/Time</th>
                                <th>Event Type</th>
                                <th>Event Desc</th>
                                <th>Show</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="event in events" :key="event.dateTime">
                                <td>{{normalTime(UTCtimeShift(event.dateTime))}}</td>
                                <td>{{event.eventType}}</td>
                                <td>{{event.eventDesc}}</td>
                                <td>
                                    <q-chip @click="showEventInfo" color="yellow">
                                        <q-icon name="fa-list" />
                                    </q-chip>
                                </td>
                            </tr>

                        </tbody>
                    </table>

                </q-card-main>

            </q-card>
        
        </div>
        
        <div class="col-12" v-if="discoveryAnalyticsPartial === 'analytics'">
            <div class="row">
                
                <div class="col-6">
                    <h5>App Launches</h5>
                    
                    <table class="q-table responsive cell-delimiter striped-odd auto p-smalltext" style="width: 100%; font-size: .8rem;">
                        <thead>
                            <tr>
                                <td>Date</td>
                                <td>Launches</td>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="item in launchesByDay" :key="item.key_as_string">
                                <td>{{item.key_as_string}}</td>
                                <td>{{item.doc_count}}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                
                <div class="col-6">
                    <h3 class="ui header">Product Downloads</h3>
                    <table class="q-table responsive cell-delimiter striped-odd auto p-smalltext" style="width: 100%; font-size: .8rem;">
                        <thead>
                            <tr>
                                <td>Date</td>
                                <td>Downloads</td>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="item in downloadsByDay" :key="item.key_as_string">
                                <td>{{item.key_as_string}}</td>
                                <td>{{item.doc_count}}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                
                <div class="col-12">
                    <h3 class="ui header">Top 10 Products Viewed (total seconds viewed)</h3>
                    <table class="q-table responsive cell-delimiter striped-odd auto p-smalltext" style="width: 100%; font-size: .8rem;">
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>SKU</td>
                                <td>Time (H:M:S)</td>
                            </tr>
                        </thead>
                        <tbody>

                            <tr v-for="item in topViewedItems" :key="item.productSKU">
                                <td>{{item.productName}}</td>
                                <td>{{item.productSKU}}</td>
                                <td>{{secondsToHms(item.sum)}}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-12" v-if="discoveryAnalyticsPartial === 'notDiscovery'" style="margin-top: 50px; height: 100vh;">
            <h2>Sorry, you are not connected to this org.</h2>
        </div>
    
    </div>
    
</template>

<script>
    var client
    
    export default {
        
        data() {
            return {
                launchesByDay: '',
                discoveryAnalyticsPartial: '',
                stats: {},
                server: purpleLib.websocketRoute()
            }
        },
        
        computed: {
            userInfo() {
                return this.$store.state.user.info
            }  
        },
        
        watch: {
            userInfo() {
                this.checkUserOrgForStats()
            }
        },
        
        created() {
            this.checkUserOrgForStats()

            client = new nes.Client(self.get('server'))
            // var client = new nes.Client('wss://juno-dev.platformpurple.com')
        
            client.connect((err) => {
                if (err) ke(err)
                this.startEventFeed()
            }) 
            
            this.getLaunchesByDay()
            this.getDownloadsByDay()
            this.getTopViewedItems()
        },
        
        methods: {
            checkUserOrgForStats() {
                if (this.userInfo && this.userInfo.userOrgs) {

                    if (this.userInfo.userOrgs.some((o) => {
                            return o.organizationID == 4460
                        })) {
                        this.discoveryAnalyticsPartial = 'analytics'

                    } else {
                        this.discoveryAnalyticsPartial = 'notDiscovery'
                    }
                }  
            },
            
            showEventInfo(e) {
                ki('object:')
                k(j(e))
            },
        
            showEvents(e) {
                this.toggle(e.keypath + '.showEvents')
            },
            
            clearStats() {
                this.set('stats', {})  
            },
            
            startEventFeed() {
                
                var self = this
                
                kw('starting event feed')
                
                ki('server is', self.get('server'))
                
                client.subscribe('/events', (event) => {
                    // ki(event.origin)
                    if (event.origin === 'discoveryDesktop') {
                        ki('incoming event: ')
                        k(j(event))
                        // ki(event.sessionGroup, event.origin + ':', event.eventType)
                        var stats = self.get('stats')
                        
                        if (!stats[event.sessionGroup] && event.eventType === 'sessionInfo') {
                            stats[event.sessionGroup] = {
                                sessionGroup: event.sessionGroup,
                                events: []
                            }
                        }
                        
                        if (event.eventType === 'sessionInfo' || event.eventType === 'userInfo') {
                            stats[event.sessionGroup] = j_.mergeObjects(
                                stats[event.sessionGroup],
                                event
                            )   
                        } else {
                            if (stats[event.sessionGroup]) stats[event.sessionGroup].events.push(event)
                        }
                        
                        k('stats after add')
                        k(j(stats))
                        
                        self.set('stats', stats)
                    }
                    
                }, (err) => {
                    if (err) console.error('nes error', err)
                })
    
            },
            
            getLaunchesByDay() {
                var self = this
                var route = 'https://juno-dev.platformpurple.com/reports/eventTypeDateHistogram'
                var req = {
                    "index": "events2",
                    "origin": "discoveryDesktop",
                    "startMSeconds": 0,
                    "endMSeconds": Date.now(),
                    "eventType": "sessionInfo",
                    "interval": "day"
                }
                
                k('getLaunchesByDay req: ', req, route)
                
                ping.post(route, req, (res) => {
                    k('getLaunchesByDay res: ', res)
                    
                    if (res.success && res.data) self.set('launchesByDay', res.data.histogram)
                })
            },
            
            getDownloadsByDay() {
                var self = this
                var route = 'https://juno-dev.platformpurple.com/reports/eventTypeDateHistogram'
                var req = {
                    "index": "events2",
                    "origin": "discoveryDesktop",
                    "startMSeconds": 0,
                    "endMSeconds": 1512158793000,
                    "eventType": "userTapped2DownloadProduct",
                    "interval": "day"
                }
                
                k('getDownloadsByDay req: ', req, route)
                
                ping.post(route, req, (res) => {
                    k('getDownloadsByDay res: ', res)
                    if (res.success && res.data) self.set('downloadsByDay', res.data.histogram)
                })
            },
            
            getTopViewedItems() {
                var self = this
                var route = 'https://juno-dev.platformpurple.com/reports/type/productEventAgg'
                var req = {
                    "index": "events2",
                    "startMSeconds": 0,
                    "endMSeconds": Date.now(),
                    "requiredFields": ["productSKU"],
                    "aggKeys": ["productSKU"],
                    "aggType": "sum",
                    "matchFields": {
                        "eventType": "mediaPlay",
                        "origin": "discoveryDesktop"
                    },
                    "aggsObj": {
                        "productSKU": {
                            "terms": {
                                "field": "productSKU",
                                "size": 10000,
                                "order": {
                                    "sum": "desc"
                                }
                            },
                            "aggs": {
                                "sum": {
                                    "sum": {
                                        "field": "mediaEndSeconds"
                                    }
                                },
                                "productName": {
                                    "top_hits": {
                                        "size": 1,
                                        "_source": {
                                            "include": ["productName"]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                k('getTopViewedItems req: ', req, route)
                
                ping.post(route, req, (res) => {
                    k('getTopViewedItems res: ', res)
                    if (res.success && res.data) {
                        if (res.data.results && res.data.results.length > 10) res.data.results = res.data.results.slice(0, 10)
                        self.set('topViewedItems', res.data.results)
                    }
                })
            }
            
        }
    }

</script>