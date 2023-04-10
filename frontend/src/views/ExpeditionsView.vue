<template>
  <div>
    <v-breadcrumbs :items="itemsBreadcrumbs">
      <template v-slot:divider> > </template>
    </v-breadcrumbs>
    <h1>Liste des expeditions</h1>
    <v-text-field
      v-model="search"
      label="Rechercher un Numéro de suivi/tracking..."
      class="my-5"
      outlined
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="expeditionsData"
      :items-per-page="5"
      :search="search"
      class="elevation-1"
      item-key="id"
      @click:row="openExpedition"
    >
      <template v-slot:top> </template>

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
  name: "ExpeditionsView",
  data: () => ({
    search: "",
    itemsBreadcrumbs: [
      {
        text: "Dashboard",
        disabled: false,
        href: "/",
      },
      {
        text: "Expeditions",
        disabled: false,
        href: "/expeditions",
      },
    ],

    headers: [
      {
        text: "id",
        value: "id",
      },
      {
        text: "Expédition",
        value: "name",
      },
      { text: "Status", value: "state" },
    ],
    expeditionsData: [],
  }),
  methods: {
    getAllExpeditions() {
      axios
        .get(`/expedition`)
        .then((response) => {
          this.expeditionsData = response.data;
        })
        .catch();
    },
    getColorState(state) {
      switch (state) {
        case "en cours":
          return "orange";
        case "livré":
          return "green";
      }
    },
    openExpedition(row) {
      this.$router.push("/expeditions/" + row.name);
    },
  },
  mounted() {
    this.getAllExpeditions();
  },
};
</script>

<style>
</style>