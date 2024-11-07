import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import ContactForm from "@/components/ContactForm.vue";

describe("App.vue", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    vi.spyOn(Storage.prototype, "setItem");
  });

  it("adds a new contact through the UI", async () => {
    const wrapper = mount(App, {
      global: {
        directives: {
          mask: {
            mounted() {},
          },
        },
      },
    });

    const addButton = wrapper.find("button");
    await addButton.trigger("click");

    await wrapper.vm.$nextTick();

    const contactForm = wrapper.findComponent(ContactForm);

    await contactForm.find('input[name="name"]').setValue("John Doe");
    await contactForm.find('input[name="phone"]').setValue("+1 (123) 456-78-90");
    await contactForm.find('input[name="email"').setValue("john@example.com");

    await contactForm.find("form").trigger("submit.prevent");

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).toContain("+1 (123) 456-78-90");
    expect(wrapper.text()).toContain("john@example.com");
  });

  it("filters contacts based on search query", async () => {
    const wrapper = mount(App, {
      global: {
        directives: {
          mask: {
            mounted() {},
          },
        },
      },
    });

    const contacts = [
      { name: "Alice", phone: "+1 (123) 456-78-90", email: "alice@example.com" },
      { name: "Bob", phone: "+1 (987) 654-32-10", email: "bob@example.com" },
    ];

    for (const contact of contacts) {
      await wrapper.find("button").trigger("click");
      await wrapper.vm.$nextTick();

      const contactForm = wrapper.findComponent(ContactForm);
      await contactForm.find('input[name="name"]').setValue(contact.name);
      await contactForm.find('input[name="phone"]').setValue(contact.phone);
      await contactForm.find('input[name="email"').setValue(contact.email);

      await contactForm.find("form").trigger("submit.prevent");
      await wrapper.vm.$nextTick();
    }

    const searchBar = wrapper.findComponent({ name: "SearchBar" });
    await searchBar.find("input").setValue("Alice");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Alice");
    expect(wrapper.text()).not.toContain("Bob");
  });
});
