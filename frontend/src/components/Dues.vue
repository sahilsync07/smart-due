<template>
  <div class="tab-panel">
    <!-- Filters Card -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="filter-row">
            <div class="filter-group">
                <input type="text" v-model="searchQuery" placeholder="Search bills..." class="form-control" />
            </div>
            
            <div class="filter-group date-range">
                <input type="date" v-model="fromDate" class="form-control" placeholder="From" />
                <span class="text-muted">to</span>
                <input type="date" v-model="toDate" class="form-control" placeholder="To" />
            </div>

            <div class="filter-group checkboxes">
                <label class="custom-checkbox">
                    <input type="checkbox" v-model="showUnpaid" /> <span>Unpaid</span>
                </label>
                <label class="custom-checkbox">
                    <input type="checkbox" v-model="showPaid" /> <span>Paid</span>
                </label>
            </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="table-container hide-on-mobile">
      <table>
        <thead>
          <tr>
            <th>Biller</th>
            <th @click="sortBy('billing_date')" class="sortable">
              Billing Date <span v-if="sortColumn === 'billing_date'">{{ sortDirection === "asc" ? "↑" : "↓" }}</span>
            </th>
            <th @click="sortBy('amount')" class="sortable">
              Amount <span v-if="sortColumn === 'amount'">{{ sortDirection === "asc" ? "↑" : "↓" }}</span>
            </th>
            <th @click="sortBy('due_date')" class="sortable">
              Due Date <span v-if="sortColumn === 'due_date'">{{ sortDirection === "asc" ? "↑" : "↓" }}</span>
            </th>
            <th>Status</th>
            <th>Executive</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bill in filteredBills" :key="bill.id">
            <td class="font-medium">{{ bill.biller }}</td>
            <td>{{ formatIndianDate(bill.billing_date) }}</td>
            <td class="font-bold">{{ formatIndianCurrency(bill.amount) }}</td>
            <td>
                <div>{{ formatIndianDate(bill.due_date) }}</div>
                <small class="text-muted">{{ getDueInDays(bill) }}</small>
            </td>
            <td>
              <span class="badge" :class="getStatusBadgeClass(bill)">
                {{ getStatus(bill) }}
              </span>
            </td>
            <td>{{ bill.executive }}</td>
            <td class="text-right">
              <div class="action-group">
                <button class="btn btn-secondary btn-icon" @click="$emit('edit-bill', bill)" title="Edit">
                  ✏️
                </button>
                <button 
                  v-if="!bill.is_paid" 
                  class="btn btn-primary btn-icon" 
                  @click="$emit('mark-paid', bill)" 
                  title="Mark Paid"
                >
                  ✅
                </button>
                <button 
                  v-if="bill.is_paid" 
                  class="btn btn-secondary btn-icon" 
                  @click="$emit('mark-unpaid', bill)" 
                  title="Mark Unpaid"
                >
                  ↩️
                </button>
                <button class="btn btn-secondary btn-icon" @click="$emit('show-bank-info', bill)" title="Bank Info">
                  🏦
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredBills.length === 0">
              <td colspan="7" class="text-center py-4">No bills found matching your criteria.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="mobile-view">
        <div class="mobile-controls mb-4">
             <!-- Simplified sort for mobile if needed, or rely on search -->
        </div>
      <div v-for="bill in filteredBills" :key="bill.id" class="card mb-4">
        <div class="card-body">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold">{{ bill.biller }}</h3>
                <span class="badge" :class="getStatusBadgeClass(bill)">{{ getStatus(bill) }}</span>
            </div>
            
            <div class="grid-details">
                <div class="detail-item">
                    <span class="label">Amount</span>
                    <span class="value font-bold">{{ formatIndianCurrency(bill.amount) }}</span>
                </div>
                 <div class="detail-item">
                    <span class="label">Due Date</span>
                    <span class="value">{{ formatIndianDate(bill.due_date) }}</span>
                </div>
            </div>
            
            <p class="text-sm text-muted mt-2">Executive: {{ bill.executive }}</p>

            <div class="mobile-actions mt-4 flex gap-2">
                <button class="btn btn-secondary flex-1" @click="$emit('edit-bill', bill)">Edit</button>
                <button v-if="!bill.is_paid" class="btn btn-primary flex-1" @click="$emit('mark-paid', bill)">Paid</button>
                <button v-if="bill.is_paid" class="btn btn-secondary flex-1" @click="$emit('mark-unpaid', bill)">Unpaid</button>
                <button class="btn btn-secondary flex-1" @click="$emit('show-bank-info', bill)">Bank</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bills: Array,
    billers: Array,
    isMobile: Boolean,
  },
  data() {
    return {
      fromDate: "",
      toDate: "",
      searchQuery: "",
      sortColumn: "due_date",
      sortDirection: "asc",
      showPaid: false,
      showUnpaid: true,
    };
  },
  computed: {
    filteredBills() {
      let filtered = this.bills;

      // Apply status filter
      if (this.showPaid && !this.showUnpaid) {
        filtered = filtered.filter((bill) => bill.is_paid);
      } else if (this.showUnpaid && !this.showPaid) {
        filtered = filtered.filter((bill) => !bill.is_paid);
      } else if (!this.showPaid && !this.showUnpaid) {
        filtered = [];
      }

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((bill) =>
          Object.values(bill).some(
            (value) => value && value.toString().toLowerCase().includes(query)
          )
        );
      }

      // Apply date filters
      if (this.fromDate) {
        filtered = filtered.filter(
          (bill) => new Date(bill.billing_date) >= new Date(this.fromDate)
        );
      }
      if (this.toDate) {
        filtered = filtered.filter(
          (bill) => new Date(bill.billing_date) <= new Date(this.toDate)
        );
      }

      // Sort the filtered results
      return filtered.sort((a, b) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];
        if (this.sortColumn === "amount") {
          valA = parseFloat(valA);
          valB = parseFloat(valB);
        } else {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        return this.sortDirection === "asc" ? valA - valB : valB - valA;
      });
    },
  },
  methods: {
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortDirection = "asc";
      }
    },
    formatIndianDate(date) {
      if (!date) return '-';
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    formatIndianCurrency(amount) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
    },
    getDueInDays(bill) {
      if (bill.is_paid) {
        return `Paid on ${this.formatIndianDate(bill.paid_on)}`;
      }
      const dueDate = new Date(bill.due_date);
      const today = new Date();
      const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `${diff} days left` : `${Math.abs(diff)} days overdue`;
    },
    getStatus(bill) {
      if (bill.is_paid) return "Paid";
      const days = Math.ceil(
        (new Date(bill.due_date) - new Date()) / (1000 * 60 * 60 * 24)
      );
      if (days < 0) return "Overdue";
      if (days <= 7) return "Due Soon";
      return "Pending";
    },
    getStatusBadgeClass(bill) {
        const status = this.getStatus(bill);
        if (status === 'Paid') return 'badge-success';
        if (status === 'Overdue') return 'badge-danger';
        if (status === 'Due Soon') return 'badge-warning';
        return 'badge-info';
    }
  },
};
</script>

<style scoped>
.filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: center;
}
.filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.date-range input { width: 150px; }
.checkboxes { gap: 1.5rem; }
.custom-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 500;
}
.custom-checkbox input {
    width: 1.1rem; height: 1.1rem; accent-color: var(--primary);
}
.sortable { cursor: pointer; user-select: none; }
.sortable:hover { color: var(--primary); }

.font-medium { font-weight: 500; }
.font-bold { font-weight: 600; }
.text-muted { color: var(--text-secondary); }
.text-center { text-align: center; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }

.action-group {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

/* Mobile specific overrides */
@media (max-width: 900px) {
    .hide-on-mobile { display: none; }
    .mobile-view { display: block; }
    
    .grid-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 0.75rem;
    }
    .detail-item {
        display: flex;
        flex-direction: column;
    }
    .detail-item .label {
        font-size: 0.75rem; color: var(--text-secondary);
    }
    .filter-row { flex-direction: column; align-items: stretch; gap: 1rem; }
    .date-range, .checkboxes { justify-content: space-between; }
    .date-range input { width: 45%; }
}
@media (min-width: 901px) {
    .mobile-view { display: none; }
}
</style>
