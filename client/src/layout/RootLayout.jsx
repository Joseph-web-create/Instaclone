import { Outlet } from "react-router";
import SideBar from "../componet/SideBar";

export default function RootLayout() {
  return (
    <section>
      <SideBar />
      <div className="md:ml-[220px] xl:ml-[240px] min-h-screen">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
