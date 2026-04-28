import { Request, Response } from "express";
import { prisma } from "./../services/prismaInit";
import { isMainThread } from "worker_threads";

export const uploadImages = async (req: Request, res: Response) => {
    
    const files = (req as any).files as Express.Multer.File[];

    if (!files || files.length == 0) {
        return res.status(400).json({message: "No images uploaded"});
    }

    const imageUrls = files.map(file => ({
        url: `/uploads/${file.filename}`,
        originalName: file.originalname
    }));

    res.json({images: imageUrls});
}

export const deleteImage = async (req: Request, res: Response) => {
    const imageId = res.locals.params.id;

    const image = await prisma.image.findUnique({where: {id: imageId}, include: {property: true}});
    if (!image || image.property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Image with id ${imageId} not found or not yours`});
    }

    if (image.isMain) {
        const successor = await prisma.image.findFirst({
            where: {
                propertyId: image.propertyId, 
                id : {not: imageId}
            },
            orderBy: {id: 'asc'}
        })

        if (successor) {
            await prisma.image.update({
                where: {id: successor.id},
                data: {isMain: true}
            })
        }
    }

    await prisma.image.delete({where: {id: imageId}})
    res.json({message: `Successfully deleted image`});
}

export const setImageMain = async (req: Request, res: Response) => {
    const imageId = res.locals.params.id;

    const image = await prisma.image.findUnique({where: {id: imageId}, include: {property: true}});
    if (!image || image.property.ownerId != (req as any).user.id) {
        return res.status(404).json({message: `Image with id ${imageId} not found or not yours`});
    }

    await prisma.$transaction([
        prisma.image.updateMany({where: {isMain: true, propertyId: image.propertyId}, data: {isMain: false}}),
        prisma.image.update({where: {id: imageId}, data: {isMain: true}})
    ]);

    res.json({message: `Successfully set image to main`});
}

export const getPropertyImages = async (req: Request, res: Response) => {
    const propertyId = res.locals.params.id;

    const property = await prisma.property.findUnique({where: {id: propertyId}});
    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyId} not found`});
    }

    const images = await prisma.image.findMany({where: {propertyId: propertyId}});

    res.json(images);
}