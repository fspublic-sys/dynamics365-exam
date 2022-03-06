<style scoped>
  .choice-card {
    width: 50%;
  }
  .answer-area {
    height: 100%;
  }
  .result {
    background: lightgreen;
  }
  .ng {
    background: lightcoral;
  }
  .choices-area {
    cursor: grab;
    height: 100%;
  }
</style>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card
        outlined
        class="choice_card"
      >
        <v-data-table
          :headers="choicesHeaders"
          :items="item.choices"
          hide-default-footer
        >
          <template v-slot:item.text="props">
            <v-row :id="props.item.no" class="choices-area" :draggable="!resultFlg" no-gutters align="center" @dragstart="dragstart(props.item)">{{ props.item.text }}</v-row>
          </template>
        </v-data-table>
      </v-card>
      <v-card
        outlined
        class="mt-3"
      >
        <v-data-table
          :headers="questionsHeaders"
          :items="subQuestions"
          hide-default-footer
        >
          <template v-slot:item.answer="props">
            <v-row
              no-gutters
              align="center"
              class="answer-area"
              @dragover="dragover"
              @drop="drop(props)"
            >
              <v-col cols="12">{{ getAnswerText(props) }}</v-col>
              <v-col
                v-if="resultFlg"
                cols="12"
                :class="props.item.answerFlg ? 'result' : 'ng'"
              >{{ showAnswer(props) }}</v-col>
            </v-row>
          </template>
        </v-data-table>
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
      subQuestions: this.item.sub_questions,
      choicesHeaders: [
        {
          text: '選択肢',
          align: 'start',
          value: 'text',
          sortable: false
        }
      ],
      questionsHeaders: [
        {
          text: '問題',
          align: 'start',
          value: 'text',
          sortable: false
        },
        {
          text: '解答',
          align: 'start',
          value: 'answer',
          width: '50%',
          sortable: false
        }
      ],
      dragItem: {},
    }
  },
  created() {
    if (!this.result) {
      return
    }
    this.answer = this.result
  },
  watch: {
    result() {
      if (!this.result) {
        return
      }
      this.answer = this.result
    }
  },
  computed: {
    getAnswerText() {
      return (props) => {
        const answer = this.answer[props.index]
        if (answer) {
          const ids = answer.split('-')
          const target = this.item.choices.find(choice => choice.no === Number(ids[1]))
          return target.text
        }
        return ''
      }
    },
  },
  methods: {
    dragstart(item) {
      this.dragItem = item
    },
    dragover(event) {
      event.preventDefault()
    },
    drop(props) {
      this.$set(this.answer, props.index, `${props.item.no}-${this.dragItem.no}`)
      const data = {
        index: this.index,
        answer: this.answer,
        id: this.item.id
      }
      store.commit('setAnswer', data)
    },
    showAnswer(props) {
      const answer = this.item.answer
      const targetChoices = answer.find(ans => Number(ans.split('-')[0]) === props.index + 1)
      if (!targetChoices) {
        return ''
      }
      const targetChoicesNo = targetChoices.split('-')[1]
      const targetAnswer = this.item.choices.find(choice => choice.no === Number(targetChoicesNo))

      const target = this.answer[props.index]
      if (target) {
        const targeNo = target.split('-')[1]
        this.$set(this.subQuestions[props.index], 'answerFlg', targeNo === targetChoicesNo)
      } else {
        this.$set(this.subQuestions[props.index], 'answerFlg', false)
      }
      return targetAnswer.text
    }
  }
}
</script>
