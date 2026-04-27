import { Request, Response } from "express";
import { prisma } from "./../services/prismaInit";

export const getPropertiesUser = async (req: Request, res: Response) => {
    const limit = req.query.limit;
    const sort = req.query.sort;
    const distance = req.query.distance;
    // parameters

    const properties = await prisma.property.findMany();
    console.log(properties);
    res.send("yo");
}

export const getPropertiesHost = async (req: Request, res: Response) => {
    const limit = req.query.limit;
    const sort = req.query.sort;
    const distance = req.query.distance;
    // parameters

    const properties = await prisma.property.findMany();
    console.log(properties);
    res.send("yo");
}

export const createProperty = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }

    const userID: number = req.user?.id;
    const propertyName: string = req.body.name;
    const address = req.body.address;
    const rating = req.body.rating ?? null
    const propertyTypeId = req.body.type;
    const propertyDescription = req.body.propertyDescription;
    const ownerDescription = req.body.ownerDescription ?? "";
    const surroundingsDescription = req.body.surroundingsDescription ?? "";
    const amenities = req.body.amenities;
    const spokenLanguages = req.body.spokenLanguages;
    const images = req.body.images; // to change
    const rooms = req.body.rooms;

    const property = await prisma.property.create({
        data: {
            name: propertyName,
            rating,
            propertyTypeId,
            propertyDescription,
            ownerDescription,
            surroundingsDescription,
            statusId: 2,
            ownerId: userID,
            address: {
                create: {
                    latitude: address.latitude,
                    longitude: address.longitude,
                    country: address.country,
                    state: address.state,
                    city: address.city,
                    postalCode: address.postalCode,
                    street: address.street
                }
            },
            amenities: {
                create: amenities.map(amenityID => ({amenityTypeId: amenityID}))
            },
            spokenLanguages: {
                create: spokenLanguages.map(languageID => ({languageTypeId: languageID}))
            },
            images: {
                create: images.map(img => ({path: img.path, isMain: img.isMain ?? false}))
            }
        }
    });

    for (const room of rooms) {
        const count = room.count ?? 1;
        const validAmenities = room.amenities.filter((id: number) => id >= 1 && id <= 31);

        for (let i = 0 ; i < count ; i++) {
            await prisma.room.create({
                data: {
                    name: room.name,
                    propertyId: property.id,
                    capacity: room.capacity,
                    area: room.area,
                    smokingAllowed: room.smokingAllowed,
                    bathroomPrivate: room.bathroomPrivate,
                    beds: {
                        create: room.beds.map(bed => ({typeId: bed.type, count: bed.count ?? 1}))
                    },
                    amenities: {
                        create: validAmenities.map(amenityId => ({amenityTypeId: amenityId}))
                    },
                    pricing: room.pricing ? {
                        create: {price: room.pricing.price}
                    } : undefined
                }
            })
        }
    }

    res.json({message: "Property added successfully"});
}

export const deleteProperty = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }

    const propertyID = parseInt(req.params.id);

    const property = await prisma.property.findUnique({where: {id: propertyID}});

    if (!property || property.ownerId != req.user.id) {
        return res.status(404).json({message: `Property with id ${propertyID} not found or not yours`});
    }

    //email users who booked

    await prisma.property.delete({where: {id: propertyID}});
    res.json({message: `Property successfully deleted.`});
}

export const changePropertyStatus = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }

    const propertyID = parseInt(req.params.id);

    const statusId = req.body.statusId;
    if (!statusId) {
        return res.status(401).json({message: "No status ID specified"});
    }

    const status = await prisma.propertyStatus.findUnique({where: {id: statusId}});
    if (!status) {
        return res.status(400).json({message: "Invalid status ID"});
    }

    const property = await prisma.property.findUnique({where: {id: propertyID}, select: {ownerId: true}});

    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyID} not found or not yours`});
    }

    if (property.ownerId != req.user.id) {
        return res.status(404).json({message: `Property with id ${propertyID} not found or not yours`});
    }

    await prisma.property.update({
        where: {id: propertyID},
        data: {statusId: statusId}
    });

    res.json({message: `Property status changed to ${status.name}`});

}

// app.put("/properties/:id", authenticate, authorize(["host"]), async (req, res) => {
//     if (!req.user) {
//         return res.status(401).json({message: "Invalid user"});
//     }


// })

export const getProperty = async (req: Request, res: Response) => {
    
    const propertyID = parseInt(req.params.id);
    
    const property = await prisma.property.findUnique({
        where: {id: propertyID},
        include: {
            status: true,
            type: true,
            propertyTypeId: false,
            statusId: false,
            address: {
                select: {
                    propertyId: false
                }
            },
            spokenLanguages: {
                select: {
                    languageType: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            images: {
                select: {
                    id: true,
                    isMain: true,
                    path: true
                }
            },
            amenities: {
                select: {
                    amenityType: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            reviews: {
                select: {
                    id: true,
                    rating: true,
                    content: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            rooms: {
                select: {
                    id: true,
                    name: true,
                    capacity: true,
                    area: true,
                    smokingAllowed: true,
                    bathroomPrivate: true,
                    beds: {
                        select: {
                            id: true,
                            count: true,
                            type: true,
                        }
                    },
                    amenities: {
                        select: {
                            amenityType: {
                                select: {
                                    id: true,
                                    name: true,
                                    category: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyID} not found`});
    }

    if (property.status.id != 1) {
        return res.status(404).json({message: `Property with id ${propertyID} not found`});
    }

    res.json(property);
}

export const getPropertyHost = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }
    
    const propertyID = parseInt(req.params.id);
    
    const property = await prisma.property.findUnique({
        where: {id: propertyID},
        include: {
            status: true,
            type: true,
            propertyTypeId: false,
            statusId: false,
            address: {
                select: {
                    id: true,
                    latitude: true,
                    longitude: true,
                    country: true,
                    state: true,
                    city: true,
                    postalCode: true,
                    street: true,
                }
            },
            spokenLanguages: {
                select: {
                    languageType: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            images: {
                select: {
                    id: true,
                    isMain: true,
                    path: true
                }
            },
            amenities: {
                select: {
                    amenityType: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            reviews: {
                select: {
                    id: true,
                    rating: true,
                    content: true,
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            },
            rooms: {
                select: {
                    id: true,
                    name: true,
                    capacity: true,
                    area: true,
                    smokingAllowed: true,
                    bathroomPrivate: true,
                    beds: {
                        select: {
                            id: true,
                            count: true,
                            type: true,
                        }
                    },
                    amenities: {
                        select: {
                            amenityType: {
                                select: {
                                    id: true,
                                    name: true,
                                    category: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyID} not found or not yours`});
    }

    if (property.ownerId != req.user.id) {
        return res.status(401).json({message: `Property with id ${propertyID} not found or not yours`})
    }

    res.json(property);
}

export const updatePropertyDetails = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }
    
    const {
        name,
        propertyDescription,
        ownerDescription,
        surroundingsDescription,
        rating,
        statusId,
        propertyTypeId
    } = req.body;

    const propertyID = parseInt(req.params.id);
    const property = await prisma.property.findUnique({where: {id: propertyID}});

    if (!property || property.ownerId != req.user.id) {
        return res.status(404).json({message: `Property with id ${propertyID} not found or not yours`});
    }

    const status = await prisma.propertyStatus.findUnique({where: {id: statusId}});
    if (!status) {
         return res.status(404).json({message: `Property status with id ${statusId} not found`});
    }

    const propertyType = await prisma.propertyType.findUnique({where: {id: propertyTypeId}});
    if (!propertyType) {
         return res.status(404).json({message: `Property type with id ${propertyTypeId} not found`});
    }

    let fixedRating = rating;
    if (rating !== undefined) {
        fixedRating = rating === null ? null : parseInt(rating)       
    }

    await prisma.property.update({
        where: {id: propertyID},
        data: {
            ...(name && {name}),
            ...(propertyDescription && {propertyDescription}),
            ...(ownerDescription && {ownerDescription}),
            ...(surroundingsDescription && {surroundingsDescription}),
            ...(rating !== undefined && {rating: fixedRating}),
            ...(propertyTypeId && {propertyTypeId})
        }
    })

    res.json({message: `Successfully modified property ${propertyID}`});

}

export const updatePropertyAddress = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }

    const propertyID = parseInt(req.params.id);
    const property = await prisma.property.findUnique({where: {id: propertyID}, include: {address: true}});

    if (!property || property.ownerId != req.user.id) {
        return res.status(404).json({message: `Property with id ${propertyID} not found or not yours`});
    }

    const {
        latitude,
        longitude,
        country,
        state,
        city,
        postalCode,
        street
    } = req.body;

    await prisma.address.update({
        where: {id: property.address?.id},
        data: {
            ...(latitude && {latitude}),
            ...(longitude && {longitude}),
            ...(country && {country}),
            ...(state && {state}),
            ...(city && {city}),
            ...(postalCode && {postalCode}),
            ...(street && {street}),
        }
    })

    res.json({message: `Successfully updated address for property ${property.name}`})
}

export const updatePropertyAmenities = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({message: "Invalid user"});
    }

    const propertyID = parseInt(req.params.id);
    const property = await prisma.property.findUnique({where: {id: propertyID}});

    if (!property || property.ownerId != req.user.id) {
        return res.status(404).json({message: `Property with id ${propertyID} not found or not yours`});
    }

    const amenities: number[] = req.body.amenities;
    const validAmenities = [];
    for (const amenityID of amenities) {
        const amenity = await prisma.propertyAmenityType.findUnique({where: {id: amenityID}});
        if (amenity) {
            validAmenities.push(amenityID);
        }
    }

    await prisma.$transaction([
        prisma.propertyAmenity.deleteMany({
            where: {
                propertyId: propertyID,
                amenityTypeId: {notIn: validAmenities}
            }
        }),
        prisma.propertyAmenity.createMany({
            data: validAmenities.map(amenityID => ({
                propertyId: propertyID, 
                amenityTypeId: amenityID
            })),
            skipDuplicates: true
        })
    ])

    res.json({message: `Successfully updated amenities for property ${property.name}`})
}

export const getPropertyRooms = async (req: Request, res: Response) => {
    
    const propertyID = parseInt(req.params.id);

    const property = await prisma.property.findUnique({where: {id: propertyID}, include: {rooms: true}});

    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyID} not found`});
    }

    res.json(property.rooms);
}

export const getPropertyReviews = async (req: Request, res: Response) => {
    
    const propertyID = parseInt(req.params.id);

    const property = await prisma.property.findUnique({where: {id: propertyID}, include: {reviews: true}});

    if (!property) {
        return res.status(404).json({message: `Property with id ${propertyID} not found`});
    }

    res.json(property.reviews);
}

export const getPropertyTypes = async (req: Request, res: Response) => {
    const types = await prisma.propertyType.findMany();
    res.json(types);
}