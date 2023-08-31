
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateTaskInput {
    name?: Nullable<string>;
    usersIds?: Nullable<Nullable<string>[]>;
}

export class CreateUserInput {
    email?: Nullable<string>;
    name?: Nullable<string>;
    password?: Nullable<string>;
}

export class SignInInput {
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export abstract class IMutation {
    abstract createTask(input?: Nullable<CreateTaskInput>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract createUser(input?: Nullable<CreateUserInput>): Nullable<User> | Promise<Nullable<User>>;

    abstract signIn(input?: Nullable<SignInInput>): Nullable<SignIn> | Promise<Nullable<SignIn>>;
}

export abstract class IQuery {
    abstract task(id: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract tasks(user_ids?: Nullable<Nullable<string>[]>): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class SignIn {
    access_token?: Nullable<string>;
    user?: Nullable<User>;
}

export class Task {
    created_at?: Nullable<string>;
    id: number;
    name?: Nullable<string>;
    users?: Nullable<Nullable<User>[]>;
}

export class User {
    email?: Nullable<string>;
    id: number;
    name?: Nullable<string>;
    tasks?: Nullable<Nullable<Task>[]>;
}

type Nullable<T> = T | null;
