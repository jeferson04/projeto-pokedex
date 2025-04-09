import { createStore } from 'vuex'

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    pokemonList: [],
    pokemonDetail: null,
    isLoading: false,
    filters: {
      name: '',
      id: '',
      type: '',
      species: ''
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
    filteredPokemon: state => {
      let filtered = state.pokemonList;
      
      if (state.filters.name) {
        filtered = filtered.filter(pokemon => 
          pokemon.name.toLowerCase().includes(state.filters.name.toLowerCase())
        );
      }
      
      if (state.filters.id) {
        filtered = filtered.filter(pokemon => 
          pokemon.id.toString().includes(state.filters.id)
        );
      }
      
      if (state.filters.type) {
        filtered = filtered.filter(pokemon => 
          pokemon.types.some(type => 
            type.type.name.toLowerCase().includes(state.filters.type.toLowerCase())
          )
        );
      }
      
      if (state.filters.species) {
        filtered = filtered.filter(pokemon => 
          pokemon.species.name.toLowerCase().includes(state.filters.species.toLowerCase())
        );
      }
      
      return filtered;
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    LOGOUT(state) {
      state.user = null;
      localStorage.removeItem('user');
    },
    SET_POKEMON_LIST(state, pokemonList) {
      state.pokemonList = pokemonList;
    },
    ADD_POKEMON_TO_LIST(state, pokemonList) {
      state.pokemonList = [...state.pokemonList, ...pokemonList];
    },
    SET_POKEMON_DETAIL(state, pokemon) {
      state.pokemonDetail = pokemon;
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
    },
    CLEAR_FILTERS(state) {
      state.filters = {
        name: '',
        id: '',
        type: '',
        species: ''
      };
    }
  },
  actions: {
    signup({ commit }, user) {
      commit('SET_USER', user);
      return Promise.resolve(user);
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
    setFilters({ commit }, filters) {
      commit('SET_FILTERS', filters);
    },
    clearFilters({ commit }) {
      commit('CLEAR_FILTERS');
    }
  }
})
