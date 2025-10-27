<template>
  <div class="tab-panel">
    <div class="table-responsive">
      <div class="desktop-view">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Credit Duration</th>
              <th>Account No</th>
              <th>IFSC</th>
              <th>Bank Name</th>
              <th>Branch</th>
              <th>Executive</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="biller in billers" :key="biller.id">
              <td>{{ biller.name }}</td>
              <td>{{ biller.creditDuration }}</td>
              <td>{{ biller.accountNo }}</td>
              <td>{{ biller.ifsc }}</td>
              <td>{{ biller.bankName }}</td>
              <td>{{ biller.branch }}</td>
              <td>{{ biller.executive }}</td>
              <td class="action-cell">
                <button
                  class="action-button"
                  @click="$emit('edit-biller', biller)"
                >
                  Edit Biller
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mobile-view">
      <div v-for="biller in billers" :key="biller.id" class="card">
        <h3>{{ biller.name }}</h3>
        <p><strong>Credit Duration:</strong> {{ biller.creditDuration }}</p>
        <p><strong>Account No:</strong> {{ biller.accountNo }}</p>
        <p><strong>IFSC:</strong> {{ biller.ifsc }}</p>
        <p><strong>Bank Name:</strong> {{ biller.bankName }}</p>
        <p><strong>Branch:</strong> {{ biller.branch }}</p>
        <p><strong>Executive:</strong> {{ biller.executive }}</p>
        <div class="action-buttons">
          <button class="action-button" @click="$emit('edit-biller', biller)">
            Edit Biller
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    billers: Array,
    isMobile: Boolean,
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

.action-cell {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  flex: 1;
  min-width: 100px;
  text-align: center;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: transform 0.12s;
  background: var(--primary);
  color: #fff;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-1px) scale(1.015);
  background: var(--accent);
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

  .action-buttons {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .action-button {
    min-width: 0;
    flex: 1 1 100px;
    padding: 0.5rem;
    font-size: 0.9rem;
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
