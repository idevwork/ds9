<template>

    <div class="row" style="margin: 0; padding: 2rem 0;">
        <div class="col-12">
            
            <q-card>
                
                <q-card-title>
                    <h3 align="center">
                        <q-icon name="fa-globe" />
                        Site Licenses
                    </h3>
                </q-card-title>
                
                <q-card-title>
                    <h6 v-if="licenses && !licenses.length" class="ui center aligned header">Sorry, no licenses currently. Select 'New Code' to create one.</h6>
                </q-card-title>
                
                <q-card-main>
                    <table v-if="licenses && licenses.length > 0" id="couponCodeTable" class="full-width q-table striped-odd p-smalltext responsive">
                        <thead>
                            <tr>
                                <th v-for="key in Object.keys(licenses[0])">{{key}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            <tr v-for="license in licenses">
                                <td v-for="(value, key, index) in license">{{format(key, value)}}</td>
                            </tr>
                
                        </tbody>
                    </table>
                </q-card-main>
                
            </q-card>
            
        </div>
    </div>
    
</template>

<script>

    export default {

        data() {
            return {
                licenses: '',
                searchText: '',
                displayDate(date) {
                    return date ? moment(date).format('MM/DD/YYYY') : ''
                },
                format(key, value) {
                    if (key === 'endDateTime') value = this.moment(value).format('MM/DD/YYYY')
                    return value
                }
            }
        },
        
        computed: {
            environmentData() {
                return this.$store.state.environment.data
            }  
        },
        
        watch: {
            environmentData() {
                this.getSiteLicenseDataForOrgID()
            }
        },

        mounted() {
            if (this.environmentData) this.getSiteLicenseDataForOrgID()
        },
        
        methods: {
            getSiteLicenseDataForOrgID() {
                // var savedCodes = localStorage.getItem('couponCodesForPublisher')
                // if (savedCodes) self.set({
                //     'codes': JSON.parse(savedCodes),
                //     'displayCodes': JSON.parse(savedCodes)
                // })
                    
                var orgID = this.environmentData.organizationID
                
                var req = {
                    "SQLfilename": "registeredSiteLicenses4Org",
                    "theVars": {
                        "organizationID": orgID
                    }
                }
                
                k('getSiteLicenseDataForOrgID: ', j(req))
                
                this.api.post(this.api.apiv3Route + 'doSQL', req, (res) => {
                    k('siteLicensesForOrg: ', res)
                    if (res && res.body) {
                        this.licenses = res.body
                    } else {
                       k('no site licenses')
                    }
                })
                    
            }
        }
    }
</script>