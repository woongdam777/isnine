// 섹션 전환
const navItems = document.querySelectorAll('nav ul li');
const sections = document.querySelectorAll('main section');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetSection = item.getAttribute('data-section');
    sections.forEach(section => {
      if (section.classList.contains(targetSection)) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  });
});

// 계산 기능
// 포스 스톤
const inputValue = document.getElementById('inputValue');
const ticketValue = document.getElementById('ticketValue');
const resultList = document.getElementById('resultList');
let tenScore = document.getElementById('tenScore');
let ticketUse = document.getElementById('ticketUse');
let petScore = document.getElementById('petScore');

const denominations = [
    { value: 1500000, name: "신화" },
    { value: 300000, name: "고대" },
    { value: 100000, name: "에픽" },
    { value: 25000, name: "레전더리" },
    { value: 5000, name: "유니크" },
    { value: 1000, name: "레어" },
    { value: 100, name: "매직" },
    { value: 1, name: "노말" }
];

inputValue.addEventListener('input', calculateAndDisplay);
ticketValue.addEventListener('input', calculateAndDisplay);

function calculateAndDisplay() {
    let ticketCount = parseInt(ticketValue.value)/10;
    let value = parseInt(inputValue.value)*10*0.88*Math.floor(ticketCount)*0.1;
    let ticketRemainCount = parseInt(ticketValue.value)%10;
    ticketUse.innerHTML = Math.floor(ticketCount)*10 + '개 / ' + ticketRemainCount + '개';
    tenScore.innerHTML = Math.floor(value)*10 + ' 점';
    petScore.innerHTML = Math.floor(Math.ceil(inputValue.value*7.295)*Math.floor(ticketCount)*0.88*10.4)+ ' EXP';
    
    if (isNaN(value) || value < 0) {
        resultList.innerHTML = '<li>수련장 점수를 입력하세요.</li>';
        return;
    }

    let results = [];
    for (let denomination of denominations) {
        let quotient = Math.floor(value / denomination.value);
        if (quotient > 0) {
            results.push({ ...denomination, count: quotient });
        }
        value %= denomination.value;
    }

    displayResults(results);
    
}

function displayResults(results) {
    resultList.innerHTML = '';
    if (results.length === 0) {
        resultList.innerHTML = '<li>토벌 가능한 최소 티켓수 10개이상 입력하세요.</li>';
        return;
    }
    results.forEach((result) => {
        const li = document.createElement('li');
        li.textContent = `${result.name} (${result.value.toLocaleString()}): ${result.count}개`;
        resultList.appendChild(li);
    });
}

// 포스&각성 레벨

const force = [ 1, 100, 250, 625, 1600, 6400, 16000, 38000, 83600, 334400 ];
const inputForce = document.getElementById('inputForce');
inputForce.addEventListener('input', calculateAndDisplay2);

function calculateAndDisplay2(){
  const forceValue = parseInt(inputForce.value, 10);
  let nowForce = document.getElementById('nowForce');
  let needForce = document.getElementById('needForce');
  
  let now = 0;
  let result = 0;

  for(let i of force){
    if(forceValue < i){
      result = i - forceValue;
      break;
    }
    now++;
  }

  nowForce.innerHTML = 'Lv ' + now;
  needForce.innerHTML = result + ' 포스';
}

const awaken = [1, 5000, 20000, 100000, 500000, 2500000, 10000000, 50000000, 300000000, 1000000000];
const inputAwaken = document.getElementById('inputAwaken');
inputAwaken.addEventListener('input', calculateAndDisplay3);

function calculateAndDisplay3(){
  const awakenValue = parseInt(inputAwaken.value, 10);
  let nowAwaken = document.getElementById('nowAwaken');
  let needAwaken = document.getElementById('needAwaken');

  let now = 0;
  let result = 0;

  for(let i of awaken){
    if(awakenValue < i){
      result = i - awakenValue;
      break;
    }
    now++;
  }

  nowAwaken.innerHTML = 'Lv ' + now + ' / ' + (240 - (10 * (now - 1))) + '쿨 / 피해량 ' + ((now - 1) * 10) + ((now >= 5) ? ' + 25% 증가' : '% 증가');
  needAwaken.innerHTML = result + ' 경험치';
}


// 어빌 재설정
const locks = document.querySelectorAll('input[name="lock"]');
const inputSilver = document.getElementById('inputSilver');
const inputPage = document.getElementById('inputPage');
const maxReAbillty = document.getElementById('maxReAbillty');

locks.forEach(lock => {
    lock.addEventListener('change', maxAbilltyCount);
});

inputSilver.addEventListener('input', maxAbilltyCount);
inputPage.addEventListener('input', maxAbilltyCount);

function maxAbilltyCount(){
    let lockValue = document.querySelector('input[name="lock"]:checked').value;
    let inputSilverValue = parseInt(inputSilver.value) || 0;
    let inputPageValue = parseInt(inputPage.value) || 0;
  
    let bs = 2000 * lockValue;
    let bp = 10 * lockValue;

    let silverCount = Math.floor(inputSilverValue / bs);
    let pageCount = Math.floor(inputPageValue / bp);

    let result = Math.min(silverCount, pageCount);

    maxReAbillty.innerHTML = result + ' 번';
}

// 데이터 검색

const SHEET_ID = '1-3DK85MfB-h1aq2FfAtnvJ2qoIYIj3MSwpkGwHCGJec';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', searchSheet);

function searchSheet() {
  let keyword = document.getElementById('inputSearch').value;

  fetch(SHEET_URL)
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const jsonData = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      // K1 셀의 값 확인
      const updateInfo = rows[0][10]; // K1 셀

      if (updateInfo && updateInfo.startsWith("UPDATE_FINISHED:")) {
        // 업데이트가 완료된 경우
        const updateTime = updateInfo.substring("UPDATE_FINISHED:".length).trim(); 
        const formattedDate = formatDate(updateTime);

        const result = searchKeyword(jsonData, keyword);
        if (result) {
          displayResult(result, formattedDate); 
        } else {
          displayError("워크 아이디를 정확하게 입력해주세요");
        }
      } else {
        // 업데이트 중인 경우
        displayError("현재 데이터 업데이트 중입니다. 잠시 후 다시 시도해 주세요.");
      }
    })
    .catch(error => {
      displayError("데이터를 가져오는 중 오류가 발생했습니다.");
      console.error('Error:', error);
    });
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
}

function displayResult(result, updateTime) {
  const resultDiv = document.getElementById('searchResult');
  resultDiv.innerHTML = `
    <div class="result-card">
      <h3>검색 결과</h3>
      <table class="result-table">
        <tr>
          <th>마지막 저장 시간</th>
          <td>${result.Date}</td>
        </tr>
        <tr>
          <th>워크 아이디</th>
          <td>${result.Name}</td>
        </tr>
        <tr>
          <th>닉네임</th>
          <td>${result.Nickname}</td>
        </tr>
        <tr>
          <th>레벨</th>
          <td>Lv.${result.Level}</td>
        </tr>
        <tr>
          <th>포스레벨</th>
          <td>${result['Force Level']}</td>
        </tr>
        <tr>
          <th>포스스톤</th>
          <td>${result.Forcestone}</td>
        </tr>
        <tr>
          <th>남은티켓수</th>
          <td>${result['Ticket Count']} 개</td>
        </tr>
      </table>
      <p class="last-update">마지막 업데이트: ${updateTime}</p>
    </div>
  `;
}

function displayError(message) {
  const resultDiv = document.getElementById('searchResult');
  resultDiv.innerHTML = `<p class="error-message">${message}</p>`;
}

function searchKeyword(data, keyword) {
  return data.find(row => row.Name === keyword) || null;
}