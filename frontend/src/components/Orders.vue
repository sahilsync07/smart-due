<template>
  <div class="tab-panel">
    <!-- Desktop Table -->
    <div class="table-container hide-on-mobile">
      <table>
        <thead>
          <tr>
            <th>Biller</th>
            <th>Placed On</th>
            <th>Items</th>
            <th>Transport</th>
            <th>Drive Link</th>
            <th>Executive</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="font-medium">{{ order.biller }}</td>
            <td>{{ formatIndianDate(order.order_placed_on) }}</td>
            <td class="truncate-text" :title="order.order_items">{{ order.order_items }}</td>
            <td>{{ order.transport }}</td>
            <td>
                <div class="flex gap-2">
                    <a :href="order.drive_link" target="_blank" class="btn btn-secondary btn-icon" title="Open Link">
                        🔗
                    </a>
                    <button class="btn btn-secondary btn-icon" @click="$emit('copy-link', order.drive_link)" title="Copy Link">
                        📋
                    </button>
                </div>
            </td>
            <td>{{ order.executive }}</td>
          </tr>
          <tr v-if="orders.length === 0">
              <td colspan="6" class="text-center py-4">No recent orders found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-view">
      <div v-for="order in orders" :key="order.id" class="card mb-4">
        <div class="card-body">
            <div class="flex justify-between items-start mb-2">
                 <h3 class="text-lg font-bold">{{ order.biller }}</h3>
                 <span class="text-sm text-muted">{{ formatIndianDate(order.order_placed_on) }}</span>
            </div>
            
            <div class="mb-2">
                <span class="label block text-sm text-muted">Items</span>
                <p class="text-sm">{{ order.order_items }}</p>
            </div>

             <div class="grid-details mb-2">
                <div class="detail-item">
                    <span class="label">Transport</span>
                    <span class="value">{{ order.transport }}</span>
                </div>
                 <div class="detail-item">
                    <span class="label">Executive</span>
                    <span class="value">{{ order.executive }}</span>
                </div>
            </div>

            <div class="mobile-actions mt-4 flex gap-2">
                <a :href="order.drive_link" target="_blank" class="btn btn-secondary flex-1">Open Link</a>
                <button class="btn btn-secondary flex-1" @click="$emit('copy-link', order.drive_link)">Copy Link</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orders: Array,
    isMobile: Boolean,
  },
  methods: {
    formatIndianDate(date) {
      if(!date) return '-';
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
};
</script>

<style scoped>
.truncate-text {
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.text-center { text-align: center; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.flex { display: flex; }
.gap-2 { gap: 0.5rem; }

/* Mobile specific overrides */
@media (max-width: 900px) {
    .hide-on-mobile { display: none; }
    .mobile-view { display: block; }
    
    .grid-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .detail-item {
        display: flex;
        flex-direction: column;
    }
    .detail-item .label {
        font-size: 0.75rem; color: var(--text-secondary);
    }
    .text-sm { font-size: 0.875rem; }
    .text-muted { color: var(--text-secondary); }
    .font-bold { font-weight: 600; }
    .block { display: block; }
}
@media (min-width: 901px) {
    .mobile-view { display: none; }
}
</style>
