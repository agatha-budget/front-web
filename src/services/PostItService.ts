import { PostIt } from '@/model/model'
import { postItApi } from './api/apis'
import { redirectOnApiError } from '@/router'
import { AxiosError, AxiosResponse } from 'axios'

export default class PostItService {
  public static async getPostIt (month: number, budgetId: string): Promise<PostIt> {
    return postItApi.getPostIt(month, budgetId)
      .then((r: AxiosResponse) => {
        return r.data
      })
      .catch((e: AxiosError) => {
        redirectOnApiError(e)
      })
  }

  public static async updatePostIt (month: number, budgetId: string, content: string) {
    const response = await postItApi.updatePostIt(month, budgetId, content)
  }
}
