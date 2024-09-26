import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useListStore = defineStore('todoList',()=>{
    const todoList = reactive(
        JSON.parse(localStorage.getItem('todos-vue')) || []
    )

    const TODOS_KEY = ref('todos-vue')

    return {todoList,TODOS_KEY}
})