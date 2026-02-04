import { useEffect, useState } from 'react';

/**
 * 컴포넌트의 마운트/언마운트 시점에 CSS 애니메이션을 적용할 수 있게 해주는 컴포넌트
 *
 * @param {boolean} visible - 표시 여부
 * @param {string} inClass - 나타날 때 적용할 CSS 클래스명 ( 기본값 animated-in )
 * @param {string} outClass - 사라질 때 적용할 CSS 클래스명 ( 기본값 animated-out )
 * @param {React.ReactNode} children - 애니메이션을 적용할 요소
 * @returns {JSX.Element | null} 애니메이션이 적용된 div 요소
 */
export function MountAnimation({
  visible,
  inClass = 'animated-in',
  outClass = 'animated-out',
  children,
}) {
  const [mounted, setMounted] = useState(visible);

  // 모달이 열릴 때(visible: true) - 즉시 마운트
  useEffect(() => {
    // eslint-disable-next-line
    if (visible) setMounted(true);
  }, [visible]);

  // 모달이 닫힐 때(visible: false) - 애니메이션(fadeOut)이 끝난 후에 언마운트
  const unmount = () => {
    if (!visible) setMounted(false);
  };

  // 애니메이션 종료 후 모달 내용을 DOM에서 완전히 삭제
  if (!mounted) return null;

  return (
    <div
      onAnimationEnd={unmount}
      // visible 값에 따라 다른 클래스를 부여하여 CSS 애니메이션 트리거
      className={visible ? inClass : outClass}
    >
      {children}
    </div>
  );
}
