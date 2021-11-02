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
      <v-card outlined class="px-2">
        <v-row
          v-for="choice, index in choices"
          :key="choice.no"
          no-gutters
          align="center"
        >
          <v-col cols="6" class="py-2">
            {{ choice.text }}
          </v-col>
          <v-col cols="6" class="py-2">
            <v-select
              v-model="choice.answer"
              :items="choice.custom_choices"
              :readonly="item.resultFlg"
              item-text="text"
              item-value="no"
              outlined
              dense
              hide-details
              @change="changeItem($event, choice.no, index)"
            ></v-select>
            <div
              v-if="item.resultFlg"
              :class="choice.answerFlg ? 'result' : 'ng'"
            >
              {{ showAnswer(choice) }}
            </div>
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
      choices: this.item.choices,
    }
  },
  created() {
    if (!this.result) {
      return
    }
    const answer = this.result
    for (let i = 0; i < answer.length; i++) {
      this.$set(this.choices[i], 'answer', Number(answer[i].split('-')[1]))
    }
  },
  methods: {
    changeItem(event, no, index) {
      this.$set(this.choices[index], 'answer', event)
      this.answer[index] = `${no}-${event}`
      const data = {
        index: this.index,
        answer: this.answer,
        id: this.item.id
      }
      store.commit('setAnswer', data)
    },
    showAnswer(choices) {
      const answer = this.item.answer
      const targetChoicesNo = answer[choices.no - 1].split('-')[1]
      const targetAnswer = choices.custom_choices.find(choice => choice.no === Number(targetChoicesNo))
      this.$set(this.choices[choices.no - 1], 'answerFlg', this.choices[choices.no - 1].answer === Number(targetChoicesNo))
      return targetAnswer.text
    }
  }
}
</script>
