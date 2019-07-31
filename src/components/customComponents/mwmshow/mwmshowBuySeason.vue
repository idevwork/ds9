<template>

    <div class="row" style="padding: 2rem 0;">
        <div class="well">
            <div class="row" align="center">
                <div class="col-6" style="padding: .5rem;">
                    <q-btn size="lg" @click="openPressKit()" class="full-width" color="black">PRESS KIT</q-btn>
                </div>
                <div class="col-6" style="padding: .5rem;">
                    <q-btn size="lg" @click="openPrivacyPolicy()" flat color="black">Privacy Policy</q-btn>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        methods: {
            buySeason() {
                this.route('/shop/' + 138662)
            },
            openPressKit() {
                window.open('https://f3r6v6t8.ssl.hwcdn.net/static/clients/mwmshow/Press%20Kit%20-%20MAKING%20IT%20WITH%20MORAES.pdf')
            },
            openPrivacyPolicy() {
                window.open('https://f3r6v6t8.ssl.hwcdn.net/static/clients/mwmshow/Privacy%20Policy%20-%20Making%20with%20Moraes.pdf')
            }
        }
    }
</script>