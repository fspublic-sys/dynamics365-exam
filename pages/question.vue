<style scoped>
  .header-style {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
</style>

<template>
  <div>
    <v-toolbar
      dense
      class="header-style"
    >
      <v-toolbar-title>Dinamics365 {{ examFile }}過去問</v-toolbar-title>
    </v-toolbar>
    <v-row justify="center" align="center" class="pa-3 pt-15">
      <v-col cols="12">
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item, index in items"
            :key="item.id"
            :value="index + 1"
          >
            <v-card outlined>
              <v-card-title>問題{{ index + 1 }}</v-card-title>
              <v-card-text style="white-space: break-spaces;" v-html="item.question"></v-card-text>
            </v-card>
            <v-card flat style="margin-top: 20px;">
              <component
                :is="getChoicesType(item.choices_type)"
                :item="item"
                :index="index"
              ></component>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="12">
        <Footer @nextTab="nextTab" @prevTab="prevTab" @jumpTab="jumpTab" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MultiChoices from '~/components/MultiChoices.vue'
import SoloChoices from '~/components/SoloChoices.vue'
import HotSpotChoices from '~/components/HotSpotChoices.vue'
import DragDropChoices from '~/components/DragDropChoices.vue'
import Footer from '~/components/Footer.vue'
import store from '../store/store'

export default {
  components: { SoloChoices, MultiChoices, HotSpotChoices, DragDropChoices, Footer },
  data () {
    return {
      tab: 1,
      items: [],
      answer: [],
      examFile: store.state.examFile.replace('.json', '')
    }
  },
  created() {
    try {
      this.items = require('../json/' + store.state.examFile)
    } catch(err) {}
  },
  methods: {
    getChoicesType(type) {
      switch(type) {
        case 'solo':
          return 'solo-choices'
        case 'multi':
          return 'multi-choices'
        case 'hotspot':
          return 'hot-spot-choices'
        case 'dragdrop':
          return 'drag-drop-choices'
      }
    },
    nextTab() {
      if (this.tab < this.items.length) {
        this.tab++
        document.getElementsByTagName('html')[0].scrollTop = 0
      }
    },
    prevTab() {
      if (this.tab > 1) {
        this.tab--
        document.getElementsByTagName('html')[0].scrollTop = 0
      }
    },
    jumpTab(tab) {
      const number = Number(tab)
      if (!isNaN(number) && number <= this.items.length && number > 0) {
        this.tab = number
        document.getElementsByTagName('html')[0].scrollTop = 0
      }
    }
  }
}
</script>
