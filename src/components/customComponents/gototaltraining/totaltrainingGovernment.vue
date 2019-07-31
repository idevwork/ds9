<template>
    <Solutions :trainingType="trainingType" :subHeader="subHeader" :pricingFor="'your agency'" :trustedBy="'dozens of government agencies'" :courseIDs="componentData.courseIDs">
        <div slot="content">
            <TwoColumnLayout :isPadded="true" :isLeftOnLeftSection="true" :isCenterOnRightSection="true" :columnSizeLeft="'col-md-6'" :columnSizeRight="'col-md-6'">
                <div slot="left">
                    <p>We are happy to customize product solutions designed to your exact requirements. Whatever your agency’s mission, we offer the training needed to help you push the envelope and leverage your technology skills.</p>
                    <p>Turn to Total Training to get up to speed on the latest software offerings from Adobe, Apple, and Microsoft. By leaning on us, we can help alleviate the stress of keeping up with the fast-paced technological changes that are so crucial
                        to success in today’s world.</p>
                    <p>Our licensing models include:</p>
                    <ul>
                        <li>Per Course</li>
                        <li>Per User</li>
                        <li>Department Wide</li>
                        <li>Site License</li>
                    </ul>
                    <p>All Government licenses include an Administrative user who can issue, manage and allocate licenses within their organization.
                    </p>
                    <p>Contact us for a <strong>free 30-day government agency
                      trial</strong>.</p>
                </div>
                <div slot="right" style="min-width: 100%">
                    <img src="https://vault.platformpurple.com/static/clients/gototaltraining/gov_logos.png" alt="government" style="max-width: 100%;" />
                </div>
            </TwoColumnLayout>
        </div>
    </Solutions>
</template>

<script>
    import Solutions from './totaltrainingSolutions'
    import TwoColumnLayout from './twoColumnLayout'
    
    export default {
        name: 'GovernmentSolutions',

        props: ['componentData'],

        components: { Solutions, TwoColumnLayout },

        data() {
            return {
                trainingType: 'Government Agency',
                subHeader: 'Save Thousands of Dollars & Increase Productivity with Agency-Wide, On-Demand, Online Software Training'
            }
        },
        
        created() {
            k('government componentData: ', this.componentData)
        }
    }
</script>
