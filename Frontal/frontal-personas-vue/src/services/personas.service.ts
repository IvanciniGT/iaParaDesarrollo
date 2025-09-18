import type { ModificarPersona } from '../models/frontend/modificar-persona.model';
import type { NuevaPersona } from '../models/frontend/nueva-persona.model';
import type { Persona } from '../models/frontend/persona.model';

/**
 * Contrato que define las operaciones disponibles para la gestión de personas.
 * Sirve como base para la implementación de servicios y permite intercambiar
 * la implementación (ej: API REST real, mock, json-server) sin afectar
 * a los componentes que lo consumen.
 */
export interface PersonasService {
  /**
   * Obtiene todas las personas.
   * @returns Una promesa que resuelve con un array de personas.
   */
  getAll(): Promise<Persona[]>;

  /**
   * Obtiene una persona por su identificador único.
   * @param id El ID de la persona a buscar.
   * @returns Una promesa que resuelve con la persona encontrada.
   */
  getById(id: string): Promise<Persona>;

  /**
   * Crea una nueva persona.
   * @param persona Los datos de la nueva persona.
   * @returns Una promesa que resuelve con la persona recién creada.
   */
  create(persona: NuevaPersona): Promise<Persona>;

  /**
   * Actualiza una persona existente.
   * @param id El ID de la persona a actualizar.
   * @param persona Los nuevos datos para la persona.
   * @returns Una promesa que resuelve con la persona actualizada.
   */
  update(id: string, persona: ModificarPersona): Promise<Persona>;

  /**
   * Elimina una persona por su identificador único.
   * @param id El ID de la persona a eliminar.
   * @returns Una promesa que se completa cuando la operación finaliza.
   */
  delete(id: string): Promise<void>;
}
