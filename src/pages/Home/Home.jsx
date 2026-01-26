
import logo from '../../assets/images/home/logo.svg';
import homePhoto from '../../assets/images/home/home-photo.jpg';
import styles from './Home.module.css';

function Home() {
  return <>

    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.headerLogo}><img src={logo} alt="Rolling" /></a>
        <a href="/post" className={styles.headerLogoLink}>롤링 페이퍼 만들기</a>
      </div>
    </header>

    <main className={styles.container}>
      <section className={styles.contents}>

        <div className={styles.point}>

          <div className={styles.pointText}>
            <p className={styles.pointBadge}><span >Point. 01</span></p>
            <h2>누구나 손쉽게, 온라인<br /> 롤링 페이퍼를 만들 수 있어요</h2>
            <p>로그인 없이 자유롭게 만들어요.</p>
          </div>

          <div className={styles.fromCades}>
            <div className={styles.fromCade}>
              <p className={styles.fromCadeImg}><img src={homePhoto} alt="" /></p>
              <p className={styles.fromCadeName}><span>FRom.</span><span>강미나</span></p>
              <p className={styles.fromCadeBadge}><span >친구</span></p>
              <p className={styles.fromCadeText}>코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!</p>
              <p><span>2026.01.26</span></p>
            </div>
            <div className={styles.fromCade}>
              <p className={styles.fromCadeImg}><img src={homePhoto} alt="" /></p>
              <p className={styles.fromCadeName}><span>FRom.</span><span>강미나</span></p>
              <p className={styles.fromCadeBadge}><span >친구</span></p>
              <p className={styles.fromCadeText}>코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!</p>
              <p><span>2026.01.26</span></p>
            </div>
            <div className={styles.fromCade}>
              <p className={styles.fromCadeImg}><img src={homePhoto} alt="" /></p>
              <p className={styles.fromCadeName}><span>FRom.</span><span>강미나</span></p>
              <p className={styles.fromCadeBadge}><span >친구</span></p>
              <p className={styles.fromCadeText}>코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!</p>
              <p><span>2026.01.26</span></p>
            </div>
          </div>

        </div>





      </section>
    </main >

  </>;
}

export default Home;
