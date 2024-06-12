import { createRouter, createWebHashHistory } from 'vue-router';
import ManageLogin from '@/components/ManageLogin.vue'

const routes = [{
        path: '/',
        name: 'landing',
        component: ManageLogin,
    },
    
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router