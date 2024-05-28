const video = document.getElementById("video")

const openCamera = async () => {
    let stream = null
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        video.srcObject = stream
    } catch (err) {
        console.log(err);
        alert("You don't have connected to any webcam!")
    }
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("models"),
    faceapi.nets.faceExpressionNet.loadFromUri("models")
]).then(openCamera)

video.addEventListener("play", () => {
    
    const canvas = faceapi.createCanvasFromMedia(video)

    const container = document.getElementById("container")

    container.append(canvas)

    const dim = { width: video.clientWidth, height: video.clientHeight }

    faceapi.matchDimensions(canvas, dim)

    setInterval(async () => {
        
        const faces = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resized = faceapi.resizeResults(faces, dim)
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)

        faceapi.draw.drawDetections(canvas, resized)
        faceapi.draw.drawFaceLandmarks(canvas, resized)
        faceapi.draw.drawFaceExpressions(canvas, resized)
        
    }, 10);

})