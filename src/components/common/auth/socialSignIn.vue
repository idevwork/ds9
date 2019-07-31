<template>

    <div class="col-12" v-if="includeSocialLogin">
        <h6 class="dividerHeader" align="center" style="margin: 1rem 0; color: #333;">
            <span :style="`background: ${signUpBackgroundColor ? signUpBackgroundColor : '#efefef'}`">or sign in with</span>
        </h6>
        
        <div class="row" style="margin: -.5rem;">
            <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                <q-btn id="fbLogin" v-if="includeSocialLogin.facebookAppID" @click="userTappedFacebookLogin()" class="monty full-width" color="blue-9">
                    <q-icon name="fab fa-facebook" /> Facebook
                </q-btn>
            </div>
        
            <div class="col-sm-12 col-md-6" style="padding: .5rem;">
                <q-btn id="googleLogin" v-if="includeSocialLogin.googleAppID" @click="userTappedGoogleLogin()" class="monty full-width" color="red-9">
                    <q-icon name="fab fa-google" /> Google
                </q-btn>
            </div>
        </div>
    </div>

</template>

<script>
    import { authentication } from '../../../mixins/authentication'
    import { social } from '../../../mixins/social'

    export default {
        props: ['noredirect', 'signUpBackgroundColor'],
        
        mixins: [authentication, social],
        
        data() {
            return {
                
            }
        },

        computed: {

        },

        methods: {
            
            userTappedFacebookLogin() {
                this.fbLogin((res) => {
                    if (res) {
                        this.userFound(res)
                        
                        this.$emit('socialSignInSuccess')
                    }
                })  
            },
            
            userTappedGoogleLogin() {
                this.googleLogin((res) => {
                    if (res) {
                        this.userFound(res)
                        
                        this.$emit('socialSignInSuccess')
                    }
                })
            }
        }
    }
</script>

<style>

</style>
