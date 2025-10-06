import Header from "@/app/components/header";
import { LoginComponent } from "../../components/loginComponent";
import { getCookie } from "@/utils/getCookieServer";
import { redirect } from "next/navigation";
const page = async () => {
  const { token } = await getCookie();
  if (token) redirect("/app/timetable");
  return (
    <div className="w-dvw h-dvh flex flex-col overflow-hidden">
      <Header value="login" />
      <LoginComponent />
    </div>
  );
};

export default page;
