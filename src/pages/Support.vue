<template>
    
    <div class="support-view">
        <q-card v-if="userInfo.purpleTeam" align="center" class="memberStatus bg-white">

            <q-btn color="grey-7" class="full-width" style="width: 15rem !important;" @click="showStatus = !showStatus">
                <h6 style="font-size: 1.3rem; margin: 0;">Admin Status</h6>
                <q-icon :name="showStatus ? 'fa-chevron-down' : 'fa-chevron-right'" style="margin-left: .5rem; font-size: 1.2rem;" />
            </q-btn>
            
            <q-card-main v-if="showStatus" style="width: 15rem;">
                <h6 style="margin-top: 0;">I am currently:</h6> 
                <h6>
                    <q-icon name="fa-circle" :color="supportAdminOnline ? 'green' : 'red'" /> 
                    {{supportAdminOnline ? 'online' : 'offline'}}
                </h6>
                
                <hr />
                
                <q-btn @click="setAdminStatus()" size="sm" class="full-width" :color="supportAdminOnline ? 'red' : 'green'">
                    <h6>Show me {{supportAdminOnline ? 'offline' : 'online'}}</h6>
                </q-btn>
            </q-card-main>
            
        </q-card>
        
        <div class="well">
    
            <div class="row justify-center">
                <div class="col-12" align="center" style="padding: 2rem 0 1rem 0;">
                    <q-icon name="fa-medkit" class="big-icon" /> 
                    <h4 style="font-size: 2rem; margin: 0;">Support</h4>
                    {{ $root.$store.state.user.info.purpleTeam ? 'Purple team member' : 'Ask questions, get help, leave happy.' }}
                </div>
            </div>
            
            <q-page-sticky position="top-right" :offset="[18, 58]" style="z-index: 1;">
                <q-btn id="createNewIssueBtn" v-if="!currentIssueID && !userInfo.purpleTeam" @click="createNewIssue()" round raised size="lg" color="blue" class="shadow-5" :style="'z-index: 999; ' + this.brandColor ? 'background: ' + this.brandColor + ' !important;' : ''">
                    <q-tooltip self="top right" anchor="bottom left">
                        Create new issue
                    </q-tooltip>
                   <q-icon name="fa-plus" class="big-icon" />
                </q-btn>
                
                <q-btn id="exitIssueBtn" v-if="currentIssueID" @click="route('/support')" round raised size="lg" color="grey" class="shadow-5" style="z-index: 999;">
                    <q-tooltip self="top right" anchor="bottom left">
                        Back to list
                    </q-tooltip>
                   <q-icon name="fa-times" class="big-icon" />
                </q-btn>
            </q-page-sticky>
            
            <div class="row">
                <h6 v-if="onlineSupportTeam.length" class="col-12">Online Support Team</h6>
                
                <div v-if="onlineSupportTeam.length" class="col-2" v-for="person in onlineSupportTeam" :key="person.userID">
                    <q-item>
                        <q-item-side :avatar="'https://f3r6v6t8.ssl.hwcdn.net/static/teamAvatars/' + person.userID + '.jpg'" />
                        <q-item-main>
                            <q-item-tile label>{{person.firstName}}</q-item-tile>
                            <!--<q-item-tile sublabel>Subhead</q-item-tile>-->
                        </q-item-main>
                    </q-item>
                </div>
            </div>
            
            <q-card class="full-width relative-position" style="min-height: 4rem;">
                
                <div 
                    v-if="supportIssues || currentIssueID" :is="currentIssueID ? 'SupportIssue' : 'SupportList'" 
                    :currentIssueID="currentIssueID" 
                    :newIssue="newIssue"
                    @next="nextIssue"
                    @previous="previousIssue"
                ></div>
                
                <div v-if="!supportIssues && !currentIssueID" style="padding: 1rem;">
                    <q-inner-loading visible />
                </div>
                
                <q-inner-loading :visible="issueLoader" />
            </q-card>
            
        </div>
    </div>
    
</template>

<script>
    
    import SupportList from '../components/common/support/SupportList'
    import SupportIssue from '../components/common/support/SupportIssue'
    
    import Nes from 'nes'
    var nesClient

    export default {
        props: ['currentIssueID'],
        
        data() {
            return {
                loading: false,
                showStatus: true,
                newIssue: false,
                subscribedIssueID: '',
                subscribed2issues: false
            }
        },
        
        components: {
            SupportList, SupportIssue
        },
        
        computed: {
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
            
            userInfo() {
                return this.$store.state.user.info
            },
            
            anonymousUserID() {
                return this.$store.state.user.anonymousUserID
            },
            
            environmentData() {
                return this.$store.state.environment.data
            },
            
            environmentName() {
                return this.$store.state.environment.name
            },
            
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            },
            
            supportIssues() {
                return this.$store.state.support.supportIssues
            },
            
            pageOffset() {
                return this.$store.state.support.pageOffset
            },
            
            batchSize() {
                return this.$store.state.support.batchSize
            },
            
            displayStart() {
                return ( this.pageOffset - 1 ) * this.batchSize
            },
            
            onlineSupportTeam() {
                return this.$store.state.support.onlineSupportTeam
            },
            
            supportAdminOnline() {
                return this.onlineSupportTeam.length ? this.onlineSupportTeam.filter((item) => {
                    // k('supportAdminOnline: ', item.userID, this.userInfo.userID)
                    return item.userID === this.userInfo.userID
                })[0] : false
            },
            
            issueFilter() {
                return this.$store.state.support.issueFilter
            },
            
            searchString() {
                return this.$store.state.support.searchString
            },
            
            currentIssueIndex() {
                return this.$store.state.support.currentIssueIndex
            },
            
            issuesReassigned() {
                return this.$store.state.support.issuesReassigned
            },
            
            issueLoader() {
                return this.$store.state.support.issueLoader
            },
            
            supportSubscribeRoute() {
                k('supportSubscribeRoute: ', this.userInfo)
                return this.userInfo.purpleTeam ? '/support/admin' : '/support/user/' + (this.userInfo.userID || this.anonymousUserID)
            },
            
            authenticated() {
                return this.$store.state.user.authenticated
            }
        },

        created() {
            k('support created: ', this.anonymousUserID, this.userLoginToken, this.userInfo)
            
            if (this.anonymousUserID && this.userLoginToken) {
                // k('wait for issuesReassigned flag')
                this.$store.commit('supportIssues', [])
            } else {
                if (this.userInfo || this.anonymousUserID) this.initSupport()
            }
        },
        
        beforeDestroy() {
            nesClient.unsubscribe(this.supportSubscribeRoute, this.processRT, this.errorRT)  
            this.subscribed2issues = false
        },
        
        watch: {
            
            issuesReassigned() {
                // k('issuesReassigned!')
                
                if (this.issuesReassigned) {
                    this.initSupport()
                    this.$store.commit('issuesReassigned', false)
                }
            },
            
            currentIssueID() {
                if (!this.currentIssueID) {
                    this.$store.commit('supportIssues', [])
                    this.$store.commit('pageOffset', 1)
                    this.showIssues()    
                }
                
                this.addOrRemoveSubscribeToMessages()
            },
            
            pageOffset(val) {
                this.$store.commit('issueLoader', true)
                this.showIssues()
                this.$store.commit('currentIssueIndex', -1)
            },
            
            batchSize(val) {
                this.$store.commit('pageOffset', 1)
                this.showIssues()
            },
            
            issueFilter(val) {
                this.showIssues()
            },
            
            userInfo() {
                this.initSupport()
            },
            
            searchString() {
                if (this.searchString) this.$store.commit('issueLoader', true)
                this.$store.commit('pageOffset', 1)
                this.$store.commit('supportIssues', [])
                this.showIssues()
            },
            
            currentIssueIndex() {
                k('currentIssueIndex: ', this.currentIssueIndex)
            }
        },
        
        methods: {
            nextIssue(){
                
                if(this.currentIssueIndex >= this.supportIssues.length) return 
                
                this.$store.commit('currentIssueIndex', this.currentIssueIndex + 1)
            },
            
            previousIssue(){
                // console.log("chamou?")
                if(this.currentIssueIndex < 1) return 
                
                this.$store.commit('currentIssueIndex', this.currentIssueIndex - 1)
            },
            
            initSupport() {
                // k('initSupport! ', this.api.whichServer())
                
                var socketRoute = this.api.whichServer() ? 'wss://io-dev.platformpurple.com/' : 'wss://io.platformpurple.com/'
                // var socketRoute = 'wss://io-new.platformpurple.com/'
                k('socketRoute: ', socketRoute)
                
                nesClient = new Nes.Client(socketRoute)
                nesClient.connect((err) => {
                    if (err) console.error('nes connection err: ', err)
                })
                
                if (!this.subscribed2issues) {
                    k('subscribing! ', this.supportSubscribeRoute)
                    nesClient.subscribe(this.supportSubscribeRoute, this.processRT, this.errorRT)
                    this.subscribed2issues = true
                }
                
                this.addOrRemoveSubscribeToMessages()
                
                this.showIssues()
                this.getOnlineSupportTeam()
            },
            
            createNewIssue() {
                var newIssueID = this.j_.uaid('i')
                this.createNewIssueData(newIssueID)
                
                this.route('/support/' + newIssueID)
            },
            
            createNewIssueData(newIssueID) {
                // k('new issue!')
                
                this.newIssue = true
                
                var issue = {
                    "issueCreated": Date.now(),
                    "issueStatus": "open",
                    "issueTitle": "",
                    "issueID": newIssueID,
                    "userID": this.userInfo.userID || this.anonymousUserID,
                    "userEmail": this.userInfo.userEmail,
                    "issueAssignedTo": "support",
                    "messages": [],
                    "purpleNotes": [],
                    "environmentName": this.environmentName,
                    "shopName": this.environmentData.shopName
                }
                
                // k('before new issue push: ', j(this.supportIssues), this.currentIssueIndex)  
                
                this.supportIssues.unshift(issue)
                this.$store.commit('supportIssues', this.supportIssues)
                this.$store.commit('currentIssueIndex', 0)
                
                // k('currentIssue: ', this.supportIssues[this.currentIssueIndex])  
            },

            showIssues() {
                // k('showIssues')
                // k('userLoginToken: ', this.userLoginToken)
                // k('anonymousUserID: ', this.anonymousUserID)
                // k('userInfo: ', this.userInfo)
                
                if (this.userLoginToken) {
                    //logged in
                    
                    if (this.userInfo) {
                        if (this.userInfo.purpleTeam) {
                            if (this.searchString) {
                                this.searchAPIforIssues()
                            } else {
                                this.showIssueBatchForAdmin()
                            }
                        } else {
                            this.showIssuesForUser(this.userInfo.userID)
                        }
                    }
                } else if (this.anonymousUserID) {
                    this.showIssuesForUser(this.anonymousUserID)
                }
            },
            
            showIssuesForUser(userID) {
                // k('showIssuesForUser: ', userID)
                this.$q.loading.show()
                
                this.getAllIssuesForUser(userID, (res) => {
                    // k('showIssuesForUser: ', res)
                    
                    var environmentIssues = res.body.filter((issue) => {
                        return issue.environmentName === this.environmentName
                    })
                    
                    this.$store.commit('supportIssues', environmentIssues)
                    this.$q.loading.hide()
                })
            },
            
            getAllIssuesForUser(userID, cb) {
                k('getAllIssuesForUser: ', this.api.ioRoute, userID)
                
                this.api.get(`${ this.api.ioRoute }support/issues/${ userID }`, (res) => {
                    // k('getAllIssuesForUser: ', res)
                    cb(res)
                })  
            },
            
            showIssueBatchForAdmin() {
                this.$q.loading.show()

                var filter = this.issueFilter === 'open' ? '' : this.issueFilter === 'purple HQ' ? 'purpleHQ' : this.issueFilter
                // k('filter: ', filter )
                
                var req = {
                	"filters": {
                		"issueStatus": "open",
                // 		"issueAssignedTo": "purpleHQ"
                	}	
                }
                
                if (filter) req.filters.issueAssignedTo = filter
                
                var route = this.api.ioRoute + 'support/issueList' + '/' + this.displayStart + '/' + this.batchSize
                k('showIssueBatchForAdmin: ', route, j(req))
                
                this.api.post(route, req, (res) => {
                    kw('issueBatch: ', res)
                    
                    k('existing support Issues: ', this.supportIssues)
                    
                    if (!this.supportIssues) this.$store.commit('supportIssues', [])
                    
                    k('going backwards? ', this.displayStart < this.supportIssues.length, this.displayStart, this.supportIssues.length)
                    if ((this.displayStart < this.supportIssues.length) && !this.currentIssueID) {
                        //if paging backwards, slice supportIssues to add new page in correct order in array
                        this.$store.commit('supportIssues', this.supportIssues.slice(0, this.displayStart).concat(res.issueList))
                    } else {
                        this.$store.commit('supportIssues', this.supportIssues.concat(res.issueList))
                    }
                    
                    this.$store.commit('totalNumberOfOpenIssuesInDB', res.hits)
                    this.$store.commit('issueLoader', false)
                    
                    this.$q.loading.hide()
                })
            },
            
            searchAPIforIssues() {
                // k('searchAPIforIssues: ', this.searchString)
                
                // var route = purpleLib.esRoute() + 'support/search/' + (m.userInfo.purpleTeam ? 'admin' : 'user/' + m.userInfo.userID) + '/' + searchText
                var route = 'support/searchIssues/' + this.searchString + '/' + this.displayStart + '/' + this.batchSize
                this.api.get(this.api.ioRoute + route, (res) => {
                    ki('searchAPIforIssues res: ', res)
                    
                    if (res.error) {
                        throw res.error
                    }
                    
                    if (!this.supportIssues) this.$store.commit('supportIssues', [])
                    this.$store.commit('supportIssues', this.supportIssues.concat(res.issueList))
                    this.$store.commit('totalNumberOfOpenIssuesInDB', res.hits)
                    this.$store.commit('issueLoader', false)
                })
            },
            
            addOrRemoveSubscribeToMessages() {
                if (this.currentIssueID) {
                    // k('subscribe to messages! ', this.currentIssueID)
                    this.subscribedIssueID = this.currentIssueID
                    nesClient.subscribe('/support/' + this.currentIssueID + '/message', this.processRTMessage, this.errorRT)
                } else {
                    // k('unsubscribe to messages! ', this.subscribedIssueID)
                    nesClient.unsubscribe('/support/' + this.subscribedIssueID + '/message', this.processRTMessage, this.errorRT)
                    this.subscribedIssueID = ''
                }  
            },
                        
            errorRT(err) {
                if (err) console.error('nesError: ', err)
            },
            
            processRTMessage(item) {
                k('processRTMessage: ', item, this.currentIssueIndex)
                
                if ((!item.messageType || item.messageType === 'newMessage') && this.supportIssues[this.currentIssueIndex].messages) {
                    this.supportIssues[this.currentIssueIndex].messages.push(item)
                }

                if (item.messageType === 'newPurpleNote' && this.supportIssues[this.currentIssueIndex].purpleNotes) {
                    this.supportIssues[this.currentIssueIndex].purpleNotes.push(item)
                }  
            },
            
            processRT(item) {
                // new message items come through without issueID
                k('processRT: ', j(item))
                
                var theIndex = this.j_.indexFromArray(this.supportIssues, 'issueID', item.issueID)
                k('process index: ', theIndex)
                
                var filter 
                if (this.issueFilter) filter = this.issueFilter === 'open' ? '' : this.issueFilter === 'purple HQ' ? 'purpleHQ' : this.issueFilter
                k('processRT filter: ', filter, item.issueAssignedTo)
                
                if (theIndex === -1 && item.issueStatus !== 'closed') {
                    // add new issue if purple Team and no filter or matched filter
                    if (this.userInfo.purpleTeam && (!filter || (filter && (filter === item.issueAssignedTo)))) {
                        this.getSingleIssueData(item.issueID, (issue) => {
                            // k('check api for issue: ', issue)
                            
                            if (issue) {
                                this.supportIssues.unshift(this.j_.mergeObjects(item, issue))
                                
                                if (this.currentIssueID) {
                                    var currentIssueIndex = this.j_.indexFromArray(this.supportIssues, 'issueID', this.currentIssueID)
                                    this.$store.commit('currentIssueIndex', currentIssueIndex)
                                }
                                this.$store.commit('supportIssues', this.supportIssues)
                            }
                        })
                    }
                }
                
                if (theIndex >= 0) {
                    // k('merging!')
                    
                    this.$store.commit('updateSupportIssue', {
                        index: theIndex, 
                        issue: this.j_.mergeObjects(item, this.supportIssues[theIndex])
                    })
                    
                    if (!filter || (filter && (filter === item.issueAssignedTo))) {
                        // k('no filter or matched filter')
                        this.supportIssues.unshift(this.supportIssues[theIndex]) // put the new on top
                        this.supportIssues.splice(theIndex + 1, 1) // delete the old
                        this.$store.commit('supportIssues', this.supportIssues)
                    } else {
                        // k('does not match filter')
                        // splices issue with new assignedTo from list <-- makes singleIssue disappear
                        // no need to splice since going back to the list will repull issues from DB
                        if (!this.currentIssueID) {
                            // k('and not looking at single issue')
                            this.supportIssues.splice(theIndex, 1) // delete the old
                            this.$store.commit('supportIssues', this.supportIssues)
                        } else {
                            // k('but looking at single issue')
                        }
                    }
                    
                    // k('currentIssueID: ', this.supportIssues, this.currentIssueID)
                    
                    if (this.currentIssueID) {
                        // k('has currentIssueID')
                        // update index for viewing single issue after pushing new info into list
                        var currentIssueIndex = this.j_.indexFromArray(this.supportIssues, 'issueID', this.currentIssueID)
                        this.$store.commit('currentIssueIndex', currentIssueIndex)
                        // k('currentIssueIndex has changed to: ', currentIssueIndex)
                    } else {
                        // if issue is closed and going to be added to list for purpleTeam, re grab open issues
                        if (item.issueStatus === 'closed' && this.userInfo.purpleTeam) {
                            // reset the list to only have open issues, but ES does not update fast enough
                            // setTimeout(() => {
                            //     this.$store.commit('supportIssues', [])
                            //     this.showIssues()
                            // }, 1000)
                            
                            // splices closed issue from list, but list does not equal batch size
                            this.supportIssues.splice(theIndex, 1) // delete the old
                            this.$store.commit('supportIssues', this.supportIssues)
                        }        
                    }
                    
                }
                
            },
            
            setAdminStatus() {
                if (this.supportAdminOnline) {
                    this.removeAdminFromOnlineBucket()
                } else {
                    this.addAdminToOnlineBucket()
                }
            },
            
            getOnlineSupportTeam(cb) {
    
                this.api.get(this.api.ioRoute + 'support/onlineDS9SupportTeam', (res) => {
                    ki('getOnlineSupportTeam: ', res)
                    
                    this.$store.commit('onlineSupportTeam', res)
                    
                    nesClient.subscribe('/onlineDS9SupportTeam', (team) => {
                        // ki('adminListener: ', item)
                        this.$store.commit('onlineSupportTeam', team)
                    }, (err) => {
                        if (err) console.error('onlineSupportTeam nesError: ', err)
                    })
                    
                })
            },
            
             addAdminToOnlineBucket() {
                if(this.loading) return 
                
                this.loading = true
                
                var index = this.j_.indexFromArray(this.onlineSupportTeam, 'userID', this.userInfo.userID)
                // k('admin already added? ', index)
                if (index !== -1) return false
                
                var user = {
                    firstName: this.userInfo.firstName,
                    userEmail: this.userInfo.userEmail,
                    userID: this.userInfo.userID
                }
                // ki('addAdminToOnlineBucket req: ', user)
                
                 this.api.post(this.api.ioRoute + 'support/onlineDS9SupportTeam', user, (res) => {
                    ki(res)
                    this.loading = false
                    
                })
            },
            
             removeAdminFromOnlineBucket() {
                if(this.loading) return 
                
                this.loading = true
                
                // ki('removeAdminFromOnlineBucket: ', this.userInfo.userID)
                
                this.api.delete(this.api.ioRoute + 'support/onlineDS9SupportTeam/' + this.userInfo.userID, (res) => {
                    ki(res)
                    
                    this.loading = false
                })
            },
            
            getSingleIssueData(issueID, cb) {
                this.api.get(this.api.ioRoute + 'support/' + issueID, (res) => {
                    // k('getSingleIssueData: ', res)
                    
                    if (res.success) {
                        cb(res.body)
                    } else {
                        cb(false)
                    }
                })
            }
        }
    }
</script>

<style>
    .memberStatus {
        position: absolute;
        top: 3rem;
        left: -.5rem;
    }
</style>
