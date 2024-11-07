import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import UiModal from "@/components/ui/UiModal.vue";

describe("UiModal.vue", () => {
  it("renders content when isOpen is true", () => {
    const wrapper = mount(UiModal, {
      props: {
        isOpen: true,
      },
      slots: {
        default: '<div class="modal-content">Modal Content</div>',
      },
    });

    expect(wrapper.find(".modal-content").exists()).toBe(true);
  });

  it("does not render content when isOpen is false", () => {
    const wrapper = mount(UiModal, {
      props: {
        isOpen: false,
      },
      slots: {
        default: '<div class="modal-content">Modal Content</div>',
      },
    });

    expect(wrapper.find(".modal-content").exists()).toBe(false);
  });

  it('emits "close" event when overlay is clicked', async () => {
    const wrapper = mount(UiModal, {
      props: {
        isOpen: true,
      },
      slots: {
        default: '<div class="modal-content">Modal Content</div>',
      },
    });

    await wrapper.find(".fixed.inset-0").trigger("click.self");

    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
