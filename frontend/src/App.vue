<template>
  <v-app>
    <v-container>
      <v-navigation-drawer v-model="drawer" app>
        <MenuContent v-if="drawer" />
      </v-navigation-drawer>

      <v-app-bar app color="blue">
        <v-app-bar-nav-icon
          class="white--text"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title class="white--text">KeyProd</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <!--  -->
        <router-view></router-view>
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
import MenuContent from "./components/MenuContent.vue";
export default {
  name: "App",
  components: {
    MenuContent,
  },

  data: () => ({
    drawer: true,
    //
  }),
};
</script>
