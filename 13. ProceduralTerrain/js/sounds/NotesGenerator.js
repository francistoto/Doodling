function NotesGenerator(fftSize) {

    window.context = window.context || window.webkitcontext;
    var context = new AudioContext();

    var notesArray = getNotes();

    var analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.7;
    analyser.fftSize = fftSize;

    this.playRandomNote = function() {
        const i = getRandomInt(0, notesArray.length-1);
        const fact = getRandomInt(-2, 5);
        const waveForm = getWaveForm(getRandomInt(1, 4));
        
        const oscillator = context.createOscillator();
        oscillator.type = waveForm;
        oscillator.frequency.value = notesArray[i] * Math.pow(2, fact);

        const gainNode = context.createGain();
         gainNode.gain.value = .5;

        // generate sound
        oscillator.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(context.destination);

        oscillator.start(0);

        const duration = getRandomInt(1, 2);
        
        gainNode.gain.linearRampToValueAtTime(0.0001, context.currentTime + duration);
        oscillator.stop(context.currentTime + duration);
    }

    this.playBackgroundNote = function(waveFormIndx, gainValue, maxFactor) {
        const i = getRandomInt(0, notesArray.length-1);
        const fact = getRandomInt(-2, maxFactor);        
        const waveForm = getWaveForm(waveFormIndx);

        const oscillator = context.createOscillator();
        oscillator.type = waveForm;
        oscillator.frequency.value = notesArray[i] * Math.pow(2, fact);

        const gainNode = context.createGain();
        gainNode.gain.value = gainValue;
        
        // generate sound
        oscillator.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(context.destination);

        oscillator.start(0);
        
        const duration = getRandomInt(1, 2);

        gainNode.gain.linearRampToValueAtTime(0.0001, context.currentTime + duration);
        oscillator.stop(context.currentTime + duration);
    }

    this.playSinNote = function(note) {
        const i = note;

        const fact = getRandomInt(-2, 5);
        
        let waveForm = getWaveForm(1);        

        const oscillator = context.createOscillator();
        oscillator.type = waveForm;
        oscillator.frequency.value = notesArray[i] * Math.pow(2, fact);

        const gainNode = context.createGain();
        gainNode.gain.value = .5;

        // generate sound
        oscillator.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(context.destination);

        oscillator.start(0);

        const duration = getRandomInt(1, 2);

        gainNode.gain.linearRampToValueAtTime(0.0001, context.currentTime + duration);
        oscillator.stop(context.currentTime + duration);
    }

    // return the current frequency data
    this.getByteFrequencyData = function() {
        if(!analyser) {
            // return an array of 0s
            var array = [fftSize/2];
            for(var i=0; i<array.length; i++)
                array[i] = 0;
            return array;
        }

        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        return array;
    }

    // events
    eventBus.subscribe(tuneMonolithClick, this.playSinNote);

    // maps a key to a waveform
    function getWaveForm(key) {
        switch(key) {
            case 1: return "sine";
            case 2: return "triangle";
            case 3: return "square";
            case 4: return "sawtooth";
            default: console.error(key +" is not a valid waveform");
        }
    }

    // returns an array of frequency values
    function getNotes() {
        var notes = new Array();

        notes.push(131);
        notes.push(139);
        notes.push(147);
        notes.push(156);
        notes.push(165);
        notes.push(175);
        notes.push(185);
        notes.push(196);
        notes.push(208);
        notes.push(220);
        notes.push(233);
        notes.push(247);

        notes.push(262);
        notes.push(277);
        notes.push(294);
        notes.push(311);
        notes.push(330);
        notes.push(349);
        notes.push(370);
        notes.push(392);
        notes.push(415);
        notes.push(440);
        notes.push(466);
        notes.push(494);

        return notes;
    }
}