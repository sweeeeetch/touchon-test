<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import SearchBar from "./components/SearchBar.vue";
import ContactForm from "./components/ContactForm.vue";
import ContactList from "./components/ContactList.vue";
import Modal from "./components/ui/UiModal.vue";
import type { Contact } from "@/types";

const contacts = ref<Contact[]>([]);
const searchQuery = ref("");
const contactToEdit = ref<Contact | null>(null);
const isModalOpen = ref(false);

const filteredContacts = computed(() =>
  contacts.value.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
);
const isEditMode = computed(() => contactToEdit.value !== null);

const loadContacts = () => {
  const savedContacts = localStorage.getItem("contacts");
  if (savedContacts) {
    contacts.value = JSON.parse(savedContacts);
  }
};

const saveContacts = () => localStorage.setItem("contacts", JSON.stringify(contacts.value));

const addContact = (contact: Contact) => {
  contacts.value.push(contact);
  saveContacts();
  closeModal();
};

const updateContact = (updatedContact: Contact) => {
  const index = contacts.value.findIndex((contact) => contact.id === updatedContact.id);
  if (index !== -1) {
    contacts.value[index] = updatedContact;
    saveContacts();
  }
  closeModal();
};

const deleteContact = (id: number) => {
  contacts.value = contacts.value.filter((contact) => contact.id !== id);
  saveContacts();
};

const startEditing = (contact: Contact) => {
  contactToEdit.value = contact;
  isModalOpen.value = true;
};

const openAddModal = () => {
  contactToEdit.value = null;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

onMounted(() => {
  loadContacts();
});
</script>

<template>
  <div id="app" class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 text-center">Управление контактами</h1>
    <div class="flex justify-between gap-4 mb-4">
      <SearchBar @search="handleSearch" />
      <button
        @click="openAddModal"
        class="bg-blue-500 min-w-fit text-white rounded-lg hover:bg-blue-600 h-full py-2.5 px-4"
      >
        Добавить +
      </button>
    </div>

    <transition name="fade" mode="out-in">
      <ContactList
        v-if="filteredContacts.length > 0"
        :contacts="filteredContacts"
        @deleteContact="deleteContact"
        @editContact="startEditing"
      />
      <h3 v-else-if="searchQuery" class="text-xl mt-8 text-center">Контакты не найдены</h3>
      <h3 v-else class="text-xl mt-8 text-center">Контакты отсутствуют</h3>
    </transition>

    <Modal :is-open="isModalOpen" @close="closeModal">
      <h2 class="text-xl font-bold mb-4">
        {{ isEditMode ? "Редактировать контакт" : "Добавить контакт" }}
      </h2>
      <ContactForm
        :existingContact="contactToEdit"
        @addContact="addContact"
        @updateContact="updateContact"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
