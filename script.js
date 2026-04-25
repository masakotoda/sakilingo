import * as utils from './utils.js';

const state = {
    counter: 0,
    sentences: []
};

const input = document.getElementById("textInput");
const micBtn = document.getElementById("micBtn");
const confirmBtn = document.getElementById("confirmBtn");
const nextBtn = document.getElementById("nextBtn");
const countLabel = document.getElementById("countLabel");
const nextSentenceLabel = document.getElementById("nextSentenceLabel");


if (location.hostname === 'localhost') {
    window.__state = state;
}

const recognition = utils.initSpeechRecognition();

if (recognition) {
    micBtn.addEventListener("click", () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    confirmBtn.addEventListener("click", () => {
        const userInput = input.value.trim();
        if (userInput) {
            if (userInput.toLowerCase() === nextSentenceLabel.textContent.toLowerCase()) {
                alert(`You entered: ${userInput}`);
            } else {
                alert("Incorrect input. Please try again.");
            }
        } else {
            alert("Please enter some text first.");
        }
    });

    nextBtn.addEventListener("click", () => {
        console.log(state.sentences[state.counter])
        nextSentenceLabel.textContent = `Next sentence: ${state.sentences[state.counter].sen ?? ""}`;
        state.counter++;
        countLabel.textContent = `Counter: ${state.counter}`;
    });
}

//
//  sentences.push({ sen: "The quick brown fox jumps over the lazy dog." });
fetch('sentences.tsv')
    .then(res => {
        if (!res.ok) throw new Error('Failed to load TSV');

        return res.text();
    })
    .then(text => {
        const lines = text.trim().split('\n');

        // Extract headers
        const headers = lines[0].split('\t');

        // Map rows to objects
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            const obj = {};

            headers.forEach((header, i) => {
                obj[header.trim()] = values[i] ?? "";
            });

            return obj;
        });

        // Result
        console.log(data);

        // Optional: attach to window for inspection

        state.sentences = utils.shuffle(data);
    })
    .catch(err => {
        console.error(err);
    });

fetch('sentences.tsv')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load TSV file');
        }
        return response.text();
    })
    .then(text => {
        const rows = text.trim().split('\n').map(row => row.split('\t'));
        const table = document.getElementById('tsvTable');

        rows.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');

            row.forEach(cell => {
                const cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
                cellElement.textContent = cell;
                tr.appendChild(cellElement);
            });

            table.appendChild(tr);
        });
    })
    .catch(error => {
        console.error(error);
        document.body.insertAdjacentHTML('beforeend', '<p>Error loading data.</p>');
    });