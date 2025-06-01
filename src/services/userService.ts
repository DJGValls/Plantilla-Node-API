import { PaginatedResponse, Query } from "types/RepositoryTypes";
import { InterfaceUserRepository, InterfaceUserService, User } from "../types/UserTypes";
import { FilterBuilder } from "utils/queryBuilders/FilterBuilder";

export class UserService implements InterfaceUserService {
    private userRepository: InterfaceUserRepository;

    constructor(userRepository: InterfaceUserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(user: User): Promise<User> {
        return await this.userRepository.create(user);
    }
    async findUsers(query?: Query): Promise<PaginatedResponse<User>> {
        const { filter, sort, pagination } = FilterBuilder(query);
        return await this.userRepository.find(filter, sort, pagination);
    }
    async findUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ email });
    }
    async updateUser(id: string, user: Partial<User>): Promise<User | null> {
        return await this.userRepository.update(id, user);
    }
    async deleteUser(id: string): Promise<boolean> {
        const user = await this.userRepository.delete(id);
        return user ?? false;
    }



}
