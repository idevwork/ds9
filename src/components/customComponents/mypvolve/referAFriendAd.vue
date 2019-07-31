<template>
    
    <div id="referAFriendAd" class="refer-a-friend-section">
        <div class="refer-a-friend-section__background">
            <div class="refer-a-friend-section__overlay">
                <div class="row well items-center">
                    <div class="col-sm-12">
                        <div class="text-container padded" style="max-width: 500px;">
                            <h1 style="margin: 1rem 0;">
                                Invite a friend <br /> <span class="thickHeader" :style="`color: ${pvolveMintTitle};`">& both earn $30 credit!</span>
                            </h1>
                            
                            <h6 style="text-transform: unset;">Invite a friend to earn $30 credit towards your next month of streaming, plus they'll also get $30 credit after their paid subscription begins.</h6>
                            
                            <h6 :style="`text-transform: unset; color: ${pvolveMintTitle}; margin: 1rem 0;`">Enter your friend’s email address to send them an invitation to join!</h6>
                            
                            <referFriend :buttonColor="pvolveMintTitle" promotionID="pvolve_friend30" style="padding: 0;" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
    import referFriend from './referFriend'
    import { pvolveColors } from '../../customComponents/mypvolve/pvolveColors'
    export default {
        name: 'referAFriendAd',
        mixins: [pvolveColors],
        components: {
          referFriend
        },
        
        data () {
            return {
            }
        },
        
        computed: {
        }
    }
</script>

<style scoped>
    .padded {
        padding: 2rem;
    }
    .refer-a-friend-section {
        min-height: 450px;
    }
    .refer-a-friend-section .refer-a-friend-section__background {
        background: url(https://vault.platformpurple.com/static/clients/mypvolve/PLV028-19-Streaming-6.jpeg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
    }
    .refer-a-friend-section .refer-a-friend-section__overlay {
        width: 100%;
        padding: 1rem;
        /*background-color: rgba(255, 158, 124, 0.8);*/
    }
    
    @media (max-width: 768px) {
        .refer-a-friend-section .refer-a-friend-section__overlay {
            background-color: rgba(255, 255, 255, 0.9);
        }   
        .refer-a-friend-section .refer-a-friend-section__background {
            background-position: 100% 0%;
        }
    }
</style>
