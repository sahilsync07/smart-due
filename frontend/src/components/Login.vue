<template>
  <div class="login-overlay">
    <div class="login-card">
      <div class="logo-section">
        <div class="logo-large">{{ initials }}</div>
        <h1>Welcome Back</h1>
        <p class="company-name">{{ companyName }}</p>
      </div>

      <div class="login-actions">
        <form @submit.prevent="handleSubmit">
            <div v-if="!isLoginMode" class="form-group">
                <input type="text" v-model="fullName" placeholder="Full Name" class="form-control" required />
            </div>
            
            <div class="form-group">
                <input type="email" v-model="email" placeholder="Email Address" class="form-control" required />
            </div>
            
            <div class="form-group">
                <input type="password" v-model="password" placeholder="Password" class="form-control" required />
            </div>

            <div v-if="!isLoginMode" class="form-group">
                <input type="password" v-model="confirmPassword" placeholder="Confirm Password" class="form-control" required />
                <small v-if="passwordMismatch" class="text-danger">Passwords do not match</small>
            </div>

            <div v-if="error" class="error-msg">{{ error }}</div>

            <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
                <span v-if="isLoading">Processing...</span>
                <span v-else>{{ isLoginMode ? 'Sign In' : 'Create Account' }}</span>
            </button>
        </form>

        <div class="switch-mode mt-4">
            <span>{{ isLoginMode ? "New user?" : "Already have an account?" }}</span>
            <button class="btn-text link-btn" @click="toggleMode">
                {{ isLoginMode ? "Create an account" : "Sign In" }}
            </button>
        </div>
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
  },
  data() {
    return {
        isLoginMode: true,
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        error: ""
    }
  },
  computed: {
    passwordMismatch() {
        return !this.isLoginMode && this.password && this.confirmPassword && this.password !== this.confirmPassword;
    }
  },
  methods: {
    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        this.error = "";
        this.password = "";
        this.confirmPassword = "";
    },
    handleSubmit() {
        this.error = "";
        
        if (!this.isLoginMode && this.passwordMismatch) {
            this.error = "Passwords do not match";
            return;
        }

        if (this.isLoginMode) {
            this.$emit('login-manual', { email: this.email, password: this.password });
        } else {
            this.$emit('signup-manual', { 
                email: this.email, 
                password: this.password,
                full_name: this.fullName
            });
        }
    }
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
.switch-mode {
    font-size: 0.9rem;
    color: var(--text-secondary);
}
.link-btn {
    color: var(--primary);
    font-weight: 600;
    margin-left: 0.5rem;
    padding: 0;
}
.error-msg {
    color: var(--danger);
    font-size: 0.875rem;
    margin-bottom: 1rem;
    background: var(--danger-bg);
    padding: 0.5rem;
    border-radius: var(--radius-sm);
}
.text-danger { color: var(--danger); font-size: 0.8rem; }
.mt-4 { margin-top: 1rem; }
</style>
