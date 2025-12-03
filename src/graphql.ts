
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class InviteUserToProjectInput {
    email: string;
    projectId: number;
}

export class UpsertProjectInput {
    name?: Nullable<string>;
    stages?: Nullable<Nullable<CreateStageInput>[]>;
    users?: Nullable<Nullable<string>[]>;
}

export class UpdateProjectInput {
    id?: Nullable<number>;
    name?: Nullable<string>;
    stages?: Nullable<Nullable<UpdateStageInput>[]>;
    users?: Nullable<Nullable<string>[]>;
}

export class CreateStageInput {
    name: string;
    order: number;
}

export class UpdateStageInput {
    id?: Nullable<number>;
    name: string;
    order: number;
}

export class CreateTaskInput {
    name?: Nullable<string>;
    projectId?: Nullable<string>;
    stageId?: Nullable<string>;
    usersIds?: Nullable<Nullable<string>[]>;
    description?: Nullable<string>;
}

export class UpdateTaskInput {
    id?: Nullable<string>;
    name?: Nullable<string>;
    usersIds?: Nullable<Nullable<string>[]>;
}

export class UpdateTaskStageInput {
    taskId?: Nullable<string>;
    stageId?: Nullable<string>;
}

export class SignInInput {
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export class SignUpInput {
    name: string;
    email: string;
    password: string;
}

export class Invitation {
    id?: Nullable<number>;
    sender?: Nullable<User>;
    receiver?: Nullable<User>;
    project?: Nullable<Project>;
    status?: Nullable<string>;
}

export abstract class IQuery {
    abstract sentInvitations(): Nullable<Nullable<Invitation>[]> | Promise<Nullable<Nullable<Invitation>[]>>;

    abstract receivedInvitations(): Nullable<Nullable<Invitation>[]> | Promise<Nullable<Nullable<Invitation>[]>>;

    abstract project(id: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract projects(): Nullable<Nullable<Project>[]> | Promise<Nullable<Nullable<Project>[]>>;

    abstract task(id: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract inviteUserToProject(input?: Nullable<InviteUserToProjectInput>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract acceptInvitation(invitationId?: Nullable<number>): Nullable<Invitation> | Promise<Nullable<Invitation>>;

    abstract rejectInvitation(invitationId?: Nullable<number>): Nullable<Invitation> | Promise<Nullable<Invitation>>;

    abstract cancelInvitation(invitationId?: Nullable<number>): Nullable<Invitation> | Promise<Nullable<Invitation>>;

    abstract upsertProject(input?: Nullable<UpsertProjectInput>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract updateProject(input?: Nullable<UpdateProjectInput>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract createTask(input?: Nullable<CreateTaskInput>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract updateTask(input?: Nullable<UpdateTaskInput>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract updateTaskStage(input?: Nullable<UpdateTaskStageInput>): Nullable<Task> | Promise<Nullable<Task>>;

    abstract changeTaskName(id: string, name: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract changeTaskDescription(id: string, description: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract signIn(input?: Nullable<SignInInput>): Nullable<SignIn> | Promise<Nullable<SignIn>>;

    abstract signUp(input?: Nullable<SignUpInput>): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class ISubscription {
    abstract invitationAccepted(): Nullable<string> | Promise<Nullable<string>>;
}

export class Project {
    id: number;
    name: string;
    created_at: string;
    stages?: Nullable<Nullable<Stage>[]>;
    users?: Nullable<Nullable<User>[]>;
    tasks?: Nullable<Nullable<Task>[]>;
}

export class Stage {
    id: number;
    name: string;
    order: number;
    project?: Nullable<Project>;
    tasks?: Nullable<Nullable<Task>[]>;
}

export class Task {
    id: number;
    name?: Nullable<string>;
    created_at?: Nullable<string>;
    assignees?: Nullable<Nullable<User>[]>;
    project?: Nullable<Project>;
    createdBy?: Nullable<User>;
    description?: Nullable<string>;
}

export class SignIn {
    user?: Nullable<User>;
    access_token?: Nullable<string>;
}

export class User {
    id: number;
    name?: Nullable<string>;
    email?: Nullable<string>;
    tasks?: Nullable<Nullable<Task>[]>;
}

type Nullable<T> = T | null;
