<template>
  <div class="pa-3">
    <v-row
      no-gutters
      class="mb-3"
    >
      <v-col
        cols="12"
        align="center"
      >
        Microsoft Dynamics 365　過去問勉強ツール
      </v-col>
    </v-row>
    <v-row
      no-gutters
      justify="center"
      class="mb-3"
    >
      <v-col cols="4">
        <v-select
          v-model="choiseFile"
          :items="files"
          dense
          hide-details
          outlined
          label="試験を選択"
          @change="changeFile"
        ></v-select>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      justify="center"
      class="mb-3"
    >
      <v-col
        cols="12"
        align="center"
      >
        <v-btn
          color="primary"
          depressed
          :disabled="!choiseFile"
          @click="openDialog"
        >
          試験を開始
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      justify="center"
      class="mb-3"
    >
      <v-col
        cols="12"
        align="center"
      >
        <v-btn
          color="primary"
          depressed
          :disabled="!choiseFile || !strage"
          :to="{ path: 'answer', query: { exam: choiseFile }}"
        >
          解答履歴を確認
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      justify="center"
    >
      <v-col
        cols="12"
        align="center"
      >
        <v-btn
          color="success"
          depressed
          @click="setting"
        >
          設定
        </v-btn>
      </v-col>
    </v-row>
    <mode-select-dialog ref="dialog" :choiseFile="choiseFile" />
    <setting-dialog ref="settingDialog" />
  </div>
</template>

<script>
import axios from 'axios'
import ModeSelectDialog from '~/components/ModeSelectDialog.vue'
import SettingDialog from '~/components/SettingDialog.vue'

export default {
  components: { ModeSelectDialog, SettingDialog },
  data () {
    return {
      choiseFile: '',
      files: [],
      strage: null
    }
  },
  async mounted() {
    const { data } = await axios.get('/api/get-json-file')
    this.files = data
  },
  methods: {
    openDialog() {
      const dialog = this.$refs.dialog
      if (dialog) {
        dialog.changeDialogFlg(true)
      }
    },
    changeFile() {
      this.strage = localStorage.getItem(`history-${this.choiseFile}`)
    },
    setting() {
      const settingDialog = this.$refs.settingDialog
      if (settingDialog) {
        settingDialog.changeDialogFlg(true)
      }
    }
  }
}
</script>
