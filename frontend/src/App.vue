<template>
  <div class="min-h-screen bg-gray-100">
    <header
      class="bg-purple-600 text-white p-4 flex justify-between items-center"
    >
      <div class="header-content">
        <h1 class="text-2xl font-bold">Smart Due</h1>
        <span class="text-xl font-bold sbe-text"
          >Sri Brundabana Enterprises</span
        >
      </div>
    </header>
    <div class="container mx-auto p-4">
      <div class="controls-container">
        <div class="button-group">
          <button
            @click="setView('smartDue')"
            :class="[
              'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
              { 'bg-blue-700': currentView === 'smartDue' },
            ]"
          >
            Smart Due
          </button>
          <button
            @click="openAddBillPopup"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Bill
          </button>
          <button
            @click="setView('ordersPlaced')"
            :class="[
              'orders-placed-button font-bold py-2 px-4 rounded',
              { 'orders-placed-button-active': currentView === 'ordersPlaced' },
            ]"
          >
            Orders Placed
          </button>
          <button
            @click="openAddOrderPopup"
            class="new-order-button font-bold py-2 px-4 rounded"
          >
            New Order
          </button>
          <button
            @click="setView('showBillers')"
            :class="[
              'bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded',
              { 'bg-indigo-700': currentView === 'showBillers' },
            ]"
          >
            Show Billers
          </button>
          <button
            @click="openAddBillerPopup"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Biller
          </button>
        </div>
        <div class="date-filter-group" v-if="currentView === 'smartDue'">
          <input
            type="date"
            v-model="dateFilterStart"
            class="p-2 rounded border date-input"
            placeholder="From Date"
          />
          <span class="text-gray-600 px-2">to</span>
          <input
            type="date"
            v-model="dateFilterEnd"
            class="p-2 rounded border date-input"
            placeholder="To Date"
          />
        </div>
      </div>

      <!-- Smart Due View (Due Table) -->
      <div class="table-responsive" v-if="currentView === 'smartDue'">
        <table class="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr
              class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
            >
              <th class="py-3 px-6 text-left biller">Biller</th>
              <th class="py-3 px-6 text-left">Billing Date</th>
              <th class="py-3 px-6 text-left">Amount</th>
              <th class="py-3 px-6 text-left">Due Date</th>
              <th class="py-3 px-6 text-left">Due In</th>
              <th class="py-3 px-6 text-left">Status</th>
              <th class="py-3 px-6 text-left action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="bill in filteredBills"
              :key="bill.biller + bill.due_date"
              class="border-b hover:bg-gray-100"
            >
              <td class="py-3 px-6 biller">{{ bill.biller }}</td>
              <td class="py-3 px-6">
                {{ formatIndianDate(bill.billing_date) }}
              </td>
              <td class="py-3 px-6">{{ formatIndianCurrency(bill.amount) }}</td>
              <td class="py-3 px-6">{{ formatIndianDate(bill.due_date) }}</td>
              <td class="py-3 px-6">{{ getDueInDays(bill) }}</td>
              <td
                class="py-3 px-6"
                :class="{
                  'text-blue-500': getStatus(bill) === 'Paid',
                  'text-green-500': getStatus(bill) === 'No Due',
                  'text-red-500': getStatus(bill) === 'Overdue',
                  'text-yellow-500': getStatus(bill) === 'Due',
                }"
              >
                {{ getStatus(bill) }}
              </td>
              <td class="py-3 px-6 action-cell">
                <div class="action-buttons">
                  <button
                    @click="openEditBillPopup(bill)"
                    class="action-button bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Edit Bill
                  </button>
                  <button
                    @click="openMarkAsPaidPopup(bill)"
                    class="action-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Mark Paid
                  </button>
                  <button
                    @click="openBankDetailsPopup(bill)"
                    class="action-button bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Bank Details
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Orders Placed View -->
      <div class="table-responsive" v-if="currentView === 'ordersPlaced'">
        <table class="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr
              class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
            >
              <th class="py-3 px-6 text-left biller">Biller</th>
              <th class="py-3 px-6 text-left">Order Placed On</th>
              <th class="py-3 px-6 text-left">Order Items</th>
              <th class="py-3 px-6 text-left">Transport</th>
              <th class="py-3 px-6 text-left">Drive Link</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(order, index) in orders"
              :key="index"
              class="border-b hover:bg-gray-100"
            >
              <td class="py-3 px-6 biller">{{ order.biller }}</td>
              <td class="py-3 px-6">
                {{ formatIndianDate(order.order_placed_on) }}
              </td>
              <td class="py-3 px-6">{{ order.order_items }}</td>
              <td class="py-3 px-6">{{ order.transport }}</td>
              <td class="py-3 px-6">
                <button
                  @click="copyToClipboard(order.drive_link)"
                  class="copy-button bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded flex items-center"
                >
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Copy Link
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Show Billers View -->
      <div class="table-responsive" v-if="currentView === 'showBillers'">
        <table class="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr
              class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
            >
              <th class="py-3 px-6 text-left">Name</th>
              <th class="py-3 px-6 text-left">Credit Duration</th>
              <th class="py-3 px-6 text-left">Account No</th>
              <th class="py-3 px-6 text-left">IFSC</th>
              <th class="py-3 px-6 text-left">Bank Name</th>
              <th class="py-3 px-6 text-left">Branch</th>
              <th class="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="biller in billers"
              :key="biller.name"
              class="border-b hover:bg-gray-100"
            >
              <td class="py-3 px-6">{{ biller.name }}</td>
              <td class="py-3 px-6">{{ biller.creditDuration }}</td>
              <td class="py-3 px-6">{{ biller.accountNo }}</td>
              <td class="py-3 px-6">{{ biller.ifsc }}</td>
              <td class="py-3 px-6">{{ biller.bankName }}</td>
              <td class="py-3 px-6">{{ biller.branch }}</td>
              <td class="py-3 px-6">
                <button
                  @click="openEditBillerPopup(biller)"
                  class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-1 px-2 rounded"
                >
                  Edit Biller
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Bill Popup -->
      <div
        v-if="showAddBillPopup"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center popup"
      >
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-[600px]">
          <h2 class="text-xl mb-4">
            {{ editBillMode ? "Edit Bill" : "Add Bill" }}
          </h2>
          <div class="form-group">
            <label>Biller</label>
            <select
              v-model="newBill.biller"
              class="w-full p-2 border rounded mt-1"
              required
            >
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
              v-model="newBill.billing_date"
              type="date"
              class="w-full p-2 border rounded mt-1 date-input"
              placeholder="Billing Date"
              required
            />
          </div>
          <div class="form-group">
            <label>Amount</label>
            <input
              v-model.number="newBill.amount"
              type="number"
              class="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div class="form-group">
            <label>Due Date</label>
            <input
              v-model="newBill.due_date"
              type="date"
              class="w-full p-2 border rounded mt-1 date-input"
              placeholder="Due Date"
              required
            />
          </div>
          <div class="form-group">
            <label>Remarks</label>
            <input
              v-model="newBill.remarks"
              type="text"
              class="w-full p-2 border rounded mt-1"
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              @click="saveBill"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {{ editBillMode ? "Update" : "Save" }}
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

      <!-- New Order Popup -->
      <div
        v-if="showAddOrderPopup"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center popup"
      >
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-[600px]">
          <h2 class="text-xl mb-4">New Order</h2>
          <div class="form-group">
            <label>Biller</label>
            <select
              v-model="newOrder.biller"
              class="w-full p-2 border rounded mt-1"
              required
            >
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
            <label>Order Placed On</label>
            <input
              v-model="newOrder.order_placed_on"
              type="date"
              class="w-full p-2 border rounded mt-1 date-input"
              placeholder="Order Placed On"
              required
            />
          </div>
          <div class="form-group">
            <label>Order Items</label>
            <input
              v-model="newOrder.order_items"
              type="text"
              class="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div class="form-group">
            <label>Transport</label>
            <input
              v-model="newOrder.transport"
              type="text"
              class="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div class="form-group">
            <label>Drive Link</label>
            <input
              v-model="newOrder.drive_link"
              type="text"
              class="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              @click="saveOrder"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              @click="cancelAddOrder"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Mark as Paid Confirmation Popup -->
      <div
        v-if="showMarkAsPaidPopup"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center popup"
      >
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-[600px]">
          <h2 class="text-xl mb-4">What is your name?</h2>
          <input
            v-model="markAsPaidName"
            type="text"
            placeholder="Enter 'sahil', 'aparna', or 'slnp'"
            class="w-full p-2 mb-4 border rounded"
          />
          <div class="flex justify-end space-x-4">
            <button
              @click="confirmMarkAsPaid"
              class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm
            </button>
            <button
              @click="cancelMarkAsPaid"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Show Bank Details Popup -->
      <div
        v-if="showBankDetailsPopup && selectedBill && selectedBiller"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center popup"
      >
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-[600px]">
          <h2 class="text-xl mb-4">
            Bank Details for {{ selectedBill.biller }}
          </h2>
          <div class="bank-details">
            <table class="bank-details-table">
              <tbody>
                <tr>
                  <td class="label">Bank Name</td>
                  <td class="value">{{ selectedBiller.bankName }}</td>
                  <td class="copy">
                    <button
                      @click="copyToClipboard(selectedBiller.bankName)"
                      class="copy-button bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded flex items-center"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Copy
                    </button>
                  </td>
                </tr>
                <tr>
                  <td class="label">Account No</td>
                  <td class="value">{{ selectedBiller.accountNo }}</td>
                  <td class="copy">
                    <button
                      @click="copyToClipboard(selectedBiller.accountNo)"
                      class="copy-button bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded flex items-center"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Copy
                    </button>
                  </td>
                </tr>
                <tr>
                  <td class="label">IFSC</td>
                  <td class="value">{{ selectedBiller.ifsc }}</td>
                  <td class="copy">
                    <button
                      @click="copyToClipboard(selectedBiller.ifsc)"
                      class="copy-button bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded flex items-center"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Copy
                    </button>
                  </td>
                </tr>
                <tr>
                  <td class="label">Branch</td>
                  <td class="value">{{ selectedBiller.branch }}</td>
                  <td class="copy">
                    <button
                      @click="copyToClipboard(selectedBiller.branch)"
                      class="copy-button bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded flex items-center"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Copy
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end mt-4">
            <button
              @click="cancelBankDetails"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Biller Popup -->
      <div
        v-if="showAddBillerPopup"
        class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center popup"
      >
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-[600px]">
          <h2 class="text-xl mb-4">
            {{ editBillerMode ? "Edit Biller" : "Add Biller" }}
          </h2>
          <div class="form-group">
            <label>Name</label>
            <input
              v-model="newBiller.name"
              type="text"
              class="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div class="form-group">
            <label>Credit Duration</label>
            <input
              v-model.number="newBiller.creditDuration"
              type="number"
              class="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div class="form-group">
            <label>Account Number</label>
            <input
              v-model="newBiller.accountNo"
              type="password"
              class="w-full p-2 border rounded mt-1 account-no-input"
              required
              @paste.prevent
            />
          </div>
          <div class="form-group">
            <label>Reenter Account Number</label>
            <input
              v-model="newBiller.reenterAccountNo"
              type="text"
              class="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div class="form-group">
            <label>IFSC Code</label>
            <input
              v-model="newBiller.ifsc"
              type="text"
              class="w-full p-2 border rounded mt-1"
              required
              @input="fetchBankAndBranch"
              v-on:keyup="newBiller.ifsc = newBiller.ifsc.toUpperCase()"
            />
          </div>
          <div class="form-group">
            <label>Bank Name</label>
            <input
              v-model="newBiller.bankName"
              type="text"
              class="w-full p-2 border rounded mt-1"
              required
              readonly
            />
          </div>
          <div class="form-group">
            <label>Branch</label>
            <input
              v-model="newBiller.branch"
              type="text"
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
              {{ editBillerMode ? "Update" : "Save" }}
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const bills = ref([]);
    const billers = ref([]);
    const orders = ref([]);
    const showAddBillPopup = ref(false);
    const showMarkAsPaidPopup = ref(false);
    const showAddBillerPopup = ref(false);
    const showBankDetailsPopup = ref(false);
    const showAddOrderPopup = ref(false);
    const currentView = ref("smartDue");
    const newBill = ref({
      biller: "",
      billing_date: "",
      amount: null,
      due_date: "",
      status: "pending",
      remarks: "",
    });
    const newOrder = ref({
      biller: "",
      order_placed_on: "",
      order_items: "",
      transport: "",
      drive_link: "",
    });
    const dateFilterStart = ref("");
    const dateFilterEnd = ref("");
    const newBiller = ref({
      name: "",
      creditDuration: null,
      bankName: "",
      accountNo: "",
      reenterAccountNo: "",
      ifsc: "",
      branch: "",
    });
    const markAsPaidName = ref("");
    const selectedBill = ref(null);
    const selectedBiller = ref(null);
    const editBillMode = ref(false);
    const editBillerMode = ref(false);
    const today = new Date().toLocaleDateString("en-GB").split("/").join("/");

    const webAppUrl =
      "https://script.google.com/macros/s/AKfycbz8fDlS4UWb4xpcfb01T9L3q8t91xKdFC6-ttdklOyVYXmLBhrB0eP4iD5fjJgQLrzb/exec";

    const syncWithGoogleSheets = async () => {
      try {
        const billResponse = await fetch(
          "https://opensheet.elk.sh/15McAhzua0NK0vGVObPDp4Npc5SV27v15Ec7gY0LG34I/Billdata"
        );
        const billerResponse = await fetch(
          "https://opensheet.elk.sh/15McAhzua0NK0vGVObPDp4Npc5SV27v15Ec7gY0LG34I/Billerdata"
        );
        const orderResponse = await fetch(
          "https://opensheet.elk.sh/15McAhzua0NK0vGVObPDp4Npc5SV27v15Ec7gY0LG34I/OrderDetails"
        );
        if (billResponse.ok && billerResponse.ok && orderResponse.ok) {
          bills.value = await billResponse.json();
          billers.value = await billerResponse.json();
          orders.value = await orderResponse.json();
          console.log("Fetched orders:", orders.value); // Debug log
          localStorage.setItem("billData", JSON.stringify(bills.value));
          localStorage.setItem("billerData", JSON.stringify(billers.value));
          localStorage.setItem("orderData", JSON.stringify(orders.value));
        } else {
          console.error("Fetch failed:", {
            billStatus: billResponse.status,
            billerStatus: billerResponse.status,
            orderStatus: orderResponse.status,
          });
        }
      } catch (error) {
        console.error("Sync error:", error);
      }
    };

    const saveToGoogleSheets = async (data) => {
      try {
        const response = await fetch(webAppUrl, {
          method: "POST",
          redirect: "follow",
          body: JSON.stringify({
            ...data,
            secret: "mySuperSecret123",
            action: data.action || "add",
          }),
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.text();
        console.log("Save response:", result);
        const jsonResult = result ? JSON.parse(result) : { success: true };
        if (jsonResult.success) {
          await syncWithGoogleSheets();
        } else {
          console.error("Save failed:", jsonResult.error);
        }
      } catch (error) {
        console.error("Save error:", error);
      }
    };

    onMounted(() => {
      bills.value = JSON.parse(localStorage.getItem("billData") || "[]");
      billers.value = JSON.parse(localStorage.getItem("billerData") || "[]");
      orders.value = JSON.parse(localStorage.getItem("orderData") || "[]");
      console.log("Initial orders from localStorage:", orders.value); // Debug log
      syncWithGoogleSheets();
    });

    const filteredBills = computed(() => {
      return bills.value.filter((bill) => {
        const billDate = new Date(bill.due_date.split("/").reverse().join("-"));
        const startDate = dateFilterStart.value
          ? new Date(dateFilterStart.value.split("/").reverse().join("-"))
          : null;
        const endDate = dateFilterEnd.value
          ? new Date(dateFilterEnd.value.split("/").reverse().join("-"))
          : null;

        if (startDate && endDate)
          return billDate >= startDate && billDate <= endDate;
        if (startDate) return billDate >= startDate;
        if (endDate) return billDate <= endDate;
        return true;
      });
    });

    const isBillerValid = computed(() => {
      return (
        newBiller.value.name &&
        newBiller.value.creditDuration &&
        newBiller.value.bankName &&
        newBiller.value.accountNo &&
        newBiller.value.reenterAccountNo &&
        newBiller.value.ifsc &&
        newBiller.value.branch &&
        newBiller.value.accountNo === newBiller.value.reenterAccountNo
      );
    });

    const isOrderValid = computed(() => {
      return (
        newOrder.value.biller &&
        newOrder.value.order_placed_on &&
        newOrder.value.order_items &&
        newOrder.value.transport &&
        newOrder.value.drive_link
      );
    });

    const setView = (view) => {
      currentView.value = view;
      if (view !== "smartDue") {
        dateFilterStart.value = "";
        dateFilterEnd.value = "";
      }
    };

    const getDueInDays = (bill) => {
      const billDate = new Date(bill.due_date.split("/").reverse().join("-"));
      const todayDate = new Date(today.split("/").reverse().join("-"));
      const diffTime = billDate - todayDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const getStatus = (bill) => {
      const dueInDays = getDueInDays(bill);
      if (dueInDays < 0) return "Overdue";
      if (dueInDays === 0) return "Due";
      return bill.status === "paid" ? "Paid" : "No Due";
    };

    const formatIndianCurrency = (amount) => {
      if (amount === null || amount === undefined) return "₹0.00";
      const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      });
      return formatter.format(amount);
    };

    const formatIndianDate = (dateStr) => {
      if (!dateStr) return "";
      const [day, month, year] = dateStr.split("/");
      return `${day}/${month}/${year}`;
    };

    const convertToIndianDate = (dateStr) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    };

    const openAddBillPopup = () => {
      newBill.value = {
        biller: billers.value.length ? billers.value[0].name : "",
        billing_date: today,
        amount: null,
        due_date: today,
        status: "pending",
        remarks: "",
      };
      editBillMode.value = false;
      showAddBillPopup.value = true;
    };

    const openEditBillPopup = (bill) => {
      newBill.value = {
        ...bill,
        billing_date: bill.billing_date.includes("-")
          ? convertToIndianDate(bill.billing_date)
          : bill.billing_date,
        due_date: bill.due_date.includes("-")
          ? convertToIndianDate(bill.due_date)
          : bill.due_date,
      };
      editBillMode.value = true;
      showAddBillPopup.value = true;
    };

    const openAddOrderPopup = () => {
      newOrder.value = {
        biller: billers.value.length ? billers.value[0].name : "",
        order_placed_on: today,
        order_items: "",
        transport: "",
        drive_link: "",
      };
      showAddOrderPopup.value = true;
    };

    const openEditBillerPopup = (biller) => {
      newBiller.value = { ...biller };
      editBillerMode.value = true;
      showAddBillerPopup.value = true;
    };

    const openMarkAsPaidPopup = (bill) => {
      selectedBill.value = bill;
      markAsPaidName.value = "";
      showMarkAsPaidPopup.value = true;
    };

    const openBankDetailsPopup = (bill) => {
      selectedBill.value = bill;
      const biller = billers.value.find((b) => b.name === bill.biller);
      selectedBiller.value = biller || null;
      showBankDetailsPopup.value = !!biller;
    };

    const copyToClipboard = (text) => {
      navigator.clipboard.write(text).then(
        () => alert("Copied to clipboard!"),
        (err) => alert("Failed to copy: " + err)
      );
    };

    const saveBill = async () => {
      if (!newBill.value.billing_date || !newBill.value.due_date) {
        alert("Please enter both billing date and due date.");
        return;
      }
      const billData = {
        ...newBill.value,
        billing_date: formatIndianDate(newBill.value.billing_date),
        due_date: formatIndianDate(newBill.value.due_date),
        action: editBillMode.value ? "editBill" : "addBill",
      };
      await saveToGoogleSheets(billData);
      showAddBillPopup.value = false;
    };

    const saveOrder = async () => {
      if (!isOrderValid.value) {
        alert("Please fill all required fields.");
        return;
      }
      const orderData = {
        ...newOrder.value,
        order_placed_on: formatIndianDate(newOrder.value.order_placed_on),
        action: "addOrder",
      };
      await saveToGoogleSheets(orderData);
      showAddOrderPopup.value = false;
    };

    const confirmMarkAsPaid = async () => {
      if (
        ["sahil", "aparna", "slnp"].includes(markAsPaidName.value.toLowerCase())
      ) {
        await saveToGoogleSheets({
          ...selectedBill.value,
          status: "paid",
          action: "markAsPaid",
        });
        showMarkAsPaidPopup.value = false;
      } else {
        alert("Incorrect name. Please enter 'sahil', 'aparna', or 'slnp'.");
      }
    };

    const cancelAddBill = () => (showAddBillPopup.value = false);
    const cancelAddOrder = () => (showAddOrderPopup.value = false);
    const cancelMarkAsPaid = () => (showMarkAsPaidPopup.value = false);
    const cancelAddBiller = () => (showAddBillerPopup.value = false);
    const cancelBankDetails = () => {
      showBankDetailsPopup.value = false;
      selectedBill.value = null;
      selectedBiller.value = null;
    };

    const openAddBillerPopup = () => {
      newBiller.value = {
        name: "",
        creditDuration: null,
        bankName: "",
        accountNo: "",
        reenterAccountNo: "",
        ifsc: "",
        branch: "",
      };
      editBillerMode.value = false;
      showAddBillerPopup.value = true;
    };

    const saveBiller = async () => {
      if (!isBillerValid.value) {
        alert("Account numbers do not match or required fields are missing.");
        return;
      }
      await saveToGoogleSheets({ ...newBiller.value, action: "addBiller" });
      showAddBillerPopup.value = false;
    };

    const fetchBankAndBranch = async () => {
      const ifsc = newBiller.value.ifsc.toUpperCase();
      if (ifsc.length === 11) {
        try {
          const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
          if (response.ok) {
            const data = await response.json();
            newBiller.value.bankName = data.BANK || "Bank not found";
            newBiller.value.branch = data.BRANCH || "Branch not found";
          } else {
            newBiller.value.bankName = "Invalid IFSC or Bank not found";
            newBiller.value.branch = "Invalid IFSC or Branch not found";
          }
        } catch (error) {
          console.error("Error fetching bank and branch:", error);
          newBiller.value.bankName = "Error fetching bank";
          newBiller.value.branch = "Error fetching branch";
        }
      }
    };

    return {
      bills,
      billers,
      orders,
      showAddBillPopup,
      showMarkAsPaidPopup,
      showAddBillerPopup,
      showBankDetailsPopup,
      showAddOrderPopup,
      currentView,
      newBill,
      newOrder,
      newBiller,
      markAsPaidName,
      selectedBill,
      selectedBiller,
      editBillMode,
      editBillerMode,
      today,
      filteredBills,
      isBillerValid,
      isOrderValid,
      setView,
      getDueInDays,
      getStatus,
      formatIndianCurrency,
      formatIndianDate,
      openAddBillPopup,
      openEditBillPopup,
      openAddOrderPopup,
      openEditBillerPopup,
      openMarkAsPaidPopup,
      openBankDetailsPopup,
      copyToClipboard,
      saveBill,
      saveOrder,
      confirmMarkAsPaid,
      cancelAddBill,
      cancelAddOrder,
      cancelMarkAsPaid,
      cancelAddBiller,
      cancelBankDetails,
      openAddBillerPopup,
      saveBiller,
      dateFilterStart,
      dateFilterEnd,
      fetchBankAndBranch,
    };
  },
};
</script>

<style scoped>
@import "./styles.css";
.form-group {
  margin-bottom: 1rem;
}
.account-no-input {
  -webkit-text-security: disc;
}
</style>
