<template>
    <Solutions :trainingType="trainingType" :subHeader="subHeader" :pricingFor="'your business'" :trustedBy="'thousands of professionals and companies'" :courseIDs="componentData.courseIDs">
        <div slot="content">
            <TwoColumnLayout :isLeftOnLeftSection="true" :isCenterOnRightSection="true">
                <div slot="left">
                    <p>We are committed to helping you train a handful of employees or your entire organization on software essentials and advanced techniques. Our comprehensive Total Training Online library covers hot topics related to print design, web design
                        &amp; publishing, multimedia &amp; video, development &amp; programming, as well as communication &amp; office tools.</p>
                    <p>Our flexible and scalable options are well-suited for companies of any size. We work with leading global organizations to positively impact workforce productivity and efficiency. Our solutions are proven to increase utilization of software
                        investments and provide the confidence to continue to invest as new software applications become available. Don’t wait any longer to get the best video training on the latest software tools provided by Adobe, Apple, and Microsoft.
                        Take advantage of discounts on multi-user licenses, and reap the benefits of having a well trained staff.</p>
                    <p>Our licensing models include:</p>
                    <ul>
                        <li>Per Course</li>
                        <li>Per User</li>
                        <li>Department or Business Unit</li>
                        <li>Site License</li>
                    </ul>
                    <p>All corporate&nbsp;licenses include an Administrative user who can issue, manage and allocate licenses within their organization.</p>
                </div>
                <div slot="right" style="min-width: 100%">
                    <img src="https://vault.platformpurple.com/static/clients/gototaltraining/corporate-logos.jpg" alt="government" style="max-width: 100%;" />
                </div>
            </TwoColumnLayout>
        </div>
    </Solutions>
</template>

<script>
    import Solutions from './totaltrainingSolutions'
    import TwoColumnLayout from './twoColumnLayout'

    export default {
        name: 'CorporateSolutions',
        
        props: ['componentData'],
        
        components: { Solutions, TwoColumnLayout },
        
        data() {
            return {
                trainingType: 'Corporate Software',
                subHeader: 'Save Thousands of Dollars & Increase Productivity with Agency-Wide, On-Demand, Online Software Training',
            }
        }
    }
</script>
