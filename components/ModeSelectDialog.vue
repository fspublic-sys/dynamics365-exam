<style scoped>
  .mode-select-table >>> td {
    border-bottom: none !important;
  }
</style>

<template>
  <v-dialog
    v-model="dialog"
    max-width="700px"
  >
    <v-card outlined>
      <v-card-title>
        モード選択
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-0" style="white-space: break-spaces;padding-top: 20px;">
        <v-data-table
          v-model="selectMode"
          :headers="headers"
          :items="modes"
          item-key="type"
          single-select
          show-select
          hide-default-header
          hide-default-footer
          class="mode-select-table"
        >
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          depressed
          :disabled="selectMode.length === 0"
          @click="startExam"
        >
          開始
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          キャンセル
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    choiseFile: {
      type: String,
      required: true,
    }
  },
  data () {
    return {
      dialog: false,
      selectMode: [],
      headers: [
        { text: '', value: 'name' },
        { text: '', value: 'description' },
      ],
      modes: [
        {
          type: 'normal',
          name: '通常',
          description: '登録されている過去問を順番通り解いていきます'
        },
        // {
        //   type: 'shuffle',
        //   name: 'シャッフル',
        //   description: '登録されている過去問をランダムな順番で解いていきます'
        // },
        {
          type: 'weak',
          name: '苦手克服',
          description: '登録されている過去問の中で正解率が50%以下の問題を解いていきます'
        }
      ]
    }
  },
  methods: {
    changeDialogFlg(flg) {
      this.dialog = flg
    },
    startExam() {
      this.$router.push({ path: 'question', query: { exam: this.choiseFile, type: this.selectMode[0].type }})
    }
  }
}
</script>
