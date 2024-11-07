import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ContactList from "@/components/ContactList.vue";
import ContactItem from "@/components/ContactItem.vue";
import type { Contact } from "@/types";

describe("ContactList.vue", () => {
  const contacts: Contact[] = [
    { id: 1, name: "John Doe", phone: "+1 (123) 456-78-90", email: "john@example.com" },
    { id: 2, name: "Jane Smith", phone: "+1 (987) 654-32-10", email: "jane@example.com" },
  ];

  it("renders a ContactItem for each contact", () => {
    const wrapper = mount(ContactList, {
      props: { contacts },
    });

    const contactItems = wrapper.findAllComponents(ContactItem);
    expect(contactItems.length).toBe(contacts.length);
  });

  it('emits "deleteContact" event when a ContactItem emits "deleteContact"', async () => {
    const wrapper = mount(ContactList, {
      props: { contacts },
    });

    const contactItem = wrapper.findComponent(ContactItem);
    await contactItem.vm.$emit("deleteContact", contacts[0].id);

    expect(wrapper.emitted("deleteContact")).toBeTruthy();
    expect(wrapper.emitted("deleteContact")![0]).toEqual([contacts[0].id]);
  });

  it('emits "editContact" event when a ContactItem emits "editContact"', async () => {
    const wrapper = mount(ContactList, {
      props: { contacts },
    });

    const contactItem = wrapper.findComponent(ContactItem);
    await contactItem.vm.$emit("editContact", contacts[0]);

    expect(wrapper.emitted("editContact")).toBeTruthy();
    expect(wrapper.emitted("editContact")![0]).toEqual([contacts[0]]);
  });
});
