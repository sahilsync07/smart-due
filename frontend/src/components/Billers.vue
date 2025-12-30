<template>
  <div class="tab-panel">
      <!-- Search Filter -->
      <div class="card mb-4">
        <div class="card-body py-3">
            <input type="text" v-model="searchQuery" placeholder="Search billers..." class="form-control" style="max-width:300px"/>
        </div>
      </div>

    <!-- Desktop Table -->
    <div class="table-container hide-on-mobile">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Credit Days</th>
            <th>Account Details</th>
            <th>Executive</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="biller in filteredBillers" :key="biller.id">
            <td class="font-bold">{{ biller.name }}</td>
            <td>{{ biller.creditDuration }} days</td>
            <td>
                <div class="text-sm">
                    <div class="font-medium">{{ biller.bankName }}</div>
                    <div class="text-muted">{{ biller.accountNo }}</div>
                    <div class="text-muted text-xs">{{ biller.ifsc }}</div>
                </div>
            </td>
            <td>{{ biller.executive }}</td>
            <td class="text-right">
                <button class="btn btn-secondary btn-icon" @click="$emit('edit-biller', biller)" title="Edit">
                    ✏️
                </button>
            </td>
          </tr>
          <tr v-if="filteredBillers.length === 0">
              <td colspan="5" class="text-center py-4">No billers found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-view">
      <div v-for="biller in filteredBillers" :key="biller.id" class="card mb-4">
        <div class="card-body">
            <div class="flex justify-between items-start mb-2">
                 <h3 class="text-lg font-bold">{{ biller.name }}</h3>
                 <button class="btn btn-secondary btn-icon" @click="$emit('edit-biller', biller)">✏️</button>
            </div>
            
             <div class="grid-details mb-4">
                <div class="detail-item">
                    <span class="label">Credit</span>
                    <span class="value">{{ biller.creditDuration }} days</span>
                </div>
                 <div class="detail-item">
                    <span class="label">Executive</span>
                    <span class="value">{{ biller.executive }}</span>
                </div>
            </div>

            <div class="bank-details-box p-3 bg-subtle rounded">
                <p class="font-medium text-sm mb-1">{{ biller.bankName }}</p>
                <div class="flex justify-between items-center text-sm text-muted">
                    <span>{{ biller.accountNo }}</span>
                    <span>{{ biller.ifsc }}</span>
                </div>
                <div class="text-xs text-muted mt-1">{{ biller.branch }}</div>
            </div>
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
  data() {
      return {
          searchQuery: ""
      }
  },
  computed: {
      filteredBillers() {
          if(!this.searchQuery) return this.billers;
          const query = this.searchQuery.toLowerCase();
          return this.billers.filter(b => 
            b.name.toLowerCase().includes(query) || 
            b.executive.toLowerCase().includes(query)
          );
      }
  }
};
</script>

<style scoped>
.text-xs { font-size: 0.75rem; }
.bg-subtle { background-color: var(--bg-subtle); }
.rounded { border-radius: var(--radius-sm); }
.p-3 { padding: 0.75rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }

/* Mobile specific overrides */
@media (max-width: 900px) {
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
