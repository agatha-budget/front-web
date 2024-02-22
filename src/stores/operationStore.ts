import type { Account, OperationWithDaughters } from '@/model/model'
import OperationService from '@/services/OperationService'
import Utils from '@/utils/Utils'
import { defineStore } from 'pinia'

export const useOperationStore = defineStore('operation', {
  state: () => ({
    operations: {} as Record<string, OperationWithDaughters[]>,
    storeLoaded: false,
  }),
  actions: {
    reset() {
      this.operations = {}
      this.storeLoaded = false
    },
    retrieveOperations(accounts: Account[]) {
      this.operations = {} // reset to prevent duplication of operations
      Promise.all(accounts.map(
        async (account) => this.retrieveOperationsForAccount(account))
      ).then(
        () => this.storeLoaded = true
      )
    },
    async retrieveOperationsForAccount(account: Account) {
      let res = await OperationService.getOperations(account)
        if (res.isOk()) {
          this.operations[account.id] = res.value
        } else {
          alert(`Désolée ! un problème est survenu lors du chargement des opérations du compte ${account.name}`)
        }
    },
    getOperationByAccount(accountId: string) : OperationWithDaughters[] {
      return this.operations[accountId] 
    },
    getOperationByAccountAndCategory(accountId: string, categoryId: string) : OperationWithDaughters[] {
      const operations: OperationWithDaughters[] = []
      for (const op of this.operations[accountId]) {
        if (op.categoryId === categoryId) {
          operations.push(op)
        }
      }
      return operations 
    },
    addOperationToAccount(accountId: string, operation: OperationWithDaughters) {
      this.operations[accountId] = Utils.insertInListSortedByDate(operation, this.operations[accountId])
    },
    updateOperationInAccount(accountId: string, operation: OperationWithDaughters) {
      const index = this.getOperationIndex(operation, this.operations[accountId])
      if (index > 0) {
        this.operations[accountId].splice(index, 1, operation)
      }    
    },
    deleteOperationInAccount(account: Account, operation: OperationWithDaughters) {
      const index = this.getOperationIndex(operation, this.operations[account.id])
      if (index > 0) {
        this.operations[account.id].splice(index, 1)
      }
    },
    getOperationIndex(operation: OperationWithDaughters, operationList: OperationWithDaughters[]) : number{
      for (const [index, op] of operationList.entries()) {
        if (op.id === operation.id) {
          return index
        }
      }
      return -1
    }
  }
})
