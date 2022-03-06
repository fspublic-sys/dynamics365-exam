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
      <v-card outlined class="pl-2">
        <v-radio-group v-model="answer" :readonly="resultFlg">
          <v-radio
            v-for="choices in item.choices"
            :key="choices.no"
            :label="choices.text"
            :value="choices.no"
            :class="resultFlg && item.answer.indexOf(choices.no) >= 0 ? answer === choices.no ? 'result' : 'ng' : ''"
          ></v-radio>
        </v-radio-group>
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
    },
    resultFlg: {
      type: Boolean,
      require: false,
      default: false,
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
        answer: [this.answer],
        id: this.item.id
      }
      store.commit('setAnswer', data)
    },
    result() {
      if (!this.result) {
        return
      }
      const answer = this.result[0]
      this.answer = answer
    }
  },
  created() {
    if (!this.result) {
      return
    }
    const answer = this.result[0]
    this.answer = answer
  }
}
</script>
