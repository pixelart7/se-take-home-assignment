# System Overview

## Architecture
- **Framework**: Vue 3 + Vite
- **State Management**: Pinia (`src/stores`)
- **Styling**: Tailwind CSS v4

## State Management (`src/stores/orderStore.ts`)
- **State**:
  - `pendingOrders`: Array of Orders (id, type: 'VIP' | 'Normal', status)
  - `bots`: Array of Bots (id, name, status, currentOrderId, processStartTime)
  - `completedOrders`: Array of Orders (id, type)
- **Getters**:
  - `pendingQueue`: Returns VIP orders first, then Normal orders.
- **Actions**:
  - `addOrder(type)`: Adds a new order to `pendingOrders`.
  - `addBot()`: Creates a new bot with a random name (e.g., McBot, BurgerBot).
  - `removeBot()`: Removes the newest bot. If processing, moves order back to `pendingOrders` (LIFO for bots).
  - `processOrder(botId)`: Bot picks the first order from `pendingQueue`, waits 10s, moves to `completedOrders`.

## UI Structure (`src/App.vue`)
Single page layout composed of:
1.  **Main NavBar**: Simple header "FeedMe Auto-Cooker".
2.  **Order Actions**:
    - [New Normal Order] Button
    - [New VIP Order] Button
3.  **Pending Orders Area**: List of orders waiting to be processed.
4.  **Bot Actions**:
    - [+ Bot] Button
    - [- Bot] Button
5.  **Bot Grid**:
    - 2-column grid displaying active bots.
    - Each bot card shows: `Bot #ID - [Random Name]`, Status (IDLE/PROCESSING), and current Order ID if processing.
6.  **Completed Orders**: (Optional but good for verification) List of completed orders.
