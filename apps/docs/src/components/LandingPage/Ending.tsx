import Translate from '@docusaurus/Translate';

export default function Ending() {
  return (
    <div className='flex flex-col w-full'>
      <div className='flex w-full justify-between w-full bg-[#C90019]'>
        <div className='flex-col self-end'>
          <div className='text-4xl text-[#eeb0b8] font-semibold'>
            <Translate description='Are you ready to use the'>ending.ready.to.use</Translate>
          </div>
          <div className='text-4xl text-white font-semibold'>
            <Translate description='headless Takeoff UI library?'>
              ending.headless.library
            </Translate>
          </div>
        </div>
        <div>
          <img src='img/red_vector.png' />
        </div>
      </div>
    </div>
  );
}
