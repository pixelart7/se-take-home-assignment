<script setup lang="ts">
import { useOrderStore } from './stores/orderStore'
import { storeToRefs } from 'pinia'

const store = useOrderStore()
const { pendingOrders, completedOrders, bots } = storeToRefs(store)
const { addOrder, addBot, removeBot } = store

</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans p-6">
    <div class="max-w-4xl mx-auto space-y-8">
      
      <!-- Header -->
      <header class="flex flex-col md:flex-row justify-between items-center border-b pb-4 border-gray-200">
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">FeedMe Auto-Cooker 🍔</h1>
        <!-- Global Stats? -->
      </header>

      <!-- Order Controls -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700">New Order</h2>
        <div class="flex gap-4">
          <button 
            @click="addOrder('Normal')"
            class="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 active:bg-gray-100 transition font-medium text-gray-700 cursor-pointer"
          >
            New Normal Order
          </button>
          <button 
            @click="addOrder('VIP')"
            class="px-6 py-3 bg-amber-500 border border-amber-600 text-white rounded-lg shadow-sm hover:bg-amber-600 active:bg-amber-700 transition font-medium cursor-pointer"
          >
            New VIP Order 👑
          </button>
        </div>
      </section>

      <!-- Pending Orders -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-700">Pending Orders <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{{ pendingOrders.length }}</span></h2>
        </div>
        
        <div class="bg-white p-4 rounded-xl shadow-sm min-h-[100px] border border-gray-200">
          <transition-group name="list" tag="ul" class="space-y-2">
            <li 
              v-for="order in pendingOrders" 
              :key="order.id"
              class="flex items-center justify-between p-3 rounded-lg border"
              :class="order.type === 'VIP' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'"
            >
              <div class="flex items-center gap-3">
                <span class="font-mono text-sm text-gray-500">#{{ order.id }}</span>
                <span :class="order.type === 'VIP' ? 'font-bold text-amber-700' : 'text-gray-700'">
                  {{ order.type }} Order {{ order.type === 'VIP' ? '👑' : '' }}
                </span>
              </div>
              <span class="text-xs font-semibold text-gray-400">PENDING</span>
            </li>
          </transition-group>
          <div v-if="pendingOrders.length === 0" class="text-center text-gray-400 py-4 italic">
            No pending orders
          </div>
        </div>
      </section>

      <!-- Bot Section -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-700">Cooking Bots</h2>
          <div class="flex gap-2">
            <button 
              @click="addBot"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition font-medium cursor-pointer"
            >
              + Bot
            </button>
            <button 
              @click="removeBot"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition font-medium cursor-pointer"
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
            class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between transition-all duration-300"
            :class="{ 'border-blue-300 ring-2 ring-blue-50': bot.status === 'PROCESSING' }"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-bold text-lg text-gray-800">{{ bot.name }}</h3>
                <span class="text-xs text-gray-400 font-mono">ID: {{ bot.id }}</span>
              </div>
              <span 
                class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
                :class="bot.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'"
              >
                {{ bot.status }}
              </span>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3 mt-2 h-[60px] flex items-center justify-center">
              <div v-if="bot.status === 'PROCESSING'" class="text-center w-full">
                <p class="text-sm text-gray-600 mb-1">Processing Order #{{ bot.currentOrderId }}</p>
                <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                   <div class="bg-blue-500 h-1.5 rounded-full w-full animate-progress"></div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400 italic">Waiting for orders...</p>
            </div>
          </div>
        </div>
        
        <div v-if="bots.length === 0" class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
          No active bots. Add a bot to start cooking! 🤖
        </div>
      </section>

      <!-- Completed Orders -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Completed Orders</h2>
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 max-h-[300px] overflow-y-auto">
          <ul class="divide-y divide-gray-100">
             <!-- Show only last 20 reversed -->
            <li 
              v-for="order in completedOrders.slice().reverse().slice(0, 50)" 
              :key="order.id"
              class="py-2 flex items-center justify-between"
            >
              <span class="text-gray-600 font-medium">Order #{{ order.id }}</span>
              <span class="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">COMPLETED</span>
            </li>
          </ul>
           <div v-if="completedOrders.length === 0" class="text-center text-gray-400 py-4 italic">
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

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress {
  animation: progress 10s linear;
}
</style>
