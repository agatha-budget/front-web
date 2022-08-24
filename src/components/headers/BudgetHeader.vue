<template>
    <div id="budgetHeader">
       <!--Calendar-->
      <DateNav :fromPage="'budget'" :money="money" @change-month="changeMonth"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DateNav from '@/components/inputs/DateNavigation.vue'
import Utils from '@/utils/Utils'

interface BudgetHeaderData {
    budgetMonth: number;
    budgetMoney: number;
}

export default defineComponent({
  name: 'BudgetHeader',
  components: {
    DateNav
  },
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
      budgetMonth: this.$props.month,
      budgetMoney: this.$props.money
    }
  },
  methods: {
    changeMonth (message: string) {
      this.$emit('changeMonth', message)
    },
    addSpacesInThousand (number: number): string {
      return Utils.addSpacesInThousand(number)
    }
  }
})
</script>
