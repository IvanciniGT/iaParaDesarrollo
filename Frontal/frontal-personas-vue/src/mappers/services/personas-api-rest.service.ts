import axios from 'axios';
import type { PersonasService } from './personas.service';
import type { ModificarPersona } from '../../models/frontend/modificar-persona.model';
import type { NuevaPersona } from '../../models/frontend/nueva-persona.model';
import type { Persona } from '../../models/frontend/persona.model';
import type { PersonaRestDTO } from '../../models/rest/persona.rest.dto';
import { environment } from '../../config/environment';
import { 
  fromPersonaRestDTOListToPersonaList, 
  fromPersonaRestDTOToPersona, 
  fromNuevaPersonaToDatosNuevaPersonaRestDTO, 
  fromModificarPersonaToDatosModificarPersonaRestDTO 
} from '../persona.mapper';

/**
 * Implementación del servicio de personas que consume una API REST
 * usando Axios para las peticiones HTTP.
 */
export class PersonasApiRestService implements PersonasService {
  private readonly apiUrl = `${environment.apiUrl}/personas`;

  /**
   * Obtiene todas las personas desde la API.
   */
  async getAll(): Promise<Persona[]> {
    try {
      const response = await axios.get<PersonaRestDTO[]>(this.apiUrl);
      return fromPersonaRestDTOListToPersonaList(response.data);
    } catch (error) {
      console.error('Error al obtener personas:', error);
      return [];
    }
  }

  /**
   * Obtiene una persona por su ID desde la API.
   */
  async getById(id: string): Promise<Persona> {
    try {
      const response = await axios.get<PersonaRestDTO>(`${this.apiUrl}/${id}`);
      return fromPersonaRestDTOToPersona(response.data);
    } catch (error) {
      console.error(`Error al obtener la persona con id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva persona en la API.
   */
  async create(persona: NuevaPersona): Promise<Persona> {
    try {
      const personaDTO = fromNuevaPersonaToDatosNuevaPersonaRestDTO(persona);
      const response = await axios.post<PersonaRestDTO>(this.apiUrl, personaDTO);
      return fromPersonaRestDTOToPersona(response.data);
    } catch (error) {
      console.error('Error al crear la persona:', error);
      throw error;
    }
  }

  /**
   * Actualiza una persona existente en la API.
   */
  async update(id: string, persona: ModificarPersona): Promise<Persona> {
    try {
      const personaDTO = fromModificarPersonaToDatosModificarPersonaRestDTO(persona);
      const response = await axios.put<PersonaRestDTO>(`${this.apiUrl}/${id}`, personaDTO);
      return fromPersonaRestDTOToPersona(response.data);
    } catch (error) {
      console.error(`Error al actualizar la persona con id ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una persona de la API.
   */
  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la persona con id ${id}:`, error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
export const personasApiRestService = new PersonasApiRestService();
