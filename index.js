const symbolsMatrix = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ., ".split("");
const symbolsADFGVX = "ADFGVX".split("");
const matrixADFGVX = [];
const matrixSize = 7;
const matrixKey = [];

const generateBtn = document.querySelector(".generate-button");
const text = document.querySelector(".text");
const key = document.querySelector(".key");
const decryptBtn = document.querySelector(".decrypt-button");
const encryptBtn = document.querySelector(".encrypt-button");
const clearBtn = document.querySelector(".clear-button");
const resultText = document.querySelector(".result-text");

generateBtn.addEventListener("click", () => generateMatrix(matrixSize));
decryptBtn.addEventListener("click", getDecryptedText);
encryptBtn.addEventListener("click", getEncryptedText);
clearBtn.addEventListener("click", clear);

function getRandomSymbolMatrix(matrix) {
    for (let i = matrix.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matrix[i], matrix[j]] = [matrix[j], matrix[i]];
    }
    return matrix;
}

function generateMatrix(size) {
    const table = document.getElementById("matrixADFGVX");
    const uniqueSymbols = getRandomSymbolMatrix(symbolsMatrix.slice(0, size * size));
    let symbolIndex = 0;

    table.innerHTML = "";

    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        matrixADFGVX[i] = [];
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            if (i === 0 && j === 0) {
                cell.textContent = "";
            } else
            if (i === 0) {
                cell.textContent = symbolsADFGVX[j - 1];
                matrixADFGVX[i][j] = symbolsADFGVX[j - 1];
            } else
            if (j === 0) {
                cell.textContent = symbolsADFGVX[i - 1];
                matrixADFGVX[i][j] = symbolsADFGVX[i - 1];
            } else {
                matrixADFGVX[i][j] = uniqueSymbols[symbolIndex];
                cell.textContent = uniqueSymbols[symbolIndex++];
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function getDecryptedText() {
    resultText.innerHTML = "";
    let textValue = text.value;
    textValue = textValue.toUpperCase().split("");
    let keyValue = key.value;
    keyValue = keyValue.toUpperCase().split("");

    let res = [];

    for (let k = 0; k < textValue.length; k++) {
        matrixADFGVX.forEach((row, i) => {
            row.forEach((item, j) => {
                if (item === textValue[k]) {
                    res.push(matrixADFGVX[i][0]);
                    res.push(matrixADFGVX[0][j]);
                }
            });
        });
    }

    let indexText = 0;

    for (let i = 0; i < Math.ceil(res.length / keyValue.length) + 1; i++) {
        matrixKey[i] = [];
        for (let j = 0; j < keyValue.length; j++) {
            if (i === 0) {
                matrixKey[i][j] = keyValue[j];
            } else
            if (indexText < res.length) {
                matrixKey[i][j] = res[indexText];
                indexText++;
            } else {
                matrixKey[i][j] = "";
            }
        }
    }

    keyValue = keyValue.sort((a, b) => {
        return a.localeCompare(b, 'ru');
    });

    keyValue = keyValue.join("");

    let resSort = Array.from({ length: matrixKey.length }, () => []);
    let indexKey = 0;

    for (let j = 0; j < matrixKey[0].length; j++) {
        if (matrixKey[0][j] === keyValue[indexKey]) {
            for (let row = 1; row < matrixKey.length; row++) {
                resSort[row][indexKey] = matrixKey[row][j];
            }
            indexKey++;
            if (indexKey === keyValue.length) {
                break;
            }
            j = -1;
        }
    }

    resSort.forEach((item) => {
        resultText.innerHTML = resultText.innerHTML + item.join("");
    });
    clearBtn.style.display = "block";
    resultText.style.opacity = "1";
}

function getEncryptedText() {
    resultText.innerHTML = "";

    let textValue = text.value;
    textValue = textValue.toUpperCase().split("");
    let keyValue = key.value;
    keyValue = keyValue.toUpperCase().split("");
    let keyValueBase = key.value.toUpperCase().split("");

    let res = [];
    let indexText = 0;

    keyValue = keyValue.sort((a, b) => {
        return a.localeCompare(b, 'ru');
    });

    keyValue = keyValue.join("");

    for (let i = 0; i < Math.ceil(textValue.length / keyValue.length) + 1; i++) {
        res[i] = [];
        for (let j = 0; j < keyValue.length; j++) {
            if (i === 0) {
                res[i][j] = keyValue[j];
            } else
            if (textValue[indexText++]) {
                indexText--;
                res[i][j] = textValue[indexText++];
            } else
            res[i][j] = "";
        }
    }

    let resSort = Array.from({ length: res.length }, () => new Array(keyValueBase.length).fill(null));
    let indexKey = 0;

    for (let j = 0; j < res[0].length; j++) {
        if (res[0][j] === keyValueBase[indexKey]) {
            for (let row = 0; row < res.length; row++) {
                resSort[row][indexKey] = res[row][j];
            }
            indexKey++;
            if (indexKey === keyValueBase.length) {
                break;
            }
            j = -1;
        }
    }

    let resSortNew = [];
    let index = 0;

    resSort.forEach((row, i) => {
        row.forEach((item, j) => {
            resSortNew[index++] = item;
        });
    });

    let resText = [];

    for (let k = keyValue.length; k < resSortNew.length + 1; k += 2) {
        matrixADFGVX.forEach((row, i) => {
            row.forEach((item, j) => {
                if (resSortNew[k] === matrixADFGVX[i][0] && resSortNew[k + 1] === matrixADFGVX[0][j]) {
                    resText.push(matrixADFGVX[i][j]);
                }
            });
        });
    }

    resText.forEach((item) => {
        resultText.innerHTML = resultText.innerHTML + item;
    });
    clearBtn.style.display = "block";
    resultText.style.opacity = "1";
}

function clear() {
    resultText.innerHTML = "";
    resultText.style.opacity = "0";
    clearBtn.style.display = "none";
}