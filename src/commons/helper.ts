import jwt from "jsonwebtoken";

export const getAuthorization = (req: Request) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return { error: "Missing Authorization header", user: null };
  }

  if (!authHeader.startsWith("Bearer ")) {
    return { error: "Invalid Authorization format", user: null };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    return { error: null, user: decoded };
  }
  catch (err) {    
    return { error: "Invalid or expired token", user: null };
  }
}

export const getError = (e: unknown) => {
  if (e instanceof Error) return e.message;
  else e;
}

export const formatNumber = (value: number | string): string => {
  const num = typeof value === "string" ? parseInt(value) : value;

  if (isNaN(num)) return "0";

  return num.toLocaleString("en-SG");
};

export const setCapitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}