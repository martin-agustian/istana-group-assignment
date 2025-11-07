import { NextResponse } from "next/server";

import z from "zod";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/schemas/loginSchema";

import { authOptions } from "@/lib/auth";
import { getError } from "@/commons/helper";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validate = loginSchema.safeParse(body);
    if (!validate.success) {
      return NextResponse.json({ error: z.flattenError(validate.error) }, { status: 400 });
    }

    const { email, password } = body;

    const credentialsProvider = authOptions.providers.find(
      (p) => p.id === "credentials"
    );
    if (!credentialsProvider) {
      return NextResponse.json({ error: "Credentials provider not found" }, { status: 500 });
    }

    const user = await credentialsProvider.options.authorize({ email, password }, body);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 500 });
    }

    let token = {};
    if (authOptions.callbacks?.jwt) {
      token = await authOptions.callbacks.jwt({
        token: user,
        user,
        account: null,
        profile: undefined,
        isNewUser: false,
      });
    }

    const signedJwt = jwt.sign(token, process.env.NEXTAUTH_SECRET ?? "", {
      expiresIn: "1h",
    });

    return NextResponse.json({ user, accessToken: signedJwt }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: getError(err) }, { status: 500 });
  }
}