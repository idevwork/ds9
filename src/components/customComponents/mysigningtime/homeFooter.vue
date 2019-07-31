<template>

    <div class="row" :style="footerStyle" id="footer">
        <div v-if="componentData.footerRoutes && componentData.footerRoutes.length" class="col-12" align="center" style="padding: 1rem;">
            <a v-for="(item, index) in componentData.footerRoutes" @click="goTo(item)" style="color: white; margin: 1rem 0; text-decoration: none; cursor: pointer;">
                {{item.title}} {{index + 1 !== componentData.footerRoutes.length ? '|' : ''}}
            </a>
        </div>

        <!--<div v-if="componentData.socialMediaLinks && componentData.socialMediaLinks.length" class="col-12" align="center" style="padding: 1rem;">-->
        <!--    <a v-for="link in componentData.socialMediaLinks" target="_blank" :href="link.link" style="color: white; margin: 1rem; text-decoration: none;">-->
        <!--        <q-icon :name="'fab fa-' + link.icon" style="font-size: 1.5rem;" />    -->
        <!--    </a>-->
        <!--</div>-->

        <div class="col-12" align="center" style="color: white; padding: 1rem;">
            <q-icon name="fas fa-copyright" style="vertical-align: baseline;" /> {{moment().format('YYYY')}} {{componentData.shopName ? ' ' + componentData.shopName : environmentData.shopName ? ' ' + environmentData.shopName : ''}}. All Rights Reserved. {{ componentData.footerText }}
        </div>
    </div>

</template>

<script>
    export default {
        props: ['componentData'],

        computed: {
            environmentData() {
                return this.$store.state.environment.data
            },

            homePageData() {
                return this.$store.state.environment.json
            },

            footerStyle() {
                return 'background: ' + (this.componentData.backgroundColor || this.homePageData.e.brandColor || '#564F8A') + '; margin: 0; border-radius: 0; padding: 1rem;'
            }
        },

        methods: {
            goTo(item) {
                if (item.route) {
                    this.route(item.route)
                    window.scrollTop()
                }
                if (item.link) window.open(item.link, '_target')
            }
        }
    }
</script>

<style>
</style>
