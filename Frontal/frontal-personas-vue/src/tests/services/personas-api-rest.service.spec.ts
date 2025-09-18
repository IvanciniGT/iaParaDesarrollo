import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import { PersonasApiRestService } from '../../../src/services/personas-api-rest.service';
import type { PersonaRestDTO } from '../../../src/models/rest/persona.rest.dto';
import type { Persona } from '../../../src/models/frontend/persona.model';

// Mock de axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('PersonasApiRestService - getAll', () => {
  let service: PersonasApiRestService;
  const apiUrl = 'http://localhost:3000/personas';

  beforeEach(() => {
    service = new PersonasApiRestService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('debería devolver una lista de personas mapeada correctamente', async () => {
    const mockPersonasDTO: PersonaRestDTO[] = [
      { id: '1', nombre: 'Juan', dni: '123A', email: 'juan@test.com', edad: 30 },
      { id: '2', nombre: null, dni: '456B', email: null, edad: 25 }
    ];

    const expectedPersonas: Persona[] = [
      { id: '1', nombre: 'Juan', dni: '123A', email: 'juan@test.com', edad: 30 },
      { id: '2', nombre: '', dni: '456B', email: '', edad: 25 }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockPersonasDTO });

    const personas = await service.getAll();
    
    expect(mockedAxios.get).toHaveBeenCalledWith(apiUrl);
    expect(personas.length).toBe(2);
    expect(personas).toEqual(expectedPersonas);
  });

  it('debería devolver una lista vacía si el API no devuelve personas', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const personas = await service.getAll();
    
    expect(mockedAxios.get).toHaveBeenCalledWith(apiUrl);
    expect(personas).toEqual([]);
  });

  it('debería gestionar un error HTTP y devolver una lista vacía', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockedAxios.get.mockRejectedValueOnce(new Error('Error del servidor'));

    const personas = await service.getAll();
    
    expect(mockedAxios.get).toHaveBeenCalledWith(apiUrl);
    expect(personas).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener personas:', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it('debería gestionar respuesta con datos null', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });

    const personas = await service.getAll();
    
    expect(personas).toEqual([]);
  });

  it('debería gestionar respuesta con datos undefined', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: undefined });

    const personas = await service.getAll();
    
    expect(personas).toEqual([]);
  });
});

describe('PersonasApiRestService - getById', () => {
  let service: PersonasApiRestService;
  const apiUrl = 'http://localhost:3000/personas';

  beforeEach(() => {
    service = new PersonasApiRestService();
    vi.clearAllMocks();
  });

  it('debería devolver una persona por ID correctamente mapeada', async () => {
    const mockPersonaDTO: PersonaRestDTO = {
      id: '1',
      nombre: 'Juan',
      dni: '123A',
      email: 'juan@test.com',
      edad: 30
    };

    const expectedPersona: Persona = {
      id: '1',
      nombre: 'Juan',
      dni: '123A',
      email: 'juan@test.com',
      edad: 30
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockPersonaDTO });

    const persona = await service.getById('1');
    
    expect(mockedAxios.get).toHaveBeenCalledWith(`${apiUrl}/1`);
    expect(persona).toEqual(expectedPersona);
  });

  it('debería devolver null si no se encuentra la persona', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockedAxios.get.mockRejectedValueOnce(new Error('Not Found'));

    const persona = await service.getById('999');
    
    expect(persona).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});

describe('PersonasApiRestService - create', () => {
  let service: PersonasApiRestService;
  const apiUrl = 'http://localhost:3000/personas';

  beforeEach(() => {
    service = new PersonasApiRestService();
    vi.clearAllMocks();
  });

  it('debería crear una persona correctamente', async () => {
    const nuevaPersona = {
      nombre: 'Juan Test',
      dni: '12345678A',
      email: 'juan@test.com',
      edad: 30
    };

    const mockPersonaCreatedDTO: PersonaRestDTO = {
      id: '123',
      ...nuevaPersona
    };

    const expectedPersona: Persona = {
      id: '123',
      ...nuevaPersona
    };

    mockedAxios.post.mockResolvedValueOnce({ data: mockPersonaCreatedDTO });

    const persona = await service.create(nuevaPersona);
    
    expect(mockedAxios.post).toHaveBeenCalledWith(apiUrl, {
      nombre: nuevaPersona.nombre,
      dni: nuevaPersona.dni,
      email: nuevaPersona.email,
      edad: nuevaPersona.edad
    });
    expect(persona).toEqual(expectedPersona);
  });

  it('debería manejar errores al crear persona', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const nuevaPersona = {
      nombre: 'Juan Test',
      dni: '12345678A',
      email: 'juan@test.com',
      edad: 30
    };

    mockedAxios.post.mockRejectedValueOnce(new Error('Error del servidor'));

    const persona = await service.create(nuevaPersona);
    
    expect(persona).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});

describe('PersonasApiRestService - update', () => {
  let service: PersonasApiRestService;
  const apiUrl = 'http://localhost:3000/personas';

  beforeEach(() => {
    service = new PersonasApiRestService();
    vi.clearAllMocks();
  });

  it('debería actualizar una persona correctamente', async () => {
    const datosModificar = {
      nombre: 'Juan Modificado',
      dni: '12345678A',
      email: 'juan.modificado@test.com',
      edad: 31
    };

    const mockPersonaUpdatedDTO: PersonaRestDTO = {
      id: '1',
      ...datosModificar
    };

    const expectedPersona: Persona = {
      id: '1',
      ...datosModificar
    };

    mockedAxios.put.mockResolvedValueOnce({ data: mockPersonaUpdatedDTO });

    const persona = await service.update('1', datosModificar);
    
    expect(mockedAxios.put).toHaveBeenCalledWith(`${apiUrl}/1`, datosModificar);
    expect(persona).toEqual(expectedPersona);
  });

  it('debería manejar errores al actualizar persona', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const datosModificar = {
      nombre: 'Juan Modificado',
      dni: '12345678A',
      email: 'juan.modificado@test.com',
      edad: 31
    };

    mockedAxios.put.mockRejectedValueOnce(new Error('Error del servidor'));

    const persona = await service.update('1', datosModificar);
    
    expect(persona).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});

describe('PersonasApiRestService - delete', () => {
  let service: PersonasApiRestService;
  const apiUrl = 'http://localhost:3000/personas';

  beforeEach(() => {
    service = new PersonasApiRestService();
    vi.clearAllMocks();
  });

  it('debería eliminar una persona correctamente', async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: {} });

    const resultado = await service.delete('1');
    
    expect(mockedAxios.delete).toHaveBeenCalledWith(`${apiUrl}/1`);
    expect(resultado).toBe(true);
  });

  it('debería manejar errores al eliminar persona', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockedAxios.delete.mockRejectedValueOnce(new Error('Error del servidor'));

    const resultado = await service.delete('1');
    
    expect(resultado).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});
