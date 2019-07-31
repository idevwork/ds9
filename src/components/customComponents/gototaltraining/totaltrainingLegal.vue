<template>
    <div class="layout-view">
        <div class="q-px-xl q-py-md">
            <h3>Terms of Use</h3>
        </div>
            
        <TwoColumnLayout :isCenterOnLeftSection="true" :isCenterOnRightSection="true" :columnSizeLeft="'col-md-12'" :columnSizeRight="'col-md-3'">
            <div slot="left">
                <div class="shadow-1" v-for="{ title, policyComponent } in policies" style="margin: .5rem 0;">
                    <q-collapsible label="First">
                        <template slot="header">
                            <q-item-side left>
                                <q-btn flat round size="sm" style="background: #efefef;">
                                  <q-icon name="fas fa-info" />
                                </q-btn>
                            </q-item-side>
                            <q-item-main :label="title" style="font-size: 1rem;" />
                        </template>
                        <div class="text-left" :is="policyComponent"></div>
                    </q-collapsible>
                </div>
            </div>
            
            <div slot="right">
            </div>
            <!--<div slot="right">-->
            <!--    <div class="text-left">-->
            <!--        <h5>All-Access Subscriptions:</h5>-->
            <!--        <hr>-->
            <!--        <small v-for="(sub, i) in subscriptions" :key="i">-->
            <!--            {{ sub.time }} Subscription-->
            <!--            <br />-->
            <!--            ${{ sub.price }}-->
            <!--            <br />-->
            <!--            <a :href="sub.link">-->
            <!--              <strong class="text-negative">Add to Cart »</strong>-->
            <!--            </a>-->
            <!--            <hr>-->
            <!--        </small>-->
                    
            <!--        <div class="q-my-xl">-->
            <!--            <h5 class="q-my-md">Why Total Training?</h5>-->
            <!--            <ul style="list-style-type: none;">-->
            <!--                <li v-for="reason in reasons" class="q-my-sm">-->
            <!--                    <small>√ {{ reason }}</small>-->
            <!--                </li>-->
            <!--            </ul>-->
            <!--        </div>-->
                    
            <!--        <div>-->
            <!--            <h5>Unlimited Download &amp; Streaming</h5><br>-->
            <!--            <small>-->
            <!--                Our comprehensive library gives you access to every online-->
            <!--                training title! With more than 360 courses to choose from you can-->
            <!--                master a new technique or learn a new program entirely starting at-->
            <!--                just <span class="text-primary">$12 per month</span>.-->
            <!--            </small>-->
            <!--            <br />-->
                        
            <!--            <div class="text-center q-ma-md">-->
            <!--                <q-btn color="amber" class="q-my-lg q-pa-md"><strong>CONTINUE</strong></q-btn>-->
            <!--            </div>-->
            <!--        </div>-->
                    
            <!--        <div class="bg-primary text-white text-center column justify-center q-pa-md" style="border-radius: .5rem; height: 600px; opacity: 0.8;">-->
            <!--            <h5>Sign Up for Our Newsletter</h5><br>-->
            <!--            <p class="text-white">-->
            <!--                <small>-->
            <!--                    Never miss out on the latest-->
            <!--                    course announcements, free tutorials and tips, and promo codes-->
            <!--                    from Total Training.-->
            <!--                </small>-->
            <!--            </p>-->
            <!--            <br />-->
                        
            <!--            <div class="bg-white column justify-center q-pa-md" style="border-radius: .5rem; height: 200px;">-->
            <!--                <input style="border: none; background-color: #D0D0D0; border-radius: .2rem;" class="full-width q-pa-sm" placeholder="Your E-mail" />-->
            <!--                <q-btn class="q-my-md q-py-md" color="positive">-->
            <!--                    <strong>Sign Me Up!</strong>-->
            <!--                </q-btn>-->
            <!--            </div>-->
            <!--        </div>-->
                    
            <!--        <PopularCourses class="q-my-xl" :isTitlePadded="false" :isTitleCentered="false" :isCourseTitleBig="false" :title="'Some of Our Latest Courses'" :showCTA="false" :courses="courses" />-->
                    
            <!--        <hr>-->
            <!--    </div>-->
            <!--</div>-->
        </TwoColumnLayout>
    </div>
</template>

<script>
    import EndUserPolicy from './totaltrainingEndUserPolicy'
    import EndUserPolicyDVD from './totaltrainingEndUserPolicyDVD'
    import TermsAndConditions from './totaltrainingTermsAndConditions'
    import TermsAndConditionsDVD from './totaltrainingTermsAndConditionsDVD'
    import PrivacyPolicy from './totaltrainingPrivacyPolicy'
    import OSServicesWarranty from './totaltrainingOSServicesWarranty'
    import TwoColumnLayout from './twoColumnLayout'
    import PopularCourses from './totaltrainingPopularCourses'
    
    export default {
        name: 'Legal',
        
        components: {
            EndUserPolicy,
            EndUserPolicyDVD,
            TermsAndConditions,
            PrivacyPolicy,
            OSServicesWarranty,
            TwoColumnLayout,
            PopularCourses
        },
        
        data() {
            return {
                policies: [{
                        policyComponent: 'EndUserPolicy',
                        title: 'End User License Agreement'
                    },
                    {
                        title: 'Terms and Conditions',
                        policyComponent: 'TermsAndConditions'
                    },
                    {
                        title: 'Privacy Policy',
                        policyComponent: 'PrivacyPolicy'
                    },
                    {
                        title: 'Online Subscription Services Warranty',
                        policyComponent: 'OSServicesWarranty'
                    },
                    {
                        policyComponent: 'EndUserPolicyDVD',
                        title: 'End User License Agreement - DVD'
                    }
                ],
                subscriptions: [{
                        time: 'Monthly',
                        price: '24',
                        link: '#'
                    },
                    {
                        time: '6-Month',
                        price: '120',
                        link: '#'
                    },
                    {
                        time: '1-Year',
                        price: '216',
                        link: '#'
                    },
                    {
                        time: '2-Year',
                        price: '288',
                        link: '#'
                    },
                    {
                        time: '3-Year',
                        price: '432',
                        link: '#'
                    }
                ],
                
                reasons: [
                    'Expert Training',
                    'Hundreds of Courses',
                    '24/7 Unlimited Access',
                    'Free Project Files',
                    'Player Features',
                    'New Content',
                    'Quality'
                ],
                
                courses: [{
                        courseName: 'Mastering QuickBooks 2016 – Advanced',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse1.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'HTML, CSS & JavaScript Foundations',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse2.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'InDesign CC Essentials',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse3.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Create a Facebook Connect Login System with CodeIgniter',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse4.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'App Design with Adobe XD',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse5.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Excel 2016 Bootcamp',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse6.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Freelancing Career Guide for Designers & Developers',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse7.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Unity 5 – Game Development',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse8.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Digital Forensics for Cyber Professionals',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse9.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Learn MEAN Stack ',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse10.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Amazon Web Services',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse11.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Illustrator CC Masterclass Parts 1 & 2',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse12.jpg',
                        courseLink: '#'
                    },
                    {
                        courseName: 'Word 2016 Bootcamp',
                        courseImage: 'https://vault.platformpurple.com/static/clients/gototaltraining/lastcourse13.jpg',
                        courseLink: '#'
                    },
                ]
            }
        }
    }
</script>

<style></style>
