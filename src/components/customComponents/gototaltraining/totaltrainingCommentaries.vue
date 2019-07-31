<template>
  <div class="layout-padding bg-secondary">
    <h4 class="text-center text-white">What our customers have to say!</h4>
    <div class="row well justify-center items-start q-mt-md">
      <div
        v-for="(commentary, index) in commentaries"
        :key="index"
        class="column"
      >
        <div class="q-ma-md q-pa-lg speech-bubble">
          <p>
        <small><em>{{ commentary.description }}</em></small>
          </p>
        </div>
        <div class="row justify-start items-center q-ml-md">
          <div class="q-mr-md" style="width: 2rem; height: 2rem;">
            <img :src="commentary.photo" alt="photo" style="width: 100%;"/>
          </div>
          <p class="text-white"><small v-html="commentary.person"></small></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Commentaries',
  data () {
    return {
      commentaries: [
        {
          description: 'I am very pleased with your training series. The interface is very simple and allows me to easily practice the lessons that are displayed.',
          photo: 'https://vault.platformpurple.com/static/clients/gototaltraining/oleary.jpg',
          person: 'Mike Oleary'
        },
        {
          description: 'All I can say is Wow, Fantastic, Brilliant. Absolutely just what I have been waiting for, for nearly 12 years.',
          photo: 'https://vault.platformpurple.com/static/clients/gototaltraining/alanphillips.jpg',
          person: 'Alan Phillips'
        },
        {
          description: 'I went to Total Training Online logged in and I was hooked. First day, I spent about three hours online. I am impressed with all the PhotoShop moves I’ve learned already.',
          photo: 'https://vault.platformpurple.com/static/clients/gototaltraining/jim_auty.jpg',
          person: 'Jim Auty'
        },
        {
          description: 'I frequently promote Total Training for Photoshop in my classes because I have been so impressed by the product. It’s perfect for educators, who are always looking for ways to save time and improve finished projects.',
          photo: 'https://vault.platformpurple.com/static/clients/gototaltraining/brit_pursley.jpg',
          person: 'Brit Pursley, Region 14 Education Service <br> Center'
        },
        {
          description: 'Probably the best investment I’ve made outside of my photographic equipment.',
          photo: 'https://vault.platformpurple.com/static/clients/gototaltraining/lake.jpg',
          person: 'Gary Lake'
        },
        {
          description: 'Valuable tools like the Total Training videos, offer an added layer of support, which help photo and video enthusiasts grow with the products and produce work they are proud to share with family and friends. We are pleased to be aligned with such a recognized training resource.',
          photo: 'https://vault.platformpurple.com/static/clients/gototaltraining/stephen_inoue.jpg',
          person: 'Stephen Inoue, Adobe'
        }
      ]
    }
  }
}
</script>
