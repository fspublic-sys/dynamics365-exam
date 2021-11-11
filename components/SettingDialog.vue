<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="700px"
    >
      <v-card outlined>
        <v-card-title>設定</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="white-space: break-spaces;">
          <v-checkbox
            v-model="settingInfo"
            v-for="setting in settings"
            :key="setting.id"
            :label="setting.text"
            :value="setting.id"
            hide-details
            color="dark"
          >
          </v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            depressed
            @click="confirm"
          >
            保存
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
    <v-snackbar
      v-model="snackbar"
      color="success"
      top
      :timeout="2000"
    >
      <v-icon
        dark
        right
      >
        mdi-checkbox-marked-circle
      </v-icon>
      <span style="font-size: 16px;">保存しました</span>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      snackbar: false,
      settingInfo: [],
      settings: [
        {
          id: 'footer-left-justified',
          text: '問題画面のフッター内のボタンを左寄せする'
        }
      ]
    }
  },
  mounted() {
    for (let i = 0; i < this.settings.length; i++) {
      const id = this.settings[i].id
      if (localStorage.getItem(id) !== null && localStorage.getItem(id) !== '0') {
        this.settingInfo.push(id)
      }
    }
  },
  methods: {
    confirm() {
      for (let i = 0; i < this.settings.length; i++) {
        const id = this.settings[i].id
        if (this.settingInfo.indexOf(id) >= 0) {
          localStorage.setItem(id, '1')
        } else {
          localStorage.setItem(id, '0')
        }
      }
      this.dialog = false
      this.snackbar = true
    },
    changeDialogFlg(flg) {
      this.dialog = flg
    }
  }
}
</script>
