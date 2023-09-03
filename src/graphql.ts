
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateStageInput {
    name: string;
    order: number;
}

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

export class UpsertProjectInput {
    name?: Nullable<string>;
    stages?: Nullable<Nullable<CreateStageInput>[]>;
}

export abstract class IMutation {
    abstract createTask(input?: Nullable<CreateTaskInput>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract createUser(input?: Nullable<CreateUserInput>): Nullable<User> | Promise<Nullable<User>>;

    abstract signIn(input?: Nullable<SignInInput>): Nullable<SignIn> | Promise<Nullable<SignIn>>;

    abstract upsertProject(input?: Nullable<UpsertProjectInput>): Nullable<Project> | Promise<Nullable<Project>>;
}

export class Project {
    created_at: string;
    id: number;
    name: string;
    stages?: Nullable<Nullable<Stage>[]>;
    tasks?: Nullable<Nullable<Task>[]>;
    users?: Nullable<Nullable<User>[]>;
}

export abstract class IQuery {
    abstract projects(): Nullable<Nullable<Project>[]> | Promise<Nullable<Nullable<Project>[]>>;

    abstract task(id: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract tasks(user_ids?: Nullable<Nullable<string>[]>): Nullable<Nullable<Task>[]> | Promise<Nullable<Nullable<Task>[]>>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class SignIn {
    access_token?: Nullable<string>;
    user?: Nullable<User>;
}

export class Stage {
    id: number;
    name: string;
    order: number;
    project?: Nullable<Project>;
    tasks?: Nullable<Nullable<Task>[]>;
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
