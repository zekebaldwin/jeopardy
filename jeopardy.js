// categories is the main data structure for the app; it looks like this:
//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

document.querySelectorAll('#myTable td').forEach((cell) =>
    cell.addEventListener('click', function() {
        console.log('clicked');
    })
);
const numCats = 6;
const numClues = 5;
let categories = [];
/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
async function getCategoryIds() {
    const res = await axios.get('http://jservice.io/api/categories?count=100');
    const ids = res.data.map((el) => el.id);
    return _.sampleSize(ids, numCats);
}
// const arr = [];
// (async function() {
//  const catIds = await getCategoryIds();
//  console.log(catIds);
//     while(arr.length < numCats){
//         const ranIds = await getCategory(catIds);
//         arr.push(ranIds)
//     }
// })();

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null}, *      ...
 *   ]
 */

let arr = [1,2,3,4,5]
async function getCategory(catId) {
    const res = await axios.get(`https://jservice.io/api/clues?category=${catId}`);
    console.log(res)
    const clue = res.data.map((obj) => {
        return {
            question: obj.question,
            answer: obj.answer,
            showing: null
        };
    });
    let titles = res.data[0].category.title;
    return { title: titles, clues: clue };
}

 

/** Fill the HTML table#jeopardy with the categories & cells for questions.

 *

 * - The <thead> should be filled w/a <tr>, and a <td> for each category

 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,

 *   each with a question for each category in a <td>

 *   (initally, just show a "?" where the question/answer would go.)

 */

 

async function fillTable() {
    const tHead = document.querySelector('#table-head');
    const tbody = document.querySelector('#body');
    while (tHead.hasChildNodes()) {
        tHead.removeChild(tHead.lastChild);
    }
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.lastChild);
    }
    const theadTr = document.createElement('tr');
    tHead.append(theadTr);
    for (let x = 0; x < numCats; x++) {
        let th = document.createElement('th');
        th.setAttribute('id', x);
        theadTr.append(th);
        th.innerText = categories[x].title;
    }
    for (let y = 0; y < numClues; y++) {
        let tr = document.createElement('tr');
        tbody.append(tr);
        for (let i = 0; i < numCats; i++) {
            let category = categories[i];
            let td = document.createElement('td');
            td.setAttribute('id', `${y}-${i}`);
            tr.append(td);
            td.innerText = '?';

        }

    }

}

 

/** Handle clicking on a clue: show the question or answer.

 *

 * Uses .showing property on clue to determine what to show:

 * - if currently null, show question & set .showing to "question"

 * - if currently "question", show answer & set .showing to "answer"

 * - if currently "answer", ignore click

 * */

 

$('#myTable').on('click', 'td', (evt) => {
    handleClick(evt);
});

 

async function handleClick(evt) {
    let id = evt.currentTarget.id.split('-');
    //categories[id[0]]
    let cat = categories[id[1]];
    let showing = cat.clues[id[0]].showing;
    let question = cat.clues[id[0]].question;
    let answer = cat.clues[id[0]].answer;

    console.log(cat);

    if (showing === null) {
        cat.clues[id[0]].showing = 'question';
        evt.currentTarget.innerText = question;
    } else if (showing === 'question') {
        cat.clues[id[0]].showing = 'answer';
        evt.currentTarget.innerText = answer;

    }

}

 

/** Wipe the current Jeopardy board, show the loading spinner,

 * and update the button used to fetch data.

 */

 

function showLoadingView() {}

 

/** Remove the loading spinner and update the button used to fetch data. */

 

function hideLoadingView() {}

 

async function setupAndStart() {
	//assign catIds to var\
	const catIds = await getCategoryIds();
	//empty arr for cats
	categories = [];
	//for loop of catIds
	for (let id of catIds) {
		categories.push(await getCategory(id));
	}
	//in loop push await cat of catids into
	fillTable();
}

document.querySelector('#start').addEventListener('click', function() {
	setupAndStart();
});

 

