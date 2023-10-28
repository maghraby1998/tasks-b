
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
    projectId?: Nullable<string>;
    stageId?: Nullable<string>;
    usersIds?: Nullable<Nullable<string>[]>;
}

export class CreateUserInput {
    email?: Nullable<string>;
    name?: Nullable<string>;
    password?: Nullable<string>;
}

export class InviteUserToProjectInput {
    email: string;
    projectId: number;
}

export class SignInInput {
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export class SignUpInput {
    email?: Nullable<string>;
    name?: Nullable<string>;
    password?: Nullable<string>;
}

export class UpdateProjectInput {
    id?: Nullable<number>;
    name?: Nullable<string>;
    stages?: Nullable<Nullable<UpdateStageInput>[]>;
    users?: Nullable<Nullable<string>[]>;
}

export class UpdateStageInput {
    id?: Nullable<number>;
    name: string;
    order: number;
}

export class UpdateTaskInput {
    id?: Nullable<string>;
    name?: Nullable<string>;
    usersIds?: Nullable<Nullable<string>[]>;
}

export class UpdateTaskStageInput {
    stageId?: Nullable<string>;
    taskId?: Nullable<string>;
}

export class UpsertProjectInput {
    name?: Nullable<string>;
    stages?: Nullable<Nullable<CreateStageInput>[]>;
    users?: Nullable<Nullable<string>[]>;
}

export class Invitation {
    id?: Nullable<number>;
    project?: Nullable<Project>;
    receiver?: Nullable<User>;
    sender?: Nullable<User>;
    status?: Nullable<string>;
}

export abstract class IMutation {
    abstract acceptInvitation(invitationId?: Nullable<number>): Nullable<Invitation> | Promise<Nullable<Invitation>>;

    abstract cancelInvitation(invitationId?: Nullable<number>): Nullable<Invitation> | Promise<Nullable<Invitation>>;

    abstract createTask(input?: Nullable<CreateTaskInput>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract createUser(input?: Nullable<CreateUserInput>): Nullable<User> | Promise<Nullable<User>>;

    abstract inviteUserToProject(input?: Nullable<InviteUserToProjectInput>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract rejectInvitation(invitationId?: Nullable<number>): Nullable<Invitation> | Promise<Nullable<Invitation>>;

    abstract signIn(input?: Nullable<SignInInput>): Nullable<SignIn> | Promise<Nullable<SignIn>>;

    abstract signUp(input?: Nullable<SignUpInput>): Nullable<User> | Promise<Nullable<User>>;

    abstract updateProject(input?: Nullable<UpdateProjectInput>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract updateTask(input?: Nullable<UpdateTaskInput>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract updateTaskStage(input?: Nullable<UpdateTaskStageInput>): Nullable<Task> | Promise<Nullable<Task>>;

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
    abstract project(id: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract projects(): Nullable<Nullable<Project>[]> | Promise<Nullable<Nullable<Project>[]>>;

    abstract receivedInvitations(): Nullable<Nullable<Invitation>[]> | Promise<Nullable<Nullable<Invitation>[]>>;

    abstract sentInvitations(): Nullable<Nullable<Invitation>[]> | Promise<Nullable<Nullable<Invitation>[]>>;

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

export abstract class ISubscription {
    abstract invitationAccepted(): Nullable<string> | Promise<Nullable<string>>;
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
