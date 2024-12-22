import { useEffect, useState } from "react";
import PageTitle from "../components/ui/PageTitle";
import TextInput from "../components/ui/TextInput";
import Dropdown from "../components/ui/Dropdown";
import { getUser } from "../api/user.api";
import useSession from "../hooks/useSession";
import { SESSION_ROLES } from "../constants/session";

function ProfilePage() {
  const [session] = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    getUser(session?.user?.id).then((res) => setUser(res.data));
  };

  const roles = Object.values(SESSION_ROLES)
    .filter((el) => el !== 3)
    .map((role) => ({
      value: role,
      label: role === 1 ? "Instructor" : "Student",
    }));

  return (
    <div>
      <PageTitle title="Profile" />

      {user && (
        <form className="w-full max-w-2xl mx-auto mt-12 2xl:mt-14">
          <div className="flex flex-col justify-center items-center gap-4 mb-8">
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
              <TextInput label="First Names" value={user.first_name} disabled />
              <TextInput label="Last Names" value={user.last_name} disabled />
            </div>

            <Dropdown label="User Type" value={user?.groups[0]} options={roles} disabled />

            <TextInput label="Username" value={user.username} disabled />
            <TextInput label="Date Joined" value={user?.date_joined?.slice(0, 10)} disabled />
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfilePage;
