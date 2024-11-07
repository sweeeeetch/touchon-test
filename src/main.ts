import "./assets/scss/style.scss";

import { createApp } from "vue";
import App from "./App.vue";
import { maskMounted } from "@/utils";

const app = createApp(App);

app.directive("mask", {
  mounted: maskMounted,
  unmounted(el) {
    el.removeEventListener("input", el._onInput);
    el.removeEventListener("paste", el._onPaste);
  },
});

app.mount("#app");
