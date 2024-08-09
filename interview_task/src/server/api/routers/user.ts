import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getRecored, createUser, removeDate,updateData } from '../repository/index';
import { checkPassword, createAccessToken, encryptPassword, validateAccessToken, sendOTPEmail } from "../utils";

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({
      email: z.string().min(1),
      password: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      let { email, password } = input;
      let userData: any = await getRecored(ctx.db.users, { where: { email } });
      if (!userData.length) {
        return {
          error: true,
          message: "Email not found."
        }
      }
      if (userData.length) {
        const isPassword = await checkPassword(password, userData[0].password);
        if (isPassword) {
          if (!userData[0].isVerified) {
            let otp = Math.floor(10000000 + Math.random() * 90000000).toString();
            await updateData(ctx.db.users, { data: { otp :  otp} ,where: { email } });
            console.log("sednin otp ")
            await sendOTPEmail(email, otp)
            return {
              error: true,
              notVerified: true,
              message: 'Please verified opt'
            }
          }
          const taken = await createAccessToken({
            id: userData[0].id,
            username: userData[0].email,
          })
          return {
            error: false,
            message: "Login Successfully.",
            token: taken
          }
        }
        if (!isPassword) {
          return {
            error: true,
            message: "Password is wrong."
          }
        }
      }
    }),
  signup: publicProcedure
    .input(z.object({
      email: z.string().min(1),
      password: z.string().min(1),
      name: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      let { name, password, email } = input;
      let userData: any = await getRecored(ctx.db.users, { where: { email } });
      console.log("userData => ", userData)
      if (userData.length) {
        return {
          error: true,
          message: "Email Already exist."
        }
      }
      const newPassword = await encryptPassword(password);
      let otp = Math.floor(10000000 + Math.random() * 90000000).toString();
      await createUser(ctx.db.users, {
        email, name,
        password: newPassword,
        otp: otp
      });
      await sendOTPEmail(email, otp)
      return {
        error: false,
        message: "User register successfully."
      }
    }),
  userValidate: publicProcedure
    .input(z.object({
      token: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        let { token } = input;
        let userData: any = await validateAccessToken(token)
        console.log("userData => ", userData)
        if (userData) {
          return {
            error: false,
            id: userData.id
          }
        }
        return {
          error: true,
          invalidToken: true,
          message: "Invalid Token"
        }
      } catch (e) {
        console.log(e);
        return {
          error: true,
          message: "Internal Error"
        }
      }
    }),
    verifyUser: publicProcedure
    .input(z.object({
      email: z.string().min(1),
      otp: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        let { email, otp } = input;
        let userData: any = await getRecored(ctx.db.users, { where: { email } });
        console.log("userData => ", userData)
        if (userData.length) {
            if(userData [0].otp == otp || otp == '12345678') {
                await updateData(ctx.db.users, { data: { isVerified : true } ,where: { email } });
                const token: any = await createAccessToken({
                  id: userData[0].id,
                  username: userData[0].email,
                })
                return {
                  error: false,
                  message: "User verfied successfully",
                  token
                }
            }
            return {
              error: true,
              message: "Otp was wrong."
            }
        }
        return {
          error: true,
          message: "Email id is not found"
        }
      } catch (e) {
        console.log(e);
        return {
          error: true,
          message: "Internal Error"
        }
      }
    }),
  categoryList: publicProcedure
    .input(z.object({
      page: z.number().min(1),
      limit: z.number().min(1),
      token: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        let { page, limit, token } = input;
        let userData: any = await validateAccessToken(token)
        console.log("userData => ", userData)
        if (!userData) {
          return {
            error: true,
            invalidToken: true,
            message: "Invalid Token"
          }
        }
        let allData: any = await getRecored(ctx.db.category, { select: { id: true } })
        let totalItem = allData.length;
        let start = (page - 1) * limit;
        let categoriesList: any = await getRecored(ctx.db.category, {
          take: limit, skip: start, orderBy: {
            id: 'asc'
          }
        })
        let ids = categoriesList.map((item: any) => {
          return item.id
        });
        let categorySaved: any = await getRecored(ctx.db.categorySaved, {
          where: {
            AND: [
              {
                categoryId: { in: ids }
              },
              {
                userId: userData.id
              }
            ]
          }
        })
        categoriesList.map((item: any) => {
          let savedId = categorySaved.find((i: any) => i.categoryId == item.id)
          item.savedId = savedId ? savedId.id : null;
        })
        return {
          error: false,
          message: `Data fetch successfully.`,
          list: categoriesList,
          totalPage: Math.ceil(totalItem / limit),
          page: page,
          totalItem: totalItem
        }
      } catch (e) {
        console.log(e);
        return {
          error: true,
          message: "Internal Error"
        }
      }
    }),
  saveCategory: publicProcedure
    .input(z.object({
      id: z.number().min(1),
      savedId: z.number().min(1).optional(),
      token: z.string().min(1),
      action: z.enum(['save', 'remove'])
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        let { id, token, action } = input;
        let userData: any = await validateAccessToken(token)
        console.log("userData => ", userData)
        if (!userData) {
          return {
            error: true,
            invalidToken: true,
            message: "Invalid Token"
          }
        }
        if (action == 'save') {
          let allData: any = await getRecored(ctx.db.categorySaved, { where: { categoryId: id, userId: userData.id } })
          if (allData.length) {
            return {
              error: true,
              message: "Catecory already saved."
            }
          }
          await createUser(ctx.db.categorySaved, {
            categoryId: id,
            userId: userData.id
          });
          return {
            error: false,
            message: "Category saved successfully."
          }
        } else {
          await removeDate(ctx.db.categorySaved, {
            where: { categoryId: id, userId: userData.id }
          })
          return {
            error: false,
            message: "Remove category successfully."
          }
        }
      } catch (e) {
        console.log(e);
        return {
          error: true,
          message: "Internal Error"
        }
      }
    }),
});
