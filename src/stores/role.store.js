import { defineStore } from 'pinia'
import RoleService from "../services/api/role.service";

const roleService = new RoleService();

export const useRoleStore = defineStore({
    id: 'role',
    state: () => ({
        roles: [],
    }),
    getters: {

        getRoles: (state) => {
            if (state.roles.length > 0) {
                return state.roles
            }
            else {
                return this.get().then(result => {
                    return result;
                })
            }
        },
    },
    actions: {
        async get(id) {
            return await roleService.get(id).then((result => {
                if (result) {
                    //store
                    this.roles = result;
                    return this.roles;
                }
            })).catch(error => {
                switch (error.statusCode) {
                    default:
                        throw error.message
                }
            });
        },
    }
})
