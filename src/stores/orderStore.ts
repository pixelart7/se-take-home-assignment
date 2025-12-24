import { defineStore } from 'pinia'
import { ref } from 'vue'

export type OrderType = 'VIP' | 'Normal'
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETE'

export interface Order {
  id: number
  type: OrderType
}

export interface Bot {
  id: number
  name: string
  status: 'IDLE' | 'PROCESSING'
  currentOrder: Order | null
}

export const useOrderStore = defineStore('order', () => {
  // --- State ---
  const pendingOrders = ref<Order[]>([])
  const completedOrders = ref<Order[]>([])
  const bots = ref<Bot[]>([])

  const nextOrderId = ref(1)
  const nextBotId = ref(1)

  // Keep track of timers for active bots so we can cancel them if needed
  // Key: bot.id, Value: timeoutId
  const botTimers = new Map<number, ReturnType<typeof setTimeout>>()

  // --- Getters ---

  // --- Actions ---

  function addOrder(type: OrderType) {
    const order: Order = {
      id: nextOrderId.value++,
      type,
    }

    if (type === 'VIP') {
      // Find the insertion point: after the last VIP
      let insertIndex = pendingOrders.value.length
      const lastVipIndex = pendingOrders.value.map(o => o.type).lastIndexOf('VIP')

      if (lastVipIndex !== -1) {
        insertIndex = lastVipIndex + 1
      } else {
        // No VIPs exist.
        // Insert before first Normal.
        const firstNormalIndex = pendingOrders.value.findIndex(o => o.type === 'Normal')
        if (firstNormalIndex !== -1) {
          insertIndex = firstNormalIndex
        } else {
          // No Normals found, simply append
          insertIndex = pendingOrders.value.length
        }
      }

      pendingOrders.value.splice(insertIndex, 0, order)
    } else {
      // Normal: just append
      pendingOrders.value.push(order)
    }

    tryAssignOrders()
  }

  function addBot() {
    const names = ['McBot', 'BurgerBot', 'FryGuy', 'ShakeMaster', 'NuggetNet', 'BigMcMachine', 'SundaesBot', 'HappyMealBot', 'McMuffinFace', 'Botger']
    const randomName = names[Math.floor(Math.random() * names.length)] ?? 'Bot'

    const bot: Bot = {
      id: nextBotId.value++,
      name: randomName,
      status: 'IDLE',
      currentOrder: null
    }

    bots.value.push(bot)
    tryAssignOrders()
  }



  // Helper: Assign pending orders to idle bots
  function tryAssignOrders() {
    // Find idle bots
    const idleBots = bots.value.filter(b => b.status === 'IDLE')

    // While we have idle bots and pending orders
    idleBots.forEach(bot => {
      if (pendingOrders.value.length > 0) {
        const order = pendingOrders.value.shift() // Take first (highest priority)
        if (order) {
          startBotProcessing(bot, order)
        }
      }
    })
  }

  function startBotProcessing(bot: Bot, order: Order) {
    bot.status = 'PROCESSING'
    bot.currentOrder = order
    // We need to remember the order type in case we need to restore it. 
    // Let's modify the Bot interface slightly or just store it in a closure/map?
    // Let's use a map for active orders for simplicity in restoration.
    activeOrders.set(bot.id, order)

    const timer = setTimeout(() => {
      completeOrder(bot.id)
    }, 10000)

    botTimers.set(bot.id, timer)
  }

  const activeOrders = new Map<number, Order>()

  function completeOrder(botId: number) {
    const bot = bots.value.find(b => b.id === botId)
    if (!bot) return // Bot might have been removed

    const order = activeOrders.get(botId)
    if (order) {
      completedOrders.value.push({ ...order }) // Move to completed
      activeOrders.delete(botId)
    }

    bot.status = 'IDLE'
    bot.currentOrder = null
    botTimers.delete(botId)

    // Try to pick up next order
    tryAssignOrders()
  }

  // Override removeBot implementation to use activeOrders
  function removeBot() {
    if (bots.value.length === 0) return

    const botToRemove = bots.value.pop()
    if (botToRemove) {
      if (botToRemove.status === 'PROCESSING') {
        const timer = botTimers.get(botToRemove.id)
        if (timer) {
          clearTimeout(timer)
          botTimers.delete(botToRemove.id)
        }

        const order = activeOrders.get(botToRemove.id)
        if (order) {
          // Restore to pending
          restoreOrder(order)

          activeOrders.delete(botToRemove.id)
        }
      }
    }
  }

  function restoreOrder(order: Order) {
    if (order.type === 'VIP') {
      // Insert at front of VIP line (which is front of the queue)
      pendingOrders.value.unshift(order)
    } else {
      // Prepend to Normals to be fair to the victimized order.
      // Find first normal
      const firstNormalIndex = pendingOrders.value.findIndex(o => o.type === 'Normal')
      if (firstNormalIndex !== -1) {
        pendingOrders.value.splice(firstNormalIndex, 0, order)
      } else {
        // No Normals, just append (it's the only normal)
        pendingOrders.value.push(order)
      }
    }
  }

  return {
    pendingOrders,
    completedOrders,
    bots,
    addOrder,
    addBot,
    removeBot
  }
})
