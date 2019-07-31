<template>
    <Solutions :trainingType="trainingType" :subHeader="subHeader" :pricingFor="'your institution'" :trustedBy="'thousands of professionals and companies'" :courseIDs="componentData.courseIDs">
        <div slot="content">
            <TwoColumnLayout :isLeftOnLeftSection="true" :isCenterOnRightSection="true">
                <div slot="left">
                    <p>We are dedicated to helping your faculty, staff, and students with comprehensive and fun video tutorials to maximize their learning experience. For that reason, all students, educators, and institutions are eligible for savings up to 15%
                        off Total Training Online.</p>
                    <p><strong>Colleges / Universities</strong><br> Use our video tutorials to supplement lesson plans, provide a reference to new students, or simply fine tune your own skills.</p>
                    <p><strong>K-12 Education</strong><br> It’s easy to bring technology into the classroom with our informative video tutorials that help you get up to speed. Plus, our special pricing offers make it an affordable option for even the tightest
                        budgets.
                    </p>
                    <p><strong>Students</strong><br> All matriculating college, university and career school students with a minimum course hour enrollment of 6 units qualify for an academic discount with valid identification.
                    </p>
                    <p><strong>Eligibility</strong><br> All faculty, staff, and academic purchasing personnel from an accredited college, university or post-secondary school are eligible for an academic discount with valid identification. All K-12 Educators
                        and Staff are eligible for an academic discount with valid identification. All matriculating college, university and career school students with a minimum course hour enrollment of 6 units are eligible for an academic discount with
                        valid identification. High School students enrolled in full-time coursework are eligible for an academic discount with valid identification.</p>
                    <p>To take advantage of our academic pricing and place an order, or to learn more about academic pricing and solutions contact our Customer Service Team.</p>
                </div>
                <div slot="right" style="min-width: 100%">
                    <img src="https://vault.platformpurple.com/static/clients/gototaltraining/academic-online-training.jpg" alt="government" style="max-width: 100%;" />
                </div>
            </TwoColumnLayout>
        </div>
    </Solutions>
</template>

<script>
    import Solutions from './totaltrainingSolutions'
    import TwoColumnLayout from './twoColumnLayout'

    export default {
        name: 'EducationSolutions',
        
        props: ['componentData'],
        
        components: { Solutions, TwoColumnLayout },
        
        data() {
            return {
                trainingType: 'Academic',
                subHeader: 'Support and Build upon any learning experience'
            }
        }
    }
</script>
