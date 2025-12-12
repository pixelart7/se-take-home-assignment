<script setup lang="ts">
import type { Order } from '@/stores/orderStore'

defineProps<{
  order: Order
  status?: string
  isProcessing?: boolean
}>()
</script>

<template>
  <div 
    class="flex flex-col p-3 rounded-lg border min-h-24 relative overflow-hidden"
    :class="order.type === 'VIP' ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-100'"
  >
    <div class="flex justify-between z-10 w-full">
      <div class="flex-1">
        <div class="font-mono text-sm text-gray-500 mb-1">ORDER #{{ order.id }}</div>
        <div :class="order.type === 'VIP' ? 'font-bold text-amber-700 text-sm' : 'text-gray-700 text-sm'">
          {{ order.type }} Order {{ order.type === 'VIP' ? '👑' : '' }}
        </div>
      </div>
      <div class="flex-1"></div>
      <div class="text-xs font-semibold text-gray-400" :class="{'animate-pulse': status === 'COOKING'}">{{ status || 'PENDING' }}</div>
    </div>
    
    <div v-if="isProcessing" class="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
       <div class="bg-blue-500 h-full w-full animate-progress"></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress {
  animation: progress 10s linear;
}
</style>
