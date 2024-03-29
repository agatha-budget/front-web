<template>
  <div :class="css">
    <div class="bankPage menuLayout row col-md-8 offset-md-2 col-xxl-6 offset-xxl-3">
        <div class="header fixed title">
          {{ $t('BANKS') }}
        </div>
        <div class="placeholder top">
          {{ $t('BANKS') }}
        </div>

        <div class="banner">
          <div class="title">{{ $t('ACCOUNT_ASSOCIATION') }}</div>
        </div>

        <template v-for="account of accounts" :key="account">
          <div class="associationForm">
            <div class="subtitle col-md-4">{{ account.name }}</div>
            <div class="col-md-4 col-8 offset-2 offset-md-0 bankSelector">
              <select class="form-select" v-model="bankAssociation[account.id].bankAccountId">
                <option value="none" selected>{{ $t('NO_ASSOCIATED_BANK_ACCOUNT') }}</option>
                <template v-for="bankAccount of bankAccounts" :key="bankAccount">
                  <option :value=bankAccount.id>
                  {{ bankAccount.name }}
                  </option>
                </template>
              </select>
            </div>
            <div class="col-md-4 col-8 offset-2 offset-md-0 historyCheckBox">
              <template  v-if="displayImportHistoryOption(account)">
                <label class="form-check-label" for="importHistory">{{ $t('IMPORT_HISTORY') }}</label>
                <input id="importHistory" class="form-check-input" type="checkbox" v-model="bankAssociation[account.id].importHistory" >
              </template>
            </div>
          </div>
        </template>

        <button class="actionButton" v-on:click="saveAssociation()">{{ $t('UPDATE') }}</button>

        <div class="banner">
          <div class="title">{{ $t('SYNCHRONISED_BANKS') }}</div>
        </div>

        <template v-for="(timestampList, bankId) of authorizedBanks" :key="bankId">
            <div class="container bordered row col-8 offset-2">
              <div class="col-md-6">
                <img class="illustration banklogo" alt="banklogo" :src="getLogo(bankId.toString())"/>
              </div>
              <div class="col-md-6">
                <template v-for="(bankAccountArray, timestamp) of timestampList" :key="timestamp">
                  <div class="subtext">
                  {{ $t('EXPIRE_ON') }} {{ getExpirationDateFromTimestamp(timestamp) }}
                  </div>
                  <div v-for="bankAccount of bankAccountArray">
                    {{ bankAccount.name }}
                  </div>
                </template>
              </div>
            </div>
        </template>

        <div class="container bordered col-8 offset-2">
          <div class="subtitle">{{ $t('ADD_BANK_AUTHORIZATION') }}</div>
          <p>{{ $t('WHY_ADD_AUTHORIZATION_TEXT_P1') }}</p>
          <p class="bold">{{ $t('WHY_ADD_AUTHORIZATION_TEXT_P2') }}</p>
          <p>{{ $t('WHY_ADD_AUTHORIZATION_TEXT_P3') }}</p>

          <Multiselect
            v-model="selectedBankId"
            :groups="false"
            :searchable="true"
            :options="bankOptions"
            :noResultsText="$t('NO_RESULT_FOUND')"
            :placeholder="$t('SELECT_BANK')"
          />
          <button class="actionButton" v-on:click="getBankAuthorization">{{ $t('AUTHORIZE') }}</button>
        </div>
        <div class="placeholder bottom">
          <NavMenu :page="'profile'" />
        </div>
        <div class="footer fixed">
          <NavMenu :page="'profile'" />
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import NavMenu from '@/components/NavigationMenu.vue'
import type { Account, Bank, BankAccount, Budget, SelectOption } from '@/model/model'
import router, { RouterPages } from '@/router'
import AccountService from '@/services/AccountService'
import BankingService from '@/services/BankingService'
import { useBudgetStore } from '@/stores/budgetStore'
import { usePersonStore } from '@/stores/personStore'
import Time from '@/utils/Time'
import Multiselect from '@vueform/multiselect'
import { defineComponent } from 'vue'



interface BankAccountByTimestampList {
  [timestamp: number]: BankAccount[];
}

interface BankAuthorizationList {
  [bankId: string]: BankAccountByTimestampList;
}

interface BankAssociationData {
  bankAccountId: string;
  importHistory: boolean;
}

interface BankAssociationList {
  [accountId: string]: BankAssociationData;
}

interface BanksData {
  availableBanks: Bank[];
  bankAccounts: BankAccount[];
  bankAssociation: BankAssociationList;
  selectedBankId: string|null;
}

export default defineComponent({
  name: 'BanksView',
  components: { NavMenu, Multiselect },
  created: async function () {
    useBudgetStore().init()
    this.getAvailableBanks()
    this.getAuthorizedAccounts()
    this.updateIfAgreement()
    this.updateAssociationData()
  },
  props: {
    query: {
      type: String,
      required: false
    }
  },
  data (): BanksData {
    return {
      availableBanks: [],
      bankAccounts: [],
      bankAssociation: {},
      selectedBankId: null
    }
  },
  watch: {
    budget: async function () {
      this.getAuthorizedAccounts()
    },
    accounts: async function () {
      this.updateAssociationData()
    }
  },
  computed: {
    budget (): Budget | null {
      return useBudgetStore().budget
    },
    accounts (): Account[] | null {
      return useBudgetStore().accounts
    },
    authorizedBanks (): BankAuthorizationList | null {
      return this.groupAccountByBankAndTimestamp(this.bankAccounts)
    },
    bankOptions (): SelectOption[] {
      const optionsList = []
      for (const bank of this.availableBanks) {
        const option = { value: bank.id, label: bank.name }
        optionsList.push(option)
      }
      return optionsList
    },
    css (): string {
      return usePersonStore().css
    }
  },
  methods: {
    getAvailableBanks () {
      BankingService.getAvailableBanks().then(
        (bankList) => {
          this.availableBanks = bankList
        }
      )
    },
    getAuthorizedAccounts () {
      if (this.budget) {
        BankingService.getAuthorizedAccounts(this.budget).then(
          (bankAccountList) => {
            this.bankAccounts = bankAccountList
          }
        )
      }
    },
    getBankAuthorization () {
      if (this.budget && this.selectedBankId) {
        BankingService.goToBankAgreement(this.budget, this.selectedBankId)
      }
    },
    updateIfAgreement () {
      if (this.$props.query != null) {
        const agreementId = this.$props.query.split('?')[0]
        BankingService.updateBankAccountList(agreementId)
        router.push(RouterPages.banks)
      }
    },
    updateAssociationData () {
      if (this.accounts) {
        for (const i in this.accounts) {
          const account = this.accounts[i]
          this.bankAssociation[account.id] = {
            bankAccountId: account.bankAccountId || 'none',
            importHistory: false
          }
        }
      }
    },
    displayImportHistoryOption (account: Account): boolean {
      return (this.bankAssociation[account.id].bankAccountId !== account.bankAccountId && this.bankAssociation[account.id].bankAccountId !== 'none')
    },
    saveAssociation () {
      if (this.accounts) {
        for (const i in this.accounts) {
          const account = this.accounts[i]
          const bankAccountId = this.bankAssociation[account.id].bankAccountId
          const importHistory = this.bankAssociation[account.id].importHistory
          if (account.bankAccountId !== bankAccountId) {
            AccountService.updateAccountBankAssociation(account.id, bankAccountId, importHistory)
          }
        }
        useBudgetStore().updateAccounts()
      }
    },
    groupAccountByBankAndTimestamp (bankAccounts: BankAccount[]): BankAuthorizationList {
      const banks: BankAuthorizationList = {}
      bankAccounts.forEach(function (bankAccount) {
        if (bankAccount.bankId in banks) {
          const bankIdList = banks[bankAccount.bankId]
          if (bankAccount.timestamp in bankIdList) {
            bankIdList[bankAccount.timestamp].push(bankAccount)
          } else {
            bankIdList[bankAccount.timestamp] = [bankAccount]
          }
        } else {
          const timeStampList: BankAccountByTimestampList = {}
          timeStampList[bankAccount.timestamp] = [bankAccount]
          banks[bankAccount.bankId] = timeStampList
        }
      })
      return banks
    },
    getLogo (bankId: string): string {
      for (const bank of this.availableBanks) {
        if (bank.id === bankId) {
          return bank.logo
        }
      }
      return 'not found'
    },
    getExpirationDateFromTimestamp (timestamp: number): string {
      const expirationTimestamp = Time.after90Days(timestamp)
      return Time.getDateStringFromTimestamp(expirationTimestamp)
    }
  }
})
</script>
