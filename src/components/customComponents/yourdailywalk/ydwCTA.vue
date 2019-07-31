<template>
        
    <div>
        <div class="ui inverted row" style="background: #dc3972; padding: 3rem;">
            <h1 class="ui center aligned inverted header">
                Sign up for "Your Daily Walk" and do a different walk with Leslie every day!
            </h1>
        </div>
        
        <div class="ui row" style="background: #fff; padding: 3rem;">
            <div class="ui container">
                <div class="ui two column stackable grid">
                    <div class="column">
                        <img class="ui image" src="/app/customComponents/digitalwalkathome/ydw-ipad-horizontal.jpg" style="max-height: 350px; width: auto; margin: 0 auto;" />
                    </div>
                    <div class="column">
                        <h1 style="text-transform: uppercase; color: #00b0df;">Keep your workout fresh with a new video every day.</h1>
                        <h2 style="color: #69b342;">An easy and fun way to get fit</h2>
                        <p>Keep your walking workouts fresh with a new plan each month!</p>
                        <p>Every day of each month is planned for you… some days you’ll take a long walk… some days a mini walk… or even a rest day… just tap the screen and WALK!</p>
                        <p>Each daily video comes complete with all the features from the DVD, including chapters and bonus features.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="ui row" style="padding: 3rem; background-color: #1e1b1d;">
            <div class="ui two column center aligned stackable container grid">
                <div class="column">
                    <div id="annual" class="ui pink large button" style="background: #dc3972;" @click="goToPreview('annual')">
                        ANNUAL MEMBERSHIP
                    </div>
                    <h4 class="ui inverted header">Annual membership (best value): $49.99</h4>
                </div>
                <div class="column">
                    <div class="ui pink large button" style="background: #dc3972;" @click="goToPreview('monthly')">
                        MONTHLY MEMBERSHIP
                    </div>
                    <h4 class="ui inverted header">First month free, $4.99 afterwards. Credit card required.</h4>
                    <h4 class="ui inverted header">Use the code "1monthfree" to get your first month free!</h4>
                </div>
            </div>
        </div>
        
        <div class="ui row" style="background: #fff; padding: 3rem;">
            <div class="ui container">
                <div class="ui two column stackable grid">
                    <div class="column">
                        <h1 style="text-transform: uppercase; color: #00b0df;">What could be easier?</h1>
                        <h2 style="color: #69b342;">No hassles with discs, DVD players or remote controls</h2>
                        <p>Do you have a smartphone, smart TV, tablet, laptop, or Playstation? Then you can start walking with Leslie
                        with just a few taps or clicks.</p>
                        <p>If you have an iOS or Android device, we have a free app that will make it even easier!</p>
                        <p>Work out with WALK at Home anywhere that has WiFi, 4G or LTE–your home, hotel rooms, beach or mountain cabins
                        or on vacation.</p>
                    </div>
                    <div class="column">
                        <img class="ui image" src="/app/customComponents/digitalwalkathome/greenscreenIPAD.jpg" style="max-height: 350px; width: auto; margin: 0 auto;" />
                    </div>
                </div>
            </div>
        </div>
        
        <div class="ui row" style="background: #fff; padding: 3rem;">
            <div class="ui container">
                <div class="ui two column stackable grid">
                    <div class="column">
                        <img class="ui image" src="/app/customComponents/digitalwalkathome/IMG_6282.jpg" style="max-height: 350px; width: auto; margin: 0 auto;" />
                    </div>
                    <div class="column">
                        <h1 style="text-transform: uppercase; color: #00b0df;">Mixing it up makes working out more fun!</h1>
                        <h2 style="color: #69b342;">Variety is key to maintaining a workout program</h2>
                        <p>Your Daily Walk gives you a fresh new workout every day for three or four days a week, with rest days in between.</p>
                        <p>Get ready for a brand new you! Subscribe today!</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="ui row" style="background: #fff; padding: 3rem;">
            <div class="ui container">
                <div class="ui two column stackable grid">
                    <div class="column">
                        <h1 style="text-transform: uppercase; color: #00b0df;">Go back or forward in time.</h1>
                        <p>If you want to skip to past workouts, or forward to future workouts, just swipe the screen right or left.</p>
                    </div>
                    <div class="column">
                        <img class="ui image" src="/app/customComponents/digitalwalkathome/ydw_on_tablet.jpg" style="max-height: 350px; width: auto; margin: 0 auto;" />
                    </div>
                </div>
            </div>
        </div>
        
        <div class="ui row" style="background: #fff; padding: 3rem;">
            <div class="ui container">
                <div class="ui two column stackable grid">
                    <div class="column">
                        <img class="ui image" src="/app/customComponents/digitalwalkathome/IMG_8187.jpg" style="max-height: 350px; width: auto; margin: 0 auto;" />
                    </div>
                    <div class="column">
                        <h1 style="text-transform: uppercase; color: #00b0df;">How do I get started?</h1>
                        <p>First, sign up for a monthly ($4.99, first month free) or annual membership ($49.99).</p>
                        <p>Once you’ve signed up, come back to this website anytime, on any device, and today’s workout appears front and center.
                        Click or tap once to start walking!</p>
                        <p>Or, download a free app for your iPad, iPhone, or Android device from the links on the “thank you” page or your
                        email receipt and sign in.</p>
                        <p>Walk, breathe, get fit, burn calories, improve your health and life and have fun!</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="ui inverted row" style="padding: 3rem; background-color: #1e1b1d;">
            <h1 class="ui center aligned inverted header">
                WELCOME TO A BRAND NEW YOU!
            </h1>
            <div class="ui hidden divider"></div>
            <div class="ui two column center aligned stackable container grid">
                <div class="column">
                    <div id="annual" class="ui pink large button" style="background: #dc3972;" @click="goToPreview('annual')">
                        ANNUAL MEMBERSHIP
                    </div>
                    <h4 class="ui inverted header">Annual membership (best value): $49.99</h4>
                </div>
                <div class="column">
                    <div class="ui pink large button" style="background: #dc3972;" @click="goToPreview('monthly')">
                        MONTHLY MEMBERSHIP
                    </div>
                    <h4 class="ui inverted header">First month free, $4.99 afterwards. Credit card required.</h4>
                    <h4 class="ui inverted header">Use the code "1monthfree" to get your first month free!.</h4>
                </div>
            </div>
        </div>
    </div>
        
</template>

<script>
    export default {
        
        methods: {
            goToPreview(e) {
                k(e)
                if (e === 'annual') {
                    this.route('/shop/checkout?e=yourdailywalk&cart=109777')
                } else {
                    this.route('/shop/checkout?e=yourdailywalk&cart=109776')
                }
            }
        }
    }
</script>

<style scoped>
    p {
        font-size: 1.2rem;
    }
</style>