import { Query } from "types/RepositoryTypes";
import { InterfaceRolesRepository, InterfaceRolesService, Roles } from "types/RolesTypes";
import { FilterBuilder } from "utils/queryBuilders/FilterBuilder";

export class RolesService implements InterfaceRolesService {
    private rolesRepository: InterfaceRolesRepository;

    constructor(rolesRepository: InterfaceRolesRepository) {
        this.rolesRepository = rolesRepository;
    }

    async createRoles(roles: Roles): Promise<Roles> {
        return await this.rolesRepository.create(roles);
    }
    async findRoles(query?: Query): Promise<Roles[]> {
        const { filter, sort } = FilterBuilder(query);
        return await this.rolesRepository.find(filter, sort);
    }
    async findRolesById(id: string): Promise<Roles | null> {
        return await this.rolesRepository.findById(id);
    }
    async updateRoles(id: string, roles: Partial<Roles>): Promise<Roles | null> {
        return await this.rolesRepository.update(id, roles);
    }
    async deleteRoles(id: string): Promise<boolean> {
        const roles = await this.rolesRepository.delete(id);
        return roles ?? false;
    }
}
