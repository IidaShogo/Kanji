// 要素の取得
const quantities = document.querySelectorAll(".quantity");
const totalPriceElement = document.getElementById("total-price");
const resetButton = document.getElementById("reset-button");
const remainingAmountDisplay = document.getElementById("remaining-amount");
const numberOfPeopleSelect = document.getElementById("number-of-people");
const totalBudgetDisplay = document.getElementById("total-budget");
const imageContainer = document.getElementById("image-container");
const salesDetailsContainer = document.getElementById("sales-details"); // 売上詳細表示用

// 初期設定
let budgetPerPerson = 5000; // 1人あたりの予算
let numberOfPeople = parseInt(numberOfPeopleSelect.value, 10); // 初期人数
let totalBudget = numberOfPeople * budgetPerPerson; // 合計予算
let isImageDisplayed = false; // コミュトレ画像の表示状態

// コミュトレ画像を生成
const createImageElement = () => {
  const img = document.createElement("img");
  img.src = "コミュトレ.jpg"; // 画像ファイルのパス
  img.alt = "コミュトレ";
  img.style.width = "300px"; // 必要に応じてサイズを調整
  img.style.marginTop = "20px";
  img.style.borderRadius = "8px";
  img.id = "commutre-image"; // 識別用ID
  return img;
};

// 初期表示の更新
function updateBudgetDisplay() {
  totalBudgetDisplay.textContent = `${totalBudget}`; // 合計予算を表示
}

// 合計金額と残り予算の更新
function updateTotalAndBackground() {
  let total = 0;

  // 合計金額の計算
  quantities.forEach((quantity) => {
    const price = parseInt(quantity.closest(".menu-item").dataset.price, 10); // メニューの価格
    const quantityValue = parseInt(quantity.value, 10) || 0; // 入力された数量
    total += price * quantityValue;
  });

  // 残り金額の計算
  const remainingAmount = totalBudget - total;

  // 残り金額と合計金額を表示
  totalPriceElement.textContent = `${total}`;
  remainingAmountDisplay.textContent = `残りの注文可能金額: ${remainingAmount}`;

  // 進捗バーの幅と色を更新
  const progressPercentage = Math.max(
    0,
    Math.min((total / totalBudget) * 100, 100)
  );

  let progressColor = "rgba(255, 0, 0, 0.3)"; // 初期状態は薄い赤
  if (remainingAmount <= 30000) {
    progressColor = "rgba(255, 0, 0, 0.6)"; // 残り3万円以下で濃い赤
  }
  if (remainingAmount < 0) {
    progressColor = "rgba(255, 0, 0, 1)"; // 予算超過で真っ赤
  }

  remainingAmountDisplay.style.setProperty(
    "--progress-width",
    `${progressPercentage}%`
  );
  remainingAmountDisplay.style.setProperty("--progress-color", progressColor);

  // コミュトレ画像の表示条件
  if (remainingAmount <= 30000 && !isImageDisplayed) {
    const img = createImageElement();
    imageContainer.appendChild(img); // 画像を挿入
    isImageDisplayed = true;
  } else if (remainingAmount > 30000 && isImageDisplayed) {
    const img = document.getElementById("commutre-image");
    if (img) {
      img.remove(); // 画像を削除
    }
    isImageDisplayed = false;
  }
}

// 人数変更時の処理
numberOfPeopleSelect.addEventListener("change", () => {
  numberOfPeople = parseInt(numberOfPeopleSelect.value, 10); // 新しい人数
  totalBudget = numberOfPeople * budgetPerPerson; // 合計予算の再計算
  updateBudgetDisplay();
  updateTotalAndBackground();
});

// メニュー数量変更時の処理
quantities.forEach((quantity) => {
  quantity.addEventListener("input", updateTotalAndBackground);
});

// リセットボタンの処理
resetButton.addEventListener("click", () => {
  if (confirm("本当にリセットしますか？")) {
    quantities.forEach((quantity) => {
      quantity.value = 0; // 数量をリセット
    });
    numberOfPeopleSelect.value = 10; // 人数を初期値にリセット
    numberOfPeople = 10; // 初期人数を反映
    totalBudget = numberOfPeople * budgetPerPerson; // 合計予算を再設定

    // コミュトレ画像を削除
    const img = document.getElementById("commutre-image");
    if (img) {
      img.remove();
    }
    isImageDisplayed = false;

    updateBudgetDisplay();
    updateTotalAndBackground();
  }
});

// ローカルストレージから売上データをロードして表示
const loadSalesData = () => {
  try {
    const salesData = JSON.parse(localStorage.getItem("salesData")) || [];
    let totalSales = 0;

    // 売上データを詳細表示
    salesDetailsContainer.innerHTML = ""; // コンテナを初期化
    salesData.forEach((item) => {
      totalSales += item.total;

      // 売上詳細をHTMLに表示
      const detailElement = document.createElement("p");
      detailElement.textContent = `${item.itemName}: ${item.quantity} x ${item.price}円 = ${item.total}円`;
      salesDetailsContainer.appendChild(detailElement);
    });

    // 合計金額を表示
    totalPriceElement.textContent = `${totalSales}`;
    remainingAmountDisplay.textContent = `残りの注文可能金額: ${
      totalBudget - totalSales
    }円`;
  } catch (error) {
    console.error("ローカルストレージのデータが無効です。", error);
  }
};

// ページ読み込み時に売上データをロード
document.addEventListener("DOMContentLoaded", loadSalesData);

// 初期化
updateBudgetDisplay();
updateTotalAndBackground();
