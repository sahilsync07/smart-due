<template>
  <div class="app-layout">
    <!-- Sidebar Navigation (Desktop) -->
    <aside class="sidebar" :class="{ 'open': isSidebarOpen }">
      <div class="sidebar-header">
        <div class="brand">
          <div class="logo-icon">AN</div>
          <div class="brand-text">
            <h1>Admin Nexus</h1>
            <span>Shree Footwear</span>
          </div>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <a 
          href="#" 
          class="nav-item" 
          :class="{ active: activeTab === 'dues' }"
          @click.prevent="switchTab('dues')"
        >
          <span class="icon">💰</span> Dues
        </a>
        <a 
          href="#" 
          class="nav-item" 
          :class="{ active: activeTab === 'orders' }"
          @click.prevent="switchTab('orders')"
        >
          <span class="icon">📦</span> Orders
        </a>
        <a 
          href="#" 
          class="nav-item" 
          :class="{ active: activeTab === 'billers' }"
          @click.prevent="switchTab('billers')"
        >
          <span class="icon">👥</span> Billers
        </a>
        <a 
          href="#" 
          class="nav-item" 
          :class="{ active: activeTab === 'pdf' }"
          @click.prevent="switchTab('pdf')"
        >
          <span class="icon">📄</span> PDF Generator
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">A</div>
          <div class="user-details">
            <span class="name">Admin User</span>
            <span class="role">Manager</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="mobile-header">
      <button class="menu-btn" @click="toggleSidebar">
        ☰
      </button>
      <div class="mobile-brand">Admin Nexus</div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Bar with Actions -->
      <div class="top-bar">
        <h2 class="page-title">{{ pageTitle }}</h2>
        <div class="actions">
          <button 
            v-if="activeTab !== 'pdf'" 
            class="btn btn-primary"
            @click="openAddPopup"
          >
            <span class="icon">+</span> Add New
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <component 
          :is="currentTabComponent"
          :bills="bills"
          :orders="orders"
          :billers="billers"
          :brands="brands"
          :is-loading="isLoading"
          :is-mobile="isMobile"
          @edit-bill="editBill"
          @mark-paid="markPaid"
          @mark-unpaid="markUnpaid"
          @show-bank-info="showBankInfo"
          @copy-link="copyLink"
          @edit-biller="editBiller"
          @generate-pdf="generatePdf"
        ></component>
      </div>
    </main>

    <!-- Overlay for mobile sidebar -->
    <div 
      class="sidebar-overlay" 
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Modals -->
    <!-- Bill Modal -->
    <div class="modal-backdrop" v-if="showBillPopup">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editBillMode ? "Edit Bill" : "New Bill" }}</h3>
          <button class="btn-icon" @click="closeBillPopup">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="saving" class="saving-overlay">
            <div class="loader"></div> Saving...
          </div>
          
          <div class="form-group">
            <label>Biller</label>
            <select v-model="newBill.biller" class="form-control">
              <option value="" disabled>Select a biller</option>
              <option v-for="biller in billers" :key="biller.id" :value="biller.name">
                {{ biller.name }}
              </option>
            </select>
            <span v-if="errors.biller" class="text-danger text-sm">{{ errors.biller }}</span>
          </div>

          <div class="flex gap-4">
            <div class="form-group w-full">
              <label>Billing Date</label>
              <input type="date" v-model="newBill.billing_date" class="form-control" />
              <span v-if="errors.billing_date" class="text-danger text-sm">{{ errors.billing_date }}</span>
            </div>
            <div class="form-group w-full">
               <label>Due Date</label>
              <input type="date" v-model="newBill.due_date" class="form-control" />
              <span v-if="errors.due_date" class="text-danger text-sm">{{ errors.due_date }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Amount (₹)</label>
            <input type="number" v-model="newBill.amount" class="form-control" placeholder="0.00" />
            <span v-if="errors.amount" class="text-danger text-sm">{{ errors.amount }}</span>
          </div>

          <div class="form-group">
            <label>Remarks</label>
            <input type="text" v-model="newBill.remarks" class="form-control" placeholder="Optional remarks" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeBillPopup">Cancel</button>
          <button class="btn btn-primary" @click="validateAndSaveBill">
            {{ editBillMode ? "Update Bill" : "Safe Bill" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Order Modal -->
    <div class="modal-backdrop" v-if="showOrderPopup">
      <div class="modal-content">
        <div class="modal-header">
          <h3>New Order</h3>
          <button class="btn-icon" @click="closeOrderPopup">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="saving" class="saving-overlay"><div class="loader"></div></div>
          
          <div class="form-group">
            <label>Biller</label>
            <select v-model="newOrder.biller" class="form-control">
              <option v-for="biller in billers" :key="biller.id" :value="biller.name">{{ biller.name }}</option>
            </select>
            <span v-if="errors.biller" class="text-danger text-sm">{{ errors.biller }}</span>
          </div>

          <div class="form-group">
            <label>Order Date</label>
            <input type="date" v-model="newOrder.order_placed_on" class="form-control" />
            <span v-if="errors.order_placed_on" class="text-danger text-sm">{{ errors.order_placed_on }}</span>
          </div>

          <div class="form-group">
            <label>Items</label>
            <textarea v-model="newOrder.order_items" class="form-control" rows="3" placeholder="List items here..."></textarea>
            <span v-if="errors.order_items" class="text-danger text-sm">{{ errors.order_items }}</span>
          </div>

          <div class="form-group">
            <label>Transport</label>
            <input type="text" v-model="newOrder.transport" class="form-control" />
          </div>
          
          <div class="form-group">
            <label>Drive Link</label>
            <input type="text" v-model="newOrder.drive_link" class="form-control" placeholder="https://..." />
          </div>
          
          <div class="form-group">
            <label>Executive</label>
            <input type="text" v-model="newOrder.executive" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeOrderPopup">Cancel</button>
          <button class="btn btn-primary" @click="validateAndSaveOrder">Save Order</button>
        </div>
      </div>
    </div>

    <!-- Biller Modal -->
    <div class="modal-backdrop" v-if="showBillerPopup">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editBillerMode ? "Edit Biller" : "Add Biller" }}</h3>
          <button class="btn-icon" @click="closeBillerPopup">✕</button>
        </div>
        <div class="modal-body">
           <div v-if="saving" class="saving-overlay"><div class="loader"></div></div>

           <div class="form-group">
             <label>Name</label>
             <input type="text" v-model="newBiller.name" class="form-control" />
             <span v-if="errors.name" class="text-danger text-sm">{{ errors.name }}</span>
           </div>

           <div class="flex gap-4">
             <div class="form-group w-full">
               <label>Credit Days</label>
               <input type="number" v-model="newBiller.creditDuration" class="form-control" />
             </div>
             <div class="form-group w-full">
               <label>Executive</label>
               <input type="text" v-model="newBiller.executive" class="form-control" />
             </div>
           </div>

           <div class="form-group">
             <label>Bank Name</label>
             <input type="text" v-model="newBiller.bankName" class="form-control" />
           </div>

           <div class="form-group">
             <label>Account Number</label>
             <input type="text" v-model="newBiller.accountNo" class="form-control" />
           </div>
           
           <div class="form-group">
             <label>IFSC</label>
             <input type="text" v-model="newBiller.ifsc" class="form-control" />
           </div>
           
           <div class="form-group">
             <label>Branch</label>
             <input type="text" v-model="newBiller.branch" class="form-control" />
           </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeBillerPopup">Cancel</button>
          <button class="btn btn-primary" @click="validateAndSaveBiller">
             {{ editBillerMode ? "Update" : "Save" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Bank Info Modal -->
    <div class="modal-backdrop" v-if="showBankPopup">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Bank Details</h3>
          <button class="btn-icon" @click="closeBankPopup">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedBiller" class="bank-details-card">
             <div class="detail-row">
               <span class="label">Bank</span>
               <span class="value">{{ selectedBiller.bankName }}</span>
               <button class="btn-icon-sm" @click="copyText(selectedBiller.bankName)">📋</button>
             </div>
             <div class="detail-row">
               <span class="label">Account</span>
               <span class="value">{{ selectedBiller.accountNo }}</span>
               <button class="btn-icon-sm" @click="copyText(selectedBiller.accountNo)">📋</button>
             </div>
             <div class="detail-row">
               <span class="label">IFSC</span>
               <span class="value">{{ selectedBiller.ifsc }}</span>
               <button class="btn-icon-sm" @click="copyText(selectedBiller.ifsc)">📋</button>
             </div>
              <div class="detail-row">
               <span class="label">Branch</span>
               <span class="value">{{ selectedBiller.branch }}</span>
               <button class="btn-icon-sm" @click="copyText(selectedBiller.branch)">📋</button>
             </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="toast.message" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
import { supabase } from "./utils/supabase";
import axios from "axios";
import Dues from "./components/Dues.vue";
import Orders from "./components/Orders.vue";
import Billers from "./components/Billers.vue";
import PdfGenerator from "./components/PdfGenerator.vue";

export default {
  components: {
    Dues,
    Orders,
    Billers,
    PdfGenerator,
  },
  data() {
    return {
      activeTab: "dues",
      isSidebarOpen: false,
      bills: [],
      orders: [],
      billers: [],
      brands: [],
      isLoading: false,
      showBillPopup: false,
      showOrderPopup: false,
      showBillerPopup: false,
      showBankPopup: false,
      editBillMode: false,
      editBillerMode: false,
      saving: false,
      newBill: {
        biller: "",
        billing_date: "",
        amount: "",
        due_date: "",
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
      selectedBill: null,
      selectedBiller: null,
      isMobile: window.innerWidth <= 900,
      errors: {},
      toast: { message: "", type: "" },
    };
  },
  computed: {
    currentTabComponent() {
      if (this.activeTab === 'dues') return 'Dues';
      if (this.activeTab === 'orders') return 'Orders';
      if (this.activeTab === 'billers') return 'Billers';
      if (this.activeTab === 'pdf') return 'PdfGenerator';
      return 'Dues';
    },
    pageTitle() {
      if (this.activeTab === 'dues') return 'Dues Management';
      if (this.activeTab === 'orders') return 'Order History';
      if (this.activeTab === 'billers') return 'Biller Directory';
      if (this.activeTab === 'pdf') return 'PDF Catalog Generator';
      return '';
    }
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
    switchTab(tab) {
      this.activeTab = tab;
      this.isSidebarOpen = false; // Close sidebar on mobile
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    openAddPopup() {
        if(this.activeTab === 'dues') this.openBillPopup();
        if(this.activeTab === 'orders') this.openOrderPopup();
        if(this.activeTab === 'billers') this.openBillerPopup();
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 900;
      if (!this.isMobile) this.isSidebarOpen = false;
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
      this.isLoading = true;
      await Promise.all([
        this.fetchBills(),
        this.fetchOrders(),
        this.fetchBillers(),
        this.fetchBrands(),
      ]);
      this.isLoading = false;
    },
    async fetchBills() {
      const { data, error } = await supabase.from("dues").select("*");
      if (error) {
        console.error("Error fetching bills:", error);
        return;
      }
      this.bills = data || [];
    },
    async fetchOrders() {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }
      this.orders = data || [];
    },
    async fetchBillers() {
      const { data, error } = await supabase.from("billers").select("*");
      if (error) {
        console.error("Error fetching billers:", error);
        return;
      }
      this.billers = data || [];
    },
    async fetchBrands() {
      try {
        const jsonUrl =
          "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json";
        const response = await axios.get(jsonUrl);
        this.brands = [
          ...new Set(response.data.map((group) => group.groupName)),
        ];
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    },
    async generatePdf() {
      // Pass through to the component using ref or event bus if possible, 
      // but since PdfGenerator component handles it, we might need a reference.
      // For now, let's assume the component will handle its own button.
      // Actually, I moved the button to the parent. I need to trigger the child.
      // Simplified: Let PdfGenerator have its own button inside its view for now to avoid ref complexity in this refactor.
    },
    openBillPopup() {
      this.editBillMode = false;
      this.newBill = {
        biller: "",
        billing_date: "",
        amount: "",
        due_date: "",
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
        return;
      }
      this.showToast("Marked as paid", "success");
      await this.fetchBills();
    },
    async markUnpaid(bill) {
      const { error } = await supabase
        .from("dues")
        .update({ is_paid: false, paid_on: null })
        .eq("id", bill.id);
      if (error) {
        this.showToast("Error marking as unpaid", "error");
        return;
      }
      this.showToast("Marked as unpaid", "success");
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
        this.errors.order_placed_on = "Date is required";
      if (!this.newOrder.order_items)
        this.errors.order_items = "Items are required";
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
        return;
      }
      this.showToast("Order saved successfully", "success");
      this.closeOrderPopup();
      await this.fetchOrders();
    },
    copyLink(link) {
      navigator.clipboard.writeText(link);
      this.showToast("Link copied", "success");
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
        return;
      }
      this.showToast("Biller saved successfully", "success");
      this.closeBillerPopup();
      await this.fetchBillers();
    },
    editBiller(biller) {
      this.editBillerMode = true;
      this.newBiller = { ...biller };
      this.showBillerPopup = true;
    },
    showToast(message, type = "success") {
      this.toast = { message, type };
      setTimeout(() => {
        this.toast = { message: "", type: "" };
      }, 3000);
    },
  },
};
</script>

<style src="./styles.css"></style>

<style scoped>
/* Scoped styles for the layout structure */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  z-index: 40;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.sidebar-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border);
}

.brand { display: flex; align-items: center; gap: 0.75rem; }
.logo-icon { 
  width: 32px; 
  height: 32px; 
  background: var(--primary); 
  color: white; 
  border-radius: 6px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: 700;
}
.brand-text h1 { font-size: 1rem; margin: 0; }
.brand-text span { font-size: 0.75rem; color: var(--text-secondary); display: block; }

.sidebar-nav { padding: 1.5rem 1rem; flex: 1; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  margin-bottom: 0.25rem;
  transition: all 0.2s;
  font-weight: 500;
}
.nav-item:hover, .nav-item.active {
  background: var(--primary-light);
  color: var(--primary);
}
.nav-item .icon { font-size: 1.2rem; }

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border);
}
.user-info { display: flex; align-items: center; gap: 0.75rem; }
.user-info .avatar {
  width: 36px; height: 36px; background: var(--secondary); color: white;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.user-details .name { display: block; font-size: 0.875rem; font-weight: 600; }
.user-details .role { display: block; font-size: 0.75rem; color: var(--text-secondary); }

/* Main Content Layout */
.main-content {
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0; /* Reset for inner structure */
}

.top-bar {
  height: var(--header-height);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 30;
}

.content-area {
  padding: 2rem;
  flex: 1;
}

/* Mobile */
.mobile-header { display: none; }
.menu-btn { background: none; font-size: 1.5rem; padding: 0.5rem; }

@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main-content { margin-left: 0; }
  
  .mobile-header {
    display: flex;
    align-items: center;
    height: var(--header-height);
    background: var(--bg-surface);
    padding: 0 1rem;
    border-bottom: 1px solid var(--border);
    justify-content: space-between;
  }
  .mobile-brand { font-weight: 600; font-size: 1.1rem; }
  
  .top-bar { display: none; } /* On mobile, title is in header or sub-header */
  .content-area { padding: 1rem; }
  
  .sidebar-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 35;
  }
}

.text-danger { color: var(--danger); }
.text-sm { font-size: 0.8rem; }
.bank-details-card .detail-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.75rem 0; border-bottom: 1px solid var(--border);
}
.btn-icon-sm { background: none; border: none; font-size: 1rem; cursor: pointer; }
</style>
