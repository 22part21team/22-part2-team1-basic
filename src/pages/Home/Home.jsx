
import homePhoto from '../../assets/images/home/home-photo.jpg';
import styles from './Home.module.css';
import homeArrow from '../../assets/images/home/home-arrow.svg';
import homeIconPlus from '../../assets/images/home/home-icon-plus.svg';
import homePointImg from '../../assets/images/home/home-point-img.png';
function Home() {
  return <>


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
              <div className={styles.fromCadeLine}>
                <p className={styles.fromCadeImg}><img src={homePhoto} alt="강미나" /></p>
                <p className={styles.fromCadeName}>
                  <span>From.&nbsp;</span>
                  <span>강미나</span>
                  <span className={styles.fromCadeBadge}>친구</span>
                </p>
              </div>
              <p className={styles.fromCadeText}>코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!</p>
              <p className={styles.fromCadeDate}><span>2026.01.26</span></p>
            </div>

            <div className={styles.fromCade}>
              <div className={styles.fromCadeLine}>
                <p className={styles.fromCadeImg}><img src={homePhoto} alt="강미나" /></p>
                <p className={styles.fromCadeName}>
                  <span>From.&nbsp;</span>
                  <span>박대영</span>
                  <span className={`${styles.fromCadeBadge} ${styles.type}`}> 친구</span>
                </p>
              </div>
              <p className={styles.fromCadeText}>일교차가 큰 시기입니다. 새벽에는 겨울, 한낮에는 여름, 아침저녁으로는 가을을 느껴보는 것도 좋을 것 같아요. 일교차가 큰 시기입니다. 새벽에는 겨울, 한낮에는 여름, 아침저녁으로는 가을을 느껴보는 것도 좋을 것 같아요.</p>
              <p className={styles.fromCadeDate}><span>2026.01.26</span></p>
            </div>

            <div className={`${styles.fromCade} ${styles.fromCadeIcon}`}>
              <p className={styles.fromCadeImg01}><img src={homeIconPlus} alt="" /></p>
              <p className={styles.fromCadeImg02}><img src={homeArrow} alt="" /></p>
            </div>
          </div>
        </div>

        <div className={`${styles.point} ${styles.point02Box}`}>
          <div className={styles.pointImg}>
            <img src={homePointImg} alt="" />
          </div>
          <div className={styles.pointText}>
            <p className={styles.pointBadge}><span >Point. 02</span></p>
            <h2>서로에게 이모지로 감정을 <br /> 표현해보세요</h2>
            <p>롤링 페이퍼에 이모지를 추가할 수 있어요.</p>
          </div>
        </div>



      </section>
    </main >

  </>;
}

export default Home;
