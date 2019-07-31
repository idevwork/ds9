<template>

    <div style="background: #fff;">
        <div class="well">
            <div class="row">
                
                <div class="col">
                    <q-btn class="full-width" @click="$emit('goToDayView')">
                        <q-icon name="fa-calendar-alt" /> Day View
                    </q-btn>
                </div>
                
                <div class="col">
                    <q-btn class="full-width" @click="$emit('goToCalendarView')">
                        <q-icon name="fa-calendar" /> Month View
                    </q-btn>
                </div>

                <!--<div v-if="ydwSubscriber" id="ydwAppMenu" class="ui dropdown item">-->
                <!--    <i class="tablet icon"></i>-->
                <!--    <span class="mobileHide">Get Your Daily Walk mobile app!</span>-->
                <!--    <i class="dropdown icon"></i>-->
                <!--    <div class="menu">-->
                <!--        <div class="ui item" style="padding: 1rem !important;">-->
                <!--            <div class="ui fluid button" style="background: #333; color: #fff;" @click="goToAppleLink">-->
                <!--                <i class="apple icon"></i> iOS-->
                <!--            </div>-->
                <!--        </div>-->
                <!--        <div class="ui item" style="padding: 1rem !important;">-->
                <!--            <div class="ui fluid button" style="background: rgb(104, 159, 56); color: #fff;" @click="goToAndroidLink">-->
                <!--                <i class="android icon"></i> Android-->
                <!--            </div>-->
                <!--        </div>-->
                <!--    </div>-->
                <!--</div>-->
            
            </div>
        </div>    
    </div>

</template>

<script>

    export default {
        
        data() {
            return {
                ydwSubscriber: false
            }
        },
    
        methods: {
            goToAppleLink(e) {
                window.open('https://itunes.apple.com/us/app/your-daily-walk/id1063827363?mt=8')
            },
            
            goToAndroidLink(e) {
                window.open('https://play.google.com/store/apps/details?id=com.platformpurple.WalkAtHome&hl=en')
            }
        }
    }
</script>