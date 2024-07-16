const renderSinglePong = () => {
    maincontent.innerHTML = `
    <link rel="stylesheet" href="styles/singlepong/style.css">

    <!-- Ayarlar -->
    <div class="container content">
        <div id="singlegamesettings">
            <div class="row align-items-center numInputClass">
                <div class="col-sm-4">
                    <label for="ballvelocity">Ball speed :</label>
                </div>
                <div class="col-sm-4">
                    <input type="number" class="form-control" id="ballvelocity" placeholder="Ball Velocity" value="5" min="1">
                </div>
            </div>
            <div class="row align-items-center mt-3 numInputClass">
                <div class="col-sm-4">
                    <label for="endPoint">Total Score :</label>
                </div>
                <div class="col-sm-4">
                    <input type="number" class="form-control" id="endPoint" placeholder="Total Score" value="5" min="1">
                </div>
            </div>
            <div class="slider-container">
                <label for="aiDifficulty" class="slider-label">AI Difficulty</label>
                <input type="range" min="10" max="200" value="50" class="slider-input" id="aiDifficulty">
                <span class="slider-value" id="aiDifficultyValue">1</span>
            </div>
            <div class="row mt-3 justify-content-center">
                <button id="startgamebtn">Start</button>
            </div>
            <div class="row mt-3 justify-content-center">
                <button class="homePagebtn">Home</button>
            </div>
        </div>
    </div>

    <!-- Canvas -->
    <div class="container" id="canvas-container">
        <canvas id="pong" width="800" height="400"></canvas>
        <div class="container">
            <div id="bottomhomepagebtn" class="row mt-3 justify-content-center" style="max-width: 300px;">
                <button class="homePagebtn" id="pauseResumeBtn">Pause</button>
            </div>
        </div>
    </div>
    `

    const script = document.createElement('script');
    script.src = 'scripts/pong.js';
    maincontent.appendChild(script);
}
