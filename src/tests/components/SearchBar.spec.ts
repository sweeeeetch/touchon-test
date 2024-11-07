import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SearchBar from "@/components/SearchBar.vue";

describe("SearchBar.vue", () => {
  it('emits "search" event with input value when user types', async () => {
    const wrapper = mount(SearchBar);

    const input = wrapper.find("input");
    await input.setValue("John Doe");

    expect(wrapper.emitted("search")).toBeTruthy();
    expect(wrapper.emitted("search")![0]).toEqual(["John Doe"]);
  });
});
