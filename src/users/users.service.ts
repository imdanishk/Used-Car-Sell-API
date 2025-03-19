import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    findOne(id: number) {
        if (!id) {
            return null;
        }
        return this.repo.findOneBy({ id });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.repo.remove(user);
    }

    // async login(email: string, password: string) {
    //     const [user] = await this.find(email);

    //     if (!user) {
    //         return null;
    //     }

    //     const passwordsMatch = await user.comparePassword(password);
    //     if (!passwordsMatch) {
    //         return null;
    //     }

    //     return user;
    // }

    // async changePassword(id: number, password: string) {
    //     return this.update(id, { password });
    // }

    // async resetPassword(email: string) {
    //     const [user] = await this.find(email);
    //     if (!user) {
    //         return null;
    //     }

    //     const newPassword = 'newpassword';
    //     await this.changePassword(user.id, newPassword);
    //     return newPassword;
    // }

    // async forgotPassword(email: string) {
    //     const [user] = await this.find(email);
    //     if (!user) {
    //         return null;
    //     }

    //     const newPassword = 'newpassword';
    //     await this.changePassword(user.id, newPassword);
    //     return newPassword;
    // }
}
