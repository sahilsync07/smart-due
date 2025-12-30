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
            <th class="col-biller">Name</th>
            <th class="col-status">Credit Days</th>
            <th class="col-account">Account Details</th>
            <th class="col-executive">Executive</th>
            <th class="text-right col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="biller in filteredBillers" :key="biller.id">
            <td class="font-bold col-biller" :title="biller.name">{{ biller.name }}</td>
            <td class="col-status">{{ biller.creditDuration }} days</td>
            <td class="col-account">
                <div class="text-sm">
                    <div class="font-medium truncate" :title="biller.bankName">{{ biller.bankName }}</div>
                    <div class="text-muted">{{ biller.accountNo }}</div>
                    <div class="text-muted text-xs">{{ biller.ifsc }}</div>
                </div>
            </td>
            <td class="col-executive" :title="biller.executive">{{ biller.executive }}</td>
            <td class="text-right col-actions">
                <button class="btn btn-secondary btn-icon" @click="$emit('edit-biller', biller)" title="Edit">
                    <i class="ph ph-pencil-simple"></i>
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
                 <button class="btn btn-secondary btn-icon" @click="$emit('edit-biller', biller)"><i class="ph ph-pencil-simple"></i></button>
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
}
@media (min-width: 901px) {
    .mobile-view { display: none; }
}
</style>
