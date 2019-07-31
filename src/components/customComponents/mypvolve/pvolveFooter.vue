<template>

    <div class="row full-width justify-center">

        <!--color bar-->
        <div class="row full-width" style="background: #333; height: 4rem;"></div>

        <!--mobile layout-->
        <div class="lt-lg row full-width" style="padding: 2rem;">
            <div class="col-12 cursor-pointer" align="center" @click="logoClick()">
                <img crossorigin="anonymous" class="pvolveFooterLogo" src="https://vault.platformpurple.com/static/clients/mypvolve/Pvolve_StackedLogo_NoTagline.png" style="width: 20%; height: auto;" />
            </div>

            <div class="col-6" style="padding: 1rem;">
                <h6 class="footerHeader">refer a friend & <span class="thickHeader">get $30!</span></h6>

                <h6 class="footerHeader">about</h6>

                <a href="https://pvolve.com/pages/meet-p" target="_blank">
                    <p>meet p.</p>
                </a>

                <a href="https://pvolve.com/pages/method" target="_blank">
                    <p>method</p>
                </a>

                <h6 class="footerHeader">community</h6>

                <a href="https://pvolve.com/blogs/bodies-by-p" target="_blank">
                    <p>blog</p>
                </a>

                <a href="https://pvolve.com/pages/ambassadors" target="_blank">
                    <p>ambassadors</p>
                </a>

                <h6 class="footerHeader">shop</h6>

                <a href="https://pvolve.com/collections/equipment" target="_blank">
                    <p>equipment</p>
                </a>

                <a href="https://pvolve.com/collections/apparel" target="_blank">
                    <p>apparel</p>
                </a>

                <a href="https://pvolve.com/collections/all" target="_blank">
                    <p>shop all</p>
                </a>
            </div>

            <div class="col-6" style="padding: 1rem;">
                <a href="https://pvolve.com/pages/studio-p-1" target="_blank">
                    <h6 style="margin: .5rem 0;">P.volve Studio</h6>
                </a>

                <a href="https://pvolve.com/pages/contact" target="_blank">
                    <h6 class="footerLink" style="margin: .5rem 0;">contact</h6>
                </a>

                <div @click="route('/help')" class="cursor-pointer">
                    <h6 class="footerLink" style="margin: .5rem 0;">help</h6>
                </div>
            </div>

            <div class="col-12" align="center" style="padding: 1rem;">
                <a href="mailto:help@pvolve.com'?bcc=josh@platformpurple.com&subject=I%20have%20a%20question%20about%20P.volve%20on%20demand..." target="_blank" style="color: #444;"><p>help@pvolve.com</p></a>

                <div class="row full-width" align="center" style="padding: 1rem 0;">
                    <a class="col" v-for="link in componentData.socialMediaLinks" target="_blank" :href="link.link">
                        <q-icon :name="'fab fa-' + link.icon" color="grey-9" style="font-size: 1.5rem;" />
                    </a>
                </div>
            </div>

        </div>

        <!--desktop layout-->
        <div class="gt-md row full-width" style="padding: 2rem;">
            <div class="col-3 cursor-pointer" align="center" @click="logoClick()">
                <img src="https://f3r6v6t8.ssl.hwcdn.net/static/clients/mypvolve/Pvolve_StackedLogo_NoTagline.png" style="max-width: 50%; max-height: 50%;" />
            </div>

            <div class="col-3" style="padding: 1rem;">
                <a @click="openReferAFriendAd">
                    <h6 class="footerHeader">
                        <!--refer a friend & -->
                        <span class="thickHeader">get $30!</span>
                    </h6>
                </a>
                <h6 class="footerHeader">community</h6>

                <a href="https://pvolve.com/blogs/bodies-by-p" target="_blank">
                    <p>blog</p>
                </a>

                <a href="https://pvolve.com/pages/ambassadors" target="_blank">
                    <p>ambassadors</p>
                </a>

                <br />

                <h6 class="footerHeader">about</h6>

                <a href="https://pvolve.com/pages/meet-p" target="_blank">
                    <p>meet p.</p>
                </a>

                <a href="https://pvolve.com/pages/method" target="_blank">
                    <p>method</p>
                </a>
            </div>

            <div class="col-3" style="padding: 1rem;">
                <h6 class="footerHeader">shop</h6>

                <a href="https://pvolve.com/collections/equipment" target="_blank">
                    <p>equipment</p>
                </a>

                <a href="https://pvolve.com/collections/apparel" target="_blank">
                    <p>apparel</p>
                </a>

                <a href="https://pvolve.com/collections/all" target="_blank">
                    <p>shop all</p>
                </a>
            </div>

            <div class="col-3" style="padding: 1rem;">
                <a href="https://pvolve.com/pages/studio-p-1" target="_blank">
                    <h6 style="margin: .5rem 0;">P.volve Studio</h6>
                </a>

                <a href="https://pvolve.com/pages/contact" target="_blank">
                    <h6 style="margin: .5rem 0;">contact</h6>
                </a>

                <div @click="route('/help')" class="cursor-pointer">
                    <h6 class="footerLink" style="margin: .5rem 0;">help</h6>
                </div>

                <br />

                <a href="mailto:help@pvolve.com?bcc=josh@platformpurple.com&subject=I%20have%20a%20question%20about%20P.volve%20on%20demand..." target="_blank" style="color: #444;"><p>help@pvolve.com</p></a>

                <div class="row full-width" align="center" style="padding: 1rem 0;">
                    <a class="col" v-for="link in componentData.socialMediaLinks" target="_blank" :href="link.link">
                        <q-icon :name="'fab fa-' + link.icon" color="grey-9" style="font-size: 1.5rem;" />
                    </a>
                </div>
            </div>

        </div>

        <div class="col-12 well">
            <hr />
            <h6 style="color: #555; font-size: 0.8rem;">copyright {{moment().format('YYYY')}} P.volve. all rights reserved</h6>
        </div>

    </div>

</template>

<script>

export default {
    props: ['componentData'],

    data() {
        return {
            userEmail: ''
        }
    },

    components: {
        // productCard
    },

    computed: {

        authenticated() {
            return this.$store.state.user.authenticated
        },

        environment() {
            return this.$store.state.environment
        }
    },

    methods: {
        logoClick() {
            if (this.environment.json.e.logoLink) {
                // window.open(this.environment.json.e.logoLink)
                window.open('https://pvolve.com')
            }
            else {
                this.route('/')
            }
        },
        openReferAFriendAd() {
            this.route('/referAFriend')
        },
    },

    mounted() {
        // console.log('componentData: ', this.componentData)
    }
}
</script>

<style scoped>
    .footerHeader {
        color: #92D0BA;
        margin: 0 0 1rem 0;
    }

    .footerLink {
        margin: 0 0 2rem 0;
    }

    p {
        font-family: 'Montserrat', 'sans-serif';
        color: #555;
        line-height: 10px;
    }

    h6 {
        color: #555;
    }

</style>
