<template>
	<div>
	  <section class="todoapp">
		<header class="header">
		  <h1>todos</h1>
		  <input
			class="new-todo"
			v-model="newTodo"
			@keyup.enter="addTodo"
			placeholder="What needs to be done?"
			autofocus
		  />
		</header>
		<section class="main" v-show="todoList.length">
		  <input
			id="toggle-all"
			class="toggle-all"
			type="checkbox"
			v-model="allDone"
		  />
		  <label for="toggle-all">Mark all as complete</label>
		  <ul class="todo-list">
			<li
			  v-for="todo in filterTodos"
			  :key="todo.id"
			  :class="{ completed: todo.completed, editing: todo === editingTodo }"
			>
			  <div class="view">
				<input class="toggle" type="checkbox" v-model="todo.completed" />
				<label @dblclick="editTodo(todo)">{{ todo.title }}</label>
				<button class="destroy" @click="removeTodo(todo)"></button>
			  </div>
			  <input
				class="edit"
				v-model="todo.title"
				v-todo-focus="todo === editingTodo"
				@keyup.esc="cancelEdit(todo)"
				@keyup.enter="doneEdit(todo)"
				@blur="doneEdit(todo)"
			  />
			</li>
		  </ul>
		</section>
		<footer class="footer" v-show="todoList.length">
		  <span class="todo-count"><strong>{{ remaining }}</strong> {{ utils() }} left</span>
		  <ul class="filters">
			<li>
			  <a
				href="#/"
				:class="{ selected: dotoFilter === 'all' }"
				@click="dotoFilter = 'all'"
			  >All</a>
			</li>
			<li>
			  <a
				href="#/active"
				:class="{ selected: dotoFilter === 'active' }"
				@click="dotoFilter = 'active'"
			  >Active</a>
			</li>
			<li>
			  <a
				href="#/completed"
				:class="{ selected: dotoFilter === 'completed' }"
				@click="dotoFilter = 'completed'"
			  >Completed</a>
			</li>
		  </ul>
		  <button
			class="clear-completed"
			v-show="remaining !== 0"
			@click="removeCompleted"
		  >Clear completed</button>
		</footer>
	  </section>
	  <footer class="info">
		<p>Double-click to edit a todo</p>
		<p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
		<p>Created by <a href="http://todomvc.com">you</a></p>
		<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
	  </footer>
	</div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useListStore } from '@/stores/todoList';

  const listStore = useListStore();
  const {todoList,TODOS_KEY} = storeToRefs(listStore)

  const KEY = TODOS_KEY.value

  
  
  // 存储 todos 的 key
  // 响应式变量
  const newTodo = ref('');
  const dotoFilter = ref('all');
  const editingTodo = ref(null);
  const beforeEditCache = ref('');
  
  // 添加 todo
  const addTodo = () => {
	const value = newTodo.value.trim();
	if (!value) return;
	todoList.value.push({ id: Date.now(), title: value, completed: false });
	newTodo.value = '';
  };

    // 监视并且修改 todoList
	watch(todoList, () => {
	localStorage.setItem(KEY,JSON.stringify(todoList.value))
  }, { deep: true });
  
  // 删除单个 todo
  const removeTodo = (todo) => {
	todoList.value.splice(todoList.value.indexOf(todo), 1);
  };
  
  // 删除已完成的 todo
  const removeCompleted = () => {
	todoList.value = todoList.value.filter(todo => !todo.completed);
  };
  
  // 编辑 todo
  const editTodo = (todo) => {
	editingTodo.value = todo;
	beforeEditCache.value = todo.title;
  };
  
  // 取消编辑
  const cancelEdit = (todo) => {
	editingTodo.value = null;
	todo.title = beforeEditCache.value;
  };
  
  // 确认编辑
  const doneEdit = (todo) => {
	if (!editingTodo.value) return;
	editingTodo.value = null;
	todo.title = todo.title.trim();
	if (!todo.title) removeTodo(todo);
  };
  
  // 计算剩余 todo 数量
  const remaining = computed(() => todoList.value.filter(todo => !todo.completed).length);
  
  // 过滤器
  const filterTodos = computed(() => {
	if (dotoFilter.value === 'active') {
	  return todoList.value.filter(todo => !todo.completed);
	} else if (dotoFilter.value === 'completed') {
	  return todoList.value.filter(todo => todo.completed);
	}
	return todoList.value;
  });
  

  
  // 处理全选
  const allDone = computed({
	get: () => remaining.value === 0,
	//value是checkebox 给的，选上为true 否则false
	set: (value) => {
	  todoList.value.forEach(todo => todo.completed = value);
	}
  });


  //单位，大于1为items ，小于1item
  const utils = ()=>{
	return remaining.value > 1 ? 'items':'item'
  }
  
  </script>
  
  <style scoped>

  </style>
  