import Logo from "../assets/logo_instagram.png";

export default function SideBar() {
  return (
    <div className="hidden md:block min-h-screen fixed z-50 border-r border-gray-200 w-[220px] xl:w-[240px]">
      <div className="flex flex-col min-h-screen justify-between py-6 px-4 items-center">
        <div>
          <div className="flex gap-3 items-center mb-10">
            <img src={Logo} className="w-[40px]" />
            <h1 className="text-2xl font-bold italic">InstaShot</h1>
          </div>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
