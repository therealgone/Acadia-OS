import Header from "@/app/components/header";
import { LoginComponent } from "../../components/loginComponent";
import { getCookie } from "@/utils/getCookieServer";
import { redirect } from "next/navigation";
const page = async () => {
  const { token } = await getCookie();
  if (token) redirect("/app/timetable");
  return (
    <div className="w-dvw h-dvh flex flex-col justify-center items-center overflow-hidden">
      <Header value="login" />
      <div className="items-center justify-center w-full h-full"><LoginComponent  /></div>
      
    </div>
  );
};

export default page;
