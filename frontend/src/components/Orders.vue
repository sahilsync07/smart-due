<template>
  <div class="tab-panel">
    <div class="table-responsive">
      <div class="desktop-view">
        <table>
          <thead>
            <tr>
              <th class="biller">Biller</th>
              <th>Order Placed On</th>
              <th>Order Items</th>
              <th>Transport</th>
              <th>Drive Link</th>
              <th>Executive</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="biller">{{ order.biller }}</td>
              <td>{{ formatIndianDate(order.order_placed_on) }}</td>
              <td>{{ order.order_items }}</td>
              <td>{{ order.transport }}</td>
              <td>
                <a :href="order.drive_link" target="_blank">
                  <button class="copy-button">Open Link</button>
                </a>
                <button
                  class="copy-button"
                  @click="$emit('copy-link', order.drive_link)"
                >
                  Copy Link
                </button>
              </td>
              <td>{{ order.executive }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mobile-view">
      <div v-for="order in orders" :key="order.id" class="card">
        <h3>{{ order.biller }}</h3>
        <p>
          <strong>Order Placed On:</strong>
          {{ formatIndianDate(order.order_placed_on) }}
        </p>
        <p><strong>Order Items:</strong> {{ order.order_items }}</p>
        <p><strong>Transport:</strong> {{ order.transport }}</p>
        <p>
          <strong>Drive Link:</strong>
          <a :href="order.drive_link" target="_blank">Open</a> |
          <button @click="$emit('copy-link', order.drive_link)">Copy</button>
        </p>
        <p><strong>Executive:</strong> {{ order.executive }}</p>
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
.table-responsive {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 6px;
  margin: 0;
  table-layout: auto;
}

thead {
  background: #f4f5fa;
}

th,
td {
  padding: 0.91rem 1rem;
  font-size: 1rem;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-main);
}

td {
  border-bottom: 1px solid #f2f3f6;
  background: var(--surface);
  transition: background 0.18s;
}

tr:hover td {
  background: #f5f7fd;
}

.biller {
  white-space: normal !important;
  word-wrap: break-word;
}

.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s, transform 0.12s;
}

.copy-button:hover {
  background: var(--accent);
  transform: translateY(-1px) scale(1.015);
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1rem;
  margin-bottom: 1rem;
}

.card h3 {
  margin-top: 0;
  font-size: 1.1rem;
  color: var(--primary);
}

.card p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.card p strong {
  color: var(--text-main);
}

@media (max-width: 900px) {
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }
}

@media (min-width: 901px) {
  .desktop-view {
    display: block;
  }

  .mobile-view {
    display: none;
  }
}
</style>
