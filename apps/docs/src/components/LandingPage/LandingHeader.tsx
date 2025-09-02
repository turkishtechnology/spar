import { useColorMode } from '@docusaurus/theme-common';
export default function LandingHeader() {
  const color = useColorMode().colorMode === 'light' ? 'black' : 'white';
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-8'>
        <div className='flex justify-center p-2 gap-6'>
          <div>WHAT'S NEW</div>
          <div className='w-px h-6 bg-[#E1E4EA] mx-1' />
          <div className='flex gap-1'>
            <div>Faster insights with five new features</div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M16.1194 11.0039H5.10938C4.55937 11.0039 4.10938 11.4539 4.10938 12.0039C4.10938 12.5539 4.55937 13.0039 5.10938 13.0039H16.1194V14.7939C16.1194 15.2439 16.6594 15.4639 16.9694 15.1439L19.7494 12.3539C19.9394 12.1539 19.9394 11.8439 19.7494 11.6439L16.9694 8.85392C16.6594 8.53392 16.1194 8.76392 16.1194 9.20392V11.0039Z'
                fill={color}
              />
            </svg>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-3'>
        <div className='flex gap-3'>
          <div className='text-7xl font-semibold'> Build</div>
          <div className='text-7xl font-semibold text-white bg-[#C90019]'>faster</div>
        </div>
        <div className='flex gap-3'>
          <div className='text-7xl font-semibold'>with</div>
          <div className='text-7xl font-semibold text-white bg-[#C90019]'>Takeoff's</div>
        </div>
        <div className='flex gap-3 text-7xl'>
          <div className='text-7xl font-semibold text-white bg-[#C90019]'>Headless</div>
          <div className='text-7xl font-semibold'>UI system</div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-8'>
        <div className='flex font-light text-center'>
          Open-source library with unstyled, primitive components, with a collection of styled
          examples that you can copy and paste into your apps.
        </div>
        <div className='flex border-solid border-[1px] border-gray-300 rounded-lg p-2'>
          <button>Get Started</button>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M6.29148 6.70898C6.29148 7.25898 6.74148 7.70898 7.29148 7.70898H14.8815L6.00148 16.589C5.61148 16.979 5.61148 17.609 6.00148 17.999C6.39148 18.389 7.02148 18.389 7.41148 17.999L16.2915 9.11898V16.709C16.2915 17.259 16.7415 17.709 17.2915 17.709C17.8415 17.709 18.2915 17.259 18.2915 16.709V6.70898C18.2915 6.15898 17.8415 5.70898 17.2915 5.70898H7.29148C6.74148 5.70898 6.29148 6.15898 6.29148 6.70898Z'
              fill={color}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
