import { error } from "node:console";
import { prisma } from "../lib/prisma";
import { USERROLE } from "../middlewere/auth";
import { METHODS } from "node:http";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: USERROLE.ADMIN,
      password: process.env.ADMIN_PASSWORD,
      emailVerified: true,
    };
    //check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });
    if (existingUser) {
      throw new Error("User Alreadt Exists");
    }
    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email as string,
        },
        data: {
          emailVerified: true,
        },
      });
    }
    console.log(signUpAdmin);
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
