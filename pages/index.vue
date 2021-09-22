<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="item in items"
          :key="item.id"
          :value="item.id"
        >
          <v-card outlined>
            <v-card-title>問題{{ item.id }}</v-card-title>
            <v-card-text style="white-space: break-spaces;">{{ item.question }}</v-card-text>
          </v-card>
          <v-card flat style="margin-top: 20px;">
            <component
              :is="getChoicesType(item.choices_type)"
              :item="item"
            ></component>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-col>
    <v-col cols="12">
      <v-footer
        absolute
      >
        <v-btn
          color="primary"
          @click="prevTab"
        >
          前の問題
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
        >
          回答確認
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="nextTab"
        >
          次の問題
        </v-btn>
      </v-footer>
    </v-col>
  </v-row>
</template>

<script>
import MultiChoices from '~/components/MultiChoices.vue'
import SoloChoices from '~/components/SoloChoices.vue'
import HotSpotChoices from '~/components/HotSpotChoices.vue'
import DragDropChoices from '~/components/DragDropChoices.vue'
import exam from '../json/exam.json'

export default {
  components: { SoloChoices, MultiChoices, HotSpotChoices, DragDropChoices },
  data () {
    return {
      tab: 1,
      text: 'test',
      items: exam,
      answer: ''
    }
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
      }
    },
    prevTab() {
      if (this.tab > 1) {
        this.tab--
      }
    }
  }
}
</script>
