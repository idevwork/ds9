<template>
    <div class="bg-grey-3">
        <div class="row well">
            <div class="col-12 q-px-md q-py-xl">
                <div v-for="(topic, key, index) in faqCast" :key="key">
                    <q-list class="bg-white">
                        <q-collapsible v-for="question in topic" :key="question.question" class="monty" :group="key">
                            <template slot="header">
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
        </div>
    </div>
</template>

<script>
import { pvolveColors } from './pvolveColors'
import { globalComputedData } from '../../../mixins/globalComputedData'

export default {
    name: 'howToCastComponent',

    mixins: [ pvolveColors, globalComputedData ],

    computed: {
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
    }

}
</script>

<style>

</style>
