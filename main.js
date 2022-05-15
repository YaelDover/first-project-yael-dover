
//פונקציה ליצירת פתקית 
function createSmallNote(smallNotesArr) {
    if (smallNotesArr) {

        for (let i = 0; i < smallNotesArr.length; i++) {

            const notesContainer = document.getElementsByClassName("notesContainer")[0];
            const notesRow = document.getElementsByClassName("notesRow")[0];

            const smallNoteDiv = document.createElement("div");
            smallNoteDiv.setAttribute("class", "smallnote");

            const note = document.createElement("p");
            note.setAttribute("class", "smallnotetask");
            note.innerText = smallNotesArr[i].task;

            const note2 = document.createElement("p");
            note2.setAttribute("class", "smallnotedate");
            note2.innerText = smallNotesArr[i].date + "\n" + smallNotesArr[i].time;

            const dateAndTime = document.createElement("div");

            const glyph = document.createElement("span");
            glyph.setAttribute("class", "glyphicon glyphicon-remove");
            glyph.setAttribute("onclick", "fade(this.parentElement)");
            glyph.setAttribute("slot", i);
            glyph.onclick = function () {
                deleteSmallNote(this);
            }

            notesContainer.appendChild(notesRow);
            notesRow.appendChild(smallNoteDiv);
            smallNoteDiv.appendChild(note);
            smallNoteDiv.appendChild(note2);
            smallNoteDiv.appendChild(glyph);
            note2.appendChild(dateAndTime);

        }
    }
}
// פונקציה להוספת פתקית חדשה + ניקוי הטופס אחרי ההוספה
function addNewNote() {

    inputValue1 = document.querySelector("#task").value;
    inputValue2 = document.querySelector("#date").value;
    inputValue3 = document.querySelector("#time").value;

    const noteObj = { task: inputValue1, date: inputValue2, time: inputValue3 };

    createSmallNote([noteObj]);

    addSmallNotesToStorage([noteObj]);

    document.querySelector("#task").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#time").value = "";

}


// פונקציה להוספת פתק לאחסון בדפדפן
function addSmallNotesToStorage(smallNoteObj) {

    let smallNotesInfoArray = [];
    const currentInStorage = JSON.parse(localStorage.getItem("notesArr"));

    if (localStorage.getItem("notesArr")) {
        for (let i = 0; i < currentInStorage.length; i++) {
            smallNotesInfoArray.push(currentInStorage[i]);
        }
    }

    smallNotesInfoArray.push(smallNoteObj[smallNoteObj.length - 1]);

    localStorage.setItem("notesArr", JSON.stringify(smallNotesInfoArray));
}


// פונקציה למחיקת הפתקית מהלוח + מהאחסון בדפדפן
function deleteSmallNote(objToDelete) {
    const currentSaved = JSON.parse(localStorage.getItem("notesArr"));

    if (currentSaved.length == 1) {
        localStorage.removeItem("notesArr");
    }

    else {
        currentSaved.splice(objToDelete.slot, 1);
        var newCleanArr = JSON.stringify(currentSaved);
        localStorage.setItem("notesArr", newCleanArr);
    }

    fade(objToDelete.parentElement);
}


// פונקציה שגורמת לאפקט של פייד אווט כשנמחקת פתקית
function fade(element) {
    let op = 1;  // initial opacity
    let timer = setInterval(function () {

        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }

        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;

    }, 50);
}


//שמירת פתק ובדיקת שגיאות 
function saveTask() {

    let errArr = [];
    const errDiv = document.getElementsByClassName("errors")[0];
    const errList = document.getElementsByClassName("errorList")[0];
    const taskInput = document.querySelector("#task").value;
    const dateInput = document.querySelector("#date").value;
    const timeInput = document.querySelector("#time").value;

    errList.innerHTML = "";

    if (taskInput == "") {
        errArr.push("You must enter a task!");
    }

    if (dateInput == "") {
        errArr.push("You must enter a date!");
    }

    if (timeInput != "" && !isValidTime(timeInput)) {

        errArr.push("You must enter a valid time! (hh:mm)");
    }

    if (dateInput != "" && !isValidDate(dateInput)) {
        errArr.push("You must enter a valid date! (mm/dd/yyyy) ");

    }

    if (errArr.length > 0) {
        for (let i = 0; i < errArr.length; i++) {
            const list = document.createElement("li");
            list.innerHTML = "<h3>" + errArr[i] + "</h3>";
            errList.appendChild(list);
            errDiv.appendChild(errList);
        }
    }

    else {
        addNewNote();
    }
}

function resetForm() {
    
    document.querySelector("#task").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#time").value = "";

}

//פונקציה לקביעת פורמט השעה שמוכנסת (לא חובה למלא את השדה הזה)
function isValidTime(time) {
    let a = true;
    const timeArr = time.split(":");

    if (timeArr.length != 2) {
        a = false;
    }

    else {
        if (isNaN(timeArr[0]) || isNaN(timeArr[1])) {
            a = false;
        }

        if (timeArr[0] < 24 && timeArr[1] < 60) { 
            a = true;
        }

        else {
            a = false;
        }

        if (time == "") {
            a = false;
        }
    }

    return a;
}

// פונקציה לקביעת הפורמט של התאריך
function isValidDate(dueDate) {
 
    let objDate,   
        mSeconds, 
        day,     
        month,    
        year;    
   
    if (dueDate.length !== 10) {
        return false;
    }
    
    if (dueDate.substring(2, 3) !== '/' || dueDate.substring(5, 6) !== '/') {
        return false;
    }
    
    month = dueDate.substring(0, 2) - 1; 
    day = dueDate.substring(3, 5) - 0;
    year = dueDate.substring(6, 10) - 0;
     
    if (year < 1000 || year > 3000) {
        return false;
    }
    mSeconds = (new Date(year, month, day)).getTime();
    
    objDate = new Date();
    objDate.setTime(mSeconds);
   
    if (objDate.getFullYear() !== year ||
        objDate.getMonth() !== month ||
        objDate.getDate() !== day) {
        return false;
    } 

    return true;
}

function onWindowLoad() {

    const currentInStorage = JSON.parse(localStorage.getItem("notesArr"));
    
    if (currentInStorage) {
        createSmallNote(currentInStorage);
    }
    const btn1 = document.querySelector("#saveBtn");
    btn1.onclick = saveTask;
    const btn2 = document.querySelector("#resetBtn");
    btn2.onclick = resetForm;
}
window.onload = onWindowLoad;