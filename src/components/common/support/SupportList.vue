<template>
    <div style="background: #efefef; margin-top: 1rem; padding: 1rem;">
        
        <div v-if="userInfo.purpleTeam" class="issueHeader row justify-between">
            <div class="col">
                <q-search id="issueSearch" :debounce="1000" v-model="$store.state.support.searchString" class="bg-white" style="padding: .5rem; margin: 0;" :clearable="true" />
            </div>
            
            <div class="col-3" style="padding-left: 1rem;">
                <q-select
                    float-label="show"
                    v-model="localBatchSize"
                    :options="batchSizeOptions"
                    @input="$store.commit('batchSize', localBatchSize)"
                    style="margin: 0;"
                />
            </div>
        </div>

        <!-- filter buttons -->

        <div v-if="userInfo.purpleTeam && !searchString" class="row justify-center">
            <div v-for="tab in tabs" @click="filterIssues(tab.name)" :style="{ color: '#fff', background: tab.color }" class="col-3">
                <q-btn :id="tab.name + 'FilterBtn'" class="full-width">
                    <q-icon v-if="issueFilter === tab.name" name="fa-circle" />
                    {{ tab.name }}
                </q-btn>
            </div>
        </div>
        
        <div id="issuesList" style="min-height: 3rem;">
            <q-scroll-area style="height: 65vh;">
                <div v-if="userInfo.purpleTeam && !issueLoader" class="row" style="border: 1px solid rgba(0, 0, 0, 0.12); margin-top: 1rem;">
                    <div class="col-2">
                        <q-btn v-if="pageOffset > 1" flat class="full-width" @click="$store.commit('pageOffset', pageOffset - 1)">
                            <q-icon name="fa-chevron-left" />
                        </q-btn>
                    </div>
                    
                    <q-btn flat class="col-8 bg-white" disable align="center" >Page {{ pageOffset }} / {{ totalPages }}</q-btn>
                    
                    <div class="col-2">
                        <q-btn v-if="(pageOffset + 1) <= totalPages" flat class="full-width" @click="$store.commit('pageOffset', pageOffset + 1)">
                            <q-icon name="fa-chevron-right" />
                        </q-btn>
                    </div>
                </div>
                
                <div v-if="!supportIssues.length && !currentIssueID && searchString" style="padding: 1rem;">
                    <h5 align="center">No matching tickets.</h5>
                </div>
                            
                <div v-if="supportIssues && !supportIssues.length && !currentIssueID && !searchString & !issueLoader" style="padding: 1rem;">
                    <h5 align="center">No tickets yet. Create a new one by tapping the '+' button in the top right.</h5>
                </div>
                
                <table v-if="issues2display.length" class="q-table bordered highlight horizontal-separator striped-odd responsive bg-white" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>
                                Ticket
                            </th>
                            <th align="center">
                                Environment
                            </th>
                            <th v-if="userInfo.purpleTeam">
                                Detail
                            </th>
                            <th>
                                Last Message
                            </th>
                            <th align="right">
                                Status
                            </th>
                            <th align="center">
                                Open
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        <tr
                            v-for="(issue, index) in issues2display"
                            class="cursor-pointer issueRow"
                            :key="issue.issueID + issue.latestMessageDateTime"
                            :style="issueRowStyle(issue)"
                        >
    
                            <td @click="route('/support/' + issue.issueID)">
                                <h6 v-if="issue.firstMessage" v-html="truncate(issue.firstMessage)" class="firstMessage"></h6>
                            </td>
                            
                            <td align="center" @click="route('/support/' + issue.issueID)">
                                <img :src="'https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/' + issue.environmentName + '.png'" class="environmentLogo"></img>
                            </td>
                            
                            <td v-if="userInfo.purpleTeam" @click="route('/support/' + issue.issueID)" class="col-sm-12 col-md">
                                <p style="margin: 0; font-size: .8rem;">
                                    <strong>user:</strong> 
                                    {{ issue.userEmail || issue.userID}}
                                </p>                                
                                <p style="margin: 0; font-size: .8rem;">
                                    <strong>id:</strong> 
                                    {{ issue.issueID }}
                                </p>
                            </td>   
                            
                            <td @click="route('/support/' + issue.issueID)" style="font-size: .8rem;">
                                <timeago :since="issue.latestMessageDateTime" :auto-update="60"></timeago>
                                - {{ moment(issue.latestMessageDateTime).format('ddd, MMM DD - h:mm a') }}
                            </td>
                            
                            <td align="right" @click="route('/support/' + issue.issueID)">
                                <div :class="'pchip issueStatus' + (issue.issueStatus === 'open' ? ' bg-green' : ' bg-red')">
                                    {{ issue.issueStatus }}
                                </div>
                                <div v-if="userInfo.purpleTeam" class="pchip issueAssignedTo" style="background: #42A4F5;">
                                    {{ issue.issueAssignedTo }}
                                </div>
                            </td>
                            
                            <td v-if="!userInfo.purpleTeam" @click="route('/support/' + issue.issueID)" align="center">
                                <q-icon name="fa-chevron-right"  />
                            </td>
                            
                            <td v-if="userInfo.purpleTeam" @click="popOutIssue(issue)" align="center">
                                <q-btn  class="bg-white text-black" style="height: 100%;">
                                    <q-icon name="fa-external-link-alt" style="margin: 0;" />
                                </q-btn> 
                            </td>
            
                        </tr>
                    </tbody>
                
                </table>
                
                <div v-if="userInfo.purpleTeam && !issueLoader" class="row" style="border: 1px solid rgba(0, 0, 0, 0.12);">
                    <div class="col-2">
                        <q-btn v-if="pageOffset > 1" flat class="full-width" @click="$store.commit('pageOffset', pageOffset - 1)">
                            <q-icon name="fa-chevron-left" />
                        </q-btn>
                    </div>
                    
                    <q-btn flat class="col-8 bg-white" disable align="center" >Page {{ pageOffset }} / {{ totalPages }}</q-btn>
                    
                    <div class="col-2">
                        <q-btn v-if="(pageOffset + 1) <= totalPages" flat class="full-width" @click="$store.commit('pageOffset', pageOffset + 1)">
                            <q-icon name="fa-chevron-right" />
                        </q-btn>
                    </div>
                </div>
            </q-scroll-area>
            
        </div>
    </div>

</template>

<script>

    export default {
        data() {
            return {
                localBatchSize: '',
                
                tabs: [
                    { name: 'open', color: '#66bb6a' },
                    { name: 'support', color: '#42A4F5' },
                    { name: 'purple HQ', color: '#564F8A' },
                    { name: 'customer', color: 'orange' },
                ],
                
                batchSizeOptions: [
                    { label: '5', value: 5 },
                    { label: '10', value: 10 },
                    { label: '30', value: 30 },
                    { label: '50', value: 50 },
                    { label: '100', value: 100 }
                ],
                
                colorAge(time) {
                    var now = this.moment().format('x')
                    var differenceMS = now - time
                    var differenceMin = differenceMS / 1000 / 60
                    var differenceLevel = Math.round(differenceMin / 10)
                    if (differenceLevel > 5) differenceLevel = 5

                    var colorObj = {
                        0: "rgba(33, 186, 69, 0.5)", //rgba(33, 186, 69, 0.5)
                        1: "rgba(181, 204, 24, 0.5)", //rgba(181, 204, 24, 0.5)
                        2: "rgba(251, 189, 8, 0.5)", //rgba(251, 189, 8, 0.5)
                        3: "rgba(242, 113, 28, 0.5)", //rgba(242, 113, 28, 0.5)
                        4: "rgba(219, 40, 40, 0.5)", //rgba(219, 40, 40, 0.5)
                        5: "rgba(219, 40, 40, 0.5)" //rgba(219, 40, 40, 0.5)
                    }

                    var res = colorObj[differenceLevel]

                    // k('COLORAGE: ', now, time, differenceLevel, res)
                    return res
                },
                
                truncate(string) {
                    var truncateLength = 50
                    return string.length > truncateLength ? string.substring(0, truncateLength) + '...' : string
                },
                
                showNewMessageIcon(issue) {
                    return issue.issueStatus !== 'closed' && ((!issue.lastPostByPurpleTeam && this.userInfo.purpleTeam && issue.issueAssignedTo !== 'customer') || (!this.userInfo.purpleTeam && issue.lastPostByPurpleTeam))
                },
                
                showIssueColor(issue) {
                    var res = false
                    if (this.userInfo.purpleTeam && !issue.lastPostByPurpleTeam && issue.issueStatus !== 'closed' && issue.issueAssignedTo !== 'customer') res = this.colorAge(issue.latestMessageDateTime)
                    if (!this.userInfo.purpleTeam && issue.lastPostByPurpleTeam && issue.issueStatus !== 'closed') res = 'rgba(33, 186, 69, 0.5)'
                    return res
                },
                
                issueRowStyle(issue) {
                    return this.showIssueColor(issue) ? 'background: ' + this.showIssueColor(issue) + ';' : ''
                },
            }
        },

        computed: {
            userInfo() {
                return this.$store.state.user.info
            },
            
            issueStatus(issueStatus) {
                // k(issueStatus)
                return false
            },
            
            totalPages() {
                // k('totalPages! ', this.totalNumberOfOpenIssuesInDB, this.batchSize, this.totalNumberOfOpenIssuesInDB / this.batchSize, Math.ceil( this.totalNumberOfOpenIssuesInDB / this.batchSize ))
                return Math.ceil( this.totalNumberOfOpenIssuesInDB / this.batchSize ) || 1
            },
            
            currentIssueID() {
                return this.$store.state.support.currentIssueID
            },
                        
            supportIssues() {
                return this.$store.state.support.supportIssues
            },
            
            issueFilter() {
                return this.$store.state.support.issueFilter
            },
            
            filteredSupportIssues() {
                var filteredIssues = this.issueFilter && this.userInfo.purpleTeam ? this.supportIssues.filter((issue) => {
                    var filter = this.issueFilter === 'purple HQ' ? 'purpleHQ' : this.issueFilter
                    var key = filter === 'open' ? 'issueStatus' : 'issueAssignedTo'
                    return issue[key] === filter
                }) : this.supportIssues
                
                // k('filteredIssues: ', filteredIssues)
                // return this.searchString ? this.searchIssues(filteredIssues) : filteredIssues
                // return filteredIssues
                return this.supportIssues
            },
            
            issues2display() {
                k('issues2display: ', this.supportIssues, this.displayStart, this.displayEnd, this.supportIssues.slice( this.displayStart, this.displayEnd ))
                return this.supportIssues.slice( this.displayStart, this.displayEnd )
            },
            
            displayStart() {
                k('displayStart: ', this.pageOffset, this.batchSize, ( this.pageOffset - 1 ) * this.batchSize)
                return ( this.pageOffset - 1 ) * this.batchSize
            },
            
            displayEnd() {
                k('displayEnd: ', this.pageOffset, this.batchSize, ( this.pageOffset) * this.batchSize)
                return (this.pageOffset) * this.batchSize
            },
            
            pageOffset() {
                return this.$store.state.support.pageOffset
            },
            
            batchSize() {
                return this.$store.state.support.batchSize
            },
            
            totalNumberOfOpenIssuesInDB() {
                return this.$store.state.support.totalNumberOfOpenIssuesInDB
            },
            
            searchString() {
                return this.$store.state.support.searchString
            },
            
            issueLoader() {
                return this.$store.state.support.issueLoader
            }
        },

        created() {
            this.localBatchSize = this.batchSize
        },

        methods: {
            
            popOutIssue(issue) {
                window.open(window.location.origin + '/support/' + issue.issueID + window.location.search, "", "width=768,height=960,toolbar=0,menubar=0,location=100,status=1,scrollbars=1,resizable=1")
            },
            
            searchIssues(issues) {
                // ["issueTitle", "userEmail", "environmentName", "issueID"]
                return issues.filter((issue) => {
                    // k('issue: ', issue)
                    var match = (issue.issueTitle && issue.issueTitle.toLowerCase().includes(this.searchString.toLowerCase())) ||
                                (issue.firstMessage && issue.firstMessage.toLowerCase().includes(this.searchString.toLowerCase())) ||
                                (issue.userEmail && issue.userEmail.toLowerCase().includes(this.searchString.toLowerCase())) ||
                                (issue.environmentName && issue.environmentName.toLowerCase().includes(this.searchString.toLowerCase())) ||
                                (issue.issueID && issue.issueID.toLowerCase().includes(this.searchString.toLowerCase()))
                    return match
                })
            },
            
            filterIssues(filter) {
                // k('filterIssues: ', filter, this.issueFilter)
                
                if (filter === this.issueFilter) return false 
                
                this.$store.commit('issueLoader', true)
                
                this.$store.commit('pageOffset', 1)
                this.$store.commit('supportIssues', [])
                this.$store.commit('issueFilter', filter)
            }
        }
    }
</script>

<style scoped>
    
    .issueHeader {
        margin-bottom: 1rem;
        background: #efefef;
    }
    
    .issue {
        margin: 1rem;
        padding: 1rem;
    }
    
    .message {
        border-top: 1px #ccc solid;
        padding: 1rem;
        margin: 2rem;
    }
    
    .pchip {
        font-size: .8rem;
        color: #fff;
        padding: .5rem;
        margin: .25rem;
        border-radius: .2rem;
        float: right;
    }
    
    .messageText {
        margin-top: 1rem;
        font-size: .9rem;
        color: #444;
    }
    
    .environmentLogo {
        max-height: 1.9rem;
        max-width: 100%;
    }
</style>
