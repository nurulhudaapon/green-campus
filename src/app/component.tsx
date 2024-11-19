import { UserCircle } from "lucide-react";
import { logout } from "./action";
import { getStudentInfo } from "./(main)/profile/action";

export async function HeaderProfile() {
    const profile = await getStudentInfo();

    if (profile.error) return null;

    console.log(profile);

    return (
        <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle className="h-8 w-8" />
          <div className="hidden text-sm md:block">
            <p className="font-medium">{profile.email}</p>
          </div>
        </div>
        <form action={logout}>
          <button
              type='submit'
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
                Logout
            </button>
        </form>
      </div>
    )
}