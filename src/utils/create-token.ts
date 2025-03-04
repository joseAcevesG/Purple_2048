import jwt from "jsonwebtoken";
import type { InputToken } from "../types";

export function code(data: InputToken): string {
	return jwt.sign(data, process.env.TOKEN_KEY);
}

export function decode(token: string) {
	try {
		return jwt.verify(token, process.env.TOKEN_KEY);
	} catch (_error) {
		return null;
	}
}
