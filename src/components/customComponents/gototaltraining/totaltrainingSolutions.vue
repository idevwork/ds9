<template>
    <div class="layout-view">
        <div style="background: url('https://vault.platformpurple.com/static/clients/gototaltraining/cup-header-1024x576.jpg'); background-position: 50%; background-size: cover; background-repeat: no-repeat; margin: 0 auto;">
            <div class="well" :style="`${windowWidth > 768 ? 'padding: 10rem 2rem;' : 'padding: 5rem 1rem;'}`">
                <h2>{{ trainingType }} Training Solutions</h2>
                <p></p>
                <p>{{ subHeader }}</p>
            </div>
        </div>
        <slot name="content">
            <TwoColumnLayout :isLeftOnLeftSection="true" :isCenterOnRightSection="true" :columnSizeLeft="'col-md-6'" :columnSizeRight="'col-md-6'">
                <div slot="left">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                    sanctus est Lorem ipsum dolor sit amet.
                </div>
                <div slot="right" style="min-width: 100%">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
                    sanctus est Lorem ipsum dolor sit amet.
                </div>
            </TwoColumnLayout>
        </slot>
        <TwoColumnLayout :isRightOnLeftSection="true" :isLeftOnRightSection="true" :columnSizeLeft="'col-md-6'" :columnSizeRight="'col-md-6'">
            <div slot="left">
                <h3>Set Your Own Pace</h3>
                <p>We have thousands of videos on dozens of topics. Updated monthly, so your employees never fall behind.</p>
            </div>
            <div slot="right">
                <img src="https://vault.platformpurple.com/static/clients/gototaltraining/features-pace-blue.jpg" alt="image">
            </div>
        </TwoColumnLayout>
        <TwoColumnLayout :isInverted="true" :isRightOnRightSection="true" :isLeftOnLeftSection="true" :columnSizeLeft="'col-md-6'" :columnSizeRight="'col-md-6'">
            <div slot="left">
                <h4>Free Project Files</h4>
                <p>Follow along to reinforce what you’ve learned. Project files are always free and are included in nearly every course.</p>
            </div>
            <div slot="right">
                <img src="https://vault.platformpurple.com/static/clients/gototaltraining/features-project-files-blue.jpg" alt="image">
            </div>
        </TwoColumnLayout>
        <TwoColumnLayout :isRightOnLeftSection="true" :isLeftOnRightSection="true" :columnSizeLeft="'col-md-6'" :columnSizeRight="'col-md-6'">
            <div slot="left">
                <h4>Learn Anywhere...<br>Streaming or Offline</h4>
                <p>On a flight or at a conference? PC, tablet, and mobile access available. View in a browser or preload for offline playback.</p>
            </div>
            <div slot="right">
                <img src="https://vault.platformpurple.com/static/clients/gototaltraining/features-access-blue.jpg" alt="image">
            </div>
        </TwoColumnLayout>

        <Membership />
        <PopularCourses :courses="courses" />
        <Commentaries />

        <div class="layout-padding text-center">
          <h4>Contact us about special pricing for {{ pricingFor }}</h4>
            <p>Give {{ pricingFor }} access to our entire library or an individual course if that’s all you need.</p>
            <q-btn @click="route('/contact-us')" color="amber" class="q-my-lg" size="lg"><strong>CONTACT US TODAY</strong></q-btn>
        </div>
        <div class="layout-padding text-center" style="background-color: #F0F0F0;
          border-top: .01rem solid black; border-bottom: .01rem solid black;">
            <h4>Trusted by {{ trustedBy }}</h4><br>
            <img src="https://vault.platformpurple.com/static/clients/gototaltraining/clients.png" alt="gov_logos" style="max-width: 100%;">
        </div>
    </div>
</template>

<script>
    import TwoColumnLayout from './twoColumnLayout'
    import Membership from './totaltrainingMembership'
    import PopularCourses from './totaltrainingPopularCourses'
    import Commentaries from './totaltrainingCommentaries'
    
    import { globalComputedData } from '../../../mixins/globalComputedData'

    export default {
        name: 'Solutions',
        
        components: {
            TwoColumnLayout,
            Membership,
            PopularCourses,
            Commentaries
        },
        
        mixins: [ globalComputedData ],
        
        props: {
            'trainingType': {
                type: String,
                default: 'Generic'
            },
            'subHeader': {
                type: String,
                default: 'Sub header Ipsum'
            },
            'pricingFor': {
              type: String,
              default: ''
            },
            'trustedBy': {
              type: String,
              default: ''
            },
            'courseIDs': Array
        },
        
        computed: {
            courses() {
                let result = this.environmentProducts && this.courseIDs ? this.courseIDs.map((productID) => {
                    return this.environmentProducts.find((product) => {
                        return product.productID === productID
                    })
                }) : []
                
                kw('result: ', result)
                return result
            }
        },
        
        created() {
            kw('popular courses: ', this.courseIDs)
        }
    }
</script>
