<style scoped>
  .header-style {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
</style>

<template>
  <div>
    <v-toolbar
      dense
      class="header-style"
    >
      <v-toolbar-title>Microsoft Dynamics 365 {{ examFile }}過去問</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="btn-style"
        depressed
        :disabled="!items.length"
        @click="finish"
      >
        終了する
      </v-btn>
    </v-toolbar>
    <v-row v-if="items.length > 0" justify="center" align="center" class="pa-3 pt-15">
      <v-col cols="6" align="end">
        <v-progress-linear
          v-model="progressLinear"
          color="blue-grey"
          height="25"
        >
          <template v-slot:default="{}">
            <strong>{{questionCnt + 1}}/{{items.length}}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col cols="12">
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item, index in items"
            :key="item.id"
            :value="item.id"
          >
            <v-card outlined>
              <v-card-title>問題{{ index + 1 }}</v-card-title>
              <v-card-text style="white-space: break-spaces;" v-html="item.question"></v-card-text>
            </v-card>
            <v-card flat style="margin-top: 20px;">
              <component
                :is="getChoicesType(item.choices_type)"
                :item="Object.assign({}, item)"
                :index="index"
                :resultFlg="resultAnswerIds.indexOf(item.id) >= 0"
              ></component>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="12">
        <Footer ref="footer" @nextTab="nextTab" @prevTab="prevTab" @jumpTab="jumpTab" @resultAnswer="resultAnswer" />
      </v-col>
    </v-row>
    <v-row v-else no-gutters justify="center" align="center" class="pa-3 pt-15">
      <v-col cols="12" align="center">
        表示する問題が存在しません
      </v-col>
      <v-col cols="12" align="center">
        <v-btn
          color="primary"
          class="btn-style"
          depressed
          to="/"
        >
          トップへ戻る
        </v-btn>
      </v-col>
    </v-row>
    <ConfirmDialog ref="dialog" @execute="execute">
      <template v-slot:title>
        終了確認
      </template>
      <template v-slot:message>
        <div>試験を終了し解答確認画面へ移動しますか？</div>
      </template>
    </ConfirmDialog>
  </div>
</template>

<script>
import MultiChoices from '~/components/MultiChoices.vue'
import SoloChoices from '~/components/SoloChoices.vue'
import HotSpotChoices from '~/components/HotSpotChoices.vue'
import DragDropChoices from '~/components/DragDropChoices.vue'
import Footer from '~/components/Footer.vue'
import ConfirmDialog from '~/components/ConfirmDialog.vue'
import { historyType } from '../constants/constants'

const CORRECT_ANSWER = historyType.CORRECT_ANSWER
const INCORRECT_ANSWER = historyType.INCORRECT_ANSWER

export default {
  components: { SoloChoices, MultiChoices, HotSpotChoices, DragDropChoices, Footer, ConfirmDialog },
  data () {
    return {
      tab: 1,
      questionCnt: 0,
      displayIds: [],
      items: [],
      answer: [],
      examFile: this.$route.query.exam.replace('.json', ''),
      resultAnswerIds: [],
      progressLinear: 0
    }
  },
  watch: {
    questionCnt() {
      this.progressLinear = (this.questionCnt + 1) / this.items.length * 100
    }
  },
  beforeDestroy() {
    //キーコードによる動作の削除
    window.removeEventListener("keydown", this.keyAction)
  },
  created() {
    try {
      this.items = require(`../json/${this.$route.query.exam}`)
      const type = this.$route.query.type
      if (type === 'weak') {
        const storage = JSON.parse(localStorage.getItem(`history-${this.$route.query.exam}`))
        if (!storage) {
          return
        }
        let correctAnswer = []
        let incorrectAnswer = []
        for (let i = 0; i < storage.length; i++) {
          const history = Object.values(storage[i])[0]
          correctAnswer = correctAnswer.concat(history[CORRECT_ANSWER])
          incorrectAnswer = incorrectAnswer.concat(history[INCORRECT_ANSWER])
        }
        this.items = this.items.filter(item => {
          const correctCount = correctAnswer.filter(correct => correct === item.id).length
          const incorrectCount = incorrectAnswer.filter(incorrect => incorrect.id === item.id).length
          let correctRate = (correctCount / (correctCount + incorrectCount)) * 100
          correctRate = isNaN(correctRate) ? -1 : correctRate
          return correctRate !== -1 && correctRate <= 50
        })
      } else if (type === 'shuffle') {
        const shuffleArray = array => {
          array.sort((item) => {
            switch(item.choices_type) {
              case 'hotspot':
                item.sub_questions.forEach(subQuestions => {
                  subQuestions.choices.sort(() => Math.random() - 0.5)
                })
                break
              default:
                item.choices.sort(() => Math.random() - 0.5)
                break
            }
            return Math.random() - 0.5
          })
        }
        shuffleArray(this.items)
      }
      this.displayIds = this.items.map(item => item.id)
      this.tab = this.displayIds[this.questionCnt]
      this.progressLinear = (this.questionCnt + 1) / this.items.length * 100
    } catch(err) {}
    window.addEventListener("keydown", this.keyAction)
  },
  methods: {
    getChoicesType(type) {
      switch(type) {
        case 'solo':
          return 'solo-choices'
        case 'multi':
          return 'multi-choices'
        case 'hotspot':
          return 'hot-spot-choices'
        case 'dragdrop':
          return 'drag-drop-choices'
      }
    },
    nextTab() {
      if (this.questionCnt < this.displayIds.length - 1) {
        this.questionCnt++
        this.tab = this.displayIds[this.questionCnt]
        document.getElementsByTagName('html')[0].scrollTop = 0
      } else {
        const footer = this.$refs.footer
        if (footer) {
          footer.changeDialogFlg(true)
        }
      }
    },
    prevTab() {
      if (this.questionCnt > 0) {
        this.questionCnt--
        this.tab = this.displayIds[this.questionCnt]
        document.getElementsByTagName('html')[0].scrollTop = 0
      }
    },
    jumpTab(tab) {
      const number = Number(tab)
      if (!isNaN(number) && number <= this.items.length && number > 0) {
        this.questionCnt = number - 1
        this.tab = this.displayIds[number - 1]
        document.getElementsByTagName('html')[0].scrollTop = 0
      }
    },
    resultAnswer() {
      this.resultAnswerIds.push(this.tab)
    },
    finish() {
      const dialog = this.$refs.dialog
      if (dialog) {
        dialog.changeDialogFlg(true)
      }
    },
    execute() {
      this.$router.push({ path: 'answer', query: { exam: this.$route.query.exam }})
    },
    keyAction(e) {
      switch(e.keyCode) {
        case 39:
          this.nextTab()
          break
        case 37:
          this.prevTab()
          break
        case 40:
          this.resultAnswer()
          break
        default:
          break
      }
    }
  }
}
</script>
