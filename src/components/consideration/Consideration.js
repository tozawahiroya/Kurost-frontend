import React from 'react';
import './Consideration.css';
import CustomTimer from './customtimer/CustomTimer';

function Consideration() {
  return (
    <div>
        <p>【問題】</p>
        <p>国内の腕時計の市場規模を簡易的に推定の上、市場の拡大施策を考えてください</p> {/* onClickに差替 */}
        < CustomTimer /> {/* onClickでボタンを押した瞬間にカウント開始に設定する */}
    </div>

  );
};


export default Consideration;
