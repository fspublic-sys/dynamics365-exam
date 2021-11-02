<style scoped>
  .result {
    background: lightgreen;
  }
  .ng {
    background: lightcoral;
  }
</style>
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
          :readonly="item.resultFlg"
          :class="item.resultFlg && item.answer.indexOf(choices.no) >= 0 ? answer.indexOf(choices.no) >= 0 ? 'result' : 'ng' : ''"
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
    },
    result: {
      type: Array,
      require: false,
      default: undefined,
    }
  },
  data () {
    return {
      answer: [],
    }
  },
  watch: {
    answer() {
      if (this.result) {
        return
      }
      const data = {
        index: this.index,
        answer: this.answer,
        id: this.item.id
      }
      store.commit('setAnswer', data)
    }
  },
  created() {
    if (!this.result) {
      return
    }
    this.answer = this.result
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
