import Link from "next/link";

export default function Header() {
  return (
    <div className="font-sans w-full h-[90px] text-white bg-black">
      <div className="h-full flex items-center justify-between px-[60px] py-0">
        <div className="h-full flex items-center select-none">
          <div className="flex items-end font-syne font-extrabold text-2xl leading-none text-white">
            <div className="logo-header-name">Nexora</div>
            <div className="text-[32px] text-[#6c63ff] relative top-[3px]">
              .
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[20px]">
          <div className="flex gap-[30px] text-base">
            <Link href="/" className="flex justify-center items-center">
              Inicio
            </Link>
            <Link href="#" className="flex justify-center items-center">
              Explorar
            </Link>
            <Link href="#" className="flex justify-center items-center">
              Mensajes
            </Link>
            <Link href="#" className="flex justify-center items-center">
              Perfil
            </Link>
          </div>
          <div className="h-[30px] flex justify-center items-center">
            <div className="w-[15px] flex justify-center items-center border-r-2 border-r-[gray] border-solid h-[16px]"></div>
          </div>
          <div className="flex gap-[10px]">
            <Link
              href="/login"
              className="text-white px-2.5 py-[5px] rounded-lg border border-[gray]"
            >
              Ingresar
            </Link>
            <Link
              href="/register"
              className="text-white px-2.5 py-[5px] rounded-[10px] bg-[#6c63ff]"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
