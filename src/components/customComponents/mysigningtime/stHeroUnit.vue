<template>

    <div :id="componentData.id">
        <div
            v-if="environmentName === 'mysigningtime'"
            style="position: relative; background: url('https://vault.platformpurple.com/static/clients/signingtime/mst_hero_image.png'); background-size: cover; background-position: 50% 100%; background-repeat: no-repeat;"
        >
            <!--<img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/signingtime/rachel_header.jpg" style="width: 100%; margin-bottom: -5px; " />-->
            <div class="well row" style="padding-bottom: 0;">
                <div class="col-6   relative-position" align="center" style="padding: 2rem 1rem 0 1rem;">
                    <img
                        src="https://vault.platformpurple.com/static/clients/signingtime/rachel.png"
                        class="gt-xs"
                        style="max-height: 90%; width: auto; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);"
                    />
                </div>

                <div class="col-sm-6"  :style="windowWidth > 1440 ? 'padding: 8rem 2rem;' : windowWidth > 768 ? 'padding: 6rem 2rem;' : 'padding: 3rem 1rem;'">
                    <h1 class="text-white avenir-heavy" :align="windowWidth > 576 ? 'right' : 'center'" :style="`font-size: ${adaptiveFontSize(1.5)}rem; text-shadow: 1px 1px 1px #00000080;`">Spark Imagination & A Passion For Learning</h1>
                    <h6 class="text-white avenir-regular" :align="windowWidth > 576 ? 'right' : 'center'" :style="` margin-top: 1rem; font-size: ${adaptiveFontSize(1)}rem; text-shadow: 1px 1px 1px #00000080;`">Learn sign language, science, and reading with award-winning programs like Baby Signing Time, Rachel & the TreeSchoolers, Signing Time, the new Rachel & Me, and more!</h6>
                </div>

                <div class="col-12 relative-position text-center lt-sm">
                    <img
                        src="https://vault.platformpurple.com/static/clients/signingtime/rachel.png"
                        class=""
                        style="max-width: 80%; width: 50%; margin-bottom: -5px; margin-left: 50%; margin-right: 0; transform: translateX(-50%);"
                    />
                </div>
            </div>
        </div>

        <div v-else style="width: 100%; height: 300px; background: url('https://f3r6v6t8.ssl.hwcdn.net/static/clients/signingtime/my-signing-time-academy-hero-image.jpg'); background-size: cover; background-position: 50%; padding: 0 0 2rem;">
            <h2 align="center" style="padding: 1rem; color: white;">{{environmentData.shopName}}</h2>
            <img align="center" src="https://f3r6v6t8.ssl.hwcdn.net/static/shopLogos/signingtimeacademy.png" style="margin: 0 auto; display: block; max-width: 20rem;" />
        </div>
    </div>

</template>

<script>
    import { designTools } from '../../../mixins/designTools'

    export default {
        props: ['componentData'],

        mixins: [ designTools ],

        computed: {
            windowWidth() {
                return this.$store.state.windowWidth
            },

            environmentData() {
                return this.$store.state.environment.data
            },

            environmentName() {
                return this.$store.state.environment.name
            }
        },

        methods: {
            goToLibrary() {
                this.route('/library')
            }
        }
    }

</script>

<style scoped>
    .avenir-heavy {
        font-family: 'Avenir-Next-Heavy';
    }

    .avenir-regular {
        font-family: 'Avenir';
    }
</style>