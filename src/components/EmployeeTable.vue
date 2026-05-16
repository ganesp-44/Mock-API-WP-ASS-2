<template>
  <div>
    <!-- Empty State -->
    <div v-if="employees.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-people display-1 opacity-25"></i>
      <p class="mt-3 fs-5">No employees found.</p>
      <p class="small">Add your first employee using the button above.</p>
    </div>

    <!-- Table -->
    <div v-else class="table-responsive rounded-3 shadow-sm">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr class="table-dark">
            <th class="ps-4 py-3">#ID</th>
            <th class="py-3">Name</th>
            <th class="py-3">Designation</th>
            <th class="py-3">Department</th>
            <th class="py-3">Salary</th>
            <th class="pe-4 py-3 text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in employees" :key="emp.id" class="border-bottom">
            <!-- ID badge -->
            <td class="ps-4">
              <span class="badge bg-secondary rounded-pill">{{ emp.id }}</span>
            </td>

            <!-- Name -->
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="avatar-circle" :style="{ background: getAvatarColor(emp.name) }">
                  {{ getInitials(emp.name) }}
                </div>
                <span class="fw-semibold">{{ emp.name }}</span>
              </div>
            </td>

            <!-- Designation -->
            <td class="text-muted">{{ emp.designation }}</td>

            <!-- Department badge -->
            <td>
              <span class="badge rounded-pill" :class="getDeptBadge(emp.department)">
                {{ emp.department }}
              </span>
            </td>

            <!-- Salary -->
            <td class="fw-semibold text-success">
              ₹{{ formatSalary(emp.salary) }}
            </td>

            <!-- Action buttons -->
            <td class="pe-4 text-end">
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="$emit('edit', emp)"
                title="Edit Employee"
              >
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="$emit('delete', emp.id)"
                title="Delete Employee"
              >
                <i class="bi bi-trash3-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer count -->
    <div v-if="employees.length > 0" class="text-muted small mt-3 ps-1">
      Showing <strong>{{ employees.length }}</strong> employee{{ employees.length !== 1 ? 's' : '' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeTable',
  props: {
    employees: { type: Array, required: true }
  },
  emits: ['edit', 'delete'],
  methods: {
    getInitials(name) {
      return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
    },
    getAvatarColor(name) {
      const colors = ['#4361ee','#3a0ca3','#7209b7','#f72585','#4cc9f0','#06d6a0','#fb8500','#e63946']
      let hash = 0
      for (let c of (name || '')) hash = c.charCodeAt(0) + ((hash << 5) - hash)
      return colors[Math.abs(hash) % colors.length]
    },
    getDeptBadge(dept) {
      const map = {
        'Engineering': 'bg-primary',
        'Human Resources': 'bg-success',
        'Finance': 'bg-warning text-dark',
        'Marketing': 'bg-danger',
        'Operations': 'bg-info text-dark',
        'Sales': 'bg-secondary',
        'IT Support': 'bg-dark'
      }
      return map[dept] || 'bg-secondary'
    },
    formatSalary(salary) {
      return Number(salary).toLocaleString('en-IN')
    }
  }
}
</script>

<style scoped>
.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}
thead th { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; }
tbody tr { transition: background 0.15s; }
</style>
