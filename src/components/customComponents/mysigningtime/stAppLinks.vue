<template>
    <div v-if="userActiveProducts && userActiveProducts.length" style="background: #444;">
    
        <div class="row well" align="center" style="padding: 2rem;">

            <div class="col-sm-12 col-md-6 padded text-white">
                <h4>Get the free My Signing Time app!</h4>
                Use the MySigningTime app to download your videos, songs, and eBooks to your phone or tablet so your child can watch them anywhere anytime, even if you're offline!
            </div>
            
            <div class="col-sm-12 col-md-6 padded">

                <div class="row">
                    <div class="col-sm-12 col-md-4" style="padding: .5rem;">
                        <q-btn class="full-width round-corners" color="pink-5" @click="goToAppleLink()">
                            <q-icon name="fab fa-apple" /> iOS
                        </q-btn>
                    </div>
                    <div class="col-sm-12 col-md-4" style="padding: .5rem;">
                        <q-btn class="full-width round-corners" color="green-6" @click="goToAndroidLink()">
                            <q-icon name="fab fa-android" /> Android
                        </q-btn>
                    </div>
                    <div class="col-sm-12 col-md-4" style="padding: .5rem;">
                        <q-btn class="full-width round-corners" color="blue-9" @click="showKindleSteps = !showKindleSteps">
                            <q-icon name="fab fa-amazon" /> Amazon Fire
                        </q-btn>
                    </div>
                </div>

                <div v-if="showKindleSteps" class="row" align="center">
                    <div class="col-12" align="center">
                        <h4 class="text-white">Steps for downloading to amazon fire/kindle:</h4>
                        <p class="text-white"><strong>Tap on the download link</strong> from your device and then tap to confirm that you would like to download the .apk file:</p>
                        
                        <q-btn @click="downloadAndroidAPK()" class="bg-grey-3 text-grey-9" style="margin: 1rem;">
                            <q-icon name="fas fa-download" />
                            Download APK
                        </q-btn>
                        
                        <p class="text-white">Once the download is finished, <strong>tap the alert</strong> that will prompt you to open the download or <strong>navigate to your Downloads folder</strong> through your device file manager and tap on the .apk file to install the app.</p>
                        <p class="text-white">Once installed, open by <strong>tapping the alert or the My Signing Time app logo</strong> to launch the app!</p>
                    </div>
                </div>

            </div>
        
        </div>
    </div>

</template>

<script>
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        
        mixins: [globalComputedData],
        
        data() {
            return {
                closedAppSection: false,
                showKindleSteps: false,
                filters: [{
                    dataFilter: '#baby',
                    filename: 'baby-signing-time.png',
                    title: 'Ages 0+'
                }, {
                    dataFilter: '#potty',
                    filename: 'pottytime-logo-web1.png',
                    title: 'Ages 1+'
                }, {
                    dataFilter: '#series1',
                    filename: 'Signing-Time.png',
                    title: 'Ages 2+'
                }, {
                    dataFilter: '#treeSchoolers',
                    filename: 'treeschoolers_logo.png',
                    title: 'Ages 3+'
                }, {
                    dataFilter: '#music',
                    icon: 'big blue music',
                    title: 'Music'
                }, {
                    dataFilter: '#ebooks',
                    icon: 'big blue book',
                    title: 'eBooks'
                }, {
                    dataFilter: '#pdfs',
                    icon: 'big blue file pdf outline',
                    title: 'PDFs'
                }],
                newFilters: [{
                    dataFilter: '',
                    icon: 'fa-globe',
                    title: 'Show All'
                }, {
                    dataFilter: 'baby',
                    filename: 'baby-signing-time.png',
                    title: 'Ages 0+'
                }, {
                    dataFilter: 'potty',
                    filename: 'pottytime-logo-web1.png',
                    title: 'Ages 1+'
                }, {
                    dataFilter: 'signingtime',
                    filename: 'Signing-Time.png',
                    title: 'Ages 2+'
                }, {
                    dataFilter: 'treeschoolers',
                    filename: 'treeschoolers_logo.png',
                    title: 'Ages 3+'
                }, {
                    dataFilter: 'music',
                    icon: 'fa-music',
                    title: 'Music'
                }, {
                    dataFilter: 'books',
                    icon: 'fa-book',
                    title: 'eBooks'
                }, {
                    dataFilter: 'guides',
                    icon: 'fa-file-pdf',
                    title: 'Guides'
                }]
            }
        },
        
        computed: {

        },
        
        methods: {

            goToAppleLink(e) {
                window.open('https://itunes.apple.com/us/app/signing-time-tv/id1049183956?mt=8')
            },
            
            goToAndroidLink(e) {
                window.open('https://play.google.com/store/apps/details?id=com.twolittlehands.signingtimetv&hl=en')
            },
            
            downloadAndroidAPK(e) {
                window.open('https://go.platformpurple.com/app/customComponents/signingtime/mysigningtime-armv7-release-signed-aligned.apk')
            },
            
        }
    }
</script>

<style scoped>
    .padded {
        padding: 1rem;
    }
    
    .round-corners {
         border-radius: .25rem !important;
    }
</style>