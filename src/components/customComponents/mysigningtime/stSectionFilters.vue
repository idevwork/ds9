<template>

    <div id="stFilters" style="background: #f2e018; text-align: center;">

        <div v-if="windowWidth > 991" class="row well">
            <div v-for="filter in newFilters" class="col-sm-6 col-md" align="center" style="padding: .5rem;">
                <q-btn class="full-width round-corners" color="white" style="background: #fff; padding: .5rem; height: 100%;" @click="filterProducts(filter)">
                    <div class="full-width">
                        <img v-if="filter.filename" align="center" style="max-width: 4rem;" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/signingtime/' + filter.filename" />

                        <q-icon v-if="filter.icon" color="blue" :name="filter.icon" style="font-size: 2rem; padding: .5rem 0;" />
                    </div>
                    
                    <h6 style="color: black; margin-top: .5rem;">
                        {{filter.title}}
                    </h6>
                </q-btn>
            </div>
        </div>
        
        <div v-if="windowWidth <= 991" class="row well">
            <q-btn class="col-12 text-white round-corners" :style="`margin: 1rem 0; background: ${brandColor};`" @click="showMobileFilters = !showMobileFilters">
                <q-icon name="fa-filter" /> Filters
            </q-btn>
            
            <div v-if="showMobileFilters" v-for="filter in newFilters" class="col-12" align="center">
                <q-btn class="full-width round-corners" color="white" style="background: #fff; padding: .5rem; margin: .5rem;" @click="filterProducts(filter)">
                    <h5 style="margin: 0; color: black;">

                        <img v-if="filter.filename" align="center" style="max-width: 4rem;" :src="'https://f3r6v6t8.ssl.hwcdn.net/static/clients/signingtime/' + filter.filename" />

                        <q-icon v-if="filter.icon" color="blue" :name="filter.icon" style="font-size: 2rem;" />
                        
                        {{filter.title}}
                    </h5>
                </q-btn>
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                showMobileFilters: false,
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
            windowWidth() {
                return this.$store.state.windowWidth
            },
            
            brandColor() {
                return this.$root.$store.state.environment.json ? this.$root.$store.state.environment.json.e.brandColor : ''
            },
        },
        
        methods: {
            filterProducts(filter) {
                this.showMobileFilters = false
                this.route('/' + filter.dataFilter)
            }
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