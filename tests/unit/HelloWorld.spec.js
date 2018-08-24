import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import PizzaCart from '@/components/PizzaCart.vue';


describe('PizzaCart.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(PizzaCart);

		it('renders the correct markup', () => {
			expect(wrapper.html()).toContain('<span class="count">0</span>')
		});

		// it's also easy to check for the existence of elements
		it('has a button', () => {
			expect(wrapper.contains('button')).toBe(true)
		})
  });
});
