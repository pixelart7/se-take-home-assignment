<script setup lang="ts">
import { useOrderStore } from './stores/orderStore'
import { storeToRefs } from 'pinia'
import OrderCard from './components/OrderCard.vue'

const store = useOrderStore()
const { pendingOrders, completedOrders, bots } = storeToRefs(store)
const { addOrder, addBot, removeBot } = store

</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans">
    <div class="max-w-8xl mx-auto">
      
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between items-center border-b py-2 border-gray-200 px-4 mb-4">
        <h1 class="text-base font-semibold text-gray-900 tracking-tight">🍔 McD Order Manager</h1>
      </header>

      <!-- Order Controls -->
      <section class="px-4">
        
        <div class="flex gap-4 mb-4">
          <h2 class="text-base font-semibold text-gray-700">Orders</h2>
          <div class="flex-1"></div>
          <div class="flex gap-4">
            <button 
              @click="addOrder('Normal')"
              class="px-4 py-1.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition font-semibold text-gray-700 cursor-pointer"
            >
              + New Normal Order
            </button>
            <button 
              @click="addOrder('VIP')"
              class="px-4 py-1.5 text-sm bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition font-semibold text-gray-700 cursor-pointer"
            >
              + 👑 New VIP Order
            </button>
          </div>
        </div>
      </section>

      <!-- Pending Orders -->
      <section class="px-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-700">Pending Orders <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{{ pendingOrders.length }}</span></h2>
        </div>
        
        <div class="bg-white p-4 rounded-xl shadow-sm min-h-32 border border-gray-200">
          <transition-group name="list" tag="div" class="grid grid-cols-4 gap-4">
            <OrderCard v-for="order in pendingOrders" 
            :key="order.id"
            class="contents" :order="order" status="PENDING" />
          </transition-group>
          <div v-if="pendingOrders.length === 0" class="text-center text-gray-400 min-h-24 text-xs py-4 italic flex items-center justify-center">
            No pending orders
          </div>
        </div>
      </section>

      <!-- Bot Section -->
      <section class="space-y-4 px-4 mt-8">
        <div class="flex gap-4 mb-4">
          <h2 class="text-base font-semibold text-gray-700">Cooking Bots</h2>
          <div class="flex-1"></div>
          <div class="flex gap-4">
            <button 
              @click="addBot"
              class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition font-semibold cursor-pointer"
            >
              + Bot
            </button>
            <button 
              @click="removeBot"
              class="px-4 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition font-semibold cursor-pointer"
              :disabled="bots.length === 0"
              :class="{ 'opacity-50 cursor-not-allowed': bots.length === 0 }"
            >
              - Bot
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div 
            v-for="bot in bots" 
            :key="bot.id"
            class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between transition-all duration-300 min-h-44"
            :class="{ 'border-blue-300 ring-2 ring-blue-50': bot.status === 'PROCESSING' }"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-bold text-lg text-gray-800">Bot #{{ bot.id }} "{{ bot.name }}"</h3>
              </div>
              <span 
                class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
                :class="bot.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'"
              >
                {{ (bot.status === 'PROCESSING') ? 'IN KITCHEN...' : bot.status }}
              </span>
            </div>
            
            <div class="mt-2 min-h-[60px] flex items-center justify-center">
              <transition name="list">
                <OrderCard 
                  v-if="bot.status === 'PROCESSING' && bot.currentOrder" 
                  :key="bot.currentOrder.id"
                  :order="bot.currentOrder" 
                  status="COOKING"
                  :is-processing="true"
                  class="w-full"
                />
                <p v-else class="text-sm text-gray-400 italic">Waiting for orders...</p>
              </transition>
            </div>
          </div>
        </div>
        
        <div v-if="bots.length === 0" class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400 text-xs italic">
          No active bots. Add a bot to start cooking! 🤖
        </div>
      </section>

      <!-- Completed Orders -->
      <section class="px-4 mt-8">
        <h2 class="font-semibold text-gray-700 mb-4">Completed Orders</h2>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 max-h-[300px] overflow-y-auto">
          <ul class="divide-y divide-gray-100">
             <!-- Show only last 20 reversed -->
            <li 
              v-for="order in completedOrders.slice().reverse().slice(0, 50)" 
              :key="order.id"
              class="py-2 flex items-center justify-between"
            >
              <span class="text-gray-600 text-xs font-medium">Order #{{ order.id }}</span>
              <span class="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">COMPLETED</span>
            </li>
          </ul>
           <div v-if="completedOrders.length === 0" class="text-center text-xs text-gray-400 py-4 italic">
            No completed orders yet
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Ensure absolute positioning for leave items so they don't break layout while leaving */
.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
