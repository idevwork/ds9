<template>

    <div class="well">
        <q-slide-transition>
            <div v-if="!showDevices" class="row justify-center">
                <q-btn @click="toggleShowDevices" color="grey-8" outline no-caps>Show supported devices</q-btn>
            </div>
        </q-slide-transition>

        <q-slide-transition>
            <div v-if="showDevices" align="center">

                <div class="row justify-center">
                    <div class="col-12 relative-position" align="center" style="padding: 1rem;">
                        <h6 style="font-size: .8rem; letter-spacing: 1px;">Select your device for viewing info</h6>
                        <q-btn @click="toggleShowDevices" icon="fa-times" size="sm" round flat style="position: absolute; top: 0; right: 2rem;" />
                    </div>

                    <q-btn v-for="item in devices" @click="(deviceInfo && deviceInfo == item) ? deviceInfo = '' : deviceInfo = item" no-caps flat link style="width: 5rem; text-align: center; padding: .5rem; margin: .5rem;" :key="item.header">
                        <div class="full-width">
                            <img :src="iconSrc(item)" style="height: 2rem; width: auto; margin: 0 auto;">
                        </div>
                        <h6 style="font-size: .7rem; letter-spacing: 1px;">{{item.header}}</h6>
                    </q-btn>
                </div>

                <q-slide-transition>
                    <div v-if="deviceInfo" class="full-width" style="padding: 1rem;">
                        <q-card color="white">
                            <q-card-main class="relative-position" align="center" style="color: black;">

                                <q-btn @click="deviceInfo = false" icon="fa-times" class="float-right" size="sm" round flat style="position: absolute; top: 1rem; right: 1rem;" />

                                <img :src="iconSrc(deviceInfo)" style="max-height: 5rem; padding: .5rem;" />
                                <h5>How to watch on {{deviceInfo.device}}:</h5>

                                <div v-html="deviceInfo.description" style="text-align: left; margin-left: 2rem;"></div>

                                <q-btn size="lg" v-if="deviceInfo.app" @click="openAppLink()" :style="'color: #fff; background: ' + (brandColor ? brandColor : 'rgb(86, 79, 138)') + ';'">
                                    Get the app!
                                </q-btn>

                            </q-card-main>
                        </q-card>
                    </div>
                </q-slide-transition>

            </div>
        </q-slide-transition>

    </div>

</template>

<script>

    export default {
        props: ['componentData'],

        computed: {
            environmentJson() {
                return this.$store.state.environment.json
            },

            environmentData() {
                return this.$store.state.environment.data
            },

            homePageSections() {
                return this.environmentJson.homePageSections
            },

            customDevices() {
                var section = this.homePageSections ? this.homePageSections.find((section) => { return section.id === 'deviceAccess' }) : ''
                return section && section.devices ? section.devices : ''
            },

            brandColor() {
                return this.environmentJson.e.brandColor ? this.environmentJson.e.brandColor : ''
            }
        },

        data() {
            return {
                showDevices: true,
                devices: '',
                defaultDevices: {
                    macOS: {
                        header: 'MacOS',
                        subheader: 'Stream or Download',
                        device: 'MacBook laptops and iMac desktops',
                        description: '<p>1. Stream instantly by selecting the product below.</p><p>2. Or, download the free player app for the ability to download and watch offline:</p>',
                        color: 'grey',
                        img: 'devices-macos.png',
                        app: true,
                        link: 'https://go.platformpurple.com/purpleplayer/macos'
                    },
                    windows: {
                        header: 'Windows',
                        subheader: 'Stream or Download',
                        device: 'Windows laptop and desktop computers',
                        description: '<p>1. Stream instantly by selecting the product below.</p><p>2. Or, download the free player app for the ability to download and watch offline:</p>',
                        color: '#2185d0',
                        img: 'devices-windows.png',
                        app: true,
                        link: 'https://go.platformpurple.com/purpleplayer/windows'
                    },
                    iOS: {
                        header: 'Apple iOS',
                        subheader: 'Stream or Download',
                        device: 'Apple iPad, iPhone, and iPod Touch',
                        description: '<p>1. Stream instantly by selecting the product below.</p><p>2. Follow steps on your device to "add to home screen" to add this as an app to your device homescreen for convenient one tap access!</p><p>3. Or, download the free player app for the ability to download and watch offline:</p>',
                        color: 'black',
                        img: 'devices-iOS.png',
                        app: true,
                        link: 'https://go.platformpurple.com/purplePlayiOS'
                    },
                    android: {
                        header: 'Android',
                        subheader: 'Stream or Download',
                        device: 'Android tablets and phones',
                        description: '<p>1. Stream instantly by selecting the product below.</p><p>2. Follow steps on your device to "add to home screen" to add this as an app to your device homescreen for convenient one tap access!</p><p>3. Or, download the free player app for the ability to download and watch offline:</p>',
                        color: '#b5cc18',
                        img: 'devices-android.png',
                        app: true,
                        link: 'https://go.platformpurple.com/purplePlayAndroid'
                    },
                    amazon: {
                        header: 'Amazon',
                        subheader: 'Stream or Download',
                        device: 'Amazon Fire Tablets',
                        description: '<p>* Does not support Amazon Fire stick.</p><p>1. Stream instantly by selecting the product below.</p><p>2. Follow steps on your device to "add to home screen" to add this as an app to your device homescreen for convenient one tap access!</p><p>3. Or, download the free player app for the ability to download and watch offline:</p>',
                        color: '#b5cc18',
                        img: 'amazon-logo.png',
                        app: true,
                        link: 'https://www.amazon.com/Platform-Purple-Player/dp/B06XS912WC/ref=sr_1_1?ie=UTF8&qid=1490643279&sr=8-1&keywords=Purple+Player'
                    },
                    smartTV: {
                        header: 'Smart TV',
                        subheader: 'Stream',
                        device: 'Smart TVs with modern browsers',
                        description: '<p>Open the browser on your SmartTV, and navigate to <a target="_blank" href="' + window.location.origin + '/library' + (window.location.search ? window.location.search: '') + '">' + window.location.origin + '/library' + (window.location.search ? window.location.search: '') + '</a></p>',
                        color: '#b5cc18',
                        img: 'devices-tv.png',
                        link: '/library'
                    },
                    playstation: {
                        header: 'Playstation',
                        subheader: 'Stream',
                        device: 'Playstation 3 & 4',
                        description: '<p>Open the browser on your Playstation console, and navigate to <a target="_blank" href="' + window.location.origin + '/library' + (window.location.search ? window.location.search: '') + '">' + window.location.origin + '/library' + (window.location.search ? window.location.search: '') + '</a></p>',
                        color: '#b5cc18',
                        img: 'devices-playstation.png',
                        link: '/library'
                    },
                    chromecast: {
                        header: 'Chromecast',
                        subheader: 'Stream',
                        device: 'Chromecast',
                        description: `
                            <p>Stream your videos from your Chrome browser to your Chromecast device:</p>
                            <ol>
                                <li>If you don’t already have the Chrome browser, <a href="https://www.google.com/chrome/browser/desktop/" target="_blank">click here</a> to download it for free.</li>
                                <li>Click the Chrome Tools menu in the top right corner of your Chrome browser window. Then click “Cast...”</li>
                                <li>Go to your library in Chrome, then click on any title.</li>
                                <li>Finally, go fullscreen on the player and enjoy the show on the big screen!</li>
                            </ol>
                        `,
                        color: '#b5cc18',
                        img: 'devices-chrome.png',
                        link: '/library'
                    },
                    appleTV: {
                        header: 'Apple TV',
                        subheader: 'Stream',
                        device: 'Apple TV',
                        description: '<p>Stream your videos on your Apple TV from your iPhone, iPad, iPod Touch, MacBook or iMac: <p>1. Connect to the same Wi-Fi network on your iOS device as your Apple TV</p><p>2. Swipe up from the bottom of your screen on your iOS device to open Control Center</p><p>3. In Control Center, tap AirPlay Mirroring, then select your Apple TV from the list. If an AirPlay passcode appears on your TV screen, enter the passcode on your iOS device.</p><p>4. Open the Purple Player or go to the streaming player in your browser and view your media.</p>',
                        color: '#b5cc18',
                        img: 'apple-tv.png',
                        link: ''
                    },
                    roku: {
                        header: 'Roku',
                        subheader: 'Stream',
                        device: 'Roku',
                        description: '<p>Click <a href="https://my.roku.com/add/PURPLEPLAY" target="_blank"><u>here</u></a> to add the channel to your account.</p><p><b>Here are the steps:</b></p><p>1. Add the channel to your device.</p><p>2. Press the Home button on your Roku remote</p><p>3. Scroll and select Settings &gt; System &gt; System update</p><p>4. Choose “Check Now”</p><p>5. When it completes, launch the Purple channel, sign in and stream away!</p><p>If you need additional help, please refer to this article:</p><a href="https://support.roku.com/article/208755668-how-to-update-the-software-on-your-roku-streaming-device" target="_blank">https://support.roku.com/article/208755668-how-to-update-the-software-on-your-roku-streaming-device</a>',
                        color: '#b5cc18',
                        img: 'roku_square_logo.png',
                        link: ''
                    }
                },

                deviceInfo: '',
                iconSrc(item) {
                    return 'https://f3r6v6t8.ssl.hwcdn.net/static/clients/common/' + item.img
                }
            }
        },

        methods: {
            toggleShowDevices() {
                this.showDevices = !this.showDevices
                k('showDevices =', this.showDevices)
            },

            openAppLink() {
                window.open(this.deviceInfo.link, '_blank')
            }
        },

        created() {

            var devicesData = this.defaultDevices
            if (this.environmentData.playerSku && this.environmentData.playerSku !== 'purpleplayer') {
                devicesData.windows.link = 'http://vault.platformpurple.com/static/installers/' + this.environmentData.playerSku + '_setup.zip'
                devicesData.macOS.link = 'http://vault.platformpurple.com/static/installers/' + this.environmentData.playerSku + '_installer.zip'
            }

            this.devices = this.defaultDevices

            if (this.customDevices) {
                k('this.customDevices: ', this.customDevices)

                Object.keys(this.customDevices).forEach((key) => {
                    var deviceObj = this.customDevices[key]
                    this.devices[key] = deviceObj
                })
            }
        }
    }
</script>

<style>

</style>