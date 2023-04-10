<template>
  <div>
    <v-breadcrumbs :items="itemsBreadcrumbs">
      <template v-slot:divider> > </template>
    </v-breadcrumbs>
    <v-alert type="error" dismissible v-if="isError">
      {{ messageError }}
    </v-alert>
    <div class="d-flex">
      <h1>Détail de la commande N° {{ $route.params.commandeId }}</h1>
      <v-spacer></v-spacer>
      <v-text-field
        x-large
        v-model="refProduit"
        :append-outer-icon="
          refProduit ? 'mdi-check-circle-outline' : 'mdi-barcode-scan'
        "
        label="Ajout d'un produit"
        type="text"
        outlined
        @click:append-outer="scannProduct"
      ></v-text-field>
    </div>
    <v-data-table
      :headers="headers"
      :items="commandeProtuisData"
      :items-per-page="5"
      class="elevation-1"
      item-key="id"
    >
      <template v-slot:[`item.qrcode`]="{ item }">
        <img :src="item.qrcode" height="50" widht="50" />
      </template>
      <template v-slot:[`item.state`]="{ item }">
        <v-chip :color="getColorState(item.state)" dark>
          {{ item.state }}
        </v-chip>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-btn
          v-if="item.state === 'à préparer'"
          class="mx-2"
          fab
          dark
          small
          color="primary"
          title="Préparer"
          @click="preparerProduit(item)"
        >
          <v-icon dark> mdi-package-variant </v-icon>
        </v-btn>
        <v-btn
          v-if="item.state === 'préparé'"
          class="mx-2"
          fab
          dark
          small
          color="success"
          title="Préparer"
          @click="mettreEnColis(item)"
        >
          <v-icon dark> mdi-truck-delivery </v-icon>
        </v-btn>
        <v-btn
          v-if="item.state === 'en colis'"
          elevation="2"
          outlined
          raised
          rounded
          color="success"
          @click="openExpedition(item.numSuivi)"
        >
          {{ item.numSuivi }}
          <v-icon dark right> mdi-link-variant </v-icon>
          <v-icon dark right> mdi-truck-delivery </v-icon></v-btn
        >
      </template>
    </v-data-table>
    <hr />
    <v-row justify="center">
      <v-dialog v-model="dialogNewColis" width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Mise en colis</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-if="modeCreationSuivi"
              v-model="colis.refColis"
              outlined
              label="Numéro de suivi/tracking"
            ></v-text-field>
            <v-autocomplete
              v-if="!modeCreationSuivi"
              v-model="colis.refColis"
              :items="colisList"
              item-text="name"
              dense
              outlined
              label="Numéro de suivi/tracking"
            ></v-autocomplete>
            <v-btn
              class="mb-5"
              color="info darken-1"
              text
              style="text-transform: lowercase"
              @click="modeCreationSuivi = !modeCreationSuivi"
            >
              <span v-if="modeCreationSuivi">
                Selectionner un numéro de suivi existant?</span
              >
              <span v-else> Créer un nouveau numéro de suivi</span>
            </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="info darken-1" text @click="dialogNewColis = false">
              Annuler
            </v-btn>
            <v-btn color="success darken-1" text @click="validerColis">
              Valider
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialog" width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Capture du QRCode produit</span>
          </v-card-title>
          <v-card-text>
            <div>
              <qrcode-stream
                v-if="dialog"
                :camera="camera"
                @decode="onDecode"
                @init="onInit"
                style="max-width: 550px"
              >
                <div v-show="showScanConfirmation" class="scan-confirmation">
                  ok
                </div>
              </qrcode-stream>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="info darken-1" text @click="dialog = false">
              Annuler
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { QrcodeStream } from "../../node_modules/vue-qrcode-reader/src";
import axios from "axios";

//const QRCode = require("qrcode");

export default {
  name: "CommandeView",
  components: { QrcodeStream },
  data: () => ({
    modeCreationSuivi: true,
    isError: false,
    colis: {
      refColis: "",
      produit: "",
    },
    colisList: [],
    messageError: "",
    dialogNewColis: false,
    dialog: false,
    camera: "auto",
    result: null,
    showScanConfirmation: false,

    refProduit: "",
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
        text: "QRCode",
        value: "qrcode",
      },
      {
        text: "Produit",
        value: "name",
      },
      {
        text: "Poids",
        value: "poids",
      },
      {
        text: "Status",
        value: "state",
      },
      {
        text: "Action",
        value: "action",
      },
    ],
    commandeProtuisData: [],
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
    async scannProduct() {
      if (this.refProduit === "") {
        this.dialog = true;
      } else {
        axios
          .post(
            `/commandes/${this.$route.params.commandeId}/${this.refProduit}`,
            { name: this.refProduit, poids: 1 }
          )
          .then((response) => {
            if (response.status == 201) {
              this.commandeProtuisData = response.data;
              this.refProduit = "";
            }
          })
          .catch((err) => {
            console.log("err:", err);
            this.isError = true;
            this.messageError = err.response.data.messageError;
          });
      }
    },

    getCommandeProduits() {
      axios
        .get(`/commandes/${this.$route.params.commandeId}`)
        .then((response) => {
          this.commandeProtuisData = response.data;
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
    preparerProduit(row) {
      axios
        .post(`/commandes/prepare/${row.commandeId}/${row.id}`)
        .then((response) => {
          if (response.status == 200) {
            this.commandeProtuisData = response.data;
          }
        })
        .catch((err) => {
          console.log("err:", err);
          this.isError = true;
          this.messageError = err.response.data.messageError;
        });
    },
    mettreEnColis(row) {
      axios
        .get(`/expedition`)
        .then((response) => {
          if (response.status == 200) {
            this.colisList = response.data;
            this.colis.produit = row.id;
            this.dialogNewColis = true;
          }
        })
        .catch((err) => {
          console.log("err:", err);
          this.isError = true;
          this.messageError = err.response.data.messageError;
        });
    },
    validerColis() {
      axios
        .post(
          `/expedition/package/${this.colis.refColis}/${this.colis.produit}`
        )
        .then((response) => {
          if (response.status == 200) {
            this.dialogNewColis = false;
            this.commandeProtuisData = response.data;
          }
        })
        .catch((err) => {
          console.log("err:", err);
          this.isError = true;
          this.messageError = err.response.data.messageError;
        });
    },
    openExpedition(expeditionName) {
      this.$router.push("/expeditions/" + expeditionName);
    },
  },
  mounted() {
    this.itemsBreadcrumbs.push({
      text: "N°" + this.$route.params.commandeId,
      disabled: true,
    });

    this.getCommandeProduits();
  },
};
</script>

<style>
.v-icon.v-icon.v-icon--link {
  font-size: 36px;
  color: #2196f3;
}
</style>