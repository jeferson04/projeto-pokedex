<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">{{ $t("pokemon.list") }}</h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ $t("pokemon.filter.title") }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">{{
            $t("pokemon.filter.name")
          }}</label>
          <input
            v-model="filters.name"
            type="text"
            class="w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:text-white px-3 py-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">{{
            $t("pokemon.filter.id")
          }}</label>
          <input
            v-model="filters.id"
            type="number"
            min="1"
            step="1"
            class="w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:text-white px-3 py-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">{{
            $t("pokemon.filter.type")
          }}</label>
          <input
            v-model="filters.type"
            type="text"
            class="w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:text-white px-3 py-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">{{
            $t("pokemon.filter.species")
          }}</label>
          <input
            v-model="filters.species"
            type="text"
            class="w-full rounded-md border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:text-white px-3 py-2"
          />
        </div>
      </div>
      <div class="flex space-x-4 mt-4">
        <button
          @click="applyFilters"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {{ $t("pokemon.filter.apply") }}
        </button>
        <button
          @click="clearFilters"
          class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          {{ $t("pokemon.filter.clear") }}
        </button>
      </div>
    </div>

    <div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="pokemon in displayedPokemon"
          :key="pokemon.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <router-link :to="`/pokemon/${pokemon.id}`">
            <div class="p-4">
              <div class="relative pb-2/3">
                <img
                  :src="
                    pokemon.sprites.other['official-artwork'].front_default ||
                    pokemon.sprites.front_default
                  "
                  :alt="pokemon.name"
                  class="absolute h-full w-full object-contain"
                />
              </div>
              <div class="mt-4">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold capitalize">
                    {{ pokemon.name }}
                  </h3>
                  <span class="text-gray-500">Id: {{ pokemon.id }}</span>
                </div>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="type in pokemon.types"
                    :key="type.type.name"
                    class="px-2 py-1 text-xs font-medium rounded capitalize"
                    :class="typeClass(type.type.name)"
                  >
                    {{ type.type.name }}
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-if="isLoadingMore" class="flex justify-center my-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
        ></div>
        <span class="ml-3">{{ $t("app.loading") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import api from "../services/api";

export default {
  name: "PokemonList",
  setup() {
    const store = useStore();
    const { t } = useI18n();

    const offset = ref(0);
    const limit = ref(20);
    const isLoading = ref(false);
    const isLoadingMore = ref(false);
    const pokemonList = ref([]);
    const filters = ref({
      name: "",
      id: "",
      type: "",
      species: "",
    });

    const fetchPokemonList = async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          isLoading.value = true;
        } else {
          isLoadingMore.value = true;
        }

        const response = await api.getPokemonList(offset.value, limit.value);
        response.data.results;
        const detailedPokemon = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const detailResponse = await api.getPokemonDetail(pokemon.name);
            return detailResponse.data;
          })
        );

        pokemonList.value = [...pokemonList.value, ...detailedPokemon];
        store.commit("SET_POKEMON_LIST", pokemonList.value);
      } catch (error) {
        console.error("Error fetching Pokémon list:", error);
      } finally {
        isLoading.value = false;
        isLoadingMore.value = false;
      }
    };

    const loadMore = () => {
      offset.value += limit.value;
      fetchPokemonList(false);
    };

    const handleScroll = () => {
      if (isLoadingMore.value) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      const scrollThreshold = 200;

      if (bodyHeight - scrollPosition < scrollThreshold) {
        loadMore();
      }
    };

    const applyFilters = () => {
      store.dispatch("setFilters", filters.value);
    };

    const clearFilters = () => {
      filters.value = {
        name: "",
        id: "",
        type: "",
        species: "",
      };
      store.dispatch("clearFilters");
    };

    const typeClass = (type) => {
      const typeColors = {
        normal: "bg-gray-300 text-gray-800",
        fire: "bg-red-500 text-white",
        water: "bg-blue-500 text-white",
        electric: "bg-yellow-400 text-gray-800",
        grass: "bg-green-500 text-white",
        ice: "bg-blue-200 text-gray-800",
        fighting: "bg-red-700 text-white",
        poison: "bg-purple-600 text-white",
        ground: "bg-yellow-600 text-white",
        flying: "bg-indigo-300 text-gray-800",
        psychic: "bg-pink-500 text-white",
        bug: "bg-green-600 text-white",
        rock: "bg-yellow-700 text-white",
        ghost: "bg-purple-700 text-white",
        dragon: "bg-indigo-700 text-white",
        dark: "bg-gray-700 text-white",
        steel: "bg-gray-400 text-gray-800",
        fairy: "bg-pink-300 text-gray-800",
      };

      return typeColors[type] || "bg-gray-500 text-white";
    };

    const displayedPokemon = computed(() => {
      if (
        !filters.value.name &&
        !filters.value.id &&
        !filters.value.type &&
        !filters.value.species
      ) {
        return pokemonList.value;
      }

      return pokemonList.value.filter((pokemon) => {
        let matchesName = true;
        let matchesId = true;
        let matchesType = true;
        let matchesSpecies = true;

        if (filters.value.name) {
          matchesName = pokemon.name
            .toLowerCase()
            .startsWith(filters.value.name.toLowerCase());
        }

        if (filters.value.id) {
          matchesId = pokemon.id === Number(filters.value.id);
        }

        if (filters.value.type) {
          matchesType = pokemon.types.some((typeInfo) =>
            typeInfo.type.name
              .toLowerCase()
              .startsWith(filters.value.type.toLowerCase())
          );
        }

        if (filters.value.species) {
          matchesSpecies = pokemon.species.name
            .toLowerCase()
            .startsWith(filters.value.species.toLowerCase());
        }

        return matchesName && matchesId && matchesType && matchesSpecies;
      });
    });

    watch(
      filters,
      (newFilters) => {
        store.dispatch("setFilters", newFilters);
      },
      { deep: true }
    );

    onMounted(() => {
      fetchPokemonList(true);
      window.addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      isLoading,
      isLoadingMore,
      displayedPokemon,
      filters,
      applyFilters,
      clearFilters,
      typeClass,
    };
  },
};
</script>

<style scoped>
.pb-2\/3 {
  padding-bottom: 66.666667%;
}
</style>
