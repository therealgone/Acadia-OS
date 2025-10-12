import { LoginComponent } from "../../components/loginComponent";
import { getCookie } from "@/utils/getCookieServer";
import { redirect } from "next/navigation";
const page = async () => {
  const { token } = await getCookie();
  if (token) redirect("/app/timetable");
  return (
    <div className="">
     
      <div className="items-center justify-center w-full h-full"><LoginComponent  /></div>
      
    </div>
  );
};

export default page;
