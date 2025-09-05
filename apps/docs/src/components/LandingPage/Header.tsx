import { useColorMode } from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';

export default function LandingHeader() {
  const color = useColorMode().colorMode === 'light' ? 'black' : 'white';
  return (
    <div
      className='landing-header-container'
      style={{
        backgroundImage: "url('/img/header-bg.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='landing-header-content'>
        <div className='landing-header-top'>
          <Translate description="WHAT'S NEW">landing.whats.new</Translate>
          <div className='landing-header-divider' />
          <Translate description='Faster insights with five new features'>
            landing.insights
          </Translate>
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
        <div className='landing-header-titles'>
          <div className='landing-header-title-row'>
            <Translate description='Build'>landing.build</Translate>
            <div className='landing-header-title-accent'>
              <Translate description='faster'>landing.faster</Translate>
            </div>
          </div>
          <div className='landing-header-title-row'>
            <Translate description='with'>landing.with</Translate>
            <div className='landing-header-title-accent'>
              <Translate description="Takeoff's">landing.takeoffs</Translate>
            </div>
          </div>
          <div className='landing-header-title-row'>
            <div className='landing-header-title-accent'>
              <Translate description='Headless'>landing.headless</Translate>
            </div>
            <Translate description='UI system'>landing.ui.system</Translate>
          </div>
        </div>
        <div className='landing-header-bottom'>
          <div className='landing-header-desc'>
            <Translate description='Open-source library with unstyled, primitive components description'>
              landing.description
            </Translate>
          </div>
          <div className='landing-header-getstarted'>
            <Link to='/docs/introduction'>
              <Translate description='Get Started'>landing.get.started</Translate>
            </Link>
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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='140'
            height='97'
            viewBox='0 0 140 97'
            fill='none'
            style={{
              position: 'relative',
              left: 150,
              bottom: 60,
            }}
          >
            <g opacity='0.8'>
              <path
                d='M28.3289 27.983C31.7835 29.7551 33.5296 29.6663 33.0111 27.8353C32.644 26.5401 28.1138 23.9493 20.8252 20.8516C17.9653 19.6898 15.6117 18.5278 15.5611 18.3492C15.2956 17.4112 24.3458 7.06771 26.0164 6.41312C27.2313 5.9369 27.5982 3.65942 26.5479 3.07867C25.7885 2.63265 24.2064 3.749 20.8403 7.20086C11.4613 16.6806 10.6381 19.1367 15.9017 22.0851C17.3189 22.919 20.0024 24.2007 21.8626 24.9603C23.6849 25.7348 26.5954 27.0746 28.3289 27.983ZM120.716 90.8654C121.386 96.5072 121.462 96.6266 122.664 95.9571C123.537 95.466 123.651 95.1236 123.474 92.2656C123.235 88.4399 121.097 80.5946 119.098 76.3666C112.558 62.3577 101.486 50.3724 87.7185 42.4203C82.4799 39.4123 78.8105 37.9224 74.3562 37.0878L70.9135 36.4019L68.3327 33.2465C63.6385 27.3953 58.9433 23.9254 51.5152 20.634C42.9483 16.8958 32.3945 14.1844 26.4592 14.2276C21.0553 14.2115 16.1576 15.9814 16.6509 17.7232C16.9418 18.7503 17.9033 18.87 20.3965 18.29C26.8763 16.7434 36.6838 18.3083 47.7945 22.6872C55.4378 25.6959 61.0438 29.4041 65.1181 34.1089C66.9651 36.3121 66.9646 36.461 64.7753 36.7731C59.7258 37.5611 55.5999 42.3538 54.8016 48.3226C53.6361 57.3131 58.7969 69.7284 66.2496 75.9374C72.589 81.1935 78.4113 78.5152 79.4884 69.8073C80.4133 62.3498 77.9477 50.069 73.8615 41.896C73.4441 41.0178 73.3303 40.4672 73.5959 40.3629C74.5071 40.0059 81.6058 42.7315 85.7185 45.0397C103.763 55.1363 118.732 74.7735 120.716 90.8654ZM73.7172 75.0458C68.2117 77.203 58.0639 63.2678 57.5594 52.8477C57.3197 48.5756 58.3073 45.0624 60.3831 42.5621C61.4212 41.312 64.8256 39.9288 67.2806 39.8102C69.1028 39.6915 69.3562 39.8406 70.2163 41.3884C70.6843 42.2964 71.3422 43.4282 71.5953 43.875C73.3666 46.8525 75.9602 56.1567 76.5921 61.9623C77.3755 68.8986 76.2227 74.0634 73.7172 75.0458Z'
                fill='url(#paint0_linear_2425_11948)'
              />
            </g>
            <defs>
              <linearGradient
                id='paint0_linear_2425_11948'
                x1='123.051'
                y1='96.5438'
                x2='96.9524'
                y2='-17.6321'
                gradientUnits='userSpaceOnUse'
              >
                <stop stopColor='#DB5465' />
                <stop offset='1' stopColor='#B70017' />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
