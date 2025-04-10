import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'
import PokemonList from '../views/PokemonList.vue'
 

const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  messages: {
   
  }
})
 
describe('PokemonList.vue', () => {
  it('renderiza o título corretamente', () => {
    const wrapper = mount(PokemonList, {
      global: {
        plugins: [i18n]
      }
    })
 
    expect(wrapper.text()).toContain('pokemon.list')
  })
 
 
})