import type { Account, OperationWithDaughters } from '@/model/model'
import OperationService from '@/services/OperationService'
import { defineStore } from 'pinia'

export const useOperationStore = defineStore('operation', {
  state: () => ({
    operations: [] as OperationWithDaughters[],
    storeLoaded: false,
  }),
  actions: {
    reset() {
      this.operations = []
      this.storeLoaded = false
    },
    retrieveOperations(accounts: Account[]) {
      this.operations = [] // reset to prevent duplication of operations
      Promise.all(accounts.map(
        async (account) => this.retrieveOperationsForAccount(account))
      ).then(
        () => this.storeLoaded = true
      )
    },
    async retrieveOperationsForAccount(account: Account) {
      let res = await OperationService.getOperations(account)
        if (res.isOk()) {
          this.operations = this.operations?.concat(res.value)
        } else {
          alert(`Désolée ! un problème est survenu lors du chargement des opérations du compte ${account.name}`)
        }
    },
    getOperationByAccount(accountId: string) : OperationWithDaughters[] {
      const operations: OperationWithDaughters[] = []
      for (const op of this.operations) {
        if (op.accountId === accountId) {
          operations.push(op)
        }
      }
      return operations 
    },
    getOperationByAccountAndCategory(accountId: string, categoryId: string) : OperationWithDaughters[] {
      const operations: OperationWithDaughters[] = []
      for (const op of this.operations) {
        if (op.accountId === accountId && op.categoryId === categoryId) {
          operations.push(op)
        }
      }
      return operations 
    },
  }
})
