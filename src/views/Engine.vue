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
              <v-card outlined class="abtsection pa-4 mx-lg-auto" elevation="14">
                <p class="text-justify">
                   <v-btn @click="eng">Call</v-btn>
    <p>TOKEN: {{ tokenData }} </p>
    <p>ERIC: {{ apiMessage }}</p>
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

<script>

export default {
  name: "external-api",
  data() {
    return {
    };
  },
  methods: {
      
  }
}
</script>