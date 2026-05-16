import axios from 'axios'

// ⚠️ IMPORTANT: Replace this URL with your own MockAPI endpoint
// Steps to get your MockAPI URL:
// 1. Go to https://mockapi.io and create a free account
// 2. Create a new project
// 3. Add a resource called "employees" with fields:
//    - name (String), designation (String), department (String), salary (Number)
// 4. Copy the endpoint URL and paste it below
const BASE_URL = 'https://69f8d301f7044aa0103e887f.mockapi.io/employee'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const employeeService = {
  // READ - Get all employees
  getAll() {
    return api.get('/')
  },

  // READ - Get single employee by ID
  getById(id) {
    return api.get(`/${id}`)
  },

  // CREATE - Add new employee
  create(employeeData) {
    return api.post('/', employeeData)
  },

  // UPDATE - Edit existing employee
  update(id, employeeData) {
    return api.put(`/${id}`, employeeData)
  },

  // DELETE - Remove employee
  delete(id) {
    return api.delete(`/${id}`)
  }
}
