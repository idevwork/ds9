<template>
    <div>
        <template v-for="(banner, index) in banners">
            <template v-if="!hideOnRoute(banner)">
            
                <div v-if="banner.type === 'challenge' && (visibility(banner) || optedInToChallenge(banner.contestName))" :style="banner.bannerStyle" :key="index" @click="clicked(banner)">
                    <h6 :style="banner.textStyle">
                        <span v-html="bannerText(banner)"></span>
                    </h6>
                </div>
    
                <div v-else-if="visibility(banner)" :key="index" :style="banner.bannerStyle" @click="clicked(banner)">
                    <h6 v-if="banner.text" :style="banner.textStyle">
                        <span v-html="banner.text"></span>
                    </h6>
                </div>
    
            </template>
        </template>
    </div>
</template>

<script>
import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

export default {
    props: [ 'contestOptIn', 'userIsSubscribed' ],
    
    mixins: [ userAndProductInfo ],

    computed: {
        homePageSections() {
            return this.$store.state.environment.json.homePageSections
        },

        banners() {
            return this.homePageSections && this.homePageSections.find(section => section.id === 'nav') && this.homePageSections.find(section => section.id === 'nav').banners
        }
    },

    methods: {
        visibility(banner) {
            const now = this.moment().utc().valueOf()            
            const startDate = this.moment(banner.startMSeconds).utc().valueOf()
            const endDate = this.moment(banner.endMSeconds).utc().valueOf()

            return banner.visibility || ( banner.startMSeconds && banner.endMSeconds && (now >= startDate && now <= endDate))
        },

        clicked(banner) {
            const type = banner.url ? 'url' : 'route'
            const url = banner.url || banner.route
            
            if (url) {
                this.$emit('navigate', { type, url })
            }
        },
        
        optedInToChallenge(contestName) {
            var optedIn = (this.getDataForUserPref('contestName', contestName))
            return optedIn
        },
        
        bannerText(banner) {
            var bannerText = ''
            if (banner.type === 'challenge') {
                var optedInToChallenge = this.optedInToChallenge(banner.contestName)
                bannerText += optedInToChallenge ? banner.optedInText : banner.notOptedInText
            } else {
                bannerText += banner.text
            }
            
            if (banner.conditionalText) {
                bannerText += this[banner.conditionalVariable] ? banner.conditionalText : ''
            }
            
            return bannerText
        },
        
        hideOnRoute(banner) {
            const hideOnRoute = banner.hideOnRoutes && banner.hideOnRoutes.includes(this.$store.state.currentView)
            
            if (hideOnRoute) {
                const routeIndex = banner.hideOnRoutes.indexOf(this.$store.state.currentView)
                return banner.hideOnRoutes[routeIndex] === this.$store.state.currentView
            } else {
                return false
            }
        }
    }
}
</script>

<style>

</style>
