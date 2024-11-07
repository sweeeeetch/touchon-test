<script setup lang="ts">
import type { Contact } from "@/types";
import { ref, watch, computed } from "vue";

interface ContactFormProps {
  existingContact: Contact | null;
}

const props = defineProps<ContactFormProps>();

const emit = defineEmits<{
  (e: "addContact", contact: Contact): void;
  (e: "updateContact", contact: Contact): void;
  (e: "cancel"): void;
}>();

const contact = ref<Contact>(
  props.existingContact
    ? { ...props.existingContact }
    : { id: Date.now(), name: "", phone: "", email: "" },
);

const errors = ref<{ [key: string]: string }>({
  name: "",
  phone: "",
  email: "",
});

const isEdit = computed(() => !!props.existingContact);

const onSubmit = () => {
  let isValid = true;

  errors.value = {
    name: "",
    phone: "",
    email: "",
  };

  if (!contact.value.name.trim()) {
    errors.value.name = "Имя обязательно для заполнения";
    isValid = false;
  }

  if (!contact.value.phone.trim()) {
    errors.value.phone = "Телефон обязателен для заполнения";
    isValid = false;
  } else if (!/^\+\d{1} \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(contact.value.phone)) {
    errors.value.phone = "Введите корректный номер телефона";
    isValid = false;
  }

  if (!contact.value.email.trim()) {
    errors.value.email = "Email обязателен для заполнения";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value.email)) {
    errors.value.email = "Введите валидный Email";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  if (isEdit.value) {
    emit("updateContact", contact.value);
  } else {
    emit("addContact", contact.value);
  }
};

const clearError = (field: string) => {
  errors.value[field] = "";
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="flex flex-col gap-4">
      <div>
        <input
          v-model="contact.name"
          name="name"
          type="text"
          placeholder="Имя"
          :class="['border p-2 rounded w-full', errors.name ? 'border-red-500' : 'border-gray-300']"
          @focus="clearError('name')"
        />
        <p v-if="errors.name" class="text-red-500 text-sm">
          {{ errors.name }}
        </p>
      </div>
      <div>
        <input
          v-mask="'+9 (999) 999-99-99'"
          v-model="contact.phone"
          name="phone"
          type="tel"
          placeholder="Телефон"
          :class="[
            'border p-2 rounded w-full',
            errors.phone ? 'border-red-500' : 'border-gray-300',
          ]"
          @focus="clearError('phone')"
        />
        <p v-if="errors.phone" class="text-red-500 text-sm">
          {{ errors.phone }}
        </p>
      </div>
      <div>
        <input
          v-model="contact.email"
          placeholder="Email"
          name="email"
          :class="[
            'border p-2 rounded w-full',
            errors.email ? 'border-red-500' : 'border-gray-300',
          ]"
          @focus="clearError('email')"
        />
        <p v-if="errors.email" class="text-red-500 text-sm">
          {{ errors.email }}
        </p>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <button
        type="button"
        class="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        @click="$emit('cancel')"
      >
        Отмена
      </button>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {{ isEdit ? "Сохранить" : "Добавить" }}
      </button>
    </div>
  </form>
</template>
