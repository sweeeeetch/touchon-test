<script setup lang="ts">
import type { Contact } from "@/types";
import ContactItem from "./ContactItem.vue";

interface ContactListProps {
  contacts: Contact[];
}

defineProps<ContactListProps>();

defineEmits<{
  (e: "deleteContact", id: number): void;
  (e: "editContact", contact: Contact): void;
}>();
</script>

<template>
  <transition-group name="list" tag="ul" class="space-y-2">
    <ContactItem
      v-for="contact in contacts"
      :key="contact.id"
      :contact="contact"
      @deleteContact="$emit('deleteContact', contact.id)"
      @editContact="$emit('editContact', contact)"
    />
  </transition-group>
</template>

<style lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-enter-to,
.list-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
