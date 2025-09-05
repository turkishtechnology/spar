import Translate from '@docusaurus/Translate';

export default function LandingSubHeader() {
  return (
    <div className='subheader-container'>
      <div className='subheader-content'>
        <div className='subheader-section'>
          <div className='subheader-title-group'>
            <div className='subheader-title-icon'>
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
              <div className='subheader-title-text'>
                <Translate description='WHY TAKEOFF HEADLESS'>
                  landing.why.takeoff.headless
                </Translate>
              </div>
            </div>
            <div className='subheader-main-title'>
              <Translate description='Build (subheader)'>landing.build.subheader</Translate>
              <div className='subheader-main-title-accent'>
                <Translate description='Smarter'>landing.smarter</Translate>
              </div>
              <div className='subheader-main-title-normal'>
                <Translate description=', not Harder'>landing.not.harder</Translate>
              </div>
            </div>
          </div>
          <div className='subheader-features'>
            <div className='subheader-feature'>
              <div className='subheader-feature-title'>
                <Translate description='Speed up your workflow'>
                  landing.speed.up.workflow
                </Translate>
              </div>
              <div className='subheader-feature-desc'>
                <Translate description='Managing logic-heavy UI components description'>
                  landing.workflow.description
                </Translate>
              </div>
            </div>
            <div className='subheader-feature'>
              <div className='subheader-feature-title'>
                <Translate description='Your UI, your rules'>landing.your.ui.rules</Translate>
              </div>
              <div className='subheader-feature-desc'>
                <Translate description='Skip the styling limitations description'>
                  landing.styling.description
                </Translate>
              </div>
            </div>
          </div>
          <div className='subheader-stats'>
            <div className='subheader-stat'>
              <div className='subheader-stat-divider' />
              <div className='subheader-stat-content'>
                <div className='subheader-stat-number'>
                  <Translate>80k+</Translate>
                </div>
                <div>
                  <Translate description='Monthly npm downloads'>
                    landing.monthly.downloads
                  </Translate>
                </div>
              </div>
            </div>
            <div className='subheader-stat'>
              <div className='subheader-stat-divider' />
              <div className='subheader-stat-content'>
                <div className='subheader-stat-number'>
                  <Translate>200+</Translate>
                </div>
                <div>
                  <Translate description='Developers building with Takeoff'>
                    landing.developers.building
                  </Translate>
                </div>
              </div>
            </div>
            <div className='subheader-stat'>
              <div className='subheader-stat-divider' />
              <div className='subheader-stat-content'>
                <div className='subheader-stat-number'>
                  <Translate>900+</Translate>
                </div>
                <div>
                  <Translate description='Github Stars'>landing.github.stars</Translate>
                </div>
              </div>
            </div>
            <div className='subheader-stat'>
              <div className='subheader-stat-divider' />
              <div className='subheader-stat-content'>
                <div className='subheader-stat-number'>
                  <Translate>30+</Translate>
                </div>
                <div>
                  <Translate description='Headless components included'>
                    landing.headless.components
                  </Translate>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
