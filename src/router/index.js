import { createRouter, createWebHashHistory } from 'vue-router';
import UserManagement from '@/components/Users.vue';
import ManageRegister from '@/components/ManageRegister.vue'
import MedicalRecordManagement from '@/components/MedicalRecords.vue';
import ManageLogin from '@/components/ManageLogin.vue'
import PatientManagement from '@/components/Patients.vue'
import AppointmentManagement from '@/components/Appointments.vue';

const routes = [{
        path: '/',
        name: 'landing',
        component: ManageLogin,
    },
    {
        path: '/login',
        name: 'login',
        component: ManageLogin,
    },
    {
        path: '/register',
        name: 'register',
        component: ManageRegister,
    },
    {
        path: '/patients',
        name: 'PatientManagement',
        component: PatientManagement,
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { requiresAuth: true }
    },
    {
        path: '/appointments',
        name: 'AppointmentManagement',
        component: AppointmentManagement,
        meta: { requiresAuth: true }
    },
    {
        path: '/medicalrecords',
        name: 'MedicalRecordManagement',
        component: MedicalRecordManagement,
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () =>
            import ('../views/DashboardView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/logout',
        name: 'logout',
        component: () =>
            import ('../views/LogoutView.vue'),
        meta: { requiresAuth: true }
    },
    
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router
