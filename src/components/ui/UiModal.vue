<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <transition name="overlay">
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="$emit('close')"
    >
      <transition name="modal">
        <div v-if="isOpen" class="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss">
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
.overlay-enter-to,
.overlay-leave-from {
  opacity: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
