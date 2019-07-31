export const contestTools = {
    data() {
        return {
            subscribeRoute: 'api/client/mypvolve/subscribeUser2MailingList'
        }
    },

    computed: {
        validSubscription() {
            k('validSubscription: ', this.environmentJSON.e.validSubscriptionProductIDs)
            return this.environmentJSON.e.validSubscriptionProductIDs ? this.userHasAccess(this.environmentJSON.e.validSubscriptionProductIDs) : false
        },

        contestOptIn() {
            let contestOptIn = this.userPreferences ? this.userPreferences.find((pref) => { return pref.contestName === this.contestName }) : ''
            k('contestOptIn: ', contestOptIn, this.userPreferences)
            return contestOptIn
        },
    },

    methods: {
        addUserToContestEmailList(userPurchased) {
            var req = {
                userEmail: this.userInfo.userEmail,
                listID: this.contestEmailListID,
                mergeFields: {
                   "FNAME": this.userInfo.firstName,
                   "ACTIVESUB": true,
                   "NEWSUB": userPurchased
                }
            }

            // req.mergeFields[this.contestMailListName] = "true"

            this.api.post(`${this.api.apiv4Route}${this.subscribeRoute}`, req, (res) => {
                k('added user to trialSubscribers: ', res)
            })
        },

        addUserToChallenge(userPurchased, cb) {
            k('addUserToChallenge')

            // save userPreference
            var req = {
                "userID": this.userInfo.userID,
                "type": "contestOptIn",
                "environment": this.environmentName,
                "contestName": this.contestName
            }

            this.sendContestPreferenceToAPI(req, () => {
                // add to mailchimp
                // this.addUserToContestEmailList(userPurchased)

                // log in events2
                this.api.sendEvent({
                	eventType: 'contestOptIn',
                	contestName: this.contestName,
                	userID: this.userInfo.userID
                })

                cb()
            })
        },

        sendContestPreferenceToAPI(req, cb) {
            k('sendContestPreferenceToAPI req: ', req)

            this.api.post(this.api.ioRoute + 'userInfo', req, (res) => {
                k('sendContestPreferenceToAPI res: ', res)

                if (res.success) {
                    this.userPreferences.push(req)
                    this.$store.commit('userPreferences', this.userPreferences)
                }

                cb()
            })
        }
    }
}
