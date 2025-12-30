<template>
  <div>
    <header>
      <div class="header-content">
        <h1>Admin Nexus</h1>
        <span class="sbe-text">Shree Footwear</span>
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
          <button
            class="tab-button"
            :class="{ active: activeTab === 'pdf' }"
            @click="activeTab = 'pdf'"
          >
            PDF Generator
          </button>
        </div>
        <div class="tab-content">
          <Dues
            v-if="activeTab === 'dues'"
            :bills="bills"
            :billers="billers"
            :is-mobile="isMobile"
            @edit-bill="editBill"
            @mark-paid="markPaid"
            @mark-unpaid="markUnpaid"
            @show-bank-info="showBankInfo"
          />
          <Orders
            v-if="activeTab === 'orders'"
            :orders="orders"
            :is-mobile="isMobile"
            @copy-link="copyLink"
          />
          <Billers
            v-if="activeTab === 'billers'"
            :billers="billers"
            :is-mobile="isMobile"
            @edit-biller="editBiller"
          />
          <PdfGenerator
            v-if="activeTab === 'pdf'"
            :brands="brands"
            :is-loading="isLoading"
            @generate-pdf="generatePdf"
          />
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
      bills: [],
      orders: [],
      billers: [],
      brands: [],
      isLoading: false,
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
        this.fetchBrands(),
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
    async fetchBrands() {
      try {
        const jsonUrl =
          "https://raw.githubusercontent.com/sahilsync07/sbe/main/frontend/public/assets/stock-data.json";
        const response = await axios.get(jsonUrl);
        this.brands = [
          ...new Set(response.data.map((group) => group.groupName)),
        ];
      } catch (err) {
        this.showToast("Error fetching brands", "error");
        console.error("Error fetching brands:", err);
      }
    },
    async generatePdf() {
      const payload = this.$refs.pdfGenerator?.getPayload();
      if (!payload || payload.brands.length === 0) {
        this.showToast("Please select at least one brand", "error");
        return;
      }
      this.isLoading = true;
      try {
        const response = await axios.post(
          "http://localhost:3001/generate-pdf",
          payload,
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "products.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.showToast("PDF generated successfully", "success");
      } catch (err) {
        this.showToast("Failed to generate PDF", "error");
        console.error("Error generating PDF:", err);
      } finally {
        this.isLoading = false;
      }
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
    async markUnpaid(bill) {
      const { error } = await supabase
        .from("dues")
        .update({ is_paid: false, paid_on: null })
        .eq("id", bill.id);
      if (error) {
        this.showToast("Error marking as unpaid", "error");
        console.error("Error marking unpaid:", error);
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
  },
};
</script>

<style src="./styles.css"></style>
