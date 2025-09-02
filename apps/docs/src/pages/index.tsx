import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import LandingHeader from '../components/LandingPage/LandingHeader';
import LandingSubHeader from '../components/LandingPage/LandingSubHeader';
import Features from '../components/LandingPage/Features';
import AIDriven from '../components/LandingPage/AIDriven';
import Theming from '../components/LandingPage/Theming';
import Ending from '../components/LandingPage/Ending';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`}>
      <div className='flex'>
        <main className='flex-1'>
          <section className='justify-self-center'>
            <div className='container flex flex-col items-center gap-16 m-12'>
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
