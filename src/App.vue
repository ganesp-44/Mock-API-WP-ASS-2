<template>
  <div class="app-wrapper">

    <!-- ===== NAVBAR ===== -->
    <nav class="navbar navbar-dark px-4 py-3 shadow-sm">
      <div class="container-xl">
        <span class="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2">
          <i class="bi bi-building-fill-gear text-warning"></i>
          EMS &nbsp;<span class="badge bg-warning text-dark small fw-normal">Vue + MockAPI</span>
        </span>
        <div class="d-flex align-items-center gap-3">
          <span class="text-white-50 small d-none d-md-inline">
            <i class="bi bi-people-fill me-1"></i>{{ employees.length }} Employees
          </span>
          <button
            class="btn btn-warning fw-semibold px-3"
            data-bs-toggle="modal"
            data-bs-target="#employeeModal"
            @click="openAddModal"
          >
            <i class="bi bi-plus-lg me-1"></i> Add Employee
          </button>
        </div>
      </div>
    </nav>

    <!-- ===== HERO STATS ===== -->
    <div class="stats-bar py-3">
      <div class="container-xl">
        <div class="row g-3">
          <div class="col-6 col-md-3" v-for="stat in stats" :key="stat.label">
            <div class="stat-card p-3 rounded-3 text-center">
              <div class="stat-icon mb-1" :class="stat.color">
                <i :class="stat.icon"></i>
              </div>
              <div class="stat-value fw-bold">{{ stat.value }}</div>
              <div class="stat-label text-muted small">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <main class="container-xl py-4">

      <!-- Toast notifications -->
      <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:9999">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast show align-items-center border-0"
          :class="`text-bg-${toast.type}`"
          role="alert"
        >
          <div class="d-flex">
            <div class="toast-body">
              <i :class="toast.icon + ' me-2'"></i>{{ toast.message }}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="removeToast(toast.id)"></button>
          </div>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body py-3">
          <div class="row g-3 align-items-center">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control border-start-0 ps-0"
                  placeholder="Search by name, designation..."
                />
              </div>
            </div>
            <div class="col-md-3">
              <select v-model="filterDept" class="form-select">
                <option value="">All Departments</option>
                <option>Engineering</option>
                <option>Human Resources</option>
                <option>Finance</option>
                <option>Marketing</option>
                <option>Operations</option>
                <option>Sales</option>
                <option>IT Support</option>
              </select>
            </div>
            <div class="col-md-3 text-md-end">
              <button class="btn btn-outline-secondary btn-sm" @click="fetchEmployees" :disabled="loading">
                <i class="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem"></div>
        <p class="text-muted">Loading employees...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger d-flex align-items-center gap-3">
        <i class="bi bi-exclamation-octagon-fill fs-4"></i>
        <div>
          <strong>Failed to load data.</strong><br>
          <span class="small">{{ error }}</span><br>
          <button class="btn btn-sm btn-danger mt-2" @click="fetchEmployees">Retry</button>
        </div>
      </div>

      <!-- Employee Table -->
      <div v-else class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 pt-3 px-4 pb-0">
          <h6 class="fw-bold text-uppercase text-muted letter-spacing mb-0">
            <i class="bi bi-table me-2"></i>Employee Records
          </h6>
        </div>
        <div class="card-body pt-3 px-3 px-md-4">
          <EmployeeTable
            :employees="filteredEmployees"
            @edit="openEditModal"
            @delete="confirmDelete"
          />
        </div>
      </div>

    </main>

    <!-- ===== MODAL FORM ===== -->
    <EmployeeForm
      ref="employeeForm"
      :editData="selectedEmployee"
      @submit-form="handleFormSubmit"
    />

    <!-- ===== DELETE CONFIRM MODAL ===== -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow">
          <div class="modal-body text-center py-4 px-4">
            <div class="mb-3">
              <i class="bi bi-trash3-fill text-danger" style="font-size:2.5rem"></i>
            </div>
            <h5 class="fw-bold">Delete Employee?</h5>
            <p class="text-muted small mb-4">This action cannot be undone.</p>
            <div class="d-flex gap-2 justify-content-center">
              <button class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
              <button class="btn btn-danger px-4 fw-semibold" @click="deleteEmployee" :disabled="deleting">
                <span v-if="deleting" class="spinner-border spinner-border-sm me-1"></span>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import EmployeeForm from './components/EmployeeForm.vue'
import EmployeeTable from './components/EmployeeTable.vue'
import { employeeService } from './services/employeeService.js'

export default {
  name: 'App',
  components: { EmployeeForm, EmployeeTable },

  data() {
    return {
      employees: [],       // All employees from API
      selectedEmployee: null,  // Employee being edited
      deleteTargetId: null,    // ID of employee to delete
      loading: false,
      deleting: false,
      error: null,
      searchQuery: '',
      filterDept: '',
      toasts: [],
      toastCounter: 0
    }
  },

  computed: {
    // Filter employees by search query and department
    filteredEmployees() {
      return this.employees.filter(emp => {
        const q = this.searchQuery.toLowerCase()
        const matchesSearch = !q ||
          emp.name?.toLowerCase().includes(q) ||
          emp.designation?.toLowerCase().includes(q)
        const matchesDept = !this.filterDept || emp.department === this.filterDept
        return matchesSearch && matchesDept
      })
    },

    // Stats computed from employees array
    stats() {
      const totalSalary = this.employees.reduce((s, e) => s + Number(e.salary || 0), 0)
      const depts = new Set(this.employees.map(e => e.department)).size
      const avgSalary = this.employees.length ? Math.round(totalSalary / this.employees.length) : 0
      return [
        { label: 'Total Employees', value: this.employees.length, icon: 'bi bi-people-fill fs-4', color: 'text-primary' },
        { label: 'Departments', value: depts, icon: 'bi bi-building-fill fs-4', color: 'text-info' },
        { label: 'Avg. Salary', value: '₹' + avgSalary.toLocaleString('en-IN'), icon: 'bi bi-cash-coin fs-4', color: 'text-success' },
        { label: 'Total Payroll', value: '₹' + totalSalary.toLocaleString('en-IN'), icon: 'bi bi-wallet2 fs-4', color: 'text-warning' }
      ]
    }
  },

  mounted() {
    this.fetchEmployees()
  },

  methods: {
    // ── READ ──────────────────────────────────────────────
    async fetchEmployees() {
      this.loading = true
      this.error = null
      try {
        const res = await employeeService.getAll()
        this.employees = res.data
      } catch (err) {
        this.error = err.message || 'Could not fetch employees. Check your MockAPI URL.'
      } finally {
        this.loading = false
      }
    },

    // ── CREATE / UPDATE ────────────────────────────────────
    async handleFormSubmit(formData, isEditing) {
      try {
        if (isEditing) {
          // UPDATE
          await employeeService.update(formData.id, formData)
          const idx = this.employees.findIndex(e => e.id === formData.id)
          if (idx !== -1) this.employees[idx] = { ...formData }
          this.showToast('success', 'bi bi-check-circle-fill', 'Employee updated successfully!')
        } else {
          // CREATE
          const res = await employeeService.create(formData)
          this.employees.push(res.data)
          this.showToast('success', 'bi bi-person-plus-fill', 'Employee added successfully!')
        }
        this.closeModal('employeeModal')
        this.selectedEmployee = null
      } catch (err) {
        this.showToast('danger', 'bi bi-x-circle-fill', 'Operation failed: ' + err.message)
      } finally {
        this.$refs.employeeForm?.stopLoading()
      }
    },

    // ── DELETE ─────────────────────────────────────────────
    confirmDelete(id) {
      this.deleteTargetId = id
      this.openModal('deleteModal')
    },

    async deleteEmployee() {
      this.deleting = true
      try {
        await employeeService.delete(this.deleteTargetId)
        this.employees = this.employees.filter(e => e.id !== this.deleteTargetId)
        this.showToast('warning', 'bi bi-trash3-fill', 'Employee deleted.')
        this.closeModal('deleteModal')
      } catch (err) {
        this.showToast('danger', 'bi bi-x-circle-fill', 'Delete failed: ' + err.message)
      } finally {
        this.deleting = false
        this.deleteTargetId = null
      }
    },

    // ── MODAL HELPERS ──────────────────────────────────────
    openAddModal() {
      this.selectedEmployee = null
      this.$refs.employeeForm?.resetForm()
    },

    openEditModal(employee) {
      this.selectedEmployee = { ...employee }
      this.openModal('employeeModal')
    },

    openModal(id) {
      const el = document.getElementById(id)
      if (el) Modal.getOrCreateInstance(el).show()
    },

    closeModal(id) {
      const el = document.getElementById(id)
      if (el) Modal.getOrCreateInstance(el).hide()
    },

    // ── TOAST NOTIFICATIONS ────────────────────────────────
    showToast(type, icon, message) {
      const id = ++this.toastCounter
      this.toasts.push({ id, type, icon, message })
      setTimeout(() => this.removeToast(id), 3500)
    },

    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    }
  }
}
</script>

<style>
/* ── Global Reset & Fonts ── */
*, *::before, *::after { box-sizing: border-box; }

body {
  font-family: 'DM Sans', sans-serif;
  background: #f0f2f5;
  color: #1a1a2e;
}

h1, h2, h3, h4, h5, h6, .navbar-brand {
  font-family: 'Syne', sans-serif;
}

/* ── App wrapper ── */
.app-wrapper { min-height: 100vh; }

/* ── Navbar ── */
.navbar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

/* ── Stats bar ── */
.stats-bar {
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.stat-card {
  background: #f8f9fc;
  border: 1px solid #eaeef5;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.stat-value { font-family: 'Syne', sans-serif; font-size: 1.15rem; }

/* ── Cards ── */
.card { border-radius: 14px !important; }
.card-header { border-radius: 14px 14px 0 0 !important; }

/* ── Table ── */
.table th { background: #1a1a2e; color: #fff; }
.table > :not(caption) > * > * { padding: 0.85rem 0.75rem; }

/* ── Letter spacing utility ── */
.letter-spacing { letter-spacing: 0.06em; }

/* ── Toasts ── */
.toast { min-width: 260px; border-radius: 10px !important; }

/* ── Input group focus fix ── */
.input-group:focus-within .input-group-text {
  border-color: #86b7fe;
}
</style>
