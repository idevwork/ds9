<template>

    <div>
        <q-field
            error-label="Please enter your email"
            :error="fieldError.userEmail"
        >
            <q-input
                :value="userEmail"
                @input="updateUserEmail"
                :class="[{ 'rounded': roundedDesign }, 'inputBox']"
                hide-underline
                type="email"
                :attributes="{autocompletetype: 'email', autocorrect: 'on'}"
                float-label="Email"
                @keydown.enter.prevent
                color="grey-7"
            />
        </q-field>

        <q-field
            error-label="Please enter your password"
            :error="fieldError.userPassword"
        >
            <q-input
                autofocus
                id="passwordField"
                :class="[{ 'rounded': roundedDesign }, 'inputBox']"
                hide-underline
                v-model="userPassword"
                type="password"
                :attributes="{autocompletetype: 'current-password', autocorrect: 'off'}"
                float-label="Password"
                @keydown.enter="signIn()"
                @keydown.enter.prevent
                @input="fieldError.userPassword = false"
                color="grey-7"
            />
        </q-field>

        <div align="right">
            <q-btn @click="requestPasswordChange()"  :class="[{ 'rounded': roundedDesign }, 'text-black', 'monty']" flat size="sm">Forgot Password</q-btn>
        </div>

        <div :class="['q-py-sm', { 'rounded': roundedDesign }, 'error-field-color']" align="center" v-if="contextErrorMessage">
            {{ contextErrorMessage }}
        </div>

        <q-btn id="signInBtn" @click="signIn()" :style="accentColor" :class="[{ 'roundedButton': roundedDesign }, 'full-width']" style="margin: .5rem 0;">
            sign in
        </q-btn>
    </div>

</template>

<script>
    import {authentication} from '../../../mixins/authentication'

    export default {
        props: ['userEmail', 'noredirect'],

        mixins: [authentication],

        data() {
            return {
                userPassword: '',
                remember: false,
                fieldError: {
                    userEmail: false,
                    userPassword: false
                },
                contextErrorMessage: ''
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
            }
        },

        methods: {

            signIn() {
                k('SIGN IN')

                this.contextErrorMessage = ''

                if (!this.userEmail || !this.userPassword) {
                    if (!this.userEmail) {
                        this.fieldError.userEmail = true
                    }

                    if (!this.userPassword) {
                        this.fieldError.userPassword = true
                    }

                    return false
                }

                this.$q.loading.show()

                this.signUserIn((res) => {
                    k('res from signinform: ', res)
                    this.$q.loading.hide()

                    if (!res.authenticated) {
                        this.contextErrorMessage = 'The email or password is incorrect.'
                        this.userPassword = ''
                    }
                })

            },

            requestPasswordChange() {
                this.contextErrorMessage = ''

                this.sendRequestPasswordChangeToAPI((res) => {
                    if (res.success) {
                        this.informUserPasswordResetHasBeenSent()
                    }
                    else {
                        var resStr = 'Sorry we could not reset your password. Please try again later or contact support.'

                        if (res.messageCode) {
                            if (res.messageCode === 'errorGettingUserInfo') resStr = 'This email was not found in our system. Please try again.'
                        }

                        this.contextErrorMessage = resStr
                    }
                })
            },

            updateUserEmail(value) {
                this.$emit('update:userEmail', value)
                this.fieldError.userEmail = false
            }
        },

        mounted() {
            document.querySelector('#passwordField div input').focus()
        }
    }
</script>

<style>

</style>
