<template>
  <div>
    <header>
      <div class="header-content">
        <h1>Smart Due</h1>
        <span class="sbe-text">Sri Brundabana Enterprises</span>
      </div>
    </header>

    <div class="container">
      <div class="tab-container">
        <div class="tab-buttons">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'dues' }"
            @click="activeTab = 'dues'"
          >
            Dues
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'orders' }"
            @click="activeTab = 'orders'"
          >
            Orders
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'billers' }"
            @click="activeTab = 'billers'"
          >
            Billers
          </button>
        </div>
        <div class="tab-content">
          <div v-if="activeTab === 'dues'" class="tab-panel">
            <div class="controls-container">
              <div class="date-filter-group">
                <input type="date" v-model="fromDate" placeholder="From" />
                <span>to</span>
                <input type="date" v-model="toDate" placeholder="To" />
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
                  sortColumn === "amount"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""
                }}
              </button>
              <button @click="sortBy('due_date')">
                Due
                {{
                  sortColumn === "due_date"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""
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
                    <tr v-for="bill in filteredBills" :key="bill.id">
                      <td class="biller">{{ bill.biller }}</td>
                      <td>{{ formatIndianDate(bill.billing_date) }}</td>
                      <td>{{ formatIndianCurrency(bill.amount) }}</td>
                      <td>{{ formatIndianDate(bill.due_date) }}</td>
                      <td>{{ getDueInDays(bill) }}</td>
                      <td>{{ getStatus(bill) }}</td>
                      <td>{{ bill.executive }}</td>
                      <td class="action-cell">
                        <div class="action-buttons">
                          <button class="action-button" @click="editBill(bill)">
                            Edit Bill
                          </button>
                          <button
                            v-if="!bill.is_paid"
                            class="action-button"
                            @click="markPaid(bill)"
                          >
                            Mark Paid
                          </button>
                          <button
                            class="action-button"
                            @click="showBankInfo(bill)"
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
              <div v-for="bill in filteredBills" :key="bill.id" class="card">
                <h3>{{ bill.biller }}</h3>
                <p>
                  <strong>Billing Date:</strong>
                  {{ formatIndianDate(bill.billing_date) }}
                </p>
                <p>
                  <strong>Amount:</strong>
                  {{ formatIndianCurrency(bill.amount) }}
                </p>
                <p>
                  <strong>Due Date:</strong>
                  {{ formatIndianDate(bill.due_date) }}
                </p>
                <p><strong>Due In:</strong> {{ getDueInDays(bill) }}</p>
                <p><strong>Status:</strong> {{ getStatus(bill) }}</p>
                <p><strong>Executive:</strong> {{ bill.executive }}</p>
                <div class="action-buttons">
                  <button class="action-button" @click="editBill(bill)">
                    Edit Bill
                  </button>
                  <button
                    v-if="!bill.is_paid"
                    class="action-button"
                    @click="markPaid(bill)"
                  >
                    Mark Paid
                  </button>
                  <button class="action-button" @click="showBankInfo(bill)">
                    Bank Info
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'orders'" class="tab-panel">
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
                          @click="copyLink(order.drive_link)"
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
                  <button @click="copyLink(order.drive_link)">Copy</button>
                </p>
                <p><strong>Executive:</strong> {{ order.executive }}</p>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'billers'" class="tab-panel">
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
                          @click="editBiller(biller)"
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
                <p>
                  <strong>Credit Duration:</strong> {{ biller.creditDuration }}
                </p>
                <p><strong>Account No:</strong> {{ biller.accountNo }}</p>
                <p><strong>IFSC:</strong> {{ biller.ifsc }}</p>
                <p><strong>Bank Name:</strong> {{ biller.bankName }}</p>
                <p><strong>Branch:</strong> {{ biller.branch }}</p>
                <p><strong>Executive:</strong> {{ biller.executive }}</p>
                <div class="action-buttons">
                  <button class="action-button" @click="editBiller(biller)">
                    Edit Biller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="popup" v-if="showBillPopup">
        <div>
          <div v-if="saving" class="saving-overlay">
            <div class="loader"></div>
            Saving...
          </div>
          <h2>{{ editBillMode ? "Edit Bill" : "Add Bill" }}</h2>
          <div class="form-group">
            <label>Biller</label>
            <select v-model="newBill.biller">
              <option
                v-for="biller in billers"
                :key="biller.id"
                :value="biller.name"
              >
                {{ biller.name }}
              </option>
            </select>
            <span v-if="errors.biller" class="error-message">{{
              errors.biller
            }}</span>
          </div>
          <div class="form-group">
            <label>Billing Date</label>
            <input type="date" v-model="newBill.billing_date" />
            <span v-if="errors.billing_date" class="error-message">{{
              errors.billing_date
            }}</span>
          </div>
          <div class="form-group">
            <label>Amount</label>
            <input type="number" v-model="newBill.amount" />
            <span v-if="errors.amount" class="error-message">{{
              errors.amount
            }}</span>
          </div>
          <div class="form-group">
            <label>Due Date</label>
            <input type="date" v-model="newBill.due_date" />
            <span v-if="errors.due_date" class="error-message">{{
              errors.due_date
            }}</span>
          </div>
          <div class="form-group">
            <label>Remarks</label>
            <input type="text" v-model="newBill.remarks" />
            <span v-if="errors.remarks" class="error-message">{{
              errors.remarks
            }}</span>
          </div>
          <div class="button-group">
            <button @click="validateAndSaveBill">
              {{ editBillMode ? "Update" : "Save" }}
            </button>
            <button class="cancel" @click="closeBillPopup">Cancel</button>
          </div>
        </div>
      </div>

      <div class="popup" v-if="showOrderPopup">
        <div>
          <div v-if="saving" class="saving-overlay">
            <div class="loader"></div>
            Saving...
          </div>
          <h2>New Order</h2>
          <div class="form-group">
            <label>Biller</label>
            <select v-model="newOrder.biller">
              <option
                v-for="biller in billers"
                :key="biller.id"
                :value="biller.name"
              >
                {{ biller.name }}
              </option>
            </select>
            <span v-if="errors.biller" class="error-message">{{
              errors.biller
            }}</span>
          </div>
          <div class="form-group">
            <label>Order Placed On</label>
            <input type="date" v-model="newOrder.order_placed_on" />
            <span v-if="errors.order_placed_on" class="error-message">{{
              errors.order_placed_on
            }}</span>
          </div>
          <div class="form-group">
            <label>Order Items</label>
            <input type="text" v-model="newOrder.order_items" />
            <span v-if="errors.order_items" class="error-message">{{
              errors.order_items
            }}</span>
          </div>
          <div class="form-group">
            <label>Transport</label>
            <input type="text" v-model="newOrder.transport" />
            <span v-if="errors.transport" class="error-message">{{
              errors.transport
            }}</span>
          </div>
          <div class="form-group">
            <label>Drive Link</label>
            <input type="text" v-model="newOrder.drive_link" />
            <span v-if="errors.drive_link" class="error-message">{{
              errors.drive_link
            }}</span>
          </div>
          <div class="form-group">
            <label>Executive</label>
            <input type="text" v-model="newOrder.executive" />
            <span v-if="errors.executive" class="error-message">{{
              errors.executive
            }}</span>
          </div>
          <div class="button-group">
            <button @click="validateAndSaveOrder">Save</button>
            <button class="cancel" @click="closeOrderPopup">Cancel</button>
          </div>
        </div>
      </div>

      <div class="popup" v-if="showConfirmPopup">
        <div>
          <h2>What is your name?</h2>
          <div class="button-group">
            <button @click="confirmAction">Confirm</button>
            <button class="cancel" @click="closeConfirmPopup">Cancel</button>
          </div>
        </div>
      </div>

      <div class="popup" v-if="showBankPopup">
        <div>
          <h2>Bank Details for {{ selectedBill.biller }}</h2>
          <table class="bank-details-table">
            <tr>
              <td class="label">Bank Name</td>
              <td class="value">{{ selectedBiller.bankName }}</td>
              <td class="copy">
                <button
                  class="copy-button"
                  @click="copyText(selectedBiller.bankName)"
                >
                  Copy
                </button>
              </td>
            </tr>
            <tr>
              <td class="label">Account No</td>
              <td class="value">{{ selectedBiller.accountNo }}</td>
              <td class="copy">
                <button
                  class="copy-button"
                  @click="copyText(selectedBiller.accountNo)"
                >
                  Copy
                </button>
              </td>
            </tr>
            <tr>
              <td class="label">IFSC</td>
              <td class="value">{{ selectedBiller.ifsc }}</td>
              <td class="copy">
                <button
                  class="copy-button"
                  @click="copyText(selectedBiller.ifsc)"
                >
                  Copy
                </button>
              </td>
            </tr>
            <tr>
              <td class="label">Branch</td>
              <td class="value">{{ selectedBiller.branch }}</td>
              <td class="copy">
                <button
                  class="copy-button"
                  @click="copyText(selectedBiller.branch)"
                >
                  Copy
                </button>
              </td>
            </tr>
          </table>
          <div class="button-group">
            <button class="cancel" @click="closeBankPopup">Close</button>
          </div>
        </div>
      </div>

      <div class="popup" v-if="showBillerPopup">
        <div>
          <div v-if="saving" class="saving-overlay">
            <div class="loader"></div>
            Saving...
          </div>
          <h2>{{ editBillerMode ? "Edit Biller" : "Add Biller" }}</h2>
          <div class="form-group">
            <label>Name</label>
            <input type="text" v-model="newBiller.name" />
            <span v-if="errors.name" class="error-message">{{
              errors.name
            }}</span>
          </div>
          <div class="form-group">
            <label>Credit Duration</label>
            <input type="number" v-model="newBiller.creditDuration" />
            <span v-if="errors.creditDuration" class="error-message">{{
              errors.creditDuration
            }}</span>
          </div>
          <div class="form-group">
            <label>Account Number</label>
            <input
              type="text"
              v-model="newBiller.accountNo"
              class="account-no-input"
            />
            <span v-if="errors.accountNo" class="error-message">{{
              errors.accountNo
            }}</span>
          </div>
          <div class="form-group">
            <label>Reenter Account Number</label>
            <input
              type="text"
              v-model="reenterAccountNo"
              class="account-no-input"
            />
            <span v-if="errors.reenterAccountNo" class="error-message">{{
              errors.reenterAccountNo
            }}</span>
          </div>
          <div class="form-group">
            <label>IFSC Code</label>
            <input type="text" v-model="newBiller.ifsc" />
            <span v-if="errors.ifsc" class="error-message">{{
              errors.ifsc
            }}</span>
          </div>
          <div class="form-group">
            <label>Bank Name</label>
            <input type="text" v-model="newBiller.bankName" />
            <span v-if="errors.bankName" class="error-message">{{
              errors.bankName
            }}</span>
          </div>
          <div class="form-group">
            <label>Branch</label>
            <input type="text" v-model="newBiller.branch" />
            <span v-if="errors.branch" class="error-message">{{
              errors.branch
            }}</span>
          </div>
          <div class="form-group">
            <label>Executive</label>
            <input type="text" v-model="newBiller.executive" />
            <span v-if="errors.executive" class="error-message">{{
              errors.executive
            }}</span>
          </div>
          <div class="button-group">
            <button @click="validateAndSaveBiller">
              {{ editBillerMode ? "Update" : "Save" }}
            </button>
            <button class="cancel" @click="closeBillerPopup">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="activeTab === 'dues'"
      class="new-button"
      @click="openBillPopup"
    >
      +
    </button>
    <button
      v-if="activeTab === 'orders'"
      class="new-button"
      @click="openOrderPopup"
    >
      +
    </button>
    <button
      v-if="activeTab === 'billers'"
      class="new-button"
      @click="openBillerPopup"
    >
      +
    </button>

    <div v-if="toast.message" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import { supabase } from "./utils/supabase";

export default {
  data() {
    return {
      activeTab: "dues",
      bills: [],
      orders: [],
      billers: [],
      fromDate: "",
      toDate: "",
      searchQuery: "",
      sortColumn: "due_date",
      sortDirection: "asc",
      showBillPopup: false,
      showOrderPopup: false,
      showConfirmPopup: false,
      showBankPopup: false,
      showBillerPopup: false,
      editBillMode: false,
      editBillerMode: false,
      saving: false,
      newBill: {
        biller: "",
        billing_date: "",
        amount: "",
        due_date: "",
        executive: "",
        remarks: "",
      },
      newOrder: {
        biller: "",
        order_placed_on: "",
        order_items: "",
        transport: "",
        drive_link: "",
        executive: "",
      },
      newBiller: {
        name: "",
        creditDuration: "",
        accountNo: "",
        ifsc: "",
        bankName: "",
        branch: "",
        executive: "",
      },
      reenterAccountNo: "",
      selectedBill: null,
      selectedBiller: null,
      confirmActionCallback: null,
      isMobile: window.innerWidth <= 900,
      errors: {},
      toast: { message: "", type: "" },
    };
  },
  computed: {
    filteredBills() {
      let filtered = this.bills;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((bill) =>
          Object.values(bill).some(
            (value) => value && value.toString().toLowerCase().includes(query)
          )
        );
      }
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
  watch: {
    "newBill.biller"(newVal) {
      const selected = this.billers.find((b) => b.name === newVal);
      if (selected) {
        this.newBill.executive = selected.executive;
        this.calculateDueDate();
      }
    },
    "newBill.billing_date"() {
      this.calculateDueDate();
    },
  },
  async mounted() {
    await this.fetchData();
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 900;
    },
    calculateDueDate() {
      if (this.newBill.billing_date && this.newBill.biller) {
        const selectedBiller = this.billers.find(
          (b) => b.name === this.newBill.biller
        );
        if (selectedBiller && selectedBiller.creditDuration) {
          const billingDate = new Date(this.newBill.billing_date);
          billingDate.setDate(
            billingDate.getDate() + parseInt(selectedBiller.creditDuration)
          );
          this.newBill.due_date = billingDate.toISOString().split("T")[0];
        }
      }
    },
    async fetchData() {
      await Promise.all([
        this.fetchBills(),
        this.fetchOrders(),
        this.fetchBillers(),
      ]);
    },
    async fetchBills() {
      const { data, error } = await supabase.from("dues").select("*");
      if (error) {
        this.showToast("Error fetching bills", "error");
        console.error("Error fetching bills:", error);
        return;
      }
      this.bills = data;
    },
    async fetchOrders() {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) {
        this.showToast("Error fetching orders", "error");
        console.error("Error fetching orders:", error);
        return;
      }
      this.orders = data;
    },
    async fetchBillers() {
      const { data, error } = await supabase.from("billers").select("*");
      if (error) {
        this.showToast("Error fetching billers", "error");
        console.error("Error fetching billers:", error);
        return;
      }
      this.billers = data;
    },
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
    openBillPopup() {
      this.editBillMode = false;
      this.newBill = {
        biller: "",
        billing_date: "",
        amount: "",
        due_date: "",
        executive: "",
        remarks: "",
      };
      this.errors = {};
      this.showBillPopup = true;
    },
    closeBillPopup() {
      this.showBillPopup = false;
      this.errors = {};
    },
    validateAndSaveBill() {
      this.errors = {};
      if (!this.newBill.biller) this.errors.biller = "Biller is required";
      if (!this.newBill.billing_date)
        this.errors.billing_date = "Billing date is required";
      if (!this.newBill.amount || this.newBill.amount <= 0)
        this.errors.amount = "Valid amount is required";
      if (!this.newBill.due_date) this.errors.due_date = "Due date is required";
      if (Object.keys(this.errors).length === 0) {
        this.saveBill();
      }
    },
    async saveBill() {
      this.saving = true;
      let error;
      if (this.editBillMode) {
        ({ error } = await supabase
          .from("dues")
          .update(this.newBill)
          .eq("id", this.newBill.id));
      } else {
        ({ error } = await supabase.from("dues").insert(this.newBill));
      }
      this.saving = false;
      if (error) {
        this.showToast("Error saving bill", "error");
        console.error("Error saving bill:", error);
        return;
      }
      this.showToast("Bill saved successfully", "success");
      this.closeBillPopup();
      await this.fetchBills();
    },
    editBill(bill) {
      this.editBillMode = true;
      this.newBill = { ...bill };
      this.errors = {};
      this.showBillPopup = true;
    },
    async markPaid(bill) {
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase
        .from("dues")
        .update({ is_paid: true, paid_on: today })
        .eq("id", bill.id);
      if (error) {
        this.showToast("Error marking as paid", "error");
        console.error("Error marking paid:", error);
        return;
      }
      this.showToast("Marked as paid", "success");
      await this.fetchBills();
    },
    showBankInfo(bill) {
      this.selectedBill = bill;
      this.selectedBiller = this.billers.find((b) => b.name === bill.biller);
      this.showBankPopup = true;
    },
    closeBankPopup() {
      this.showBankPopup = false;
    },
    copyText(text) {
      navigator.clipboard.writeText(text);
      this.showToast("Copied to clipboard", "success");
    },
    openOrderPopup() {
      this.newOrder = {
        biller: "",
        order_placed_on: "",
        order_items: "",
        transport: "",
        drive_link: "",
        executive: "",
      };
      this.errors = {};
      this.showOrderPopup = true;
    },
    closeOrderPopup() {
      this.showOrderPopup = false;
      this.errors = {};
    },
    validateAndSaveOrder() {
      this.errors = {};
      if (!this.newOrder.biller) this.errors.biller = "Biller is required";
      if (!this.newOrder.order_placed_on)
        this.errors.order_placed_on = "Order placed on date is required";
      if (!this.newOrder.order_items)
        this.errors.order_items = "Order items are required";
      if (Object.keys(this.errors).length === 0) {
        this.saveOrder();
      }
    },
    async saveOrder() {
      this.saving = true;
      const { error } = await supabase.from("orders").insert(this.newOrder);
      this.saving = false;
      if (error) {
        this.showToast("Error saving order", "error");
        console.error("Error saving order:", error);
        return;
      }
      this.showToast("Order saved successfully", "success");
      this.closeOrderPopup();
      await this.fetchOrders();
    },
    copyLink(link) {
      navigator.clipboard.writeText(link);
      this.showToast("Link copied to clipboard", "success");
    },
    openBillerPopup() {
      this.editBillerMode = false;
      this.newBiller = {
        name: "",
        creditDuration: "",
        accountNo: "",
        ifsc: "",
        bankName: "",
        branch: "",
        executive: "",
      };
      this.reenterAccountNo = "";
      this.errors = {};
      this.showBillerPopup = true;
    },
    closeBillerPopup() {
      this.showBillerPopup = false;
      this.errors = {};
    },
    validateAndSaveBiller() {
      this.errors = {};
      if (!this.newBiller.name) this.errors.name = "Name is required";
      if (!this.newBiller.creditDuration || this.newBiller.creditDuration <= 0)
        this.errors.creditDuration = "Valid credit duration is required";
      if (this.newBiller.accountNo !== this.reenterAccountNo)
        this.errors.reenterAccountNo = "Account numbers do not match";
      if (!this.newBiller.ifsc) this.errors.ifsc = "IFSC code is required";
      if (!this.newBiller.bankName)
        this.errors.bankName = "Bank name is required";
      if (!this.newBiller.branch) this.errors.branch = "Branch is required";
      if (!this.newBiller.executive)
        this.errors.executive = "Executive is required";
      if (Object.keys(this.errors).length === 0) {
        this.saveBiller();
      }
    },
    async saveBiller() {
      this.saving = true;
      let error;
      if (this.editBillerMode) {
        ({ error } = await supabase
          .from("billers")
          .update(this.newBiller)
          .eq("id", this.newBiller.id));
      } else {
        ({ error } = await supabase.from("billers").insert(this.newBiller));
      }
      this.saving = false;
      if (error) {
        this.showToast("Error saving biller", "error");
        console.error("Error saving biller:", error);
        return;
      }
      this.showToast("Biller saved successfully", "success");
      this.closeBillerPopup();
      await this.fetchBillers();
    },
    editBiller(biller) {
      this.editBillerMode = true;
      this.newBiller = { ...biller };
      this.reenterAccountNo = biller.accountNo;
      this.errors = {};
      this.showBillerPopup = true;
    },
    closeConfirmPopup() {
      this.showConfirmPopup = false;
    },
    confirmAction() {
      this.confirmActionCallback();
      this.closeConfirmPopup();
    },
    showToast(message, type = "success") {
      this.toast = { message, type };
      setTimeout(() => {
        this.toast = { message: "", type: "" };
      }, 3000);
    },
    // Add other methods as needed
  },
};
</script>

<style src="./styles.css"></style>
