<template>
  <div class="tab-panel">
    <div class="pdf-container">
      <div v-if="isLoading" class="saving-overlay">
        <div class="loader"></div>
        Generating PDF...
      </div>
      <h2 class="pdf-title">PDF Generator</h2>
      <div class="card">
        <label class="form-label">Select Brands</label>
        <select multiple v-model="selectedBrands" class="form-select">
          <option v-for="brand in brands" :key="brand" :value="brand">
            {{ brand }}
          </option>
        </select>
      </div>
      <div class="card">
        <label class="checkbox-label">
          <input type="checkbox" v-model="onlyWithPhotos" />
          Only include products with photos
        </label>
      </div>
      <div class="card">
        <label class="checkbox-label">
          <input type="checkbox" v-model="minQtyEnabled" />
          Only include articles with more than
        </label>
        <div class="flex items-center mt-2 gap-2">
          <input
            type="number"
            v-model="minQty"
            :disabled="!minQtyEnabled"
            class="form-input"
            min="0"
          />
          <span class="text-sm font-medium">quantity</span>
        </div>
      </div>
      <button
        @click="$emit('generate-pdf')"
        class="action-button w-full"
        :disabled="isLoading"
      >
        Generate PDF
      </button>
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
.pdf-container {
  max-width: 600px;
  margin: 0 auto;
}

.pdf-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-align: center;
  margin-bottom: 1.5rem;
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1rem;
  margin-bottom: 1rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-main);
  display: block;
  margin-bottom: 0.5rem;
}

.form-select {
  padding: 0.6rem 1rem;
  border: 1.2px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 1rem;
  background: var(--surface);
  color: var(--text-main);
  width: 100%;
  height: 200px;
  transition: border-color 0.13s, box-shadow 0.13s;
}

.form-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
  outline: none;
}

.form-input {
  padding: 0.6rem 1rem;
  border: 1.2px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 1rem;
  background: var(--surface);
  color: var(--text-main);
  width: 100px;
  transition: border-color 0.13s, box-shadow 0.13s;
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
  outline: none;
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

.action-button {
  flex: 1;
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

.saving-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 100;
  border-radius: calc(var(--radius) + 4px);
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .pdf-container {
    max-width: 100%;
  }

  .form-select {
    height: 150px;
  }

  .form-input {
    width: 80px;
  }
}
</style>
