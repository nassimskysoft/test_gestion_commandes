<template>
  <v-navigation-drawer absolute permanent right class="drawerNavigation">
    <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-avatar>
          <img
            src="https://media.licdn.com/dms/image/D4D35AQGkltbx7gNxuA/profile-framedphoto-shrink_400_400/0/1676472203528?e=1681657200&v=beta&t=XHqe_jxpVL29Um7EoLnr15ib5uoUrHRtUjITRehZ_IQ"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>Nassim B. (Logisticien)</v-list-item-title>
          <v-list-item-subtitle>Logged In</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        @click="goTo(item.url)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "MenuContent",

  data: () => ({
    items: [
      {
        title: "Liste des commandes",
        icon: "mdi-file-document-multiple-outline",
        url: "/commandes",
      },
      {
        title: "Suivis des expéditions",
        icon: "mdi-truck-delivery",
        url: "/expeditions",
      },
    ],
  }),
  methods: {
    goTo(url) {
      console.log("test ici");
      this.$router.push(url).catch(() => {});
    },
  },
};
</script>
<style>
.drawerNavigation {
  max-width: 99% !important ;
  left: 0 !important;
}
</style>