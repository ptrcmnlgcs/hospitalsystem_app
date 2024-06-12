<template>
    <DashboardView />
    <div class="hello">
        <h1>Patient Management</h1>
        <button v-if="isAdmin" class="btn btn-info btn-sm m-1" @click="addPatient()">Add a Patient</button>
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in patients" :key="patient.id">
                    <td>{{ patient.id }}</td>
                    <td>{{ patient.name }}</td>
                    <td>{{ patient.email }}</td>
                    <td>
                        <button v-if="isAdmin || isDoctor" class="btn btn-warning btn-sm m-1" @click="editPatient(patient)">Edit</button>
                        <button v-if="isAdmin" class="btn btn-danger btn-sm m-1" @click="deletePatient(patient)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <Modal v-if="showAddPatientModal" @close="showAddPatientModal = false">
        <template v-slot:header>
            <h5>Add New Patient</h5>
        </template>
        <template v-slot:body>
            <form @submit.prevent="postPatient()">
                <div class="form-group">
                    <label for="newPatientName">Name</label>
                    <input type="text" class="form-control" id="newPatientName" v-model="newPatientData.name">
                </div>
                <div class="form-group">
                    <label for="newPatientEmail">Email</label>
                    <input type="text" class="form-control" id="newPatientEmail" v-model="newPatientData.email">
                </div>
                <div class="form-group">
                    <label for="newPatientPassword">Password</label>
                    <input type="password" class="form-control" id="newPatientPassword" v-model="newPatientData.password">
                </div>
                <button type="submit" class="btn btn-primary btn-block">Add</button>
            </form>
        </template>
    </Modal>
    
    <Modal v-if="showEditPatientModal" @close="showEditPatientModal = false">
        <template v-slot:header>
            <h5>Edit Patient Details</h5>
        </template>
        <template v-slot:body>
            <form @submit.prevent="updatePatient()">
                <div class="form-group">
                    <label for="newPatientName">Name</label>
                    <input type="text" class="form-control" id="newPatientName" v-model="editPatientData.name">
                </div>
                <div class="form-group">
                    <label for="newPatientEmail">Email</label>
                    <input type="text" class="form-control" id="newPatientEmail" v-model="editPatientData.email">
                </div>
                <div class="form-group">
                    <label for="newPatientPassword">Password</label>
                    <input type="password" class="form-control" id="newPatientPassword" v-model="editPatientData.password">
                </div>
                <button type="submit" class="btn btn-primary m-1 btn-block">Update</button>
            </form>
        </template>
    </Modal>
    </template>
    
    <script>
    import Modal from './PopUpModal.vue';
    import axios from 'axios';
    import DashboardView from '@/views/DashboardView.vue';
    
    export default {
        name: 'PatientManagement',
        components: {
            Modal,
            DashboardView
        },
        data() {
            return {
                patients: [],
                user: '',
                showAddPatientModal: false,
                showEditPatientModal: false,
                newPatientData: {
                    name: '',
                    email: '',
                    password: '',
                    userType: 'patient'
                },
                editPatientData: {
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    userType: 'patient',
                    updated_at: ''
                }
            };
        },
        computed: {
            isAdmin() {
                return this.user && this.user.userType === 'admin';
            },
            isDoctor() {
                return this.user && this.user.userType === 'doctor';
            },
            isPatient() {
                return this.user && this.user.userType === 'patient';
            },
        },
        mounted() {
            this.fetchPatient();
        },
        created() {
            this.loadUserFromLocalStorage();
        },
        methods: {
            fetchPatient() {
                fetch('http://127.0.0.1:8000/api/patient', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.patients = data.PatientAccounts;
                    })
                    .catch(err => {
                        if (err.response) {
                            this.error = `Error: ${err.response.data.message}`;
                            console.error(err.response.data);
                        } else if (err.request) {
                            this.error = 'No response from server. Please try again later.';
                            console.error(err.request);
                        } else {
                            this.error = 'Request error. Please check your input and try again.';
                            console.error('Error', err.message);
                        }
                    });
            },
            addPatient() {
                this.showAddPatientModal = true;
            },
            async postPatient() {
                try {
                    await axios.post('http://127.0.0.1:8000/api/patient', this.newPatientData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                    this.showAddPatientModal = false;
                } catch (error) {
                    console.error('There was an error adding the product:', error);
                }
                this.fetchPatient();
            },
            editPatient(patient) {
                this.editPatientData = {
                    ...patient
                };
                this.showEditPatientModal = true;
            },
            async updatePatient() {
                this.editPatientData.updated_at = new Date().toISOString();
                await axios.put(`http://127.0.0.1:8000/api/patient/${this.editPatientData.id}`, this.editPatientData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                this.showEditPatientModal = false;
                this.fetchPatient();
            },
            async deletePatient(patient) {
                const index = this.patients.findIndex(p => p.id === patient.id);
                if (index !== -1) {
                    this.patients.splice(index, 1);
                }
                try {
                    await axios.delete(`http://127.0.0.1:8000/api/patient/${patient.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                } catch (error) {
                    console.error('There was an error deleting the product:', error);
                }
            },
            loadUserFromLocalStorage() {
                const user = localStorage.getItem('user');
                if (user) {
                    this.user = JSON.parse(user);
                    this.editUserData = {
                        ...this.user
                    };
                }
            },
        }
    };
    </script>
    
    <style scoped>
    .hello h1 {
        padding-top: 100px;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
    }
    
    .btn {
        cursor: pointer;
    }
    
    .btn-group {
        margin-right: 5px;
    }
    
    table {
        background: #f5f5f5;
        border-collapse: separate;
        box-shadow: inset 0 1px 0 #fff;
        font-size: 12px;
        line-height: 24px;
        margin: 30px auto;
        text-align: left;
        width: 1000px;
    }
    
    th {
        background: url(https://jackrugile.com/images/misc/noise-diagonal.png), linear-gradient(#777, #444);
        border-left: 1px solid #555;
        border-right: 1px solid #777;
        border-top: 1px solid #555;
        border-bottom: 1px solid #333;
        box-shadow: inset 0 1px 0 #999;
        color: #fff;
        font-weight: bold;
        padding: 10px 15px;
        position: relative;
        text-shadow: 0 1px 0 #000;
    }
    
    th:after {
        background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, .08));
        content: '';
        display: block;
        height: 25%;
        left: 0;
        margin: 1px 0 0 0;
        position: absolute;
        top: 25%;
        width: 100%;
    }
    
    th:first-child {
        border-left: 1px solid #777;
        box-shadow: inset 1px 1px 0 #999;
    }
    
    th:last-child {
        box-shadow: inset -1px 1px 0 #999;
    }
    
    td {
        border-right: 1px solid #fff;
        border-left: 1px solid #e8e8e8;
        border-top: 1px solid #fff;
        border-bottom: 1px solid #e8e8e8;
        padding: 10px 15px;
        position: relative;
        transition: all 300ms;
    }
    
    td:first-child {
        box-shadow: inset 1px 0 0 #fff;
    }
    
    td:last-child {
        border-right: 1px solid #e8e8e8;
        box-shadow: inset -1px 0 0 #fff;
    }
    
    tr {
        background: url(https://jackrugile.com/images/misc/noise-diagonal.png);
    }
    
    tr:nth-child(odd) td {
        background: #f1f1f1 url(https://jackrugile.com/images/misc/noise-diagonal.png);
    }
    
    tr:last-of-type td {
        box-shadow: inset 0 -1px 0 #fff;
    }
    
    tr:last-of-type td:first-child {
        box-shadow: inset 1px -1px 0 #fff;
    }
    
    tr:last-of-type td:last-child {
        box-shadow: inset -1px -1px 0 #fff;
    }
    
    tbody:hover td {
        color: transparent;
        text-shadow: 0 0 3px #aaa;
    }
    
    tbody:hover tr:hover td {
        color: #444;
        text-shadow: 0 1px 0 #fff;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    
    .form-control {
        width: 100%;
        padding: 10px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        box-sizing: border-box;
    }
    
    .form-control:focus {
        border-color: #80bdff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
    }
    
    .btn-primary {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
    }
    
    .btn-primary:hover {
        color: #fff;
        background-color: #0069d9;
        border-color: #0062cc;
    }
    
    .btn-danger {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545;
    }
    
    .btn-danger:hover {
        color: #fff;
        background-color: #c82333;
        border-color: #bd2130;
    }
    
    .btn-info {
        color: #fff;
        background-color: #17a2b8;
        border-color: #17a2b8;
    }
    
    .btn-info:hover {
        color: #fff;
        background-color: #138496;
        border-color: #117a8b;
    }
    
    .btn-warning {
        color: #212529;
        background-color: #ffc107;
        border-color: #ffc107;
    }
    
    .btn-warning:hover {
        color: #212529;
        background-color: #e0a800;
        border-color: #d39e00;
    }
    
    
    .btn-block {
        display: block;
        width: 100%;
      }
    </style>
    
    