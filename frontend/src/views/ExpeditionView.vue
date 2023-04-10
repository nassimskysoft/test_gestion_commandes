<template>
  <div>
    <v-breadcrumbs :items="itemsBreadcrumbs">
      <template v-slot:divider> > </template>
    </v-breadcrumbs>

    <div class="d-flex">
      <h1>Détail de l'expédition {{ $route.params.expeditionId }}</h1>
    </div>
    <v-data-table
      :headers="headers"
      :items="expeditionProduitsData"
      :items-per-page="5"
      class="elevation-1"
      item-key="id"
    >
      <template v-slot:[`item.commandeId`]="{ item }">
        <v-btn
          outlined
          raised
          rounded
          color="info"
          tite="Aller à la fiche commande"
          @click="openCommande(item.commandeId)"
          >{{ item.commandeId }}</v-btn
        >
      </template>

      <template v-slot:[`item.state`]="{ item }">
        <v-chip :color="getColorState(item.state)" dark>
          {{ item.state }}
        </v-chip>
      </template>
    </v-data-table>
    <hr />
  </div>
</template>

<script>
import axios from "axios";

//const QRCode = require("qrcode");

export default {
  name: "ExpeditionView",
  data: () => ({
    isError: false,

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
        text: "Produit",
        value: "name",
      },
      {
        text: "N° commande",
        value: "commandeId",
      },
      {
        text: "Status",
        value: "state",
      },
    ],
    expeditionProduitsData: [],
  }),
  computed: {},
  methods: {
    async onInit(promise) {
      try {
        await promise;
      } catch (e) {
        console.error(e);
      } finally {
        this.showScanConfirmation = this.camera === "off";
      }
    },

    async onDecode(content) {
      this.dialog = false;
      this.refProduit = content;

      this.pause();
      await this.timeout(500);
      this.unpause();
    },

    unpause() {
      this.camera = "auto";
    },

    pause() {
      this.camera = "off";
    },

    timeout(ms) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });
    },

    getExpeditionProduits() {
      axios
        .get(`/expedition/${this.$route.params.expeditionId}`)
        .then((response) => {
          this.expeditionProduitsData = response.data;
        })
        .catch();
    },

    getColorState(state) {
      switch (state) {
        case "à préparer":
          return "orange";
        case "préparé":
          return "blue";
        case "en colis":
          return "success";
      }
    },

    openCommande(commandeId) {
      this.$router.push("/commandes/" + commandeId);
    },
  },
  mounted() {
    this.itemsBreadcrumbs.push({
      text: this.$route.params.expeditionId,
      disabled: true,
    });

    this.getExpeditionProduits();
  },
};
</script>

<style>
.v-icon.v-icon.v-icon--link {
  font-size: 36px;
  color: #2196f3;
}
</style>