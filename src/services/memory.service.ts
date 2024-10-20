
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
