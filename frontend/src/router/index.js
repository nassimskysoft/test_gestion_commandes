import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CommandesView from '../views/CommandesView.vue';
import ExpeditionsView from '../views/ExpeditionsView.vue';
import ExpeditionView from '../views/ExpeditionView.vue';
import CommandeView from '../views/CommandeView.vue';
//import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(VueRouter);
//Vue.use(Vuetify);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/commandes',
    name: 'commandes',
    component: CommandesView,
  },
  {
    path: '/expeditions/:expeditionId',
    name: 'expedition',
    component: ExpeditionView,
  },
  {
    path: '/expeditions',
    name: 'expeditions',
    component: ExpeditionsView,
  },
  {
    path: '/commandes/:commandeId',
    name: 'commande',
    component: CommandeView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
