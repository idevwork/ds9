<template>
    <div id="topNav" :is="topNav" />
</template>

<script>
    import defaultTopNav from './defaultTopNav'

    export default {
        data() {
            return {
                topNav: ''
            }
        },

        computed: {
            homePageData() {
                return this.$store.state.environment.json
            },

            homePageSections() {
                return this.$store.state.environment.json.homePageSections
            }
        },

        components: {
            defaultTopNav
        },

        created() {
            if (this.homePageSections) {
                this.getCustomNavDataAndLoadIt()
            }
        },

        watch: {
            homePageSections() {
                this.getCustomNavDataAndLoadIt()
            }
        },

        methods: {
            getCustomNavDataAndLoadIt() {
                var navData = this.homePageSectionFromID('nav')
                k('nav: ', navData)

                // if (this.homePageData) {
                //     this.topNav = this.homePageSectionFromID('nav').componentPath ? this.homePageSectionFromID('nav').component : 'defaultTopNav'
                // }

                if (navData && navData.componentPath) {
                    this.loadIt(navData.component, 'customComponents/' + navData.componentPath.replace('.html', ''))
                    this.topNav = navData.component
                } else {
                    this.topNav = 'defaultTopNav'
                }
            }
        }

    }
</script>

<style>
    @media print {
        #topNav {
            display: none;
        }
    }
</style>
