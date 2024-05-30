<template>
  <div id="bankAccountForm" class="form">
    <div class="inline_label_input">
      <label class="label" for="selectAccount">{{ $t('ASSOCIATED_TO') }}</label>
      <select id="selectAccount" class="form-select input" v-model="associetedAccount">
        <option value=undefined>{{  }}</option>
        <template v-for="account of accounts" :key="account">
          <option :value=account>
          {{ account.name }}
          </option>
        </template>
      </select>
    </div>
    <div class="inline_label_input history">
        <label class="label" for="importHistory">{{ $t('IMPORT_HISTORY') }}</label>
        <input id="importHistory" class="form-check-input input" type="checkbox" v-model="importHistory" >
    </div>
    <button class="actionButton" v-on:click="associateAccount">{{ $t('ASSOCIATE') }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useBudgetStore } from '@/stores/budgetStore'
import type { Account, BankAccount,GroupSelectOption } from '@/model/model'

interface BankAccountFormData {
  associetedAccount: Account|undefined;
  importHistory: boolean
}

export default defineComponent({
  name: 'BankAccountForm',
  props: {
    bankAccount: {
      type: Object as () => BankAccount,
      required: true
    },
    initiallyAssociatedAccount: {
      type: Object as () => Account,
    },
  },
  data (): BankAccountFormData {
    return {
      associetedAccount: this.initiallyAssociatedAccount,
      importHistory: false
    }
  },
  computed: {
    accounts (): Account[] {
      return useBudgetStore().accounts
    }
  },
  emits: ['closeForm'],
  methods: {
    associateAccount() {

    },
    closeForm () {
      this.$emit('closeForm')
    },
  }
})
</script>
