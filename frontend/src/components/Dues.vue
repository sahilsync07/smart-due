<template>
  <div class="tab-panel">
    <div class="controls-container">
      <div class="date-filter-group">
        <input type="date" v-model="fromDate" placeholder="From" />
        <span>to</span>
        <input type="date" v-model="toDate" placeholder="To" />
      </div>
      <div class="status-filter-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="showUnpaid" />
          Show Unpaid
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="showPaid" />
          Show Paid
        </label>
      </div>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search"
        class="search-bar"
      />
    </div>
    <div class="mobile-sort-buttons" v-if="isMobile">
      <button @click="sortBy('billing_date')">
        Bill
        {{
          sortColumn === "billing_date"
            ? sortDirection === "asc"
              ? "↑"
              : "↓"
            : ""
        }}
      </button>
      <button @click="sortBy('amount')">
        Amount
        {{
          sortColumn === "amount" ? (sortDirection === "asc" ? "↑" : "↓") : ""
        }}
      </button>
      <button @click="sortBy('due_date')">
        Due
        {{
          sortColumn === "due_date" ? (sortDirection === "asc" ? "↑" : "↓") : ""
        }}
      </button>
    </div>
    <div class="table-responsive">
      <div class="desktop-view">
        <table>
          <thead>
            <tr>
              <th class="biller">Biller</th>
              <th @click="sortBy('billing_date')">
                Billing Date
                <span v-if="sortColumn === 'billing_date'">{{
                  sortDirection === "asc" ? "↑" : "↓"
                }}</span>
              </th>
              <th @click="sortBy('amount')">
                Amount
                <span v-if="sortColumn === 'amount'">{{
                  sortDirection === "asc" ? "↑" : "↓"
                }}</span>
              </th>
              <th @click="sortBy('due_date')">
                Due Date
                <span v-if="sortColumn === 'due_date'">{{
                  sortDirection === "asc" ? "↑" : "↓"
                }}</span>
              </th>
              <th>Due In</th>
              <th>Status</th>
              <th>Executive</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="bill in filteredBills"
              :key="bill.id"
              :class="{ 'paid-row': bill.is_paid }"
            >
              <td class="biller">{{ bill.biller }}</td>
              <td>{{ formatIndianDate(bill.billing_date) }}</td>
              <td>{{ formatIndianCurrency(bill.amount) }}</td>
              <td>{{ formatIndianDate(bill.due_date) }}</td>
              <td>{{ getDueInDays(bill) }}</td>
              <td>{{ getStatus(bill) }}</td>
              <td>{{ bill.executive }}</td>
              <td class="action-cell">
                <div class="action-buttons">
                  <button
                    class="action-button"
                    @click="$emit('edit-bill', bill)"
                  >
                    Edit Bill
                  </button>
                  <button
                    v-if="!bill.is_paid"
                    class="action-button"
                    @click="$emit('mark-paid', bill)"
                  >
                    Mark Paid
                  </button>
                  <button
                    v-if="bill.is_paid"
                    class="action-button"
                    @click="$emit('mark-unpaid', bill)"
                  >
                    Mark Unpaid
                  </button>
                  <button
                    class="action-button"
                    @click="$emit('show-bank-info', bill)"
                  >
                    Bank Info
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mobile-view">
      <div
        v-for="bill in filteredBills"
        :key="bill.id"
        class="card"
        :class="{ 'paid-card': bill.is_paid }"
      >
        <h3>{{ bill.biller }}</h3>
        <p>
          <strong>Billing Date:</strong>
          {{ formatIndianDate(bill.billing_date) }}
        </p>
        <p><strong>Amount:</strong> {{ formatIndianCurrency(bill.amount) }}</p>
        <p><strong>Due Date:</strong> {{ formatIndianDate(bill.due_date) }}</p>
        <p><strong>Due In:</strong> {{ getDueInDays(bill) }}</p>
        <p><strong>Status:</strong> {{ getStatus(bill) }}</p>
        <p><strong>Executive:</strong> {{ bill.executive }}</p>
        <div class="action-buttons">
          <button class="action-button" @click="$emit('edit-bill', bill)">
            Edit Bill
          </button>
          <button
            v-if="!bill.is_paid"
            class="action-button"
            @click="$emit('mark-paid', bill)"
          >
            Mark Paid
          </button>
          <button
            v-if="bill.is_paid"
            class="action-button"
            @click="$emit('mark-unpaid', bill)"
          >
            Mark Unpaid
          </button>
          <button class="action-button" @click="$emit('show-bank-info', bill)">
            Bank Info
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "../utils/supabase";

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
      return diff > 0 ? `${diff} days` : `${Math.abs(diff)} days overdue`;
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
  },
};
</script>

<style scoped>
.controls-container {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.date-filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-filter-group span {
  padding: 0 0.5rem;
}

.status-filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: var(--text-main);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 0.5rem;
  width: 1.2rem;
  height: 1.2rem;
  accent-color: var(--primary);
}

.search-bar {
  width: 200px;
}

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

.paid-row {
  background-color: rgba(0, 255, 0, 0.1);
}

.paid-card {
  background-color: rgba(0, 255, 0, 0.1);
}

.biller {
  white-space: normal !important;
  word-wrap: break-word;
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

.mobile-sort-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.mobile-sort-buttons button {
  background: var(--primary);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.9rem;
}

.mobile-sort-buttons button:hover {
  background: var(--accent);
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

  .controls-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .date-filter-group {
    flex: 1;
    justify-content: center;
  }

  .status-filter-group {
    flex: 1;
    justify-content: center;
  }

  .search-bar {
    flex: 1;
    width: auto;
    max-width: 150px;
  }
}

@media (min-width: 901px) {
  .desktop-view {
    display: block;
  }

  .mobile-view {
    display: none;
  }

  .date-filter-group {
    justify-content: flex-end;
  }

  .status-filter-group {
    justify-content: center;
  }

  .search-bar {
    margin: 0 auto;
  }
}
</style>
