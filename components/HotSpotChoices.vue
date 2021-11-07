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
              v-model="selected[choice.no - 1]"
              :items="choice.custom_choices"
              :readonly="resultFlg"
              item-text="text"
              item-value="no"
              outlined
              dense
              hide-details
              @change="changeItem($event, choice.no)"
            ></v-select>
            <div
              v-if="resultFlg"
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
      selected: [],
      choices: this.item.choices,
    }
  },
  created() {
    if (!this.result) {
      return
    }
    this.answer = this.result
    this.selected = this.answer.map(data => Number(data.split('-')[1]))
  },
  methods: {
    changeItem(event, no) {
      this.$set(this.answer, no - 1, `${no}-${event}`)
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

      const target = this.answer[choices.no - 1]
      if (target) {
        const targeNo = target.split('-')[1]
        this.$set(this.choices[choices.no - 1], 'answerFlg', targeNo === targetChoicesNo)
      } else {
        this.$set(this.choices[choices.no - 1], 'answerFlg', false)
      }
      return targetAnswer.text
    }
  }
}
</script>
