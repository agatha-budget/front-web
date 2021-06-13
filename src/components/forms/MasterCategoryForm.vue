<template>
  <div id="operationForm" class="operation">
    <span class="name"><input id="newName" class="form-control" v-model="name"></span>
    <span class="validation">
      <button class="btn fas fa-check" v-on:click="updateMasterCategory"/>
      <button class="btn fas fa-times" v-on:click="this.$emit('loosesFocus')"/>
      <button class="btn fas fa-archive" v-on:click="archiveMasterCategory"/>
      <button class="btn fas fa-plus" v-on:click="createCategory"/>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import StoreHandler from '@/store/StoreHandler'
import MasterCategoryService from '@/services/MasterCategoryService'
import { MasterCategory } from '@/model/model'

interface CategoryFormData {
  name: string;
}

export default defineComponent({
  name: 'CategoryForm',
  data (): CategoryFormData {
    return {
      name: this.masterCategory.name
    }
  },
  props: {
    masterCategory: {
      type: Object as () => MasterCategory,
      required: true
    }
  },
  emits: ['loosesFocus', 'createCategory'],
  methods: {
    updateMasterCategory () {
      MasterCategoryService.renameMasterCategory(this.masterCategory.id, this.name).then(
        () => {
          StoreHandler.updateMasterCategories(this.$store)
          this.$emit('loosesFocus')
        }
      )
    },
    archiveMasterCategory () {
      MasterCategoryService.archiveMasterCategory(this.masterCategory.id).then(
        () => {
          StoreHandler.updateMasterCategories(this.$store)
          this.$emit('loosesFocus')
        }
      )
    },
    createCategory () {
      this.$emit('createCategory')
      this.$emit('loosesFocus')
    }
  }
})
</script>