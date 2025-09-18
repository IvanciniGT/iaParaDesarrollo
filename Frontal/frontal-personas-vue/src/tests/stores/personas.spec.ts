import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePersonasStore } from '../../../src/stores/personas';

describe('usePersonasStore - Pruebas básicas', () => {
  let store: ReturnType<typeof usePersonasStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = usePersonasStore();
    vi.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('debería tener el estado inicial correcto', () => {
      expect(store.personas).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('Getters', () => {
    it('debería devolver el número correcto de personas', () => {
      expect(store.personasCount).toBe(0);
      
      // Agregar personas manualmente para probar
      store.personas.push(
        { id: '1', nombre: 'Juan', dni: '123A', email: 'juan@test.com', edad: 30 },
        { id: '2', nombre: 'María', dni: '456B', email: 'maria@test.com', edad: 25 }
      );
      
      expect(store.personasCount).toBe(2);
    });

    it('debería obtener persona por ID', () => {
      const persona = { id: '1', nombre: 'Juan', dni: '123A', email: 'juan@test.com', edad: 30 };
      store.personas.push(persona);
      
      const encontrada = store.getPersonaById('1');
      expect(encontrada).toEqual(persona);
    });

    it('debería devolver undefined si la persona no existe', () => {
      const encontrada = store.getPersonaById('999');
      expect(encontrada).toBeUndefined();
    });

    it('debería devolver personas ordenadas alfabéticamente', () => {
      store.personas.push(
        { id: '1', nombre: 'Zoe', dni: '123A', email: 'zoe@test.com', edad: 30 },
        { id: '2', nombre: 'Ana', dni: '456B', email: 'ana@test.com', edad: 25 }
      );
      
      const ordenadas = store.personasOrdenadas;
      expect(ordenadas[0].nombre).toBe('Ana');
      expect(ordenadas[1].nombre).toBe('Zoe');
    });
  });

  describe('Utilidades', () => {
    it('debería limpiar errores', () => {
      store.error = 'Error de prueba';
      
      store.limpiarError();
      
      expect(store.error).toBeNull();
    });

    it('debería resetear el estado', () => {
      store.personas.push({ id: '1', nombre: 'Juan', dni: '123A', email: 'juan@test.com', edad: 30 });
      store.isLoading = true;
      store.error = 'Error de prueba';
      
      store.resetearEstado();
      
      expect(store.personas).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('Reactividad', () => {
    it('debería ser reactivo a cambios en personas', () => {
      const initialCount = store.personasCount;
      
      store.personas.push({ id: '1', nombre: 'Juan', dni: '123A', email: 'juan@test.com', edad: 30 });
      
      expect(store.personasCount).toBe(initialCount + 1);
    });

    it('debería ser reactivo a cambios en estado de carga', () => {
      expect(store.isLoading).toBe(false);
      
      store.isLoading = true;
      
      expect(store.isLoading).toBe(true);
    });

    it('debería ser reactivo a cambios en errores', () => {
      expect(store.error).toBeNull();
      
      store.error = 'Nuevo error';
      
      expect(store.error).toBe('Nuevo error');
    });
  });
});

describe('usePersonasStore', () => {
  let store: ReturnType<typeof usePersonasStore>;

  const mockPersonas: Persona[] = [
    { id: '1', nombre: 'Juan', dni: '123A', email: 'juan@test.com', edad: 30 },
    { id: '2', nombre: 'María', dni: '456B', email: 'maria@test.com', edad: 25 }
  ];

  const nuevaPersonaMock: NuevaPersona = {
    nombre: 'Pedro',
    dni: '789C',
    email: 'pedro@test.com',
    edad: 35
  };

  const personaCreada: Persona = {
    id: '3',
    ...nuevaPersonaMock
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    store = usePersonasStore();
    vi.clearAllMocks();
  });

  describe('Estado inicial', () => {
    it('debería tener el estado inicial correcto', () => {
      expect(store.personas).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('cargarPersonas', () => {
    it('debería cargar personas exitosamente', async () => {
      vi.mocked(mockPersonasService.getAll).mockResolvedValue(mockPersonas);

      await store.cargarPersonas();

      expect(store.personas).toEqual(mockPersonas);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
      expect(mockPersonasService.getAll).toHaveBeenCalledTimes(1);
    });

    it('debería manejar errores al cargar personas', async () => {
      const errorMessage = 'Error al cargar';
      vi.mocked(mockPersonasService.getAll).mockRejectedValue(new Error(errorMessage));

      await store.cargarPersonas();

      expect(store.personas).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBe('Error al cargar personas');
      expect(mockPersonasService.getAll).toHaveBeenCalledTimes(1);
    });

    it('debería establecer isLoading durante la carga', async () => {
      let resolvePromise: (value: Persona[]) => void;
      const promise = new Promise<Persona[]>(resolve => {
        resolvePromise = resolve;
      });
      
      vi.mocked(mockPersonasService.getAll).mockReturnValue(promise);

      const loadPromise = store.cargarPersonas();
      
      // Durante la carga
      expect(store.isLoading).toBe(true);

      // Resolver la promesa
      resolvePromise!(mockPersonas);
      await loadPromise;

      // Después de la carga
      expect(store.isLoading).toBe(false);
    });
  });

  describe('crearPersona', () => {
    it('debería crear una persona exitosamente', async () => {
      vi.mocked(mockPersonasService.create).mockResolvedValue(personaCreada);
      store.personas = [...mockPersonas];

      const resultado = await store.crearPersona(nuevaPersonaMock);

      expect(resultado).toEqual(personaCreada);
      expect(store.personas).toContain(personaCreada);
      expect(store.personas.length).toBe(mockPersonas.length + 1);
      expect(store.error).toBeNull();
      expect(mockPersonasService.create).toHaveBeenCalledWith(nuevaPersonaMock);
    });

    it('debería manejar errores al crear persona', async () => {
      vi.mocked(mockPersonasService.create).mockResolvedValue(null as any);
      store.personas = [...mockPersonas];

      const resultado = await store.crearPersona(nuevaPersonaMock);

      expect(resultado).toBeNull();
      expect(store.personas).toEqual(mockPersonas); // No debería cambiar
      expect(store.error).toBe('Error al crear la persona');
    });

    it('debería manejar excepciones al crear persona', async () => {
      vi.mocked(mockPersonasService.create).mockRejectedValue(new Error('Error del servidor'));
      store.personas = [...mockPersonas];

      const resultado = await store.crearPersona(nuevaPersonaMock);

      expect(resultado).toBeNull();
      expect(store.personas).toEqual(mockPersonas); // No debería cambiar
      expect(store.error).toBe('Error al crear persona');
    });
  });

  describe('actualizarPersona', () => {
    const datosModificar: ModificarPersona = {
      nombre: 'Juan Modificado',
      dni: '123A',
      email: 'juan.modificado@test.com',
      edad: 31
    };

    const personaActualizada: Persona = {
      id: '1',
      ...datosModificar
    };

    beforeEach(() => {
      store.personas = [...mockPersonas];
    });

    it('debería actualizar una persona exitosamente', async () => {
      vi.mocked(mockPersonasService.update).mockResolvedValue(personaActualizada);

      const resultado = await store.actualizarPersona('1', datosModificar);

      expect(resultado).toEqual(personaActualizada);
      expect(store.personas[0]).toEqual(personaActualizada);
      expect(store.error).toBeNull();
      expect(mockPersonasService.update).toHaveBeenCalledWith('1', datosModificar);
    });

    it('debería manejar errores al actualizar persona', async () => {
      vi.mocked(mockPersonasService.update).mockResolvedValue(null);
      const personasOriginales = [...store.personas];

      const resultado = await store.actualizarPersona('1', datosModificar);

      expect(resultado).toBeNull();
      expect(store.personas).toEqual(personasOriginales); // No debería cambiar
      expect(store.error).toBe('Error al actualizar la persona');
    });

    it('debería manejar excepciones al actualizar persona', async () => {
      vi.mocked(mockPersonasService.update).mockRejectedValue(new Error('Error del servidor'));
      const personasOriginales = [...store.personas];

      const resultado = await store.actualizarPersona('1', datosModificar);

      expect(resultado).toBeNull();
      expect(store.personas).toEqual(personasOriginales); // No debería cambiar
      expect(store.error).toBe('Error al actualizar persona');
    });

    it('no debería cambiar nada si la persona no existe', async () => {
      vi.mocked(mockPersonasService.update).mockResolvedValue(personaActualizada);
      const personasOriginales = [...store.personas];

      await store.actualizarPersona('999', datosModificar);

      expect(store.personas).toEqual(personasOriginales);
    });
  });

  describe('eliminarPersona', () => {
    beforeEach(() => {
      store.personas = [...mockPersonas];
    });

    it('debería eliminar una persona exitosamente', async () => {
      vi.mocked(mockPersonasService.delete).mockResolvedValue(true);

      const resultado = await store.eliminarPersona('1');

      expect(resultado).toBe(true);
      expect(store.personas.length).toBe(mockPersonas.length - 1);
      expect(store.personas.find(p => p.id === '1')).toBeUndefined();
      expect(store.error).toBeNull();
      expect(mockPersonasService.delete).toHaveBeenCalledWith('1');
    });

    it('debería manejar errores al eliminar persona', async () => {
      vi.mocked(mockPersonasService.delete).mockResolvedValue(false);
      const personasOriginales = [...store.personas];

      const resultado = await store.eliminarPersona('1');

      expect(resultado).toBe(false);
      expect(store.personas).toEqual(personasOriginales); // No debería cambiar
      expect(store.error).toBe('Error al eliminar la persona');
    });

    it('debería manejar excepciones al eliminar persona', async () => {
      vi.mocked(mockPersonasService.delete).mockRejectedValue(new Error('Error del servidor'));
      const personasOriginales = [...store.personas];

      const resultado = await store.eliminarPersona('1');

      expect(resultado).toBe(false);
      expect(store.personas).toEqual(personasOriginales); // No debería cambiar
      expect(store.error).toBe('Error al eliminar persona');
    });

    it('no debería cambiar nada si la persona no existe', async () => {
      vi.mocked(mockPersonasService.delete).mockResolvedValue(true);
      const personasOriginales = [...store.personas];

      await store.eliminarPersona('999');

      expect(store.personas).toEqual(personasOriginales);
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      store.personas = [...mockPersonas];
    });

    it('debería obtener persona por ID', () => {
      const persona = store.getPersonaById('1');
      expect(persona).toEqual(mockPersonas[0]);
    });

    it('debería devolver undefined si la persona no existe', () => {
      const persona = store.getPersonaById('999');
      expect(persona).toBeUndefined();
    });

    it('debería obtener el total de personas', () => {
      expect(store.personasCount).toBe(mockPersonas.length);
    });

    it('debería obtener total 0 cuando no hay personas', () => {
      store.personas = [];
      expect(store.personasCount).toBe(0);
    });

    it('debería obtener personas ordenadas', () => {
      const esperado = [...mockPersonas].sort((a, b) => a.nombre.localeCompare(b.nombre));
      expect(store.personasOrdenadas).toEqual(esperado);
    });
  });

  describe('Manejo de errores', () => {
    it('debería limpiar errores al llamar limpiarError', () => {
      store.error = 'Error de prueba';
      
      store.limpiarError();
      
      expect(store.error).toBeNull();
    });

    it('debería limpiar errores automáticamente en operaciones exitosas', async () => {
      store.error = 'Error previo';
      vi.mocked(mockPersonasService.getAll).mockResolvedValue(mockPersonas);

      await store.cargarPersonas();

      expect(store.error).toBeNull();
    });
  });

  describe('Reactividad', () => {
    it('debería ser reactivo a cambios en personas', () => {
      const initialLength = store.personas.length;
      
      store.personas.push(personaCreada);
      
      expect(store.personas.length).toBe(initialLength + 1);
      expect(store.personasCount).toBe(initialLength + 1);
    });

    it('debería ser reactivo a cambios en estado de carga', () => {
      expect(store.isLoading).toBe(false);
      
      store.isLoading = true;
      
      expect(store.isLoading).toBe(true);
    });

    it('debería ser reactivo a cambios en errores', () => {
      expect(store.error).toBeNull();
      
      store.error = 'Nuevo error';
      
      expect(store.error).toBe('Nuevo error');
    });
  });
});
