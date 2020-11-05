<template>
    <v-main class="grey lighten-3 flex-column-reverse">
      <v-container :fluid="$vuetify.breakpoint.mdAndDown">
        <v-row>
          <v-col sm="12" md="4" lg="4" xl="3" class="flex-column-reverse" v-show="$vuetify.breakpoint.mdAndUp"></v-col>
          <v-col sm="12" md="8" lg="7" xl="5">
            <v-sheet class="rounded-t-lg pa-4" color="rgb(88 132 158)" elevation="14">
                              <div>
                  <v-alert align="center" justify="center" dark dense border="left" text>
                      <h1><strong><span style="font-size: 20px;">About StudyChessOpenings.com</span></strong></h1>
                  </v-alert>
                </div>
            </v-sheet>           
            <v-sheet align="center" justify="center">
              <v-divider></v-divider>
              <v-card outlined class="overflow-y-auto pa-4 mx-lg-auto" elevation="14">
                <p class="text-justify">
                    <p>StudyChessOpenings.com is a clone of the old memchess.com, which shut down in early 2020.</p>
<p>Here, you&apos;ll be able to explore main opening lines, and drill them using spaced repetition to help you memorize each move. Yes, memorize! Memorizing your openings is only bad <em>when that&apos;s all you do!</em> StudyChessOpenings.com hopes to be one out of many tools you use to succeed in chess, and should be used to explore openings you may otherwise never have a chance to see.</p>
<p>The lines you see on this site are named lines, each with their own ECO codes. In addition, each line has been vetted using a polyglot book of 2500+ players, so these are the lines the pros have used.</p>
<p>You will be quizzed on each line you select, and once completed, you wont see that line again for a short while; make no mistakes, and you wont see that line for a longer and longer time, helping you to explore the many ideas within your chosen openings. Registering and logging in will enable progress tracking, but dont worry- not only will I never sell your data, I don&apos;t really even have any of it. The authorization piece is just to make sure my web server doesn&apos;t get abused with post requests :)</p>
<p>Enjoy, and don&apos;t forget to share your tournament winnings by buying me a coffee at the bottom of this page!</p>
              </v-card>
              <v-divider></v-divider>
            </v-sheet>

            <v-sheet class="rounded-b-lg pa-4" color="rgb(88 132 158)" elevation="14">
              <v-row align="center" justify="space-around"></v-row>
            </v-sheet>
          </v-col>

          <v-col xl="2" lg="2" v-show="$vuetify.breakpoint.smAndDn"></v-col>

        </v-row>
      </v-container>
    </v-main>
</template>

<style lang="sass">
  @import '~vuetify/src/styles/styles.sass'
  
  @media #{map-get($display-breakpoints, 'sm-and-down')}
    .abtsection
      width: clamp(320px, min(85vw,85vh), 600px)
      height: clamp(320px, min(85vw,85vh), 600px)

  @media #{map-get($display-breakpoints, 'md-and-up')}
    .abtsection
      width: clamp(320px, min(85vw,85vh), 600px)
      height: clamp(320px, min(85vw,85vh), 600px)
  
</style>