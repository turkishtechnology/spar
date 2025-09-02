import Translate from '@docusaurus/Translate';

export default function Theming() {
  return (
    <div className='flex justify-center mx-28'>
      <div className='flex flex-col mb-16 mt-8 gap-12'>
        <div className='flex flex-col items-center gap-8'>
          <div className='flex gap-1'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10.3369 9.54959L7.67029 11.6674V12.7104C7.67029 12.8369 7.8057 12.9173 7.91676 12.8567L9.90267 11.7735C10.1704 11.6275 10.3369 11.3469 10.3369 11.0419V9.54959ZM6.67029 11.6331L4.37058 9.33344H3.29332C2.40775 9.33344 1.84505 8.38555 2.26911 7.60811L3.35232 5.62221C3.67359 5.03323 4.2909 4.66677 4.9618 4.66677H7.27162C9.011 2.81576 10.9533 1.55946 13.4645 1.36094C14.1381 1.30769 14.696 1.86566 14.6428 2.53922C14.4442 5.05044 13.1879 6.99272 11.3369 8.7321V11.0419C11.3369 11.7128 10.9705 12.3302 10.3815 12.6514L8.39562 13.7346C7.61818 14.1587 6.67029 13.596 6.67029 12.7104V11.6331ZM6.45413 5.66677H4.9618C4.65685 5.66677 4.37625 5.83334 4.23022 6.10106L3.14699 8.08696C3.08641 8.19803 3.16681 8.33344 3.29332 8.33344H4.33629L6.45413 5.66677Z'
                fill='#C90019'
              />
              <path
                d='M1.33594 12.7961C1.33594 11.7632 2.17333 10.9258 3.20631 10.9258C4.23929 10.9258 5.07668 11.7632 5.07668 12.7961C5.07668 13.8291 4.23929 14.6665 3.20631 14.6665H1.83594C1.5598 14.6665 1.33594 14.4427 1.33594 14.1665V12.7961Z'
                fill='#C90019'
              />
            </svg>
            <div>
              <Translate description='THEMES'>theming.themes</Translate>
            </div>
          </div>
          <div className='flex gap-3'>
            <div className='text-5xl font-semibold text-[#C90019] underline'>
              <Translate description='Simple'>theming.simple</Translate>
            </div>
            <div className='text-5xl font-semibold'>
              <Translate description='Development'>theming.development</Translate>
            </div>
          </div>
          <div className='flex font-light text-[#525866]'>
            <Translate description='Built for the modern user interfaces to engage users'>
              theming.description
            </Translate>
          </div>
          <div className='bg-[#C90019] flex items-center justify-center rounded-lg p-2 w-[140px]'>
            <button className='text-white'>
              <Translate description='Try It Now'>theming.try.it.now</Translate>
            </button>
          </div>
        </div>
        <div className='flex'>
          <img src='img/Topbar.png'></img>
        </div>
      </div>
    </div>
  );
}
