import { SOCIALS } from './Socials'

export const FooterSlim = () => {
  return (
    <div className="mt-14 w-full px-4 py-4">
      <div className="flex flex-col items-center justify-between gap-8 rounded-xl py-4 px-8 md:flex-row">
        <div className="flex gap-5 text-2xl text-gray-200 md:text-lg">
          {Object.entries(SOCIALS).map(([id, { icon, link }]) => {
            return (
              <a
                key={id}
                href={link}
                target="_blank"
                rel="noreferrer"
                className={`transition-colors hover:text-primary`}
              >
                {icon}
              </a>
            )
          })}
        </div>
        <div className="leading-normal gap-[2.75rem] text-center text-base text-medium-2 md -2 md:text-left">

          <a
            href="https://nukepad.io"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer transition-colors hover:text-primary"
          >
           <p style={{fontSize: "10px"}} leading-6>Powered By</p><b style={{color: "#ffffff"}}>NUKE Labs</b>
          </a>
        </div>
      </div>
    </div>
  )
}
