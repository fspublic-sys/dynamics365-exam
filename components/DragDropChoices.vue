<style scoped>
  .choice-card {
    width: 50%;
  }
  .answer-area {
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
            <div :id="props.item.no" :draggable="true" @dragstart="dragstart(props.item)">{{ props.item.text }}</div>
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
              {{ props.item.answer }}
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
          text: '回答',
          align: 'start',
          value: 'answer',
          width: '30%',
          sortable: false
        }
      ],
      dragItem: {},
    }
  },
  methods: {
    dragstart(item) {
      this.dragItem = item
    },
    dragover(event) {
      event.preventDefault()
    },
    drop(props) {
      this.$set(this.subQuestions[props.index], 'answer', this.dragItem.text)
      this.answer[props.index] = `${props.item.no}-${this.dragItem.no}`
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
