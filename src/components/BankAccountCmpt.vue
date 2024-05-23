<template>
  <div class="bankAccount container bordered">
      <img class="illustration logo" alt="banklogo" :src="logo"/>
      <div class="bankAccountTitle">
        <span class="name bold subtitle">{{ bankAccount.name }}</span>
        <span class="balance subtitle">{{ diplayedBalance}}€</span>
        <span class="until subtext">
          {{ $t('AUTHORISED_UNTIL') }}
          <span class="bold">{{syncedUntil}}</span>
        </span>
      </div>
      <button class="illustration btn fas fa-pen action" :title="$t('EDIT')" />
      <span class="associated" v-if="associatedAccount">
        {{ $t('ASSOCIATED_TO') }} 
        <span class="bold">{{associatedAccount.name}}</span>
      </span>
  </div>
</template>

<script lang="ts">
import type { Account, BankAccount } from '@/model/model'
import Time from '@/utils/Time'
import { useBudgetStore } from '@/stores/budgetStore'
import { defineComponent } from 'vue'
import Utils from '@/utils/Utils'


export default defineComponent({
  name: 'BankAccountCmpt',
  props: {
    bankAccount: {
      type: Object as () => BankAccount,
      required: true
    },
    logo: {
      type: String,
      required: true
    }
  },
  computed: {
    accounts (): Account[] {
      return useBudgetStore().accounts
    },
    diplayedBalance() : String {
      if (this.bankAccount.balance) {
        return Utils.centsToEurosDisplay(this.bankAccount.balance)
      } else {
        return "Solde inconnu"
      }
    },
    associatedAccount(): Account|null {
      return useBudgetStore().getAccountByBankAccountId(this.bankAccount.id)
    },
    syncedUntil(): String {
      return Time.getDateStringFromTimestamp(Time.after90Days(this.bankAccount.timestamp))
    }
  },
  methods: {
  }
})
</script>
