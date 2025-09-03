import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingSubHeader from '../components/LandingPage/LandingSubHeader';
import Features from '../components/LandingPage/Features';
import AIDriven from '../components/LandingPage/AIDriven';
import Theming from '../components/LandingPage/Theming';
import Ending from '../components/LandingPage/Ending';
import '../styles/index.scss';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`}>
      <div className='home-container'>
        <main className='home-main'>
          <section className='home-section'>
            <div className='home-content'>
              <LandingHeader />
              <LandingSubHeader />
              <Features />
              <AIDriven />
              <Theming />
            </div>
          </section>
          <Ending />
        </main>
      </div>
    </Layout>
  );
}
