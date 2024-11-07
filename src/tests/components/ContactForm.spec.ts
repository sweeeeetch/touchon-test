import { describe, it, expect } from "vitest";
import { DOMWrapper, mount } from "@vue/test-utils";
import ContactForm from "@/components/ContactForm.vue";
import type { Contact } from "@/types";

describe("ContactForm.vue", () => {
  it("renders correctly in add mode", () => {
    const wrapper = mount(ContactForm, {
      props: {
        existingContact: null,
      },
    });

    expect(wrapper.find('input[placeholder="Имя"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Телефон"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Email"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe("Добавить");
  });

  it("renders correctly in edit mode", () => {
    const existingContact: Contact = {
      id: 1,
      name: "John Doe",
      phone: "+1 (123) 456-78-90",
      email: "john@example.com",
    };

    const wrapper = mount(ContactForm, {
      props: {
        existingContact,
      },
    });

    const nameInput = wrapper.find('input[name="name"]') as DOMWrapper<HTMLInputElement>;
    const phoneInput = wrapper.find('input[name="phone"]') as DOMWrapper<HTMLInputElement>;
    const emailInput = wrapper.find('input[name="email"]') as DOMWrapper<HTMLInputElement>;

    expect(nameInput.element.value).toBe(existingContact.name);
    expect(phoneInput.element.value).toBe(existingContact.phone);
    expect(emailInput.element.value).toBe(existingContact.email);
    expect(wrapper.find('button[type="submit"]').text()).toBe("Сохранить");
  });

  it("validates required fields", async () => {
    const wrapper = mount(ContactForm, {
      props: {
        existingContact: null,
      },
    });

    await wrapper.find("form").trigger("submit.prevent");

    const errorMessages = wrapper.findAll("p.text-red-500");
    expect(errorMessages.length).toBe(3);
    expect(errorMessages[0].text()).toBe("Имя обязательно для заполнения");
    expect(errorMessages[1].text()).toBe("Телефон обязателен для заполнения");
    expect(errorMessages[2].text()).toBe("Email обязателен для заполнения");
  });

  it('emits "addContact" when valid data is submitted in add mode', async () => {
    const wrapper = mount(ContactForm, {
      props: {
        existingContact: null,
      },
    });

    await wrapper.find('input[name="name"]').setValue("John Doe");
    await wrapper.find('input[name="phone"]').setValue("+1 (123) 456-78-90");
    await wrapper.find('input[name="email"]').setValue("john@example.com");

    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted("addContact")).toBeTruthy();
    const emittedContact = wrapper.emitted("addContact")![0][0] as Contact;
    expect(emittedContact.name).toBe("John Doe");
    expect(emittedContact.phone).toBe("+1 (123) 456-78-90");
    expect(emittedContact.email).toBe("john@example.com");
  });

  it('emits "updateContact" when valid data is submitted in edit mode', async () => {
    const existingContact: Contact = {
      id: 1,
      name: "John Doe",
      phone: "+1 (123) 456-78-90",
      email: "john@example.com",
    };

    const wrapper = mount(ContactForm, {
      props: {
        existingContact,
      },
    });

    await wrapper.find('input[placeholder="Имя"]').setValue("Jane Doe");
    await wrapper.find("form").trigger("submit.prevent");

    expect(wrapper.emitted("updateContact")).toBeTruthy();
    const emittedContact = wrapper.emitted("updateContact")![0][0] as Contact;
    expect(emittedContact.name).toBe("Jane Doe");
    expect(emittedContact.phone).toBe(existingContact.phone);
    expect(emittedContact.email).toBe(existingContact.email);
    expect(emittedContact.id).toBe(existingContact.id);
  });

  it('emits "cancel" when cancel button is clicked', async () => {
    const wrapper = mount(ContactForm, {
      props: {
        existingContact: null,
      },
    });

    await wrapper.find('button[type="button"]').trigger("click");

    expect(wrapper.emitted("cancel")).toBeTruthy();
  });
});
