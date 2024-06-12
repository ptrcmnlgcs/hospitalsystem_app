<template>
<DashboardView />
<div class="hello">
    <h1 v-if="isAdmin">Appoinment Management</h1>
    <h1 v-if="isDoctor || isPatient">My Appointments</h1>
    <button v-if="isPatient" class="btn btn-info btn-sm m-1" @click="addAppointment()">Add an Appointment</button>
    <table class="table table-striped table-bordered">
        <thead class="thead-dark">
            <tr>
                <th>ID</th>
                <th v-if="isDoctor || isAdmin">Patient</th>
                <th v-if="isPatient || isAdmin">Doctor</th>
                <th>Date / Time</th>
                <th>Status</th>
                <th v-if=" isDoctor || isPatient ">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id">
                <td>{{ appointment.id }}</td>
                <td v-if="isDoctor || isAdmin">{{ appointment.PatientName }}</td>
                <td v-if="isPatient || isAdmin">{{ appointment.DoctorName }}</td>
                <td>{{ formatDateTime(appointment.time) }}</td>
                <td>{{ appointment.status }}</td>
                <td>
                    <button v-if="isDoctor" class="btn btn-warning btn-sm m-1" @click="editAppointment(appointment)">Edit</button>
                    <button v-if="isDoctor" class="btn btn-danger btn-sm m-1" @click="deleteAppointment(appointment)">Delete</button>
                    <button v-if="isPatient" class="btn btn-danger btn-sm m-1" @click="deleteAppointment(appointment)">Cancel</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<Modal v-if="showAddAppointmentModal" @close="showAddAppointmentModal = false">
    <template v-slot:header>
        <h5>Add a new appointment</h5>
    </template>
    <template v-slot:body>
        <form @submit.prevent="postAppointment()">
            <div class="form-group">
                <label for="patientName">Patient Name</label>
                <select id="patientName" class="form-control" v-model="newAppointmentData.patientID" disabled>
                    <option value="" disabled selected>Select Patient</option>
                    <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patient.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="doctorName">Doctor Name</label>
                <select id="doctorName" class="form-control" v-model="newAppointmentData.doctorID" required>
                    <option value="" disabled selected>Select Doctor</option>
                    <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">{{ doctor.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="appointmentDate">Date</label>
                <input type="date" name="appt" id="appointmentDate" v-model="date" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="appointmentTime">Time</label>
                <input type="time" name="appt" id="appointmentTime" v-model="time" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary m-1  btn-block">Add</button>
        </form>
    </template>
</Modal>

<Modal v-if="showEditAppointmentModal" @close="showEditAppointmentModal = false">
    <template v-slot:header>
        <h5>Edit appointment</h5>
    </template>
    <template v-slot:body>
        <form @submit.prevent="updateAppointment()">
            <div class="form-group">
                <label for="patientName">Patient Name</label>
                <select id="patientName" class="form-control" v-model="editAppointmentData.patientID" required>
                    <option value="" disabled>Select Patient</option>
                    <option v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patient.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="doctorName">Doctor Name</label>
                <select id="doctorName" class="form-control" v-model="editAppointmentData.doctorID" required>
                    <option value="" disabled>Select Doctor</option>
                    <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">{{ doctor.name }}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label for="appointmentDate">Date</label>
                <input type="date" name="appt" id="appointmentDate" v-model="editDate" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="appointmentTime">Time</label>
                <input type="time" name="appt" id="appointmentTime" v-model="editTime" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="Status">Status</label>
                <select id="Status" class="form-control" v-model="editAppointmentData.status" required>
                    <option value="" disabled selected>Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Done">Done</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary m-1 btn-block">Update</button>
        </form>
    </template>
</Modal>
</template>

<script>
import DashboardView from '@/views/DashboardView.vue';
import Modal from './PopUpModal.vue';
import axios from 'axios';

export default {
    name: 'AppointmentManagement',
    components: {
        Modal,
        DashboardView
    },
    data() {
        return {
            appointments: [],
            patients: [],
            doctors: [],
            user: '',
            date: '',
            time: '',
            editDate: '',
            editTime: '',
            showAddAppointmentModal: false,
            showEditAppointmentModal: false,
            newAppointmentData: {
                patientID: '',
                doctorID: '',
                time: '',
                status: 'Pending'
            },
            editAppointmentData: {
                id: '',
                patientID: '',
                doctorID: '',
                time: '',
                status: ''
            }
        };
    },
    computed: {
        datetime() {
            if (this.date && this.time) {

                const datetimeString = `${this.date} ${this.time}`;

                const datetime = new Date(datetimeString);

                const year = datetime.getFullYear();
                const month = ('0' + (datetime.getMonth() + 1)).slice(-2);
                const day = ('0' + datetime.getDate()).slice(-2);
                const hours = ('0' + datetime.getHours()).slice(-2);
                const minutes = ('0' + datetime.getMinutes()).slice(-2);
                const seconds = ('0' + datetime.getSeconds()).slice(-2);
                // Return formatted datetime string
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            } else {
                return '';
            }
        },
        editdatetime() {
            if (this.editDate && this.editTime) {

                const datetimeString = `${this.editDate} ${this.editTime}`;

                const datetime = new Date(datetimeString);

                const year = datetime.getFullYear();
                const month = ('0' + (datetime.getMonth() + 1)).slice(-2);
                const day = ('0' + datetime.getDate()).slice(-2);
                const hours = ('0' + datetime.getHours()).slice(-2);
                const minutes = ('0' + datetime.getMinutes()).slice(-2);
                const seconds = ('0' + datetime.getSeconds()).slice(-2);
                // Return formatted datetime string
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            } else {
                return '';
            }
        },
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
    created() {
        this.loadUserFromLocalStorage();
    },
    mounted() {
        this.fetchAppointments();
        this.fetchPatients();
        this.fetchDoctors();
    },
    methods: {
        fetchAppointments() {
            if (this.isAdmin) {
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
                fetch('http://127.0.0.1:8000/api/appointments?doctorID=' + this.user.id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.appointments = data.Appointments;
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
                fetch('http://127.0.0.1:8000/api/appointments?patientID=' + this.user.id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.appointments = data.Appointments;
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
        fetchDoctors() {
            fetch('http://127.0.0.1:8000/api/doctor', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                })
                .then(response => response.json())
                .then(data => {
                    this.doctors = data.DoctorAccounts;
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
        addAppointment() {
            if (this.isDoctor) {
                this.newAppointmentData.doctorID = this.user.id;
            } else if (this.isPatient) {
                this.newAppointmentData.patientID = this.user.id;
            }
            this.showAddAppointmentModal = true;
        },
        async postAppointment() {
            try {
                this.newAppointmentData.time = this.datetime;
                console.log(this.newAppointmentData);
                await axios.post('http://127.0.0.1:8000/api/appointments', this.newAppointmentData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                this.newAppointmentData = [];
                this.showAddAppointmentModal = false;
            } catch (error) {
                console.error('There was an error adding the product:', error);
            }
            this.fetchAppointments();
        },
        editAppointment(appointment) {
            this.editAppointmentData = {
                ...appointment
            };

            // Assign directly
            this.editDate = appointment.time.substring(0, 10); // Extract the date part
            this.editTime = appointment.time.substring(11, 16); // Extract the time part

            this.showEditAppointmentModal = true;
        },
        async updateAppointment() {
            this.editAppointmentData.time = this.editdatetime;
            console.log(this.editAppointmentData);
            await axios.put(`http://127.0.0.1:8000/api/appointments/${this.editAppointmentData.id}`, this.editAppointmentData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            this.showEditAppointmentModal = false;
            this.fetchAppointments();
        },
        async deleteAppointment(appointment) {
            const userConfirmed = confirm('Are you sure you want to delete this appointment?');
            if (userConfirmed) {
                const index = this.appointments.findIndex(a => a.id === appointment.id);
                if (index !== -1) {
                    this.appointments.splice(index, 1);
                }
                try {
                    await axios.delete(`http://127.0.0.1:8000/api/appointments/${appointment.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                } catch (error) {
                    console.error('There was an error deleting the appointment:', error);
                }
            } else {
                console.log('Appointment deletion canceled.');
            }
        },
        formatDateTime(datetimeString) {
            if (!datetimeString) return ''; // Handle empty or undefined datetime
            const datetime = new Date(datetimeString);
            // Format date and time
            const formattedDate = datetime.toLocaleDateString();
            const formattedTime = datetime.toLocaleTimeString();
            return `${formattedDate} / ${formattedTime}`;
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
