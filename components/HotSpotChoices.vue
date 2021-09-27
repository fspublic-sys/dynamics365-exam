<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card outlined class="px-2">
        <v-row
          v-for="choices, index in item.choices"
          :key="choices.no"
          no-gutters
          align="center"
        >
          <v-col cols="6" class="py-2">
            {{ choices.text }}
          </v-col>
          <v-col cols="6" class="py-2">
            <v-select
              :items="choices.custom_choices"
              item-text="text"
              item-value="no"
              outlined
              dense
              hide-details
              @change="changeItem($event, choices.no, index)"
            ></v-select>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import store from '../store/store'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    }
  },
  data () {
    return {
      answer: [],
    }
  },
  methods: {
    changeItem(event, no, index) {
      this.answer[index] = `${no}-${event}`
      const data = {
        index: this.index,
        answer: this.answer,
        id: this.item.id
      }
      store.commit('setAnswer', data)
    }
  }
}
</script>
