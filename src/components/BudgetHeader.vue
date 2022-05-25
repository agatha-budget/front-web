<template>
    <div id="budgetHeader">
       <!--Calendar-->
      <div class="row dateNav">
          <div class="col-2 d-flex justify-content-center" ><button type="button" class="btn fas fa-chevron-left" v-on:click="this.goToLastMonth()"/></div>
          <div class="col-8 date-label" :class="this.toBeBudgetedClass()">
              <p class="title">{{ $d(this.getMonthAsDate(budgetMonth), 'monthString') }} <span v-if="!this.isThisYear"> {{ $d(this.getMonthAsDate(budgetMonth), 'year') }}</span></p>
              <p class="title" v-if="this.money > 0"> {{ addSpacesInThousand(money) }} € {{$t('TO_BE_BUDGETED')}}</p>
              <p class="title" v-else-if="this.money < 0"> {{ addSpacesInThousand(-1 * money) }} € {{$t('TO_BE_PULLED_OUT')}}</p>
          </div>
          <div class="col-2 d-flex justify-content-center" ><button type="button" class="btn fas fa-chevron-right" v-on:click="this.goToNextMonth()"/></div>
      </div>
        <!-- Table column label-->
      <div class="flexForm row">
        <div class="col-6">
          <button class="btn fas fa-paperclip"/>
        </div>
        <div class="budgetTable col-6">
          <div class="masterCategory collapsed row">
              <div class="col-4">{{ $t("ALLOCATED") }}</div>
              <div class="spent col-4">{{ $t("SPENT") }}</div>
              <div class="col-4">{{ $t("AVAILABLE") }}</div>
          </div>
        </div>
      </div>
        <!-- Total for all table-->
      <table  class="budgetTable col-12">
        <thead class="masterCategory collapsed">
          <tr>
            <th class="col-6">{{ $t("TOTAL") }}</th>
            <th class="col-2">{{ addSpacesInThousand(totalAllocated) }}</th>
            <th class="col-2 spent">{{ addSpacesInThousand(totalSpent) }}</th>
            <th class="col-2">{{ addSpacesInThousand(totalAvailable) }}</th>
          </tr>
        </thead>
      </table>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Time from '@/utils/Time'
import Utils from '@/utils/Utils'

interface BudgetHeaderData {
    budgetMonth: number;
}

export default defineComponent({
  name: 'BudgetHeader',
  components: {},
  emits: ['changeMonth'],
  props: {
    month: {
      type: Number,
      required: true
    },
    totalAllocated: {
      type: Number,
      required: true
    },
    totalSpent: {
      type: Number,
      required: true
    },
    totalAvailable: {
      type: Number,
      required: true
    },
    money: {
      type: Number,
      required: true
    }
  },
  data (): BudgetHeaderData {
    return {
      budgetMonth: this.$props.month
    }
  },
  computed: {
    isThisYear (): boolean {
      return Time.monthIsThisYear(this.budgetMonth)
    }
  },
  methods: {
    getMonthAsDate (monthAsInt: number): Date {
      return Time.getMonthAsDate(monthAsInt)
    },
    goToNextMonth () {
      this.$emit('changeMonth', 'next')
      this.budgetMonth = Time.getNextMonth(this.budgetMonth)
    },
    goToLastMonth () {
      this.$emit('changeMonth', 'last')
      this.budgetMonth = Time.getLastMonth(this.budgetMonth)
    },
    getEurosAmount (amount: number): number {
      return Utils.getEurosAmount(amount)
    },
    toBeBudgetedClass (): string {
      if (this.money > 0) {
        return 'positive'
      } else if (this.money < 0) {
        return 'negative'
      } else {
        return 'null'
      }
    },
    addSpacesInThousand (number: number): string {
      return Utils.addSpacesInThousand(number)
    }
  }
})
</script>
