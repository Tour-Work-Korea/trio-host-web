import { FunctionComponent, useCallback } from "react";
import styles from "./HeroSection.module.css";
import UiMockUp from "@assets/images/landing/ui_mockup.svg";

const HeroSection = () => {
  const onButtonContainerClick = useCallback(() => {
    window.open(
      "https://www.animaapp.com/?utm_source=figma-samples&utm_campaign=figma-lp-ui-kit&utm_medium=figma-samples"
    );
  }, []);

  return (
    <div className={styles.heroSection}>
      <div className={styles.header}>
        <div className={styles.parent}>
          <b className={styles.b}>사장님을 위한 워커웨이</b>
          <b className={styles.heroSectionB}>
            게스트하우스 등록부터 일자리·파티 모집까지 한 곳에서 시작하세요
          </b>
        </div>
        <div className={styles.button} onClick={onButtonContainerClick}>
          <b className={styles.label}>입점신청하고 회원가입하기</b>
        </div>
      </div>
      <img className={styles.visualsIcon} src={UiMockUp} />
    </div>
  );
};

export default HeroSection;
