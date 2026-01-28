# Button 컴포넌트

피그마 디자인 시스템에 맞춘 버튼 컴포넌트입니다.

## 컴포넌트 종류

### 1. Button (Primary)
기본 Primary 버튼

**사용 가능한 size:**
- `"56"` - 208px × 56px
- `"40"` - 122px × 40px (default)
- `"Large"` - 100% (max 720px) × 56px
- `"round"` - 56px × 56px (동그라미)

```jsx
import { Button } from '@/components/common/Button';

// 기본 사용
<Button>클릭</Button>

// 크기 지정
<Button size="56">큰 버튼</Button>
<Button size="Large">전체 너비 버튼</Button>

// className 추가 (width: 100% 가변 처리 등)
<Button className={styles.customButton}>버튼</Button>

// 비활성화
<Button disabled>비활성</Button>

// 동그라미 버튼 (+ 아이콘용)
<Button size="round">+</Button>
```

### 2. Secondary
보조 버튼 (흰색 배경 + 보라색 테두리)

**사용 가능한 size:**
- `"40"` - 122px × 40px (default)

```jsx
import { Secondary } from '@/components/common/Button';

<Secondary>취소</Secondary>
<Secondary disabled>비활성</Secondary>
```

### 3. Outlined
외곽선 버튼 (흰색 배경 + 회색 테두리)

**사용 가능한 size:**
- `"56"` - 192px × 56px
- `"40"` - 122px × 40px (default)
- `"36"` - 122px × 36px
- `"28"` - 122px × 28px
- `"Trash"` - 36px × 36px (쓰레기통 아이콘용)
- `"Arrow"` - 40px × 40px (화살표 아이콘용, box-shadow 포함)

```jsx
import { Outlined } from '@/components/common/Button';

<Outlined size="56">수정하기</Outlined>
<Outlined size="40">삭제</Outlined>
<Outlined size="Trash">🗑️</Outlined>
<Outlined size="Arrow">→</Outlined>
```

### 4. Toggle
토글 버튼 (컬러/이미지 선택용)

```jsx
import { Toggle } from '@/components/common/Button';

const [selected, setSelected] = useState('left');

<Toggle
  leftOption="컬러"
  rightOption="이미지"
  selected={selected}
  onToggle={setSelected}
/>
```

## 공통 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | string | `"40"` | 버튼 크기 |
| disabled | boolean | `false` | 비활성화 여부 |
| onClick | function | - | 클릭 핸들러 |
| children | ReactNode | - | 버튼 내용 |
| type | string | `"button"` | 버튼 타입 |
| className | string | `""` | 추가 CSS 클래스 (width 가변 등) |

## className prop 활용

메인/리스트 페이지에서 버튼 width를 100%로 가변 처리해야 할 때:

```jsx
// CSS Module
.fullWidthButton {
  width: 100% !important;
}

// 컴포넌트
<Button className={styles.fullWidthButton}>버튼</Button>
```

## 반응형

- **Mobile (~ 767px)**: Primary 버튼 최대 너비 280px
- **Tablet (768px ~ 1023px)**: 기본 크기 유지
- **Desktop (1024px ~)**: 기본 크기 유지

## 색상 참고

- **Primary Background**: `#9935ff`
- **Primary Hover**: `#7b2acc`
- **Primary Active**: `#6b1fb8`
- **Secondary Border**: `#9935ff`
- **Outlined Border**: `#cccccc`
- **Disabled Background**: `#cccccc`
