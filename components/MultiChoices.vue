<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card outlined class="pl-2 pb-4">
        <v-checkbox
          v-model="answer"
          v-for="choices in item.choices"
          :key="choices.no"
          :label="choices.text"
          :value="choices.no"
          hide-details
        >
        </v-checkbox>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      answer: [],
    }
  }
}
</script>
