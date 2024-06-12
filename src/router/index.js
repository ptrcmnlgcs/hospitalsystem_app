import { createRouter, createWebHashHistory } from 'vue-router';
import UserManagement from '@/components/Users.vue';
import ManageRegister from '@/components/ManageRegister.vue'
import ManageLogin from '@/components/ManageLogin.vue'


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
        path: '/users',
        name: 'UserManagement',
        component: UserManagement,
        meta: { requiresAuth: true }
    },
    
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router