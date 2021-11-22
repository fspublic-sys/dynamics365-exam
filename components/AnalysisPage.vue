
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
    width: calc(100% - 24px);
    float: left;
  }
  .grades-color-1 {
    color: red;
  }
  .grades-color-2 {
    color: blue;
  }
  .target-analysis-total-data >>> .col {
    padding: 8px;
  }
  .target-analysis-total-data >>> .total-header {
    background: lightgray;    
  }
</style>
<template>
  <div>
    <v-row no-gutters class="ma-3">
      <v-btn
        color="primary"
        depressed
        to="/"
      >
        トップへ戻る
      </v-btn>
    </v-row>
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
        累計結果
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
          <question-dialog :id="props.item.id" :question="props.item.question" />
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
        実施時間別結果
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
      <v-card
        outlined
        class="ma-2"
      >
        <v-row
          no-gutters
          class="target-analysis-total-data"
        >
          <v-col cols="2" class="total-header">正解数</v-col>
          <v-col cols="2" align="end">{{ targetCorrectCount }}</v-col>
          <v-col cols="2" class="total-header">不正解数</v-col>
          <v-col cols="2" align="end">{{ targetIncorrectCount }}</v-col>
          <v-col cols="2" class="total-header">正解率</v-col>
          <v-col
            v-if="calcCorrectRate(targetCorrectCount, targetIncorrectCount) >= 0"
            cols="2"
            align="end"
          >
            {{ calcCorrectRate(targetCorrectCount, targetIncorrectCount).toFixed(1) }}%
          </v-col>
          <v-col v-else cols="2" align="end">-</v-col>
        </v-row>
      </v-card>
      <v-row no-gutters class="mt-2">
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
              <question-dialog :id="props.item.id" :question="props.item.question" />
            </template>
            <template v-slot:item.grades="props">
              <span
                :class="'grades-color-' + props.item.grades"
              >
                {{ getGrades(props.item.grades) }}
              </span>
              <answer-dialog v-if="props.item.grades !== 0" :item="props.item" :resultFlg="true" />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { historyType } from '../constants/constants'
import QuestionDialog from '~/components/QuestionDialog.vue'
import AnswerDialog from '~/components/AnswerDialog.vue'

const UNANSWERED = historyType.UNANSWERED
const CORRECT_ANSWER = historyType.CORRECT_ANSWER
const INCORRECT_ANSWER = historyType.INCORRECT_ANSWER

export default {
  components: { QuestionDialog, AnswerDialog },
  data () {
    return {
      items: [],
      excludeUnanswered: true,
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
      targetCorrectCount: 0,
      targetIncorrectCount: 0,
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
        }
      ]
    }
  },
  watch: {
    target() {
      const storage = JSON.parse(localStorage.getItem(`history-${this.$route.query.exam}`))
      if (!storage || !this.target) {
        return
      }
      this.createTargetAnalysisItems(storage)
      this.setTargetAnalysisTotalData()
    }
  },
  created() {
    try {
      this.items = require(`../json/${this.$route.query.exam}`)
      this.items.sort((a, b) => a.id - b.id)
    } catch(err) {}
  },
  mounted() {
    const storage = JSON.parse(localStorage.getItem(`history-${this.$route.query.exam}`))
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
        const correctRate = this.calcCorrectRate(correctCount, incorrectCount)
        this.allAnalysisItems.push({
          id: item.id,
          question: item.question,
          correctCount: correctCount,
          incorrectCount: incorrectCount,
          correctRate: correctRate
        })
      }
    },
    calcCorrectRate(correctCount, incorrectCount) {
      let correctRate = (correctCount / (correctCount + incorrectCount)) * 100
      correctRate = isNaN(correctRate) ? -1 : correctRate
      return correctRate
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
          choicesType: item.choices_type,
          item: item,
          grades: historyType,
          answer: historyType === UNANSWERED ? '-' : answer
        })
      }
    },
    setTargetAnalysisTotalData() {
      this.targetCorrectCount = this.targetAnalysisItems.filter(item => item.grades === CORRECT_ANSWER).length
      this.targetIncorrectCount = this.targetAnalysisItems.filter(item => item.grades === INCORRECT_ANSWER).length
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
