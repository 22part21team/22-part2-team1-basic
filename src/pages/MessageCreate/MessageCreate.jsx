import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import TextField from '../../components/common/TextField/TextField';
import Button from '../../components/common/Button/Button';
import Toast from '../../components/common/Toast/Toast';
import { DEFAULT_PROFILE_URL } from '@/constants/profileImage';
import styles from './MessageCreate.module.css';

/**
 * 롤링페이퍼 메시지 작성 페이지 컴포넌트
 * 특정 롤링페이퍼에 메시지를 작성하고 전송
 *
 * @return {JSX.Element} MessageCreate 페이지 컴포넌트
 */
const MessageCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 롤링페이퍼 ID

  // 폼 상태 관리
  const [senderName, setSenderName] = useState('');
  const [nameError, setNameError] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [relationship, setRelationship] = useState('지인');
  const [content, setContent] = useState('');
  const [font, setFont] = useState('Noto Sans KR');
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 프로필 이미지 목록 상태
  const [profileImages, setProfileImages] = useState([]);
  const [defaultAvatarUrl, setDefaultAvatarUrl] = useState('');
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  
  // 토스트 메시지 상태
  const [toast, setToast] = useState({ show: false, message: '' });

  // 에디터 상태 업데이트를 위한 state
  const [editorState, setEditorState] = useState(0);

  // Tiptap 에디터 초기화
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    onFocus: () => {
      // 에디터에 포커스할 때 이름 검증
      if (!senderName.trim()) {
        setNameError('값을 입력해 주세요');
      }
    },
    onTransaction: () => {
      // 에디터의 모든 변경사항에 대해 컴포넌트를 리렌더링
      setEditorState((prev) => prev + 1);
    },
  });

  // 관계 옵션
  const relationshipOptions = ['친구', '지인', '동료', '가족'];

  // 폰트 옵션 (label: 화면 표시용, cssValue: CSS font-family, apiValue: API 전송용)
  const fontOptions = [
    { label: 'Noto Sans', cssValue: 'Noto Sans KR', apiValue: 'Noto Sans' },
    { label: 'Pretendard', cssValue: 'Pretendard', apiValue: 'Pretendard' },
    { label: '나눔명조', cssValue: 'Nanum Myeongjo', apiValue: '나눔명조' },
    { label: '나눔손글씨 손편지체', cssValue: 'Nanum Pen Script', apiValue: '나눔손글씨 손편지체' },
  ];

  /**
   * 토스트 메시지 표시
   */
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  /**
   * 프로필 이미지 목록 조회
   */
  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        const response = await fetch('https://rolling-api.vercel.app/profile-images/');
        
        if (response.ok) {
          const data = await response.json();
          const allImages = data.imageUrls || [];
          
          // 기본 아바타(default_avatar)를 찾아서 별도로 저장
          const defaultAvatar = allImages.find(url => url.includes('default_avatar'));
          if (defaultAvatar) {
            setDefaultAvatarUrl(defaultAvatar);
          }
          
          // 선택 가능한 이미지 목록에서는 기본 아바타 제외
          const filteredImages = allImages.filter(
            url => !url.includes('default_avatar')
          );
          setProfileImages(filteredImages);
        } else {
          console.error('프로필 이미지 로드 실패:', response.status);
          showToast('프로필 이미지를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('프로필 이미지 로드 에러:', error);
        showToast('프로필 이미지를 불러올 수 없습니다.');
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchProfileImages();
  }, []);

  /**
   * 롤링페이퍼 정보 조회
   * 페이지 로드 시 recipient 정보를 가져옴
   */
  useEffect(() => {
    const fetchRecipientInfo = async () => {
      try {
        const response = await fetch(`https://rolling-api.vercel.app/22-1/recipients/${id}/`);

        // 성공 응답 처리
        if (response.ok) {
          const data = await response.json();
          setRecipientInfo(data);
          return;
        }

        // 에러 응답 처리
        const status = response.status;
        let errorData;
        
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

        // 404 에러 - 롤링페이퍼를 찾을 수 없음
        if (status === 404) {
          console.error('롤링페이퍼를 찾을 수 없습니다:', { status, errorData });
          navigate('/list', { 
            state: { message: '롤링페이퍼를 찾을 수 없습니다.' }
          });
          return;
        }

        // 400번대 클라이언트 에러
        if (status >= 400 && status < 500) {
          console.error('롤링페이퍼 조회 클라이언트 에러:', { status, errorData });
          navigate('/list', {
            state: { message: '롤링페이퍼 조회 중 문제가 발생했습니다.' }
          });
          return;
        }

        // 500번대 서버 에러 - 에러 페이지로 이동
        if (status >= 500) {
          navigate('/error', {
            state: {
              type: 'server',
              message: '서버에 일시적인 문제가 발생했습니다.',
            },
          });
          return;
        }

      } catch (error) {
        // 네트워크 에러 - 에러 페이지로 이동
        console.error('롤링페이퍼 정보 조회 네트워크 에러:', error);
        navigate('/error', {
          state: {
            type: 'network',
            message: '네트워크 연결을 확인해주세요.',
          },
        });
      }
    };

    fetchRecipientInfo();
  }, [id, navigate]);


  /**
   * 보내는 사람 이름 입력 핸들러
   *
   * @param {Event} e - Input change 이벤트
   */
  const handleNameChange = (e) => {
    setSenderName(e.target.value);
    if (nameError) {
      setNameError('');
    }
  };

  /**
   * 보내는 사람 이름 focus out 핸들러
   */
  const handleNameBlur = () => {
    if (!senderName.trim()) {
      setNameError('값을 입력해 주세요');
    }
  };

  /**
   * 이름 필드 검증 헬퍼 함수
   * 다른 액션 시에도 이름 검증을 수행
   */
  const validateName = () => {
    if (!senderName.trim()) {
      setNameError('값을 입력해 주세요');
    }
  };

  /**
   * 프로필 이미지 선택 핸들러
   *
   * @param {string} imageUrl - 선택된 이미지 URL
   */
  const handleProfileImageSelect = (imageUrl) => {
    validateName();
    setSelectedProfileImage(imageUrl);
  };

  /**
   * 사용자 파일 업로드 핸들러 (추후 구현 예정)
   * TODO: 파일 업로드 기능 구현
   * - 이미지 파일 선택 (input type="file")
   * - 이미지 업로드 (아마 클라우드 스토리지 사용 예정)
   * - 업로드된 이미지 URL을 selectedProfileImage에 설정
   * 
   * @param {Event} e - File input change 이벤트
   */
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //
  //   // 파일 타입 검증
  //   if (!file.type.startsWith('image/')) {
  //     alert('이미지 파일만 업로드 가능합니다.');
  //     return;
  //   }
  //
  //   // 파일 크기 검증 (예: 5MB 제한)
  //   if (file.size > 5 * 1024 * 1024) {
  //     alert('파일 크기는 5MB 이하여야 합니다.');
  //     return;
  //   }
  //
  //   try {
  //     // TODO: 실제 업로드 API 호출
  //     // const formData = new FormData();
  //     // formData.append('image', file);
  //     // const response = await fetch('YOUR_UPLOAD_API_URL', {
  //     //   method: 'POST',
  //     //   body: formData,
  //     // });
  //     // const data = await response.json();
  //     // setSelectedProfileImage(data.imageUrl);
  //   } catch (error) {
  //     console.error('이미지 업로드 실패:', error);
  //     alert('이미지 업로드에 실패했습니다.');
  //   }
  // };

  /**
   * 관계 선택 핸들러
   *
   * @param {Event} e - Select change 이벤트
   */
  const handleRelationshipChange = (e) => {
    validateName();
    setRelationship(e.target.value);
  };

  /**
   * 에디터 툴바 버튼 핸들러
   */
  const handleBold = () => {
    if (!editor) return;
    editor.chain().focus().toggleBold().run();
  };

  const handleItalic = () => {
    if (!editor) return;
    editor.chain().focus().toggleItalic().run();
  };

  const handleUnderline = () => {
    if (!editor) return;
    editor.chain().focus().toggleStrike().run();
  };

  const handleAlignLeft = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign('left').run();
  };

  const handleAlignCenter = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign('center').run();
  };

  const handleAlignRight = () => {
    if (!editor) return;
    editor.chain().focus().setTextAlign('right').run();
  };

  const handleOrderedList = () => {
    if (!editor) return;
    editor.chain().focus().toggleOrderedList().run();
  };

  const handleBulletList = () => {
    if (!editor) return;
    editor.chain().focus().toggleBulletList().run();
  };

  /**
   * 폰트 선택 핸들러
   *
   * @param {Event} e - Select change 이벤트
   */
  const handleFontChange = (e) => {
    validateName();
    setFont(e.target.value);
  };

  /**
   * 메시지 전송 핸들러
   * API를 호출하여 메시지를 생성하고 롤링페이퍼 페이지로 이동
   */
  const handleSubmit = async () => {
    // 유효성 검사
    if (!senderName.trim()) {
      setNameError('값을 입력해 주세요');
      return;
    }

    if (!content.trim()) {
      showToast('메시지 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 프로필 이미지가 선택되지 않았으면 기본 아바타 URL을 전송
      // Card 컴포넌트에서 default_avatar URL을 감지하여 SVG 아이콘을 표시
      const finalProfileImageURL = selectedProfileImage || defaultAvatarUrl;

      // 선택된 폰트의 API용 값 찾기
      const selectedFont = fontOptions.find(option => option.cssValue === font);
      const apiFontValue = selectedFont ? selectedFont.apiValue : 'Noto Sans';

      // API 요청 데이터 구성
      const requestData = {
        sender: senderName,
        profileImageURL: finalProfileImageURL,
        relationship: relationship,
        content: content,
        font: apiFontValue,
      };

      // API 호출
      const response = await fetch(
        `https://rolling-api.vercel.app/22-1/recipients/${id}/messages/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      // 성공 응답 처리
      if (response.ok) {
        // 롤링페이퍼 페이지로 이동
        navigate(`/post/${id}`);
        return;
      }

      // 에러 응답 처리
      const status = response.status;
      let errorData;
      
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      console.error('API 에러 응답:', errorData);
      console.error('전송한 데이터:', requestData);

      // 400번대 클라이언트 에러 - UI에 메시지 표시
      if (status >= 400 && status < 500) {
        const errorMessage = errorData.message || getClientErrorMessage(status);
        showToast(errorMessage);
        console.error('메시지 전송 클라이언트 에러:', { status, errorData });
        return;
      }

      // 500번대 서버 에러 - 에러 페이지로 이동
      if (status >= 500) {
        navigate('/error', {
          state: {
            type: 'server',
            message: '서버에 일시적인 문제가 발생했습니다.',
          },
        });
        return;
      }

      // 기타 에러
      showToast('메시지 전송 중 오류가 발생했습니다.');
      
    } catch (error) {
      // 네트워크 에러 - 에러 페이지로 이동
      console.error('메시지 전송 네트워크 에러:', error);
      navigate('/error', {
        state: {
          type: 'network',
          message: '네트워크 연결을 확인해주세요.',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 클라이언트 에러 메시지 생성
   */
  const getClientErrorMessage = (status) => {
    switch (status) {
      case 400:
        return '잘못된 요청입니다. 입력 내용을 확인해주세요.';
      case 404:
        return '롤링페이퍼를 찾을 수 없습니다.';
      case 422:
        return '입력 형식이 올바르지 않습니다.';
      default:
        return '메시지 전송에 실패했습니다.';
    }
  };

  // 생성하기 버튼 활성화 조건
  // 에디터의 실제 텍스트 내용을 확인 (HTML 태그 제외)
  const hasContent = editor?.getText().trim().length > 0;
  const isFormValid = senderName.trim() && hasContent && !nameError;

  if (!recipientInfo) {
    return (
      <div className={styles.loadingContainer}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <>
      {toast.show && <Toast message={toast.message} />}
      <div className={styles.container}>
      <div className={styles.content}>
          <TextField
            label="From."
            name="senderName"
            value={senderName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            placeholder="이름을 입력해 주세요"
            error={nameError}
          />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>프로필 이미지</label>
            <div className={styles.profileSection}>
              <div className={styles.defaultProfileIcon}>
                {selectedProfileImage ? (
                  <img
                    src={selectedProfileImage}
                    alt="선택된 프로필"
                    className={styles.defaultProfileImage}
                  />
                ) : (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z"
                      fill="#999999"
                    />
                    <path
                      d="M20 22C13.3726 22 8 27.3726 8 34H32C32 27.3726 26.6274 22 20 22Z"
                      fill="#999999"
                    />
                  </svg>
                )}
              </div>
              <div className={styles.profileContent}>
                <p className={styles.description}>프로필 이미지를 선택해주세요!</p>
                {isLoadingImages ? (
                  <p>이미지를 불러오는 중...</p>
                ) : (
                  <div className={styles.profileImageGrid}>
                    {profileImages.map((imageUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleProfileImageSelect(imageUrl)}
                        className={`${styles.profileImageButton} ${
                          selectedProfileImage === imageUrl ? styles.selected : ''
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`프로필 ${index + 1}`}
                          className={styles.profileImage}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* 파일 업로드 기능 추가 시 활성화 할 코드 */}
                {/* 
                <div className={styles.uploadSection}>
                  <label htmlFor="profile-upload" className={styles.uploadButton}>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className={styles.fileInput}
                    />
                    <span>내 기기에서 업로드</span>
                  </label>
                </div>
                */}
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="relationship" className={styles.label}>
              상대와의 관계
            </label>
            <select
              id="relationship"
              value={relationship}
              onChange={handleRelationshipChange}
              className={styles.select}
            >
              {relationshipOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="content" className={styles.label}>
              내용을 입력해 주세요
            </label>
            <div className={styles.editorContainer}>
              <div className={styles.editorToolbar}>
                <button 
                  type="button" 
                  className={`${styles.toolbarButton} ${editor?.isActive('bold') ? styles.isActive : ''}`}
                  onClick={handleBold}
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button 
                  type="button" 
                  className={`${styles.toolbarButton} ${editor?.isActive('italic') ? styles.isActive : ''}`}
                  onClick={handleItalic}
                  title="Italic"
                >
                  <em>I</em>
                </button>
                <button 
                  type="button" 
                  className={`${styles.toolbarButton} ${editor?.isActive('strike') ? styles.isActive : ''}`}
                  onClick={handleUnderline}
                  title="Strike"
                >
                  <s>S</s>
                </button>
                <div className={styles.toolbarDivider}></div>
                <button 
                  type="button" 
                  className={`${styles.toolbarButton} ${editor?.isActive({ textAlign: 'left' }) ? styles.isActive : ''}`}
                  onClick={handleAlignLeft}
                  title="왼쪽 정렬"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M2 9H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M2 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <button 
                  type="button" 
                  className={`${styles.toolbarButton} ${editor?.isActive({ textAlign: 'center' }) ? styles.isActive : ''}`}
                  onClick={handleAlignCenter}
                  title="가운데 정렬"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M4 6H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M3 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M5 12H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <button 
                  type="button" 
                  className={`${styles.toolbarButton} ${editor?.isActive({ textAlign: 'right' }) ? styles.isActive : ''}`}
                  onClick={handleAlignRight}
                  title="오른쪽 정렬"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 3H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M6 6H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M4 9H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className={styles.toolbarDivider}></div>
                <button 
                  type="button" 
                  className={`${styles.toolbarButton} ${editor?.isActive('orderedList') ? styles.isActive : ''}`}
                  onClick={handleOrderedList}
                  title="Ordered List"
                >
                  1.
                </button>
                <button 
                  type="button" 
                  className={`${styles.toolbarButton} ${editor?.isActive('bulletList') ? styles.isActive : ''}`}
                  onClick={handleBulletList}
                  title="Bullet List"
                >
                  •
                </button>
              </div>
              <div style={{ '--editor-font-family': font }}>
                <EditorContent 
                  editor={editor}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="font" className={styles.label}>
              폰트 선택
            </label>
            <select id="font" value={font} onChange={handleFontChange} className={styles.select}>
              {fontOptions.map((option) => (
                <option key={option.cssValue} value={option.cssValue} style={{ fontFamily: option.cssValue }}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonWrapper}>
            <Button size="Large" disabled={!isFormValid || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? '전송 중...' : '생성하기'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageCreate;