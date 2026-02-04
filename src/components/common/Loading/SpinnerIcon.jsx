/**
 * UI 로딩 상태를 표시하는 스피너 아이콘 컴포넌트
 * - SMIL 애니메이션을 사용하여 회전하고 투명도가 변하는 8개의 원으로 구성
 * - size와 color를 props로 받아 커스텀 가능
 *
 * @param {number} size - 아이콘의 크기 ( 가로/세로 동일, 기본값: 80 )
 * @param {string} color - 스피너 원들의 색상 ( 기본값: '#a64eff' )
 * @param {object} [props.rest] - SVG 요소에 전달될 기타 속성들 ( className 등 )
 * @returns {JSX.Element} 로딩 애니메이션 SVG
 */
function SpinnerIcon({ size = 80, color = '#a64eff', ...props }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: 'block', background: 'transparent' }}
      {...props}
    >
      <g>
        <g transform="translate(80,50)">
          <g transform="rotate(0)">
            <circle fillOpacity="1" fill={color} r="6" cy="0" cx="0">
              <animateTransform
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="1.5 1.5;1 1"
                begin="-0.875s"
                type="scale"
                attributeName="transform"
              ></animateTransform>
              <animate
                begin="-0.875s"
                values="1;0"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                attributeName="fillOpacity"
              ></animate>
            </circle>
          </g>
        </g>
        <g transform="translate(71.21320343559643,71.21320343559643)">
          <g transform="rotate(45)">
            <circle fillOpacity="0.875" fill={color} r="6" cy="0" cx="0">
              <animateTransform
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="1.5 1.5;1 1"
                begin="-0.75s"
                type="scale"
                attributeName="transform"
              ></animateTransform>
              <animate
                begin="-0.75s"
                values="1;0"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                attributeName="fillOpacity"
              ></animate>
            </circle>
          </g>
        </g>
        <g transform="translate(50,80)">
          <g transform="rotate(90)">
            <circle fillOpacity="0.75" fill={color} r="6" cy="0" cx="0">
              <animateTransform
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="1.5 1.5;1 1"
                begin="-0.625s"
                type="scale"
                attributeName="transform"
              ></animateTransform>
              <animate
                begin="-0.625s"
                values="1;0"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                attributeName="fillOpacity"
              ></animate>
            </circle>
          </g>
        </g>
        <g transform="translate(28.786796564403577,71.21320343559643)">
          <g transform="rotate(135)">
            <circle fillOpacity="0.625" fill={color} r="6" cy="0" cx="0">
              <animateTransform
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="1.5 1.5;1 1"
                begin="-0.5s"
                type="scale"
                attributeName="transform"
              ></animateTransform>
              <animate
                begin="-0.5s"
                values="1;0"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                attributeName="fillOpacity"
              ></animate>
            </circle>
          </g>
        </g>
        <g transform="translate(20,50.00000000000001)">
          <g transform="rotate(180)">
            <circle fillOpacity="0.5" fill={color} r="6" cy="0" cx="0">
              <animateTransform
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="1.5 1.5;1 1"
                begin="-0.375s"
                type="scale"
                attributeName="transform"
              ></animateTransform>
              <animate
                begin="-0.375s"
                values="1;0"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                attributeName="fillOpacity"
              ></animate>
            </circle>
          </g>
        </g>
        <g transform="translate(28.78679656440357,28.786796564403577)">
          <g transform="rotate(225)">
            <circle fillOpacity="0.375" fill={color} r="6" cy="0" cx="0">
              <animateTransform
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="1.5 1.5;1 1"
                begin="-0.25s"
                type="scale"
                attributeName="transform"
              ></animateTransform>
              <animate
                begin="-0.25s"
                values="1;0"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                attributeName="fillOpacity"
              ></animate>
            </circle>
          </g>
        </g>
        <g transform="translate(49.99999999999999,20)">
          <g transform="rotate(270)">
            <circle fillOpacity="0.25" fill={color} r="6" cy="0" cx="0">
              <animateTransform
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="1.5 1.5;1 1"
                begin="-0.125s"
                type="scale"
                attributeName="transform"
              ></animateTransform>
              <animate
                begin="-0.125s"
                values="1;0"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                attributeName="fillOpacity"
              ></animate>
            </circle>
          </g>
        </g>
        <g transform="translate(71.21320343559643,28.78679656440357)">
          <g transform="rotate(315)">
            <circle fillOpacity="0.125" fill={color} r="6" cy="0" cx="0">
              <animateTransform
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                values="1.5 1.5;1 1"
                begin="0s"
                type="scale"
                attributeName="transform"
              ></animateTransform>
              <animate
                begin="0s"
                values="1;0"
                repeatCount="indefinite"
                dur="1s"
                keyTimes="0;1"
                attributeName="fillOpacity"
              ></animate>
            </circle>
          </g>
        </g>
        <g></g>
      </g>
    </svg>
  );
}

export default SpinnerIcon;
