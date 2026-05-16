<template>
  <div class="modal fade" id="employeeModal" tabindex="-1" aria-labelledby="employeeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">

        <!-- Modal Header -->
        <div class="modal-header border-0 pb-0" :class="isEditing ? 'bg-warning-subtle' : 'bg-primary-subtle'">
          <h5 class="modal-title fw-bold" id="employeeModalLabel">
            <i :class="isEditing ? 'bi bi-pencil-square me-2' : 'bi bi-person-plus-fill me-2'"></i>
            {{ isEditing ? 'Edit Employee' : 'Add New Employee' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" @click="resetForm"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body px-4 py-3">
          <!-- Validation alert -->
          <div v-if="formError" class="alert alert-danger py-2 small" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-1"></i>{{ formError }}
          </div>

          <!-- Name -->
          <div class="mb-3">
            <label class="form-label fw-semibold small text-muted text-uppercase letter-spacing">
              <i class="bi bi-person me-1"></i>Full Name
            </label>
            <input
              v-model="form.name"
              type="text"
              class="form-control form-control-lg"
              placeholder="e.g. Rahul Sharma"
              :class="{ 'is-invalid': errors.name }"
            />
            <div class="invalid-feedback">{{ errors.name }}</div>
          </div>

          <!-- Designation -->
          <div class="mb-3">
            <label class="form-label fw-semibold small text-muted text-uppercase letter-spacing">
              <i class="bi bi-briefcase me-1"></i>Designation
            </label>
            <input
              v-model="form.designation"
              type="text"
              class="form-control form-control-lg"
              placeholder="e.g. Software Engineer"
              :class="{ 'is-invalid': errors.designation }"
            />
            <div class="invalid-feedback">{{ errors.designation }}</div>
          </div>

          <!-- Department -->
          <div class="mb-3">
            <label class="form-label fw-semibold small text-muted text-uppercase letter-spacing">
              <i class="bi bi-building me-1"></i>Department
            </label>
            <select
              v-model="form.department"
              class="form-select form-select-lg"
              :class="{ 'is-invalid': errors.department }"
            >
              <option value="" disabled>Select Department</option>
              <option>Engineering</option>
              <option>Human Resources</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Operations</option>
              <option>Sales</option>
              <option>IT Support</option>
            </select>
            <div class="invalid-feedback">{{ errors.department }}</div>
          </div>

          <!-- Salary -->
          <div class="mb-2">
            <label class="form-label fw-semibold small text-muted text-uppercase letter-spacing">
              <i class="bi bi-currency-rupee me-1"></i>Salary (₹)
            </label>
            <input
              v-model.number="form.salary"
              type="number"
              class="form-control form-control-lg"
              placeholder="e.g. 750000"
              min="0"
              :class="{ 'is-invalid': errors.salary }"
            />
            <div class="invalid-feedback">{{ errors.salary }}</div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer border-0 pt-0 px-4 pb-4">
          <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal" @click="resetForm">
            Cancel
          </button>
          <button
            type="button"
            class="btn px-4 fw-semibold"
            :class="isEditing ? 'btn-warning' : 'btn-primary'"
            @click="submitForm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else :class="isEditing ? 'bi bi-check2-circle me-2' : 'bi bi-plus-circle me-2'"></i>
            {{ isEditing ? 'Update Employee' : 'Add Employee' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeForm',
  props: {
    editData: { type: Object, default: null }
  },
  emits: ['submit-form'],
  data() {
    return {
      form: { name: '', designation: '', department: '', salary: '' },
      errors: {},
      formError: '',
      loading: false
    }
  },
  computed: {
    isEditing() {
      return this.editData !== null
    }
  },
  watch: {
    // Populate form when edit data is passed in
    editData(newVal) {
      if (newVal) {
        this.form = { ...newVal }
        this.errors = {}
        this.formError = ''
      } else {
        this.resetForm()
      }
    }
  },
  methods: {
    validate() {
      this.errors = {}
      if (!this.form.name.trim()) this.errors.name = 'Name is required.'
      if (!this.form.designation.trim()) this.errors.designation = 'Designation is required.'
      if (!this.form.department) this.errors.department = 'Please select a department.'
      if (!this.form.salary || this.form.salary <= 0) this.errors.salary = 'Enter a valid salary.'
      return Object.keys(this.errors).length === 0
    },
    submitForm() {
      this.formError = ''
      if (!this.validate()) {
        this.formError = 'Please fix the errors below.'
        return
      }
      this.loading = true
      this.$emit('submit-form', { ...this.form }, this.isEditing)
    },
    resetForm() {
      this.form = { name: '', designation: '', department: '', salary: '' }
      this.errors = {}
      this.formError = ''
      this.loading = false
    },
    stopLoading() {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.letter-spacing { letter-spacing: 0.05em; }
.form-control-lg, .form-select-lg { border-radius: 10px; font-size: 0.95rem; }
.modal-content { border-radius: 16px; overflow: hidden; }
</style>
