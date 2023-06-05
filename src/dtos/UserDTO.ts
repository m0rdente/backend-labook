import { UserModel, PostModel } from "../types";

export interface GetUsersInputDTO {
    q: unknown,
    token: unknown
}

export type GetUsersOutputDTO = UserModel[]

export interface SignupInputDTO {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutputDTO {
    message: string,
    token: string
}

export interface LoginInputDTO {
    email: unknown,
    password: unknown
}

export interface LoginOutputDTO {
    message: string,
    token: string
}

export interface GetPostsInputDTO {
    token: string | undefined
}

export type GetPostsOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined
    content: unknown
}

export interface EditPostInputDTO {
    idToEdit: string,
    token: string | undefined,
    content: unknown
}

export interface DeletePostInputDTO {
    idToDelete: string,
    token: string | undefined,
}

export interface LikeOrDeslikePostInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}