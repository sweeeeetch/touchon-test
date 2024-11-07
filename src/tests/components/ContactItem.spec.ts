import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ContactItem from "@/components/ContactItem.vue";
import type { Contact } from "@/types";

describe("ContactItem.vue", () => {
  const contact: Contact = {
    id: 1,
    name: "John Doe",
    phone: "+1 (123) 456-78-90",
    email: "john@example.com",
  };

  it("displays contact information correctly", () => {
    const wrapper = mount(ContactItem, {
      props: { contact },
    });

    expect(wrapper.text()).toContain(contact.name);
    expect(wrapper.text()).toContain(contact.phone);
    expect(wrapper.text()).toContain(contact.email);
  });

  it('emits "editContact" event with contact when edit button is clicked', async () => {
    const wrapper = mount(ContactItem, {
      props: { contact },
    });

    const editButton = wrapper.findAll("button")[0];
    await editButton.trigger("click");

    expect(wrapper.emitted("editContact")).toBeTruthy();
    expect(wrapper.emitted("editContact")![0]).toEqual([contact]);
  });

  it('emits "deleteContact" event with contact id when delete button is clicked', async () => {
    const wrapper = mount(ContactItem, {
      props: { contact },
    });

    const deleteButton = wrapper.findAll("button")[1];
    await deleteButton.trigger("click");

    expect(wrapper.emitted("deleteContact")).toBeTruthy();
    expect(wrapper.emitted("deleteContact")![0]).toEqual([contact.id]);
  });
});
