<template>
  <div>
    <v-breadcrumbs :items="itemsBreadcrumbs">
      <template v-slot:divider> > </template>
    </v-breadcrumbs>

    <h1>Liste des commandes</h1>
    <v-data-table
      :headers="headers"
      :items="commandesData"
      :items-per-page="5"
      class="elevation-1"
      item-key="id"
      @click:row="openCommande"
    >
      <template v-slot:[`item.state`]="{ item }">
        <v-chip :color="getColorState(item.state)" dark>
          {{ item.state }}
        </v-chip></template
      >
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CommadnesView",
  data: () => ({
    itemsBreadcrumbs: [
      {
        text: "Dashboard",
        disabled: false,
        href: "/",
      },
      {
        text: "Commandes",
        disabled: false,
        href: "/commandes",
      },
    ],

    headers: [
      {
        text: "id",
        value: "id",
      },
      {
        text: "Commande",
        value: "name",
      },
      { text: "Status", value: "state" },
    ],
    commandesData: [],
  }),
  methods: {
    getAllCommandes() {
      axios
        .get(`/commandes`)
        .then((response) => {
          console.log("response", response);
          this.commandesData = response.data;
        })
        .catch();
    },
    getColorState(state) {
      switch (state) {
        case "à traiter":
          return "blue";
        case "livrée partiellement":
          return "orange";
        case "livrée":
          return "green";
      }
    },
    openCommande(row) {
      this.$router.push("/commandes/" + row.id);
    },
  },
  mounted() {
    this.getAllCommandes();
  },
};
</script>

<style>
tr {
  cursor: pointer;
}
</style>