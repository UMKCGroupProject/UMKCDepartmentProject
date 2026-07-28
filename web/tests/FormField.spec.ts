import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import FormField from '@/components/FormField.vue';

/**
 * Guards the accessibility fix: every input in the old app had for="" on its
 * label, so none were announced or clickable.
 */
describe('FormField', () => {
  function mountField(props: Record<string, unknown> = {}) {
    return mount(FormField, {
      props: { label: 'Email', ...props },
      slots: {
        default: (slotProps: { id: string; describedBy?: string }) =>
          h('input', {
            id: slotProps.id,
            'aria-describedby': slotProps.describedBy,
          }),
      },
    });
  }

  it('wires the label to the control', () => {
    const wrapper = mountField();
    const forAttr = wrapper.get('label').attributes('for');
    const inputId = wrapper.get('input').attributes('id');

    expect(forAttr).toBeTruthy();
    expect(forAttr).toBe(inputId);
  });

  it('gives sibling fields distinct ids within the same app', () => {
    // Mounted together, as they are on a real form. useId() counts per app
    // instance, so two independent mount() calls would each restart at v-0.
    const wrapper = mount({
      components: { FormField },
      template: `
        <form>
          <FormField label="Email" v-slot="{ id }"><input :id="id" /></FormField>
          <FormField label="Password" v-slot="{ id }"><input :id="id" /></FormField>
        </form>
      `,
    });

    const ids = wrapper.findAll('input').map((i) => i.attributes('id'));
    const fors = wrapper.findAll('label').map((l) => l.attributes('for'));

    expect(new Set(ids).size).toBe(2);
    expect(fors).toEqual(ids);
  });

  it('renders no error by default', () => {
    const wrapper = mountField();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });

  it('renders an error and points aria-describedby at it', () => {
    const wrapper = mountField({ error: 'Email is required' });
    const alert = wrapper.get('[role="alert"]');

    expect(alert.text()).toBe('Email is required');
    expect(wrapper.get('input').attributes('aria-describedby')).toContain(
      alert.attributes('id'),
    );
  });

  it('marks a required field', () => {
    expect(mountField({ required: true }).get('label').text()).toContain('*');
  });
});
