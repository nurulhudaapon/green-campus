"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL = "https://studentportal.green.edu.bd";

export async function data(path: string, options: RequestInit) {
  const cookieStore = await cookies();
  try {
    const authToken = cookieStore.get("auth");

    if (!authToken) {
      redirect("/login");
    }

    console.log({ authToken: authToken.value.slice(0, 50) });

    const response = await fetch(`${BASE_URL}/${path}`, {
      headers: {
        Cookie: authToken.value,
        ...options.headers,
      },
      ...options,
    });

    if (response.url.includes("/Account/login")) {
      // cookieStore.delete("auth");
      console.log("Session expired, redirecting to login");
      // redirect("/login?message=Session expired");
    }

    return response;
  } catch (error) {
    // TODO: Properly detect auth error
    const isAuthError = error instanceof Error && error.message.includes("401");
    if (isAuthError) {
      console.log("Session expired, redirecting to login");
      // Delete the auth cookie
      // cookieStore.delete("auth");

      // Redirect to login page
      redirect("/login");
    }

    // cookieStore.delete("auth");

    throw error;
  }
}
