<template>
  <div class="tab-panel">
    <div class="pdf-container" style="max-width: 600px; margin: 0 auto;">
      <div v-if="isLoading" class="saving-overlay">
        <div class="loader"></div>
        Generating PDF...
      </div>
      
      <div class="card mb-4">
          <div class="card-header">
              <h3>Generator Options</h3>
          </div>
          <div class="card-body">
             <div class="form-group">
                <label>Select Brands</label>
                <select multiple v-model="selectedBrands" class="form-control" style="height: 200px;">
                <option v-for="brand in brands" :key="brand" :value="brand">
                    {{ brand }}
                </option>
                </select>
                <small class="text-muted">Hold Ctrl/Cmd to select multiple</small>
             </div>

             <div class="form-group">
                 <label class="custom-checkbox flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="onlyWithPhotos" style="width: 1.2em; height: 1.2em; accent-color: var(--primary);" />
                    <span>Only include products with photos</span>
                 </label>
             </div>

             <div class="form-group">
                 <label class="custom-checkbox flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="minQtyEnabled" style="width: 1.2em; height: 1.2em; accent-color: var(--primary);" />
                    <span>Filter by Minimum Quantity</span>
                 </label>
                 
                 <div v-if="minQtyEnabled" class="flex items-center mt-2 gap-2 pl-6">
                    <input type="number" v-model="minQty" class="form-control" style="width: 100px;" min="0" />
                    <span class="text-sm">units minimum</span>
                 </div>
             </div>
             
             <button
                @click="$emit('generate-pdf')"
                class="btn btn-primary w-full mt-4"
                :disabled="isLoading"
            >
                <span v-if="!isLoading">📄 Generate PDF Catalog</span>
                <span v-else>Processing...</span>
            </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    brands: Array,
    isLoading: Boolean,
  },
  data() {
    return {
      selectedBrands: [],
      onlyWithPhotos: true,
      minQtyEnabled: false,
      minQty: 6,
    };
  },
  methods: {
    getPayload() {
      return {
        brands: this.selectedBrands,
        onlyWithPhotos: this.onlyWithPhotos,
        minQty: this.minQtyEnabled ? this.minQty : -1,
      };
    },
  },
};
</script>

<style scoped>
/* Most styles are handled by global css now */
.saving-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 100;
}
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 40px; height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.pl-6 { padding-left: 1.5rem; }
.cursor-pointer { cursor: pointer; }
</style>
