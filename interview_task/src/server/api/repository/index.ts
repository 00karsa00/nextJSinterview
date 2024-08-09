
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
export const getRecored = (table: any, item: any) => {
    return new Promise(async(resolve, reject) => {
        try {
            // prisma.users
            let data: any = {};
            if(item.select) data.select = item.select ;
            if(item.where) data.where = item.where;
            if(item.take) data.take = item.take;
            if(item.skip) data.skip = item.skip;
            if(item.orderBy) data.orderBy = item.orderBy;
            if(item.include) data.include = item.include;
            console.log("data 1 => ",JSON.stringify(data))
            const result = await table.findMany(data);
            resolve(result);
        } catch(error) {
            reject(error)
        }
    })
}

export const createUser = (table: any, item: any) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await table.create({ data: item});
            resolve(result);
        } catch(error) {
            reject(error)
        }
    })
}

export const removeDate = (table: any, item: any) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await table.deleteMany(item);
            resolve(result);
        } catch(error) {
            reject(error)
        }
    })
}

export const updateData = (table: any, item: any) => {
    return new Promise(async(resolve, reject) => {
        try {
            const result = await table.update(item)
            resolve(result);
        } catch(error) {
            reject(error)
        }
    })
}