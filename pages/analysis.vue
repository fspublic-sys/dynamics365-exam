
<style scoped>
  .all-analysis-table >>> td:nth-child(1),
  .all-analysis-table >>> td:nth-child(4) {
    min-width: 100px;
  }
  .all-analysis-table >>> td:nth-child(2) {
    max-width: 0;
  }
  .all-analysis-table >>> td:nth-child(3),
  .all-analysis-table >>> td:nth-child(5) {
    min-width: 90px;
  }
  .all-analysis-table >>> td.text-end {
    text-align: right;
  }
  .all-analysis-table >>> th.text-end span {
    white-space: pre-line;
    word-break: keep-all;
    float: right;
    text-align: right;
  }
  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .grades-color-1 {
    color: red;
  }
  .grades-color-2 {
    color: blue;
  }
</style>
<template>
  <div>
    <v-checkbox
      v-model="excludeUnanswered"
      dense
      hide-details
      label="未解答の問題を除く"
      class="ma-3"
    ></v-checkbox>
    <v-card class="ma-3">
      <v-card-title
        class="pa-2"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)"
      >
        累計分析
      </v-card-title>
      <v-data-table
        v-if="allAnalysisItems.length"
        :headers="allAnalysisHeaders"
        :items="allAnalysisItems"
        dense
        fixed-header
        class="all-analysis-table"
      >
        <template v-slot:item.question="props">
          <div class="text-ellipsis">{{ props.item.question }}</div>
        </template>
        <template v-slot:item.correctRate="props">
          <div v-if="props.item.correctRate < 0">-</div>
          <div v-else>{{ props.item.correctRate.toFixed(1) }}%</div>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="ma-3">
      <v-card-title
        class="pa-2"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)"
      >
        実施時間別分析
      </v-card-title>
      <v-row no-gutters>
        <v-col cols="4">
          <v-select
            v-model="target"
            :items="targetAnalysisSelects"
            dense
            hide-details
            outlined
            class="ma-2"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <v-data-table
            v-if="targetAnalysisItems.length"
            :headers="targetAnalysisHeaders"
            :items="targetAnalysisItems"
            dense
            fixed-header
            class="all-analysis-table"
          >
            <template v-slot:item.question="props">
              <div class="text-ellipsis">{{ props.item.question }}</div>
            </template>
            <template v-slot:item.grades="props">
              <div
                :class="'grades-color-' + props.item.grades"
              >
                {{ getGrades(props.item.grades) }}
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col v-if="pastCorrectAnalysisItems.length">
          <v-row no-gutters class="ma-3">
            <v-col cols="12">
              ■今回不正解で過去正解した実績のある問題
            </v-col>
            <v-col cols="12">
              <v-data-table
                :headers="pastCorrectAnalysisHeaders"
                :items="pastCorrectAnalysisItems"
                dense
                fixed-header
                class="all-analysis-table"
              >
                <template v-slot:item.question="props">
                  <div class="text-ellipsis">{{ props.item.question }}</div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { historyType } from '../constants/constants'
import store from '../store/store'
const UNANSWERED = historyType.UNANSWERED
const CORRECT_ANSWER = historyType.CORRECT_ANSWER
const INCORRECT_ANSWER = historyType.INCORRECT_ANSWER

export default {
  data () {
    return {
      items: [],
      excludeUnanswered: false,
      allAnalysisItems: [],
      allAnalysisHeaders: [
        {
          text: '問題番号',
          align: 'start',
          value: 'id',
          sortable: true
        },
        {
          text: '問題文',
          align: 'start',
          value: 'question',
          width: '100%',
          sortable: false
        },
        {
          text: '正解数',
          align: 'end',
          value: 'correctCount',
          sortable: true
        },
        {
          text: '不正解数',
          align: 'end',
          value: 'incorrectCount',
          sortable: true
        },
        {
          text: '正解率',
          align: 'end',
          value: 'correctRate',
          sortable: true,
          sort: (a, b) => {
            if (a < 0) {
              return 1
            } else if (b < 0) {
              return 1
            }else {
              return a - b
            }
          },
          filter: this.allFilterUnanswered
        },
      ],
      target: '',
      targetAnalysisSelects: [],
      targetAnalysisItems: [],
      targetAnalysisHeaders: [
        {
          text: '問題番号',
          align: 'start',
          value: 'id',
          sortable: true
        },
        {
          text: '問題文',
          align: 'start',
          value: 'question',
          width: '80%',
          sortable: false
        },
        {
          text: '成績',
          align: 'end',
          value: 'grades',
          sortable: true,
          filter: this.targetFilterUnanswered
        },
        {
          text: '模範解答',
          align: 'end',
          value: 'modelAnswer',
          width: '10%',
          sortable: false
        },
        {
          text: '解答',
          align: 'end',
          value: 'answer',
          width: '10%',
          sortable: false
        },
      ],
      pastCorrectAnalysisHeaders: [
        {
          text: '問題番号',
          align: 'start',
          value: 'id',
          sortable: true
        },
        {
          text: '問題文',
          align: 'start',
          value: 'question',
          width: '100%',
          sortable: false
        },
      ],
      pastCorrectAnalysisItems: []
    }
  },
  watch: {
    target() {
      const storage = JSON.parse(localStorage.getItem('history'))
      if (!storage || !this.target) {
        return
      }
      this.createTargetAnalysisItems(storage)
      this.createPastCorrectAnalysisItems(storage)
    }
  },
  created() {
    try {
      this.items = require('../json/' + store.state.examFile)
    } catch(err) {}
  },
  mounted() {
    const storage = JSON.parse(localStorage.getItem('history'))
    if (!storage) {
      return
    }
    this.crateAllAnalysisItems(storage)
    this.createTargetAnalysisSelects(storage)
  },
  methods: {
    crateAllAnalysisItems(storage) {
      this.allAnalysisItems = []
      let correctAnswer = []
      let incorrectAnswer = []
      for (let i = 0; i < storage.length; i++) {
        const history = Object.values(storage[i])[0]
        correctAnswer = correctAnswer.concat(history[CORRECT_ANSWER])
        incorrectAnswer = incorrectAnswer.concat(history[INCORRECT_ANSWER])
      }
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]
        const correctCount = correctAnswer.filter(correct => correct === item.id).length
        const incorrectCount = incorrectAnswer.filter(incorrect => incorrect.id === item.id).length
        let correctRate = (correctCount / (correctCount + incorrectCount)) * 100
        correctRate = isNaN(correctRate) ? -1 : correctRate
        this.allAnalysisItems.push({
          id: item.id,
          question: item.question,
          correctCount: correctCount,
          incorrectCount: incorrectCount,
          correctRate: correctRate
        })
      }
    },
    createTargetAnalysisSelects(storage) {
      for (let i = 0; i < storage.length; i++) {
        const dateTime = Object.keys(storage[i])[0]
        this.targetAnalysisSelects.push(dateTime)
      }
      this.target = this.targetAnalysisSelects[this.targetAnalysisSelects.length - 1]
    },
    createTargetAnalysisItems(storage) {
      let targetData = storage.find(data => Object.keys(data)[0] === this.target)
      if (!targetData) {
        return
      }
      this.targetAnalysisItems = []
      targetData = targetData[this.target]
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]
        let historyType
        let answer
        for (let j = 0; j < targetData.length; j++) {
          const findData = targetData[j].find(data => {
            if (data === item.id || (j === INCORRECT_ANSWER && data.id === item.id)) {
              return true
            } else {
              return false
            }
          })
          if (findData) {
            historyType = j
            answer = j === INCORRECT_ANSWER ? findData.answer : item.answer
            break
          }
        }
        this.targetAnalysisItems.push({
          id: item.id,
          question: item.question,
          grades: historyType,
          modelAnswer: historyType === UNANSWERED ? '-' : item.answer,
          answer: historyType === UNANSWERED ? '-' : answer
        })
      }
    },
    createPastCorrectAnalysisItems(storage) {
      this.pastCorrectAnalysisItems = []
      const postStorage = storage.filter(dateObj => Object.keys(dateObj)[0] < this.target)
      let postCorrectItemIds = []
      for (let i = 0; i < postStorage.length; i++) {
        const history = Object.values(postStorage[i])[0]
        postCorrectItemIds = postCorrectItemIds.concat(history[CORRECT_ANSWER])
      }
      const postCorrectItems = this.targetAnalysisItems.filter(item => item.grades === INCORRECT_ANSWER && postCorrectItemIds.indexOf(item.id) >= 0)
      this.pastCorrectAnalysisItems = postCorrectItems
    },
    allFilterUnanswered(value) {
      return !(this.excludeUnanswered && value < 0)
    },
    targetFilterUnanswered(value) {
      return !(this.excludeUnanswered && value === 0)
    },
    getGrades(grade) {
      switch(grade) {
        case UNANSWERED:
          return '未解答'
        case CORRECT_ANSWER:
          return '正解'
        case INCORRECT_ANSWER:
          return '不正解'
      }
    }
  }
}
</script>
