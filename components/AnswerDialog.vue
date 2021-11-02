
<template>
  <v-dialog
    scrollable
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        x-small
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-card-multiple-outline</v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title>解答内容</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="white-space: break-spaces;padding-top: 20px;">
        <component
          :is="getChoicesType(item.choicesType)"
          :item="item.item"
          :index="item.id"
          :result="item.answer"
        ></component>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import MultiChoices from '~/components/MultiChoices.vue'
import SoloChoices from '~/components/SoloChoices.vue'
import HotSpotChoices from '~/components/HotSpotChoices.vue'
import DragDropChoices from '~/components/DragDropChoices.vue'

export default {
  components: { SoloChoices, MultiChoices, HotSpotChoices, DragDropChoices },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
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
  }
}
</script>
