<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-card outlined class="px-2">
        <v-row
          v-for="choices in item.choices"
          :key="choices.no"
          no-gutters
          align="center"
        >
          <v-col cols="6" class="py-2">
            {{ choices.text }}
          </v-col>
          <v-col cols="6" class="py-2">
            <v-select
              :items="choices.custom_choices"
              item-text="text"
              item-value="no"
              outlined
              dense
              hide-details
            ></v-select>
          </v-col>
        </v-row>
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
