
<style scoped>
  .btn-style {
    color: white !important;
    opacity: 1 !important;
  }
  .next-btn-icon {
    min-width: 20px !important;
  }
  .jump-menu {
    background: white;
  }
  .active-btn-style::before {
    opacity: 0 !important;
  }
</style>

<template>
  <v-footer
    app
  >
    <v-btn
      color="primary"
      class="btn-style"
      depressed
      @click="$emit('prevTab')"
    >
      前の問題
    </v-btn>
    <v-spacer v-if="footerLeftJustified !== '1'"></v-spacer>
    <v-btn
      v-if="footerLeftJustified !== '1'"
      color="success"
      class="btn-style"
      depressed
      @click="$emit('resultAnswer')"
    >
      解答確認
    </v-btn>
    <v-spacer v-if="footerLeftJustified !== '1'"></v-spacer>
    <v-btn-toggle dense active-class="active-btn-style" :class="footerLeftJustified === '1' ? 'mx-4' : ''">
      <v-btn
        color="primary"
        class="btn-style"
        depressed
        @click="$emit('nextTab')"
      >
        次の問題
      </v-btn>
      <v-menu
        top
        offset-y
        nudge-top="10"
        content-class="jump-menu"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="pa-0 btn-style next-btn-icon"
            depressed
            @click="showTooltip = !showTooltip"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon v-if="showTooltip" dense>mdi-menu-down</v-icon>
            <v-icon v-else dense>mdi-menu-up</v-icon>
          </v-btn>
        </template>
        <v-row no-gutters class="pa-3">
          <v-col cols="12">
            <v-text-field
              v-model="questionNo"
              dense
              label="入力した問題番号へ移動"
              type="number"
            >
            </v-text-field>
          </v-col>
          <v-col align="end" cols="12">
            <v-btn
              color="primary"
              class="btn-style"
              depressed
              @click="$emit('jumpTab', questionNo)"
            >
              移動
            </v-btn>
          </v-col>
        </v-row>
      </v-menu>
    </v-btn-toggle>
    <v-btn
      v-if="footerLeftJustified === '1'"
      color="success"
      class="btn-style"
      depressed
      @click="$emit('resultAnswer')"
    >
      解答確認
    </v-btn>
    <ConfirmDialog ref="dialog" @execute="execute">
      <template v-slot:title>
        終了確認
      </template>
      <template v-slot:message>
        <div>最後の問題の解答が完了しました。</div>
        <div>試験を終了し解答確認画面へ移動しますか？</div>
      </template>
    </ConfirmDialog>
  </v-footer>
</template>

<script>
import ConfirmDialog from '~/components/ConfirmDialog.vue'

export default {
  components: { ConfirmDialog },
  data () {
    return {
      showTooltip: false,
      questionNo: undefined,
      footerLeftJustified: undefined
    }
  },
  watch: {
    showTooltip() {
      this.questionNo = undefined
    }
  },
  mounted() {
    this.footerLeftJustified = localStorage.getItem('footer-left-justified')
  },
  methods: {
    execute() {
      this.$router.push({ path: 'answer', query: { exam: this.$route.query.exam }})
    },
    changeDialogFlg(flg) {
      const dialog = this.$refs.dialog
      if (dialog) {
        dialog.changeDialogFlg(flg)
      }
    }
  }
}
</script>
