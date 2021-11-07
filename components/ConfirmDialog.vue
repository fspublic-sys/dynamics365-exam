
<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <v-card outlined>
      <v-card-title>
        <slot name="title"></slot>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="white-space: break-spaces;padding-top: 20px;">
        <slot name="message"></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          depressed
          @click="$emit('execute')"
        >
          はい
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          いいえ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false
    }
  },
  methods: {
    changeDialogFlg(flg) {
      this.dialog = flg
    }
  }
}
</script>
