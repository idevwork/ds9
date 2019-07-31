<template>

    <div class="bg-grey-3">
        <div class="row well">
            <div class="col-12" style="padding: 1rem;">
                <h6 style="margin: 1rem; font-size: .9rem; letter-spacing: 1px;">Check out our FAQ below! If you have a different question, you can contact us:</h6>

                <div class="bg-white" style="padding: 1rem;">
                    <h6 v-if="userInfo.userEmail" style="color: #333; word-wrap: break-word; font-size: .9rem; letter-spacing: 1px;">From: {{userInfo.userEmail}}</h6>
                    <q-field
                        v-else
                        :error="emailFieldError"
                        error-label="Please enter an email."
                    >
                        <q-input color="grey" v-model="unauthenticatedEmail" class="inputBox" float-label="From (Email Address):" @input="emailFieldError = false" />
                    </q-field>

                    <div style="padding: 1rem 0;">
                        <q-field
                            :error="messageFieldError"
                            error-label="Please enter a question."
                        >
                            <q-input
                                v-model="message"
                                type="textarea"
                                color="grey"
                                float-label="Enter your question..."
                                :max-height="100"
                                rows="4"
                                @input="messageFieldError = false"
                            />
                        </q-field>
                    </div>

                    <q-btn outline @click="sendMessage()" :style="`background: #fff !important; color: #333;`">
                        <h6 style="font-size: .9rem; letter-spacing: 1px;">
                            Send
                        </h6>
                    </q-btn>
                </div>
            </div>

            <div class="col-12 q-px-md">
                <div v-for="(topic, key, index) in faqCast" :key="key">
                    <q-list class="bg-white">
                        <q-list-header v-if="Object.keys(faqData).length > 0" style="padding: 1rem;">
                            <span style="font-size: 1rem; letter-spacing: 1px;" class="q-title">{{key}}</span>
                        </q-list-header>
                        <q-collapsible v-for="question in topic" :key="question.question" class="monty" :group="key">
                            <template slot="header">
                                <q-item-side left>
                                    <q-btn flat round size="sm" :style="`background: ${pvolveMintBG};`">
                                        <q-icon name="fas fa-question" color="white" />
                                    </q-btn>
                                </q-item-side>
                                <q-item-main :label="question.question" style="font-size: 1rem;" />
                            </template>
                            <div style="padding: 1rem; color: #545454; font-size: .9rem; line-height: 1.25rem;">
                                <div v-if="question.mobile" :class="`${ windowWidth < 768 ? 'flex justify-center q-pb-md' : 'flex justify-end' }`">
                                    <q-btn outline @click="$root.$emit('openMobileAppModal', true)" size="md" label="Get the app!" :style="`background: #fff !important; color: #333;`" class="float-right" />
                                </div>
                                <span v-html="question.answer"></span>
                            </div>
                        </q-collapsible>
                    </q-list>
                </div>
            </div>

            <div class="col-12" style="padding: .5rem;">
                <helpFAQ v-if="faqData" :faqData="faqData" :buttonColor="pvolveMintBG" />
            </div>
        </div>
    </div>

</template>

<script>
    import { pvolveColors } from './pvolveColors'
    import { globalComputedData } from '../../../mixins/globalComputedData'
    import helpFAQ from '../../common/support/helpFAQ'

    export default {
        props: ['componentData'],

        components: {
            helpFAQ
        },

        data() {
            return {
                messageFieldError: false,
                emailFieldError: false,
                message: '',
                unauthenticatedEmail: ''
            }
        },

        mixins: [pvolveColors, globalComputedData],

        computed: {
            faqData() {
                return this.environmentJSON ? this.environmentJSON.faq : []
            },
            faqCast() {
                let faqObject = {
                    "how to access your workouts": [
                        {
                            "question": "What browsers can I stream from?",
                            "answer": `Whatever your heart desires. You can stream from all browsers at my.pvolve.com. Click on <strong><a href="https://my.pvolve.com/">Workouts</a></strong> and simply scroll down to access P.'s Structured Plans or browse the entire library under All Workouts.`
                        },
                        {
                            "question": "How do I watch on Chromecast?",
                            "answer":
                            `<ol>
                                <li>If you don’t already have the Chrome browser, <strong><a href="https://www.google.com/chrome/browser/desktop/">click here</a></strong> to download it for free.</li>
                                <li>Click the Chrome Tools menu in the top right corner of your Chrome browser window. Then click “Cast...”.</li>
                                <li>Go to your library in Chrome, then click on any title.</li>
                                <li>Finally, go fullscreen on the player and enjoy the show on the big screen.</li>
                            </ol>
                            `
                        }, {
                            "question": "How do I watch on my Apple TV?",
                            "answer":
                            `<ol>
                                <li>Connect to the same Wi-Fi network on your iOS device as your Apple TV.</li>
                                <li>Swipe up from the bottom of your screen on your iOS device to open Control Center.</li>
                                <li>In Control Center, tap AirPlay Mirroring, then select your Apple TV from the list. If an AirPlay passcode appears on your TV screen, enter the passcode on your iOS device.</li>
                                <li>Open the P.volve App or go to the streaming player in your browser and view your media.</li>
                            </ol>
                            `
                        }, {

                            "question": "How do I watch on an iOS or Android device?",
                            "mobile": true,
                            "answer":
                            `
                                <h6>iOS</h6>
                                <ol>
                                    <li><strong>Download the iOS app by clicking GET THE APP!</strong></li>
                                    <li>Launch the App and sign in with your subscriber user account.</li>
                                    <li>Start streaming!</li>
                                </ol>
                                <br />
                                <h6>Android</h6>
                                <ol>
                                    <li><strong>Download the Android app by clicking GET THE APP!</strong></li>
                                    <li>Launch the App and sign in with your subscriber user account.</li>
                                    <li>Start streaming!</li>
                                </ol>
                            `
                        }
                    ]
                }

                return faqObject
            }
        },

        methods: {
            sendMessage() {
                if ((!this.userInfo.userEmail && !this.unauthenticatedEmail) || !this.message) {
                    if (!this.message) this.messageFieldError = true
                    return false
                }

                let route = this.api.apiv4Route + 'api/email/send2Support'
                let req = {
                    "environment": this.environmentName,
                    "message": this.message,
                    "from": this.userInfo.userEmail || this.unauthenticatedEmail,
                    "firstName": this.userInfo.firstName
                }
                k('sendMessage req: ', route, req)

                this.api.post(route, req, (res) => {
                    k('sendMessage res: ', res)

                    if (res.success) {
                        this.message = ''

                        this.$q.notify({
                            message: 'Email has been sent!',
                            type: 'positive',
                            icon: 'fas fa-check-circle',
                            position: 'bottom-left'
                        })
                    }
                })
            }
        },

        watch: {

        },

        created() {
            k('environmentJSON: ', this.environmentJSON)
        }
    }
</script>

<style>

</style>
