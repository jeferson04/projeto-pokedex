<template>
  <div>
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
      <span class="ml-3">{{ $t("app.loading") }}</span>
    </div>

    <div
      v-else-if="pokemon"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/3 mb-6 md:mb-0">
          <div class="relative">
            <img
              :src="
                pokemon.sprites.other['official-artwork'].front_default ||
                pokemon.sprites.front_default
              "
              :alt="pokemon.name"
              class="w-full h-auto object-contain rounded-lg"
            />
          </div>
          <div class="mt-4 text-center">
            <h1 class="text-3xl font-bold capitalize mb-2">
              {{ pokemon.name || translatedName }}
            </h1>
            <div class="text-xl text-gray-500 mb-4">Id: {{ pokemon.id }}</div>
            <div class="flex justify-center flex-wrap gap-2">
              <span
                v-for="type in pokemon.types"
                :key="type.type.name"
                class="px-3 py-1 text-sm font-medium rounded-full capitalize"
                :class="typeClass(type.type.name)"
              >
                {{ type.type.name }}
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-sm text-gray-500">
                {{ $t("pokemon.height") }}
              </div>
              <div class="font-semibold">
                {{ (pokemon.height / 10).toFixed(1) }}m
              </div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-500">
                {{ $t("pokemon.weight") }}
              </div>
              <div class="font-semibold">
                {{ (pokemon.weight / 10).toFixed(1) }}kg
              </div>
            </div>
            <div class="text-center col-span-2">
              <div class="text-sm text-gray-500">
                {{ $t("pokemon.baseExperience") }}
              </div>
              <div class="font-semibold">{{ pokemon.base_experience }}</div>
            </div>
          </div>
        </div>

        <div class="md:w-2/3 md:pl-8">
          <div class="border-b border-gray-200 mb-6">
            <div class="flex flex-wrap -mb-px">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                @click="activeTab = tab.value"
                class="mr-2 py-2 px-4 font-medium text-sm border-b-2 focus:outline-none transition-colors duration-200"
                :class="
                  activeTab === tab.value
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent hover:border-gray-300'
                "
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'sprites'" class="space-y-6">
            <h2 class="text-xl font-semibold mb-4">
              {{ $t("pokemon.sprites") }}
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="(sprite, key) in allSprites"
                :key="key"
                class="text-center"
              >
                <img
                  :src="sprite"
                  :alt="`${pokemon.name} ${key}`"
                  class="mx-auto h-24 w-24 object-contain"
                />
                <div class="mt-2 text-xs text-gray-500 capitalize">
                  {{ formatSpriteKey(key) }}
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'moves'" class="space-y-6">
            <h2 class="text-xl font-semibold mb-4">
              {{ $t("pokemon.moves") }}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="move in pokemon.moves.slice(0, 30)"
                :key="move.move.name"
                class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
              >
                <div class="font-medium capitalize">
                  {{ formatMoveName(move.move.name) }}
                </div>
                <div class="text-sm text-gray-500">
                  Level: {{ getLearnLevel(move) }}
                </div>
              </div>
            </div>
            <div
              v-if="pokemon.moves.length > 30"
              class="text-center text-gray-500 mt-4"
            >
              Showing 30 of {{ pokemon.moves.length }} moves
            </div>
          </div>

          <div v-else-if="activeTab === 'evolutions'" class="space-y-6">
            <h2 class="text-xl font-semibold mb-4">
              {{ $t("pokemon.evolutions") }}
            </h2>
            <div
              v-if="evolutionChain && evolutionChain.length > 0"
              class="flex flex-wrap justify-center items-center gap-4"
            >
              <template v-for="(evo, index) in evolutionChain" :key="index">
                <div class="flex flex-col items-center">
                  <img
                    :src="evo.image"
                    :alt="evo.name"
                    class="w-24 h-24 object-contain"
                  />
                  <div class="capitalize font-medium mt-2">{{ evo.name }}</div>
                </div>
                <div v-if="index < evolutionChain.length - 1" class="text-2xl">
                  →
                </div>
              </template>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              {{ $t("pokemon.noEvolutions") }}
            </div>
          </div>

          <div v-else-if="activeTab === 'games'" class="space-y-6">
            <h2 class="text-xl font-semibold mb-4">
              {{ $t("pokemon.games") }}
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="gameIndex in pokemon.game_indices"
                :key="gameIndex.version.name"
                class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center"
              >
                <div class="font-medium capitalize">
                  {{ formatGameName(gameIndex.version.name) }}
                </div>
                <div class="text-sm text-gray-500">
                  Index: {{ gameIndex.game_index }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import api from "../services/api";

export default {
  name: "PokemonDetail",
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const store = useStore();
    const { t } = useI18n();

    const pokemon = ref(null);
    const species = ref(null);
    const evolutionChain = ref(null);
    const isLoading = ref(true);
    const activeTab = ref("sprites");

    const tabs = computed(() => [
      { label: t("pokemon.sprites"), value: "sprites" },
      { label: t("pokemon.moves"), value: "moves" },
      { label: t("pokemon.evolutions"), value: "evolutions" },
      { label: t("pokemon.games"), value: "games" },
    ]);

    const fetchPokemonData = async () => {
      try {
        isLoading.value = true;

        const pokemonResponse = await api.getPokemonDetail(props.id);
        pokemon.value = pokemonResponse.data;
        store.commit("SET_POKEMON_DETAIL", pokemon.value);

        const speciesResponse = await api.getPokemonSpecies(props.id);
        species.value = speciesResponse.data;

        if (species.value.evolution_chain) {
          const evolutionResponse = await api.getEvolutionChain(
            species.value.evolution_chain.url
          );
          const chain = evolutionResponse.data.chain;

          const processChain = async (chain, evolutions = []) => {
            const pokemonId = chain.species.url
              .split("/")
              .filter(Boolean)
              .pop();
            const pokemonDetail = await api.getPokemonDetail(pokemonId);

            evolutions.push({
              id: pokemonId,
              name: chain.species.name,
              image:
                pokemonDetail.data.sprites.other["official-artwork"]
                  .front_default || pokemonDetail.data.sprites.front_default,
            });

            if (chain.evolves_to && chain.evolves_to.length) {
              await processChain(chain.evolves_to[0], evolutions);
            }

            return evolutions;
          };

          evolutionChain.value = await processChain(chain);
        }
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const allSprites = computed(() => {
      if (!pokemon.value) return {};

      const sprites = {};

      Object.entries(pokemon.value.sprites).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          sprites[key] = value;
        }
      });

      if (pokemon.value.sprites.other) {
        Object.entries(pokemon.value.sprites.other).forEach(
          ([collectionName, collection]) => {
            Object.entries(collection).forEach(([key, value]) => {
              if (value && typeof value === "string") {
                sprites[`${collectionName}_${key}`] = value;
              }
            });
          }
        );
      }

      return sprites;
    });

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

    const formatSpriteKey = (key) => {
      return key.replace(/_/g, " ");
    };

    const formatMoveName = (name) => {
      return name.replace(/-/g, " ");
    };

    const formatGameName = (name) => {
      return name.replace(/-/g, " ");
    };

    const getLearnLevel = (move) => {
      const learnMethod = move.version_group_details[0];
      if (learnMethod.move_learn_method.name === "level-up") {
        return learnMethod.level_at;
      }
      return learnMethod.move_learn_method.name.replace(/-/g, " ");
    };

    onMounted(() => {
      fetchPokemonData();
    });

    return {
      pokemon,
      species,
      evolutionChain,
      isLoading,
      activeTab,
      tabs,
      allSprites,
      formatSpriteKey,
      formatMoveName,
      formatGameName,
      getLearnLevel,
      typeClass,
    };
  },
};
</script>
