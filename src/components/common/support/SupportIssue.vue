<template>
    
    <!-- single issue detail -->
    <div id="currentIssue" v-if="currentIssueIndex > -1 && supportIssues[currentIssueIndex]" class="row well justify-around items-center">
        <div class="col-12 row">
            <!--<div class="col-6">-->
            <!--    <q-btn-->
            <!--        :disabled="currentIssueIndex < 1"-->
            <!--        label="Previous"-->
            <!--        icon="fa-arrow-left" -->
            <!--        @click="$emit('previous')"-->
            <!--    />-->
            <!--</div>-->
            
            <!--<div class="col-6 text-right">-->
            <!--    <q-btn-->
            <!--        :disabled="currentIssueIndex >= supportIssues.length"-->
            <!--        label="Next"-->
            <!--        icon="fa-arrow-right" -->
            <!--        @click="$emit('next')"-->
            <!--    />-->
            <!--</div>-->
            
            <div class="col-12">
                <h4 v-if="supportIssues[currentIssueIndex].messages && supportIssues[currentIssueIndex].messages.length" style="margin-top: 0;">{{truncate(titleFormat(supportIssues[currentIssueIndex].messages[0].message))}}</h4>
                <h4 v-else style="margin-top: 0;">New Ticket</h4>
            </div>
            
            <div class="col-md-6">
                
                <p class="text-grey-8" style="font-size: .8rem; margin: 0 .5rem 0 0;">
                    <strong>Ticket #:</strong>
                    {{supportIssues[currentIssueIndex].issueID}}
                </p>
                
                <p class="text-grey-8" style="font-size: .8rem; margin: 0 .5rem 0 0;">
                    <strong>Opened:</strong>
                    {{moment(supportIssues[currentIssueIndex].issueCreated).format('dddd, MMMM DD - h:mm:ss a')}}
                </p>
                
                <p class="text-grey-8" style="font-size: .8rem; margin: 0 .5rem 0 0;">
                    <strong>Status:</strong>
                    <q-icon name="fa-circle" :color="supportIssues[currentIssueIndex].issueStatus === 'open' ? 'green' : 'red'" /> {{supportIssues[currentIssueIndex].issueStatus}}
                </p>
                
                <p v-if="userInfo.purpleTeam && supportIssues[currentIssueIndex].userEmail" class="text-grey-8" style="font-size: .8rem; margin: 0 .5rem 0 0;">
                    <strong>User Email:</strong>
                    <a :href="'mailto:' + supportIssues[currentIssueIndex].userEmail + '?Subject=Just%20checking%20in.'">{{supportIssues[currentIssueIndex].userEmail}}</a>
                    <q-icon name="fa-edit" @click.native="removeUserEmail()" style="margin-left: .5rem; cursor: pointer;" />
                </p>                
                
            </div>
            
            <div class="col-md-6">
                
                <p v-if="userInfo.purpleTeam" class="text-grey-8" style="font-size: .8rem; margin: 0 .5rem 0 0;">
                    <strong>Environment:</strong>
                    {{supportIssues[currentIssueIndex].environmentName}}
                </p>

                <p v-if="userInfo.purpleTeam" class="text-grey-8" style="font-size: .8rem; margin: 0 .5rem 0 0;">
                    <strong>Environment URL:</strong>
                    <a :href="supportIssues[currentIssueIndex].environmentURL" target="_blank">{{supportIssues[currentIssueIndex].environmentURL}}</a>
                </p>

                <p v-if="userInfo.purpleTeam" class="text-grey-8" style="font-size: .8rem; margin: 0 .5rem 0 0;">
                    <strong>Library URL:</strong>
                    <a :href="supportIssues[currentIssueIndex].libraryURL" target="_blank">{{supportIssues[currentIssueIndex].libraryURL}}</a>
                </p>
                
                <q-btn v-if="!userInfo.purpleTeam" id="issueStatusBtn" class="float-right" @click="changeIssueStatus()" :color="supportIssues[currentIssueIndex].issueStatus === 'open' ? 'red-5' : 'green'">
                    <h6>{{supportIssues[currentIssueIndex].issueStatus === 'open' ? 'close' : 'open'}} issue</h6>
                </q-btn>
            </div>
            
            <div class="col-12">
                <p v-if="userInfo.purpleTeam && !supportIssues[currentIssueIndex].userEmail" class="text-grey-8" style="font-size: .8rem; margin: 0 .5rem 0 0;">
                    <strong>Add User Email:</strong>
                    <q-input 
                        v-model="newUserEmail" 
                        float-label="New user email" 
                        :after="afterNewUserEmail()"
                        color="grey"
                        style="margin: 0;"
                    />
                </p>
            </div>

        </div>

        <div v-if="userInfo.purpleTeam" class="col-8 row" style="margin-top: 1rem;">

            <q-btn id="purpleNotesBtn" class="col-4 full-width bg-grey-3" @click="showPurpleNotes = !showPurpleNotes">
                <h6>purple notes ({{supportIssues[currentIssueIndex].purpleNotes ? supportIssues[currentIssueIndex].purpleNotes.length : ''}})</h6>
            </q-btn>
        
            <q-btn class="col-4 full-width bg-grey-3" @click="apiEmailUser">
                <h6>ping user</h6>
            </q-btn>
        
            <q-btn id="issueStatusBtn" class="col-4 full-width" @click="changeIssueStatus()" :color="supportIssues[currentIssueIndex].issueStatus === 'open' ? 'red-5' : 'green'">
                <h6>{{supportIssues[currentIssueIndex].issueStatus === 'open' ? 'close' : 'open'}} issue</h6>
            </q-btn>

        </div>
        
        <div v-if="userInfo.purpleTeam" class="col-4" style="padding: 0 1rem;">
            <q-select 
                id="assignToSelect"
                radio
                float-label="assigned to"
                v-model="supportIssues[currentIssueIndex].issueAssignedTo"
                :options="assignedToOptions"
                @input="changeIssueAssignedTo"
            />
        </div>

        <!-- purple notes -->
        <div id="purpleNotes" v-if="showPurpleNotes" class="col-12" style="background: rgba(86, 79, 138, 0.25) !important; border-radius: .3rem; margin-bottom: 1rem; padding: 1rem;">
            <div v-for="message in supportIssues[currentIssueIndex].purpleNotes" :key="message.dateTime" class="message purpleNote">
                <h6>{{ message.firstName }}</h6>
                <span style="font-size: .8rem; margin-left: 1rem;">
                    <timeago :since="message.dateTime" :auto-update="60"></timeago>
                    - {{ moment(message.dateTime).format('dddd, MMMM DD - h:mm:ss a') }}
                </span>
                <div v-html="message.message" class="messageText"></div>
            </div>
            
            <q-field
                :error="noPurpleNoteError"
                error-label="Please enter some text to send note."
            >
                <q-input
                    id="newPurpleNote"
                    v-model="newPurpleNote"
                    type="textarea"
                    float-label="type your note here"
                    :min-rows="4"
                    class="message"
                    style="background: #fff;"
                    v-on:keydown.tab="saveMessage('newPurpleNote')"
                    @input="noPurpleNoteError = false"
                />
            </q-field>

            <div class="row justify-around" style="margin-bottom: 2rem;">
                <div class="col-12">
                    <q-btn id="savePurpleNoteBtn" @click="saveMessage('newPurpleNote')" class="full-width" icon="fa-envelope" color="blue-4">
                        <h6>save note</h6>
                    </q-btn>
                </div>
            </div>
        </div>
        
        <!-- messages -->
        <div id="issueMessages" class="col-12 row">
            
            <h5 class="col-12" style="font-size: 1.25rem; margin-top: 1rem;">Messages</h5>
            
            <div
                :class="[{'rounded': roundedDesign}, 'full-width', 'q-pa-md']"
                v-for="message in supportIssues[currentIssueIndex].messages" 
                :key="message.dateTime" 
            >
                <q-chat-message
                    :sent="message.purpleTeam"
                    :name="message.firstName"
                    :text="[...message.message]"
                    :stamp="`${moment(message.dateTime).format('MM-DD-YY')} - ${moment(message.dateTime).format('h:mm a')}`"
                    :avatar="`https://vault.platformpurple.com/static/teamAvatars/${message.purpleTeam ? message.userID + '.jpg' : 'genericavatar.jpg'}`"
                    size="10"
                />
                
                <div v-if="message.imageFilename" :class="{'float-right': message.purpleTeam, 'float-left': !message.purpleTeam}">
                    <h6 class="thickHeader">Attachment:</h6>

                    <a :href="imagePath + message.imageFilename" target="_blank">
                        <img 
                            v-if="['.jpeg', '.jpg', '.png'].some(e => message.imageFilename.includes(e))"
                            :src="imagePath + message.imageFilename" 
                            style="max-width: 100%; max-height: 150px;" 
                        >
                        
                        <div v-else align="center">
                            <q-icon name="far fa-file-pdf" style="font-size: 3rem; padding: .5rem 0;">
                                <q-tooltip>
                                    Click to see
                                </q-tooltip>
                            </q-icon>
                            <h6 class="thickHeader">PDF</h6>
                        </div>
                    </a>
                </div>
            </div>
            
            <div :class="'bg-grey-3 ' + (showFileArea ? 'col-8' : 'col-12')" style="margin: .5rem 0; padding: 1rem; border-radius: .3rem;">
                <q-field
                    id="newMessageTextField"
                    :error="noMessageError"
                    error-label="Please enter a message to send."
                >
                    <q-input
                        id="newMessageText"
                        v-model="newMessage"
                        type="textarea"
                        color="grey"
                        float-label="type your message here"
                        :min-rows="4"
                        class="fill-width"
                        v-on:keydown.tab="saveMessage('newMessage')"
                        @input="noMessageError = false"
                        @focus="typeState(1)"
                        @blur="typeState(0)"
                    />
                </q-field>
            </div>
            
            <div v-if="showFileArea" class="col-4" align="center" style="margin: .5rem 0; padding: 1rem; border: 2px solid #efefef;">
                <h6>FILE UPLOAD</h6>
                <Resumabledropzone @fileAdded="createResumableFileObj" @uploadComplete="uploadComplete" @imageRemoved="attachmentImage = ''" />
            </div>
    
            <div class="col-12" style="padding: .5rem 0;">
                    
                <q-btn id="postMessageBtn" size="lg" @click="saveMessage('newMessage')" color="blue-4" :style="this.brandColor ? 'background: ' + this.brandColor + ' !important;' : ''">
                    <h6>post message</h6>
                </q-btn>
                
                <q-btn size="lg" flat class="float-right" @click="showFileArea = !showFileArea">
                    <q-icon name="fa-file-image" />
                </q-btn>
                    
            </div>
           
        </div>
        
    </div>
</template>

<script>
    
    import Resumabledropzone from '../Resumabledropzone'
    import Autolinker from 'autolinker'
    import Nes from 'nes'

    export default {
        props: ['currentIssueID', 'newIssue'],
        
        data() {
            return {
                localNewIssue: false,
                showPurpleNotes: false,
                showFileArea: false,
                newPurpleNote: '',
                newMessage: '',
                attachmentImage: '',
                newUserEmail: '',
                
                saveMessageReq: '',
                noMessageError: false,
                noPurpleNoteError: false,
                
                imagePath: 'https://f3r6v6t8.ssl.hwcdn.net/static/supportAttachments/',
                
                assignedToOptions: [
                    { label: 'customer', value: 'customer' },
                    { label: 'support', value: 'support' },
                    { label: 'purpleHQ', value: 'purpleHQ' }
                ],
                
                truncate(string) {
                    var truncateLength = 50
                    return string.length > truncateLength ? string.substring(0, truncateLength) + '...' : string
                },
                
                titleFormat(string) {
                    return string.replace(/<br \/>/g, '')
                },
                
                afterNewUserEmail() {
                    var self = this
                    return [{
                        icon: 'fa-save',
                        content: true,
                        handler() {
                            self.saveNewUserEmail()
                        }
                    }]
                }
            }
        },

        components: {
            Resumabledropzone
        },

        computed: {
            roundedDesign() {
                return this.$store.state.environment.json.e.noRoundedDesign ? false : true
            },
            
            supportIssues() {
                return this.$store.state.support.supportIssues
            },
            
            currentIssueIndex() {
                return this.$store.state.support.currentIssueIndex
            },
            
            userInfo() {
                return this.$store.state.user.info
            },
            
            anonymousUserID() {
                return this.$store.state.user.anonymousUserID
            },
            
            environmentName() {
                return this.$store.state.environment.name
            },
            
            environmentData() {
                return this.$store.state.environment.data
            },
            
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            },
            
            userLoginToken() {
                return this.$store.state.user.userLoginToken
            },
            
            mediaDropped() {
                return this.$store.state.resumableDropZone.mediaDropped
            },
            
            fileInfo() {
                return this.$store.state.resumableDropZone.fileInfo
            },
            
            initialParameters() {
                return this.$store.state.initialParameters
            },
            
            onlineSupportTeam() {
                return this.$store.state.support.onlineSupportTeam
            },
        },

        created() {
            // window.addEventListener('keydown', this.handleKeydown);
            
            this.localNewIssue = this.newIssue
            this.viewIssue()
            
            // this.$store.commit('issueFilter', 'open')
            this.$store.commit('dropZoneTarget', this.api.bigRoute + 'upload/supportAttachments')
            this.$store.commit('dropZoneFileTypesAllowed', ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'])
            this.$store.commit('dropZoneFileExtensionsAllowed', ['jpg', 'jpeg', 'png', 'pdf'])
            this.$store.commit('dropZoneFileSizeLimit', 5000000)
        },

        watch: {
            showFileArea() {
                if (!this.showFileArea) this.attachmentImage = ''
            },
        },

        methods: {
            deleteMessage(message){
                k('deleteMessage', j(message))

                // this.api.delete(this.api.ioRoute + 'support/' + message.issueID, null, (res) => {
                //     k('updateIssue', res)
                // })
            },
            
            handleKeydown(e){
                if(e.code == 'ArrowLeft') this.$emit('previous')
                if(e.code == 'ArrowRight') this.$emit('next')
            },
            
            
            viewIssue() {
                // this.dburl = 'https://juno-es-dev.platformpurple.com/_sql/?sql=select * from supportdev where issueID = "' + this.supportIssues[this.currentIssueIndex].issueID + '"'

                var index = this.j_.indexFromArray(this.supportIssues, 'issueID', this.currentIssueID)
                // k('viewIssue currentIssueIndex: ', index, this.supportIssues, this.currentIssueID)
                
                if (index === -1) {
                    k('not found locally')
                
                    // check with api to see if this issue ID exists
                    // if so, get the entire issue
                    this.getSingleIssueData(this.currentIssueID, (issue) => {
                        // k('check api for issue: ', issue)
                        
                        if (issue) {
                            if (!this.supportIssues) {
                                this.$store.commit('supportIssues', [issue])
                            } else {
                                this.supportIssues.unshift(issue)
                                this.$store.commit('supportIssues', this.supportIssues)
                            }
                            
                            var currentIssueIndex = this.j_.indexFromArray(this.supportIssues, 'issueID', this.currentIssueID)
                            this.$store.commit('currentIssueIndex', currentIssueIndex)
                            
                            // k('getSingleIssueData currentIssue: ', this.supportIssues[this.currentIssueIndex])
                        } else {
                            // not an issue, kick them out
                        }
                    })
                }
                
                if (index >= 0) {
                    k('found locally')
                    
                    var issue = this.supportIssues[index]
    
                    if (!this.localNewIssue) {
                        this.getSingleIssueData(issue.issueID, (issue) => {
                        // k('extra info res: ', issue)
                        
                        this.$store.commit('updateSupportIssue', {
                            index: index, 
                            issue: issue
                        })
                            
                        this.$store.commit('currentIssueIndex', index)
                        })
                    } else {
                        this.$store.commit('currentIssueIndex', index)
                    }
                }
            },
            
            changeIssueStatus() {
                var status = 'open'
                var currentIssue = this.supportIssues[this.currentIssueIndex]
                if (currentIssue.issueStatus === 'open') status = 'closed'
                this.updateIssue({ 
                    'issueID': currentIssue.issueID, 
                    'userID': currentIssue.userID,
                    'issueStatus': status 
                })
            },

            changeIssueAssignedTo(newAssignment) {
                // k('changeIssueAssignedTo: ', newAssignment)
                
                var currentIssue = this.supportIssues[this.currentIssueIndex]
                var previouslyAssignedTo = currentIssue.issueAssignedTo === 'customer' ? 
                    currentIssue.previouslyAssignedTo || 'support' : 
                    currentIssue.issueAssignedTo || 'support'
                    
                this.updateIssue({ 
                    'issueID': currentIssue.issueID, 
                    'userID': currentIssue.userID,
                    'previouslyAssignedTo': previouslyAssignedTo,
                    'issueAssignedTo': newAssignment
                })
            },
            
            saveNewUserEmail() {
                this.updateIssue({ 
                    'issueID': this.supportIssues[this.currentIssueIndex].issueID,
                    'userEmail': this.newUserEmail 
                })
                
                this.newUserEmail = ''
            },
            
            removeUserEmail() {
                this.updateIssue({ 
                    'issueID': this.supportIssues[this.currentIssueIndex].issueID,
                    'userEmail': ''
                })
                
                this.newUserEmail = ''
            },

            apiEmailUser() {
                
                var currentIssue = this.supportIssues[this.currentIssueIndex]
                
                if (!currentIssue.userEmail) {
                    this.$q.notify({
                        message: 'No email for user. Ask user for email address.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                var issue = {
                    issueID: currentIssue.issueID,
                    userEmail: currentIssue.userEmail,
                    shopName: currentIssue.shopName,
                    environmentName: currentIssue.environmentName
                }

                ki(j(issue))

                this.api.post(this.api.apiv3Route + 'support/sendUserReminderEmail', issue, (res) => {
                    // k('ping customer reply: ', res)
                    
                    if (res.error) {
                        this.$q.notify({
                            message: res.body,
                            type: 'negative',
                            icon: 'fa-exclamation-circle',
                            position: 'bottom-left'
                        })
                    } else {
                        this.$q.notify({
                            message: res.body,
                            type: 'positive',
                            icon: 'fa-check-circle',
                            position: 'bottom-left'
                        })
                        
                        // self.set('newNote', 'customer notified: ' + m.calendar(Date.now()))
                        // self.sendPurpleNote(e)
                        this.newPurpleNote = 'customer notified ' + this.moment().format('dddd, MMMM DD, h:mm a')
                        this.saveMessage('newPurpleNote')
                    }
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
            },

            updateIssue(req) {
                k('updateIssue', j(req))

                this.api.put(this.api.ioRoute + 'support/' + req.issueID, req, (res) => {
                    k('updateIssue', res)
                })
            },
            
            createNewIssueReq(req) {
                var currentIssue = this.supportIssues[this.currentIssueIndex]
                k('currentIssue: ', currentIssue)
                k('createNewIssueReq: ', req)

                currentIssue.windowHREF = window.location.href
                currentIssue.environmentURL = window.location.origin + (this.initialParameters.e ? '?e=' + this.initialParameters.e : '')
                currentIssue.libraryURL = window.location.origin + '/library' + (this.initialParameters.e ? '?e=' + this.initialParameters.e : '')
                currentIssue.lastPostByPurpleTeam =  this.userInfo.purpleTeam ? true : false
                currentIssue.latestMessageDateTime = Date.now()
                currentIssue.firstMessage = req.message
                currentIssue.messages.push(req)
                
                // client side autoresponder, works!
                // if (!this.userInfo.purpleTeam && !this.onlineSupportTeam.length) {
                //     // add auto responder
                //     var autoMessage = {
                //         'dateTime': Date.now(),
                //         'userID': 218716,
                //         'userEmail': 'support@platformpurple.com',
                //         'firstName': 'Support Bot',
                //         'purpleTeam': true,
                //         'imageFilename': '',
                //         'message': 'Test auto responder.',
                //         'messageType': 'newMessage'
                //     }
                    
                //     currentIssue.messages.push(autoMessage)
                // }
                
                return currentIssue
            },
            
            sendMessageToDB(req, cb) {
                // send new message        
                var endPoint = this.api.ioRoute + 'support/newMessage/' + this.supportIssues[this.currentIssueIndex].issueID
                // var endPoint = 'https://io-dev.platformpurple.com/support/newMessage/' + this.supportIssues[this.currentIssueIndex].issueID
        
                if (req.messageType === 'newPurpleNote') endPoint += '/' + 'purpleNote'
        
                this.api.post(endPoint, req, (res) => {
                    // k('saveMessage res', res)
                    cb()
                })
            },
            
            sendIssueUpdateToDB() {
                var currentIssue = this.supportIssues[this.currentIssueIndex]
                // k('currentIssue: ', currentIssue)
                
                var issueUpdate = {
                    'issueID': currentIssue.issueID,
                    'userID': currentIssue.userID,
                    'lastPostByPurpleTeam': this.userInfo.purpleTeam ? true : false,
                    'latestMessageDateTime': Date.now()
                }
                
                if (!this.userInfo.purpleTeam && currentIssue.issueAssignedTo === 'customer') {
                    issueUpdate.issueAssignedTo = currentIssue.previouslyAssignedTo || 'support'
                }
                
                if (currentIssue.issueStatus === 'closed') issueUpdate.issueStatus = 'open'
                
                this.updateIssue(issueUpdate)  
            },
            
            sendNewIssueToDB(issue) {
                this.localNewIssue = false
                
                this.api.post(this.api.ioRoute + 'support/' + issue.issueID, issue, (res) => {
                    ki(res)
                    // _version
                    if (res.error) {
                        throw res.error
                    }
                })
            },
            
            typeState(val) {
                var currentIssue = this.supportIssues[this.currentIssueIndex]
                var req = { issueID: currentIssue.issueID, userID: currentIssue.userID }
                    req[this.userInfo.purpleTeam ? 'adminTypeStatus' : 'userTypeStatus'] = val
                
                k('typeState: ', req)
                // this.updateIssue(req)
            },
            
            saveMessage(whatIsIt) {
                // k(this.newMessage)
                // k('saveMessage: ', whatIsIt)
                
                if (whatIsIt === 'newPurpleNote' && !this.newPurpleNote) {
                    this.noPurpleNoteError = true

                    this.$q.notify({
                        message: 'Please enter some text to send.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }                
                
                if (whatIsIt === 'newMessage' && !this.newMessage) {
                    this.noMessageError = true
                    this.$q.notify({
                        message: 'Please enter a message to send.',
                        type: 'negative',
                        icon: 'fa-exclamation-circle',
                        position: 'bottom-left'
                    })
                    return false
                }
                
                var message = whatIsIt === 'newPurpleNote' ? this.newPurpleNote : this.newMessage
                    message = message.replace(/\n/g, '<br />')
                var linkedText = Autolinker.link( message )
                
                var req = {
                    'dateTime': Date.now(),
                    'userID': this.userInfo.userID || this.anonymousUserID,
                    'userEmail': this.userInfo.userEmail,
                    'firstName': this.userInfo.firstName || 'user',
                    'purpleTeam': this.userInfo.purpleTeam,
                    'imageFilename': '',
                    'message': linkedText,
                    'messageType': whatIsIt
                }
        
                // k(j(req))
                
                // k('imgData: ', this.attachmentImage)
                
                // if there is attachment image, wait for upload to finish before sending message
                if (this.attachmentImage) {
                    // upload image
                    this.$store.commit('dropZoneUploadNow', true)
                    
                    req.imageFilename = this.fileInfo[this.attachmentImage.uniqueIdentifier].purpleFileName
                    this.saveMessageReq = req
                } else {
                    if (this.localNewIssue) {
                        this.sendNewIssueToDB(this.createNewIssueReq(req))
                    } else {
                        this.sendMessageToDB(req, () => {
                            this.sendIssueUpdateToDB()
                        })
                    }
                }
                
                this.$store.commit('dropZonepdfSrc', '')
                
                this.newMessage = this.newPurpleNote = ''
            },
            
            createResumableFileObj(fileObj) {
                // k('createResumableFileObj: ', fileObj)
                
                this.attachmentImage = fileObj.file
                
                var fileType = fileObj.file.type.split('/').pop()
                var imageFilename = this.j_.uaid('f') + '.' + fileType
                
                var fileInfo = {}
                fileInfo[fileObj.file.uniqueIdentifier] = {
                    'purpleFileName': imageFilename,
                    'filePurpose': 'supportAttachment'
                }
                // k('fileInfo: ', fileInfo)
    
                this.$store.commit('dropZoneFileInfo', fileInfo)
                this.uploadImage()
            },
            
            uploadImage() {
                var queryObj = {
                    userLoginToken: this.userLoginToken,
                    filesInBatch: JSON.stringify(this.fileInfo),
                    batchID: this.j_.uaid('b')
                }
    
                // k('queryObj: ', queryObj)
    
                this.$store.commit('dropZoneQuery', queryObj)
                // this.$store.commit('dropZoneUploadNow', true)
    
                // this.sendImageInfoToAPI()
            },
            
            uploadComplete() {
                this.$q.notify({
                    message: 'Support attachment has been uploaded!',
                    type: 'positive',
                    icon: 'fa-check-circle',
                    position: 'bottom-left'
                })
                this.showFileArea = false
                
                if (this.localNewIssue) {
                    this.sendNewIssueToDB(this.createNewIssueReq(this.saveMessageReq))
                    this.saveMessageReq = ''
                } else {
                    this.sendMessageToDB(this.saveMessageReq, () => {
                        this.sendIssueUpdateToDB()
                        this.saveMessageReq = ''
                    })
                }
            },
        },
        
        beforeDestroy() {
            
            window.addEventListener('keydown', this.handleKeydown);
            // if issue has no messages, it is new
            var index = this.j_.indexFromArray(this.supportIssues, 'issueID', this.currentIssueID)
            // k('beforedestory index: ', index)
            if (this.localNewIssue && this.supportIssues[index] && !this.supportIssues[index].messages.length) {
                // k('no messages')
                this.supportIssues.splice(index, 1)
                this.$store.commit('supportIssues', this.supportIssues)
            }
            
        }
    }
</script>

<style>
    .rounded .q-message-sent .q-message-text,
    .rounded .q-message-received .q-message-text{
        border-radius: 0.55rem;
    }
    
    .rounded .q-message-received .q-message-avatar{
        filter: grayscale(100);
        
    }
    
    .rounded .q-message-sent .q-message-text{
        border-top-right-radius: 0;
        background-color: #c5ecfb;
    }
    .rounded .q-message-received .q-message-text{
        border-top-left-radius: 0;
        background-color: #f3f3f3;
    }
    
    .q-message-text:last-child:before{
        display: none;
    }
</style>

<style scoped>
    .issueHeader {
        margin-top: 2rem;
        background: #efefef;
        padding: 0 1rem;
    }
    .issue {
        margin: 1rem;
        padding: 1rem;
    }
    .firstMessage {
        font-size: .9rem;
        color: #444;
    }
    .latestMessageDateTime {
        font-size: .8rem;
        color: #00aa88;
    }
    .message {
        border: 2px #efefef solid;
        padding: 1rem;
        margin: 0;
    }
    .pchip {
        font-size: .9rem;
        color: #fff;
        padding: .4rem;
        border-radius: .2rem;
    }
    .messageText {
        margin-top: 1.5rem;
        font-size: .9rem;
        color: #444;
    }
</style>