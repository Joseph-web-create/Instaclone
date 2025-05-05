import { Outlet } from "react-router";
import SideBar from "../componet/SideBar";
import Nav from "../componet/Nav";
import Footer from "../componet/Footer";

export default function RootLayout() {
  return (
    <section>
      <Nav />
      <SideBar />
      <div className="md:ml-[220px] xl:ml-[240px] min-h-screen mt-14 md:mt-0">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </div>
      <Footer />
    </section>
  );
}
