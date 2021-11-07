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
        Dynamics365　過去問勉強ツール
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
    <ModeSelectDialog ref="dialog" :choiseFile="choiseFile" />
  </div>
</template>

<script>
import axios from 'axios'
import ModeSelectDialog from '~/components/ModeSelectDialog.vue'

export default {
  components: { ModeSelectDialog },
  data () {
    return {
      choiseFile: '',
      files: [],
      strage: null
    }
  },
  async mounted() {
    this.strage = localStorage.getItem('history')
    const { data } = await axios.get('/api/get-json-file')
    this.files = data
  },
  methods: {
    openDialog() {
      const dialog = this.$refs.dialog
      if (dialog) {
        dialog.changeDialogFlg(true)
      }
    }
  }
}
</script>
