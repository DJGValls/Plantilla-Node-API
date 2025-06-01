import { UserModel } from "models/user.model";
import { FindOptions, PaginatedResponse, PaginationOptions, Query, SortOptions } from "types/RepositoryTypes";
import { InterfaceUserRepository, User } from "types/UserTypes";

export class UserRepository implements InterfaceUserRepository {
    async create(data: User): Promise<User> {
        const newUser = new UserModel(data);
        return await newUser.save();
    }

    async find(query?: Query, options?: FindOptions): Promise<PaginatedResponse<User>> {
        const { pagination, sort, populate } = options || {};
        const { page = 1, limit = 10 } = pagination || {};
        const skip = (page - 1) * limit;
        let queryBuilder = UserModel.find(query || {});
        // Aplicar populate si se especifica
        if (populate && populate.length > 0) {
            populate.forEach((option) => {
                try {
                    queryBuilder = queryBuilder.populate(option);
                } catch (error) {
                    console.error('Error applying populate:', error);
                }
            });
        }
        if (sort && Object.keys(sort).length > 0) {
            queryBuilder.sort(sort);
        }
        const total = await UserModel.countDocuments(query || {});
        console.log(total)
        let items = await queryBuilder.skip(skip).limit(limit).exec();
        console.log(options);
        console.log(items);
        return {
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string, options?: FindOptions): Promise<User | null> {
        let queryBuilder = UserModel.findById(id);

        if (options?.populate) {
            options.populate.forEach((option) => {
                queryBuilder = queryBuilder.populate(option);
            });
        }

        return await queryBuilder.exec();
    }

    async findOne(query: any, options?: FindOptions): Promise<User | null> {
        let queryBuilder = UserModel.findOne(query);

        if (options?.populate) {
            options.populate.forEach((option) => {
                queryBuilder = queryBuilder.populate(option);
            });
        }

        return await queryBuilder.exec();
    }

    async update(id: string, data: User): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(id, data, { new: true }).populate("roles").exec();
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await UserModel.findByIdAndDelete(id).exec();
        return deleted !== null;
    }
}
