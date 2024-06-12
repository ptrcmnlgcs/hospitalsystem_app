<template>
<DashboardView />
<div class="hello">
    <h1>Medical Record Management</h1>
    <button v-if="isDoctor" class="btn btn-info btn-sm m-1" @click="addMedicalRecord()">Add Medical Record</button>
    <table class="table table-striped table-bordered">
        <thead class="thead-dark">
            <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Details</th>
                <th v-if="isDoctor">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="record in records" :key="record.id">
                <td>{{ record.id }}</td>
                <td>{{ record.PatientName }}</td>
                <td>{{ record.RecordDetails }}</td>
                <td v-if="isDoctor">
                    <button class="btn btn-warning btn-sm m-1" @click="editMedicalRecord(record)">Edit</button>
                    <button class="btn btn-danger btn-sm m-1" @click="deleteMedicalRecord(record)">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<Modal v-if="showAddMedicalRecord" @close="showAddMedicalRecord = false">
    <template v-slot:header>
        <h5>Add New User</h5>
    </template>
    <template v-slot:body>
        <form @submit.prevent="postMedicalRecord()" class="registration-form">
            <div class="form-group">
                <label for="patientName">Patient Name</label>
                <select id="patientName" class="form-control" v-model="newMedicalRecordData.patientID" required>
                    <option value="" disabled selected>Select Patient</option>
                    <option v-for="patient in patientsWithAppointments" :key="patient.id" :value="patient.id">{{ patient.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="recordDetails">Record Details:</label>
                <textarea type="text" class="form-control" id="newRecordDetails" v-model="newMedicalRecordData.RecordDetails"></textarea>
            </div>
            <button type="submit" class="btn btn-primary m-1 btn-block">Add Record</button>
        </form>
        <div v-if="error" class="error">{{ error }}</div>
    </template>
</Modal>

<Modal v-if="showEditMedicalRecord" @close="showEditMedicalRecord = false">
    <template v-slot:header>
        <h5>Edit Medical Record</h5>
    </template>
    <template v-slot:body>
        <form @submit.prevent="updateMedicalRecord()" class="registration-form">
            <div class="form-group">
                <label for="patientName">Patient Name</label>
                <select id="patientName" class="form-control" v-model="editMedicalRecordData.patientID" required>
                    <option value="" disabled selected>Select Patient</option>
                    <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patient.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="recordDetails">Record Details:</label>
                <textarea type="text" class="form-control" id="newRecordDetails" v-model="editMedicalRecordData.RecordDetails"></textarea>
            </div>
            <button type="submit" class="btn btn-primary m-1 btn-block">Update Record</button>
        </form>
    </template>
</Modal>
</template>

<script>
import Modal from './PopUpModal.vue';
import axios from 'axios';
import DashboardView from '@/views/DashboardView.vue';

export default {
    name: 'DoctorManagement',
    components: {
        Modal,
        DashboardView
    },
    data() {
        return {
            records: [],
            patients: [],
            appointments: [],
            patientsWithAppointments: [],
            user: '',
            showAddMedicalRecord: false,
            showEditMedicalRecord: false,
            newMedicalRecordData: {
                patientID: '',
                RecordDetails: ''
            },
            editMedicalRecordData: {
                id: '',
                patientID: '',
                RecordDetails: ''
            },
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
        this.fetchAllMedicalRecords();
        this.fetchPatients();
        this.fetchAppointments();
    },
    created() {
        this.loadUserFromLocalStorage();
    },
    methods: {
        fetchAllMedicalRecords() {
            if (this.isAdmin) {
                fetch('http://127.0.0.1:8000/api/medical_records', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.records = data.MedicalRecords;
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
            } else if (this.isPatient) {
                fetch('http://127.0.0.1:8000/api/medical_records?patientID=' + this.user.id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.records = data.MedicalRecords;
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
            } else if (this.isDoctor) {
                fetch('http://127.0.0.1:8000/api/medical_records', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.records = data.MedicalRecords;
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
            }
        },
        fetchPatients() {
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
        fetchAppointments() {
            fetch('http://127.0.0.1:8000/api/appointments', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                })
                .then(response => response.json())
                .then(data => {
                    this.appointments = data.Appointments;
                    this.filterPatientsWithAppointments();
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
        filterPatientsWithAppointments() {
            const appointmentPatientIds = this.appointments.map(appointment => appointment.patientID);
            this.patientsWithAppointments = this.patients.filter(patient => appointmentPatientIds.includes(patient.id));
        },
        addMedicalRecord() {
            this.showAddMedicalRecord = true;
        },
        async postMedicalRecord() {
            try {
                await axios.post('http://127.0.0.1:8000/api/medical_records', this.newMedicalRecordData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                this.showAddMedicalRecord = false;
            } catch (error) {
                console.error('There was an error adding the product:', error);
            }
            this.fetchAllMedicalRecords();
            this.newMedicalRecordData = [];
            this.showAddMedicalRecord = false;
        },
        editMedicalRecord(record) {
            this.editMedicalRecordData = {
                ...record
            };
            this.showEditMedicalRecord = true;
        },
        async updateMedicalRecord() {
            this.editMedicalRecordData.updated_at = new Date().toISOString();
            await axios.put(`http://127.0.0.1:8000/api/medical_records/${this.editMedicalRecordData.id}`, this.editMedicalRecordData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            this.showEditMedicalRecord = false;
            this.fetchAllMedicalRecords();
        },
        async deleteMedicalRecord(record) {
            const userConfirmed = confirm('Are you sure you want to delete this medical record?');
            if (userConfirmed) {
                const index = this.records.findIndex(r => r.id === record.id);
                if (index !== -1) {
                    this.records.splice(index, 1);
                }
                try {
                    await axios.delete(`http://127.0.0.1:8000/api/medical_records/${record.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                } catch (error) {
                    console.error('There was an error deleting the medical record:', error);
                }
            } else {
                console.log('Medical record deletion canceled.');
            }
        },
        loadUserFromLocalStorage() {
            const user = localStorage.getItem('user');
            if (user) {
                this.user = JSON.parse(user);
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
