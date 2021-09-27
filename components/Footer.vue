
<style scoped>
  .btn-style {
    opacity: 1 !important;
    box-shadow: none;
  }
  .next-btn-icon {
    min-width: 20px !important;
  }
  .jump-menu {
    background: white;
  }
</style>

<template>
  <v-footer
    app
  >
    <v-btn
      color="primary"
      class="btn-style"
      @click="$emit('prevTab')"
    >
      前の問題
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
      color="success"
      class="btn-style"
      @click="finishAnswer"
    >
      回答確認
    </v-btn>
    <v-spacer></v-spacer>
    <div class="v-item-group theme--light v-btn-toggle v-btn-toggle--dense">
      <v-btn
        color="primary"
        class="btn-style"
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
              @click="$emit('jumpTab', questionNo)"
            >
              移動
            </v-btn>
          </v-col>
        </v-row>
      </v-menu>
    </div>
  </v-footer>
</template>

<script>
export default {
  data () {
    return {
      showTooltip: false,
      questionNo: undefined
    }
  },
  methods: {
    finishAnswer() {
      this.$router.push({ path: 'answer' })
    }
  }
}
</script>
