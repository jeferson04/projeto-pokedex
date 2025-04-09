import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2'
})

export default {
  
  getPokemonList(offset = 0, limit = 20) {
    return api.get(`/pokemon?offset=${offset}&limit=${limit}`)
  },

  getPokemonDetail(idOrName) {
    return api.get(`/pokemon/${idOrName}`)
  },

  getPokemonSpecies(idOrName) {
    return api.get(`/pokemon-species/${idOrName}`)
  },

  getEvolutionChain(url) {
    return axios.get(url)
  },

  getMoveDetail(id) {
    return api.get(`/move/${id}`)
  },

  getTypeInfo(id) {
    return api.get(`/type/${id}`)
  }
}
