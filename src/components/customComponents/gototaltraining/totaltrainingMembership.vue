<template>
  <div class="bg-grey-3">
    <div class="row well justify-center">
        <div class="q-pa-sm col-12">
          <hr> <hr>
          <h3 class="text-center">Membership Includes</h3>
          <hr> <hr>
        </div>
        <div class="col-sm-12 col-md-4 q-pa-lg" v-for="(topic, index) in membership" :key="index">
            <q-card
                inline
                class="q-pa-lg text-center full-width bg-white"
                style="height: 100%;"
            >
                <q-btn round :style="`background: ${homePageData.e.brandColor};`">
                    <q-icon :name="topic.icon" color="white"></q-icon>
                </q-btn>

                <h4 style="margin: 1rem 0;">{{ topic.title }}</h4>
                <br>
                <p>{{ topic.description }}</p>
            </q-card>
      </div>
    </div>

    <div class="row well justify-center">
      <div class="col-12 q-pa-sm">
        <q-card class="row justify-between items-center q-pa-lg bg-white">
          <div>
            <strong>Contact us about subscriptions and special pricing for your
              agency.</strong><br>
            <p>
              Give your business access to our entire library or an individual course if that's all you need.
            </p>
          </div>
          <q-btn @click="route('/contact-us')" color="amber" size="lg">CONTACT US TODAY</q-btn>
          </q-card>
        </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Membership',
        data() {
            return {
                membership: [{
                        icon: 'fas fa-cloud',
                        title: 'Streaming or Download',
                        description: 'Access your courses any time you want, online or offline.'
                    },
                    {
                        icon: 'fas fa-download',
                        title: 'Project files',
                        description: 'Free project files allow you to follow along to reinforce how it’s done.'
                    },
                    {
                        icon: 'fas fa-list-alt',
                        title: 'Player Features',
                        description: 'Set your own pace. Bookmark a lesson, track your progress and much more.'
                    },
                    {
                        icon: 'fas fa-lightbulb',
                        title: 'New Content',
                        description: 'Subscribers get access to ALL new content at no additional charge.'
                    },
                    {
                        icon: 'fas fa-magic',
                        title: 'Quality',
                        description: 'Feel secure with a brand that has more than 15 years of experience.'
                    },
                    {
                        icon: 'fas fa-mobile-alt',
                        title: 'Mobile Access',
                        description: 'Got a free minute? Master a new technique.'
                    }
                ]
            }
        },

        computed: {
            homePageData() {
                return this.$store.state.environment.json
            }
        }
    }
</script>
