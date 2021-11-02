
<template>
  <v-dialog
    scrollable
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        x-small
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-card-multiple-outline</v-icon>
      </v-btn>
    </template>
    <v-card outlined>
      <v-card-title>問題{{ id }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="white-space: break-spaces;padding-top: 20px;" v-html="question"></v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true,
    }
  },
  data () {
    return {
    }
  }
}
</script>
