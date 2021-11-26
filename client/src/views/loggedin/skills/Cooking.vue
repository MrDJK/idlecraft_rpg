<template>
    <div>
        <div class="page-header mb-4 p-4">
            <h1 class="d-flex align-items-center">
                <mc-icon :skill="'cooking'" class="d-inline-block me-2"></mc-icon>
                Cooking
            </h1>
            <p>Cooking will eventually be here</p>
            <GameTip/>
        </div>

        <div>
            <div class="book text-black-50">
                <div class="page-one py-4 px-5 d-flex flex-column">
                    <CookingRecipeRow :recipe="recipe" v-for="(recipe, i) in getLeftPage" :key="i" class="mb-3"/>
                    <div class="mt-auto text-center">
                        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
                        <div class="small">{{ (currentPage) }}/{{ pages + 1 }}</div>
                    </div>
                    <div class="bg"></div>
                </div>
                <div class="page-two py-4 px-5 d-flex flex-column">
                    <CookingRecipeRow :recipe="recipe" v-for="(recipe, i) in getRightPage" :key="i" class="mb-3"/>
                    <div class="mt-auto text-center">
                        <button @click="nextPage" :disabled="currentPage === pages">Next</button>
                        <div class="small">{{ (currentPage + 1) }}/{{ pages + 1 }}</div>
                    </div>
                    <div class="bg"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from '../../../store'
import McIcon from "../../../components/McIcon";
import GameTip from "../../../components/GameTip";
import CookingRecipeRow from "../../../components/CookingRecipeRow";

export default {
  name: 'Cooking',
  components: {CookingRecipeRow, GameTip, McIcon},
  data() {
    return {
      store: store.state,
      currentPage: 1,
      recipesPerPage: 3,
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.pages)
        this.currentPage++;
    },
    previousPage() {
      if (this.currentPage > 1)
        this.currentPage--;
    },
  },
  computed: {
    skills() {
      return this.store.skills && this.store.skills.filter(i => i.skill === 'cooking')
    },
    pages() {
      return Math.floor(this.skills.length / this.recipesPerPage);
    },
    getLeftPage() {
      const currentPage = (this.currentPage - 1) * this.recipesPerPage;
      return this.skills.slice(currentPage, currentPage + this.recipesPerPage)
    },
    getRightPage() {
      const currentPage = ((this.currentPage - 1) * this.recipesPerPage) + (this.recipesPerPage);
      return this.skills.slice(currentPage, currentPage + this.recipesPerPage)
    }
  }
}
</script>
