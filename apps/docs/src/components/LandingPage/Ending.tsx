import Translate from '@docusaurus/Translate';

export default function Ending() {
  return (
    <div className='ending-container'>
      <div className='ending-bar'>
        <div className='ending-texts'>
          <div className='ending-title1'>
            <Translate description='Are you ready to use the'>ending.ready.to.use</Translate>
          </div>
          <div className='ending-title2'>
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
