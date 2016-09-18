function setPressStyle(target) {
    target.classList.add("pressed")
}

function releasePressStyle(target) {
    setTimeout(function() {
            target.classList.remove("pressed")
        }, 100)
}

function activatePanel(id) {
    document.getElementById(id).classList.remove("inactive")
    document.getElementById(id).classList.add("active")
}

function inactivatePanel(id) {
    document.getElementById(id).classList.remove("active")
    document.getElementById(id).classList.add("inactive")
}

var previewRunning = false;
var imgData;
var context;
function getImage(ALVideoDevice, subscriberId) {
    ALVideoDevice.getImageRemote(subscriberId).then(function (image) {
        if(image) {
            var imageWidth = image[0];
            var imageHeight = image[1];
            var imageBuf = image[6];
            console.log("Get image: " + imageWidth + ", " + imageHeight);

            if (!context) {
                context = document.getElementById("canvas").getContext("2d");
            }
            if (!imgData || imageWidth != imgData.width || imageHeight != imgData.height) {
                imgData = context.createImageData(imageWidth, imageHeight);
            }
            var data = imgData.data;

            for (var i = 0, len = imageHeight * imageWidth; i < len; i++) {
                var v = imageBuf[i];
                data[i * 4 + 0] = v;
                data[i * 4 + 1] = v;
                data[i * 4 + 2] = v;
                data[i * 4 + 3] = 255;
            }

            context.putImageData(imgData, 0, 0);
        }
        
        if(previewRunning) {
            setTimeout(function() { getImage(ALVideoDevice, subscriberId) }, 100)
        }
    })
}

function startSession() {
    QiSession(
        function(session) {
            session.service("ALVideoDevice").then(function (ALVideoDevice) {
                session.service("ALMemory").then(function (ALMemory) {
                    var currentImage = null
                    
                    document.getElementById("yes").addEventListener("touchstart", function(e) {
                            setPressStyle(e.target)
                        });
                    document.getElementById("yes").addEventListener("touchend", function(e) {
                            releasePressStyle(e.target)
                            ALMemory.raiseEvent("ProgrammingPepperSample/YesPressed", 1).then(function () {
                                console.log("Sent event")
                            })
                        });
                    document.getElementById("no").addEventListener("touchstart", function(e) {
                            setPressStyle(e.target)
                        });
                    document.getElementById("no").addEventListener("touchend", function(e) {
                            releasePressStyle(e.target)
                            ALMemory.raiseEvent("ProgrammingPepperSample/NoPressed", 1).then(function () {
                                console.log("Sent event")
                            })
                        });
                    document.getElementById("abort").addEventListener("touchstart", function(e) {
                            setPressStyle(e.target)
                        });
                    document.getElementById("abort").addEventListener("touchend", function(e) {
                            releasePressStyle(e.target)
                            ALMemory.raiseEvent("ProgrammingPepperSample/AbortPressed", 1).then(function () {
                                console.log("Sent event")
                            })
                        });
                    ALMemory.subscriber("ProgrammingPepperSample/ChoiceMode").then(function(subscriber) {
                            subscriber.signal.connect(function(mode) {
                                    if(mode == "active") {
                                        activatePanel("choice")
                                        activatePanel("common")
                                    }else{
                                        inactivatePanel("choice")
                                        inactivatePanel("common")
                                    }
                                })
                        });
                    ALMemory.subscriber("ProgrammingPepperSample/PreviewMode").then(function(subscriber) {
                            subscriber.signal.connect(function(subscriberId) {
                                if(subscriberId.length > 0) {
                                    console.log("Subscribing...: " + subscriberId)
                                    previewRunning = true
                                    activatePanel("camera")
                                    activatePanel("common")
                                    getImage(ALVideoDevice, subscriberId)
                                }else{
                                    previewRunning = false
                                    inactivatePanel("camera")
                                    inactivatePanel("common")
                                }
                            })
                        });
                    ALMemory.subscriber("ProgrammingPepperSample/GreetingMode").then(function(subscriber) {
                            subscriber.signal.connect(function(mode) {
                                    if(mode == "active") {
                                        document.getElementById("greetingloading").style.visibility = "visible"
                                        activatePanel("greeting")
                                    }else{
                                        inactivatePanel("greeting")
                                        if(currentImage) {
                                            document.getElementById("greetingimages").removeChild(currentImage)
                                            currentImage = null;
                                        }
                                    }
                                })
                        });
                    ALMemory.subscriber("ProgrammingPepperSample/GreetingImage").then(function(subscriber) {
                            subscriber.signal.connect(function(url) {
                                    var img = new Image()
                                    img.style.visibility = "hidden"
                                    img.classList.add("greetingimage")
                                    img.src = url
                                    img.addEventListener("load", function () {
                                            document.getElementById("greetingloading").style.visibility = "hidden"
                                            img.style.visibility = "visible"
                                            ALMemory.raiseEvent("ProgrammingPepperSample/GreetingImageLoaded", url)
                                        })
                                    document.getElementById("greetingimages").appendChild(img);
                                    currentImage = img;
                                })
                        });
                        
                    ALMemory.raiseEvent("ProgrammingPepperSample/TabletReady", 1).then(function() {
                            console.log("Sent event")
                        });
                });
            });
        }, function() {
            console.log("disconnected")
        }
    );
}
