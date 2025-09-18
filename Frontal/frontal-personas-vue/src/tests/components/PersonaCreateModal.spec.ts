import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import PersonaCreateModal from '../../../src/components/personas/PersonaCreateModal.vue';

// Mock de FontAwesome
vi.mock('@fortawesome/fontawesome-free', () => ({}));

describe('PersonaCreateModal - Pruebas básicas', () => {
  let wrapper: any;

  beforeEach(() => {
    // Configurar Pinia
    setActivePinia(createPinia());

    // Montar el componente
    wrapper = mount(PersonaCreateModal, {
      props: {
        isVisible: true
      },
      global: {
        plugins: [createPinia()]
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  describe('Inicialización', () => {
    it('debería crear el componente correctamente', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('debería mostrar el modal cuando isVisible es true', () => {
      const modal = wrapper.find('.modal-overlay');
      expect(modal.exists()).toBe(true);
      expect(modal.isVisible()).toBe(true);
    });

    it('debería ocultar el modal cuando isVisible es false', async () => {
      await wrapper.setProps({ isVisible: false });
      
      const modal = wrapper.find('.modal-overlay');
      expect(modal.exists()).toBe(false);
    });

    it('debería mostrar el título correcto', () => {
      const title = wrapper.find('h2');
      expect(title.text()).toBe('Nueva Persona');
    });

    it('debería mostrar todos los campos del formulario', () => {
      expect(wrapper.find('#nombre').exists()).toBe(true);
      expect(wrapper.find('#dni').exists()).toBe(true);
      expect(wrapper.find('#email').exists()).toBe(true);
      expect(wrapper.find('#edad').exists()).toBe(true);
    });

    it('debería mostrar botones de acción', () => {
      const cancelButton = wrapper.find('button[type="button"]');
      const submitButton = wrapper.find('button[type="submit"]');
      
      expect(cancelButton.exists()).toBe(true);
      expect(submitButton.exists()).toBe(true);
      expect(cancelButton.text()).toContain('Cancelar');
      expect(submitButton.text()).toContain('Crear Persona');
    });
  });

  describe('Interacciones básicas', () => {
    it('debería emitir evento closeModal al hacer clic en Cancelar', async () => {
      const cancelButton = wrapper.find('button[type="button"]');
      await cancelButton.trigger('click');
      
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });

    it('debería emitir evento closeModal al hacer clic en X', async () => {
      const closeButton = wrapper.find('.close-button');
      await closeButton.trigger('click');
      
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });

    it('debería emitir evento closeModal al hacer clic fuera del modal', async () => {
      const modalOverlay = wrapper.find('.modal-overlay');
      await modalOverlay.trigger('click');
      
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });

    it('no debería emitir evento closeModal al hacer clic dentro del modal', async () => {
      const modalContent = wrapper.find('.modal-content');
      await modalContent.trigger('click');
      
      expect(wrapper.emitted('closeModal')).toBeFalsy();
    });

    it('debería poder escribir en los campos de formulario', async () => {
      const nombreInput = wrapper.find('#nombre');
      const dniInput = wrapper.find('#dni');
      const emailInput = wrapper.find('#email');
      const edadInput = wrapper.find('#edad');
      
      await nombreInput.setValue('Juan Test');
      await dniInput.setValue('12345678A');
      await emailInput.setValue('juan@test.com');
      await edadInput.setValue('30');
      
      expect(nombreInput.element.value).toBe('Juan Test');
      expect(dniInput.element.value).toBe('12345678A');
      expect(emailInput.element.value).toBe('juan@test.com');
      expect(edadInput.element.value).toBe('30');
    });
  });

  describe('Formulario', () => {
    it('debería limpiar campos al cerrar y reabrir el modal', async () => {
      // Llenar campos
      await wrapper.find('#nombre').setValue('Juan Test');
      await wrapper.find('#email').setValue('juan@test.com');
      
      // Cerrar modal
      await wrapper.setProps({ isVisible: false });
      await wrapper.vm.$nextTick();
      
      // Reabrir modal
      await wrapper.setProps({ isVisible: true });
      await wrapper.vm.$nextTick();
      
      // Los campos deberían estar limpios
      expect(wrapper.find('#nombre').element.value).toBe('');
      expect(wrapper.find('#email').element.value).toBe('');
    });

    it('debería tener placeholders informativos', () => {
      expect(wrapper.find('#nombre').attributes('placeholder')).toBe('Ingrese el nombre completo');
      expect(wrapper.find('#dni').attributes('placeholder')).toBe('Ej: 12345678A');
      expect(wrapper.find('#email').attributes('placeholder')).toBe('ejemplo@correo.com');
      expect(wrapper.find('#edad').attributes('placeholder')).toBe('Edad en años');
    });
  });

  describe('Accesibilidad', () => {
    it('debería tener labels asociados a los inputs', () => {
      const nombreInput = wrapper.find('#nombre');
      const nombreLabel = wrapper.find('label[for="nombre"]');
      
      expect(nombreInput.exists()).toBe(true);
      expect(nombreLabel.exists()).toBe(true);
      expect(nombreLabel.text()).toContain('Nombre');
    });

    it('debería tener atributos de accesibilidad en los inputs', () => {
      const nombreInput = wrapper.find('#nombre');
      const edadInput = wrapper.find('#edad');
      
      expect(nombreInput.attributes('type')).toBe('text');
      expect(edadInput.attributes('type')).toBe('number');
      expect(edadInput.attributes('min')).toBe('1');
      expect(edadInput.attributes('max')).toBe('119');
    });

    it('debería mostrar campos requeridos con asterisco', () => {
      const labels = wrapper.findAll('label');
      labels.forEach(label => {
        expect(label.text()).toContain('*');
      });
    });
  });

  describe('Estructura del formulario', () => {
    it('debería usar el componente Form de VeeValidate', () => {
      const form = wrapper.find('form');
      expect(form.exists()).toBe(true);
    });

    it('debería tener todos los campos requeridos', () => {
      const requiredFields = ['nombre', 'dni', 'email', 'edad'];
      
      requiredFields.forEach(field => {
        const input = wrapper.find(`#${field}`);
        expect(input.exists()).toBe(true);
      });
    });

    it('debería mostrar el botón de envío', () => {
      const submitButton = wrapper.find('button[type="submit"]');
      expect(submitButton.exists()).toBe(true);
      expect(submitButton.text()).toContain('Crear Persona');
    });
  });
});
