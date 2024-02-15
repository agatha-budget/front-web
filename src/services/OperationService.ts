import type { Account, Operation, OperationWithDaughters } from '@/model/model'
import { operationApi } from '@/services/api/apis'
import { useBudgetStore } from '@/stores/budgetStore'
import { ResultAsync } from "neverthrow"

export default class OperationService {

  public static getOperations(
    account: Account,
    categoryId: string | null = null
  ): ResultAsync<OperationWithDaughters[], Error> {
    
    return ResultAsync.fromPromise(
      operationApi.findOperationsByAccount(account.id, categoryId || undefined),
      () => Error("error while contacting the DB")
    ).map((response) => response.data)
  }
  
  public static async addOperation(
    accountId: string,
    day?: number,
    categoryId?: string,
    amount?: number,
    memo?: string,
    isPending?: boolean,
    motheroperationId?: string
  ): Promise<Operation> {
    const response = await operationApi.addOperation(
      accountId,
      day,
      categoryId,
      amount,
      memo,
      isPending,
      motheroperationId
    )
    useBudgetStore().updateAccounts()
    return response.data
  }

  public static async deleteOperation(operationId: string) {
    await operationApi.deleteOperation(operationId)
    useBudgetStore().updateAccounts()
  }

  public static async updateOperation(
    operationId: string,
    accountId: string,
    day?: number,
    categoryId?: string,
    removeCategory?: boolean,
    amount?: number,
    memo?: string,
    isPending?: boolean,
    motheroperationId?: string
  ): Promise<Operation> {
    const response = await operationApi.updateOperation(
      operationId,
      accountId,
      day,
      categoryId,
      removeCategory,
      amount,
      memo,
      isPending,
      motheroperationId
    )
    useBudgetStore().updateAccounts()
    return response.data
  }

  public static async importOfxFile(
    accountId: string,
    ofxFileContent: string
  ): Promise<string> {
    const response = await operationApi.importOfxFile(accountId, ofxFileContent)
    useBudgetStore().updateAccounts()
    return response.data
  }

  public static updateOperationLocally(new_operation: OperationWithDaughters, old_operation: OperationWithDaughters) {

  }

}
