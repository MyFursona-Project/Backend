import type { FastifyReply, FastifyRequest } from "fastify"
import { Character, Image, User } from "../../../models"
import Artwork from "../../../models/Artwork"
import { Comment } from "../../../models/Comments"

export const uploadArt = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = request.user as { profileId: string }
    const { characterId } = request.params as { characterId: string }
    const { title, description, imageUrl, userAsArtist, tags } = request.body as {
        title: string
        description: string
        imageUrl: string
        userAsArtist: boolean
        tags: string[]
    }

    const character = await request.server.db.getRepository(Character).findOne({
        where: { id: characterId }
    })

    if (!character) {
        return reply.code(404).send({ error: "Character not found" })
    }

    const user = await request.server.db.getRepository(User).findOne({
        where: { id: profileId }
    })

    if (!user) {
        return reply.code(404).send({ error: "User not found" })
    }

    const image = await request.server.db.getRepository(Image).findOne({
        where: { url: imageUrl }
    })

    if (!image) {
        return reply.code(404).send({ error: "Image not found" })
    }


    const artwork = await request.server.db.getRepository(Artwork).save({
        title: title,
        description: description,
        artist: userAsArtist ? user : null,
        tags: tags,
        owner: user,
        artworkUrl: image.url,
    })

    

    if (!artwork) {
        return reply.code(500).send({ error: "Error uploading artwork" })
    }

    artwork.charactersFeatured = [character]
    await request.server.db.getRepository(Artwork).save(artwork)

    // if (!character.artworks) {
    //     character.artworks = []
    // }

    // character.artworks.push(artwork)
    // await request.server.db.getRepository(Character).save(character)

    return reply.code(200).send({ message: "Artwork uploaded", id: artwork.id })
}

export const getCharacterArtwork = async (request: FastifyRequest, reply: FastifyReply) => {
    const { characterName, ownerHandle } = request.params as { characterName: string, ownerHandle: string }
    const character = await request.server.db.getRepository(Character).findOne({
        relations: {
            owner: true,
            artworks: true,
        },
        where: { name: characterName, owner: { handle: ownerHandle } }
    })


    if (!character) {
        return reply.code(404).send({ error: "Character not found" })
    }

    console.log(character.artworks)

    const artwork = await request.server.db.getRepository(Artwork).find({
        relations: {
            owner: true,
            charactersFeatured: true,
            artist: true,
            comments: true
        },
        where: {
            charactersFeatured: { id: character.id },
            owner: {
                id: character.owner.id
            },
        }
    })


    return reply.code(200).send(artwork)
}

export const getArtwork = async (request: FastifyRequest, reply: FastifyReply) => {
    const { artworkId } = request.params as { artworkId: string }
    const artwork = await request.server.db.getRepository(Artwork).findOne({
        relations: {
            owner: true,
            charactersFeatured: true,
            artist: true,
        },
        where: { id: artworkId }
    })

    if (!artwork) {
        return reply.code(404).send({ error: "Artwork not found" })
    }

    const comments = await request.server.db.getRepository(Comment).find({
        relations: {
            artwork: true,
            author: true
        },
        where: { artwork: { id: artworkId } }
    })


    return reply.code(200).send({ ...artwork, comments: comments })
}

export const commentArtwork = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { id: string; profileId: string }
    const { artworkId } = request.params as { artworkId: string }
    const { content } = request.body as { content: string }

    const artwork = await request.server.db.getRepository(Artwork).findOne({
        where: { id: artworkId }
    })

    const author = await request.server.db.getRepository(User).findOne({
        where: { id: user.profileId }
    })

    if (!artwork || !author) {
        return reply.code(404).send({ error: "Artwork not found" })
    }

    const comment = await request.server.db.getRepository(Comment).save({
        artwork: artwork,
        author: author,
        content: content,
    })

    if (!comment) {
        return reply.code(500).send({ error: "Error adding comment" })
    }

    return reply.code(200).send({ message: "Comment added" })
}