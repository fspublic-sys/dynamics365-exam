<template>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card outlined class="pl-2">
          <v-radio-group v-model="answer">
            <v-radio
              v-for="choices in item.choices"
              :key="choices.no"
              :label="choices.text"
              :value="choices.no"
            ></v-radio>
          </v-radio-group>
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
      answer: '',
    }
  }
}
</script>
