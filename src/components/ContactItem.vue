<script setup lang="ts">
import type { Contact } from "@/types";
import EditIconComp from "@/assets/icons/edit.svg";
import DeleteIconComp from "@/assets/icons/delete.svg";

interface ContactItemProps {
  contact: Contact;
}

defineProps<ContactItemProps>();

defineEmits<{
  (e: "editContact", contact: Contact): void;
  (e: "deleteContact", id: number): void;
}>();
</script>

<template>
  <li class="flex items-center justify-between border p-2 rounded">
    <div>
      <p class="font-semibold">{{ contact.name }}</p>
      <p class="text-sm text-gray-600">{{ contact.phone }} | {{ contact.email }}</p>
    </div>
    <div class="flex space-x-2">
      <button
        @click="$emit('editContact', contact)"
        class="group text-white px-2 py-2 rounded-full outline-1 hover:outline hover:outline-yellow-500 transition-all"
      >
        <EditIconComp width="22" height="22" class="fill-yellow-500 transition-all" />
      </button>
      <button
        @click="$emit('deleteContact', contact.id)"
        class="group text-white px-2 py-2 rounded-full outline-1 hover:outline hover:outline-red-500 transition-all"
      >
        <DeleteIconComp width="22" height="22" class="fill-red-500 transition-all" />
      </button>
    </div>
  </li>
</template>

<style lang="scss"></style>
