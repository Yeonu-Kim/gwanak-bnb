import { useState } from 'react';
import './app.module.css';

const App = () => {
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [babyCount, setBabyCount] = useState(0);
  const [petCount, setPetCount] = useState(0);

  const SERACH_DATA = [
    {
      type: '성인',
      age: '13세 이상',
      onClickAdd: () => setAdultCount(adultCount + 1),
      onClickMinus: () => setAdultCount(adultCount - 1),
      content: adultCount,
    },
    {
      type: '어린이',
      age: '2~12세',
      onClickAdd: () => setChildCount(childCount + 1),
      onClickMinus: () => setChildCount(childCount - 1),
      content: childCount,
    },
    {
      type: '유아',
      age: '2세 미만',
      onClickAdd: () => setBabyCount(babyCount + 1),
      onClickMinus: () => setBabyCount(babyCount - 1),
      content: babyCount,
    },
    {
      type: '반려동물',
      urlContent: '보조동물을 동반하시나요?',
      onClickAdd: () => setPetCount(petCount + 1),
      onClickMinus: () => setPetCount(petCount - 1),
      content: petCount,
    },
  ];
  return (
    <div className="menu_list_container">
      {SERACH_DATA.map(
        ({ type, age, urlContent, onClickAdd, onClickMinus, content }) => (
          <div className="menu_container">
            <div className="menu_desc_container">
              <span className="menu_name">{type}</span>
              {urlContent !== undefined ? (
                <a className="menu_url_content" href="https://www.google.com">
                  {urlContent}
                </a>
              ) : (
                <span className="menu_desc">{age}</span>
              )}
            </div>
            <div className="menu_counter_container">
              <button
                className="menu_counter_minus"
                disabled={content === 0}
                onClick={onClickMinus}
              >
                -
              </button>
              <span className="menu_counter_content">{content}</span>
              <button className="menu_counter_add" onClick={onClickAdd}>
                +
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default App;
