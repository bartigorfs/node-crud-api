
import {v4 as uuidv4} from 'uuid';
import {BaseUser, User, Users} from "@/models/user.model";
import {MemInvalidArgs, MemNotFound} from "@/models/memory.model";

let mem: Users = {
  users: []
};

export const addUser = (user: BaseUser): User => {
  if (!user) throw new MemInvalidArgs();

  if (!mem || !mem.users) throw new MemNotFound();

  const newUser: User = {
    id: uuidv4(),
    ...user,
  };

  mem.users.push(newUser);

  return newUser;
}

export const getAllUsers = (): User[] => {
  if (mem && mem.users.length > 0) {
    return mem.users;
  } else {
    throw new MemNotFound();
  }
}

export const getUserById = (userId: string): User => {
  if (mem && mem.users.length > 0) {
    const result: User | undefined = mem.users.find((user: User) => user.id === userId);

    if (!result) {
      throw new MemNotFound();
    }

    return result;
  } else {
    throw new MemNotFound();
  }
}
