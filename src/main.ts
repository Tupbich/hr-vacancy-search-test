import Vue from "vue";
import map from "./components/Map/Map.vue";
import "./quasar";

Vue.config.productionTip = false;

new Vue({
  render: h => h(map),
}).$mount("#app");
