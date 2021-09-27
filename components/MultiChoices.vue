<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card outlined class="pl-2 pb-4">
        <v-checkbox
          v-model="answer"
          v-for="choices in item.choices"
          :key="choices.no"
          :label="choices.text"
          :value="choices.no"
          hide-details
          @change="changeItem"
        >
        </v-checkbox>
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
  watch: {
    answer() {
      const data = {
        index: this.index,
        answer: this.answer,
        id: this.item.id
      }
      store.commit('setAnswer', data)
    }
  },
  methods: {
    changeItem() {
      this.answer.sort((a, b) => {
        if (a > b) {
          return 1
        } else if (a < b) {
          return -1
        } else {
          return 0
        }
      })
    }
  }
}
</script>
