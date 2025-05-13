import { WelcomeVoiceComponent } from '../../components/voice/WelcomeVoiceComponent';
import { RiUserVoiceLine } from "react-icons/ri";
import { PiDeviceMobileCamera } from "react-icons/pi";

function Screen() {
  return (
    <div className='min-h-svh'>
      <div className='flex flex-col gap-8 justify-center items-center h-screen'>
        <p className='text-stone-300 tracking-wider text-4xl xl:text-4xl font-bold'>Bienvenido</p>
        <div className='flex flex-row gap-2'>
          <div className='flex flex-col justify-center items-center gap-4'>
            <RiUserVoiceLine className='text-stone-300' size={48} />
            <div>
              <p className='tracking-wider text-xs text-center text-stone-300 break-all'>Reconocimiento</p>
              <p className='tracking-wider text-xs text-center text-stone-300 break-all'>de voz</p>
            </div>
          </div>
          <span className='text-4xl text-stone-300'>|</span>
          <div className='flex flex-col justify-center items-center gap-4'>
            <PiDeviceMobileCamera className='text-stone-300' size={48} />
            <div>
              <p className='tracking-wider text-xs text-center text-stone-300'>Reconocimiento</p>
              <p className='tracking-wider text-xs text-center text-stone-300'>de objetos</p>
            </div>
          </div>
        </div>
        <WelcomeVoiceComponent />
      </div>
    </div>
  )
}

export default Screen;