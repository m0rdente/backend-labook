import { BadRequestError } from "../errors/BadRequestError"
import { Post } from "../models/Post"

export interface CreatePostInputDTO{
    id: string,
    creatorId: string,
    content: string,
    // likes: string,
    // dislikes: string
}

export interface CreatePostOutputDTO{
    meassage: string,
    post: {
        id: string,
        creatorId: string, 
        content: string, 
        likes: number, 
        dislikes: number,
        createdAt: string,
        updatedAt: string
    }
}

export interface UpdatePostInputDTO{
    id: string,
    value: string
}

export interface UpdatePostOutputDTO{
    meassage: string,
    post: {
        id: string,
        creatorId: string, 
        content: string, 
        likes: number, 
        dislikes: number,
        createdAt: string,
        updatedAt: string
    }
}

export interface DeletePostInputDTO{
    idToDelete: string
}

export interface DeletePostOutputDTO{
    message: "Post deletado com sucesso"
}

export class PostDTO {
    public createPostInput (
        id: unknown,
        creatorId: unknown,
        content: unknown
    ): CreatePostInputDTO
    {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof creatorId !== "string") {
            throw new BadRequestError("'creator_id' deve ser string")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const dto: CreatePostInputDTO = {
            id,
            creatorId,
            content
        }

        return dto
    }

    public createPostOutput(post: Post): CreatePostOutputDTO
    {
        const dto: CreatePostOutputDTO = {
            meassage: "Post registrado com sucesso!",
            post: {
                id: post.getId(),
                creatorId: post.getCreatorId(), 
                content: post.getContent(), 
                likes: post.getDislikes(), 
                dislikes: post.getDislikes(),
                createdAt: post.getCreatedAt(),
                updatedAt: post.getUpdatedAt()
            }
        }

        return dto
    }

    public updatePostInput(
        id: string,
        value: unknown
    ): UpdatePostInputDTO
    {
        if (typeof value !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const dto: UpdatePostInputDTO = {
            id,
            value
        }

        return dto
    }

    public updatePostOutput(post: Post): UpdatePostOutputDTO
    {
        const dto: UpdatePostOutputDTO = {
            meassage: "Post atualizado com sucesso!",
            post: {
                id: post.getId(),
                creatorId: post.getCreatorId(), 
                content: post.getContent(), 
                likes: post.getDislikes(), 
                dislikes: post.getDislikes(),
                createdAt: post.getCreatedAt(),
                updatedAt: post.getUpdatedAt()
            }
        }

        return dto
    }
}