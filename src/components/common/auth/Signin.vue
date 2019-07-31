<template>
    <div style="padding: 1rem;">
        <q-card class="signin" :style="`background: ${signInBackgroundColor ? signInBackgroundColor : '#eee'}`">
            <q-card-title align="center">
                <q-icon name="fa-user-circle" style="font-size: 2rem;" />
                <h5 style="margin: 0;">
                    {{!register ? 'Sign in' : 'Create account'}}
                </h5>
            </q-card-title>

            <q-card-main v-if="!checkedEmail">
                <h6 align="center">Enter your email to continue:</h6>

                <q-field
                    :error="fieldError.userEmail"
                    error-label="Please fill in your email address"
                >
                    <q-input
                        v-model="userEmail"
                        :class="[{ 'rounded': roundedDesign }, 'inputBox']"
                        hide-underline
                        type="email"
                        :attributes="{autocompletetype: 'email', autocorrect: 'off'}"
                        float-label="your email address"
                        @keydown.enter="checkEmail()"
                        color="grey-7"
                        name="signInEmail"
                        @input="fieldError.userEmail = false"
                    />
                </q-field>

                <q-btn id="checkEmail" @click="checkEmail()" icon-right="fa-arrow-right" :class="[{ 'roundedButton': roundedDesign }, 'full-width', 'monty']" :style="accentColor">
                    Continue
                </q-btn>

                <socialSignIn @socialSignInSuccess="afterSignInUp()" :signUpBackgroundColor="signInBackgroundColor ? signInBackgroundColor : '#eee'" />
            </q-card-main>

            <q-card-main v-if="checkedEmail">
                <Register :noredirect="noredirect" :userEmail.sync="userEmail" v-if="register" />
                <SigninForm :noredirect="noredirect" :userEmail.sync="userEmail" v-if="!register" />

                <div align="center" style="margin-top: 1rem;" v-if="!register">
                    <q-btn @click="checkedEmail = false" id="checkEmail" :class="[{ 'rounded': roundedDesign }]" size="sm" flat>
                        create account
                    </q-btn>
                </div>

                <div align="center" style="margin-top: 1rem;" v-if="register">
                    <q-btn @click="checkedEmail = false" id="checkEmail" :class="[{ 'rounded': roundedDesign }]" size="sm" flat>
                        sign in
                    </q-btn>
                </div>
            </q-card-main>

        </q-card>

        <div v-if="signInExtraMessaging && showSignInExtraMessaging" class="signinmessaging">
            <div class="shadow-6 row bg-white">
                <div class="col-12" align="right">
                    <q-btn flat round @click="showSignInExtraMessaging = !showSignInExtraMessaging">
                        <q-icon name="fas fa-times" />
                    </q-btn>
                </div>
                <div class="col-12" v-html="signInExtraMessaging" style="padding: .5rem;" />
            </div>
        </div>
    </div>

</template>

<script>
    import { authentication } from '../../../mixins/authentication'
    import { userAndProductInfo } from '../../../mixins/userAndProductInfo'

    import SigninForm from './SigninForm'
    import Register from './Register'
    import socialSignIn from './socialSignIn'

    export default {

        props: ['noredirect', 'signInBackgroundColor'],

        mixins: [userAndProductInfo, authentication],

        components: {
            SigninForm,
            Register,
            socialSignIn
        },

        data() {
            return {
                register: false,
                checkedEmail: '',
                userEmail: '',
                showSignInExtraMessaging: true,
                fieldError: {
                    userEmail: false
                }
            }
        },

        computed: {
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            },

            roundedDesign() {
                return this.$store.state.environment.json.e.noRoundedDesign ? false : true
            },

            accentColor() {
                return (this.brandColor ? 'background: ' + this.brandColor : 'background: #777') + '; color: white;'
            },

            initialParameters() {
                return this.$store.state.initialParameters
            },

            signInExtraMessaging() {
                return this.$store.state.environment.json.e.signInExtraMessaging
            }
        },

        methods: {
            checkEmail() {

                if (!this.j_.validEmailAddress(this.userEmail)) {
                    this.fieldError.userEmail = true
                } else {
                    this.sendEmailToAPI((res) => {
                        this.checkedEmail = true

                        if (res.error || !res.success) {
                            this.register = true
                        } else {
                            this.register = false
                        }
                    })
                }

            }
        },

        created() {
            kw('redirect after login? ', !this.noredirect)
            kw('initialParameters email: ', this.initialParameters.email)

            if (this.initialParameters.email) {
                this.userEmail = decodeURIComponent(this.initialParameters.email)

                this.checkEmail(() => {})
                document.getElementsByName("userPassword")[0].focus()

                delete this.initialParameters.email
                this.$store.commit('initialParameters', this.initialParameters)
            }
        }
    }
</script>

<style>
    .signin {
        margin: 0 auto;
        max-width: 500px;
    }

    .signinmessaging {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 40rem;
        padding: .5rem;
    }
</style>
