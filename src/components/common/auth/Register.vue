<template>
    <div>
        <q-field
            :error="fieldError.userEmail"
            error-label="Please fill in your email address"
        >
            <q-input
                id="email"
                color="grey-7"
                class="inputBox"
                :value="userEmail"
                @input="updateUserEmail"
                :attributes="{autocompletetype: 'email', autocorrect: 'off'}"
                autocomplete="email"
                type="text"
                float-label="Email"
            />
        </q-field>

        <div class="row">
            <div class="col-6">
                <q-field
                    :error="fieldError.firstName"
                    error-label="Please fill in your first name"
                />
                    <q-input
                        id="firstName"
                        class="inputBox"
                        :attributes="{autocompletetype: 'given-name', autocorrect: 'off'}"
                        color="grey-7"
                        v-model="firstName"
                        type="text"
                        float-label="First name"
                        @input="fieldError.firstName = false"
                    />
                </q-field>
            </div>

            <div class="col-6">
                <q-field
                    :error="fieldError.lastName"
                    error-label="Please fill in your last name"
                />
                    <q-input
                        id="lastName"
                        class="inputBox"
                        :attributes="{autocompletetype: 'family-name', autocorrect: 'off'}"
                        color="grey-7"
                        v-model="lastName"
                        type="text"
                        float-label="Last name"
                        @input="fieldError.lastName = false"
                    />
                </q-field>
            </div>
        </div>

        <q-field
            :error="fieldError.userPassword"
            error-label="Please fill in your password"
        >
            <q-input
                id="password"
                class="inputBox"
                color="grey-7"
                v-model="userPassword"
                :attributes="{autocompletetype: 'new-password', autocorrect: 'off'}"
                type="password"
                float-label="Password"
                @input="fieldError.userPassword = false"
            />
        </q-field>

        <q-field
            :error="fieldError.confirmPassword"
            error-label="Please fill in your password confirmation"
        >
            <q-input
                id="confirmPassword"
                class="inputBox"
                color="grey-7"
                v-model="confirmUserPassword"
                :attributes="{autocompletetype: 'new-password', autocorrect: 'off'}"
                type="password"
                float-label="Confirm Password"
                @input="fieldError.confirmPassword = false"
            />
        </q-field>

        <div
            class="row cursor-pointer"
            v-if="enableNewsletterCheckbox"
            @click="generalSubscribeToNewsletter = !generalSubscribeToNewsletter"
        >
            <div class="col-1">
                <q-checkbox color="#000" v-model="generalSubscribeToNewsletter" />
            </div>
            <div class="col-11" style="font-size: 13px; margin-top: 1px;">
                Keep me up to date with P.volve newsletters and exclusive email offers
            </div>
        </div>

        <div :class="['q-py-sm', { 'rounded': roundedDesign }, 'error-field-color']" align="center" v-if="contextErrorMessage">
            {{ contextErrorMessage }}
        </div>

        <q-btn id="createAccountBtn" :style="accentColor" @click="signUserUp()" icon-right="fa-arrow-right" :class="[{ 'roundedButton': roundedDesign }, 'full-width', 'monty']" style="margin: .5rem 0;">
            create account
        </q-btn>
    </div>

</template>

<script>
    import { authentication } from '../../../mixins/authentication'

    export default {
        props: ['userEmail', 'noredirect'],

        mixins: [authentication],

        data() {
            return {
                firstName: '',
                lastName: '',
                userPassword: '',
                confirmUserPassword: '',
                fieldError: {
                    userEmail: false,
                    firstName: false,
                    lastName: false,
                    userPassword: false,
                    confirmPassword: false
                },
                contextErrorMessage: '',
                generalSubscribeToNewsletter: false
            }
        },

        computed: {
            brandColor() {
                return this.$store.state.environment.json.e.brandColor
            },

            roundedDesign() {
                return this.$store.state.environment.json.e.noRoundedDesign ? false : true
            },

            enableNewsletterCheckbox() {
                return this.$store.state.environment.json.e.enableNewsletterCheckbox ? true : false
            },

            accentColor() {
                return (this.brandColor ? 'background: ' + this.brandColor : 'background: #777') + '; color: white;'
            }
        },

        methods: {
            signUserUp() {
                k('signUserUp')

                if (!this.userEmail || !this.j_.validEmailAddress(this.userEmail) || !this.userPassword || !this.confirmUserPassword || this.userPassword !== this.confirmUserPassword) {

                    if (!this.userEmail || !this.j_.validEmailAddress(this.userEmail)) {
                        this.fieldError.userEmail = true
                    }

                    if (!this.userPassword || !this.confirmUserPassword) {
                        this.fieldError.userPassword = true
                    }

                    if (this.userPassword !== this.confirmUserPassword) {
                        this.fieldError.confirmPassword = true
                    }

                    return false
                }

                if (this.generalSubscribeToNewsletter) {
                    this.marketingOptIn()
                }

                this.registerNewUser((res) => {
                    this.contextErrorMessage = ''

                    if (!res.success) {
                        k('error code: ', res.messageCode)

                        var resStr = res.messageCode
                        if (res.messageCode === 'userAuthenticationFail') {
                            resStr = 'We have an account for this email. Please tap the \'sign in\' button to log in.'
                        }

                        this.contextErrorMessage = resStr
                    }
                })

            },

            updateUserEmail(value) {
                this.$emit('update:userEmail', value)
                this.fieldError.userEmail = false
            }
        }
    }
</script>

<style>
    .sigin {
        margin: 0 auto;
        margin-top: 1rem;
        max-width: 500px;
    }
</style>
