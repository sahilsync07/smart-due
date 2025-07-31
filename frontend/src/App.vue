<template>
  <div class="min-h-screen bg-gray-100">
    <header
      class="bg-purple-600 text-white p-4 flex justify-between items-center"
    >
      <h1 class="text-2xl font-bold">Smart Due</h1>
      <div class="text-right">
        <span
          class="text-2xl font-bold"
          style="letter-spacing: -1px; color: #6366f1"
          >Sri Brundabana Enterprises</span
        >
      </div>
    </header>
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-2">
        <div class="flex space-x-4">
          <button
            @click="openAddBillPopup"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Bill
          </button>
          <button
            @click="openAddBillerPopup"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Biller
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="date"
            v-model="dateFilterStart"
            class="p-2 rounded border"
            placeholder="Start Date"
          />
          <span class="text-gray-600 px-2">to</span>
          <input
            type="date"
            v-model="dateFilterEnd"
            class="p-2 rounded border"
            placeholder="End Date"
          />
        </div>
      </div>
      <table class="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr
            class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
          >
            <th class="py-3 px-6 text-left">Billing Date</th>
            <th class="py-3 px-6 text-left">Biller Name</th>
            <th class="py-3 px-6 text-left">Bill Amount</th>
            <th class="py-3 px-6 text-left">Due in</th>
            <th class="py-3 px-6 text-left">Due On</th>
            <th class="py-3 px-6 text-left">Status</th>
            <th class="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="bill in filteredBills"
            :key="bill.id"
            class="border-b hover:bg-gray-100"
          >
            <td class="py-3 px-6">{{ bill.date }}</td>
            <td class="py-3 px-6">{{ bill.billerName }}</td>
            <td class="py-3 px-6">{{ bill.amount }}</td>
            <td class="py-3 px-6">{{ getDueInDays(bill) }}</td>
            <td class="py-3 px-6">{{ getDueOnDate(bill) }}</td>
            <td
              class="py-3 px-6"
              :class="{
                'text-red-500': getStatus(bill) === 'Overdue',
                'text-yellow-500': getStatus(bill) === 'Due',
                'text-green-500': getStatus(bill) === 'No Due',
              }"
            >
              {{ getStatus(bill) }}
            </td>
            <td class="py-3 px-6">
              <button
                @click="openEditBill(bill)"
                class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Update
              </button>
              <button
                @click="openDeletePopup(bill)"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Bill Popup -->
    <div
      v-if="showAddBillPopup"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center popup"
    >
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="text-xl mb-4">{{ isEditing ? "Update Bill" : "Add" }}</h2>
        <div class="form-group">
          <label>Biller Name</label>
          <select
            v-model="newBill.billerName"
            class="w-full p-2 border rounded mt-1"
          >
            <option value="" disabled selected>Select Biller</option>
            <option
              v-for="biller in billers"
              :key="biller.name"
              :value="biller.name"
            >
              {{ biller.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Billing Date</label>
          <input
            v-model="newBill.date"
            type="date"
            class="w-full p-2 border rounded mt-1"
          />
        </div>
        <div class="form-group">
          <label>Amount</label>
          <input
            v-model.number="newBill.amount"
            type="number"
            placeholder="Enter Amount"
            class="w-full p-2 border rounded mt-1"
          />
        </div>
        <div class="form-group">
          <label>Due Duration (days)</label>
          <input
            v-model.number="newBill.dueDuration"
            type="number"
            placeholder="Enter Due Duration"
            class="w-full p-2 border rounded mt-1"
          />
        </div>
        <div class="flex justify-end space-x-4">
          <button
            @click="saveBill"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            @click="cancelAddBill"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Popup -->
    <div
      v-if="showDeletePopup"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center popup"
    >
      <div class="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 class="text-xl mb-4">Confirm Delete</h2>
        <input
          v-model="deletePassword"
          type="password"
          placeholder="Enter 'delete' to confirm"
          class="w-full p-2 mb-4 border rounded"
        />
        <div class="flex justify-end space-x-4">
          <button
            @click="confirmDelete"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Add Biller Popup -->
    <div
      v-if="showAddBillerPopup"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center popup"
    >
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="text-xl mb-4">Add Biller</h2>
        <div class="form-group">
          <label>Biller Name</label>
          <input
            v-model="newBiller.name"
            type="text"
            placeholder="Enter Biller Name"
            class="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div class="form-group">
          <label>Credit Duration</label>
          <div class="flex items-center">
            <input
              v-model.number="newBiller.creditDuration"
              type="number"
              placeholder="Enter Credit Duration"
              class="w-full p-2 border rounded mt-1 mr-2"
              required
            />
            <div class="flex space-x-2">
              <label class="flex items-center">
                <input
                  v-model="creditUnit"
                  type="radio"
                  value="days"
                  class="form-radio h-5 w-5 text-blue-600"
                  name="creditUnit"
                  checked
                />
                <span class="ml-2">Days</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="creditUnit"
                  type="radio"
                  value="months"
                  class="form-radio h-5 w-5 text-blue-600"
                  name="creditUnit"
                />
                <span class="ml-2">Months</span>
              </label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Bank Name</label>
          <input
            v-model="newBiller.bankName"
            type="text"
            placeholder="Enter Bank Name"
            class="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div class="form-group">
          <label>Account Number</label>
          <input
            v-model="newBiller.accountNo"
            type="password"
            placeholder="Enter Account Number"
            class="w-full p-2 border rounded mt-1 account-no-input"
            required
            @paste.prevent
          />
        </div>
        <div class="form-group">
          <label>Repeat Account Number</label>
          <input
            v-model="newBiller.repeatAccountNo"
            type="text"
            placeholder="Re-enter Account Number"
            class="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div class="form-group">
          <label>IFSC Code</label>
          <input
            v-model="newBiller.ifsc"
            type="text"
            placeholder="Enter IFSC Code"
            class="w-full p-2 border rounded mt-1"
            required
            @input="fetchBranchName"
          />
        </div>
        <div class="form-group">
          <label>Branch</label>
          <input
            v-model="newBiller.branch"
            type="text"
            placeholder="Branch Name"
            class="w-full p-2 border rounded mt-1"
            required
            readonly
          />
        </div>
        <div class="flex justify-end space-x-4">
          <button
            @click="saveBiller"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            :disabled="!isBillerValid"
          >
            Save
          </button>
          <button
            @click="cancelAddBiller"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";

export default {
  setup() {
    const bills = ref([]);
    const billers = ref([]);
    const showAddBillPopup = ref(false);
    const showDeletePopup = ref(false);
    const showAddBillerPopup = ref(false);
    const newBill = ref({
      id: Date.now(),
      billerName: "",
      date: "",
      amount: null,
      dueDuration: 0,
      active: 1,
    });
    const dateFilterStart = ref("");
    const dateFilterEnd = ref("");
    const newBiller = ref({
      name: "",
      creditDuration: 0,
      bankName: "",
      accountNo: "",
      repeatAccountNo: "",
      ifsc: "",
      branch: "",
    });
    const deletePassword = ref("");
    const selectedBill = ref(null);
    const creditUnit = ref("days"); // Default to days
    const isEditing = ref(false);
    const today = new Date().toISOString().split("T")[0];

    onMounted(() => {
      fetchBills();
      fetchBillers();
    });

    const filteredBills = computed(() => {
      return bills.value.filter((bill) => {
        if (!dateFilterStart.value && !dateFilterEnd.value) return true;
        const billDate = new Date(bill.date);
        const startDate = dateFilterStart.value
          ? new Date(dateFilterStart.value)
          : null;
        const endDate = dateFilterEnd.value
          ? new Date(dateFilterEnd.value)
          : null;

        if (startDate && endDate)
          return billDate >= startDate && billDate <= endDate;
        if (startDate) return billDate >= startDate;
        if (endDate) return billDate <= endDate;
        return true;
      });
    });

    const selectedBillerCreditDuration = computed(() => {
      const biller = billers.value.find(
        (b) => b.name === newBill.value.billerName
      );
      return biller ? biller.creditDuration : newBill.value.dueDuration || 0;
    });

    const isBillerValid = computed(() => {
      return (
        newBiller.value.name &&
        newBiller.value.creditDuration &&
        newBiller.value.bankName &&
        newBiller.value.accountNo &&
        newBiller.value.repeatAccountNo &&
        newBiller.value.ifsc &&
        newBiller.value.branch &&
        newBiller.value.accountNo === newBiller.value.repeatAccountNo
      );
    });

    const getDueInDays = (bill) => {
      const biller = billers.value.find((b) => b.name === bill.billerName);
      const creditDuration = biller ? biller.creditDuration : bill.dueDuration;
      const billDate = new Date(bill.date);
      const dueDate = new Date(billDate);
      dueDate.setDate(billDate.getDate() + creditDuration);
      const todayDate = new Date(today);
      const diffTime = dueDate - todayDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const getDueOnDate = (bill) => {
      const biller = billers.value.find((b) => b.name === bill.billerName);
      const creditDuration = biller ? biller.creditDuration : bill.dueDuration;
      const billDate = new Date(bill.date);
      const dueDate = new Date(billDate);
      dueDate.setDate(billDate.getDate() + creditDuration);
      return dueDate.toISOString().split("T")[0];
    };

    const getStatus = (bill) => {
      const dueInDays = getDueInDays(bill);
      if (dueInDays < 0) return "Overdue";
      if (dueInDays === 0) return "Due";
      return "No Due";
    };

    const openAddBillPopup = () => {
      newBill.value = {
        id: Date.now(),
        billerName: "",
        date: today,
        amount: null,
        dueDuration: selectedBillerCreditDuration.value,
        active: 1,
      };
      isEditing.value = false;
      showAddBillPopup.value = true;
    };

    const openEditBill = (bill) => {
      newBill.value = { ...bill };
      isEditing.value = true;
      showAddBillPopup.value = true;
    };

    const openDeletePopup = (bill) => {
      selectedBill.value = bill;
      deletePassword.value = "";
      showDeletePopup.value = true;
    };

    const saveBill = () => {
      const billIndex = bills.value.findIndex((b) => b.id === newBill.value.id);
      if (billIndex > -1) {
        bills.value[billIndex] = newBill.value;
      } else {
        bills.value.push(newBill.value);
      }
      saveToJson("http://localhost:3001/bill-data.json", bills.value);
      showAddBillPopup.value = false;
    };

    const confirmDelete = () => {
      if (deletePassword.value === "delete") {
        selectedBill.value.active = 0;
        saveToJson("http://localhost:3001/bill-data.json", bills.value);
        showDeletePopup.value = false;
      }
    };

    const cancelAddBill = () => (showAddBillPopup.value = false);
    const cancelDelete = () => (showDeletePopup.value = false);
    const openAddBillerPopup = () => {
      newBiller.value = {
        name: "",
        creditDuration: 0,
        bankName: "",
        accountNo: "",
        repeatAccountNo: "",
        ifsc: "",
        branch: "",
      };
      creditUnit.value = "days"; // Reset to days by default
      showAddBillerPopup.value = true;
    };

    const convertCreditDuration = () => {
      if (creditUnit.value === "months" && newBiller.value.creditDuration) {
        newBiller.value.creditDuration *= 30;
      }
    };

    watch(creditUnit, convertCreditDuration);

    const saveBiller = () => {
      if (isBillerValid.value) {
        billers.value.push({ ...newBiller.value });
        saveToJson("http://localhost:3001/biller-data.json", billers.value);
        showAddBillerPopup.value = false;
      }
    };

    const cancelAddBiller = () => (showAddBillerPopup.value = false);

    const fetchBills = () => {
      fetch("http://localhost:3001/bill-data.json")
        .then((res) => res.json())
        .then((data) => (bills.value = data.filter((b) => b.active === 1)))
        .catch((error) => {
          console.error("Error fetching bills:", error);
          bills.value = [];
        });
    };

    const fetchBillers = () => {
      fetch("http://localhost:3001/biller-data.json")
        .then((res) => res.json())
        .then((data) => (billers.value = data))
        .catch((error) => {
          console.error("Error fetching billers:", error);
          billers.value = [];
        });
    };

    const saveToJson = (url, data) => {
      fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to save data");
        })
        .catch((error) => console.error("Error saving data:", error));
    };

    const fetchBranchName = async () => {
      const ifsc = newBiller.value.ifsc.toUpperCase();
      if (ifsc.length === 11) {
        try {
          const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
          if (response.ok) {
            const data = await response.json();
            newBiller.value.branch = data.BRANCH || "Branch not found";
          } else {
            newBiller.value.branch = "Invalid IFSC or Branch not found";
          }
        } catch (error) {
          console.error("Error fetching branch:", error);
          newBiller.value.branch = "Error fetching branch";
        }
      }
    };

    return {
      bills,
      billers,
      showAddBillPopup,
      showDeletePopup,
      showAddBillerPopup,
      newBill,
      newBiller,
      deletePassword,
      selectedBill,
      creditUnit,
      today,
      isEditing,
      filteredBills,
      selectedBillerCreditDuration,
      isBillerValid,
      getDueInDays,
      getDueOnDate,
      getStatus,
      openAddBillPopup,
      openEditBill,
      openDeletePopup,
      saveBill,
      confirmDelete,
      cancelAddBill,
      cancelDelete,
      openAddBillerPopup,
      saveBiller,
      cancelAddBiller,
      dateFilterStart,
      dateFilterEnd,
      fetchBranchName,
    };
  },
};
</script>

<style scoped>
@import "./styles.css";
</style>
