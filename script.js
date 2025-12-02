const firebaseConfig = {
    apiKey: "AIzaSyAYgr4G2-1DAPO_DlMEbGo8Ig6k6YVoJrk", 
    authDomain: "iot-project-m11.firebaseapp.com",
    databaseURL: "https://iot-project-m11-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-project-m11",
    storageBucket: "iot-project-m11.firebasestorage.app",
    messagingSenderId: "915095149218",
    appId: "1:915095149218:web:938dfd41f8e21a36db15fb",
    measurementId: "G-HJMTZMKZM4"
};

// Inisialisasi Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const database = app.database();
const sensorRef = database.ref('greenhouse/sensors');

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
        listenToSensors();
    } else {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('dashboard-section').style.display = 'none';
    }
});

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    errorElement.textContent = "";

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
        })
        .catch((error) => {
            errorElement.textContent = "❌ Login gagal: " + error.message;
        });
}

function logout() {
    auth.signOut();
}

function listenToSensors() {
    sensorRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            updateSoil(data.soilMoisture);
            updateLight(data.lightlevel);
            updateBooleanSensor('motion', data.motion);
            updateBooleanSensor('flame-status', data.flame);
            updateBooleanSensor('object-status', data.object);
            updateTimestamp(data.timestamp);
        }
    });
}

function updateSoil(value) {
    document.getElementById('soil-moisture').innerText = value + ' %';
    const statusElement = document.getElementById('soil-status');
    
    if (value < 40) {
        statusElement.innerText = '⚠️ KERING, Perlu Penyiraman!';
        statusElement.style.color = 'red';
    } else {
        statusElement.innerText = '✔️ Kelembaban Cukup.';
        statusElement.style.color = 'green';
    }
}

function updateLight(value) {
    document.getElementById('light-level').innerText = value + ' %';
    const statusElement = document.getElementById('light-status');

    if (value < 20) {
        statusElement.innerText = '⚠️ GELAP, Perlu Cahaya Tambahan.';
        statusElement.style.color = 'red';
    } else {
        statusElement.innerText = '✔️ Cahaya Cukup.';
        statusElement.style.color = 'green';
    }
}

function updateBooleanSensor(elementId, value) {
    const element = document.getElementById(elementId);
    if (value === true) {
        element.innerText = 'TERDETEKSI ⚠️';
        element.style.color = 'red';
    } else {
        element.innerText = 'Aman';
        element.style.color = 'green';
    }
}

function updateTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp); 
        document.getElementById('last-update').innerText = date.toLocaleString('id-ID'); 
    }
}