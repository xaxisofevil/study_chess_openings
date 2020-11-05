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
                   <v-btn @click="requestAPI">Call</v-btn>
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
import axios from "axios";

export default {
  name: "external-api",
  data() {
    return {
      apiMessage: "",
      tokenData: ""
    };
  },
  methods: {
    /*
    getline() {
      axios
      .get('https://www.studychessopenings.com/api.php/records/openings?filter=opening_id,eq,1')
      .then(response => {
        this.wholeResponse = response.data
        this.loading = false
        return this.wholeResponse
      })
      .catch(error => {
        console.log(error)
      })
    },





    */
   async callApi() {
      console.log("eric")
      // Get the access token from the auth wrapper
      const token = await this.$auth.getTokenSilently();
      this.tokenData = token;

      // Use Axios to make a call to the API
      const { data } = await axios.get('https://www.studychessopenings.com/api.php/records/openings', {
        headers: { //{'X-Authorization': `Bearer ${token}`}
          'X-Authorization': `Bearer ${token}`    // send the access token through the 'Authorization' header
        }
      })
      .catch(error => {
        this.apiMessage = error
      });

      this.apiMessage = data;

    },
    requestAPI() {
        var authUrl = 'https://dev-yi20u1qo.us.auth0.com/authorize'; // url of auth0 '/authorize' end-point
        var clientId = 'BfGQP1U2kxkJjieT7uJ78FfqLW4oZctB'; // client id as defined in auth0
        var audience = 'https://studychessopenings.com/api.php'; // api audience as defined in auth0
        var url = '/api.php/records/';
        var match = RegExp('[#&]access_token=([^&]*)').exec(window.location.hash);
        var accessToken = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        
        if (!accessToken) {
          document.location = authUrl+'?audience='+audience+'&response_type=token&client_id='+clientId+'&redirect_uri='+document.location.href;
        } else {
            document.location.hash = '';
            var req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState==4) {
                    console.log(req.responseText);
                    try {
                        document.getElementById('output').innerHTML = JSON.stringify(JSON.parse(req.responseText), undefined, 4);
                    } catch (error) {
                        document.getElementById('output').innerHTML = req.responseText;
                    }
                }
            }
            console.log(1)
            req.open("GET", url, true);
            req.setRequestHeader('X-Authorization', 'Bearer '+accessToken);
            req.send();
            this.apiMessage = req
            console.log(req)
        }
      
    }
  }
};
</script>