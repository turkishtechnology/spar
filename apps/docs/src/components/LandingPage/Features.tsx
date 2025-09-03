import { useColorMode } from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';

export default function Features() {
  const color = useColorMode().colorMode === 'light' ? 'white' : 'black';
  return (
    <div
      className='flex my-16'
      style={{
        backgroundImage: "url('/img/Vector2.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='flex justify-center'>
        <div className='grid grid-cols-2 gap-6'>
          <div className='grid grid-rows-2 gap-6'>
            <div
              className=' flex border-solid border-[1px] border-gray-200 rounded-lg p-4'
              style={{ backgroundColor: color }}
            >
              <div className='flex gap-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <mask
                    id='mask0_1961_38711'
                    maskUnits='userSpaceOnUse'
                    x='0'
                    y='0'
                    width='32'
                    height='32'
                  >
                    <rect width='32' height='32' fill='#D9D9D9' />
                  </mask>
                  <g mask='url(#mask0_1961_38711)'>
                    <path
                      d='M14.1327 22.1333L23.5327 12.7333L21.666 10.8666L14.1327 18.4L10.3327 14.6L8.46602 16.4666L14.1327 22.1333ZM15.9993 29.3333C14.1549 29.3333 12.4216 28.9833 10.7993 28.2833C9.17713 27.5833 7.76602 26.6333 6.56602 25.4333C5.36602 24.2333 4.41602 22.8222 3.71602 21.2C3.01602 19.5777 2.66602 17.8444 2.66602 16C2.66602 14.1555 3.01602 12.4222 3.71602 10.8C4.41602 9.17774 5.36602 7.76663 6.56602 6.56663C7.76602 5.36663 9.17713 4.41663 10.7993 3.71663C12.4216 3.01663 14.1549 2.66663 15.9993 2.66663C17.8438 2.66663 19.5771 3.01663 21.1993 3.71663C22.8216 4.41663 24.2327 5.36663 25.4327 6.56663C26.6327 7.76663 27.5827 9.17774 28.2827 10.8C28.9827 12.4222 29.3327 14.1555 29.3327 16C29.3327 17.8444 28.9827 19.5777 28.2827 21.2C27.5827 22.8222 26.6327 24.2333 25.4327 25.4333C24.2327 26.6333 22.8216 27.5833 21.1993 28.2833C19.5771 28.9833 17.8438 29.3333 15.9993 29.3333ZM15.9993 26.6666C18.9771 26.6666 21.4993 25.6333 23.566 23.5666C25.6327 21.5 26.666 18.9777 26.666 16C26.666 13.0222 25.6327 10.5 23.566 8.43329C21.4993 6.36663 18.9771 5.33329 15.9993 5.33329C13.0216 5.33329 10.4993 6.36663 8.43268 8.43329C6.36602 10.5 5.33268 13.0222 5.33268 16C5.33268 18.9777 6.36602 21.5 8.43268 23.5666C10.4993 25.6333 13.0216 26.6666 15.9993 26.6666Z'
                      fill='#C90019'
                    />
                  </g>
                </svg>
                <div className='flex flex-col gap-1'>
                  <div className='flex text-2xl'>
                    <Translate description='WAI-ARIA Ready'>features.wai.aria.ready</Translate>
                  </div>
                  <div className='flex font-light text-[#717784]'>
                    <Translate description='Takeoff follows WAI-ARIA best practices description'>
                      features.wai.aria.description
                    </Translate>
                  </div>
                </div>
              </div>
            </div>
            <div
              className=' flex border-solid border-[1px] border-gray-200 rounded-lg p-4'
              style={{ backgroundColor: color }}
            >
              <div className='flex gap-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <mask
                    id='mask0_1961_38721'
                    maskUnits='userSpaceOnUse'
                    x='0'
                    y='0'
                    width='32'
                    height='32'
                  >
                    <rect width='32' height='32' fill='#D9D9D9' />
                  </mask>
                  <g mask='url(#mask0_1961_38721)'>
                    <path
                      d='M4.00065 26.6667C3.26732 26.6667 2.63954 26.4056 2.11732 25.8834C1.5951 25.3612 1.33398 24.7334 1.33398 24V8.00004C1.33398 7.26671 1.5951 6.63893 2.11732 6.11671C2.63954 5.59449 3.26732 5.33337 4.00065 5.33337H28.0007C28.734 5.33337 29.3618 5.59449 29.884 6.11671C30.4062 6.63893 30.6673 7.26671 30.6673 8.00004V24C30.6673 24.7334 30.4062 25.3612 29.884 25.8834C29.3618 26.4056 28.734 26.6667 28.0007 26.6667H4.00065ZM4.00065 24H28.0007V8.00004H4.00065V24ZM10.6673 22.6667H21.334V20H10.6673V22.6667ZM6.66732 18H9.33398V15.3334H6.66732V18ZM12.0007 18H14.6673V15.3334H12.0007V18ZM17.334 18H20.0007V15.3334H17.334V18ZM22.6673 18H25.334V15.3334H22.6673V18ZM6.66732 13.3334H9.33398V10.6667H6.66732V13.3334ZM12.0007 13.3334H14.6673V10.6667H12.0007V13.3334ZM17.334 13.3334H20.0007V10.6667H17.334V13.3334ZM22.6673 13.3334H25.334V10.6667H22.6673V13.3334Z'
                      fill='#C90019'
                    />
                  </g>
                </svg>
                <div className='flex flex-col gap-1'>
                  <div className='flex text-2xl'>
                    <Translate description='Full Keyboard Support'>
                      features.keyboard.support
                    </Translate>
                  </div>
                  <div className='flex font-light text-[#717784]'>
                    <Translate description='All Takeoff components support full keyboard interaction description'>
                      features.keyboard.description
                    </Translate>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-rows-2 gap-6'>
            <div
              className='flex border-solid border-[1px] border-gray-200 rounded-lg p-4'
              style={{ backgroundColor: color }}
            >
              <div className='flex gap-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                >
                  <mask
                    id='mask0_1961_38732'
                    maskUnits='userSpaceOnUse'
                    x='0'
                    y='0'
                    width='32'
                    height='32'
                  >
                    <rect width='32' height='32' fill='#D9D9D9' />
                  </mask>
                  <g mask='url(#mask0_1961_38732)'>
                    <path
                      d='M13.3333 30.6667V28H6.66667C5.93333 28 5.30556 27.7389 4.78333 27.2167C4.26111 26.6945 4 26.0667 4 25.3334V6.66671C4 5.93337 4.26111 5.3056 4.78333 4.78337C5.30556 4.26115 5.93333 4.00004 6.66667 4.00004H13.3333V1.33337H16V30.6667H13.3333ZM6.66667 25.3334H13.3333V22.6667H9.33333V20H13.3333V17.3334H9.33333V14.6667H13.3333V12H9.33333V9.33337H13.3333V6.66671H6.66667V25.3334ZM18.6667 6.66671V4.00004H25.3333C26.0667 4.00004 26.6944 4.26115 27.2167 4.78337C27.7389 5.3056 28 5.93337 28 6.66671V25.3334C28 26.0667 27.7389 26.6945 27.2167 27.2167C26.6944 27.7389 26.0667 28 25.3333 28H18.6667V25.3334H25.3333V6.66671H18.6667ZM18.6667 17.3334V14.6667H22.6667V17.3334H18.6667ZM18.6667 12V9.33337H22.6667V12H18.6667Z'
                      fill='#C90019'
                    />
                  </g>
                </svg>
                <div className='flex flex-col gap-1'>
                  <div className='flex text-2xl'>
                    <Translate description='Smart Focus Handling'>
                      features.focus.handling
                    </Translate>
                  </div>
                  <div className='flex font-light text-[#717784]'>
                    <Translate description='Focus management works as expected by default description'>
                      features.focus.description
                    </Translate>
                  </div>
                </div>
              </div>
            </div>
            <div
              className=' flex border-solid border-[1px] border-gray-200 rounded-lg p-4'
              style={{ backgroundColor: color }}
            >
              <div className='flex gap-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='30'
                  height='30'
                  viewBox='0 0 30 30'
                  fill='none'
                >
                  <path
                    d='M7.00065 29.6667H3.00065C2.26732 29.6667 1.63954 29.4056 1.11732 28.8834C0.595096 28.3612 0.333984 27.7334 0.333984 27V23H3.00065V27H7.00065V29.6667ZM23.0007 29.6667V27H27.0007V23H29.6673V27C29.6673 27.7334 29.4062 28.3612 28.884 28.8834C28.3618 29.4056 27.734 29.6667 27.0007 29.6667H23.0007ZM15.0007 23.6667C12.334 23.6667 9.91732 22.8778 7.75065 21.3C5.58398 19.7223 4.00065 17.6223 3.00065 15C4.00065 12.3778 5.58398 10.2778 7.75065 8.70004C9.91732 7.12226 12.334 6.33337 15.0007 6.33337C17.6673 6.33337 20.084 7.12226 22.2507 8.70004C24.4173 10.2778 26.0007 12.3778 27.0007 15C26.0007 17.6223 24.4173 19.7223 22.2507 21.3C20.084 22.8778 17.6673 23.6667 15.0007 23.6667ZM15.0007 21C16.9562 21 18.7451 20.4667 20.3673 19.4C21.9895 18.3334 23.234 16.8667 24.1007 15C23.234 13.1334 21.9895 11.6667 20.3673 10.6C18.7451 9.53337 16.9562 9.00004 15.0007 9.00004C13.0451 9.00004 11.2562 9.53337 9.63398 10.6C8.01176 11.6667 6.76732 13.1334 5.90065 15C6.76732 16.8667 8.01176 18.3334 9.63398 19.4C11.2562 20.4667 13.0451 21 15.0007 21ZM15.0007 19.6667C16.2895 19.6667 17.3895 19.2112 18.3007 18.3C19.2118 17.3889 19.6673 16.2889 19.6673 15C19.6673 13.7112 19.2118 12.6112 18.3007 11.7C17.3895 10.7889 16.2895 10.3334 15.0007 10.3334C13.7118 10.3334 12.6118 10.7889 11.7007 11.7C10.7895 12.6112 10.334 13.7112 10.334 15C10.334 16.2889 10.7895 17.3889 11.7007 18.3C12.6118 19.2112 13.7118 19.6667 15.0007 19.6667ZM15.0007 17C14.4451 17 13.9729 16.8056 13.584 16.4167C13.1951 16.0278 13.0007 15.5556 13.0007 15C13.0007 14.4445 13.1951 13.9723 13.584 13.5834C13.9729 13.1945 14.4451 13 15.0007 13C15.5562 13 16.0284 13.1945 16.4173 13.5834C16.8062 13.9723 17.0007 14.4445 17.0007 15C17.0007 15.5556 16.8062 16.0278 16.4173 16.4167C16.0284 16.8056 15.5562 17 15.0007 17ZM0.333984 7.00004V3.00004C0.333984 2.26671 0.595096 1.63893 1.11732 1.11671C1.63954 0.594485 2.26732 0.333374 3.00065 0.333374H7.00065V3.00004H3.00065V7.00004H0.333984ZM27.0007 7.00004V3.00004H23.0007V0.333374H27.0007C27.734 0.333374 28.3618 0.594485 28.884 1.11671C29.4062 1.63893 29.6673 2.26671 29.6673 3.00004V7.00004H27.0007Z'
                    fill='#C90019'
                  />
                </svg>
                <div className='flex flex-col gap-1'>
                  <div className='flex text-2xl'>
                    <Translate description='Screen Reader Friendly'>
                      features.screen.reader
                    </Translate>
                  </div>
                  <div className='flex font-light text-[#717784]'>
                    <Translate description='Tested across major screen readers description'>
                      features.screen.reader.description
                    </Translate>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
