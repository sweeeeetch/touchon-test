<script setup lang="ts">
import { ref } from "vue";

defineEmits<{
  (e: "search", query: string): void;
}>();

const searchQuery = ref("");
</script>

<template>
  <input
    type="text"
    placeholder="Поиск по имени"
    v-model="searchQuery"
    @input="$emit('search', searchQuery)"
    class="border p-2 w-full rounded-md"
  />
</template>

<style lang="scss"></style>
