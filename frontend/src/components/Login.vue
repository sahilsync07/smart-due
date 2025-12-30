<template>
  <div class="login-overlay">
    <div class="login-card">
      <div class="logo-section">
        <div class="logo-large">{{ initials }}</div>
        <h1>Welcome Back</h1>
        <p class="company-name">{{ companyName }}</p>
      </div>

      <div class="login-actions">
        <button class="btn-google" @click="$emit('login')" :disabled="isLoading">
          <div class="google-icon-wrapper">
            <svg class="google-icon" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.98 24.46c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>
          <span class="btn-text">Sign in with Google</span>
        </button>
      </div>

      <div class="divider">
            <span>or switch workspace</span>
      </div>

     <div class="company-select-wrapper">
         <select :value="companyName" @change="$emit('switch-company', $event.target.value)" class="company-select">
            <option v-for="c in companies" :key="c" :value="c">{{ c }}</option>
         </select>
     </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    companyName: String,
    initials: String,
    companies: Array,
    isLoading: Boolean
  }
};
</script>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--bg-app);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.login-card {
  background: var(--bg-surface);
  padding: 3rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid var(--border);
}

.logo-large {
  width: 80px;
  height: 80px;
  background-color: var(--primary);
  color: white;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(var(--primary), 0.3);
}

.logo-section h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.company-name {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-weight: 500;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #3c4043;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #dadce0;
  padding: 0;
  cursor: pointer;
  height: 48px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  transition: background-color .2s, box-shadow .2s;
}

.btn-google:hover {
  background-color: #f7f8f8;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-color: #d2e3fc;
}

.google-icon-wrapper {
    width: 46px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-text {
    flex-grow: 1;
    text-align: center;
    font-weight: 500;
    padding-right: 46px; /* Offset icon width to center text */
}

.divider {
    margin: 2rem 0 1rem;
    position: relative;
    text-align: center;
}
.divider::before {
    content: '';
    position: absolute;
    left: 0; top: 50%;
    width: 100%;
    height: 1px;
    background: var(--border);
    z-index: 0;
}
.divider span {
    background: var(--bg-surface);
    position: relative;
    z-index: 1;
    padding: 0 10px;
    font-size: 0.8rem;
    color: var(--text-muted);
}

.company-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-subtle);
    color: var(--text-secondary);
    font-size: 0.9rem;
    cursor: pointer;
}
.company-select:hover {
    border-color: var(--primary);
}
</style>
